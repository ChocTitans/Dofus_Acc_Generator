const puppeteer = require('puppeteer');
const randomstring = require('randomstring');
const { plugin } = require('puppeteer-with-fingerprints');
const fs = require('fs');


(async () => {

  const proxyFile = 'proxy-files.txt';
  const proxies = fs.readFileSync(proxyFile, 'utf8').trim().split('\n');
  const proxyCount = proxies.length;
  const headless = false;
  let currentProxyIndex = 0;
  const outputFileName = 'accs.txt';

  const fingerprint = await plugin.fetch('', {
      tags: ['Microsoft Windows', 'Chrome'],
  });
  plugin.useFingerprint(fingerprint);

  for (let i = 0; i < 3 * proxyCount; i++) { // Change the loop count as needed
    if (i % 3 === 0) {
        if (currentProxyIndex < proxies.length) {
            const proxy = proxies[currentProxyIndex];
            const args = [`--proxy-server=socks:${proxy}`];
            const browserName = `browser${currentProxyIndex + 1}`; // Unique browser name
            browser = await plugin.launch({ headless, args });
            console.log(`Using proxy ${proxy}`)
            currentProxyIndex++;
        } else {
            console.log('No more proxies in the file. Exiting.');
            break;
        }
    }
      
    const page1 = await browser.newPage();


    await page1.goto('https://10minute-email.com/');
    await page1.waitForSelector('.el-button');
    await page1.click('.el-button');

    await page1.click('button.el-button.el-button--small.el-button--primary');

    await page1.waitForTimeout(2000);

    await page1.waitForSelector('#i-email');
    const currentTime = new Date().toLocaleTimeString();
    await page1.waitForTimeout(2000);

    const email = await page1.$eval('#i-email', (element) => element.value);
    console.log(email);
    await page1.waitForTimeout(2000);

  }
  await browser.close(); // Close the browser using the unique name

})();
