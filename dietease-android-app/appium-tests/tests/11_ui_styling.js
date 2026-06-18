/**
 * TEST 11 — UI & Styling (25 test cases)
 */
const { clickTab, findByText, findByTextContains } = require('../utils/driver');

module.exports = async function runTests(driver) {
  const results = [];
  const push = (name, pass, dur, info) => results.push({
    name,
    status: pass ? 'PASS' : 'FAIL',
    duration: dur,
    category: 'UI & Styling',
    error: info,
    timestamp: Date.now()
  });

  // ── Test 1: Brand title visible on Scan tab ─────────────────────────────
  let t = Date.now();
  try {
    await clickTab(driver, 'scan');
    const brand = await findByText(driver, 'DietEase+');
    push('Branding DietEase+ Visible on Scan Tab', await brand.isDisplayed(), Date.now() - t, 'Brand title visible');
  } catch (e) { push('Branding DietEase+ Visible on Scan Tab', false, Date.now() - t, e.message); }

  // ── Test 2: Scanner badge visible on Scan tab ───────────────────────────
  t = Date.now();
  try {
    const badge = await findByText(driver, 'BARCODE SCANNER');
    push('Scanner Badge Visible on Scan Tab', await badge.isDisplayed(), Date.now() - t, 'BARCODE SCANNER badge visible');
  } catch (e) { push('Scanner Badge Visible on Scan Tab', false, Date.now() - t, e.message); }

  // ── Test 3: DB source badge visible on Scan tab ─────────────────────────
  t = Date.now();
  try {
    const dbTag = await findByText(driver, '⚡ Built-in DB');
    push('Database Tag Visible on Scan Tab', await dbTag.isDisplayed(), Date.now() - t, '⚡ Built-in DB tag visible');
  } catch (e) { push('Database Tag Visible on Scan Tab', false, Date.now() - t, e.message); }

  // ── Test 4: Tab button 'Scan' is visible in bottom bar ──────────────────
  t = Date.now();
  try {
    const tab = await driver.$('android=new UiSelector().text("Scan")');
    push('Scan Bottom Tab Navigation Button Visible', await tab.isDisplayed(), Date.now() - t, 'Scan tab button found');
  } catch (e) { push('Scan Bottom Tab Navigation Button Visible', false, Date.now() - t, e.message); }

  // ── Test 5: Tab button 'Today' is visible in bottom bar ─────────────────
  t = Date.now();
  try {
    const tab = await driver.$('android=new UiSelector().text("Today")');
    push('Today Bottom Tab Navigation Button Visible', await tab.isDisplayed(), Date.now() - t, 'Today tab button found');
  } catch (e) { push('Today Bottom Tab Navigation Button Visible', false, Date.now() - t, e.message); }

  // ── Test 6: Tab button 'History' is visible in bottom bar ───────────────
  t = Date.now();
  try {
    const tab = await driver.$('android=new UiSelector().text("History")');
    push('History Bottom Tab Navigation Button Visible', await tab.isDisplayed(), Date.now() - t, 'History tab button found');
  } catch (e) { push('History Bottom Tab Navigation Button Visible', false, Date.now() - t, e.message); }

  // ── Test 7: Tab button 'Products' is visible in bottom bar ──────────────
  t = Date.now();
  try {
    const tab = await driver.$('android=new UiSelector().text("Products")');
    push('Products Bottom Tab Navigation Button Visible', await tab.isDisplayed(), Date.now() - t, 'Products tab button found');
  } catch (e) { push('Products Bottom Tab Navigation Button Visible', false, Date.now() - t, e.message); }

  // ── Test 8: Brand title visible on Today tab ────────────────────────────
  t = Date.now();
  try {
    await clickTab(driver, 'today');
    const brand = await findByText(driver, 'DietEase+');
    push('Branding DietEase+ Visible on Today Tab', await brand.isDisplayed(), Date.now() - t, 'Brand title visible');
  } catch (e) { push('Branding DietEase+ Visible on Today Tab', false, Date.now() - t, e.message); }

  // ── Test 9: Brand title visible on History tab ──────────────────────────
  t = Date.now();
  try {
    await clickTab(driver, 'history');
    const brand = await findByText(driver, 'DietEase+');
    push('Branding DietEase+ Visible on History Tab', await brand.isDisplayed(), Date.now() - t, 'Brand title visible');
  } catch (e) { push('Branding DietEase+ Visible on History Tab', false, Date.now() - t, e.message); }

  // ── Test 10: Brand title visible on Products tab ────────────────────────
  t = Date.now();
  try {
    await clickTab(driver, 'products');
    const brand = await findByText(driver, 'DietEase+');
    push('Branding DietEase+ Visible on Products Tab', await brand.isDisplayed(), Date.now() - t, 'Brand title visible');
  } catch (e) { push('Branding DietEase+ Visible on Products Tab', false, Date.now() - t, e.message); }

  // ── Test 11-25: UI stability layout checks under rapid tab switches ──────
  const tabs = ['scan', 'today', 'history', 'products'];
  for (let i = 0; i < 15; i++) {
    const tabName = tabs[i % tabs.length];
    t = Date.now();
    try {
      await clickTab(driver, tabName);
      const brand = await findByText(driver, 'DietEase+');
      const pass = await brand.isDisplayed();
      push(`UI Tab Toggle Switch Iteration ${i + 1} Brand Integrity`, pass, Date.now() - t, `Brand title is intact on ${tabName} switch`);
    } catch (e) {
      push(`UI Tab Toggle Switch Iteration ${i + 1} Brand Integrity`, false, Date.now() - t, e.message);
    }
  }

  // Back to default tab
  await clickTab(driver, 'scan');

  return results;
};
