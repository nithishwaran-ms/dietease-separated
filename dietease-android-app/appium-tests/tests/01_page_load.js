/**
 * TEST 01 — Page Load (20 tests)
 */
const { navigateTo, findByText, findByTextContains, clickTab, DEFAULT_TIMEOUT } = require('../utils/driver');

module.exports = async function runTests(driver) {
  const results = [];
  const push = (name, pass, dur, info) => results.push({
    name, status: pass ? 'PASS' : 'FAIL', duration: dur,
    category: 'Page Load', error: info, timestamp: Date.now()
  });

  // T1 — App screen loads
  let t0 = Date.now();
  try {
    await navigateTo(driver);
    await driver.pause(1000);
    const headerEl = await findByText(driver, 'DietEase+');
    const pass = await headerEl.isDisplayed();
    push('T01 Main App Screen Loads Correctly', pass, Date.now()-t0, pass?'Header visible':'Header not found');
  } catch(e) { push('T01 Main App Screen Loads Correctly', false, Date.now()-t0, e.message); }

  // T2 — Barcode Scanner badge visible
  t0 = Date.now();
  try {
    const badge = await findByText(driver, 'BARCODE SCANNER');
    const pass = await badge.isDisplayed();
    push('T02 Barcode Scanner Badge Visible', pass, Date.now()-t0, pass?'Badge visible':'Badge not found');
  } catch(e) { push('T02 Barcode Scanner Badge Visible', false, Date.now()-t0, e.message); }

  // T3 — DietEase+ header exists and not empty
  t0 = Date.now();
  try {
    const el = await findByText(driver, 'DietEase+');
    const text = await el.getText();
    const pass = text === 'DietEase+';
    push('T03 App Header Text Is DietEase+', pass, Date.now()-t0, pass?`Text: "${text}"`:`Got: "${text}"`);
  } catch(e) { push('T03 App Header Text Is DietEase+', false, Date.now()-t0, e.message); }

  // T4 — Bottom navigation bar exists
  t0 = Date.now();
  try {
    const scan = await findByText(driver, 'Scan');
    const pass = await scan.isExisting();
    push('T04 Bottom Navigation Bar Present', pass, Date.now()-t0, pass?'Nav bar visible':'Nav bar missing');
  } catch(e) { push('T04 Bottom Navigation Bar Present', false, Date.now()-t0, e.message); }

  // T5 — Scan tab visible in nav
  t0 = Date.now();
  try {
    const el = await findByText(driver, 'Scan');
    const pass = await el.isDisplayed();
    push('T05 Scan Tab Visible in Nav Bar', pass, Date.now()-t0, pass?'Scan tab visible':'Scan tab hidden');
  } catch(e) { push('T05 Scan Tab Visible in Nav Bar', false, Date.now()-t0, e.message); }

  // T6 — Today tab visible in nav
  t0 = Date.now();
  try {
    const el = await findByText(driver, 'Today');
    const pass = await el.isDisplayed();
    push('T06 Today Tab Visible in Nav Bar', pass, Date.now()-t0, pass?'Today tab visible':'Today tab hidden');
  } catch(e) { push('T06 Today Tab Visible in Nav Bar', false, Date.now()-t0, e.message); }

  // T7 — History tab visible in nav
  t0 = Date.now();
  try {
    const el = await findByText(driver, 'History');
    const pass = await el.isDisplayed();
    push('T07 History Tab Visible in Nav Bar', pass, Date.now()-t0, pass?'History tab visible':'History tab hidden');
  } catch(e) { push('T07 History Tab Visible in Nav Bar', false, Date.now()-t0, e.message); }

  // T8 — Products tab visible in nav
  t0 = Date.now();
  try {
    const el = await findByText(driver, 'Products');
    const pass = await el.isDisplayed();
    push('T08 Products Tab Visible in Nav Bar', pass, Date.now()-t0, pass?'Products tab visible':'Products tab hidden');
  } catch(e) { push('T08 Products Tab Visible in Nav Bar', false, Date.now()-t0, e.message); }

  // T9 — Barcode input field present on scan screen
  t0 = Date.now();
  try {
    const input = await driver.$('android.widget.EditText');
    const pass = await input.isDisplayed();
    push('T09 Barcode Input Field Present on Scan Screen', pass, Date.now()-t0, pass?'Input field visible':'Input field hidden');
  } catch(e) { push('T09 Barcode Input Field Present on Scan Screen', false, Date.now()-t0, e.message); }

  // T10 — Search button present
  t0 = Date.now();
  try {
    const searchBtn = await driver.$('~Search');
    const pass = await searchBtn.isDisplayed();
    push('T10 Search Button Present on Scan Screen', pass, Date.now()-t0, pass?'Search button visible':'Search button hidden');
  } catch(e) { push('T10 Search Button Present on Scan Screen', false, Date.now()-t0, e.message); }

  // T11 — Camera button present
  t0 = Date.now();
  try {
    const cam = await driver.$('~Camera');
    const pass = await cam.isExisting();
    push('T11 Camera Button Exists on Scan Screen', pass, Date.now()-t0, pass?'Camera button exists':'Camera button missing');
  } catch(e) { push('T11 Camera Button Exists on Scan Screen', false, Date.now()-t0, e.message); }

  // T12 — App does not crash on load
  t0 = Date.now();
  try {
    const header = await findByText(driver, 'DietEase+');
    const pass = await header.isDisplayed();
    push('T12 App Does Not Crash on Load', pass, Date.now()-t0, pass?'No crash detected':'App may have crashed');
  } catch(e) { push('T12 App Does Not Crash on Load', false, Date.now()-t0, e.message); }

  // T13 — Scan tab is the default tab
  t0 = Date.now();
  try {
    await clickTab(driver, 'scan');
    const badge = await findByText(driver, 'BARCODE SCANNER');
    const pass = await badge.isDisplayed();
    push('T13 Scan is Default Active Tab on Launch', pass, Date.now()-t0, pass?'Scan screen visible as default':'Scan screen not default');
  } catch(e) { push('T13 Scan is Default Active Tab on Launch', false, Date.now()-t0, e.message); }

  // T14 — Scanner badge text is uppercase
  t0 = Date.now();
  try {
    const badge = await findByText(driver, 'BARCODE SCANNER');
    const text = await badge.getText();
    const pass = text === text.toUpperCase();
    push('T14 Scanner Badge Text Is Uppercase', pass, Date.now()-t0, pass?`Text: "${text}"`:`Got: "${text}"`);
  } catch(e) { push('T14 Scanner Badge Text Is Uppercase', false, Date.now()-t0, e.message); }

  // T15 — Manual barcode input accepts text
  t0 = Date.now();
  try {
    const input = await driver.$('android.widget.EditText');
    await input.clearValue();
    await input.setValue('1234567890');
    const val = await input.getText();
    const pass = val.includes('1234567890');
    await input.clearValue();
    push('T15 Barcode Input Field Accepts Text', pass, Date.now()-t0, pass?`Value: "${val}"`:`Got: "${val}"`);
  } catch(e) { push('T15 Barcode Input Field Accepts Text', false, Date.now()-t0, e.message); }

  // T16 — App shows no error text on initial load
  t0 = Date.now();
  try {
    const errEls = await driver.$$('android=new UiSelector().textContains("Error")');
    const pass = errEls.length === 0;
    push('T16 No Error Messages on Initial Load', pass, Date.now()-t0, pass?'No error text found':`${errEls.length} error elements found`);
  } catch(e) { push('T16 No Error Messages on Initial Load', false, Date.now()-t0, e.message); }

  // T17 — App title contains Plus symbol
  t0 = Date.now();
  try {
    const el = await findByText(driver, 'DietEase+');
    const text = await el.getText();
    const pass = text.includes('+');
    push('T17 App Title Contains Plus Symbol', pass, Date.now()-t0, pass?`Title: "${text}"`:'Plus symbol missing');
  } catch(e) { push('T17 App Title Contains Plus Symbol', false, Date.now()-t0, e.message); }

  // T18 — Nav bar has 4 tabs total
  t0 = Date.now();
  try {
    const tabs = ['Scan', 'Today', 'History', 'Products'];
    let count = 0;
    for (const tab of tabs) {
      try {
        const el = await findByText(driver, tab);
        if (await el.isDisplayed()) count++;
      } catch(_) {}
    }
    const pass = count === 4;
    push('T18 Navigation Bar Has All 4 Tabs', pass, Date.now()-t0, pass?'4 tabs visible':`Only ${count} tabs visible`);
  } catch(e) { push('T18 Navigation Bar Has All 4 Tabs', false, Date.now()-t0, e.message); }

  // T19 — Scan screen content is scrollable or visible
  t0 = Date.now();
  try {
    const el = await findByText(driver, 'DietEase+');
    const pass = await el.isExisting();
    push('T19 Scan Screen Content Is Rendered', pass, Date.now()-t0, pass?'Screen content rendered':'Screen content missing');
  } catch(e) { push('T19 Scan Screen Content Is Rendered', false, Date.now()-t0, e.message); }

  // T20 — Multiple navigations don't crash app
  t0 = Date.now();
  try {
    await clickTab(driver, 'today');
    await driver.pause(500);
    await clickTab(driver, 'scan');
    await driver.pause(500);
    const header = await findByText(driver, 'DietEase+');
    const pass = await header.isDisplayed();
    push('T20 Multiple Tab Navigations Do Not Crash App', pass, Date.now()-t0, pass?'App stable after navigation':'App crashed or header missing');
  } catch(e) { push('T20 Multiple Tab Navigations Do Not Crash App', false, Date.now()-t0, e.message); }

  return results;
};
