import { launch, getStream } from 'puppeteer-stream';
import { createWriteStream } from 'fs';

/**
 * Next steps: connect the puppeteer stream to
 * an http streaming file endpoint via nest.
 * see; https://docs.nestjs.com/techniques/streaming-files
 */

const file = createWriteStream(__dirname + '/test.webm');

(async () => {
  const browser = await launch({});
  console.log('new page');
  const page = await browser.newPage();
  await page.goto('https://explorersclub.gg');
  console.log('goto');
  const stream = await getStream(page, { audio: true, video: true });
  console.log('recording');

  stream.pipe(file);
  setTimeout(async () => {
    await stream.destroy();
    file.close();
    console.log('finished');
  }, 1000 * 10);
})();

// import { Logger } from '@nestjs/common';
// import { NestFactory } from '@nestjs/core';

// import { AppModule } from './app/app.module';
// import puppeteer from 'puppeteer';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   const globalPrefix = 'api';
//   app.setGlobalPrefix(globalPrefix);

//   (async () => {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();
//     await page.goto('https://explorersclub.gg');

//     await browser.close();
//   })();

//   const port = process.env.PORT || 3333;
//   await app.listen(port);
//   Logger.log(
//     `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
//   );
// }

// bootstrap();
