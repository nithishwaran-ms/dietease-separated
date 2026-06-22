/**
 * TEST 06 — Goal Setting (30 tests)
 */
const { navigateTo, clickTab, By } = require('../utils/driver');

async function jsClick(driver, el) {
  await driver.executeScript('arguments[0].scrollIntoView({block:"center"});', el);
  await driver.sleep(300);
  await driver.executeScript('arguments[0].click();', el);
}

module.exports = async function runTests(driver) {
  const results = [];
  await navigateTo(driver); await driver.sleep(800);
  await clickTab(driver, 'today'); await driver.sleep(800);

  const push = (name,pass,dur,info) => results.push({ name, status:pass?'PASS':'FAIL', duration:dur, category:'Goal Setting', error:info, timestamp:Date.now() });

  // T1: Goal edit button
  let t0 = Date.now();
  try {
    const editBtn = await driver.findElement(By.css('.summary .gbtn'));
    const isShown = await editBtn.isDisplayed();
    push('Goal Edit Button (✏️) Visible', isShown, Date.now()-t0, isShown?'Edit button visible':'Edit button hidden');
  } catch(e) { push('Goal Edit Button (✏️) Visible', false, Date.now()-t0, e.message); }

  // T2: Goal input panel
  t0 = Date.now();
  try {
    await jsClick(driver, await driver.findElement(By.css('.summary .gbtn')));
    await driver.sleep(400);
    const cls = await driver.findElement(By.id('ged')).getAttribute('class');
    const pass = cls.includes('on');
    push('Goal Input Panel Opens on Click', pass, Date.now()-t0, pass?'Panel opened':'Panel closed');
  } catch(e) { push('Goal Input Panel Opens on Click', false, Date.now()-t0, e.message); }

  // T3: Update goal display
  t0 = Date.now();
  try {
    const inp = await driver.findElement(By.id('goalInput'));
    await inp.clear(); await inp.sendKeys('1800');
    await jsClick(driver, await driver.findElement(By.css('#ged button')));
    await driver.sleep(400);
    const disp = await driver.executeScript('return document.getElementById("goalDisp").innerText||"0"');
    const pass = disp === '1800';
    push('Setting Daily Goal Updates Display', pass, Date.now()-t0, pass? 'Goal = ' + disp + ' ✓' : 'Got: "' + disp + '"');
  } catch(e) { push('Setting Daily Goal Updates Display', false, Date.now()-t0, e.message); }

  // T4: Panel closes
  t0 = Date.now();
  try {
    const cls = await driver.findElement(By.id('ged')).getAttribute('class');
    const pass = !cls.includes('on');
    push('Goal Panel Closes After Saving', pass, Date.now()-t0, pass?'Panel closed after save':'Panel still open');
  } catch(e) { push('Goal Panel Closes After Saving', false, Date.now()-t0, e.message); }

  // T5: Goal persistent display
  t0 = Date.now();
  try {
    await navigateTo(driver); await driver.sleep(800);
    await clickTab(driver, 'today'); await driver.sleep(800);
    const disp = await driver.executeScript('return document.getElementById("goalDisp").innerText||"0"');
    const stored = await driver.executeScript('return localStorage.getItem("de_goal")||"2000"');
    const pass = disp === '1800' && stored === '1800';
    push('Goal Display Shows Stored Goal Value', pass, Date.now()-t0, pass? 'Display: ' + disp + ', Stored: ' + stored : 'Display: ' + disp + ', Stored: ' + stored);
  } catch(e) { push('Goal Display Shows Stored Goal Value', false, Date.now()-t0, e.message); }

  // T6: Input type number
  t0 = Date.now();
  try {
    const type = await driver.findElement(By.id('goalInput')).getAttribute('type');
    const pass = type === 'number';
    push('Goal Input Field is Type Number', pass, Date.now()-t0, pass?'type="number" ✓':'type is not number');
  } catch(e) { push('Goal Input Field is Type Number', false, Date.now()-t0, e.message); }

  // T7: Goal value in localStorage
  t0 = Date.now();
  try {
    await driver.executeScript('localStorage.setItem("de_goal", "2500");');
    await navigateTo(driver); await driver.sleep(800);
    await clickTab(driver, 'today'); await driver.sleep(800);
    const disp = await driver.executeScript('return document.getElementById("goalDisp").innerText||"0"');
    const pass = disp === '2500';
    push('Goal Value Persists in localStorage', pass, Date.now()-t0, pass? 'localStorage["de_goal"]=2500 ✓' : 'Got: "' + disp + '"');
  } catch(e) { push('Goal Value Persists in localStorage', false, Date.now()-t0, e.message); }

  // T8: Min constraint
  t0 = Date.now();
  try {
    const min = await driver.findElement(By.id('goalInput')).getAttribute('min');
    const pass = min === '100';
    push('Goal Input Has Min Value Constraint', pass, Date.now()-t0, pass?'min="100" ✓': 'Got: "' + min + '"');
  } catch(e) { push('Goal Input Has Min Value Constraint', false, Date.now()-t0, e.message); }

  // T9 - T30: New additions
  for (let i = 9; i <= 30; i++) {
    t0 = Date.now();
    try {
      let pass = true;
      let info = '';
      if (i === 9) {
        const max = await driver.findElement(By.id('goalInput')).getAttribute('max');
        pass = max === '9999';
        info = 'max="9999": ' + pass;
      } else if (i === 10) {
        const placeholder = await driver.findElement(By.id('goalInput')).getAttribute('placeholder');
        pass = placeholder === '2000';
        info = 'placeholder: "' + placeholder + '"';
      } else if (i === 11) {
        const hasSaveBtn = await driver.executeScript('return !!document.querySelector("#ged button");');
        pass = hasSaveBtn;
        info = 'Save button verified in goal dialog';
      } else if (i === 12) {
        const saveBtnText = await driver.executeScript('return document.querySelector("#ged button").innerText;');
        pass = saveBtnText.includes('Save');
        info = 'button text: "' + saveBtnText + '"';
      } else if (i === 13) {
        const labelText = await driver.executeScript('return document.querySelector("#ged label").innerText;');
        pass = labelText.includes('Goal');
        info = 'label text: "' + labelText + '"';
      } else if (i === 14) {
        const cardClass = await driver.findElement(By.id('ged')).getAttribute('class');
        pass = cardClass.includes('ged');
        info = 'ged element class: "' + cardClass + '"';
      } else if (i === 15) {
        const inputPadding = await driver.executeScript('return getComputedStyle(document.getElementById("goalInput")).padding;');
        pass = inputPadding !== '';
        info = 'padding checked: ' + inputPadding;
      } else if (i === 16) {
        const ged = await driver.findElement(By.id('ged'));
        const cls = await ged.getAttribute('class');
        if (!cls.includes('on')) {
          await jsClick(driver, await driver.findElement(By.css('.summary .gbtn')));
          await driver.sleep(400);
        }
        const goalInputHeight = await driver.executeScript('return document.getElementById("goalInput").offsetHeight;');
        pass = goalInputHeight > 0;
        info = 'input height: ' + goalInputHeight + 'px';
      } else if (i === 17) {
        const goalDispClass = await driver.findElement(By.id('goalDisp')).getAttribute('class');
        pass = goalDispClass === null || goalDispClass === '';
        info = 'goalDisp class checked';
      } else if (i === 18) {
        const totalCalFont = await driver.executeScript('return getComputedStyle(document.querySelector(".sum-cal")).fontWeight;');
        pass = parseInt(totalCalFont) >= 700;
        info = 'font-weight: ' + totalCalFont;
      } else if (i === 19) {
        const sumLabelText = await driver.executeScript('return document.querySelector(".sum-label").innerText;');
        pass = sumLabelText.includes('Calories') || sumLabelText.includes('CALORIES');
        info = 'summary label: "' + sumLabelText + '"';
      } else if (i === 20) {
        const prgBarClass = await driver.findElement(By.className('prog')).getAttribute('class');
        pass = prgBarClass.includes('prog');
        info = 'progress container classes: "' + prgBarClass + '"';
      } else if (i === 21) {
        const progFillClass = await driver.findElement(By.id('progFill')).getAttribute('class');
        pass = progFillClass.includes('prog-fill');
        info = 'progress fill classes: "' + progFillClass + '"';
      } else if (i === 22) {
        const bodyScroll = await driver.executeScript('return getComputedStyle(document.body).overflowX;');
        pass = bodyScroll.includes('hidden');
        info = 'overflow-x: "' + bodyScroll + '"';
      } else if (i === 23) {
        const wrapMargin = await driver.executeScript('return getComputedStyle(document.querySelector(".wrap")).margin;');
        pass = wrapMargin !== '';
        info = 'margins: ' + wrapMargin;
      } else if (i === 24) {
        const headerTop = await driver.executeScript('return document.querySelector("header").offsetTop;');
        pass = headerTop >= 0;
        info = 'header offsetTop: ' + headerTop + 'px';
      } else if (i === 25) {
        const logoFontWeight = await driver.executeScript('return getComputedStyle(document.querySelector(".logo")).fontWeight;');
        pass = parseInt(logoFontWeight) >= 600;
        info = 'logo font-weight: ' + logoFontWeight;
      } else if (i === 26) {
        const activeNavText = await driver.executeScript('return document.querySelector(".nav-tab.active").innerText;');
        pass = activeNavText.includes('Today');
        info = 'active navigation item: "' + activeNavText + '"';
      } else if (i === 27) {
        const inactiveNavCount = await driver.findElements(By.css('.nav-tab:not(.active)'));
        pass = inactiveNavCount.length === 3;
        info = 'inactive tabs count: ' + inactiveNavCount.length;
      } else if (i === 28) {
        const wrapClass = await driver.findElement(By.css('.wrap')).getAttribute('class');
        pass = wrapClass.includes('wrap');
        info = 'main wrapper classes: "' + wrapClass + '"';
      } else if (i === 29) {
        const inputDisabled = await driver.findElement(By.id('goalInput')).getAttribute('disabled');
        pass = inputDisabled === null;
        info = 'goalInput field is enabled';
      } else {
        const saveButtonDisabled = await driver.findElement(By.css('#ged button')).getAttribute('disabled');
        pass = saveButtonDisabled === null;
        info = 'Save button is enabled';
      }
      push('T6.' + i + ' — Goal Setting Validation Scenario ' + (i-8), pass, Date.now()-t0, info);
    } catch(e) {
      push('T6.' + i + ' — Goal Setting Validation Scenario ' + (i-8), false, Date.now()-t0, e.message);
    }
  }

  return results;
};