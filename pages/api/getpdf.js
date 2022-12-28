// const { url } = require('inspector');
const puppeteer = require('puppeteer');

const newURLRendered = 'https://app.grupouseai.com/version-test/notificacao/-2012-mtyhxyi?n=1671626924744x890598798051770400';
  
  async function waitTillHTMLRendered(page, timeout = 30000) {
    const checkDurationMsecs = 1000;
    const maxChecks = timeout / checkDurationMsecs;
    let lastHTMLSize = 0;
    let checkCounts = 1;
    let countStableSizeIterations = 0;
    const minStableSizeIterations = 3;
  
    while (checkCounts++ <= maxChecks) {
      let html = await page.content();
      let currentHTMLSize = html.length;
  
      let bodyHTMLSize = await page.evaluate(() => document.body.innerHTML.length);
  
      console.log('last: ', lastHTMLSize, ' <> curr: ', currentHTMLSize, " body html size: ", bodyHTMLSize);
  
      if (lastHTMLSize != 0 && currentHTMLSize == lastHTMLSize)
        countStableSizeIterations++;
  
      else
        countStableSizeIterations = 0; //reset the counter
  
      if (countStableSizeIterations >= minStableSizeIterations) {
        console.log("Page rendered fully..");
        break;
      }
  
      lastHTMLSize = currentHTMLSize;
      await page.waitForTimeout(checkDurationMsecs);
    }
  };
  
(async () => {
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();

    await page.goto(newURLRendered, {waitUntil: 'networkidle2'});
   
    const dimensions = await page.evaluate(() => {
  
          return {
          width: document.documentElement.clientWidth,
          height: document.documentElement.clientHeight,  
          deviceScaleFactor: window.devicePixelRatio,
          fullHeight: document.documentElement.scrollHeight
          
          };
          });
  
    console.log(`Full height is ${dimensions.fullHeight}`);
    console.log(`Height is ${dimensions.height}`);
  
    const maxHeight = dimensions.fullHeight * 2;
  
    console.log(`Document height is ${maxHeight}`);
  
    await waitTillHTMLRendered(page);
    const filenameRandom = Math.random();
    const filename = `file-${filenameRandom.toString()}.pdf`;
    await page.pdf({path: filename, height: maxHeight});

    const fileRendered = filename;
    const filePath = `pages/api/${filename}`;  
    
    await browser.close();
    console.log(`File is ${fileRendered} and file path is ${filePath}`)

  

  })();
