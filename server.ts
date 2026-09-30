import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { FreeOpenSourceTranslationProvider } from './server/translation/freeOpenProvider.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProd = process.env.NODE_ENV === 'production';
const PORT = Number(process.env.PORT) || 3000;

// Zero-cost free/open-source translation provider
const translationProvider = new FreeOpenSourceTranslationProvider();

// Simple in-memory rate-limiter (60 requests per minute per client)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 60;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (entry.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }
  entry.count++;
  return true;
}

// Clean up stale rate limits every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap.entries()) {
    if (now > entry.resetAt) {
      rateLimitMap.delete(ip);
    }
  }
}, 5 * 60 * 1000);

async function startServer() {
  const app = express();

  // Basic security and parsing
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true, limit: '2mb' }));

  // SEO: robots.txt
  app.get('/robots.txt', (req: Request, res: Response) => {
    const appUrl = process.env.APP_URL || `http://localhost:${PORT}`;
    res.type('text/plain');
    res.send(`User-agent: *
Allow: /
Sitemap: ${appUrl}/sitemap.xml
`);
  });

  // SEO: sitemap.xml
  app.get('/sitemap.xml', (req: Request, res: Response) => {
    const appUrl = process.env.APP_URL || `http://localhost:${PORT}`;
    const today = new Date().toISOString().split('T')[0];
    const routes = [
      '',
      '/english-to-hindi',
      '/english-to-bengali',
      '/hindi-to-english',
      '/hindi-to-bengali',
      '/bengali-to-english',
      '/bengali-to-hindi',
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `  <url>
    <loc>${appUrl}${route}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${route === '' ? '1.0' : '0.8'}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

    res.type('application/xml');
    res.send(xml);
  });

  // Health check endpoint
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'TriLingua Translator API',
      version: '1.0.0',
      supportedLanguages: ['en', 'hi', 'bn'],
    });
  });

  // Translation endpoint
  app.post('/api/translate', async (req: Request, res: Response) => {
    const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';

    if (!checkRateLimit(clientIp)) {
      return res.status(429).json({
        message: 'Too many requests. Please wait a moment before trying again.',
      });
    }

    const { text, sourceLang = 'auto', targetLang, formality } = req.body;

    if (!text || typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({
        message: 'Please provide text to translate.',
      });
    }

    if (text.length > 5000) {
      return res.status(400).json({
        message: 'Text exceeds the 5,000 character limit.',
      });
    }

    const validLangs = ['en', 'hi', 'bn'];
    const validSources = [...validLangs, 'auto'];

    if (!validSources.includes(sourceLang)) {
      return res.status(400).json({
        message: 'Unsupported source language.',
      });
    }

    if (!validLangs.includes(targetLang)) {
      return res.status(400).json({
        message: 'Unsupported target language.',
      });
    }

    // Pass-through if same language
    if (sourceLang !== 'auto' && sourceLang === targetLang) {
      return res.json({
        translatedText: text,
        detectedLang: sourceLang,
        sourceLang,
        targetLang,
        provider: 'passthrough',
        timestamp: Date.now(),
      });
    }

    try {
      const result = await translationProvider.translate({
        text,
        sourceLang,
        targetLang,
        formality,
      });

      return res.json({
        translatedText: result.translatedText,
        detectedLang: result.detectedLang,
        sourceLang,
        targetLang,
        transliteration: result.transliteration,
        provider: result.provider,
        timestamp: Date.now(),
      });
    } catch (err: any) {
      console.error('Translation route error:', err);
      return res.status(500).json({
        message: "Translation couldn't be completed. Please try again.",
      });
    }
  });

  // Vite middleware in dev or static files in production
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`TriLingua server running on http://0.0.0.0:${PORT} [${isProd ? 'production' : 'development'}]`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
