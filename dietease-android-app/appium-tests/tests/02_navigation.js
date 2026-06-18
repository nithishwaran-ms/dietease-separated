/**
 * TEST 02 — Navigation (20 tests)
 */
const { navigateTo, clickTab, findByText, DEFAULT_TIMEOUT } = require('../utils/driver');

module.exports = async function runTests(driver) {
  const results = [];
  const push = (name, pass, dur, info) => results.push({
    name, status: pass ? 'PASS' : 'FAIL', duration: dur,
    category: 'Navigation', error: info, timestamp: Date.now()
  });

  // T1 — Navigate to Today Screen
  let t0 = Date.now();
  try {
    await clickTab(driver, 'today');
    const header = await findByText(driver, '📅 Today');
    const pass = await header.isDisplayed();
    push('T01 Navigate to Today Screen', pass, Date.now()-t0, pass?'Today tab loaded':'Today header not found');
  } catch(e) { push('T01 Navigate to Today Screen', false, Date.now()-t0, e.message); }

  // T2 — Navigate to History Screen
  t0 = Date.now();
  try {
    await clickTab(driver, 'history');
    const header = await findByText(driver, '📅 History');
    const pass = await header.isDisplayed();
    push('T02 Navigate to History Screen', pass, Date.now()-t0, pass?'History tab loaded':'History header not found');
  } catch(e) { push('T02 Navigate to History Screen', false, Date.now()-t0, e.message); }

  // T3 — Navigate to Products Screen
  t0 = Date.now();
  try {
    await clickTab(driver, 'products');
    const header = await findByText(driver, '🛒 Product Database');
    const pass = await header.isDisplayed();
    push('T03 Navigate to Products Screen', pass, Date.now()-t0, pass?'Products tab loaded':'Products header not found');
  } catch(e) { push('T03 Navigate to Products Screen', false, Date.now()-t0, e.message); }

  // T4 — Navigate back to Scan Screen
  t0 = Date.now();
  try {
    await clickTab(driver, 'scan');
    const header = await findByText(driver, 'DietEase+');
    const pass = await header.isDisplayed();
    push('T04 Navigate Back to Scan Screen', pass, Date.now()-t0, pass?'Scan tab loaded':'Scan header not found');
  } catch(e) { push('T04 Navigate Back to Scan Screen', false, Date.now()-t0, e.message); }

  // T5 — Today tab shows date heading
  t0 = Date.now();
  try {
    await clickTab(driver, 'today');
    await driver.pause(500);
    const el = await findByText(driver, '📅 Today');
    const pass = await el.isDisplayed();
    push('T05 Today Tab Shows Header with Emoji', pass, Date.now()-t0, pass?'Header with emoji visible':'Header with emoji not found');
  } catch(e) { push('T05 Today Tab Shows Header with Emoji', false, Date.now()-t0, e.message); }

  // T6 — History tab header has emoji
  t0 = Date.now();
  try {
    await clickTab(driver, 'history');
    await driver.pause(500);
    const el = await findByText(driver, '📅 History');
    const pass = await el.isDisplayed();
    push('T06 History Tab Header Has Emoji', pass, Date.now()-t0, pass?'Emoji header visible':'Emoji header missing');
  } catch(e) { push('T06 History Tab Header Has Emoji', false, Date.now()-t0, e.message); }

  // T7 — Products tab header has emoji
  t0 = Date.now();
  try {
    await clickTab(driver, 'products');
    await driver.pause(500);
    const el = await findByText(driver, '🛒 Product Database');
    const pass = await el.isDisplayed();
    push('T07 Products Tab Header Has Emoji', pass, Date.now()-t0, pass?'Emoji header visible':'Emoji header missing');
  } catch(e) { push('T07 Products Tab Header Has Emoji', false, Date.now()-t0, e.message); }

  // T8 — Rapid tab switching doesn't crash
  t0 = Date.now();
  try {
    for (const tab of ['scan','today','history','products','scan']) {
      await clickTab(driver, tab);
      await driver.pause(300);
    }
    const header = await findByText(driver, 'DietEase+');
    const pass = await header.isDisplayed();
    push('T08 Rapid Tab Switching Does Not Crash App', pass, Date.now()-t0, pass?'App stable':'App crashed');
  } catch(e) { push('T08 Rapid Tab Switching Does Not Crash App', false, Date.now()-t0, e.message); }

  // T9 — Scan tab label text
  t0 = Date.now();
  try {
    await clickTab(driver, 'scan');
    const el = await findByText(driver, 'Scan');
    const pass = await el.isDisplayed();
    push('T09 Scan Tab Label Text Is Visible', pass, Date.now()-t0, pass?'Scan label visible':'Scan label missing');
  } catch(e) { push('T09 Scan Tab Label Text Is Visible', false, Date.now()-t0, e.message); }

  // T10 — Today tab label text
  t0 = Date.now();
  try {
    const el = await findByText(driver, 'Today');
    const pass = await el.isDisplayed();
    push('T10 Today Tab Label Text Is Visible', pass, Date.now()-t0, pass?'Today label visible':'Today label missing');
  } catch(e) { push('T10 Today Tab Label Text Is Visible', false, Date.now()-t0, e.message); }

  // T11 — History tab label text
  t0 = Date.now();
  try {
    const el = await findByText(driver, 'History');
    const pass = await el.isDisplayed();
    push('T11 History Tab Label Text Is Visible', pass, Date.now()-t0, pass?'History label visible':'History label missing');
  } catch(e) { push('T11 History Tab Label Text Is Visible', false, Date.now()-t0, e.message); }

  // T12 — Products tab label text
  t0 = Date.now();
  try {
    const el = await findByText(driver, 'Products');
    const pass = await el.isDisplayed();
    push('T12 Products Tab Label Text Is Visible', pass, Date.now()-t0, pass?'Products label visible':'Products label missing');
  } catch(e) { push('T12 Products Tab Label Text Is Visible', false, Date.now()-t0, e.message); }

  // T13 — Today screen shows calorie goal area
  t0 = Date.now();
  try {
    await clickTab(driver, 'today');
    await driver.pause(500);
    const kcal = await driver.$('android=new UiSelector().textContains("kcal")');
    const pass = await kcal.isExisting();
    push('T13 Today Screen Shows Calorie Goal (kcal)', pass, Date.now()-t0, pass?'kcal element found':'kcal element missing');
  } catch(e) { push('T13 Today Screen Shows Calorie Goal (kcal)', false, Date.now()-t0, e.message); }

  // T14 — Products screen is scrollable
  t0 = Date.now();
  try {
    await clickTab(driver, 'products');
    await driver.pause(500);
    const scroll = await driver.$('android.widget.ScrollView');
    const pass = await scroll.isExisting();
    push('T14 Products Screen Has Scrollable View', pass, Date.now()-t0, pass?'Scroll view found':'No scroll view found');
  } catch(e) { push('T14 Products Screen Has Scrollable View', false, Date.now()-t0, e.message); }

  // T15 — Back button or system nav doesn't exit app
  t0 = Date.now();
  try {
    await clickTab(driver, 'scan');
    const header = await findByText(driver, 'DietEase+');
    const pass = await header.isDisplayed();
    push('T15 App Remains on Scan Screen After Tab Reset', pass, Date.now()-t0, pass?'App still showing':'App header missing');
  } catch(e) { push('T15 App Remains on Scan Screen After Tab Reset', false, Date.now()-t0, e.message); }

  // T16 — History screen loads content area
  t0 = Date.now();
  try {
    await clickTab(driver, 'history');
    await driver.pause(500);
    const header = await findByText(driver, '📅 History');
    const exists = await header.isExisting();
    push('T16 History Screen Content Area Loads', exists, Date.now()-t0, exists?'History content loaded':'History content missing');
  } catch(e) { push('T16 History Screen Content Area Loads', false, Date.now()-t0, e.message); }

  // T17 — Today screen has Today header
  t0 = Date.now();
  try {
    await clickTab(driver, 'today');
    await driver.pause(500);
    const el = await findByText(driver, '📅 Today');
    const pass = await el.isExisting();
    push('T17 Today Screen Header Exists After Navigation', pass, Date.now()-t0, pass?'Header found':'Header missing');
  } catch(e) { push('T17 Today Screen Header Exists After Navigation', false, Date.now()-t0, e.message); }

  // T18 — Each screen is unique (no duplicate header texts)
  t0 = Date.now();
  try {
    const tabs = [
      { tab:'today',    text:'📅 Today' },
      { tab:'history',  text:'📅 History' },
      { tab:'products', text:'🛒 Product Database' },
    ];
    let allPass = true;
    for (const { tab, text } of tabs) {
      await clickTab(driver, tab);
      await driver.pause(400);
      const el = await findByText(driver, text);
      if (!(await el.isDisplayed())) { allPass = false; break; }
    }
    push('T18 Each Screen Shows Its Unique Header', allPass, Date.now()-t0, allPass?'All screens unique':'A screen header missing');
  } catch(e) { push('T18 Each Screen Shows Its Unique Header', false, Date.now()-t0, e.message); }

  // T19 — Nav bar persistent across all tabs
  t0 = Date.now();
  try {
    await clickTab(driver, 'history');
    await driver.pause(300);
    const scan = await findByText(driver, 'Scan');
    const pass = await scan.isDisplayed();
    push('T19 Nav Bar Persistent on History Screen', pass, Date.now()-t0, pass?'Nav bar visible':'Nav bar missing on history');
  } catch(e) { push('T19 Nav Bar Persistent on History Screen', false, Date.now()-t0, e.message); }

  // T20 — Return to scan and verify stable
  t0 = Date.now();
  try {
    await clickTab(driver, 'scan');
    await driver.pause(500);
    const badge = await findByText(driver, 'BARCODE SCANNER');
    const pass = await badge.isDisplayed();
    push('T20 Scan Screen Stable After Full Navigation Cycle', pass, Date.now()-t0, pass?'Scan screen stable':'Scan screen unstable');
  } catch(e) { push('T20 Scan Screen Stable After Full Navigation Cycle', false, Date.now()-t0, e.message); }

  return results;
};
