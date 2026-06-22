/**
 * TEST 04 — Food Logging
 */
const { clickTab } = require('../utils/driver');

module.exports = async function runTests(driver) {
  const results = [];
  const category = 'Food Logging';

  const push = (name, pass, dur, info) => {
    results.push({ name, status: pass ? 'PASS' : 'FAIL', duration: dur, category, error: info, timestamp: Date.now() });
  };

  // T1 — Log a food item with modified servings
  let t0 = Date.now();
  try {
    // Navigate to Scan
    await clickTab(driver, 'scan');
    
    // Lookup Amul Butter (8901088002230)
    const input = await driver.$('//android.widget.EditText');
    await input.click();
    await input.setValue('8901088002230');
    
    const searchBtn = await driver.$('~Search');
    await searchBtn.click();
    
    // Wait for the ResultCard
    const nameEl = await driver.$('//android.widget.TextView[@text="Amul Butter"]');
    await nameEl.waitForExist({ timeout: 5000 });
    
    // Click serving increment "+"
    const plusBtn = await driver.$('//android.widget.Button[@text="+"]');
    await plusBtn.click();
    await driver.pause(500);
    
    // Verify calories updated to 1080 (720 * 1.5)
    const kcalValue = await driver.$('//android.widget.TextView[@text="1080"]');
    const kcalVisible = await kcalValue.isDisplayed();
    
    // Click Log This Food
    const logBtn = await driver.$('//android.widget.Button[contains(@text, "Log This Food") or contains(@text, "Log")]');
    await logBtn.click();
    await driver.pause(1000);
    
    push('Modified Servings Update Calorie Count (1.5x -> 1080)', kcalVisible, Date.now() - t0, kcalVisible ? 'Calories updated to 1080' : 'Calories not updated correctly');
  } catch (e) {
    push('Modified Servings Update Calorie Count (1.5x -> 1080)', false, Date.now() - t0, e.message);
  }

  // T2 — Verify logged food visible on Today Screen
  t0 = Date.now();
  try {
    // Navigate to Today
    await clickTab(driver, 'today');
    
    // Check if Amul Butter is listed in the log list
    const itemEl = await driver.$('//android.widget.TextView[@text="Amul Butter"]');
    const isShown = await itemEl.isDisplayed();
    push('Logged Food "Amul Butter" Appears on Today Screen', isShown, Date.now() - t0, isShown ? 'Item visible in list' : 'Item missing from list');
  } catch (e) {
    push('Logged Food "Amul Butter" Appears on Today Screen', false, Date.now() - t0, e.message);
  }

  // T3 — Verify total calories label on Today Screen
  t0 = Date.now();
  try {
    // The Today Screen should display 1080 calories in the total sum
    const totalCalEl = await driver.$('//android.widget.TextView[@text="1080"]');
    const totalCalShown = await totalCalEl.isDisplayed();
    push('Today Total Calorie Sum Updated (1080 kcal)', totalCalShown, Date.now() - t0, totalCalShown ? 'Total calorie count matched' : 'Total calorie count mismatch');
  } catch (e) {
    push('Today Total Calorie Sum Updated (1080 kcal)', false, Date.now() - t0, e.message);
  }

  return results;
};
