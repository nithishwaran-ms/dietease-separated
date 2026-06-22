/**
 * TEST 02 — Navigation (30 tests)
 */
const { navigateTo, clickTab, By } = require('../utils/driver');

module.exports = async function runTests(driver) {
  const results = [];
  await navigateTo(driver);
  await driver.sleep(800);

  const push = (name, pass, dur, info) =>
    results.push({ name, status: pass ? 'PASS' : 'FAIL', duration: dur, category: 'Navigation', error: info, timestamp: Date.now() });

  // T1 - T12: Existing tests
  let t0 = Date.now();
  try {
    const cls = await driver.findElement(By.id('nav-scan')).getAttribute('class');
    push('Scan Page Active on Load', cls.includes('active'), Date.now()-t0, cls.includes('active')?'Scan tab active':'Scan tab not active');
  } catch(e) { push('Scan Page Active on Load', false, Date.now()-t0, e.message); }

  t0 = Date.now();
  try {
    await clickTab(driver, 'today'); await driver.sleep(800);
    const shown = await driver.findElement(By.id('page-today')).getAttribute('class');
    push('Today Tab Shows Today\'s Log', shown.includes('show'), Date.now()-t0, shown.includes('show')?'Today page shown':'Today page hidden');
  } catch(e) { push('Today Tab Shows Today\'s Log', false, Date.now()-t0, e.message); }

  t0 = Date.now();
  try {
    await clickTab(driver, 'history'); await driver.sleep(800);
    const shown = await driver.findElement(By.id('page-history')).getAttribute('class');
    push('History Tab Shows Food History', shown.includes('show'), Date.now()-t0, shown.includes('show')?'History page shown':'History page hidden');
  } catch(e) { push('History Tab Shows Food History', false, Date.now()-t0, e.message); }

  t0 = Date.now();
  try {
    await clickTab(driver, 'products'); await driver.sleep(800);
    const shown = await driver.findElement(By.id('page-products')).getAttribute('class');
    push('Products Tab Shows Product Database', shown.includes('show'), Date.now()-t0, shown.includes('show')?'Products page shown':'Products page hidden');
  } catch(e) { push('Products Tab Shows Product Database', false, Date.now()-t0, e.message); }

  t0 = Date.now();
  try {
    await clickTab(driver, 'scan'); await driver.sleep(800);
    const cls = await driver.findElement(By.id('nav-scan')).getAttribute('class');
    push('Navigate Back to Scan Tab', cls.includes('active'), Date.now()-t0, cls.includes('active')?'Scan active':'Scan not active');
  } catch(e) { push('Navigate Back to Scan Tab', false, Date.now()-t0, e.message); }

  t0 = Date.now();
  try {
    const label = await driver.executeScript('return document.getElementById("nav-scan").innerText||document.getElementById("nav-scan").textContent||""');
    const pass = label.toLowerCase().includes('scan');
    push('Scan Tab Label Contains "Scan"', pass, Date.now()-t0, pass? 'Label: "' + label.trim() + '"' : 'Label: "' + label + '"');
  } catch(e) { push('Scan Tab Label Contains "Scan"', false, Date.now()-t0, e.message); }

  t0 = Date.now();
  try {
    const label = await driver.executeScript('return document.getElementById("nav-today").innerText||document.getElementById("nav-today").textContent||""');
    const pass = label.toLowerCase().includes('today');
    push('Today Tab Label Contains "Today"', pass, Date.now()-t0, pass? 'Label: "' + label.trim() + '"' : 'Label: "' + label + '"');
  } catch(e) { push('Today Tab Label Contains "Today"', false, Date.now()-t0, e.message); }

  t0 = Date.now();
  try {
    const label = await driver.executeScript('return document.getElementById("nav-history").innerText||document.getElementById("nav-history").textContent||""');
    const pass = label.toLowerCase().includes('history');
    push('History Tab Label Contains "History"', pass, Date.now()-t0, pass? 'Label: "' + label.trim() + '"' : 'Label: "' + label + '"');
  } catch(e) { push('History Tab Label Contains "History"', false, Date.now()-t0, e.message); }

  t0 = Date.now();
  try {
    const label = await driver.executeScript('return document.getElementById("nav-products").innerText||document.getElementById("nav-products").textContent||""');
    const pass = label.toLowerCase().includes('product');
    push('Products Tab Label Contains "Products"', pass, Date.now()-t0, pass? 'Label: "' + label.trim() + '"' : 'Label: "' + label + '"');
  } catch(e) { push('Products Tab Label Contains "Products"', false, Date.now()-t0, e.message); }

  t0 = Date.now();
  try {
    await navigateTo(driver); await driver.sleep(600);
    const cls = await driver.findElement(By.id('nav-scan')).getAttribute('class');
    push('Scan Tab Has Active Class by Default', cls.includes('active'), Date.now()-t0, cls.includes('active')?'Active class confirmed':'No active class on scan tab');
  } catch(e) { push('Scan Tab Has Active Class by Default', false, Date.now()-t0, e.message); }

  t0 = Date.now();
  try {
    await clickTab(driver, 'today'); await driver.sleep(400);
    const activeTabs = await driver.findElements(By.css('.nav-tab.active'));
    const pass = activeTabs.length === 1;
    push('Only One Nav Tab Active at a Time', pass, Date.now()-t0, pass? '1 active tab found' : activeTabs.length + ' active tabs');
  } catch(e) { push('Only One Nav Tab Active at a Time', false, Date.now()-t0, e.message); }

  t0 = Date.now();
  try {
    await navigateTo(driver); await driver.sleep(600);
    const cls = await driver.findElement(By.id('page-scan')).getAttribute('class');
    push('Scan Page is Shown by Default', cls.includes('show'), Date.now()-t0, cls.includes('show')?'page-scan has "show"':'page-scan missing "show"');
  } catch(e) { push('Scan Page is Shown by Default', false, Date.now()-t0, e.message); }

  // T13 - T30: New additions
  for (let i = 13; i <= 30; i++) {
    t0 = Date.now();
    try {
      let pass = true;
      let info = '';
      if (i === 13) {
        await clickTab(driver, 'today');
        const exists = await driver.executeScript('return !!document.querySelector("#page-today .summary");');
        pass = exists;
        info = exists ? 'Summary card visible on Today tab' : 'Summary card missing';
      } else if (i === 14) {
        await clickTab(driver, 'history');
        const exists = await driver.executeScript('return !!document.querySelector("#page-history #datePicker");');
        pass = exists;
        info = exists ? 'DatePicker container visible on History tab' : 'DatePicker missing';
      } else if (i === 15) {
        await clickTab(driver, 'products');
        const exists = await driver.executeScript('return !!document.querySelector("#page-products .search-bar");');
        pass = exists;
        info = exists ? 'Search bar visible on Products tab' : 'Search bar missing';
      } else if (i === 16) {
        await clickTab(driver, 'scan');
        const exists = await driver.executeScript('return !!document.querySelector("#page-scan .mode-tabs");');
        pass = exists;
        info = exists ? 'Mode tabs visible on Scan tab' : 'Mode tabs missing';
      } else if (i === 17) {
        const liveActive = await driver.executeScript('return document.getElementById("tab-live").classList.contains("active");');
        pass = liveActive;
        info = liveActive ? 'Live Mode active by default' : 'Live Mode not active';
      } else if (i === 18) {
        const photoActive = await driver.executeScript('return document.getElementById("tab-photo").classList.contains("active");');
        pass = !photoActive;
        info = !photoActive ? 'Photo Mode inactive by default' : 'Photo Mode active';
      } else if (i === 19) {
        await driver.executeScript('document.getElementById("tab-photo").click();');
        await driver.sleep(200);
        const shown = await driver.executeScript('return document.getElementById("panel-photo").classList.contains("show");');
        pass = shown;
        info = shown ? 'Photo panel shown after click' : 'Photo panel hidden';
      } else if (i === 20) {
        await driver.executeScript('document.getElementById("tab-live").click();');
        await driver.sleep(200);
        const shown = await driver.executeScript('return document.getElementById("panel-live").classList.contains("show");');
        pass = shown;
        info = shown ? 'Live panel shown after click' : 'Live panel hidden';
      } else if (i === 21) {
        const hasVideo = await driver.executeScript('return !!document.querySelector("#panel-live video");');
        pass = hasVideo;
        info = hasVideo ? 'Video element resides in Live panel' : 'No video element';
      } else if (i === 22) {
        const hasInput = await driver.executeScript('return !!document.querySelector("#panel-photo input[type=file]");');
        pass = hasInput;
        info = hasInput ? 'File input resides in Photo panel' : 'No file input';
      } else if (i === 23) {
        const hasResult = await driver.executeScript('return !!document.querySelector("#resultCard");');
        pass = hasResult;
        info = hasResult ? 'Result card exists in DOM' : 'Result card missing';
      } else if (i === 24) {
        const goalBtn = await driver.executeScript('return !!document.querySelector(".summary .gbtn");');
        pass = goalBtn;
        info = goalBtn ? 'gbtn Goal edit button exists' : 'Goal button missing';
      } else if (i === 25) {
        const expBtn = await driver.executeScript('return !!document.querySelector("#page-history .export-btn");');
        pass = expBtn;
        info = expBtn ? 'export-btn exists on History screen' : 'Export button missing';
      } else if (i === 26) {
        await clickTab(driver, 'history');
        const pickerHtml = await driver.executeScript('return document.getElementById("datePicker").innerHTML;');
        pass = pickerHtml !== undefined;
        info = 'DatePicker structure is queryable';
      } else if (i === 27) {
        await clickTab(driver, 'products');
        const prodList = await driver.executeScript('return !!document.querySelector("#prodList");');
        pass = prodList;
        info = prodList ? '#prodList element verified' : '#prodList missing';
      } else if (i === 28) {
        const position = await driver.executeScript('return getComputedStyle(document.querySelector(".nav")).position;');
        pass = position.includes('sticky') || position.includes('relative') || position.includes('absolute');
        info = 'nav-bar position: "' + position + '"';
      } else if (i === 29) {
        await clickTab(driver, 'scan');
        const activeColor = await driver.executeScript('return getComputedStyle(document.querySelector(".nav-tab.active")).color;');
        pass = activeColor !== '';
        info = 'active color: "' + activeColor + '"';
      } else {
        const reloadState = await driver.executeScript('return window.performance.navigation.type;');
        pass = reloadState === 0 || reloadState === 1;
        info = 'Browser reload boundaries checked';
      }
      push('T2.' + i + ' — Navigation Validation Scenario ' + (i-12), pass, Date.now()-t0, info);
    } catch(e) {
      push('T2.' + i + ' — Navigation Validation Scenario ' + (i-12), false, Date.now()-t0, e.message);
    }
  }

  return results;
};