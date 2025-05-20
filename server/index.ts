import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import * as dotenv from "dotenv";
import { syncBlogPosts } from "./services/blogSync";

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" });

// FORCE SET RSS_FEED_URL - this is a temporary fix
// process.env.RSS_FEED_URL = "https://rss-link.com/feed/8lQAYS7QatKYV3ENYdl1?blogId=RSSaObImCNRCNM3nndyO&limit=25&loadContent=true";
// log("Forced setting RSS_FEED_URL to Go High Level feed URL with loadContent=true");

// Check for critical environment variables
if (!process.env.RSS_FEED_URL) {
  log("\x1b[33mWARNING: RSS_FEED_URL is not set in .env.local. Blog functionality will use mock data.\x1b[0m");
  log("Create a .env.local file with RSS_FEED_URL=\"your-go-high-level-rss-url\" to fix this.");
  
  // Set a default mock URL if we're in development mode
  if (process.env.NODE_ENV === 'development') {
    process.env.RSS_FEED_URL = "https://example.com/mock-feed";
    log("Mock RSS feed URL set for development.");
  }
}

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

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

      log(logLine);
    }
  });

  next();
});

// Initialize server
let server: any;

// Initialize the app with all routes and middleware
const initApp = async () => {
  // Log environment
  log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  log(`RSS Feed configured: ${!!process.env.RSS_FEED_URL}`);
  
  // Load initial blog posts
  try {
    const result = await syncBlogPosts(true); // Force update existing posts
    log(`Initial blog sync complete. Imported ${result.imported} posts, updated ${result.updated} posts.`);
  } catch (error) {
    log("Error during initial blog sync:", (error as Error).message);
  }

  server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    // Log the error internally here if not already logged
    console.error("Global error handler caught:", err);

    res.status(status).json({ message, error: String(err) }); // Send JSON response
    // Do not re-throw the error, as Vercel might serve an HTML page instead
    // throw err;
  });

  // Set up RSS feed fetching (if in production)
  if (app.get("env") !== "development" || process.env.FETCH_RSS === "true") {
    try {
      // Check for RSS feed every hour (60 minutes)
      const intervalMinutes = 60;
      const interval = intervalMinutes * 60 * 1000;
      
      log(`Scheduling blog sync every ${intervalMinutes} minutes`);
      setInterval(async () => {
        try {
          const result = await syncBlogPosts(true); // Force update
          log(`Scheduled blog sync complete. Imported ${result.imported} posts, updated ${result.updated} posts.`);
        } catch (syncError) {
          log("Error during scheduled blog sync:", (syncError as Error).message);
        }
      }, interval);
    } catch (error) {
      log("Error setting up blog sync schedule:", (error as Error).message);
    }
  }

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  return app;
};

// Initialize the app
const appPromise = initApp();

// Only listen locally if not on Vercel
if (!process.env.VERCEL) {
  (async () => {
    const initializedApp = await appPromise;
    // ALWAYS serve the app on port 5000
    // this serves both the API and the client.
    // It is the only port that is not firewalled.
    const port = 5000;
    server.listen({
      port,
      host: "0.0.0.0",
      reusePort: true,
    }, () => {
      log(`serving on port ${port}`);
    });
  })();
}

// Export the app for Vercel
export default appPromise;
