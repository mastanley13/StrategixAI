import expressAppPromise from '../server/index';

let resolvedApp: any = null;

export default async function handler(req, res) {
  if (!resolvedApp) {
    resolvedApp = await expressAppPromise;
  }
  return resolvedApp(req, res);
} 