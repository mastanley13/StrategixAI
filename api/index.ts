import { createServer } from 'http';
import express from 'express';
import { registerRoutes } from '../server/routes';
import { serveStatic, log } from '../server/vite';
import * as dotenv from 'dotenv';
import { syncBlogPosts } from '../server/services/blogSync';

// Direct handler for Vercel Serverless Functions
export default async function handler(req, res) {
  // Load environment variables
  dotenv.config({ path: ".env.local" });

  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // Log middleware
  app.use((req, res, next) => {
    const start = Date.now();
    const path = req.path;
    let capturedJsonResponse = undefined;

    const originalResJson = res.json;
    res.json = function (bodyJson, ...args) {
      capturedJsonResponse = bodyJson;
      return originalResJson.apply(res, [bodyJson, ...args]);
    };

    res.on("finish", () => {
      const duration = Date.now() - start;
      if (path.startsWith("/api")) {
        let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
        if (capturedJsonResponse) {
          logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
        }

        if (logLine.length > 80) {
          logLine = logLine.slice(0, 79) + "…";
        }

        console.log(logLine);
      }
    });

    next();
  });

  // Setup server
  const server = createServer(app);
  await registerRoutes(app);

  // Error handler
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
  });

  // Serve static assets (in production)
  if (process.env.NODE_ENV !== "development") {
    serveStatic(app);
  }

  // Handle the current request
  return app(req, res);
} 