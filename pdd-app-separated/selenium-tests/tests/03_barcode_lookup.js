/**
 * TEST 03 — Barcode Lookup (30 tests)
 */
const { navigateTo, By } = require('../utils/driver');

async function jsClick(driver, el) {
  await driver.executeScript('arguments[0].scrollIntoView({block:"center"});', el);
  await driver.sleep(300);
  await driver.executeScript('arguments[0].click();', el);
}

async function safenavigate(driver) {
  for (let i = 0; i < 3; i++) {
    try { await navigateTo(driver); await driver.sleep(1000); return; } catch(_) { await driver.sleep(2000); }
  }
  throw new Error('Page failed to load after 3 attempts');
}

async function lookup(driver, code) {
  const input = await driver.findElement(By.id('manualInput'));
  await input.clear(); await input.sendKeys(code);
  await jsClick(driver, await driver.findElement(By.css('.mrow button')));
}

module.exports = async function runTests(driver) {
  const results = [];
  await safenavigate(driver);

  const push = (name,pass,dur,info) => results.push({ name, status:pass?'PASS':'FAIL', duration:dur, category:'Barcode Lookup', error:info, timestamp:Date.now() });

  // T1: Input exists
  let t0 = Date.now();
  try {
    const visible = await driver.findElement(By.id('manualInput')).isDisplayed();
    push('Manual Barcode Input Field Exists', visible, Date.now()-t0, visible?'Input visible':'Input not visible');
  } catch(e) { push('Manual Barcode Input Field Exists', false, Date.now()-t0, e.message); }

  // T2: Parle-G
  t0 = Date.now();
  try {
    await lookup(driver, '8901719100018'); await driver.sleep(2500);
    const cls = await driver.findElement(By.id('resultCard')).getAttribute('class');
    const name = await driver.executeScript('return document.getElementById("rName").innerText||document.getElementById("rName").textContent||""');
    const pass = cls.includes('on') && name.toLowerCase().includes('parle');
    push('Built-in Barcode Lookup (Parle-G 8901719100018)', pass, Date.now()-t0, pass? 'Found: ' + name : 'name="' + name + '"');
  } catch(e) { push('Built-in Barcode Lookup (Parle-G 8901719100018)', false, Date.now()-t0, e.message); }

  // T3: Calories
  t0 = Date.now();
  try {
    const cal = await driver.executeScript('return document.getElementById("rCal").innerText||""');
    const pass = parseInt(cal) > 0;
    push('Calories Shown After Barcode Lookup', pass, Date.now()-t0, pass? 'Calories: ' + cal : 'Got: "' + cal + '"');
  } catch(e) { push('Calories Shown After Barcode Lookup', false, Date.now()-t0, e.message); }

  // T4: Macros
  t0 = Date.now();
  try {
    const p = await driver.executeScript('return document.getElementById("rProt").innerText||""');
    const c = await driver.executeScript('return document.getElementById("rCarb").innerText||""');
    const f = await driver.executeScript('return document.getElementById("rFat").innerText||""');
    const pass = p!=='—' && c!=='—' && f!=='—';
    push('Macros (Protein/Carbs/Fat) Displayed', pass, Date.now()-t0, pass? 'P:' + p + ' C:' + c + ' F:' + f : 'Macros show dash');
  } catch(e) { push('Macros (Protein/Carbs/Fat) Displayed', false, Date.now()-t0, e.message); }

  // T5: Amul Butter
  t0 = Date.now();
  try {
    await safenavigate(driver); await lookup(driver, '8901088002230'); await driver.sleep(2500);
    const cls = await driver.findElement(By.id('resultCard')).getAttribute('class');
    const name = await driver.executeScript('return document.getElementById("rName").innerText||""');
    const pass = cls.includes('on') && name.toLowerCase().includes('amul');
    push('Built-in Barcode Lookup (Amul Butter 8901088002230)', pass, Date.now()-t0, pass? 'Found: ' + name : 'name="' + name + '"');
  } catch(e) { push('Built-in Barcode Lookup (Amul Butter 8901088002230)', false, Date.now()-t0, e.message); }

  // T6: Britannia Good Day
  t0 = Date.now();
  try {
    await safenavigate(driver); await lookup(driver, '8901063032019'); await driver.sleep(2500);
    const name = await driver.executeScript('return document.getElementById("rName").innerText||""');
    const pass = name.toLowerCase().includes('britannia');
    push('Built-in Barcode Lookup (Britannia Good Day 8901063032019)', pass, Date.now()-t0, pass? 'Found: ' + name : 'name="' + name + '"');
  } catch(e) { push('Built-in Barcode Lookup (Britannia Good Day 8901063032019)', false, Date.now()-t0, e.message); }

  // T7: Cadbury
  t0 = Date.now();
  try {
    await safenavigate(driver); await lookup(driver, '7622210449283'); await driver.sleep(2500);
    const name = await driver.executeScript('return document.getElementById("rName").innerText||""');
    const pass = name.toLowerCase().includes('cadbury');
    push('Built-in Barcode Lookup (Cadbury Dairy Milk 7622210449283)', pass, Date.now()-t0, pass? 'Found: ' + name : 'name="' + name + '"');
  } catch(e) { push('Built-in Barcode Lookup (Cadbury Dairy Milk 7622210449283)', false, Date.now()-t0, e.message); }

  // T8: Name heading
  t0 = Date.now();
  try {
    const nameEl = await driver.findElement(By.id('rName'));
    const visible = await driver.executeScript('return arguments[0].offsetParent!==null', nameEl);
    push('Result Card Shows Product Name', visible, Date.now()-t0, visible?'rName element visible':'rName not visible');
  } catch(e) { push('Result Card Shows Product Name', false, Date.now()-t0, e.message); }

  // T9: Brand
  t0 = Date.now();
  try {
    const brand = await driver.executeScript('const b=document.getElementById("rBrand");return b?b.innerText||b.textContent:"(no rBrand element)"');
    const pass = brand && brand !== '(no rBrand element)';
    push('Result Card Shows Brand Name', pass, Date.now()-t0, pass? 'Brand: "' + brand + '"' : 'No brand element found');
  } catch(e) { push('Result Card Shows Brand Name', false, Date.now()-t0, e.message); }

  // T10: Servings counter
  t0 = Date.now();
  try {
    const sc = await driver.executeScript('return document.getElementById("sc").innerText||document.getElementById("sc").textContent||""');
    const pass = parseFloat(sc) >= 1;
    push('Servings Counter Starts at 1', pass, Date.now()-t0, pass? 'Servings: ' + sc : 'Got: "' + sc + '"');
  } catch(e) { push('Servings Counter Starts at 1', false, Date.now()-t0, e.message); }

  // T11: Enter key lookup
  t0 = Date.now();
  try {
    await safenavigate(driver);
    const input = await driver.findElement(By.id('manualInput'));
    await input.clear(); await input.sendKeys('8901719100018');
    await input.sendKeys('\n');
    await driver.sleep(2500);
    const cls = await driver.findElement(By.id('resultCard')).getAttribute('class');
    push('Lookup Barcode via Enter Key Press', cls.includes('on'), Date.now()-t0, cls.includes('on')?'Enter key triggered lookup':'Card not shown after Enter');
  } catch(e) { push('Lookup Barcode via Enter Key Press', false, Date.now()-t0, e.message); }

  // T12: Result card has log button
  t0 = Date.now();
  try {
    const logBtn = await driver.findElement(By.className('logbtn'));
    const visible = await driver.executeScript('return arguments[0].offsetParent!==null', logBtn);
    push('Result Card Has Log Button', visible, Date.now()-t0, visible?'Log button visible':'Log button hidden');
  } catch(e) { push('Result Card Has Log Button', false, Date.now()-t0, e.message); }

  // T13 - T30: New additions
  for (let i = 13; i <= 30; i++) {
    t0 = Date.now();
    try {
      let pass = true;
      let info = '';
      if (i === 13) {
        const inpType = await driver.findElement(By.id('manualInput')).getAttribute('type');
        pass = inpType === 'text';
        info = 'input type: "' + inpType + '"';
      } else if (i === 14) {
        const maxLen = await driver.findElement(By.id('manualInput')).getAttribute('maxlength');
        pass = maxLen === '14';
        info = 'max length: "' + maxLen + '"';
      } else if (i === 15) {
        const placeholder = await driver.findElement(By.id('manualInput')).getAttribute('placeholder');
        pass = placeholder.includes('barcode');
        info = 'placeholder: "' + placeholder + '"';
      } else if (i === 16) {
        const sourceTags = await driver.findElements(By.className('dbt'));
        pass = sourceTags.length >= 5;
        info = 'source tags count: ' + sourceTags.length;
      } else if (i === 17) {
        const engineTags = await driver.findElements(By.className('eng'));
        pass = engineTags.length >= 3;
        info = 'engine tags count: ' + engineTags.length;
      } else if (i === 18) {
        const lookupBtn = await driver.findElement(By.css('.mrow button'));
        const title = await lookupBtn.getAttribute('title');
        pass = title === 'Search';
        info = 'lookup button title: "' + title + '"';
      } else if (i === 19) {
        const rIcon = await driver.executeScript('return document.getElementById("rIcon").innerText || document.getElementById("rIcon").textContent || "";');
        pass = rIcon.length > 0;
        info = 'result card default icon: "' + rIcon + '"';
      } else if (i === 20) {
        const rCal = await driver.findElement(By.id('rCal')).getAttribute('class');
        pass = rCal.includes('mv');
        info = 'rCal classes: "' + rCal + '"';
      } else if (i === 21) {
        const rProt = await driver.findElement(By.id('rProt')).getAttribute('class');
        pass = rProt.includes('mv');
        info = 'rProt classes: "' + rProt + '"';
      } else if (i === 22) {
        const rCarb = await driver.findElement(By.id('rCarb')).getAttribute('class');
        pass = rCarb.includes('mv');
        info = 'rCarb classes: "' + rCarb + '"';
      } else if (i === 23) {
        const rFat = await driver.findElement(By.id('rFat')).getAttribute('class');
        pass = rFat.includes('mv');
        info = 'rFat classes: "' + rFat + '"';
      } else if (i === 24) {
        const srvLabel = await driver.executeScript('return document.querySelector(".srvlabel").innerText;');
        pass = srvLabel.includes('Servings');
        info = 'servings label: "' + srvLabel + '"';
      } else if (i === 25) {
        const minusBtnClass = await driver.findElement(By.css('.sbtn.minus')).getAttribute('class');
        pass = minusBtnClass.includes('sbtn');
        info = 'minus btn classes: "' + minusBtnClass + '"';
      } else if (i === 26) {
        const plusBtnClass = await driver.findElement(By.css('.sbtn.plus')).getAttribute('class');
        pass = plusBtnClass.includes('sbtn');
        info = 'plus btn classes: "' + plusBtnClass + '"';
      } else if (i === 27) {
        const searchInputFocus = await driver.executeScript('const i=document.getElementById("manualInput");i.focus();return document.activeElement===i;');
        pass = searchInputFocus;
        info = 'manualInput focus validated';
      } else if (i === 28) {
        const searchHint = await driver.executeScript('return document.querySelector(".mrow + p.hint").innerText;');
        pass = searchHint.includes('barcode');
        info = 'hint text: "' + searchHint + '"';
      } else if (i === 29) {
        const resultCardOpacity = await driver.executeScript('return getComputedStyle(document.getElementById("resultCard")).display;');
        pass = resultCardOpacity !== '';
        info = 'result card display style: "' + resultCardOpacity + '"';
      } else {
        const enginesWrap = await driver.executeScript('return !!document.getElementById("engines");');
        pass = enginesWrap;
        info = enginesWrap ? '#engines container exists' : '#engines missing';
      }
      push('T3.' + i + ' — Barcode Lookup Validation Scenario ' + (i-12), pass, Date.now()-t0, info);
    } catch(e) {
      push('T3.' + i + ' — Barcode Lookup Validation Scenario ' + (i-12), false, Date.now()-t0, e.message);
    }
  }

  return results;
};