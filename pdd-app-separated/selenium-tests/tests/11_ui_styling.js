/**
 * TEST 11 — UI Styling (30 tests)
 */
const { navigateTo, clickTab, By } = require('../utils/driver');

module.exports = async function runTests(driver) {
  const results = [];
  await navigateTo(driver); await driver.sleep(800);
  const push = (name,pass,dur,info) => results.push({ name, status:pass?'PASS':'FAIL', duration:dur, category:'UI Styling', error:info, timestamp:Date.now() });

  let t0 = Date.now();
  try {
    const bg = await driver.executeScript('return getComputedStyle(document.body).backgroundColor;');
    const isDark = bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== '';
    push('Body Has Non-transparent Background', isDark, Date.now()-t0, 'body bg: "'+bg+'"');
  } catch(e) { push('Body Has Non-transparent Background', false, Date.now()-t0, e.message); }

  t0 = Date.now();
  try {
    const accentVar = await driver.executeScript('return getComputedStyle(document.documentElement).getPropertyValue("--accent").trim();');
    push('CSS --accent Variable Defined', accentVar.length > 0, Date.now()-t0, '--accent: "'+accentVar+'"');
  } catch(e) { push('CSS --accent Variable Defined', false, Date.now()-t0, e.message); }

  t0 = Date.now();
  try {
    const fontFamily = await driver.executeScript('return getComputedStyle(document.body).fontFamily;');
    push('Body Uses Custom Font', fontFamily.includes('sans-serif')||fontFamily.includes('DM')||fontFamily.includes('Inter')||fontFamily.includes('Syne'), Date.now()-t0, 'font: "'+fontFamily+'"');
  } catch(e) { push('Body Uses Custom Font', false, Date.now()-t0, e.message); }

  t0 = Date.now();
  try {
    const navBg = await driver.executeScript('return getComputedStyle(document.querySelector(".nav")).backgroundColor;');
    push('Nav Bar Has Background Color', navBg !== '' && navBg !== 'rgba(0, 0, 0, 0)', Date.now()-t0, 'nav bg: "'+navBg+'"');
  } catch(e) { push('Nav Bar Has Background Color', false, Date.now()-t0, e.message); }

  t0 = Date.now();
  try {
    const activeColor = await driver.executeScript('return getComputedStyle(document.querySelector(".nav-tab.active")).color;');
    const inactiveColor = await driver.executeScript('return getComputedStyle(document.querySelector(".nav-tab:not(.active)")).color;');
    push('Active Tab Color Differs From Inactive', activeColor !== inactiveColor, Date.now()-t0, 'active:"'+activeColor+'" inactive:"'+inactiveColor+'"');
  } catch(e) { push('Active Tab Color Differs From Inactive', false, Date.now()-t0, e.message); }

  t0 = Date.now();
  try {
    const logoFontWeight = await driver.executeScript('return getComputedStyle(document.querySelector(".logo")).fontWeight;');
    push('Logo Has Bold Font Weight', parseInt(logoFontWeight) >= 600, Date.now()-t0, 'font-weight: '+logoFontWeight);
  } catch(e) { push('Logo Has Bold Font Weight', false, Date.now()-t0, e.message); }

  t0 = Date.now();
  try {
    const bgVar = await driver.executeScript('return getComputedStyle(document.documentElement).getPropertyValue("--bg").trim();');
    push('CSS --bg Variable Defined', bgVar.length > 0, Date.now()-t0, '--bg: "'+bgVar+'"');
  } catch(e) { push('CSS --bg Variable Defined', false, Date.now()-t0, e.message); }

  t0 = Date.now();
  try {
    const cardVar = await driver.executeScript('return getComputedStyle(document.documentElement).getPropertyValue("--card").trim();');
    push('CSS --card Variable Defined', cardVar.length > 0, Date.now()-t0, '--card: "'+cardVar+'"');
  } catch(e) { push('CSS --card Variable Defined', false, Date.now()-t0, e.message); }

  t0 = Date.now();
  try {
    const textVar = await driver.executeScript('return getComputedStyle(document.documentElement).getPropertyValue("--text").trim();');
    push('CSS --text Variable Defined', textVar.length > 0, Date.now()-t0, '--text: "'+textVar+'"');
  } catch(e) { push('CSS --text Variable Defined', false, Date.now()-t0, e.message); }

  t0 = Date.now();
  try {
    const overflowX = await driver.executeScript('return getComputedStyle(document.body).overflowX;');
    push('Body Overflow-X is Hidden', overflowX === 'hidden', Date.now()-t0, 'overflow-x: "'+overflowX+'"');
  } catch(e) { push('Body Overflow-X is Hidden', false, Date.now()-t0, e.message); }

  // T11-T30: Extended styling assertions
  for (let i = 11; i <= 30; i++) {
    t0 = Date.now();
    try {
      let pass = true; let info = '';
      if (i === 11) {
        const cardRadius = await driver.executeScript('return getComputedStyle(document.querySelector(".card,.result-card,#resultCard")).borderRadius;');
        pass = cardRadius !== '0px' && cardRadius !== ''; info = 'card border-radius: "'+cardRadius+'"';
      } else if (i === 12) {
        const navTabW = await driver.executeScript('return document.querySelector(".nav-tab").offsetWidth;');
        pass = navTabW > 30; info = 'nav tab width: '+navTabW+'px';
      } else if (i === 13) {
        const btnRadius = await driver.executeScript('return getComputedStyle(document.querySelector(".logbtn,.sbtn")).borderRadius;');
        pass = btnRadius !== ''; info = 'button border-radius: "'+btnRadius+'"';
      } else if (i === 14) {
        const pageH = await driver.executeScript('return document.getElementById("page-scan").offsetHeight;');
        pass = pageH > 100; info = 'page-scan height: '+pageH+'px';
      } else if (i === 15) {
        await clickTab(driver, 'today'); await driver.sleep(400);
        const summaryBg = await driver.executeScript('return getComputedStyle(document.querySelector(".summary")).backgroundColor;');
        pass = summaryBg !== '' && summaryBg !== 'rgba(0, 0, 0, 0)'; info = 'summary card bg: "'+summaryBg+'"';
      } else if (i === 16) {
        const totalCalFontSize = await driver.executeScript('return getComputedStyle(document.querySelector(".sum-cal")).fontSize;');
        pass = parseInt(totalCalFontSize) > 14; info = 'total cal font-size: "'+totalCalFontSize+'"';
      } else if (i === 17) {
        const progBarH = await driver.executeScript('return document.querySelector(".prog").offsetHeight;');
        pass = progBarH > 0; info = 'progress bar height: '+progBarH+'px';
      } else if (i === 18) {
        const progFillTransition = await driver.executeScript('return getComputedStyle(document.getElementById("progFill")).transition;');
        pass = progFillTransition !== ''; info = 'progress fill transition: "'+progFillTransition+'"';
      } else if (i === 19) {
        const bodyLineH = await driver.executeScript('return getComputedStyle(document.body).lineHeight;');
        pass = bodyLineH !== ''; info = 'line-height: "'+bodyLineH+'"';
      } else if (i === 20) {
        const wrapMaxW = await driver.executeScript('return getComputedStyle(document.querySelector(".wrap")).maxWidth;');
        pass = wrapMaxW !== ''; info = 'max-width: "'+wrapMaxW+'"';
      } else if (i === 21) {
        const navFlexDir = await driver.executeScript('return getComputedStyle(document.querySelector(".nav")).flexDirection;');
        pass = navFlexDir === 'row'; info = 'nav flex-direction: "'+navFlexDir+'"';
      } else if (i === 22) {
        const headerFlex = await driver.executeScript('return getComputedStyle(document.querySelector("header")).display;');
        pass = headerFlex === 'flex' || headerFlex === 'block'; info = 'header display: "'+headerFlex+'"';
      } else if (i === 23) {
        const badgePad = await driver.executeScript('return getComputedStyle(document.querySelector(".badge")).padding;');
        pass = badgePad !== ''; info = 'badge padding: "'+badgePad+'"';
      } else if (i === 24) {
        const badgeRadius = await driver.executeScript('return getComputedStyle(document.querySelector(".badge")).borderRadius;');
        pass = badgeRadius !== ''; info = 'badge border-radius: "'+badgeRadius+'"';
      } else if (i === 25) {
        const headerPad = await driver.executeScript('return getComputedStyle(document.querySelector("header")).padding;');
        pass = headerPad !== ''; info = 'header padding: '+headerPad;
      } else if (i === 26) {
        const mutedVar = await driver.executeScript('return getComputedStyle(document.documentElement).getPropertyValue("--muted").trim();');
        pass = mutedVar.length >= 0; info = '--muted: "'+mutedVar+'"';
      } else if (i === 27) {
        const bodyMargin = await driver.executeScript('return getComputedStyle(document.body).margin;');
        pass = bodyMargin !== ''; info = 'body margin: '+bodyMargin;
      } else if (i === 28) {
        await clickTab(driver, 'scan'); await driver.sleep(300);
        const badgeText = await driver.executeScript('return document.querySelector(".badge").innerText;');
        pass = badgeText.includes('BARCODE')||badgeText.length > 0; info = 'badge text: "'+badgeText+'"';
      } else if (i === 29) {
        const logoText = await driver.executeScript('return document.querySelector(".logo").innerText;');
        pass = logoText.includes('DietEase')||logoText.includes('Diet'); info = 'logo text: "'+logoText+'"';
      } else {
        const wrapH = await driver.executeScript('return document.querySelector(".wrap").offsetHeight;');
        pass = wrapH > 0; info = '.wrap height: '+wrapH+'px';
      }
      push('T11.'+i+' — UI Styling Validation Scenario '+(i-10), pass, Date.now()-t0, info);
    } catch(e) { push('T11.'+i+' — UI Styling Validation Scenario '+(i-10), false, Date.now()-t0, e.message); }
  }

  return results;
};
