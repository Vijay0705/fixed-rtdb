import { createApp } from '../server.ts';

let appPromise: ReturnType<typeof createApp> | null = null;

export default async function handler(req: any, res: any) {
  try {
    if (!appPromise) appPromise = createApp();
    const app = await appPromise;
    return app(req, res);
  } catch (error) {
    console.error('Vercel API initialization failed:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development'
        ? String(error)
        : 'API initialization failed. Check Vercel environment variables.'
    });
  }
}
