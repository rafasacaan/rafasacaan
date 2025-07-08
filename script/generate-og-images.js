const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Fix path to be one directory up from script location
const BASE_DIR = path.join(__dirname, '..');
const INPUT_DIR = path.join(BASE_DIR, 'public/og');
const OUTPUT_DIR = path.join(BASE_DIR, 'public/og');
const WIDTH = 1200;
const HEIGHT = 630;
const FORMAT = 'png';

(async () => {
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: WIDTH, height: HEIGHT });

    const files = fs.readdirSync(INPUT_DIR).filter(file => file.endsWith('.svg'));

    for (const file of files) {
        const filePath = `file://${path.join(INPUT_DIR, file)}`;
        const outputFilePath = path.join(OUTPUT_DIR, file.replace('.svg', `.${FORMAT}`));

        console.log(`Processing ${file}...`);
        await page.goto(filePath, { waitUntil: 'networkidle2' });
        await page.screenshot({ path: outputFilePath, type: FORMAT, omitBackground: FORMAT === 'png' });
        console.log(`Saved: ${outputFilePath}`);
    }

    await browser.close();

    console.log('All done!');
    console.log(`Now you may want to go through the images in ${OUTPUT_DIR} and copy/paste them into the corresponding content/posts/<page> directories. Once you do that, you can point the ogImage: frontmatter to the new image and it will be used as the og:image for the page.`);
})();
