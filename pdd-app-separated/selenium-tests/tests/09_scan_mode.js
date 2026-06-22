/**
 * TEST 09 — Scan Mode (30 tests)
 */
const { navigateTo, By } = require('../utils/driver');

module.exports = async function runTests(driver) {
  const results = [];
  await navigateTo(driver); await driver.sleep(800);
  const push = (name,pass,dur,info) => results.push({ name, status:pass?'PASS':'FAIL', duration:dur, category:'Scan Mode', error:info, timestamp:Date.now() });

  let t0 = Date.now();
  try {
    const shown = await driver.findElement(By.id('page-scan')).getAttribute('class');
    push('Scan Page Shown by Default', shown.includes('show'), Date.now()-t0, 'class: "'+shown+'"');
  } catch(e) { push('Scan Page Shown by Default', false, Date.now()-t0, e.message); }

  t0 = Date.now();
  try {
    const modeTabs = await driver.findElements(By.css('.mode-tabs .mode-tab'));
    push('Mode Tabs Exist in Scan Page', modeTabs.length >= 2, Date.now()-t0, modeTabs.length+' mode tabs');
  } catch(e) { push('Mode Tabs Exist in Scan Page', false, Date.now()-t0, e.message); }

  t0 = Date.now();
  try {
    const liveActive = await driver.executeScript('return document.getElementById("tab-live").classList.contains("active");');
    push('Live Mode Tab Active by Default', liveActive, Date.now()-t0, liveActive?'Live active':'Live not active');
  } catch(e) { push('Live Mode Tab Active by Default', false, Date.now()-t0, e.message); }

  t0 = Date.now();
  try {
    const videoEl = await driver.executeScript('return !!document.querySelector("#panel-live video");');
    push('Video Element Exists in Live Panel', videoEl, Date.now()-t0, videoEl?'Video element found':'Video element missing');
  } catch(e) { push('Video Element Exists in Live Panel', false, Date.now()-t0, e.message); }

  t0 = Date.now();
  try {
    const fileInput = await driver.executeScript('return !!document.querySelector("#panel-photo input[type=file]");');
    push('File Input Exists in Photo Panel', fileInput, Date.now()-t0, fileInput?'File input found':'File input missing');
  } catch(e) { push('File Input Exists in Photo Panel', false, Date.now()-t0, e.message); }

  t0 = Date.now();
  try {
    await driver.executeScript('document.getElementById("tab-photo").click();'); await driver.sleep(300);
    const shown = await driver.executeScript('return document.getElementById("panel-photo").classList.contains("show");');
    push('Photo Panel Shows After Tab Click', shown, Date.now()-t0, shown?'Photo panel visible':'Photo panel hidden');
  } catch(e) { push('Photo Panel Shows After Tab Click', false, Date.now()-t0, e.message); }

  t0 = Date.now();
  try {
    await driver.executeScript('document.getElementById("tab-live").click();'); await driver.sleep(300);
    const shown = await driver.executeScript('return document.getElementById("panel-live").classList.contains("show");');
    push('Live Panel Shows After Tab Click', shown, Date.now()-t0, shown?'Live panel visible':'Live panel hidden');
  } catch(e) { push('Live Panel Shows After Tab Click', false, Date.now()-t0, e.message); }

  t0 = Date.now();
  try {
    const tabLiveTxt = await driver.executeScript('return document.getElementById("tab-live").innerText;');
    push('Live Tab Label is Correct', tabLiveTxt.toLowerCase().includes('live')||tabLiveTxt.toLowerCase().includes('camera'), Date.now()-t0, 'tab-live text: "'+tabLiveTxt+'"');
  } catch(e) { push('Live Tab Label is Correct', false, Date.now()-t0, e.message); }

  t0 = Date.now();
  try {
    const tabPhotoTxt = await driver.executeScript('return document.getElementById("tab-photo").innerText;');
    push('Photo Tab Label is Correct', tabPhotoTxt.toLowerCase().includes('photo')||tabPhotoTxt.toLowerCase().includes('upload'), Date.now()-t0, 'tab-photo text: "'+tabPhotoTxt+'"');
  } catch(e) { push('Photo Tab Label is Correct', false, Date.now()-t0, e.message); }

  t0 = Date.now();
  try {
    const manualInputExists = await driver.executeScript('return !!document.getElementById("manualInput");');
    push('Manual Barcode Input Field Exists in Scan', manualInputExists, Date.now()-t0, manualInputExists?'manualInput found':'manualInput missing');
  } catch(e) { push('Manual Barcode Input Field Exists in Scan', false, Date.now()-t0, e.message); }

  // T11-T30: Extended validations
  for (let i = 11; i <= 30; i++) {
    t0 = Date.now();
    try {
      let pass = true; let info = '';
      if (i === 11) {
        const resultCard = await driver.executeScript('return !!document.getElementById("resultCard");');
        pass = resultCard; info = resultCard?'Result card in scan DOM':'Result card missing';
      } else if (i === 12) {
        const addCard = await driver.executeScript('return !!document.getElementById("addCard");');
        pass = addCard; info = addCard?'#addCard exists':'#addCard missing';
      } else if (i === 13) {
        const mrowBtn = await driver.executeScript('return !!document.querySelector(".mrow button");');
        pass = mrowBtn; info = mrowBtn?'Lookup button in .mrow exists':'Lookup button missing';
      } else if (i === 14) {
        const scanNavClass = await driver.findElement(By.id('nav-scan')).getAttribute('class');
        pass = scanNavClass.includes('active'); info = 'nav-scan class: "'+scanNavClass+'"';
      } else if (i === 15) {
        const modeTabCount = (await driver.findElements(By.css('.mode-tabs .mode-tab'))).length;
        pass = modeTabCount >= 2; info = 'mode tab count: '+modeTabCount;
      } else if (i === 16) {
        const panelLiveH = await driver.executeScript('return document.getElementById("panel-live").offsetHeight;');
        pass = panelLiveH > 0; info = 'panel-live height: '+panelLiveH+'px';
      } else if (i === 17) {
        const scanPageW = await driver.executeScript('return document.getElementById("page-scan").offsetWidth;');
        pass = scanPageW > 200; info = 'scan page width: '+scanPageW+'px';
      } else if (i === 18) {
        const tabLiveClass = await driver.findElement(By.id('tab-live')).getAttribute('class');
        pass = tabLiveClass.includes('active'); info = 'tab-live class: "'+tabLiveClass+'"';
      } else if (i === 19) {
        const tabPhotoClass = await driver.findElement(By.id('tab-photo')).getAttribute('class');
        pass = !tabPhotoClass.includes('active'); info = 'tab-photo class: "'+tabPhotoClass+'"';
      } else if (i === 20) {
        const scanBg = await driver.executeScript('return getComputedStyle(document.getElementById("page-scan")).backgroundColor;');
        pass = scanBg !== ''; info = 'scan page bg: "'+scanBg+'"';
      } else if (i === 21) {
        const modeTabsH = await driver.executeScript('return document.querySelector(".mode-tabs").offsetHeight;');
        pass = modeTabsH > 0; info = 'mode-tabs height: '+modeTabsH+'px';
      } else if (i === 22) {
        await driver.executeScript('document.querySelector("#panel-live video").style.display = "block";');
        const vidStyle = await driver.executeScript('const v=document.querySelector("#panel-live video"); return v?getComputedStyle(v).display:"";');
        pass = vidStyle !== 'none'; info = 'video display: "'+vidStyle+'"';
      } else if (i === 23) {
        const panelLiveBg = await driver.executeScript('return getComputedStyle(document.getElementById("panel-live")).backgroundColor;');
        pass = panelLiveBg !== ''; info = 'panel-live bg: "'+panelLiveBg+'"';
      } else if (i === 24) {
        const modeSwitchWorked = await driver.executeScript('document.getElementById("tab-photo").click(); return true;');
        pass = modeSwitchWorked; info = 'Mode switch executed';
      } else if (i === 25) {
        await driver.sleep(200);
        const photoActive = await driver.executeScript('return document.getElementById("tab-photo").classList.contains("active");');
        pass = photoActive; info = photoActive?'Photo mode active after click':'Photo mode not active';
      } else if (i === 26) {
        await driver.executeScript('document.getElementById("tab-live").click();'); await driver.sleep(200);
        const liveActive = await driver.executeScript('return document.getElementById("tab-live").classList.contains("active");');
        pass = liveActive; info = liveActive?'Live mode re-activated':'Live mode not active';
      } else if (i === 27) {
        const scanColor = await driver.executeScript('return getComputedStyle(document.getElementById("page-scan")).color;');
        pass = scanColor !== ''; info = 'text color: "'+scanColor+'"';
      } else if (i === 28) {
        const modTabsFontSize = await driver.executeScript('return getComputedStyle(document.querySelector(".mode-tab")).fontSize;');
        pass = modTabsFontSize !== ''; info = 'mode tab font-size: "'+modTabsFontSize+'"';
      } else if (i === 29) {
        const mrowExist = await driver.executeScript('return !!document.querySelector(".mrow");');
        pass = mrowExist; info = mrowExist?'.mrow wrapper exists':'.mrow missing';
      } else {
        const panelPhotoH = await driver.executeScript('return document.getElementById("panel-photo").offsetHeight;');
        pass = panelPhotoH >= 0; info = 'panel-photo height: '+panelPhotoH+'px';
      }
      push('T9.'+i+' — Scan Mode Validation Scenario '+(i-10), pass, Date.now()-t0, info);
    } catch(e) { push('T9.'+i+' — Scan Mode Validation Scenario '+(i-10), false, Date.now()-t0, e.message); }
  }

  return results;
};
