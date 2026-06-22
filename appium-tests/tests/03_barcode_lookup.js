/**
 * TEST 03 — Barcode Lookup
 */
module.exports = async function runTests(driver) {
  const results = [];
  const category = 'Barcode Lookup';

  const push = (name, pass, dur, info) => {
    results.push({ name, status: pass ? 'PASS' : 'FAIL', duration: dur, category, error: info, timestamp: Date.now() });
  };

  // T1 — Lookup valid Indian barcode (Parle-G Biscuits)
  let t0 = Date.now();
  try {
    const input = await driver.$('//android.widget.EditText');
    await input.click();
    await input.setValue('8901719100018');
    
    const searchBtn = await driver.$('~Search');
    await searchBtn.click();
    
    // Wait for the ResultCard to appear with product details
    const nameEl = await driver.$('//android.widget.TextView[@text="Parle-G Biscuits"]');
    await nameEl.waitForExist({ timeout: 5000 });
    const isShown = await nameEl.isDisplayed();
    
    push('Search Barcode "8901719100018" Shows Parle-G', isShown, Date.now() - t0, isShown ? 'Parle-G Biscuits loaded' : 'Parle-G Biscuits not found');
  } catch (e) {
    push('Search Barcode "8901719100018" Shows Parle-G', false, Date.now() - t0, e.message);
  }

  // T2 — Verify product brand
  t0 = Date.now();
  try {
    const brandEl = await driver.$('//android.widget.TextView[@text="Parle"]');
    const isShown = await brandEl.isDisplayed();
    push('Correct Brand Name Displayed (Parle)', isShown, Date.now() - t0, isShown ? 'Brand found' : 'Brand missing or wrong');
  } catch (e) {
    push('Correct Brand Name Displayed (Parle)', false, Date.now() - t0, e.message);
  }

  // T3 — Verify calories display
  t0 = Date.now();
  try {
    const kcalValue = await driver.$('//android.widget.TextView[@text="450"]');
    const isShown = await kcalValue.isDisplayed();
    push('Correct Calories Displayed (450 kcal)', isShown, Date.now() - t0, isShown ? '450 kcal matches' : 'Calories not found');
  } catch (e) {
    push('Correct Calories Displayed (450 kcal)', false, Date.now() - t0, e.message);
  }

  // T4 — Close lookup result
  t0 = Date.now();
  try {
    const closeBtn = await driver.$('~Close');
    await closeBtn.click();
    
    const nameEl = await driver.$('//android.widget.TextView[@text="Parle-G Biscuits"]');
    const stillExists = await nameEl.isExisting();
    push('Close Button Dismisses Result Card', !stillExists, Date.now() - t0, !stillExists ? 'Result dismissed' : 'Result card still visible');
  } catch (e) {
    push('Close Button Dismisses Result Card', false, Date.now() - t0, e.message);
  }

  return results;
};
