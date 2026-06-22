/**
 * TEST 07 — History
 */
const { clickTab } = require('../utils/driver');

module.exports = async function runTests(driver) {
  const results = [];
  const category = 'History';

  const push = (name, pass, dur, info) => {
    results.push({ name, status: pass ? 'PASS' : 'FAIL', duration: dur, category, error: info, timestamp: Date.now() });
  };

  // T1 — Log a food item (Parle-G)
  let t0 = Date.now();
  try {
    await clickTab(driver, 'scan');
    
    const input = await driver.$('//android.widget.EditText');
    await input.click();
    await input.setValue('8901719100018');
    
    const searchBtn = await driver.$('~Search');
    await searchBtn.click();
    
    // Wait for the ResultCard
    const nameEl = await driver.$('//android.widget.TextView[@text="Parle-G Biscuits"]');
    await nameEl.waitForExist({ timeout: 5000 });
    
    // Log food
    const logBtn = await driver.$('//android.widget.Button[contains(@text, "Log This Food") or contains(@text, "Log")]');
    await logBtn.click();
    await driver.pause(1000);
    
    push('Prepare Logged Food For History Verification', true, Date.now() - t0, 'Parle-G biscuits logged successfully');
  } catch (e) {
    push('Prepare Logged Food For History Verification', false, Date.now() - t0, e.message);
  }

  // T2 — Navigate to History and check sidebar entry "Today"
  t0 = Date.now();
  try {
    await clickTab(driver, 'history');
    
    const todaySidebarEl = await driver.$('//android.widget.TextView[@text="Today"]');
    const exists = await todaySidebarEl.isDisplayed();
    
    push('History Sidebar Shows "Today" Option', exists, Date.now() - t0, exists ? '"Today" sidebar button found' : '"Today" button missing');
  } catch (e) {
    push('History Sidebar Shows "Today" Option', false, Date.now() - t0, e.message);
  }

  // T3 — Select "Today" and verify item list details
  t0 = Date.now();
  try {
    const todaySidebarEl = await driver.$('//android.widget.TextView[@text="Today"]');
    await todaySidebarEl.click();
    await driver.pause(500);
    
    // Check item in list
    const itemEl = await driver.$('//android.widget.TextView[@text="Parle-G Biscuits"]');
    const isShown = await itemEl.isDisplayed();
    push('History Day Log Lists "Parle-G Biscuits"', isShown, Date.now() - t0, isShown ? 'Item visible in history details' : 'Item missing from history details');
  } catch (e) {
    push('History Day Log Lists "Parle-G Biscuits"', false, Date.now() - t0, e.message);
  }

  // T4 — Verify history day calorie summary is correct
  t0 = Date.now();
  try {
    const calSummaryEl = await driver.$('//android.widget.TextView[@text="450"]');
    const isShown = await calSummaryEl.isDisplayed();
    push('History Day Summary Displays Total Calories (450 kcal)', isShown, Date.now() - t0, isShown ? 'Total 450 kcal summary matches' : 'Calorie summary mismatch');
  } catch (e) {
    push('History Day Summary Displays Total Calories (450 kcal)', false, Date.now() - t0, e.message);
  }

  return results;
};
