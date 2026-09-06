const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const { expect } = require("chai");

const APP_URL = process.env.APP_URL || "http://localhost:3000";

describe("React App UI", function () {
  this.timeout(20000);
  let driver;

  before(async function () {
    const options = new chrome.Options();
    options.addArguments("--headless=new");
    options.addArguments("--no-sandbox");
    options.addArguments("--disable-dev-shm-usage");
    options.addArguments("--disable-gpu");
    options.addArguments("--window-size=1920,1080");

    driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .build();
  });

  after(async function () {
    if (driver) {
      await driver.quit();
    }
  });

  it("should load the app and find the root element", async function () {
    await driver.get(APP_URL);
    const root = await driver.wait(
      until.elementLocated(By.id("root")),
      10000
    );
    expect(root).to.not.be.null;
  });

  it("should display the 'Learn React' link", async function () {
    await driver.get(APP_URL);
    const link = await driver.wait(
      until.elementLocated(By.linkText("Learn React")),
      10000
    );
    const text = await link.getText();
    expect(text).to.equal("Learn React");
  });
});
