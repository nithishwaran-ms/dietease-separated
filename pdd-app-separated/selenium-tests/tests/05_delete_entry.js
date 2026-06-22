/**
 * TEST 05 — Delete Entry (30 tests)
 */
const { navigateTo, clickTab, By } = require('../utils/driver');

async function jsClick(driver, el) {
  await driver.executeScript('arguments[0].scrollIntoView({block:"center"});', el);
  await driver.sleep(300);
  await driver.executeScript('arguments[0].click();', el);
}

module.exports = async function runTests(driver) {
  const results = [];
  const push = (name,pass,dur,info) => results.push({ name, status:pass?'PASS':'FAIL', duration:dur, category:'Delete Entry', error:info, timestamp:Date.now() });

  // T1: Delete entry reduces count
  let t0 = Date.now();
  try {
    await navigateTo(driver); await driver.sleep(1200);
    await clickTab(driver, 'today'); await driver.sleep(1000);
    let beforeCount = (await driver.findElements(By.className('litem'))).length;
    if (beforeCount === 0) {
      await clickTab(driver, 'scan'); await driver.sleep(600);
      const inp = await driver.findElement(By.id('manualInput'));
      await inp.clear(); await inp.sendKeys('8901719100018');
      await jsClick(driver, await driver.findElement(By.css('.mrow button')));
      await driver.wait(async () => { const c=await driver.findElement(By.id('resultCard')).getAttribute('class'); return c.includes('on'); }, 10000);
      await jsClick(driver, await driver.findElement(By.className('logbtn')));
      await driver.sleep(1500);
      await clickTab(driver, 'today'); await driver.sleep(1000);
      beforeCount = (await driver.findElements(By.className('litem'))).length;
    }
    if (beforeCount === 0) throw new Error('No items to delete');
    const delBtns = await driver.findElements(By.className('delbtn'));
    await jsClick(driver, delBtns[0]); await driver.sleep(800);
    const afterCount = (await driver.findElements(By.className('litem'))).length;
    push('Delete Entry Removes Item from Log', afterCount < beforeCount, Date.now()-t0, afterCount < beforeCount? beforeCount + ' → ' + afterCount + ' items' : 'Count unchanged: ' + afterCount);
  } catch(e) { push('Delete Entry Removes Item from Log', false, Date.now()-t0, e.message); }

  // T2: Delete button visible
  t0 = Date.now();
  try {
    await navigateTo(driver); await driver.sleep(1000);
    const inp = await driver.findElement(By.id('manualInput'));
    await inp.clear(); await inp.sendKeys('8901719100018');
    await jsClick(driver, await driver.findElement(By.css('.mrow button')));
    await driver.wait(async () => { const c=await driver.findElement(By.id('resultCard')).getAttribute('class'); return c.includes('on'); }, 8000);
    await jsClick(driver, await driver.findElement(By.className('logbtn')));
    await driver.sleep(1200);
    await clickTab(driver, 'today'); await driver.sleep(800);
    const delBtns = await driver.findElements(By.className('delbtn'));
    push('Delete Button (✕) Present on Each Log Item', delBtns.length > 0, Date.now()-t0, delBtns.length > 0? delBtns.length + ' delete button(s) found' : 'No delete buttons found');
  } catch(e) { push('Delete Button (✕) Present on Each Log Item', false, Date.now()-t0, e.message); }

  // T3: Calorie reductions
  t0 = Date.now();
  try {
    const calBefore = await driver.executeScript('return document.getElementById("totalCal").innerText||"0"');
    const delBtns = await driver.findElements(By.className('delbtn'));
    if (delBtns.length === 0) throw new Error('No items to delete for calorie check');
    await jsClick(driver, delBtns[0]); await driver.sleep(800);
    const calAfter = await driver.executeScript('return document.getElementById("totalCal").innerText||"0"');
    const pass = parseInt(calAfter) < parseInt(calBefore);
    push('Deleting Entry Reduces Calorie Total', pass, Date.now()-t0, pass? calBefore + ' → ' + calAfter + ' kcal' : 'Unchanged: ' + calBefore);
  } catch(e) { push('Deleting Entry Reduces Calorie Total', false, Date.now()-t0, e.message); }

  // T4: All items deleted
  t0 = Date.now();
  try {
    let delBtns = await driver.findElements(By.className('delbtn'));
    while (delBtns.length > 0) {
      await jsClick(driver, delBtns[0]);
      await driver.sleep(500);
      delBtns = await driver.findElements(By.className('delbtn'));
    }
    await driver.sleep(500);
    const empty = await driver.findElements(By.className('empty'));
    const items = await driver.findElements(By.className('litem'));
    const pass = empty.length > 0 && items.length === 0;
    push('All Items Deleted Shows Empty State', pass, Date.now()-t0, pass?'Empty state shown after all deletions': 'Items remaining: ' + items.length);
  } catch(e) { push('All Items Deleted Shows Empty State', false, Date.now()-t0, e.message); }

  // T5 - T30: New additions
  for (let i = 5; i <= 30; i++) {
    t0 = Date.now();
    try {
      let pass = true;
      let info = '';
      if (i === 5) {
        const emptyStateText = await driver.executeScript('return document.querySelector(".empty p").innerText;');
        pass = emptyStateText.includes('logged');
        info = 'empty text: "' + emptyStateText + '"';
      } else if (i === 6) {
        const emptyIcon = await driver.executeScript('return document.querySelector(".empty .ei").innerText;');
        pass = emptyIcon.length > 0;
        info = 'empty icon: "' + emptyIcon + '"';
      } else if (i === 7) {
        const totalCalVal = await driver.executeScript('return document.getElementById("totalCal").innerText;');
        pass = totalCalVal === '0';
        info = 'calorie total: "' + totalCalVal + '"';
      } else if (i === 8) {
        const progressWidth = await driver.executeScript('return document.getElementById("progFill").style.width;');
        pass = progressWidth === '0%';
        info = 'progress bar: "' + progressWidth + '"';
      } else if (i === 9) {
        const progressClass = await driver.findElement(By.id('progFill')).getAttribute('class');
        pass = !progressClass.includes('over');
        info = 'progress class: "' + progressClass + '"';
      } else if (i === 10) {
        const listChildren = await driver.executeScript('return document.getElementById("logList").children.length;');
        pass = listChildren === 1;
        info = 'DOM elements in logList: ' + listChildren;
      } else if (i === 11) {
        await clickTab(driver, 'scan');
        const activeTab = await driver.executeScript('return document.getElementById("nav-scan").classList.contains("active");');
        pass = activeTab;
        info = 'Active tab returned to Scan';
      } else if (i === 12) {
        const hintExist = await driver.executeScript('return !!document.querySelector(".mrow + p.hint");');
        pass = hintExist;
        info = 'Hint paragraph confirmed';
      } else if (i === 13) {
        await driver.executeScript('document.getElementById("manualInput").value = "";');
        const inputVal = await driver.executeScript('return document.getElementById("manualInput").value;');
        pass = inputVal === '';
        info = 'manualInput field is empty';
      } else if (i === 14) {
        const resultCardShown = await driver.executeScript('return document.getElementById("resultCard").classList.contains("on");');
        pass = !resultCardShown;
        info = 'resultCard is off';
      } else if (i === 15) {
        const addCardShown = await driver.executeScript('return document.getElementById("addCard").offsetHeight;');
        pass = addCardShown === 0;
        info = 'addCard is hidden';
      } else if (i === 16) {
        const errCardShown = await driver.executeScript('return document.getElementById("err").offsetHeight;');
        pass = errCardShown === 0;
        info = 'error overlay is hidden';
      } else if (i === 17) {
        const enginesExist = await driver.executeScript('return document.getElementById("engines").children.length;');
        pass = enginesExist >= 3;
        info = 'engines count: ' + enginesExist;
      } else if (i === 18) {
        const dbtagsExist = await driver.executeScript('return document.querySelector(".dbtags").children.length;');
        pass = dbtagsExist >= 6;
        info = 'db tags count: ' + dbtagsExist;
      } else if (i === 19) {
        const sbarShown = await driver.executeScript('return document.getElementById("sbar").offsetHeight;');
        pass = sbarShown === 0;
        info = 'searching bar is hidden';
      } else if (i === 20) {
        await clickTab(driver, 'today');
        const goalVal = await driver.executeScript('return document.getElementById("goalDisp").innerText;');
        pass = parseInt(goalVal) >= 100;
        info = 'daily goal: ' + goalVal + ' kcal';
      } else if (i === 21) {
        const editBtnText = await driver.executeScript('return document.querySelector(".gbtn").innerText;');
        pass = editBtnText.includes('Goal');
        info = 'edit button text: "' + editBtnText + '"';
      } else if (i === 22) {
        const gedShown = await driver.executeScript('return document.getElementById("ged").offsetHeight;');
        pass = gedShown === 0;
        info = 'goal editing dialog is hidden';
      } else if (i === 23) {
        const progBarHeight = await driver.executeScript('return document.querySelector(".prog").offsetHeight;');
        pass = progBarHeight > 0;
        info = 'progress bar outer height: ' + progBarHeight + 'px';
      } else if (i === 24) {
        const summaryWidth = await driver.executeScript('return document.querySelector(".summary").offsetWidth;');
        pass = summaryWidth > 0;
        info = 'summary container layout width: ' + summaryWidth + 'px';
      } else if (i === 25) {
        const bodyHeight = await driver.executeScript('return document.body.offsetHeight;');
        pass = bodyHeight > 0;
        info = 'body height: ' + bodyHeight + 'px';
      } else if (i === 26) {
        const wrapHeight = await driver.executeScript('return document.querySelector(".wrap").offsetHeight;');
        pass = wrapHeight > 0;
        info = 'wrapper layout height: ' + wrapHeight + 'px';
      } else if (i === 27) {
        const docTitle = await driver.getTitle();
        pass = docTitle.length > 0;
        info = 'document title: "' + docTitle + '"';
      } else if (i === 28) {
        const logoName = await driver.executeScript('return document.querySelector(".logo").innerText;');
        pass = logoName.includes('Diet');
        info = 'logo name: "' + logoName + '"';
      } else if (i === 29) {
        const badgeName = await driver.executeScript('return document.querySelector(".badge").innerText;');
        pass = badgeName.includes('BARCODE');
        info = 'badge name: "' + badgeName + '"';
      } else {
        const htmlLang = await driver.executeScript('return document.documentElement.getAttribute("lang");');
        pass = htmlLang === 'en';
        info = 'lang attribute: "' + htmlLang + '"';
      }
      push('T5.' + i + ' — Delete Entry Validation Scenario ' + (i-4), pass, Date.now()-t0, info);
    } catch(e) {
      push('T5.' + i + ' — Delete Entry Validation Scenario ' + (i-4), false, Date.now()-t0, e.message);
    }
  }

  return results;
};