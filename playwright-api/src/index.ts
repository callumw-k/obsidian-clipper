import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { chromium, devices } from 'playwright';

const app = new Hono();
const browser = await chromium.launch({
    proxy: {
        server: 'https://gate.smartproxy.com:10001',
        password: 'PKclfcFv2w1~Xw40qk',
        username: 'spkkoto9n4',
    },
});

app.get('/', (c) => {
    return c.json({ status: 'success' });
});
app.post('/', async (c) => {
    const body = await c.req.json();
    if (!('url' in body)) {
        return c.json({ error: 'URL not found' });
    }

    const context = await browser.newContext(devices['iPhone 11']);
    const page = await context.newPage();
    await page.goto(body.url);

    let title = '';
    let image = '';

    try {
        console.log('Trying to get title...');
        title = await page.title();
        console.log(`Title is ${title}`);
    } catch (e) {
        console.error(`Error from title: ${e}`);
    }

    try {
        image =
            (await page
                .locator('meta[property="og:image"]')
                .getAttribute('content', { timeout: 3000 })) || '';
    } catch (e) {
        console.error(`Error from image url: ${e}`);
    }

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
