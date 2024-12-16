import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { chromium, devices } from 'playwright';

const app = new Hono()
const browser = await chromium.launch();
const context = await browser.newContext(devices['iPhone 11']);

app.post('/', async (c) => {
  const body = await c.req.json();
  if (!("url" in body)) return c.json({ error: "URL not found" });
  const page = await context.newPage();
  await page.goto(body.url);
  let title = "";
  let image = ""
  try {
    title = await page.title();
    image = await page.locator('meta[property="og:image"]').getAttribute('content', { timeout: 1000 }) || "";
  } catch (_) {
    title = "Couldn't process title"
  }

  return c.json({ "title": title, imageUrl: image });
})

const port = 3000

const handleShutdown = async (signal: string) => {
  console.log(`Received ${signal}. Closing browser and shutting down.`);
  await browser.close();
  process.exit(0);
};

process.on('SIGINT', handleShutdown); // Handle Ctrl+C
process.on('SIGTERM', handleShutdown);

serve({
  fetch: app.fetch,
  port

})
