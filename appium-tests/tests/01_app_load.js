/**
 * TEST 01 — App Load
 */
const { isVisible, getTextSafe } = require('../utils/driver');

module.exports = async function runTests(driver) {
  const results = [];
  const category = 'App Load';
  
  const push = (name, pass, dur, info) => {
    results.push({ name, status: pass ? 'PASS' : 'FAIL', duration: dur, category, error: info, timestamp: Date.now() });
  };

  // T1 — Header Text
  let t0 = Date.now();
  try {
    // Look for text element with value "DietEase+"
    const el = await driver.$('//android.widget.TextView[@text="DietEase+"]');
    const exists = await el.isDisplayed();
    push('App Logo Text "DietEase+" Is Visible', exists, Date.now() - t0, exists ? 'Header text found' : 'Header text not visible');
  } catch (e) {
    push('App Logo Text "DietEase+" Is Visible', false, Date.now() - t0, e.message);
  }

  // T2 — Camera Scanner button
  t0 = Date.now();
  try {
    const el = await driver.$('//android.widget.Button[contains(@text, "Start Camera Scanner") or contains(@text, "📷")]');
    const exists = await el.isDisplayed();
    push('Start Camera Button Present on Load', exists, Date.now() - t0, exists ? 'Camera button found' : 'Camera button not visible');
  } catch (e) {
    push('Start Camera Button Present on Load', false, Date.now() - t0, e.message);
  }

  // T3 — Bottom Nav Bar
  t0 = Date.now();
  try {
    const scanTab = await driver.$('~Scan');
    const exists = await scanTab.isDisplayed();
    push('Bottom Nav Scan Tab Visible', exists, Date.now() - t0, exists ? 'Scan tab found' : 'Scan tab not visible');
  } catch (e) {
    push('Bottom Nav Scan Tab Visible', false, Date.now() - t0, e.message);
  }

  // T4 — Tab "Today" Visible
  t0 = Date.now();
  try {
    const todayTab = await driver.$('~Today');
    const exists = await todayTab.isDisplayed();
    push('Bottom Nav Today Tab Visible', exists, Date.now() - t0, exists ? 'Today tab found' : 'Today tab not visible');
  } catch (e) {
    push('Bottom Nav Today Tab Visible', false, Date.now() - t0, e.message);
  }

  // T5 — Tab "History" Visible
  t0 = Date.now();
  try {
    const historyTab = await driver.$('~History');
    const exists = await historyTab.isDisplayed();
    push('Bottom Nav History Tab Visible', exists, Date.now() - t0, exists ? 'History tab found' : 'History tab not visible');
  } catch (e) {
    push('Bottom Nav History Tab Visible', false, Date.now() - t0, e.message);
  }

  // T6 — Tab "Products" Visible
  t0 = Date.now();
  try {
    const productsTab = await driver.$('~Products');
    const exists = await productsTab.isDisplayed();
    push('Bottom Nav Products Tab Visible', exists, Date.now() - t0, exists ? 'Products tab found' : 'Products tab not visible');
  } catch (e) {
    push('Bottom Nav Products Tab Visible', false, Date.now() - t0, e.message);
  }

  // T7 — Manual Barcode input area visible on load
  t0 = Date.now();
  try {
    const el = await driver.$('//android.widget.EditText');
    const exists = await el.isDisplayed();
    push('Manual Barcode Input Field Visible', exists, Date.now() - t0, exists ? 'Input field found' : 'Input field not visible');
  } catch (e) {
    push('Manual Barcode Input Field Visible', false, Date.now() - t0, e.message);
  }

  return results;
};
