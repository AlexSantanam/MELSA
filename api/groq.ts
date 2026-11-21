// Función de Vercel: POST /api/groq → reenvía a Groq con la clave del servidor.
import { handleGroqRequest, isAllowedOrigin } from '../server/groqProxy';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }
  if (!isAllowedOrigin(req.headers.origin || req.headers.referer)) {
    res.status(403).json({ error: 'Origen no permitido' });
    return;
  }
  const payload = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body;
  const result = await handleGroqRequest(payload, process.env.GROQ_API_KEY);
  res.status(result.status).json(result.body);
}
