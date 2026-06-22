/**
 * TEST 09 — Manual Entry
 */
const { clickTab } = require('../utils/driver');

module.exports = async function runTests(driver) {
  const results = [];
  const category = 'Manual Entry';

  const push = (name, pass, dur, info) => {
    results.push({ name, status: pass ? 'PASS' : 'FAIL', duration: dur, category, error: info, timestamp: Date.now() });
  };

  // T1 — Lookup unknown barcode opens manual form
  let t0 = Date.now();
  try {
    await clickTab(driver, 'scan');
    
    // Type non-existing barcode
    const fieldsBefore = await driver.$$('//android.widget.EditText');
    const input = fieldsBefore[0];
    await input.click();
    await input.setValue('9999999999999');
    
    const searchBtn = await driver.$('~Search');
    await searchBtn.click();
    await driver.pause(2000); // Wait for API timeout & state change
    
    // Check if "Add Product Manually" header is shown
    const formHeader = await driver.$('//android.widget.TextView[@text="📝 Add Product Manually"]');
    const formHeaderShown = await formHeader.isDisplayed();
    
    push('Unknown Barcode Form Trigger (Add Product Manually)', formHeaderShown, Date.now() - t0, formHeaderShown ? 'Manual form displayed' : 'Form not displayed');
  } catch (e) {
    push('Unknown Barcode Form Trigger (Add Product Manually)', false, Date.now() - t0, e.message);
  }

  // T2 — Fill details and save
  t0 = Date.now();
  try {
    // Find all active EditTexts
    const fields = await driver.$$('//android.widget.EditText');
    
    // fields[0] is the barcode input field
    // fields[1] is Product Name *
    // fields[2] is Calories *
    // fields[3] is Protein
    // fields[4] is Carbs
    // fields[5] is Fat
    
    await fields[1].setValue('Homemade Roti');
    await fields[2].setValue('120');
    await fields[3].setValue('3.5');
    await fields[4].setValue('25.0');
    await fields[5].setValue('1.2');
    
    // Click "💾 Save & Log"
    const saveBtn = await driver.$('//android.widget.Button[contains(@text, "Save & Log") or contains(@text, "Save")]');
    await saveBtn.click();
    await driver.pause(1500);
    
    push('Fill and Save Manual Product Form (Homemade Roti, 120 kcal)', true, Date.now() - t0, 'Form filled and submitted successfully');
  } catch (e) {
    push('Fill and Save Manual Product Form (Homemade Roti, 120 kcal)', false, Date.now() - t0, e.message);
  }

  // T3 — Verify manual item listed on Today Screen
  t0 = Date.now();
  try {
    await clickTab(driver, 'today');
    
    const itemEl = await driver.$('//android.widget.TextView[@text="Homemade Roti"]');
    const isShown = await itemEl.isDisplayed();
    push('Manually Logged Food Appears in Today List', isShown, Date.now() - t0, isShown ? 'Homemade Roti listed' : 'Homemade Roti not found');
  } catch (e) {
    push('Manually Logged Food Appears in Today List', false, Date.now() - t0, e.message);
  }

  return results;
};
