import expressAppPromise from '../server/index';
import type { VercelRequest, VercelResponse } from '@vercel/node';

let resolvedApp: any = null;

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (!resolvedApp) {
    resolvedApp = await expressAppPromise;
  }
  return resolvedApp(req, res);
}
