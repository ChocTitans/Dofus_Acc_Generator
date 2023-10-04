const { Cluster } = require('puppeteer-cluster');
const puppeteer = require('puppeteer');
const { plugin } = require('puppeteer-with-fingerprints');

(async () => {
  // Create a cluster with 2 workers
  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_CONTEXT,
    maxConcurrency: 2,
  });

  const fingerprint = await plugin.fetch('', {
    tags: ['Microsoft Windows', 'Chrome'],
  });
  plugin.useFingerprint(fingerprint);


  // Define the first scraping task function
  await cluster.task(async ({ page, data }) => {
    await yourFirstScrapingFunction(page);
  });

  // Define the second scraping task function
  await cluster.task(async ({ page, data }) => {
    await yourSecondScrapingFunction(page);
  });

  // Queue the tasks
  cluster.queue({});
  cluster.queue({});

  // Shutdown after everything is done
  await cluster.idle();
  await cluster.close();
})();

async function yourFirstScrapingFunction(page) {
  const browser = await plugin.launch({ headless: false });
  const page1 = await browser.newPage();

  await page1.goto('https://10minute-email.com/');
  await page1.waitForSelector('#i-email');

  const currentTime = new Date().toLocaleTimeString();
  const email = await page1.$eval('#i-email', (element) => element.value);

  console.log(`[${currentTime}] \x1b[32mAccount Creation Started ... \x1b[0m`);
  console.log(email);

  await page1.close();
  await browser.close();
}

async function yourSecondScrapingFunction(page) {
  const browser = await plugin.launch({ headless: false });
  const page1 = await browser.newPage();

  await page1.goto('https://10minute-email.com/');
  await page1.waitForSelector('#i-email');

  const currentTime = new Date().toLocaleTimeString();
  const email = await page1.$eval('#i-email', (element) => element.value);

  console.log(`[${currentTime}] \x1b[32mAccount Creation Started ... \x1b[0m`);
  console.log(email);

  await page1.close();
  await browser.close();
}
