import dotenv from 'dotenv';
dotenv.config();

import path from 'path';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import { app } from './src/server/app.ts';

// CRITICAL FIX: Use Render's dynamic PORT environment variable, fallback to 3000 locally
const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  console.log('[STARTUP] Initializing server...');
  try {
    // Guarantee ANY unmatched API, signature, or JSON request ALWAYS returns JSON and NEVER falls through to Vite SPA index.html
    app.use((req, res, next) => {
      const acceptHeader = req.headers['accept'] || '';
      const contentTypeHeader = req.headers['content-type'] || '';
      const isJsonRequest = acceptHeader.includes('application/json') || contentTypeHeader.includes('application/json');

      if (isJsonRequest && !req.path.includes('.') && !req.path.startsWith('/@') && !req.path.startsWith('/src')) {
        return res.status(404).json({
          error: `API endpoint not found: ${req.method} ${req.originalUrl || req.url}`,
          path: req.originalUrl || req.url,
          method: req.method,
          status: 404,
          suggestion: 'No backend router matched this JSON request.',
        });
      }
      next();
    });

    // Vite middleware for development vs static serving for production
    if (process.env.NODE_ENV !== 'production') {
      console.log('[STARTUP] Creating Vite dev server...');
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
      console.log('[STARTUP] Vite dev server mounted.');
    } else {
      const distPath = path.join(process.cwd(), 'dist');
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }

    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`[STARTUP] Server successfully listening on http://0.0.0.0:${PORT}`);
    });

    server.on('error', (err: any) => {
      console.error(`[STARTUP] Server error on port ${PORT}:`, err);
    });
  } catch (err: any) {
    console.error('[STARTUP ERROR]:', err);
  }
}

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

startServer();
