/**
 * TEST 09 — Scan Mode (25 test cases)
 */
const { clickTab, findByText, findByTextContains } = require('../utils/driver');

module.exports = async function runTests(driver) {
  const results = [];
  const push = (name, pass, dur, info) => results.push({
    name,
    status: pass ? 'PASS' : 'FAIL',
    duration: dur,
    category: 'Scan Mode',
    error: info,
    timestamp: Date.now()
  });

  // ── Test 1: Camera button is visible on load ─────────────────────────────
  let t = Date.now();
  try {
    await clickTab(driver, 'scan');
    const cameraBtn = await findByText(driver, '📷 Start Camera Scanner');
    await cameraBtn.waitForExist({ timeout: 5000 });
    push('Start Camera Button Visible initially', await cameraBtn.isDisplayed(), Date.now() - t, 'Camera button visible');
  } catch (e) { push('Start Camera Button Visible initially', false, Date.now() - t, e.message); }

  // ── Test 2: Click camera button opens camera preview (Close button visible) ──
  t = Date.now();
  try {
    const cameraBtn = await findByText(driver, '📷 Start Camera Scanner');
    await cameraBtn.click();
    await driver.pause(2000);
    const closeBtn = await findByText(driver, '✕ Close Camera');
    await closeBtn.waitForExist({ timeout: 5000 });
    push('Click Camera Button Displays Close Button', await closeBtn.isDisplayed(), Date.now() - t, 'Close button visible');
  } catch (e) { push('Click Camera Button Displays Close Button', false, Date.now() - t, e.message); }

  // ── Test 3: Close camera works (Start Camera button visible again) ─────────
  t = Date.now();
  try {
    const closeBtn = await findByText(driver, '✕ Close Camera');
    await closeBtn.click();
    await driver.pause(1000);
    const cameraBtn = await findByText(driver, '📷 Start Camera Scanner');
    await cameraBtn.waitForExist({ timeout: 5000 });
    push('Close Camera Restores Start Camera Button', await cameraBtn.isDisplayed(), Date.now() - t, 'Camera button restored');
  } catch (e) { push('Close Camera Restores Start Camera Button', false, Date.now() - t, e.message); }

  // ── Test 4-23: Perform 20 toggle iterations of camera scanner to ensure stability ──
  for (let i = 1; i <= 20; i++) {
    t = Date.now();
    try {
      const cameraBtn = await findByText(driver, '📷 Start Camera Scanner');
      await cameraBtn.click();
      await driver.pause(500);
      const closeBtn = await findByText(driver, '✕ Close Camera');
      await closeBtn.waitForExist({ timeout: 5000 });
      await closeBtn.click();
      await driver.pause(500);
      push(`Camera Toggle Cycle Iteration ${i} Stability`, true, Date.now() - t, `Iteration ${i} toggled successfully`);
    } catch (e) {
      push(`Camera Toggle Cycle Iteration ${i} Stability`, false, Date.now() - t, e.message);
    }
  }

  // ── Test 24: Navigation tabs still work while camera screen is closed ───────
  t = Date.now();
  try {
    await clickTab(driver, 'today');
    const todayEl = await driver.$('android=new UiSelector().textContains("Today")');
    push('Today Tab Reachable from Scan Tab', await todayEl.isDisplayed(), Date.now() - t, 'Today tab reachable');
  } catch (e) { push('Today Tab Reachable from Scan Tab', false, Date.now() - t, e.message); }

  // ── Test 25: Return to scan tab ──────────────────────────────────────────
  t = Date.now();
  try {
    await clickTab(driver, 'scan');
    const cameraBtn = await findByText(driver, '📷 Start Camera Scanner');
    push('Return to Scan Tab Restores Layout', await cameraBtn.isDisplayed(), Date.now() - t, 'Scan tab ready');
  } catch (e) { push('Return to Scan Tab Restores Layout', false, Date.now() - t, e.message); }

  return results;
};
