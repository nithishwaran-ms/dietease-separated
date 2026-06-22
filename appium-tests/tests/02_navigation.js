/**
 * TEST 02 — Navigation
 */
const { clickTab } = require('../utils/driver');

module.exports = async function runTests(driver) {
  const results = [];
  const category = 'Navigation';

  const push = (name, pass, dur, info) => {
    results.push({ name, status: pass ? 'PASS' : 'FAIL', duration: dur, category, error: info, timestamp: Date.now() });
  };

  // T1 — Scan active on load
  let t0 = Date.now();
  try {
    const el = await driver.$('//android.widget.TextView[@text="BARCODE SCANNER"]');
    const isShown = await el.isDisplayed();
    push('Scan Page Active on Load', isShown, Date.now() - t0, isShown ? 'Scan active' : 'Scan not active');
  } catch (e) {
    push('Scan Page Active on Load', false, Date.now() - t0, e.message);
  }

  // T2 — Today tab navigation
  t0 = Date.now();
  try {
    await clickTab(driver, 'today');
    const el = await driver.$('//android.widget.TextView[contains(@text, "Today") or contains(@text, "📅 Today")]');
    const isShown = await el.isDisplayed();
    push('Today Tab Shows Today\'s Log', isShown, Date.now() - t0, isShown ? 'Today screen shown' : 'Today screen hidden');
  } catch (e) {
    push('Today Tab Shows Today\'s Log', false, Date.now() - t0, e.message);
  }

  // T3 — History tab navigation
  t0 = Date.now();
  try {
    await clickTab(driver, 'history');
    const el = await driver.$('//android.widget.TextView[contains(@text, "History") or contains(@text, "📅 History")]');
    const isShown = await el.isDisplayed();
    push('History Tab Shows Food History', isShown, Date.now() - t0, isShown ? 'History screen shown' : 'History screen hidden');
  } catch (e) {
    push('History Tab Shows Food History', false, Date.now() - t0, e.message);
  }

  // T4 — Products tab navigation
  t0 = Date.now();
  try {
    await clickTab(driver, 'products');
    const el = await driver.$('//android.widget.TextView[contains(@text, "Product Database") or contains(@text, "🛒 Product Database")]');
    const isShown = await el.isDisplayed();
    push('Products Tab Shows Product Database', isShown, Date.now() - t0, isShown ? 'Products screen shown' : 'Products screen hidden');
  } catch (e) {
    push('Products Tab Shows Product Database', false, Date.now() - t0, e.message);
  }

  // T5 — Navigate back to Scan tab
  t0 = Date.now();
  try {
    await clickTab(driver, 'scan');
    const el = await driver.$('//android.widget.TextView[@text="BARCODE SCANNER"]');
    const isShown = await el.isDisplayed();
    push('Navigate Back to Scan Tab', isShown, Date.now() - t0, isShown ? 'Scan active' : 'Scan not active');
  } catch (e) {
    push('Navigate Back to Scan Tab', false, Date.now() - t0, e.message);
  }

  return results;
};
