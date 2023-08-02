const puppeteer = require('puppeteer');
const randomstring = require('randomstring');
const { plugin } = require('puppeteer-with-fingerprints');

(async () => {

    const fingerprint = await plugin.fetch('', {
        tags: ['Microsoft Windows', 'Chrome'],
    });
    plugin.useFingerprint(fingerprint);

      
  const browser = await plugin.launch({ headless: false });

  const page1 = await browser.newPage();

  const page = await browser.newPage();

  await page1.goto('https://10minute-email.com/');

  await page1.waitForSelector('#i-email');

  const email = await page1.$eval('#i-email', (element) => element.value);
  
  console.log(`[${new Date()}] \x1b[32mAccount Creation Started ... \x1b[0m`);

  await page.goto('https://www.dofus.com/fr/mmorpg/jouer');

  await page.waitForTimeout(5000);
  await page.screenshot({ path: 'example.png' });

  await page.waitForSelector('.ak-accept');

  await page.click('.ak-accept');


  console.log(`[${new Date()}] \x1b[32mFilling Forms ...\x1b[0m`);

  const firstName = randomstring.generate({ length: 8, charset: 'alphabetic' });
  const lastName = randomstring.generate({ length: 8, charset: 'alphabetic' });
  const password = randomstring.generate({ length: 6, charset: 'AaBbCcDdEeFfGgHhTtVvUuXxYyWwZz' });
  const password2 = randomstring.generate({ length: 4, charset: '123456789123456789' });
  const password3 = randomstring.generate({ length: 2, charset: '@_-!' });

  const allPassword = password + password2 + password3;

  await page.waitForSelector('input[name="lastname"]');
  await page.waitForSelector('input[name="firstname"]');
  await page.waitForSelector('input.form-control.ak-field-email');
  await page.waitForSelector('input[name="userpassword"]');
  await page.waitForSelector('input[name="user_password_confirm"]');
 
  await page.type('input[name="lastname"]', lastName);
  await page.type('input[name="firstname"]', firstName);
  await page.type('input.form-control.ak-field-email', email);
  await page.type('input[name="user_password_confirm"]', allPassword);
  await page.type('input[name="userpassword"]', allPassword);
   


  await page.waitForSelector('select[name="birth_day"]');
  await page.waitForSelector('select[name="birth_month"]');
  await page.waitForSelector('select[name="birth_year"]');
 
  const randomBirthDay = Math.floor(Math.random() * 28) + 1;
 
  await page.select('select[name="birth_day"]', randomBirthDay.toString());
 
  const randomBirthMonth = Math.floor(Math.random() * 12) + 1;
 
  await page.select('select[name="birth_month"]', randomBirthMonth.toString());
 
  const randomBirthYear = Math.floor(Math.random() * (2005 - 1950 + 1)) + 1950;
 
  await page.select('select[name="birth_year"]', randomBirthYear.toString());
  
  await page.waitForSelector('.ak-submit');
  await page.click('.ak-submit');
  

  console.log(`[${new Date()}] \x1b[32mAccount Created Successfully \x1b[0m`);
  await page.waitForTimeout(3000);

  console.log(`Generated Email: ${email}`);
  console.log(`Generated Password: ${allPassword}`);

  await page.screenshot({ path: 'example.png' });

  //---------------- For Email ----------------//
  await page1.bringToFront();
  await page1.waitForSelector('li.mail-item-wrapper');

  await page1.click('li.mail-item-wrapper');
  
  await page1.waitForSelector('iframe.message-fr');

  const frame = page1.frames().find(frame => frame.name() === 'fullmessage');

  if (frame) {
    await frame.waitForSelector('a[target="_blank"][href^="https://www.dofus.com/fr/mmorpg/jouer?guid="]');

    await frame.click('a[target="_blank"][href^="https://www.dofus.com/fr/mmorpg/jouer?guid="]');

    await page1.waitForTimeout(1000); 
    page1.bringToFront(); 
  }
  await page1.screenshot({ path: 'example.png' });

  await browser.close();
})();
