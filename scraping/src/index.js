const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto('https://udyamregistration.gov.in/UdyamRegistration.aspx', { waitUntil: 'networkidle2' });

  const formSchema = await page.evaluate(() => {
    const fields = [];
    document.querySelectorAll('input, select, textarea, button').forEach(el => {
      fields.push({
        tag: el.tagName,
        type: el.type || null,
        name: el.name || null,
        id: el.id || null,
        label: document.querySelector(`label[for="${el.id}"]`)?.innerText || null,
        placeholder: el.placeholder || null,
        required: el.required || false,
        pattern: el.getAttribute('pattern') || null,
        options: el.tagName === 'SELECT'
          ? Array.from(el.options).map(o => ({ value: o.value, text: o.innerText }))
          : null
      });
    });
    return fields;
  });

  // Save with indentation for readability
  fs.writeFileSync('./scrapedData.json', JSON.stringify(formSchema, null, 2), 'utf-8');

  console.log("Scraped data saved to scrapedData.json");
  await browser.close();
})();
