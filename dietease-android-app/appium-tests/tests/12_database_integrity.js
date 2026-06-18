/**
 * TEST 12 — Database Integrity (264 tests)
 * Reads all 33 products from dietease-data.json and verifies their lookup details in Android app.
 */
const fs = require('fs');
const path = require('path');
const { clickTab, findByText, findByTextContains } = require('../utils/driver');

async function lookupBarcode(driver, barcode) {
  await clickTab(driver, 'scan');
  const inp = await driver.$('android.widget.EditText');
  await inp.waitForExist({ timeout: 5000 });
  await inp.clearValue();
  await inp.setValue(barcode);
  const searchBtn = await driver.$('~Search');
  await searchBtn.waitForExist({ timeout: 5000 });
  await searchBtn.click();
  await driver.pause(3000);
}

module.exports = async function runTests(driver) {
  const results = [];
  
  // Resolve paths dynamically relative to this file
  const dbPath = path.join(__dirname, '../../../pdd-app-separated/backend/dietease-data.json');
  const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  const products = Object.values(db.products);

  const push = (name, pass, dur, info) => results.push({ 
    name, 
    status: pass ? 'PASS' : 'FAIL', 
    duration: dur, 
    category: 'Database Integrity', 
    error: info, 
    timestamp: Date.now() 
  });

  for (const prod of products) {
    const { barcode, name, brand, calories, protein, carbs, fat, source } = prod;
    let t0 = Date.now();

    try {
      // 1. Perform lookup
      await lookupBarcode(driver, barcode);
      
      // 2. Wait until result card shows the correct product name
      const nameEl = await findByText(driver, name);
      await nameEl.waitForExist({ timeout: 10000 });
      const passName = await nameEl.isDisplayed();
      const dur = Date.now() - t0;

      // Assert Name
      push(`Barcode [${barcode}] Lookup Name: ${name}`, passName, dur, passName ? `Found: ${name}` : `Not displayed`);

      // Assert Brand (if brand is specified)
      if (brand && brand.trim().length > 0) {
        const brandEl = await findByText(driver, brand);
        const passBrand = await brandEl.isExisting();
        push(`Barcode [${barcode}] Brand: ${brand}`, passBrand, 0, passBrand ? `Matched` : `Not found`);
      } else {
        push(`Barcode [${barcode}] Brand: [None]`, true, 0, `No brand check needed`);
      }

      // Assert Source
      const srcEl = await findByTextContains(driver, source.replace('⚡ ', ''));
      const passSrc = await srcEl.isExisting();
      push(`Barcode [${barcode}] Source: ${source}`, passSrc, 0, passSrc ? `Matched` : `Not found`);

      // Assert Calories
      const calEl = await findByTextContains(driver, String(calories));
      const passCal = await calEl.isExisting();
      push(`Barcode [${barcode}] Calories: ${calories}`, passCal, 0, passCal ? `Matched` : `Not found`);

      // Assert Protein
      const formattedProt = protein.toFixed(1) + 'g';
      const protEl = await findByTextContains(driver, formattedProt);
      const passProt = await protEl.isExisting();
      push(`Barcode [${barcode}] Protein: ${formattedProt}`, passProt, 0, passProt ? `Matched` : `Not found`);

      // Assert Carbs
      const formattedCarbs = carbs.toFixed(1) + 'g';
      const carbsEl = await findByTextContains(driver, formattedCarbs);
      const passCarbs = await carbsEl.isExisting();
      push(`Barcode [${barcode}] Carbs: ${formattedCarbs}`, passCarbs, 0, passCarbs ? `Matched` : `Not found`);

      // Assert Fat
      const formattedFat = fat.toFixed(1) + 'g';
      const fatEl = await findByTextContains(driver, formattedFat);
      const passFat = await fatEl.isExisting();
      push(`Barcode [${barcode}] Fat: ${formattedFat}`, passFat, 0, passFat ? `Matched` : `Not found`);

      // 3. Dismiss result card to reset screen state
      const closeBtn = await driver.$('~Close');
      if (await closeBtn.isExisting()) {
        await closeBtn.click();
        await driver.pause(1000);
      }

    } catch (e) {
      const dur = Date.now() - t0;
      push(`Barcode [${barcode}] Lookup Success`, false, dur, e.message);
      // Fail subchecks to keep test structure consistent
      push(`Barcode [${barcode}] Brand Check`, false, 0, 'Lookup failed');
      push(`Barcode [${barcode}] Source Check`, false, 0, 'Lookup failed');
      push(`Barcode [${barcode}] Calories Check`, false, 0, 'Lookup failed');
      push(`Barcode [${barcode}] Protein Check`, false, 0, 'Lookup failed');
      push(`Barcode [${barcode}] Carbs Check`, false, 0, 'Lookup failed');
      push(`Barcode [${barcode}] Fat Check`, false, 0, 'Lookup failed');

      // Attempt cleanup
      try {
        const closeBtn = await driver.$('~Close');
        if (await closeBtn.isExisting()) {
          await closeBtn.click();
          await driver.pause(1000);
        }
      } catch (_) {}
    }
  }

  return results;
};
