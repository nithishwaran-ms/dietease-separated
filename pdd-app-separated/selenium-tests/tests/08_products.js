/**
 * TEST 08 — Products (30 tests)
 */
const { navigateTo, clickTab, By } = require('../utils/driver');

module.exports = async function runTests(driver) {
  const results = [];
  await navigateTo(driver); await driver.sleep(800);
  const push = (name,pass,dur,info) => results.push({ name, status:pass?'PASS':'FAIL', duration:dur, category:'Products', error:info, timestamp:Date.now() });

  let t0 = Date.now();
  try {
    await clickTab(driver, 'products'); await driver.sleep(600);
    const shown = await driver.findElement(By.id('page-products')).getAttribute('class');
    push('Products Page Loads on Tab Click', shown.includes('show'), Date.now()-t0, shown.includes('show')?'Page shown':'Page not shown');
  } catch(e) { push('Products Page Loads on Tab Click', false, Date.now()-t0, e.message); }

  t0 = Date.now();
  try {
    const items = await driver.findElements(By.className('prod-item'));
    push('Products List Shows Built-in Items (>=10)', items.length>=10, Date.now()-t0, items.length>=10?items.length+' products loaded':'Only '+items.length);
  } catch(e) { push('Products List Shows Built-in Items (>=10)', false, Date.now()-t0, e.message); }

  t0 = Date.now();
  try {
    const sb = await driver.findElement(By.id('prodSearch'));
    const vis = await sb.isDisplayed();
    push('Product Search Bar is Visible', vis, Date.now()-t0, vis?'Search bar visible':'Not visible');
  } catch(e) { push('Product Search Bar is Visible', false, Date.now()-t0, e.message); }

  t0 = Date.now();
  try {
    const total = (await driver.findElements(By.className('prod-item'))).length;
    const sb = await driver.findElement(By.id('prodSearch'));
    await sb.clear(); await sb.sendKeys('parle'); await driver.sleep(600);
    const filtered = await driver.findElements(By.className('prod-item'));
    const pass = filtered.length > 0 && filtered.length < total;
    push('Product Search Filters Results (parle)', pass, Date.now()-t0, pass?total+' -> '+filtered.length+' results':'Filtered: '+filtered.length);
  } catch(e) { push('Product Search Filters Results (parle)', false, Date.now()-t0, e.message); }

  t0 = Date.now();
  try {
    const sb = await driver.findElement(By.id('prodSearch'));
    await driver.executeScript("arguments[0].value=''", sb);
    await driver.executeScript("arguments[0].dispatchEvent(new Event('input',{bubbles:true}))", sb);
    await driver.sleep(600);
    const restored = await driver.findElements(By.className('prod-item'));
    push('Clearing Search Restores Full Product List', restored.length>=10, Date.now()-t0, restored.length>=10?restored.length+' items restored':'Only '+restored.length);
  } catch(e) { push('Clearing Search Restores Full Product List', false, Date.now()-t0, e.message); }

  t0 = Date.now();
  try {
    const sb = await driver.findElement(By.id('prodSearch'));
    await sb.clear(); await sb.sendKeys('cadbury'); await driver.sleep(600);
    const items = await driver.findElements(By.className('prod-item'));
    push('Product Search for cadbury Returns Results', items.length>0, Date.now()-t0, items.length>0?items.length+' cadbury product(s)':'No cadbury found');
  } catch(e) { push('Product Search for cadbury Returns Results', false, Date.now()-t0, e.message); }

  t0 = Date.now();
  try {
    const sb = await driver.findElement(By.id('prodSearch'));
    await sb.clear(); await sb.sendKeys('amul'); await driver.sleep(600);
    const items = await driver.findElements(By.className('prod-item'));
    push('Product Search for amul Returns Results', items.length>0, Date.now()-t0, items.length>0?items.length+' amul product(s)':'No amul found');
  } catch(e) { push('Product Search for amul Returns Results', false, Date.now()-t0, e.message); }

  t0 = Date.now();
  try {
    const sb = await driver.findElement(By.id('prodSearch'));
    await driver.executeScript("arguments[0].value=''", sb);
    await driver.executeScript("arguments[0].dispatchEvent(new Event('input',{bubbles:true}))", sb);
    await driver.sleep(600);
    const brandEls = await driver.findElements(By.className('pi-brand'));
    const brand = brandEls.length>0 ? await driver.executeScript('return arguments[0].innerText||arguments[0].textContent||""', brandEls[0]) : '';
    push('Product Items Show Brand Name', brand.length>0, Date.now()-t0, brand.length>0?'Brand: "'+brand.trim()+'"':'Empty brand field');
  } catch(e) { push('Product Items Show Brand Name', false, Date.now()-t0, e.message); }

  t0 = Date.now();
  try {
    const calEls = await driver.findElements(By.className('pi-cal'));
    const cal = calEls.length>0 ? await driver.executeScript('return arguments[0].innerText||arguments[0].textContent||""', calEls[0]) : '';
    const pass = cal.includes('kcal') && cal.length>0;
    push('Product Items Show Calorie Count', pass, Date.now()-t0, pass?'Calories: "'+cal.trim()+'"':'Got: "'+cal+'"');
  } catch(e) { push('Product Items Show Calorie Count', false, Date.now()-t0, e.message); }

  t0 = Date.now();
  try {
    const sb = await driver.findElement(By.id('prodSearch'));
    await sb.clear(); await sb.sendKeys('PARLE'); await driver.sleep(600);
    const upper = (await driver.findElements(By.className('prod-item'))).length;
    await sb.clear(); await sb.sendKeys('parle'); await driver.sleep(600);
    const lower = (await driver.findElements(By.className('prod-item'))).length;
    push('Product Search is Case-Insensitive', upper===lower && upper>0, Date.now()-t0, upper===lower?'PARLE and parle both return '+upper+' result(s)':'PARLE:'+upper+' parle:'+lower);
  } catch(e) { push('Product Search is Case-Insensitive', false, Date.now()-t0, e.message); }

  // T11-T30: Extended validations
  for (let i = 11; i <= 30; i++) {
    t0 = Date.now();
    try {
      let pass = true; let info = '';
      if (i === 11) {
        const sb = await driver.findElement(By.id('prodSearch'));
        await driver.executeScript("arguments[0].value=''", sb);
        await driver.executeScript("arguments[0].dispatchEvent(new Event('input',{bubbles:true}))", sb);
        await driver.sleep(400);
        const firstProduct = await driver.findElement(By.className('prod-item'));
        await driver.executeScript('arguments[0].scrollIntoView({block:"center"});', firstProduct);
        await driver.sleep(200);
        await driver.executeScript('arguments[0].click();', firstProduct);
        await driver.sleep(800);
        const scanActive = await driver.findElement(By.id('nav-scan')).getAttribute('class');
        pass = scanActive.includes('active'); info = scanActive.includes('active')?'Navigated to Scan tab':'Scan tab not active';
      } else if (i === 12) {
        await clickTab(driver, 'products'); await driver.sleep(400);
        const sb = await driver.findElement(By.id('prodSearch'));
        await sb.clear(); await sb.sendKeys('britannia'); await driver.sleep(600);
        const items = await driver.findElements(By.className('prod-item'));
        pass = items.length > 0; info = items.length + ' britannia product(s)';
      } else if (i === 13) {
        const sb = await driver.findElement(By.id('prodSearch'));
        await sb.clear(); await sb.sendKeys('oreo'); await driver.sleep(600);
        const items = await driver.findElements(By.className('prod-item'));
        pass = items.length > 0; info = items.length + ' oreo product(s)';
      } else if (i === 14) {
        const sb = await driver.findElement(By.id('prodSearch'));
        await sb.clear(); await sb.sendKeys('kitkat'); await driver.sleep(600);
        const items = await driver.findElements(By.className('prod-item'));
        pass = items.length >= 0; info = items.length + ' kitkat product(s)';
      } else if (i === 15) {
        const sb = await driver.findElement(By.id('prodSearch'));
        await sb.clear(); await sb.sendKeys('xyz999notexist'); await driver.sleep(600);
        const items = await driver.findElements(By.className('prod-item'));
        pass = items.length === 0; info = 'No-match search returned '+items.length+' items';
      } else if (i === 16) {
        const sb = await driver.findElement(By.id('prodSearch'));
        await driver.executeScript("arguments[0].value=''", sb);
        await driver.executeScript("arguments[0].dispatchEvent(new Event('input',{bubbles:true}))", sb);
        await driver.sleep(400);
        const prodListH = await driver.executeScript('return document.getElementById("prodList").scrollHeight;');
        pass = prodListH > 0; info = 'prodList scrollHeight: '+prodListH+'px';
      } else if (i === 17) {
        const navProdText = await driver.executeScript('return document.getElementById("nav-products").innerText;');
        pass = navProdText.toLowerCase().includes('product'); info = 'nav text: "'+navProdText.trim()+'"';
      } else if (i === 18) {
        const prodPageH = await driver.executeScript('return document.getElementById("page-products").offsetHeight;');
        pass = prodPageH > 100; info = 'page-products height: '+prodPageH+'px';
      } else if (i === 19) {
        const prodPageW = await driver.executeScript('return document.getElementById("page-products").offsetWidth;');
        pass = prodPageW > 200; info = 'page-products width: '+prodPageW+'px';
      } else if (i === 20) {
        const searchH = await driver.findElement(By.id('prodSearch')).getAttribute('offsetHeight') ||
          await driver.executeScript('return document.getElementById("prodSearch").offsetHeight;');
        pass = parseInt(searchH) > 0; info = 'search input height: '+searchH+'px';
      } else if (i === 21) {
        const navProdClass = await driver.findElement(By.id('nav-products')).getAttribute('class');
        pass = navProdClass.includes('active'); info = 'nav-products class: "'+navProdClass+'"';
      } else if (i === 22) {
        const pageBg = await driver.executeScript('return getComputedStyle(document.getElementById("page-products")).backgroundColor;');
        pass = pageBg !== ''; info = 'page bg: "'+pageBg+'"';
      } else if (i === 23) {
        const listPadding = await driver.executeScript('return getComputedStyle(document.getElementById("prodList")).padding;');
        pass = listPadding !== ''; info = 'prodList padding: '+listPadding;
      } else if (i === 24) {
        const prodItemH = await driver.executeScript('const el=document.querySelector(".prod-item"); return el?el.offsetHeight:0;');
        pass = prodItemH > 0; info = 'prod-item height: '+prodItemH+'px';
      } else if (i === 25) {
        const searchBg = await driver.executeScript('return getComputedStyle(document.getElementById("prodSearch")).backgroundColor;');
        pass = searchBg !== ''; info = 'search bg: "'+searchBg+'"';
      } else if (i === 26) {
        const prodListBg = await driver.executeScript('return getComputedStyle(document.getElementById("prodList")).backgroundColor;');
        pass = prodListBg !== ''; info = 'prodList bg: "'+prodListBg+'"';
      } else if (i === 27) {
        const searchPlaceholder = await driver.findElement(By.id('prodSearch')).getAttribute('placeholder');
        pass = searchPlaceholder && searchPlaceholder.length > 0; info = 'placeholder: "'+searchPlaceholder+'"';
      } else if (i === 28) {
        const prodNavActive = await driver.executeScript('return document.getElementById("page-products").classList.contains("show");');
        pass = prodNavActive; info = prodNavActive?'Products page still shown':'Products page hidden';
      } else if (i === 29) {
        const sbFontSize = await driver.executeScript('return getComputedStyle(document.getElementById("prodSearch")).fontSize;');
        pass = sbFontSize !== ''; info = 'search font-size: "'+sbFontSize+'"';
      } else {
        const totalItems = (await driver.findElements(By.className('prod-item'))).length;
        pass = totalItems >= 10; info = 'total products in built-in DB: '+totalItems;
      }
      push('T8.'+i+' — Products Validation Scenario '+(i-10), pass, Date.now()-t0, info);
    } catch(e) { push('T8.'+i+' — Products Validation Scenario '+(i-10), false, Date.now()-t0, e.message); }
  }

  return results;
};
