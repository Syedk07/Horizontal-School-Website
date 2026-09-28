import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { spawn, ChildProcess } from 'child_process';
import http from 'http';

const app = express();
const PORT = 3000;
const FLASK_PORT = 5001;

// Spawn Python Flask backend process
let flaskProcess: ChildProcess | null = null;

function startFlaskBackend() {
  console.log(`Starting Python Flask backend on port ${FLASK_PORT}...`);
  flaskProcess = spawn('python3', ['app.py', '--port', FLASK_PORT.toString(), '--host', '127.0.0.1'], {
    stdio: 'inherit',
    cwd: process.cwd(),
  });

  flaskProcess.on('error', (err) => {
    console.error('Failed to start Flask process:', err);
  });

  flaskProcess.on('exit', (code, signal) => {
    console.log(`Flask process exited with code ${code} and signal ${signal}`);
  });
}

// Clean up child process on exit
process.on('exit', () => {
  if (flaskProcess) flaskProcess.kill();
});
process.on('SIGINT', () => {
  if (flaskProcess) flaskProcess.kill();
  process.exit();
});
process.on('SIGTERM', () => {
  if (flaskProcess) flaskProcess.kill();
  process.exit();
});

// Start Flask process
startFlaskBackend();

// Proxy middleware for /api/* to Flask backend
app.use('/api', (req, res) => {
  const options: http.RequestOptions = {
    hostname: '127.0.0.1',
    port: FLASK_PORT,
    path: `/api${req.url}`,
    method: req.method,
    headers: {
      ...req.headers,
      host: `127.0.0.1:${FLASK_PORT}`,
    },
  };

  const proxyReq = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode || 500, proxyRes.headers);
    proxyRes.pipe(res, { end: true });
  });

  proxyReq.on('error', (err) => {
    console.error('API Proxy Error to Flask:', err.message);
    res.status(502).json({
      error: 'Backend gateway error: Python Flask server is initializing or unreachable.',
      details: err.message,
    });
  });

  req.pipe(proxyReq, { end: true });
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    // Vite Dev Server Middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Error starting server:', err);
});
