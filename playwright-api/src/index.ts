import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { chromium, devices } from 'playwright';

const app = new Hono();
const proxyConf = {
    server: 'https://au.smartproxy.com:30001',
    password: 'PKclfcFv2w1~Xw40qk',
    username: 'spkkoto9n4',
};
const noProxy = process.env['NO_PROXY'] ?? false;

app.get('/', (c) => {
    return c.json({ status: 'success' });
});

async function processTitleAndImage(url: string) {
    const browser = await chromium.launch({
        headless: true,
        proxy: noProxy ? undefined : proxyConf,
    });

    let title = '';
    let image = '';

    const context = await browser.newContext(devices['iPhone 11']);
    const page = await context.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    try {
        console.log('Trying to get title...');
        title = await page.title();
        console.log(`Title is ${title}`);
    } catch (e) {
        console.error(`Couldn't get title ${e}`);
    }

    try {
        image =
            (await page
                .locator('meta[property="og:image"]')
                .getAttribute('content', { timeout: 3000 })) || '';
    } catch (e) {
        console.error(`Error from image url: ${e}`);
    }

    console.log('Closing browser...');
    await browser.close();
    console.log('Browser closed');
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

serve({
    fetch: app.fetch,
    port,
});
