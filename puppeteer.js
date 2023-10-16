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
            browser = await plugin.launch({ headless, args });
            console.log(`Using proxy ${proxy}`)
            currentProxyIndex++;
        } else {
            console.log('No more proxies in the file. Exiting.');
            break;
        }
    }
      
    const page1 = await browser.newPage();

    // ----- For Email ----- //
    const page = await browser.newPage();

    await page1.goto('https://10minute-email.com/');

    await page1.waitForSelector('#i-email');
    const currentTime = new Date().toLocaleTimeString();
    await page.waitForTimeout(2000);

    const email = await page1.$eval('#i-email', (element) => element.value);
    console.log(email);
    await page.waitForTimeout(2000);

    console.log(`[${currentTime}] \x1b[32mAccount Creation Started ... \x1b[0m`);

    // ----- For Account ----- //
    await page.goto('https://www.dofus.com/fr/mmorpg/jouer');

    await page.waitForTimeout(5000);

    await page.waitForSelector('.ak-accept');

    await page.click('.ak-accept');


    console.log(`[${currentTime}] \x1b[32mFilling Forms ...\x1b[0m`);

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
    

    console.log(`[${currentTime}] \x1b[32mAccount Created Successfully \x1b[0m`);
    await page.waitForTimeout(1000);

    //---------------- For Email ----------------//
    console.log(`[${currentTime}] \x1b[32mVerifying Account ... \x1b[0m`);

    await page1.bringToFront();


    await page1.waitForXPath('//span[text()="Refresh"]');

    // Find the span element with the text "Refresh"
    const [refreshSpan1] = await page1.$x('//span[text()="Refresh"]');

    // Click on the found span element
    if (refreshSpan1) {
      await refreshSpan1.click();
      await page1.waitForTimeout(2500); 
      await refreshSpan1.click();

    }

    await page1.waitForSelector('li.mail-item-wrapper');

    await page1.click('li.mail-item-wrapper');
    
    await page1.waitForSelector('iframe.message-fr');

    const frame = page1.frames().find(frame => frame.name() === 'fullmessage');

    if (frame) {
      await frame.waitForSelector('a[target="_blank"][href^="https://www.dofus.com/fr/mmorpg/jouer?guid="]');

      const link = await frame.$eval('a[target="_blank"][href^="https://www.dofus.com/fr/mmorpg/jouer?guid="]', element => element.href);
      await page1.goto(link);

    }

    console.log(`[${currentTime}] \x1b[32mAccount Verified Successfully \x1b[0m`);
    
    // ----------------- For Ankama Shield ----------------- //
    await page1.waitForSelector('.ak-logo-desktop');
    await page1.click('.ak-logo-desktop');

    console.log(`[${currentTime}] \x1b[32mDisabling Ankama Shield ... \x1b[0m`);

    // Navigate to "https://account.ankama.com/fr/securite"
    await page1.goto('https://account.ankama.com/fr/securite');

    await page1.waitForTimeout(8000); 

    // Click on the element with class '.ak-accept'
    await page1.waitForSelector('.ak-accept');
    await page1.click('.ak-accept');



    await page1.waitForSelector('input[name="password"]');
    await page1.type('input[name="password"]', allPassword);

    await page1.waitForSelector('input[name="login"]');
    const inputElement = await page1.$('input[name="login"]');
    
    // Clear the input field
    await inputElement.click({ clickCount: 3 }); // Select and delete existing value
    await inputElement.type(email); // Type the new value

    // Wait for and click on the link with the specified CSS selector
    await page1.waitForSelector('#login_sub');
    await page1.click('#login_sub');

    await page1.waitForTimeout(2000); 

    // Wait for and click on another link with the specified CSS selector

    await page.bringToFront()
    await page.goto('https://10minute-email.com/');

    await page.waitForXPath('//span[text()="Refresh"]');

    // Find the span element with the text "Refresh"
    const [refreshSpan] = await page.$x('//span[text()="Refresh"]');

    // Click on the found span element
    if (refreshSpan) {
      await refreshSpan.click();
      await page1.waitForTimeout(4500);
      await refreshSpan.click();
      await page1.waitForTimeout(1500);
      await refreshSpan.click();

    }

    await page.waitForSelector('li.mail-item-wrapper');

    await page.click('li.mail-item-wrapper');
    
    await page.waitForSelector('iframe.message-fr');

    const frame2 = page.frames().find(frame => frame.name() === 'fullmessage');

    if (frame2) {
      // Switch to the iframe
      await frame2.waitForSelector('span[style*="background:#ddd;"]');

      // Get the text content of the element inside the iframe
      const code = await frame2.$eval('span[style*="background:#ddd;"]', element => element.textContent);
      // Switch back to the main page
      await page1.bringToFront();

      // Find the input field by ID and enter the extracted code
      await page1.waitForSelector('input.form-control[name="security_code"]');
      await page1.type('input.form-control[name="security_code"]', code);
    

      // Find and click the submit button with the specified CSS selector
      await page1.waitForSelector('.ak-container.ak-block-button-form input[type="submit"]');
      await page1.click('.ak-container.ak-block-button-form input[type="submit"]');
    }
    await page1.waitForTimeout(1500)
    await page1.goto('https://account.ankama.com/fr/securite/ankama-shield');
    await page1.waitForTimeout(1500);

    await page1.waitForSelector('a.btn.btn-primary.btn-sm[href="/fr/securite/ankama-shield/desactiver"]');

    // Click on the anchor element
    await page1.click('a.btn.btn-primary.btn-sm[href="/fr/securite/ankama-shield/desactiver"]');

    await page.bringToFront()
    await page.goto('https://10minute-email.com/');

    await page.waitForXPath('//span[text()="Refresh"]');

    // Find the span element with the text "Refresh"
    const [refreshSpan3] = await page.$x('//span[text()="Refresh"]');

    // Click on the found span element
    if (refreshSpan3) {
      await refreshSpan3.click();
      await page1.waitForTimeout(4500);
      await refreshSpan3.click();
      await page1.waitForTimeout(1500);
      await refreshSpan3.click();

    }
    await page.waitForSelector('li.mail-item-wrapper');

    await page.click('li.mail-item-wrapper');
    
    await page.waitForSelector('iframe.message-fr');

    const frame3 = page.frames().find(frame => frame.name() === 'fullmessage');

    if (frame3) {
      // Switch to the iframe
      await frame3.waitForSelector('span[style*="background:#ddd;"]');
      const code = await frame3.$eval('span[style*="background:#ddd;"]', element => element.textContent);

      await page1.waitForTimeout(2000);

      await page1.bringToFront();

      // Find the input field by ID and enter the extracted code
    
      await page1.waitForSelector('input.form-control.ak-field-code[name="code"]');
      await page1.type('input.form-control.ak-field-code[name="code"]', code);

      // Find and click the submit button with the specified CSS selector
      await page1.waitForSelector('input[type="submit"].btn.btn-primary.btn-lg[value="Valider"]');
      await page1.click('input[type="submit"].btn.btn-primary.btn-lg[value="Valider"]');
    }
    console.log(`[${currentTime}] \x1b[32mAnkama Shield Disabled Successfully \x1b[0m`);

    fs.appendFile(outputFileName, `Generated Email: ${email}\nGenerated Password: ${allPassword}\n`, (err) => {
      if (err) {
          console.error(`Error writing to file: ${err}`);
      } else {
          console.log('Data has been written to the file.');
      }
  });

  }
    await browser.close();
})();
