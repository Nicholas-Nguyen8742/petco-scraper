# Petco Scraper

This project is a web scraper built using TypeScript and Puppeteer to extract data from the Petco Love Lost web application. The purpose of this scraper is to gather information about found animals listed on the Petco Love Lost platform that match provided criteria such as your uploaded missing cat photo.

___

## Features

- Scrapes data from Petco Love Lost based on specified criteria.
- Allows configuration of the search radius and location via environment variable `PETCO_URL`.
- Built with TypeScript for type safety and maintainability.
- Puppeteer is used for web scraping to navigate and interact with web pages programmatically.

___

## Under Development

- Integration with TensorFlow.js to improve matching of found animals with lost pet reports. This feature is currently under development and not yet complete.

___

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Nicholas-Nguyen8742/petco-scraper.git
cd petco-scraper
```

1. Use [nvm](https://github.com/nvm-sh/nvm) to install and use the correct Node.js version:
```bash
nvm install 22.3.0
nvm use 22.3.0
```

1. Install dependencies:
```bash
npm install
```

___

## Configuration

Set the following environment variables in a .env file at the root of the project:

```env
PETCO_URL=https://petcolove.org/lost/photo-search/?species=cat&photoSearchSpecies=cat&searchRadius=50&imageObjectKey=https%3A%2F%2Fd1xo1ei89o6wi.cloudfront.net%2Fphotos%2Fpet%2F47198368%2F28f92db2-5547-447c-9392-d02dc13852ed.jpeg&address=Houston%2C+TX+77065%2C+USA&start=2024-05-17&latitude=29.9305879&longitude=-95.59849249999999&searchType=found
```

This variable sets the URL to be scraped, including parameters such as species, search radius, image object key, address, and coordinates. Query parameters are set below with example values are URL encoded:
- `address`: Houston%2C+TX+32115%2C+USA
- `latitude`: 29.9305879
- `longitude`: -95.59849249999999
- `searchRadius`: 50 (in miles)
- `start`: 2024-05-17 (date of pet lost)
- `searchType`: found
- `photoSearchSpecies`: cat (or dog)
- `species`: cat (or dog)
- `imageObjectKey`: image user uploaded to [Petco Love Lost Dashboard](https://petcolove.org/lost/dash)

## Usage

Run the scraper with the following command:

```bash
npm run scrape
```

The scraper will navigate to the Petco Love Lost website using Puppeteer, perform the search based on the specified criteria, and extract the relevant data output in json in `bin/scrapedCats.json`


___

## Acknowledgments
- Puppeteer for headless browser automation.
- TensorFlow.js for machine learning in JavaScript.
- Petco Love for simplified search for lost and found pets.

