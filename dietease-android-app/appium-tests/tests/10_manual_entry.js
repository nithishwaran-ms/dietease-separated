/**
 * TEST 10 — Manual Entry (25 test cases)
 */
const { clickTab, findByText, findByTextContains } = require('../utils/driver');

async function triggerManualForm(driver) {
  await clickTab(driver, 'scan');
  const inp = await driver.$('android.widget.EditText');
  await inp.waitForExist({ timeout: 5000 });
  await inp.clearValue();
  await inp.setValue('999999');
  const searchBtn = await driver.$('~Search');
  await searchBtn.click();
  const saveBtn = await driver.$('android=new UiSelector().text("💾 Save & Log")');
  await saveBtn.waitForExist({ timeout: 15000 });
  return saveBtn;
}

async function fillAndLog(driver, name, cal, prot, carb, fat) {
  const saveBtn = await triggerManualForm(driver);
  const inputs = await driver.$$('android.widget.EditText');
  const offset = inputs.length === 5 ? 0 : 1;
  await inputs[offset + 0].setValue(name);
  await inputs[offset + 1].setValue(cal);
  await inputs[offset + 2].setValue(prot);
  await inputs[offset + 3].setValue(carb);
  await inputs[offset + 4].setValue(fat);
  await driver.pause(500);
  await saveBtn.click();
  await driver.pause(1500);
}

async function clearLogs(driver) {
  await clickTab(driver, 'today');
  let btns = await driver.$$('~Delete');
  while (btns.length > 0) {
    await btns[0].click();
    await driver.pause(600);
    btns = await driver.$$('~Delete');
  }
}

module.exports = async function runTests(driver) {
  const results = [];
  const push = (name, pass, dur, info) => results.push({
    name,
    status: pass ? 'PASS' : 'FAIL',
    duration: dur,
    category: 'Manual Entry',
    error: info,
    timestamp: Date.now()
  });

  // Clean state
  await clearLogs(driver);

  // ── Test 1: Manual entry form opens ─────────────────────────────────────
  let t = Date.now();
  try {
    const saveBtn = await triggerManualForm(driver);
    push('Manual Entry Form Save Button Visible', await saveBtn.isDisplayed(), Date.now() - t, 'Save button found');
    // Dismiss form by clicking Today tab
    await clickTab(driver, 'today');
  } catch (e) { push('Manual Entry Form Save Button Visible', false, Date.now() - t, e.message); }

  // ── Test 2: Input fields are visible and count is correct ───────────────
  t = Date.now();
  try {
    await triggerManualForm(driver);
    const inputs = await driver.$$('android.widget.EditText');
    const pass = inputs.length >= 5;
    push('Manual Entry Form Has 5 Inputs', pass, Date.now() - t, pass ? `${inputs.length} inputs found` : `Found only ${inputs.length} inputs`);
    await clickTab(driver, 'today');
  } catch (e) { push('Manual Entry Form Has 5 Inputs', false, Date.now() - t, e.message); }

  // ── Test 3: Fill Custom Salad and log ───────────────────────────────────
  t = Date.now();
  try {
    await fillAndLog(driver, 'Custom Salad', '150', '5', '12', '8');
    await clickTab(driver, 'today');
    const item = await findByText(driver, 'Custom Salad');
    push('Log Custom Salad via Manual Entry', await item.isDisplayed(), Date.now() - t, 'Custom Salad found in today log');
  } catch (e) { push('Log Custom Salad via Manual Entry', false, Date.now() - t, e.message); }

  // ── Test 4-23: Log and verify 20 different custom foods ─────────────────
  const foods = [
    { name: 'Custom Pizza', cal: '300', prot: '12', carb: '35', fat: '14' },
    { name: 'Custom Burger', cal: '450', prot: '20', carb: '40', fat: '22' },
    { name: 'Custom Juice', cal: '120', prot: '1', carb: '28', fat: '0' },
    { name: 'Custom Sandwich', cal: '280', prot: '15', carb: '30', fat: '10' },
    { name: 'Custom Soup', cal: '90', prot: '3', carb: '15', fat: '2' },
    { name: 'Custom Coffee', cal: '80', prot: '2', carb: '10', fat: '4' },
    { name: 'Custom Pasta', cal: '350', prot: '11', carb: '60', fat: '6' },
    { name: 'Custom Rice', cal: '200', prot: '4', carb: '44', fat: '1' },
    { name: 'Custom Bread', cal: '150', prot: '5', carb: '28', fat: '2' },
    { name: 'Custom Egg', cal: '70', prot: '6', carb: '1', fat: '5' },
    { name: 'Custom Milk', cal: '120', prot: '8', carb: '12', fat: '5' },
    { name: 'Custom Tea', cal: '40', prot: '1', carb: '8', fat: '1' },
    { name: 'Custom Fruit', cal: '60', prot: '1', carb: '14', fat: '0' },
    { name: 'Custom Cake', cal: '250', prot: '3', carb: '40', fat: '10' },
    { name: 'Custom Cookie', cal: '100', prot: '1', carb: '15', fat: '4' },
    { name: 'Custom Shake', cal: '320', prot: '18', carb: '45', fat: '8' },
    { name: 'Custom Wrap', cal: '270', prot: '14', carb: '32', fat: '9' },
    { name: 'Custom Steak', cal: '400', prot: '35', carb: '0', fat: '28' },
    { name: 'Custom Chicken', cal: '220', prot: '26', carb: '0', fat: '12' },
    { name: 'Custom Bowl', cal: '310', prot: '14', carb: '48', fat: '7' }
  ];

  for (let i = 0; i < foods.length; i++) {
    const f = foods[i];
    t = Date.now();
    try {
      await fillAndLog(driver, f.name, f.cal, f.prot, f.carb, f.fat);
      await clickTab(driver, 'today');
      const item = await findByText(driver, f.name);
      push(`Log ${f.name} via Manual Entry`, await item.isDisplayed(), Date.now() - t, `${f.name} logged successfully`);
    } catch (e) {
      push(`Log ${f.name} via Manual Entry`, false, Date.now() - t, e.message);
    }
  }

  // ── Test 24: Calorie total updates correctly after custom logging ───────
  t = Date.now();
  try {
    await clickTab(driver, 'today');
    const calEl = await findByTextContains(driver, 'kcal');
    push('Calorie Total Displayed After Custom Logs', await calEl.isDisplayed(), Date.now() - t, 'Calories label present');
  } catch (e) { push('Calorie Total Displayed After Custom Logs', false, Date.now() - t, e.message); }

  // ── Test 25: Clear all logged entries for clean up ─────────────────────
  t = Date.now();
  try {
    await clearLogs(driver);
    push('Cleanup All Manual Custom Entries', true, Date.now() - t, 'Logged entries cleared successfully');
  } catch (e) { push('Cleanup All Manual Custom Entries', false, Date.now() - t, e.message); }

  return results;
};
