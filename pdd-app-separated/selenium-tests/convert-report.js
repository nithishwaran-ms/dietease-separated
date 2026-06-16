const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

async function convertLatest() {
  const reportsDir = path.join(__dirname, 'reports');
  if (!fs.existsSync(reportsDir)) {
    console.error('Reports directory does not exist!');
    process.exit(1);
  }

  // Find latest .xlsx file
  const files = fs.readdirSync(reportsDir)
    .filter(f => f.startsWith('E2E_Test_Report_') && f.endsWith('.xlsx'))
    .map(f => ({ name: f, time: fs.statSync(path.join(reportsDir, f)).mtime.getTime() }))
    .sort((a, b) => b.time - a.time);

  if (files.length === 0) {
    console.error('No Excel reports found to convert!');
    process.exit(1);
  }

  const latestFile = path.join(reportsDir, files[0].name);
  console.log(`Reading Excel report: ${latestFile}`);

  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(latestFile);

  // Read Sheet 2: Summary
  const summarySheet = wb.getWorksheet('Summary');
  let total = 0, passed = 0, failed = 0, passRate = '0%', genDate = '', website = '';
  
  if (summarySheet) {
    // In excel-reporter.js:
    // Row 4: Generated | Date
    // Row 5: Website | URL
    // Row 6: Browser | Name
    // Row 7: Total Tests | Val
    // Row 8: Passed | Val
    // Row 9: Failed | Val
    // Row 10: Pass Rate | Val
    genDate = summarySheet.getRow(4).getCell(2).value || '';
    website = summarySheet.getRow(5).getCell(2).value || '';
    total = summarySheet.getRow(7).getCell(2).value || 0;
    passed = summarySheet.getRow(8).getCell(2).value || 0;
    failed = summarySheet.getRow(9).getCell(2).value || 0;
    passRate = summarySheet.getRow(10).getCell(2).value || '0%';
  }

  // Read Sheet 1: Test Results
  const resultsSheet = wb.getWorksheet('Test Results');
  const results = [];
  if (resultsSheet) {
    // Row 1 is header
    resultsSheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // skip header
      const sno = row.getCell(1).value;
      const module = row.getCell(2).value;
      const test = row.getCell(3).value;
      const status = row.getCell(4).value;
      const remark = row.getCell(5).value;
      results.push({ sno, module, test, status, remark });
    });
  }

  // Generate Premium HTML
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DietEase+ E2E Test Execution Report</title>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg-primary: #0b0f19;
            --bg-secondary: #161c2c;
            --text-primary: #f3f4f6;
            --text-secondary: #9ca3af;
            --accent-color: #3b82f6;
            --success-color: #10b981;
            --danger-color: #ef4444;
            --border-color: #1e293b;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: 'Plus Jakarta Sans', sans-serif;
            background-color: var(--bg-primary);
            color: var(--text-primary);
            line-height: 1.6;
            padding: 2rem 1rem;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
        }

        header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
            border-bottom: 1px solid var(--border-color);
            padding-bottom: 1.5rem;
        }

        .title-area h1 {
            font-size: 2rem;
            font-weight: 800;
            background: linear-gradient(135deg, #60a5fa, #3b82f6);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 0.25rem;
        }

        .title-area p {
            color: var(--text-secondary);
            font-size: 0.95rem;
        }

        .meta-tag {
            background-color: var(--bg-secondary);
            border: 1px solid var(--border-color);
            padding: 0.5rem 1rem;
            border-radius: 9999px;
            font-size: 0.85rem;
            font-weight: 600;
        }

        /* Dashboard Grid */
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 1.5rem;
            margin-bottom: 3rem;
        }

        .stat-card {
            background-color: var(--bg-secondary);
            border: 1px solid var(--border-color);
            border-radius: 1rem;
            padding: 1.5rem;
            position: relative;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        }

        .stat-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 4px;
            height: 100%;
        }

        .stat-card.total::before { background-color: var(--accent-color); }
        .stat-card.passed::before { background-color: var(--success-color); }
        .stat-card.failed::before { background-color: var(--danger-color); }
        .stat-card.rate::before { background: linear-gradient(to bottom, var(--success-color), var(--accent-color)); }

        .stat-label {
            font-size: 0.85rem;
            font-weight: 600;
            color: var(--text-secondary);
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 0.5rem;
        }

        .stat-value {
            font-size: 2.25rem;
            font-weight: 800;
        }

        /* Controls Section */
        .controls {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
            gap: 1rem;
            flex-wrap: wrap;
        }

        .search-box {
            background-color: var(--bg-secondary);
            border: 1px solid var(--border-color);
            color: var(--text-primary);
            padding: 0.75rem 1.25rem;
            border-radius: 0.75rem;
            width: 100%;
            max-width: 400px;
            outline: none;
            font-family: inherit;
            transition: border-color 0.2s;
        }

        .search-box:focus {
            border-color: var(--accent-color);
        }

        .filter-buttons {
            display: flex;
            gap: 0.5rem;
        }

        .btn {
            background-color: var(--bg-secondary);
            border: 1px solid var(--border-color);
            color: var(--text-secondary);
            padding: 0.6rem 1.2rem;
            border-radius: 0.5rem;
            font-weight: 600;
            font-size: 0.85rem;
            cursor: pointer;
            transition: all 0.2s;
        }

        .btn:hover, .btn.active {
            background-color: var(--accent-color);
            color: #ffffff;
            border-color: var(--accent-color);
        }

        /* Test Cases Table */
        .table-container {
            background-color: var(--bg-secondary);
            border: 1px solid var(--border-color);
            border-radius: 1rem;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        }

        table {
            width: 100%;
            border-collapse: collapse;
            text-align: left;
        }

        th {
            background-color: rgba(255, 255, 255, 0.02);
            color: var(--text-secondary);
            font-weight: 700;
            text-transform: uppercase;
            font-size: 0.75rem;
            letter-spacing: 0.05em;
            padding: 1rem 1.5rem;
            border-bottom: 1px solid var(--border-color);
        }

        td {
            padding: 1.2rem 1.5rem;
            border-bottom: 1px solid var(--border-color);
            font-size: 0.95rem;
            vertical-align: top;
        }

        tr:last-child td {
            border-bottom: none;
        }

        tr {
            transition: background-color 0.15s;
        }

        tr:hover {
            background-color: rgba(255, 255, 255, 0.01);
        }

        .badge {
            display: inline-block;
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.025em;
        }

        .badge-pass {
            background-color: rgba(16, 185, 129, 0.1);
            color: var(--success-color);
            border: 1px solid rgba(16, 185, 129, 0.2);
        }

        .badge-fail {
            background-color: rgba(239, 68, 68, 0.1);
            color: var(--danger-color);
            border: 1px solid rgba(239, 68, 68, 0.2);
        }

        .error-text {
            font-family: monospace;
            background-color: rgba(0, 0, 0, 0.15);
            padding: 0.5rem;
            border-radius: 0.375rem;
            font-size: 0.85rem;
            white-space: pre-wrap;
            border: 1px solid rgba(255, 255, 255, 0.02);
            margin-top: 0.25rem;
        }

        .module-cell {
            font-weight: 600;
            color: #93c5fd;
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <div class="title-area">
                <h1>DietEase+ E2E Test Execution Report</h1>
                <p>Generated on ${genDate} for <a href="${website}" target="_blank" style="color: var(--accent-color); text-decoration: none;">${website}</a></p>
            </div>
            <div class="meta-tag">
                Automated Test Suite
            </div>
        </header>

        <div class="stats-grid">
            <div class="stat-card total">
                <div class="stat-label">Total Tests</div>
                <div class="stat-value">${total}</div>
            </div>
            <div class="stat-card passed">
                <div class="stat-label">Passed</div>
                <div class="stat-value">${passed}</div>
            </div>
            <div class="stat-card failed">
                <div class="stat-label">Failed</div>
                <div class="stat-value">${failed}</div>
            </div>
            <div class="stat-card rate">
                <div class="stat-label">Pass Rate</div>
                <div class="stat-value">${passRate}</div>
            </div>
        </div>

        <div class="controls">
            <input type="text" class="search-box" id="searchInput" placeholder="Search test cases or modules...">
            <div class="filter-buttons">
                <button class="btn active" onclick="filterResults('all')">All</button>
                <button class="btn" onclick="filterResults('PASS')">Passed</button>
                <button class="btn" onclick="filterResults('FAIL')">Failed</button>
            </div>
        </div>

        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th style="width: 80px;">S.No</th>
                        <th style="width: 220px;">Module</th>
                        <th>Test Case Description</th>
                        <th style="width: 140px;">Result</th>
                    </tr>
                </thead>
                <tbody id="resultsTable">
                    ${results.map(r => `
                    <tr class="test-row" data-status="${r.status}">
                        <td>${r.sno}</td>
                        <td class="module-cell">${r.module}</td>
                        <td>
                            <div><strong>${r.test}</strong></div>
                            ${r.remark && r.remark !== 'None — test passed successfully.' ? `<div class="error-text">${r.remark}</div>` : ''}
                        </td>
                        <td>
                            <span class="badge ${r.status === 'PASS' ? 'badge-pass' : 'badge-fail'}">${r.status}</span>
                        </td>
                    </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    </div>

    <script>
        const searchInput = document.getElementById('searchInput');
        const rows = document.querySelectorAll('.test-row');
        let currentFilter = 'all';

        searchInput.addEventListener('input', applyFilters);

        function filterResults(status) {
            document.querySelectorAll('.btn').forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');
            currentFilter = status;
            applyFilters();
        }

        function applyFilters() {
            const query = searchInput.value.toLowerCase();
            rows.forEach(row => {
                const status = row.getAttribute('data-status');
                const text = row.innerText.toLowerCase();
                const matchesSearch = text.includes(query);
                const matchesFilter = currentFilter === 'all' || status === currentFilter;

                if (matchesSearch && matchesFilter) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        }
    </script>
</body>
</html>`;

  const htmlFile = path.join(reportsDir, 'E2E_Test_Report.html');
  fs.writeFileSync(htmlFile, htmlContent, 'utf8');
  console.log(`HTML report generated: ${htmlFile}`);
}

convertLatest().catch(err => {
  console.error(err);
  process.exit(1);
});
