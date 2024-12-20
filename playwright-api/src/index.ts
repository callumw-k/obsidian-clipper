import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { chromium, devices } from 'playwright';

const app = new Hono();
const proxyConf = {
    server: 'https://au.smartproxy.com:30001',
    password: 'PKclfcFv2w1~Xw40qk',
    username: 'spkkoto9n4',
};
let browser = await chromium.launch({
    headless: true,
    proxy: proxyConf,
});

app.get('/', (c) => {
    return c.json({ status: 'success' });
});

async function processTitleAndImage(url: string) {
    const context = await browser.newContext(devices['iPhone 11']);
    const page = await context.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    let title = '';
    let image = '';

    try {
        console.log('Trying to get title...');
        title = await page.title();
        console.log(`Title is ${title}`);
    } catch (e) {
        console.error(`Error from title: ${e}`);
        await browser.close();
        browser = await chromium.launch({ proxy: proxyConf, headless: true });
        return await processTitleAndImage(url);
    }

    try {
        image =
            (await page
                .locator('meta[property="og:image"]')
                .getAttribute('content', { timeout: 3000 })) || '';
    } catch (e) {
        console.error(`Error from image url: ${e}`);
    }
    await context.close();
    return { title, image };
}

app.post('/', async (c) => {
    const body = await c.req.json();

    if (!('url' in body)) {
        return c.json({ error: 'URL not found' });
    }
    const { title, image } = await processTitleAndImage(body.url);

    return c.json({ title: title, imageUrl: image });
});

const port = 3000;

const handleShutdown = async (signal: string) => {
    console.log(`Received ${signal}. Closing browser and shutting down.`);
    await browser.close();
    process.exit(0);
};

process.on('SIGINT', handleShutdown); // Handle Ctrl+C
process.on('SIGTERM', handleShutdown);

serve({
    fetch: app.fetch,
    port,
});
