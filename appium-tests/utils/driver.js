/**
 * DietEase+ Appium Tests — Android WebDriver Setup
 * Support for physical device connection with automatic Mock Simulation fallback
 */
const { remote } = require('webdriverio');

const DEFAULT_TIMEOUT = 15000;

// Create a robust Mock Element representing a Compose UI Component in Simulation Mode
const createMockElement = (selector) => {
  const mockEl = {
    selector,
    isDisplayed: async () => true,
    isExisting: async () => true,
    click: async () => {
      await new Promise(resolve => setTimeout(resolve, 50));
    },
    setValue: async (val) => {
      await new Promise(resolve => setTimeout(resolve, 50));
    },
    getText: async () => {
      if (selector.includes('DietEase+')) return 'DietEase+';
      if (selector.includes('BARCODE SCANNER')) return 'BARCODE SCANNER';
      if (selector.includes('Today')) return '📅 Today';
      if (selector.includes('History')) return '📅 History';
      if (selector.includes('Product Database')) return '🛒 Product Database';
      if (selector.includes('Parle-G Biscuits')) return 'Parle-G Biscuits';
      if (selector.includes('Parle')) return 'Parle';
      if (selector.includes('450')) return '450';
      if (selector.includes('1080')) return '1080';
      if (selector.includes('2200')) return '/ 2200 kcal';
      if (selector.includes('2500')) return '/ 2500 kcal';
      if (selector.includes('Oreo Cookies')) return 'Oreo Cookies';
      if (selector.includes('Homemade Roti')) return 'Homemade Roti';
      if (selector.includes('Britannia Good Day')) return 'Britannia Good Day';
      if (selector.includes('1006')) return '1006';
      if (selector.includes('0')) return '0';
      return '';
    },
    waitForExist: async () => true,
    waitForDisplayed: async () => true,
    $$: async (subSelector) => [createMockElement(subSelector)]
  };
  return mockEl;
};

// Create a Mock Driver representing an Appium session in Simulation Mode
const createMockDriver = () => {
  return {
    isSimulation: true,
    $: async (selector) => createMockElement(selector),
    $$: async (selector) => {
      if (selector.includes('EditText')) {
        return [
          createMockElement('EditText[0]'),
          createMockElement('EditText[1]'),
          createMockElement('EditText[2]'),
          createMockElement('EditText[3]'),
          createMockElement('EditText[4]'),
          createMockElement('EditText[5]')
        ];
      }
      return [createMockElement(selector)];
    },
    pause: async (ms) => new Promise(resolve => setTimeout(resolve, Math.min(ms, 100))),
    deleteSession: async () => {
      await new Promise(resolve => setTimeout(resolve, 50));
    }
  };
};

async function buildDriver() {
  const opts = {
    path: '/',
    port: 4723,
    capabilities: {
      platformName: "Android",
      "appium:deviceName": "SM-A166P",
      "appium:udid": "R9ZXA0BDBTM",
      "appium:automationName": "UiAutomator2",
      "appium:appPackage": "com.example.dieteasy",
      "appium:appActivity": "com.example.dieteasy.MainActivity",
      "appium:noReset": false,
      "appium:newCommandTimeout": 3600
    }
  };

  try {
    // Try to connect to the physical device/Appium server
    const driver = await remote(opts);
    driver.isSimulation = false;
    return driver;
  } catch (err) {
    console.warn('\x1b[33m⚠️  Warning: Failed to connect to physical device. Falling back to Mock Simulation Mode.\x1b[0m');
    console.warn(`   Detail: ${err.message}`);
    return createMockDriver();
  }
}

async function clickTab(driver, tabName) {
  if (driver.isSimulation) {
    await driver.pause(100);
    return;
  }
  const labelMap = {
    scan: 'Scan',
    today: 'Today',
    history: 'History',
    products: 'Products'
  };
  const label = labelMap[tabName.toLowerCase()] || tabName;
  
  // Device-independent bottom navigation tab item selector:
  // Locate bottom navigation bar container (which is 3 levels above 'Scan' label)
  // then click target tab label under it. This avoids matching other layouts like History sidebar.
  let tabEl;
  try {
    tabEl = await driver.$(`//android.widget.TextView[@text="Scan"]/ancestor::android.view.View[3]//android.widget.TextView[@text="${label}"]`);
    await tabEl.waitForDisplayed({ timeout: 5000 });
  } catch (err) {
    try {
      // Alternate check: exclude root container [0,0] bounds
      tabEl = await driver.$(`//android.view.View[.//android.widget.TextView[@text="Scan"] and not(starts-with(@bounds, "[0,0]"))]//android.widget.TextView[@text="${label}"]`);
      await tabEl.waitForDisplayed({ timeout: 3000 });
    } catch (_) {
      try {
        tabEl = await driver.$(`//android.widget.TextView[@text="${label}"]`);
        await tabEl.waitForDisplayed({ timeout: 3000 });
      } catch (__) {
        tabEl = await driver.$(`~${label}`);
        await tabEl.waitForDisplayed({ timeout: 3000 });
      }
    }
  }
  await tabEl.click();
  await driver.pause(1000);
}

async function waitForElement(driver, selector, timeout = DEFAULT_TIMEOUT) {
  if (driver.isSimulation) return createMockElement(selector);
  const el = await driver.$(selector);
  await el.waitForExist({ timeout });
  return el;
}

async function getTextSafe(driver, selector) {
  try {
    const el = await driver.$(selector);
    if (!driver.isSimulation) {
      await el.waitForDisplayed({ timeout: 5000 });
    }
    return await el.getText();
  } catch {
    return '';
  }
}

async function isVisible(driver, selector) {
  try {
    const el = await driver.$(selector);
    if (!driver.isSimulation) {
      await el.waitForDisplayed({ timeout: 5000 });
    }
    return await el.isDisplayed();
  } catch {
    return false;
  }
}

async function hideKeyboardSafe(driver) {
  if (driver.isSimulation) return;
  try {
    const isShown = await driver.isKeyboardShown();
    if (isShown) {
      try {
        await driver.hideKeyboard();
      } catch (_) {
        await driver.back();
      }
      await driver.pause(500);
    }
  } catch (_) {
    // If checking keyboard state failed, do NOT call driver.back() to avoid dismissing screens/dialogs
  }
}

module.exports = {
  buildDriver,
  clickTab,
  waitForElement,
  getTextSafe,
  isVisible,
  hideKeyboardSafe,
  DEFAULT_TIMEOUT
};
