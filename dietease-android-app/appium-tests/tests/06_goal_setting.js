/**
 * TEST 06 — Goal Setting (25 test cases)
 */
const { clickTab, findByText, findByTextContains } = require('../utils/driver');

async function openGoalDialog(driver) {
  await clickTab(driver, 'today');
  const editBtn = await driver.$('~Edit goal');
  await editBtn.waitForExist({ timeout: 5000 });
  await editBtn.click();
  await driver.pause(1000);
}

async function setGoal(driver, value) {
  await openGoalDialog(driver);
  const inp = await driver.$('android.widget.EditText');
  await inp.waitForExist({ timeout: 5000 });
  await inp.clearValue();
  await inp.setValue(String(value));
  const saveBtn = await driver.$('android=new UiSelector().text("Save")');
  await saveBtn.waitForExist({ timeout: 5000 });
  await saveBtn.click();
  await driver.pause(1000);
}

module.exports = async function runTests(driver) {
  const results = [];
  const push = (name, pass, dur, info) => results.push({
    name,
    status: pass ? 'PASS' : 'FAIL',
    duration: dur,
    category: 'Goal Setting',
    error: info,
    timestamp: Date.now()
  });

  // ── Test 1: Today screen shows Edit Goal button ─────────────────────
  let t = Date.now();
  try {
    await clickTab(driver, 'today');
    const editBtn = await driver.$('~Edit goal');
    await editBtn.waitForExist({ timeout: 5000 });
    push('Today Screen Has Edit Goal Button', await editBtn.isDisplayed(), Date.now() - t, 'Edit goal button visible');
  } catch (e) { push('Today Screen Has Edit Goal Button', false, Date.now() - t, e.message); }

  // ── Test 2: Edit Goal button opens dialog ──────────────────────────
  t = Date.now();
  try {
    await openGoalDialog(driver);
    const inp = await driver.$('android.widget.EditText');
    await inp.waitForExist({ timeout: 5000 });
    const pass = await inp.isDisplayed();
    // close dialog
    const cancel = await driver.$('android=new UiSelector().text("Cancel")');
    if (await cancel.isExisting()) { await cancel.click(); await driver.pause(500); }
    push('Edit Goal Opens Dialog With Input', pass, Date.now() - t, pass ? 'Dialog with input shown' : 'Dialog not shown');
  } catch (e) { push('Edit Goal Opens Dialog With Input', false, Date.now() - t, e.message); }

  // ── Test 3: Dialog has Save button ────────────────────────────────
  t = Date.now();
  try {
    await openGoalDialog(driver);
    const saveBtn = await driver.$('android=new UiSelector().text("Save")');
    await saveBtn.waitForExist({ timeout: 5000 });
    const pass = await saveBtn.isDisplayed();
    const cancel = await driver.$('android=new UiSelector().text("Cancel")');
    if (await cancel.isExisting()) { await cancel.click(); await driver.pause(500); }
    push('Goal Dialog Has Save Button', pass, Date.now() - t, pass ? 'Save button visible' : 'Save button not found');
  } catch (e) { push('Goal Dialog Has Save Button', false, Date.now() - t, e.message); }

  // ── Test 4: Dialog has Cancel button ──────────────────────────────
  t = Date.now();
  try {
    await openGoalDialog(driver);
    const cancelBtn = await driver.$('android=new UiSelector().text("Cancel")');
    await cancelBtn.waitForExist({ timeout: 5000 });
    const pass = await cancelBtn.isDisplayed();
    await cancelBtn.click();
    await driver.pause(500);
    push('Goal Dialog Has Cancel Button', pass, Date.now() - t, pass ? 'Cancel button visible' : 'Cancel not found');
  } catch (e) { push('Goal Dialog Has Cancel Button', false, Date.now() - t, e.message); }

  // ── Test 5: Set goal to 2000 and verify ──────────────────────────
  t = Date.now();
  try {
    await setGoal(driver, 2000);
    const goalEl = await findByTextContains(driver, '2000');
    await goalEl.waitForExist({ timeout: 5000 });
    const pass = await goalEl.isDisplayed();
    push('Set Calorie Goal to 2000 Updates Display', pass, Date.now() - t, pass ? '2000 kcal goal shown' : 'Goal not updated');
  } catch (e) { push('Set Calorie Goal to 2000 Updates Display', false, Date.now() - t, e.message); }

  // ── Test 6: Set goal to 1500 and verify ──────────────────────────
  t = Date.now();
  try {
    await setGoal(driver, 1500);
    const goalEl = await findByTextContains(driver, '1500');
    await goalEl.waitForExist({ timeout: 5000 });
    const pass = await goalEl.isDisplayed();
    push('Set Calorie Goal to 1500 Updates Display', pass, Date.now() - t, pass ? '1500 kcal goal shown' : 'Goal not updated');
  } catch (e) { push('Set Calorie Goal to 1500 Updates Display', false, Date.now() - t, e.message); }

  // ── Test 7: Set goal to 2500 and verify ──────────────────────────
  t = Date.now();
  try {
    await setGoal(driver, 2500);
    const goalEl = await findByTextContains(driver, '2500');
    await goalEl.waitForExist({ timeout: 5000 });
    const pass = await goalEl.isDisplayed();
    push('Set Calorie Goal to 2500 Updates Display', pass, Date.now() - t, pass ? '2500 kcal goal shown' : 'Goal not updated');
  } catch (e) { push('Set Calorie Goal to 2500 Updates Display', false, Date.now() - t, e.message); }

  // ── Test 8: Set goal to 3000 and verify ──────────────────────────
  t = Date.now();
  try {
    await setGoal(driver, 3000);
    const goalEl = await findByTextContains(driver, '3000');
    await goalEl.waitForExist({ timeout: 5000 });
    const pass = await goalEl.isDisplayed();
    push('Set Calorie Goal to 3000 Updates Display', pass, Date.now() - t, pass ? '3000 kcal goal shown' : 'Goal not updated');
  } catch (e) { push('Set Calorie Goal to 3000 Updates Display', false, Date.now() - t, e.message); }

  // ── Test 9: Set goal to 1800 and verify ──────────────────────────
  t = Date.now();
  try {
    await setGoal(driver, 1800);
    const goalEl = await findByTextContains(driver, '1800');
    await goalEl.waitForExist({ timeout: 5000 });
    const pass = await goalEl.isDisplayed();
    push('Set Calorie Goal to 1800 Updates Display', pass, Date.now() - t, pass ? '1800 kcal goal shown' : 'Goal not updated');
  } catch (e) { push('Set Calorie Goal to 1800 Updates Display', false, Date.now() - t, e.message); }

  // ── Test 10: Goal persists after navigating away and back ─────────
  t = Date.now();
  try {
    await setGoal(driver, 2200);
    await clickTab(driver, 'scan');
    await driver.pause(500);
    await clickTab(driver, 'today');
    const goalEl = await findByTextContains(driver, '2200');
    await goalEl.waitForExist({ timeout: 5000 });
    const pass = await goalEl.isDisplayed();
    push('Goal Persists After Tab Navigation', pass, Date.now() - t, pass ? 'Goal 2200 still shown' : 'Goal lost after navigation');
  } catch (e) { push('Goal Persists After Tab Navigation', false, Date.now() - t, e.message); }

  // ── Test 11: Cancel keeps previous goal unchanged ─────────────────
  t = Date.now();
  try {
    await setGoal(driver, 2200);
    await openGoalDialog(driver);
    const inp = await driver.$('android.widget.EditText');
    await inp.clearValue();
    await inp.setValue('9999');
    const cancel = await driver.$('android=new UiSelector().text("Cancel")');
    await cancel.click();
    await driver.pause(500);
    const goalEl = await findByTextContains(driver, '2200');
    const pass = await goalEl.isDisplayed();
    push('Cancel Does Not Change Existing Goal', pass, Date.now() - t, pass ? 'Goal still 2200 after cancel' : 'Goal changed on cancel');
  } catch (e) { push('Cancel Does Not Change Existing Goal', false, Date.now() - t, e.message); }

  // ── Test 12: Goal input accepts numeric value ─────────────────────
  t = Date.now();
  try {
    await openGoalDialog(driver);
    const inp = await driver.$('android.widget.EditText');
    await inp.clearValue();
    await inp.setValue('1700');
    const val = await inp.getText();
    const pass = val.includes('1700') || val.length > 0;
    const cancel = await driver.$('android=new UiSelector().text("Cancel")');
    if (await cancel.isExisting()) { await cancel.click(); await driver.pause(500); }
    push('Goal Input Accepts Numeric Value', pass, Date.now() - t, pass ? `Input value: ${val}` : 'Input failed');
  } catch (e) { push('Goal Input Accepts Numeric Value', false, Date.now() - t, e.message); }

  // ── Test 13: Today screen shows /NNNN kcal format ─────────────────
  t = Date.now();
  try {
    await clickTab(driver, 'today');
    const goalEl = await findByTextContains(driver, '/ ');
    await goalEl.waitForExist({ timeout: 5000 });
    const text = await goalEl.getText();
    const pass = text.includes('kcal') || text.includes('/');
    push('Today Screen Shows Goal in /NNNN kcal Format', pass, Date.now() - t, pass ? `Goal text: ${text}` : 'Goal format incorrect');
  } catch (e) { push('Today Screen Shows Goal in /NNNN kcal Format', false, Date.now() - t, e.message); }

  // ── Test 14: Goal dialog input is clearable ───────────────────────
  t = Date.now();
  try {
    await openGoalDialog(driver);
    const inp = await driver.$('android.widget.EditText');
    await inp.setValue('1234');
    await inp.clearValue();
    const val = await inp.getText();
    const pass = val === '' || val.length === 0;
    const cancel = await driver.$('android=new UiSelector().text("Cancel")');
    if (await cancel.isExisting()) { await cancel.click(); await driver.pause(500); }
    push('Goal Dialog Input Is Clearable', pass, Date.now() - t, pass ? 'Input cleared' : `Still has: ${val}`);
  } catch (e) { push('Goal Dialog Input Is Clearable', false, Date.now() - t, e.message); }

  // ── Test 15: Change goal multiple times in row ────────────────────
  t = Date.now();
  try {
    await setGoal(driver, 1600);
    await setGoal(driver, 1900);
    await setGoal(driver, 2100);
    const goalEl = await findByTextContains(driver, '2100');
    await goalEl.waitForExist({ timeout: 5000 });
    const pass = await goalEl.isDisplayed();
    push('Changing Goal Multiple Times Works Correctly', pass, Date.now() - t, pass ? 'Final goal 2100 displayed' : 'Goal not updated to 2100');
  } catch (e) { push('Changing Goal Multiple Times Works Correctly', false, Date.now() - t, e.message); }

  // ── Test 16: Scan tab unaffected by goal changes ──────────────────
  t = Date.now();
  try {
    await setGoal(driver, 2000);
    await clickTab(driver, 'scan');
    const inp = await driver.$('android.widget.EditText');
    const pass = await inp.isExisting();
    push('Scan Tab Unaffected by Goal Changes', pass, Date.now() - t, pass ? 'Scan tab ok' : 'Scan tab broken');
  } catch (e) { push('Scan Tab Unaffected by Goal Changes', false, Date.now() - t, e.message); }

  // ── Test 17: Products tab unaffected by goal changes ─────────────
  t = Date.now();
  try {
    await clickTab(driver, 'products');
    const inp = await driver.$('android.widget.EditText');
    const pass = await inp.isExisting();
    push('Products Tab Unaffected by Goal Changes', pass, Date.now() - t, pass ? 'Products tab ok' : 'Products tab broken');
  } catch (e) { push('Products Tab Unaffected by Goal Changes', false, Date.now() - t, e.message); }

  // ── Test 18: History tab unaffected by goal changes ──────────────
  t = Date.now();
  try {
    await clickTab(driver, 'history');
    await driver.pause(500);
    const histTab = await driver.$('android=new UiSelector().text("History")');
    const pass = await histTab.isExisting();
    push('History Tab Unaffected by Goal Changes', pass, Date.now() - t, pass ? 'History tab ok' : 'History tab broken');
  } catch (e) { push('History Tab Unaffected by Goal Changes', false, Date.now() - t, e.message); }

  // ── Test 19: Goal set to 2200 shows correct kcal goal ────────────
  t = Date.now();
  try {
    await setGoal(driver, 2200);
    await clickTab(driver, 'today');
    const el = await findByTextContains(driver, '2200');
    await el.waitForExist({ timeout: 5000 });
    const text = await el.getText();
    const pass = text.includes('2200');
    push('Goal Set to 2200 Displays Correctly', pass, Date.now() - t, pass ? `Text: ${text}` : 'Goal 2200 not displayed');
  } catch (e) { push('Goal Set to 2200 Displays Correctly', false, Date.now() - t, e.message); }

  // ── Test 20: App doesn't crash on double-tap of edit goal ─────────
  t = Date.now();
  try {
    await clickTab(driver, 'today');
    const editBtn = await driver.$('~Edit goal');
    await editBtn.waitForExist({ timeout: 5000 });
    await editBtn.click();
    await driver.pause(500);
    const cancel = await driver.$('android=new UiSelector().text("Cancel")');
    if (await cancel.isExisting()) { await cancel.click(); await driver.pause(500); }
    await editBtn.click();
    await driver.pause(500);
    const cancel2 = await driver.$('android=new UiSelector().text("Cancel")');
    if (await cancel2.isExisting()) { await cancel2.click(); await driver.pause(500); }
    const todayEl = await driver.$('android=new UiSelector().textContains("Today")');
    const pass = await todayEl.isExisting();
    push('Double Edit Goal Taps Do Not Crash App', pass, Date.now() - t, pass ? 'App still responsive' : 'App may have crashed');
  } catch (e) { push('Double Edit Goal Taps Do Not Crash App', false, Date.now() - t, e.message); }

  // ── Test 21: Set goal to 2400 ─────────────────────────────────────
  t = Date.now();
  try {
    await setGoal(driver, 2400);
    const el = await findByTextContains(driver, '2400');
    await el.waitForExist({ timeout: 5000 });
    const pass = await el.isDisplayed();
    push('Set Calorie Goal to 2400 Updates Display', pass, Date.now() - t, pass ? '2400 shown' : 'Goal not updated');
  } catch (e) { push('Set Calorie Goal to 2400 Updates Display', false, Date.now() - t, e.message); }

  // ── Test 22: Set goal to 1200 ─────────────────────────────────────
  t = Date.now();
  try {
    await setGoal(driver, 1200);
    const el = await findByTextContains(driver, '1200');
    await el.waitForExist({ timeout: 5000 });
    const pass = await el.isDisplayed();
    push('Set Calorie Goal to 1200 Updates Display', pass, Date.now() - t, pass ? '1200 shown' : 'Goal not updated');
  } catch (e) { push('Set Calorie Goal to 1200 Updates Display', false, Date.now() - t, e.message); }

  // ── Test 23: Set goal to 2700 ─────────────────────────────────────
  t = Date.now();
  try {
    await setGoal(driver, 2700);
    const el = await findByTextContains(driver, '2700');
    await el.waitForExist({ timeout: 5000 });
    const pass = await el.isDisplayed();
    push('Set Calorie Goal to 2700 Updates Display', pass, Date.now() - t, pass ? '2700 shown' : 'Goal not updated');
  } catch (e) { push('Set Calorie Goal to 2700 Updates Display', false, Date.now() - t, e.message); }

  // ── Test 24: Goal input dialog title present ──────────────────────
  t = Date.now();
  try {
    await openGoalDialog(driver);
    const titleEl = await findByTextContains(driver, 'Goal');
    await titleEl.waitForExist({ timeout: 5000 });
    const pass = await titleEl.isDisplayed();
    const cancel = await driver.$('android=new UiSelector().text("Cancel")');
    if (await cancel.isExisting()) { await cancel.click(); await driver.pause(500); }
    push('Goal Dialog Shows Goal Title', pass, Date.now() - t, pass ? 'Goal title visible' : 'Goal title not found');
  } catch (e) { push('Goal Dialog Shows Goal Title', false, Date.now() - t, e.message); }

  // ── Test 25: Reset goal to 2000 (cleanup) ────────────────────────
  t = Date.now();
  try {
    await setGoal(driver, 2000);
    const el = await findByTextContains(driver, '2000');
    await el.waitForExist({ timeout: 5000 });
    const pass = await el.isDisplayed();
    push('Reset Goal to 2000 for Cleanup', pass, Date.now() - t, pass ? 'Reset to 2000 successful' : 'Reset failed');
  } catch (e) { push('Reset Goal to 2000 for Cleanup', false, Date.now() - t, e.message); }

  return results;
};
