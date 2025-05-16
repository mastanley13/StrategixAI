// Vercel serverless handler – wraps Express app
import app from '../server/index.ts';  // Vercel will transpile TS automatically
export default app; 