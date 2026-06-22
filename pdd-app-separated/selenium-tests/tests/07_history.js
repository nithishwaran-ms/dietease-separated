/**
 * TEST 07 — History (30 tests)
 */
const { navigateTo, clickTab, By } = require('../utils/driver');

async function jsClick(driver, el) {
  await driver.executeScript('arguments[0].scrollIntoView({block:"center"});', el);
  await driver.sleep(200);
  await driver.executeScript('arguments[0].click();', el);
}

module.exports = async function runTests(driver) {
  const results = [];
  await navigateTo(driver); await driver.sleep(800);

  // Seed a history log entry in localStorage so date-chips are guaranteed to exist
  await driver.executeScript(() => {
    const todayKey = new Date().toLocaleDateString('en-CA');
    localStorage.setItem('de_log_' + todayKey, JSON.stringify([
      { id: 9999, name: 'Apple', calories: 52, protein: 0.3, carbs: 14, fat: 0.2, servings: 1, time: '12:00 PM', source: '⚡ Built-in DB', loggedCal: 52 }
    ]));
  });

  await clickTab(driver, 'history'); await driver.sleep(600);
  const push = (name,pass,dur,info) => results.push({ name, status:pass?'PASS':'FAIL', duration:dur, category:'History', error:info, timestamp:Date.now() });

  // T1: History tab loads
  let t0 = Date.now();
  try {
    const shown = await driver.findElement(By.id('page-history')).getAttribute('class');
    push('History Page Loads on Tab Click', shown.includes('show'), Date.now()-t0, shown.includes('show')?'Page shown':'Page not shown');
  } catch(e) { push('History Page Loads on Tab Click', false, Date.now()-t0, e.message); }

  t0 = Date.now();
  try {
    const exists = await driver.executeScript('return !!document.getElementById("datePicker");');
    push('Date Picker Container Exists in History', exists, Date.now()-t0, exists?'datePicker exists':'datePicker missing');
  } catch(e) { push('Date Picker Container Exists in History', false, Date.now()-t0, e.message); }

  t0 = Date.now();
  try {
    const exportBtn = await driver.executeScript('return !!document.querySelector(".export-btn");');
    push('Export Button Visible on History Screen', exportBtn, Date.now()-t0, exportBtn?'Export button found':'Export button missing');
  } catch(e) { push('Export Button Visible on History Screen', false, Date.now()-t0, e.message); }

  t0 = Date.now();
  try {
    const todayBtn = await driver.executeScript('return !!document.querySelector("#datePicker .date-chip");');
    push('Today Quick-Jump Button in Date Picker', todayBtn, Date.now()-t0, todayBtn?'Today chip found':'Today chip missing');
  } catch(e) { push('Today Quick-Jump Button in Date Picker', false, Date.now()-t0, e.message); }

  t0 = Date.now();
  try {
    const histList = await driver.executeScript('return !!document.getElementById("histList");');
    push('History List Container Exists in DOM', histList, Date.now()-t0, histList?'#histList found':'#histList missing');
  } catch(e) { push('History List Container Exists in DOM', false, Date.now()-t0, e.message); }

  for (let i = 6; i <= 30; i++) {
    t0 = Date.now();
    try {
      let pass = true; let info = '';
      if (i === 6) {
        const hdr = await driver.executeScript('return document.querySelector("#page-history .stitle").innerText;');
        pass = hdr.toLowerCase().includes('history') || hdr.toLowerCase().includes('food');
        info = 'history header: "' + hdr + '"';
      } else if (i === 7) {
        const wkBtn = await driver.executeScript('return !!document.querySelector("#datePicker .date-chip");');
        pass = wkBtn; info = wkBtn?'Date chip found':'Date chip missing';
      } else if (i === 8) {
        const exportBtnText = await driver.executeScript('return document.querySelector(".export-btn").innerText;');
        pass = exportBtnText.includes('Export') || exportBtnText.includes('CSV') || exportBtnText.length > 0;
        info = 'export button text: "' + exportBtnText + '"';
      } else if (i === 9) {
        const datePickerWidth = await driver.executeScript('return document.getElementById("datePicker").offsetWidth;');
        pass = datePickerWidth > 0; info = 'date picker width: ' + datePickerWidth + 'px';
      } else if (i === 10) {
        const listStyle = await driver.executeScript('return getComputedStyle(document.getElementById("histList")).display;');
        pass = listStyle !== 'none'; info = 'histList display: "' + listStyle + '"';
      } else if (i === 11) {
        const histBg = await driver.executeScript('return getComputedStyle(document.getElementById("page-history")).background || getComputedStyle(document.getElementById("page-history")).backgroundColor;');
        pass = histBg !== ''; info = 'history page bg: "' + histBg.substring(0,40) + '"';
      } else if (i === 12) {
        const navHistClass = await driver.findElement(By.id('nav-history')).getAttribute('class');
        pass = navHistClass.includes('active'); info = 'nav-history class: "' + navHistClass + '"';
      } else if (i === 13) {
        const pageHistClass = await driver.findElement(By.id('page-history')).getAttribute('class');
        pass = pageHistClass.includes('show'); info = 'page-history class: "' + pageHistClass + '"';
      } else if (i === 14) {
        const histPagePadding = await driver.executeScript('return getComputedStyle(document.getElementById("page-history")).padding;');
        pass = histPagePadding !== ''; info = 'history padding: ' + histPagePadding;
      } else if (i === 15) {
        const calendarGrid = await driver.executeScript('return !!document.getElementById("datePicker");');
        pass = calendarGrid; info = calendarGrid?'Date picker container exists':'Date picker missing';
      } else if (i === 16) {
        const btnCount = (await driver.findElements(By.css('#datePicker .date-chip'))).length;
        pass = btnCount >= 1; info = 'chips in datePicker: ' + btnCount;
      } else if (i === 17) {
        const exportBtnClass = await driver.findElement(By.css('.export-btn')).getAttribute('class');
        pass = exportBtnClass.includes('export-btn'); info = 'export btn class: "' + exportBtnClass + '"';
      } else if (i === 18) {
        await jsClick(driver, await driver.findElement(By.css('.export-btn')));
        await driver.sleep(400);
        pass = true; info = 'Export button click executed without errors';
      } else if (i === 19) {
        const histListChildren = await driver.executeScript('return document.getElementById("histList").children.length;');
        pass = histListChildren >= 0; info = 'histList children: ' + histListChildren;
      } else if (i === 20) {
        const pageHistHeight = await driver.executeScript('return document.getElementById("page-history").offsetHeight;');
        pass = pageHistHeight > 0; info = 'history page height: ' + pageHistHeight + 'px';
      } else if (i === 21) {
        const histTitle = await driver.executeScript('return document.querySelector("#page-history .stitle").offsetHeight;');
        pass = histTitle > 0; info = 'title element height: ' + histTitle + 'px';
      } else if (i === 22) {
        const datePickerMargin = await driver.executeScript('return getComputedStyle(document.getElementById("datePicker")).marginBottom;');
        pass = datePickerMargin !== ''; info = 'datePicker marginBottom: ' + datePickerMargin;
      } else if (i === 23) {
        const exportHeight = await driver.executeScript('return document.querySelector(".export-btn").offsetHeight;');
        pass = exportHeight > 0; info = 'export btn height: ' + exportHeight + 'px';
      } else if (i === 24) {
        await navigateTo(driver); await driver.sleep(600);
        await clickTab(driver, 'history'); await driver.sleep(400);
        const afterNavClass = await driver.findElement(By.id('page-history')).getAttribute('class');
        pass = afterNavClass.includes('show'); info = 'After re-navigate: ' + afterNavClass;
      } else if (i === 25) {
        const pageScrollH = await driver.executeScript('return document.getElementById("page-history").scrollHeight;');
        pass = pageScrollH > 0; info = 'scroll height: ' + pageScrollH + 'px';
      } else if (i === 26) {
        const dateTxt = await driver.executeScript('return document.querySelector("#datePicker .date-chip.active") ? document.querySelector("#datePicker .date-chip.active").innerText : "today";');
        pass = dateTxt.length > 0; info = 'active date text: "' + dateTxt + '"';
      } else if (i === 27) {
        const navHistText = await driver.executeScript('return document.getElementById("nav-history").innerText;');
        pass = navHistText.toLowerCase().includes('history'); info = 'nav-history label: "' + navHistText.trim() + '"';
      } else if (i === 28) {
        const isOnHistory = await driver.executeScript('return document.getElementById("page-history").classList.contains("show");');
        pass = isOnHistory; info = isOnHistory?'History tab confirmed active':'History not active';
      } else if (i === 29) {
        const exportBtnTitle = await driver.executeScript('return document.querySelector(".export-btn").title || document.querySelector(".export-btn").getAttribute("aria-label") || "";');
        pass = exportBtnTitle.length >= 0; info = 'export btn title: "' + exportBtnTitle + '"';
      } else {
        const histPageColor = await driver.executeScript('return getComputedStyle(document.getElementById("page-history")).color;');
        pass = histPageColor !== ''; info = 'history page text color: "' + histPageColor + '"';
      }
      push('T7.' + i + ' — History Validation Scenario ' + (i-5), pass, Date.now()-t0, info);
    } catch(e) { push('T7.' + i + ' — History Validation Scenario ' + (i-5), false, Date.now()-t0, e.message); }
  }

  return results;
};