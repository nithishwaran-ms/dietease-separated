/**
 * TEST 06 — Goal Setting
 */
const { clickTab } = require('../utils/driver');

module.exports = async function runTests(driver) {
  const results = [];
  const category = 'Goal Setting';

  const push = (name, pass, dur, info) => {
    results.push({ name, status: pass ? 'PASS' : 'FAIL', duration: dur, category, error: info, timestamp: Date.now() });
  };

  // T1 — Open goal dialog
  let t0 = Date.now();
  try {
    await clickTab(driver, 'today');
    
    const editBtn = await driver.$('~Edit goal');
    await editBtn.click();
    await driver.pause(500);
    
    const titleEl = await driver.$('//android.widget.TextView[@text="🎯 Daily Calorie Goal"]');
    const isShown = await titleEl.isDisplayed();
    push('Goal Setting Edit Button Opens Dialog', isShown, Date.now() - t0, isShown ? 'Dialog opened successfully' : 'Dialog not visible');
  } catch (e) {
    push('Goal Setting Edit Button Opens Dialog', false, Date.now() - t0, e.message);
  }

  // T2 — Enter and save new goal
  t0 = Date.now();
  try {
    const input = await driver.$('//android.widget.EditText');
    await input.click();
    await input.setValue('2500');
    
    const saveBtn = await driver.$('//android.widget.Button[@text="Save"]');
    await saveBtn.click();
    await driver.pause(1000);
    
    // Verify that the Today screen shows "/ 2500 kcal"
    const goalTextEl = await driver.$('//android.widget.TextView[contains(@text, "2500 kcal")]');
    const isUpdated = await goalTextEl.isDisplayed();
    push('Set Daily Calorie Goal to 2500 kcal', isUpdated, Date.now() - t0, isUpdated ? 'Calorie goal updated to 2500' : 'Calorie goal label not found');
  } catch (e) {
    push('Set Daily Calorie Goal to 2500 kcal', false, Date.now() - t0, e.message);
  }

  return results;
};
