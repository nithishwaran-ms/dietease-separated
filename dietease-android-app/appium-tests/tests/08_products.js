/**
 * TEST 08 — Products (25 test cases)
 */
const { clickTab, findByText, findByTextContains } = require('../utils/driver');

async function searchProduct(driver, term) {
  await clickTab(driver, 'products');
  const searchInp = await driver.$('android.widget.EditText');
  await searchInp.waitForExist({ timeout: 5000 });
  await searchInp.clearValue();
  await searchInp.setValue(term);
  await driver.pause(2000);
}

module.exports = async function runTests(driver) {
  const results = [];
  const push = (name, pass, dur, info) => results.push({
    name,
    status: pass ? 'PASS' : 'FAIL',
    duration: dur,
    category: 'Products',
    error: info,
    timestamp: Date.now()
  });

  // ── Test 1: Products Tab accessible ─────────────────────────────────────
  let t = Date.now();
  try {
    await clickTab(driver, 'products');
    const searchInp = await driver.$('android.widget.EditText');
    await searchInp.waitForExist({ timeout: 5000 });
    push('Products Tab Search Input Exists', await searchInp.isDisplayed(), Date.now() - t, 'Search input is displayed');
  } catch (e) { push('Products Tab Search Input Exists', false, Date.now() - t, e.message); }

  // ── Test 2: Search 'Amul' returns 'Amul Butter' ──────────────────────────
  t = Date.now();
  try {
    await searchProduct(driver, 'Amul');
    const item = await findByText(driver, 'Amul Butter');
    await item.waitForExist({ timeout: 5000 });
    push('Search Amul Finds Amul Butter', await item.isDisplayed(), Date.now() - t, 'Amul Butter found in list');
  } catch (e) { push('Search Amul Finds Amul Butter', false, Date.now() - t, e.message); }

  // ── Test 3: Search 'Parle' returns 'Parle-G Biscuits' ────────────────────
  t = Date.now();
  try {
    await searchProduct(driver, 'Parle');
    const item = await findByText(driver, 'Parle-G Biscuits');
    await item.waitForExist({ timeout: 5000 });
    push('Search Parle Finds Parle-G Biscuits', await item.isDisplayed(), Date.now() - t, 'Parle-G found in list');
  } catch (e) { push('Search Parle Finds Parle-G Biscuits', false, Date.now() - t, e.message); }

  // ── Test 4: Search 'Maggi' returns 'Maggi 2-Minute Noodles' ──────────────
  t = Date.now();
  try {
    await searchProduct(driver, 'Maggi');
    const item = await findByText(driver, 'Maggi 2-Minute Noodles');
    await item.waitForExist({ timeout: 5000 });
    push('Search Maggi Finds Maggi Noodles', await item.isDisplayed(), Date.now() - t, 'Maggi found in list');
  } catch (e) { push('Search Maggi Finds Maggi Noodles', false, Date.now() - t, e.message); }

  // ── Test 5: Search 'Mock' returns mock products ─────────────────────────
  t = Date.now();
  try {
    await searchProduct(driver, 'Mock');
    const item = await findByTextContains(driver, 'Mock Apple');
    await item.waitForExist({ timeout: 5000 });
    push('Search Mock Finds Mock Apple', await item.isDisplayed(), Date.now() - t, 'Mock Apple found');
  } catch (e) { push('Search Mock Finds Mock Apple', false, Date.now() - t, e.message); }

  // ── Test 6: Search 'Apple' returns 'Mock Apple' ──────────────────────────
  t = Date.now();
  try {
    await searchProduct(driver, 'Apple');
    const item = await findByTextContains(driver, 'Mock Apple');
    await item.waitForExist({ timeout: 5000 });
    push('Search Apple Finds Mock Apple', await item.isDisplayed(), Date.now() - t, 'Mock Apple found');
  } catch (e) { push('Search Apple Finds Mock Apple', false, Date.now() - t, e.message); }

  // ── Test 7: Search 'Banana' returns 'Mock Banana' ────────────────────────
  t = Date.now();
  try {
    await searchProduct(driver, 'Banana');
    const item = await findByTextContains(driver, 'Mock Banana');
    await item.waitForExist({ timeout: 5000 });
    push('Search Banana Finds Mock Banana', await item.isDisplayed(), Date.now() - t, 'Mock Banana found');
  } catch (e) { push('Search Banana Finds Mock Banana', false, Date.now() - t, e.message); }

  // ── Test 8: Search 'Orange' returns 'Mock Orange' ────────────────────────
  t = Date.now();
  try {
    await searchProduct(driver, 'Orange');
    const item = await findByTextContains(driver, 'Mock Orange');
    await item.waitForExist({ timeout: 5000 });
    push('Search Orange Finds Mock Orange', await item.isDisplayed(), Date.now() - t, 'Mock Orange found');
  } catch (e) { push('Search Orange Finds Mock Orange', false, Date.now() - t, e.message); }

  // ── Test 9: Clear search input returns all products ─────────────────────
  t = Date.now();
  try {
    await clickTab(driver, 'products');
    const searchInp = await driver.$('android.widget.EditText');
    await searchInp.clearValue();
    await driver.pause(1000);
    const item = await findByText(driver, 'Amul Butter');
    await item.waitForExist({ timeout: 5000 });
    push('Clear Search Restores Full Product List', await item.isDisplayed(), Date.now() - t, 'Amul Butter is visible in list');
  } catch (e) { push('Clear Search Restores Full Product List', false, Date.now() - t, e.message); }

  // ── Test 10: Non-matching search shows empty list ──────────────────────
  t = Date.now();
  try {
    await searchProduct(driver, 'NonexistentXYZ');
    const item = await findByText(driver, 'Amul Butter');
    const exists = await item.isExisting();
    push('Non-matching Search Result Is Empty', !exists, Date.now() - t, !exists ? 'List does not show Amul Butter' : 'Stale item still shown');
  } catch (e) { push('Non-matching Search Result Is Empty', false, Date.now() - t, e.message); }

  // ── Test 11: Products list scroll does not crash app ─────────────────────
  t = Date.now();
  try {
    await clickTab(driver, 'products');
    const { width, height } = await driver.getWindowSize();
    await driver.action('pointer', {
      parameters: { pointerType: 'touch' },
      actions: [
        { type: 'pointerMove', x: width / 2, y: height * 0.7 },
        { type: 'pointerDown' },
        { type: 'pause', duration: 200 },
        { type: 'pointerMove', x: width / 2, y: height * 0.3 },
        { type: 'pointerUp' }
      ]
    });
    await driver.pause(500);
    push('Products List Scroll Success', true, Date.now() - t, 'Products list scrolled successfully');
  } catch (e) { push('Products List Scroll Success', false, Date.now() - t, e.message); }

  // ── Test 12: Select product Amul Butter opens scan card ──────────────────
  t = Date.now();
  try {
    await searchProduct(driver, 'Amul');
    const item = await findByText(driver, 'Amul Butter');
    await item.click();
    await driver.pause(2000);
    const cardTitle = await findByText(driver, 'Amul Butter');
    await cardTitle.waitForExist({ timeout: 5000 });
    const pass = await cardTitle.isDisplayed();
    const closeBtn = await driver.$('~Close');
    if (await closeBtn.isExisting()) { await closeBtn.click(); await driver.pause(500); }
    push('Click Product Card Navigates to Scan and Opens Detail', pass, Date.now() - t, pass ? 'Detail card opened' : 'Card not opened');
  } catch (e) { push('Click Product Card Navigates to Scan and Opens Detail', false, Date.now() - t, e.message); }

  // ── Test 13: Select Parle-G from list opens scan card ───────────────────
  t = Date.now();
  try {
    await searchProduct(driver, 'Parle');
    const item = await findByText(driver, 'Parle-G Biscuits');
    await item.click();
    await driver.pause(2000);
    const cardTitle = await findByText(driver, 'Parle-G Biscuits');
    await cardTitle.waitForExist({ timeout: 5000 });
    const pass = await cardTitle.isDisplayed();
    const closeBtn = await driver.$('~Close');
    if (await closeBtn.isExisting()) { await closeBtn.click(); await driver.pause(500); }
    push('Click Parle-G Navigates to Scan and Opens Detail', pass, Date.now() - t, pass ? 'Detail card opened' : 'Card not opened');
  } catch (e) { push('Click Parle-G Navigates to Scan and Opens Detail', false, Date.now() - t, e.message); }

  // ── Test 14: Search case insensitivity ('amul') ──────────────────────────
  t = Date.now();
  try {
    await searchProduct(driver, 'amul');
    const item = await findByText(driver, 'Amul Butter');
    await item.waitForExist({ timeout: 5000 });
    push('Search Is Case Insensitive', await item.isDisplayed(), Date.now() - t, 'Found Amul Butter with lowercase input');
  } catch (e) { push('Search Is Case Insensitive', false, Date.now() - t, e.message); }

  // ── Test 15: Search mock strawberry ──────────────────────────────────────
  t = Date.now();
  try {
    await searchProduct(driver, 'Strawberry');
    const item = await findByTextContains(driver, 'Strawberry');
    await item.waitForExist({ timeout: 5000 });
    push('Search Strawberry Finds Mock Strawberry', await item.isDisplayed(), Date.now() - t, 'Strawberry found');
  } catch (e) { push('Search Strawberry Finds Mock Strawberry', false, Date.now() - t, e.message); }

  // ── Test 16: Search mock grape ───────────────────────────────────────────
  t = Date.now();
  try {
    await searchProduct(driver, 'Grape');
    const item = await findByTextContains(driver, 'Grape');
    await item.waitForExist({ timeout: 5000 });
    push('Search Grape Finds Mock Grape', await item.isDisplayed(), Date.now() - t, 'Grape found');
  } catch (e) { push('Search Grape Finds Mock Grape', false, Date.now() - t, e.message); }

  // ── Test 17: Search mock pineapple ───────────────────────────────────────
  t = Date.now();
  try {
    await searchProduct(driver, 'Pineapple');
    const item = await findByTextContains(driver, 'Pineapple');
    await item.waitForExist({ timeout: 5000 });
    push('Search Pineapple Finds Mock Pineapple', await item.isDisplayed(), Date.now() - t, 'Pineapple found');
  } catch (e) { push('Search Pineapple Finds Mock Pineapple', false, Date.now() - t, e.message); }

  // ── Test 18: Search mock blueberry ───────────────────────────────────────
  t = Date.now();
  try {
    await searchProduct(driver, 'Blueberry');
    const item = await findByTextContains(driver, 'Blueberry');
    await item.waitForExist({ timeout: 5000 });
    push('Search Blueberry Finds Mock Blueberry', await item.isDisplayed(), Date.now() - t, 'Blueberry found');
  } catch (e) { push('Search Blueberry Finds Mock Blueberry', false, Date.now() - t, e.message); }

  // ── Test 19: Search mock watermelon ──────────────────────────────────────
  t = Date.now();
  try {
    await searchProduct(driver, 'Watermelon');
    const item = await findByTextContains(driver, 'Watermelon');
    await item.waitForExist({ timeout: 5000 });
    push('Search Watermelon Finds Mock Watermelon', await item.isDisplayed(), Date.now() - t, 'Watermelon found');
  } catch (e) { push('Search Watermelon Finds Mock Watermelon', false, Date.now() - t, e.message); }

  // ── Test 20: Search mock peach ───────────────────────────────────────────
  t = Date.now();
  try {
    await searchProduct(driver, 'Peach');
    const item = await findByTextContains(driver, 'Peach');
    await item.waitForExist({ timeout: 5000 });
    push('Search Peach Finds Mock Peach', await item.isDisplayed(), Date.now() - t, 'Peach found');
  } catch (e) { push('Search Peach Finds Mock Peach', false, Date.now() - t, e.message); }

  // ── Test 21: Search mock cherry ──────────────────────────────────────────
  t = Date.now();
  try {
    await searchProduct(driver, 'Cherry');
    const item = await findByTextContains(driver, 'Cherry');
    await item.waitForExist({ timeout: 5000 });
    push('Search Cherry Finds Mock Cherry', await item.isDisplayed(), Date.now() - t, 'Cherry found');
  } catch (e) { push('Search Cherry Finds Mock Cherry', false, Date.now() - t, e.message); }

  // ── Test 22: Search with extra spaces trim works ──────────────────────────
  t = Date.now();
  try {
    await searchProduct(driver, '   Amul   ');
    const item = await findByText(driver, 'Amul Butter');
    await item.waitForExist({ timeout: 5000 });
    push('Search Trims Leading And Trailing Whitespace', await item.isDisplayed(), Date.now() - t, 'Amul Butter found');
  } catch (e) { push('Search Trims Leading And Trailing Whitespace', false, Date.now() - t, e.message); }

  // ── Test 23: Navigating to other tabs and back retains search tab functionality ─
  t = Date.now();
  try {
    await clickTab(driver, 'today');
    await clickTab(driver, 'products');
    const searchInp = await driver.$('android.widget.EditText');
    push('Search Input Accessible After Tab Switch', await searchInp.isDisplayed(), Date.now() - t, 'Search input responsive');
  } catch (e) { push('Search Input Accessible After Tab Switch', false, Date.now() - t, e.message); }

  // ── Test 24: Search by barcode ───────────────────────────────────────────
  t = Date.now();
  try {
    await searchProduct(driver, '8901719100018');
    const item = await findByText(driver, 'Parle-G Biscuits');
    await item.waitForExist({ timeout: 5000 });
    push('Search by Barcode String Finds Product', await item.isDisplayed(), Date.now() - t, 'Parle-G found by barcode search');
  } catch (e) { push('Search by Barcode String Finds Product', false, Date.now() - t, e.message); }

  // ── Test 25: Clear search to cleanup ─────────────────────────────────────
  t = Date.now();
  try {
    await clickTab(driver, 'products');
    const searchInp = await driver.$('android.widget.EditText');
    await searchInp.clearValue();
    await driver.pause(1000);
    push('Clear Search input successfully', true, Date.now() - t, 'Cleaned search term');
  } catch (e) { push('Clear Search input successfully', false, Date.now() - t, e.message); }

  return results;
};
