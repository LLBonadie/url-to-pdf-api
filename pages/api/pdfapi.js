async function generatePDFbyURL(request, response) {
  
  const dynamicDate = new Date();
  
  const newLocal = require('puppeteer');
  const puppeteer = newLocal;

  // Lê a URL da solicitação da API

  const newURLRendered = 'https://app.grupouseai.com/version-test/notificacao/-2012-mtyhxyi?n=1671626924744x890598798051770400';
  // const newURLRendered = request.url;
  
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
  }

  // Inicia uma instância do navegador
  const browser = await puppeteer.launch({headless: true});
  // Cria uma nova página
  const page = await browser.newPage();

  // Vai para a URL especificada
  await page.goto(newURLRendered, {waitUntil: 'networkidle2'});

  // Captura as dimensões da página
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

  // Espera até que a página seja renderizada
  await waitTillHTMLRendered(page);

  // Gera um nome aleatório para o arquivo PDF
  const filenameRandom = Math.random().toPrecision(7);
  const filename = `file-${filenameRandom.toString()}.pdf`;

  const fileRendered = filename;
  const filePath = `https://github.com/LLBonadie/url-to-pdf-api/blob/main/${filename}`; 

  console.log(`File is ${fileRendered} and file path is ${filePath}`)

  // Gera o PDF da página
  await page.pdf({path: filename, height: maxHeight});

  // Fecha o navegador
  await browser.close();

  // Envia o arquivo PDF como resposta da função
    
    response.json({
      date: dynamicDate.toGMTString(),
      file: filePath
    });
  }


export default generatePDFbyURL;



