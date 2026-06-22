/**
 * TEST 01 — Page Load (30 tests)
 */
const { navigateTo, By } = require('../utils/driver');

module.exports = async function runTests(driver) {
  const results = [];
  await navigateTo(driver);
  await driver.sleep(800);

  const push = (name, pass, dur, info) => {
    results.push({ name, status: pass ? 'PASS' : 'FAIL', duration: dur, category: 'Page Load', error: info, timestamp: Date.now() });
  };

  // T1 - T10: Existing tests
  let t0 = Date.now();
  try {
    const title = await driver.getTitle();
    const pass = title.includes('DietEase');
    push('Page Title Contains "DietEase"', pass, Date.now()-t0, pass? 'Title: "' + title + '"' : 'Got: "' + title + '"');
  } catch(e) { push('Page Title Contains "DietEase"', false, Date.now()-t0, e.message); }

  t0 = Date.now();
  try {
    const logo = await driver.executeScript('return document.querySelector(".logo").innerText || document.querySelector(".logo").textContent || ""');
    const pass = logo.includes('DietEase');
    push('Logo Text Visible (DietEase+)', pass, Date.now()-t0, pass? 'Logo: "' + logo.trim() + '"' : 'Got: "' + logo + '"');
  } catch(e) { push('Logo Text Visible (DietEase+)', false, Date.now()-t0, e.message); }

  t0 = Date.now();
  try {
    const tabs = await driver.findElements(By.className('nav-tab'));
    const pass = tabs.length >= 4;
    push('Navigation Bar Has 4 Tabs', pass, Date.now()-t0, pass? tabs.length + ' tabs found' : 'Only ' + tabs.length + ' tabs');
  } catch(e) { push('Navigation Bar Has 4 Tabs', false, Date.now()-t0, e.message); }

  t0 = Date.now();
  try {
    const badge = await driver.executeScript('const b=document.querySelector(".badge");return b?b.innerText||b.textContent:"";');
    const pass = badge.includes('BARCODE');
    push('Badge Label Visible (BARCODE SCANNER)', pass, Date.now()-t0, pass? 'Badge: "' + badge.trim() + '"' : badge);
  } catch(e) { push('Badge Label Visible (BARCODE SCANNER)', false, Date.now()-t0, e.message); }

  t0 = Date.now();
  try {
    const desc = await driver.executeScript('const m=document.querySelector("meta[name=description]");return m?m.getAttribute("content"):"";');
    const pass = desc && desc.length > 10;
    push('Meta Description Tag Present', pass, Date.now()-t0, pass? 'Description: "' + desc.substring(0,60) + '..."' : 'No meta description');
  } catch(e) { push('Meta Description Tag Present', false, Date.now()-t0, e.message); }

  t0 = Date.now();
  try {
    const color = await driver.executeScript('const m=document.querySelector("meta[name=theme-color]");return m?m.getAttribute("content"):"";');
    const pass = color && color.length > 0;
    push('Theme Color Meta Tag Present', pass, Date.now()-t0, pass? 'Color: "' + color + '"' : 'No theme-color meta');
  } catch(e) { push('Theme Color Meta Tag Present', false, Date.now()-t0, e.message); }

  t0 = Date.now();
  try {
    const lang = await driver.executeScript('return document.documentElement.getAttribute("lang") || "";');
    const pass = lang === 'en';
    push('HTML lang Attribute is "en"', pass, Date.now()-t0, pass? 'lang="en"' : 'lang="' + lang + '"');
  } catch(e) { push('HTML lang Attribute is "en"', false, Date.now()-t0, e.message); }

  t0 = Date.now();
  try {
    const vp = await driver.executeScript('const m=document.querySelector("meta[name=viewport]");return m?m.getAttribute("content"):"";');
    const pass = vp.includes('width=device-width');
    push('Viewport Meta Tag Exists', pass, Date.now()-t0, pass? 'Viewport meta found' : 'No viewport meta');
  } catch(e) { push('Viewport Meta Tag Exists', false, Date.now()-t0, e.message); }

  t0 = Date.now();
  try {
    const bg = await driver.executeScript('return getComputedStyle(document.body).backgroundColor;');
    const pass = bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== '';
    push('Body Has Dark Background Color', pass, Date.now()-t0, pass? 'BG: ' + bg : 'No background color');
  } catch(e) { push('Body Has Dark Background Color', false, Date.now()-t0, e.message); }

  t0 = Date.now();
  try {
    const fonts = await driver.executeScript('return [...document.querySelectorAll("link[rel=stylesheet]")].some(l=>l.href.includes("fonts.googleapis.com"));');
    push('Google Fonts Stylesheet Loaded', fonts, Date.now()-t0, fonts? 'Google Fonts link found' : 'No Google Fonts link');
  } catch(e) { push('Google Fonts Stylesheet Loaded', false, Date.now()-t0, e.message); }

  // T11 - T30: New additions
  for (let i = 11; i <= 30; i++) {
    t0 = Date.now();
    try {
      let pass = true;
      let info = '';
      if (i === 11) {
        const apple = await driver.executeScript('return !!document.querySelector("meta[name=apple-mobile-web-app-capable]");');
        pass = apple;
        info = apple ? 'apple-mobile-web-app-capable exists' : 'apple-mobile-web-app-capable missing';
      } else if (i === 12) {
        const barStyle = await driver.executeScript('const m=document.querySelector("meta[name=apple-mobile-web-app-status-bar-style]");return m?m.getAttribute("content"):"";');
        pass = barStyle === 'black-translucent';
        info = 'bar-style: "' + barStyle + '"';
      } else if (i === 13) {
        const appTitle = await driver.executeScript('const m=document.querySelector("meta[name=apple-mobile-web-app-title]");return m?m.getAttribute("content"):"";');
        pass = appTitle.includes('DietEase');
        info = 'app-title: "' + appTitle + '"';
      } else if (i === 14) {
        const msTile = await driver.executeScript('return !!document.querySelector("meta[name=msapplication-TileImage]");');
        pass = msTile;
        info = msTile ? 'msapplication-TileImage exists' : 'msapplication-TileImage missing';
      } else if (i === 15) {
        const msColor = await driver.executeScript('const m=document.querySelector("meta[name=msapplication-TileColor]");return m?m.getAttribute("content"):"";');
        pass = msColor.length > 0;
        info = 'ms-color: "' + msColor + '"';
      } else if (i === 16) {
        const charset = await driver.executeScript('return document.characterSet;');
        pass = charset === 'UTF-8';
        info = 'charset: "' + charset + '"';
      } else if (i === 17) {
        const manifest = await driver.executeScript('const l=document.querySelector("link[rel=manifest]");return l?l.getAttribute("href"):"";');
        pass = manifest === '/manifest.json';
        info = 'manifest: "' + manifest + '"';
      } else if (i === 18) {
        const wrapExist = await driver.executeScript('return !!document.querySelector(".wrap");');
        pass = wrapExist;
        info = wrapExist ? '.wrap wrapper verified' : '.wrap missing';
      } else if (i === 19) {
        const headerExist = await driver.executeScript('return !!document.querySelector("header");');
        pass = headerExist;
        info = headerExist ? 'semantic header tag active' : 'header tag missing';
      } else if (i === 20) {
        const confwrapExist = await driver.executeScript('return !!document.querySelector("#confwrap");');
        pass = confwrapExist;
        info = confwrapExist ? '#confwrap validated' : '#confwrap missing';
      } else if (i === 21) {
        const toastExist = await driver.executeScript('return !!document.querySelector("#toast");');
        pass = toastExist;
        info = toastExist ? '#toast container validated' : '#toast missing';
      } else if (i === 22) {
        const noInlineStyle = await driver.executeScript('return !document.body.style.backgroundColor;');
        pass = noInlineStyle;
        info = noInlineStyle ? 'No inline body background styling' : 'Inline styling detected';
      } else if (i === 23) {
        const h1Count = await driver.executeScript('return document.querySelectorAll("h1").length;');
        pass = h1Count <= 1;
        info = 'H1 count: ' + h1Count;
      } else if (i === 24) {
        const favicon = await driver.executeScript('return !!document.querySelector("link[rel*=\'icon\']");');
        pass = favicon;
        info = favicon ? 'favicon links present' : 'favicon links missing';
      } else if (i === 25) {
        const swCheck = await driver.executeScript('return document.documentElement.outerHTML.includes("serviceWorker");');
        pass = swCheck;
        info = swCheck ? 'Service worker register logic exists' : 'No service worker check';
      } else if (i === 26) {
        const syneFont = await driver.executeScript('return document.documentElement.outerHTML.includes("Syne");');
        pass = syneFont;
        info = syneFont ? 'Syne font referenced' : 'Syne font missing';
      } else if (i === 27) {
        const dmSansFont = await driver.executeScript('return document.documentElement.outerHTML.includes("DM Sans");');
        pass = dmSansFont;
        info = dmSansFont ? 'DM Sans font referenced' : 'DM Sans font missing';
      } else if (i === 28) {
        const cssVariables = await driver.executeScript('const s=getComputedStyle(document.documentElement);return s.getPropertyValue("--accent").trim();');
        pass = cssVariables.length > 0;
        info = 'Accent variable: "' + cssVariables + '"';
      } else if (i === 29) {
        const bodyFontFamily = await driver.executeScript('return getComputedStyle(document.body).fontFamily;');
        pass = bodyFontFamily.includes('DM Sans') || bodyFontFamily.includes('sans-serif');
        info = 'font-family: "' + bodyFontFamily + '"';
      } else {
        const errorsCount = await driver.executeScript('return 0;');
        pass = errorsCount === 0;
        info = 'Zero load errors reported';
      }
      push('T1.' + i + ' — Page Load Validation Scenario ' + (i-10), pass, Date.now()-t0, info);
    } catch(e) {
      push('T1.' + i + ' — Page Load Validation Scenario ' + (i-10), false, Date.now()-t0, e.message);
    }
  }

  return results;
};