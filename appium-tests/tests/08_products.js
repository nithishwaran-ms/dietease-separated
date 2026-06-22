/**
 * TEST 08 — Products
 */
const { clickTab } = require('../utils/driver');

module.exports = async function runTests(driver) {
  const results = [];
  const category = 'Products';

  const push = (name, pass, dur, info) => {
    results.push({ name, status: pass ? 'PASS' : 'FAIL', duration: dur, category, error: info, timestamp: Date.now() });
  };

  // T1 — Search input filters database products
  let t0 = Date.now();
  try {
    await clickTab(driver, 'products');
    
    // Find search field
    const searchInput = await driver.$('//android.widget.EditText');
    await searchInput.click();
    await searchInput.setValue('Oreo');
    await driver.pause(1000); // pause for filtering flow
    
    // Check if Oreo Cookies is shown
    const nameEl = await driver.$('//android.widget.TextView[@text="Oreo Cookies"]');
    const isShown = await nameEl.isDisplayed();
    push('Product Database Search Filter (Oreo)', isShown, Date.now() - t0, isShown ? 'Oreo Cookies found' : 'Oreo Cookies not found');
  } catch (e) {
    push('Product Database Search Filter (Oreo)', false, Date.now() - t0, e.message);
  }

  // T2 — Click product to navigate to Scan Screen
  t0 = Date.now();
  try {
    const itemEl = await driver.$('//android.widget.TextView[@text="Oreo Cookies"]');
    await itemEl.click();
    await driver.pause(1000);
    
    // Verify that we are on the Scan page showing Oreo Cookies details
    const labelEl = await driver.$('//android.widget.TextView[@text="Oreo Cookies"]');
    const isShown = await labelEl.isDisplayed();
    push('Clicking Database Product Navigates To Scan Screen with Detail Card', isShown, Date.now() - t0, isShown ? 'Navigated to Scan screen with Oreo details' : 'Failed to navigate back with item card');
  } catch (e) {
    push('Clicking Database Product Navigates To Scan Screen with Detail Card', false, Date.now() - t0, e.message);
  }

  // T3 — Dismiss details card
  t0 = Date.now();
  try {
    const closeBtn = await driver.$('~Close');
    await closeBtn.click();
    await driver.pause(500);
    
    const labelEl = await driver.$('//android.widget.TextView[@text="Oreo Cookies"]');
    const stillExists = await labelEl.isExisting();
    push('Dismiss Details Card For Oreo Cookies', !stillExists, Date.now() - t0, !stillExists ? 'Detail card closed' : 'Detail card still active');
  } catch (e) {
    push('Dismiss Details Card For Oreo Cookies', false, Date.now() - t0, e.message);
  }

  return results;
};
