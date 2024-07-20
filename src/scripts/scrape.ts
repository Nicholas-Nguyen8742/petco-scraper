import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const searchUrl = 'https://petcolove.org/lost/photo-search/?species=cat&photoSearchSpecies=cat&searchRadius=50&imageObjectKey=https%3A%2F%2Fd1xo1ei89o6wi.cloudfront.net%2Fphotos%2Fpet%2F47198368%2F28f92db2-5547-447c-9392-d02dc13852ed.jpeg&address=Houston%2C+TX+77065%2C+USA&start=2024-05-17&latitude=29.9305879&longitude=-95.59849249999999&searchType=found';

interface CatDetails {
  reporter: string;
  imageUrl: string;
  date: string;
}

const scrapeCatDetails = async (): Promise<CatDetails[]> => {
  const browser = await puppeteer.launch({ headless: true });
  console.log('Initializing puppeteer browser...');
  const page = await browser.newPage();

  await page.goto(searchUrl, { waitUntil: 'networkidle2' });

  const scrapeCatsFromPage = async (): Promise<CatDetails[]> => {
    return page.evaluate(() => {
      const catElements = document.querySelector('div.grid.grid-cols-4')?.childNodes as unknown as Element[];

      const cats: CatDetails[] = [];

      catElements.forEach((catElement) => {
        const reporter = (catElement.querySelector('p.text-body3.font-petco.break-words.font-bold.text-neutral-800.truncate') as HTMLElement)?.textContent || '';
        const imageUrl = (catElement.querySelector('img') as HTMLImageElement)?.src || '';
        const date = (catElement.querySelectorAll('p.text-body5.font-petco.break-words.text-neutral-700'))[1]?.textContent || '';
        if (reporter && date) {
          cats.push({ reporter, imageUrl, date });
        }
      });

      return cats;
    });
  };

  const scrollAndLoad = async () => {
    const scrollHeight = await page.evaluate('document.body.scrollHeight') as number;
    await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
    await new Promise(resolve => setTimeout(resolve, 10000));
    const newScrollHeight = await page.evaluate('document.body.scrollHeight') as number;
    return newScrollHeight > scrollHeight;
  };

  let hasMoreContent = true;
  let scrollCount = 0;

  while (hasMoreContent) {

    hasMoreContent = await scrollAndLoad();
    scrollCount += 1;
    console.log(`Scrolling & loading more cats... | Scroll Count: ${scrollCount}`);
  }

  const newCats = await scrapeCatsFromPage();

  await browser.close();
  return newCats;
};

const saveDataToFile = (data: CatDetails[], filePath: string) => {
  const jsonData = JSON.stringify(data, null, 2);
  fs.writeFileSync(filePath, jsonData, 'utf-8');
  console.log(`Data saved to ${filePath}`);
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const binFolderPath = path.resolve(__dirname, '../../bin');
const outputFilePath = path.join(binFolderPath, 'scrapedCats.json');

// Ensure the bin directory exists
if (!fs.existsSync(binFolderPath)) {
  fs.mkdirSync(binFolderPath);
}

scrapeCatDetails()
  .then(results => {
    saveDataToFile(results, outputFilePath);
  }).catch(err => {
    console.error('Error:', err);
  });
