/**
 * TEST 12 — Database Integrity (161 tests)
 * Reads all 23 products from dietease-data.json and verifies their lookup details.
 */
const fs = require('fs');
const path = require('path');
const { navigateTo, By } = require('../utils/driver');

async function jsClick(driver, el) {
  await driver.executeScript('arguments[0].scrollIntoView({block:"center"});', el);
  await driver.sleep(100);
  await driver.executeScript('arguments[0].click();', el);
}

async function lookup(driver, code) {
  const input = await driver.findElement(By.id('manualInput'));
  await input.clear(); await input.sendKeys(code);
  await jsClick(driver, await driver.findElement(By.css('.mrow button')));
}

module.exports = async function runTests(driver) {
  const results = [];
  
  // Resolve paths dynamically relative to this file
  const dbPath = path.join(__dirname, '../../backend/dietease-data.json');
  const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  const products = Object.values(db.products);

  // Load the app page
  await navigateTo(driver);
  await driver.sleep(800);

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
      await lookup(driver, barcode);
      
      // 2. Wait until result card shows the correct product name
      await driver.wait(async () => {
        const text = await driver.findElement(By.id('rName')).getText();
        return text === name;
      }, 3000);

      const dur = Date.now() - t0;

      // Assert Name
      push(`Barcode [${barcode}] Lookup Name: ${name}`, true, dur, `Found: ${name}`);

      // Assert Brand
      const actBrand = await driver.findElement(By.id('rBrand')).getText();
      const passBrand = actBrand === (brand || '—');
      push(`Barcode [${barcode}] Brand: ${brand || '—'}`, passBrand, 0, passBrand ? `Matched` : `Got: ${actBrand}`);

      // Assert Source
      const actSrc = await driver.findElement(By.id('rSrc')).getText();
      const passSrc = actSrc === (source || '—');
      push(`Barcode [${barcode}] Source: ${source || '—'}`, passSrc, 0, passSrc ? `Matched` : `Got: ${actSrc}`);

      // Assert Calories
      const actCal = await driver.findElement(By.id('rCal')).getText();
      const passCal = parseInt(actCal) === calories;
      push(`Barcode [${barcode}] Calories: ${calories}`, passCal, 0, passCal ? `Matched` : `Got: ${actCal}`);

      // Assert Protein
      const actProt = await driver.findElement(By.id('rProt')).getText();
      const expProt = protein.toFixed(1) + 'g';
      const passProt = actProt === expProt;
      push(`Barcode [${barcode}] Protein: ${expProt}`, passProt, 0, passProt ? `Matched` : `Got: ${actProt}`);

      // Assert Carbs
      const actCarb = await driver.findElement(By.id('rCarb')).getText();
      const expCarb = carbs.toFixed(1) + 'g';
      const passCarb = actCarb === expCarb;
      push(`Barcode [${barcode}] Carbs: ${expCarb}`, passCarb, 0, passCarb ? `Matched` : `Got: ${actCarb}`);

      // Assert Fat
      const actFat = await driver.findElement(By.id('rFat')).getText();
      const expFat = fat.toFixed(1) + 'g';
      const passFat = actFat === expFat;
      push(`Barcode [${barcode}] Fat: ${expFat}`, passFat, 0, passFat ? `Matched` : `Got: ${actFat}`);

    } catch (e) {
      const dur = Date.now() - t0;
      push(`Barcode [${barcode}] Lookup Success`, false, dur, e.message);
      // Dummy failure logs for other fields to keep output length consistent if one lookup fails
      push(`Barcode [${barcode}] Brand Check`, false, 0, 'Lookup failed');
      push(`Barcode [${barcode}] Source Check`, false, 0, 'Lookup failed');
      push(`Barcode [${barcode}] Calories Check`, false, 0, 'Lookup failed');
      push(`Barcode [${barcode}] Protein Check`, false, 0, 'Lookup failed');
      push(`Barcode [${barcode}] Carbs Check`, false, 0, 'Lookup failed');
      push(`Barcode [${barcode}] Fat Check`, false, 0, 'Lookup failed');
    }
  }

  return results;
};
