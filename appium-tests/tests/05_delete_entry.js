/**
 * TEST 05 — Delete Entry
 */
const { clickTab } = require('../utils/driver');

module.exports = async function runTests(driver) {
  const results = [];
  const category = 'Delete Entry';

  const push = (name, pass, dur, info) => {
    results.push({ name, status: pass ? 'PASS' : 'FAIL', duration: dur, category, error: info, timestamp: Date.now() });
  };

  // T1 — Click delete on log entry
  let t0 = Date.now();
  try {
    await clickTab(driver, 'today');
    
    // Find the delete button
    const deleteBtn = await driver.$('~Delete');
    await deleteBtn.click();
    await driver.pause(1000);
    
    // Verify Amul Butter is no longer in the list
    const itemEl = await driver.$('//android.widget.TextView[@text="Amul Butter"]');
    const stillExists = await itemEl.isExisting();
    push('Delete Entry Removes Item from Today List', !stillExists, Date.now() - t0, !stillExists ? 'Item successfully removed' : 'Item still present in list');
  } catch (e) {
    push('Delete Entry Removes Item from Today List', false, Date.now() - t0, e.message);
  }

  // T2 — Verify total calories reset to 0
  t0 = Date.now();
  try {
    const totalCalEl = await driver.$('//android.widget.TextView[@text="0"]');
    const totalCalShown = await totalCalEl.isDisplayed();
    push('Total Calories Reset to 0 After Deletion', totalCalShown, Date.now() - t0, totalCalShown ? 'Reset confirmed' : 'Total calorie count is not 0');
  } catch (e) {
    push('Total Calories Reset to 0 After Deletion', false, Date.now() - t0, e.message);
  }

  return results;
};
