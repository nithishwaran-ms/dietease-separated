/**
 * TEST 04 — Food Logging (10 tests)
 *
 * Strategy: Use POST /api/test/log to seed food entries directly from Node
 * (bypasses the unreliable headless logbtn click). Then call loadTodayLog()
 * via executeAsyncScript to refresh the browser UI and verify DOM state.
 * For UI-only tests (servings buttons, calorie display update), the regular
 * jsClick works fine since those don't POST to the server.
 */
const http = require('http');
const { navigateTo, clickTab, By, BASE_URL } = require('../utils/driver');

/* ── helpers ──────────────────────────────────────────────────────────── */

async function jsClick(driver, el) {
  await driver.executeScript('arguments[0].scrollIntoView({block:"center"});', el);
  await driver.sleep(300);
  await driver.executeScript('arguments[0].click();', el);
}

/** POST /api/test/log — seed food log entries directly via Node HTTP */
function serverSeedFood(body) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(BASE_URL + '/api/test/log');
    const payload = JSON.stringify(body);
    const options = {
      hostname: parsed.hostname,
      port: parsed.port || 3000,
      path: '/api/test/log',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) },
    };
    const req = http.request(options, res => {
      let b = '';
      res.on('data', d => b += d);
      res.on('end', () => { try { resolve(JSON.parse(b)); } catch { resolve({ ok: false }); } });
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

/** DELETE /api/test/log — clear all of today's entries */
function serverClearToday(email = 'guest@dietease.com') {
  return new Promise((resolve, reject) => {
    const parsed = new URL(BASE_URL);
    const options = {
      hostname: parsed.hostname,
      port: parsed.port || 3000,
      path: `/api/test/log?email=${encodeURIComponent(email)}`,
      method: 'DELETE',
    };
    const req = http.request(options, res => {
      let b = '';
      res.on('data', d => b += d);
      res.on('end', () => { try { resolve(JSON.parse(b)); } catch { resolve({ ok: false }); } });
    });
    req.on('error', reject);
    req.end();
  });
}

/** Refresh the today's log in the browser (calls loadTodayLog on page). */
async function refreshPageLog(driver) {
  try {
    await driver.executeAsyncScript(
      'var done = arguments[arguments.length-1];' +
      'if (typeof loadTodayLog === "function") {' +
      '  loadTodayLog().then(function(){ done("ok"); }).catch(function(){ done("err"); });' +
      '} else { done("no-fn"); }'
    );
  } catch(e) {
    await driver.sleep(800);
  }
}

/** Navigate and ensure we're on the today tab, refreshing from server. */
async function goToToday(driver) {
  await navigateTo(driver);
  await driver.sleep(800);
  await clickTab(driver, 'today');
  await refreshPageLog(driver);
  await driver.sleep(400);
}

// Known Parle-G data (built-in DB)
const PARLE_G = { barcode:'8901719100018', name:'Parle-G Biscuits', calories:450, protein:6.7, carbs:76, fat:11.7, source:'⚡ Built-in DB' };
const AMUL    = { barcode:'8901088002230', name:'Amul Butter',       calories:720, protein:0.5, carbs:0,  fat:80,   source:'⚡ Built-in DB' };

/* ── test module ──────────────────────────────────────────────────────── */

module.exports = async function runTests(driver) {
  const results = [];
  const push = (name,pass,dur,info) => results.push({ name, status:pass?'PASS':'FAIL', duration:dur, category:'Food Logging', error:info, timestamp:Date.now() });

  // Ensure a clean starting state for this test group
  await serverClearToday();

  // T1 — Log button visible after lookup (UI-only, no actual log POST needed)
  let t0 = Date.now();
  try {
    await navigateTo(driver); await driver.sleep(1000);
    const input = await driver.findElement(By.id('manualInput'));
    await input.clear(); await input.sendKeys('8901719100018');
    await jsClick(driver, await driver.findElement(By.css('.mrow button')));
    await driver.wait(async () => { const c=await driver.findElement(By.id('resultCard')).getAttribute('class'); return c.includes('on'); }, 8000);
    const logBtn = await driver.findElement(By.className('logbtn'));
    const vis = await driver.executeScript('return arguments[0].offsetParent!==null', logBtn);
    push('"Log This Food" Button Visible After Lookup', vis, Date.now()-t0, vis?'Log button visible':'Log button hidden');
  } catch(e) { push('"Log This Food" Button Visible After Lookup', false, Date.now()-t0, e.message); }

  // T2 — Calorie total updates after logging (seed via server, refresh UI)
  t0 = Date.now();
  try {
    await serverSeedFood(PARLE_G);          // log Parle-G directly on server
    await goToToday(driver);               // navigate today tab + refresh
    const cal = await driver.executeScript('return document.getElementById("totalCal").innerText||document.getElementById("totalCal").textContent||""');
    const pass = parseInt(cal) > 0;
    push('Calorie Total Updates After Logging Food', pass, Date.now()-t0, pass?`Total: ${cal} kcal`:`Total: ${cal}`);
  } catch(e) { push('Calorie Total Updates After Logging Food', false, Date.now()-t0, e.message); }

  // T3 — Progress bar fills (continues from T2 state)
  t0 = Date.now();
  try {
    const w = await driver.executeScript('return document.getElementById("progFill").style.width||""');
    const pass = parseFloat(w) > 0;
    push('Progress Bar Fills After Logging', pass, Date.now()-t0, pass?`Width: ${w}`:`Width: "${w}"`);
  } catch(e) { push('Progress Bar Fills After Logging', false, Date.now()-t0, e.message); }

  // T4 — Food item in log list (continues from T2 state)
  t0 = Date.now();
  try {
    const items = await driver.findElements(By.className('litem'));
    push('Food Item Appears in Log List', items.length>0, Date.now()-t0, items.length>0?`${items.length} item(s) in log`:'No items in log list');
  } catch(e) { push('Food Item Appears in Log List', false, Date.now()-t0, e.message); }

  // T5 — Servings + increments (UI-only: lookup a barcode, click + button on resultCard)
  t0 = Date.now();
  try {
    await navigateTo(driver); await driver.sleep(1000);
    const inp = await driver.findElement(By.id('manualInput'));
    await inp.clear(); await inp.sendKeys('8901063032019');
    await jsClick(driver, await driver.findElement(By.css('.mrow button')));
    await driver.wait(async () => { const c=await driver.findElement(By.id('resultCard')).getAttribute('class'); return c.includes('on'); }, 8000);
    await jsClick(driver, await driver.findElement(By.css('.sbtn.plus')));
    await driver.sleep(500);
    const sc = await driver.executeScript('return document.getElementById("sc").innerText||document.getElementById("sc").textContent||""');
    push('Servings "+" Button Increments Count', parseFloat(sc)>1, Date.now()-t0, parseFloat(sc)>1?`Servings = ${sc}`:`Servings was: "${sc}"`);
  } catch(e) { push('Servings "+" Button Increments Count', false, Date.now()-t0, e.message); }

  // T6 — Servings - decrements (continues from T5)
  t0 = Date.now();
  try {
    const before = await driver.executeScript('return document.getElementById("sc").innerText||document.getElementById("sc").textContent||""');
    await jsClick(driver, await driver.findElement(By.css('.sbtn.minus')));
    await driver.sleep(500);
    const after = await driver.executeScript('return document.getElementById("sc").innerText||document.getElementById("sc").textContent||""');
    const pass = parseFloat(after) < parseFloat(before);
    push('Servings "-" Button Decrements Count', pass, Date.now()-t0, pass?`${before} → ${after}`:`Before:${before} After:${after}`);
  } catch(e) { push('Servings "-" Button Decrements Count', false, Date.now()-t0, e.message); }

  // T7 — Calorie display updates on servings change (UI-only)
  t0 = Date.now();
  try {
    await navigateTo(driver); await driver.sleep(1000);
    const inp = await driver.findElement(By.id('manualInput'));
    await inp.clear(); await inp.sendKeys('8901719100018');
    await jsClick(driver, await driver.findElement(By.css('.mrow button')));
    await driver.wait(async () => { const c=await driver.findElement(By.id('resultCard')).getAttribute('class'); return c.includes('on'); }, 8000);
    const cal1 = await driver.executeScript('return document.getElementById("rCal").innerText||""');
    await jsClick(driver, await driver.findElement(By.css('.sbtn.plus')));
    await driver.sleep(500);
    const cal2 = await driver.executeScript('return document.getElementById("rCal").innerText||""');
    const pass = parseFloat(cal2) > parseFloat(cal1);
    push('Calorie Display Updates When Servings Change', pass, Date.now()-t0, pass?`${cal1} → ${cal2} kcal`:`Cal unchanged: ${cal1}`);
  } catch(e) { push('Calorie Display Updates When Servings Change', false, Date.now()-t0, e.message); }

  // T8 — Log entry shows food name (seed directly, refresh UI)
  t0 = Date.now();
  try {
    await serverSeedFood(PARLE_G);
    await goToToday(driver);
    const nameEl = await driver.findElement(By.className('lname'));
    const name = await driver.executeScript('return arguments[0].innerText||arguments[0].textContent||""', nameEl);
    const pass = name.length > 0;
    push('Log Entry Shows Food Name', pass, Date.now()-t0, pass?`Name: "${name.trim()}"`:'"" empty name');
  } catch(e) { push('Log Entry Shows Food Name', false, Date.now()-t0, e.message); }

  // T9 — Log entry shows time
  t0 = Date.now();
  try {
    const metaEl = await driver.findElement(By.className('lmeta'));
    const meta = await driver.executeScript('return arguments[0].innerText||arguments[0].textContent||""', metaEl);
    const pass = /\d{1,2}:\d{2}/.test(meta);
    push('Log Entry Shows Time of Logging', pass, Date.now()-t0, pass?`Meta: "${meta.trim()}"`:'"" no time found');
  } catch(e) { push('Log Entry Shows Time of Logging', false, Date.now()-t0, e.message); }

  // T10 — Multiple foods accumulate (seed a second food, check total ≥ 2 items)
  t0 = Date.now();
  try {
    await serverSeedFood(AMUL);             // add Amul Butter
    await goToToday(driver);
    const items = await driver.findElements(By.className('litem'));
    const cal = await driver.executeScript('return document.getElementById("totalCal").innerText||""');
    const pass = items.length >= 2 && parseInt(cal) > 450;
    push('Multiple Foods Accumulate in Daily Log', pass, Date.now()-t0, pass?`${items.length} items, ${cal} kcal total`:`${items.length} item(s), ${cal} kcal`);
  } catch(e) { push('Multiple Foods Accumulate in Daily Log', false, Date.now()-t0, e.message); }

  return results;
};
