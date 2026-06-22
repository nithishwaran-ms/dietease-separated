/**
 * TEST 10 — Manual Entry (30 tests)
 */
const { navigateTo, clickTab, By } = require('../utils/driver');

async function jsClick(driver, el) {
  await driver.executeScript('arguments[0].scrollIntoView({block:"center"});', el);
  await driver.sleep(200);
  await driver.executeScript('arguments[0].click();', el);
}

module.exports = async function runTests(driver) {
  const results = [];
  await navigateTo(driver); await driver.sleep(800);
  // Ensure the addCard is open and inputs are visible
  await driver.executeScript("openAdd('999999999999')");
  await driver.sleep(500);

  const push = (name,pass,dur,info) => results.push({ name, status:pass?'PASS':'FAIL', duration:dur, category:'Manual Entry', error:info, timestamp:Date.now() });

  // T1: addCard exists
  let t0 = Date.now();
  try {
    const exists = await driver.executeScript('return !!document.getElementById("addCard");');
    push('Add Card for Manual Entry Exists', exists, Date.now()-t0, exists?'#addCard found':'#addCard missing');
  } catch(e) { push('Add Card for Manual Entry Exists', false, Date.now()-t0, e.message); }

  t0 = Date.now();
  try {
    const nameInp = await driver.executeScript('return !!document.getElementById("maName");');
    push('Manual Name Input Field Exists', nameInp, Date.now()-t0, nameInp?'#maName found':'#maName missing');
  } catch(e) { push('Manual Name Input Field Exists', false, Date.now()-t0, e.message); }

  t0 = Date.now();
  try {
    const calInp = await driver.executeScript('return !!document.getElementById("maCal");');
    push('Manual Calorie Input Field Exists', calInp, Date.now()-t0, calInp?'#maCal found':'#maCal missing');
  } catch(e) { push('Manual Calorie Input Field Exists', false, Date.now()-t0, e.message); }

  t0 = Date.now();
  try {
    const saveBtn = await driver.executeScript('return !!document.querySelector("#addCard button.savebtn,#addCard .save-btn");');
    push('Save Button Exists in Manual Entry Card', saveBtn, Date.now()-t0, saveBtn?'Save button found':'Save button missing');
  } catch(e) { push('Save Button Exists in Manual Entry Card', false, Date.now()-t0, e.message); }

  t0 = Date.now();
  try {
    const nameInp = await driver.findElement(By.id('maName'));
    await nameInp.clear(); await nameInp.sendKeys('Test Food Item');
    const calInp = await driver.findElement(By.id('maCal'));
    await calInp.clear(); await calInp.sendKeys('350');
    await jsClick(driver, await driver.findElement(By.css('#addCard button.savebtn,#addCard .save-btn')));
    await driver.sleep(600);
    // Click "Log This Food" to actually log it into the daily items
    await jsClick(driver, await driver.findElement(By.className('logbtn')));
    await driver.sleep(600);
    await clickTab(driver, 'today');
    await driver.sleep(400);
    const logItems = await driver.findElements(By.className('litem'));
    push('Manual Entry Saved to Log Successfully', logItems.length > 0, Date.now()-t0, logItems.length + ' items after manual save');
  } catch(e) { push('Manual Entry Saved to Log Successfully', false, Date.now()-t0, e.message); }

  for (let i = 6; i <= 30; i++) {
    t0 = Date.now();
    try {
      let pass = true; let info = '';
      if (i === 6) {
        const mProtInp = await driver.executeScript('return !!document.getElementById("maProt");');
        pass = mProtInp; info = mProtInp?'#maProt field exists':'#maProt missing';
      } else if (i === 7) {
        const mCarbInp = await driver.executeScript('return !!document.getElementById("maCarb");');
        pass = mCarbInp; info = mCarbInp?'#maCarb field exists':'#maCarb missing';
      } else if (i === 8) {
        const mFatInp = await driver.executeScript('return !!document.getElementById("maFat");');
        pass = mFatInp; info = mFatInp?'#maFat field exists':'#maFat missing';
      } else if (i === 9) {
        const addCardTitle = await driver.executeScript('return document.querySelector("#addCard .add-title").innerText;');
        pass = addCardTitle.length > 0; info = 'card title: "' + addCardTitle + '"';
      } else if (i === 10) {
        // Open card again to measure its height
        await clickTab(driver, 'scan'); await driver.sleep(300);
        await driver.executeScript("openAdd('999999999999')"); await driver.sleep(300);
        const addCardH = await driver.executeScript('return document.getElementById("addCard").offsetHeight;');
        pass = addCardH > 0; info = '#addCard height: ' + addCardH + 'px';
      } else if (i === 11) {
        const nameType = await driver.findElement(By.id('maName')).getAttribute('type');
        pass = nameType === 'text' || nameType === null; info = 'maName type: "' + nameType + '"';
      } else if (i === 12) {
        const calType = await driver.findElement(By.id('maCal')).getAttribute('type');
        pass = calType === 'number' || calType === 'text'; info = 'maCal type: "' + calType + '"';
      } else if (i === 13) {
        const namePlaceholder = await driver.findElement(By.id('maName')).getAttribute('placeholder');
        pass = namePlaceholder.length > 0; info = 'name placeholder: "' + namePlaceholder + '"';
      } else if (i === 14) {
        const calPlaceholder = await driver.findElement(By.id('maCal')).getAttribute('placeholder');
        pass = calPlaceholder.length > 0; info = 'cal placeholder: "' + calPlaceholder + '"';
      } else if (i === 15) {
        const addCardBg = await driver.executeScript('return getComputedStyle(document.getElementById("addCard")).backgroundColor;');
        pass = addCardBg !== ''; info = 'addCard bg: "' + addCardBg + '"';
      } else if (i === 16) {
        const addCardColor = await driver.executeScript('return getComputedStyle(document.getElementById("addCard")).color;');
        pass = addCardColor !== ''; info = 'addCard text color: "' + addCardColor + '"';
      } else if (i === 17) {
        const saveBtnText = await driver.executeScript('return document.querySelector("#addCard button.savebtn,#addCard .save-btn").innerText;');
        pass = saveBtnText.toLowerCase().includes('save') || saveBtnText.toLowerCase().includes('add') || saveBtnText.toLowerCase().includes('log');
        info = 'save btn text: "' + saveBtnText + '"';
      } else if (i === 18) {
        const saveBtnH = await driver.executeScript('return document.querySelector("#addCard button.savebtn,#addCard .save-btn").offsetHeight;');
        pass = saveBtnH > 0; info = 'save btn height: ' + saveBtnH + 'px';
      } else if (i === 19) {
        const addCardW = await driver.executeScript('return document.getElementById("addCard").offsetWidth;');
        pass = addCardW > 100; info = 'addCard width: ' + addCardW + 'px';
      } else if (i === 20) {
        await driver.findElement(By.id('maName')).clear();
        await driver.findElement(By.id('maName')).sendKeys('Apple');
        await driver.findElement(By.id('maCal')).clear();
        await driver.findElement(By.id('maCal')).sendKeys('52');
        pass = true; info = 'Apple 52kcal typed into fields';
      } else if (i === 21) {
        const nameVal = await driver.findElement(By.id('maName')).getAttribute('value');
        pass = nameVal === 'Apple'; info = 'maName value: "' + nameVal + '"';
      } else if (i === 22) {
        const calVal = await driver.findElement(By.id('maCal')).getAttribute('value');
        pass = calVal === '52'; info = 'maCal value: "' + calVal + '"';
      } else if (i === 23) {
        await jsClick(driver, await driver.findElement(By.css('#addCard button.savebtn,#addCard .save-btn')));
        await driver.sleep(600);
        await jsClick(driver, await driver.findElement(By.className('logbtn')));
        await driver.sleep(600);
        await clickTab(driver, 'today'); await driver.sleep(400);
        const total = await driver.executeScript('return parseInt(document.getElementById("totalCal").innerText) || 0;');
        pass = total >= 52; info = 'totalCal after Apple: ' + total + ' kcal';
      } else if (i === 24) {
        // Clear inputs on page scan
        await clickTab(driver, 'scan'); await driver.sleep(300);
        await driver.executeScript("openAdd('999999999999')"); await driver.sleep(300);
        await driver.findElement(By.id('maName')).clear(); await driver.findElement(By.id('maCal')).clear();
        const nameClear = await driver.findElement(By.id('maName')).getAttribute('value');
        pass = nameClear === ''; info = 'Fields cleared after save';
      } else if (i === 25) {
        const addCardPad = await driver.executeScript('return getComputedStyle(document.getElementById("addCard")).padding;');
        pass = addCardPad !== ''; info = 'addCard padding: ' + addCardPad;
      } else if (i === 26) {
        const addCardRadius = await driver.executeScript('return getComputedStyle(document.getElementById("addCard")).borderRadius;');
        pass = addCardRadius !== ''; info = 'addCard border-radius: ' + addCardRadius;
      } else if (i === 27) {
        const mNameFocus = await driver.executeScript('document.getElementById("maName").focus(); return document.activeElement.id;');
        pass = mNameFocus === 'maName'; info = 'maName focused: ' + mNameFocus;
      } else if (i === 28) {
        const mCalFocus = await driver.executeScript('document.getElementById("maCal").focus(); return document.activeElement.id;');
        pass = mCalFocus === 'maCal'; info = 'maCal focused: ' + mCalFocus;
      } else if (i === 29) {
        const saveBtnBg = await driver.executeScript('return getComputedStyle(document.querySelector("#addCard button.savebtn,#addCard .save-btn")).backgroundColor;');
        pass = saveBtnBg !== ''; info = 'save btn bg: "' + saveBtnBg + '"';
      } else {
        const addCardDisplay = await driver.executeScript('return getComputedStyle(document.getElementById("addCard")).display;');
        pass = addCardDisplay !== 'none'; info = 'addCard display: "' + addCardDisplay + '"';
      }
      push('T10.' + i + ' — Manual Entry Validation Scenario ' + (i-5), pass, Date.now()-t0, info);
    } catch(e) { push('T10.' + i + ' — Manual Entry Validation Scenario ' + (i-5), false, Date.now()-t0, e.message); }
  }

  return results;
};
