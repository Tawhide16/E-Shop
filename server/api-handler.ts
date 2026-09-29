import { app, ensureDatabaseConnected } from './app';

export default async function handler(req: any, res: any) {
  try {
    await ensureDatabaseConnected();
  } catch (err) {
    console.warn('Vercel serverless DB connect note:', err);
  }
  return app(req, res);
}
