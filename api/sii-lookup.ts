// Función de Vercel: GET /api/sii-lookup?comuna=&manzana=&predio= → consulta de rol en el SII.
import { handleSiiLookup } from '../server/siiLookup.js';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }
  const { comuna, manzana, predio } = req.query || {};
  const result = await handleSiiLookup(comuna, manzana, predio);
  res.status(result.status).json(result.body);
}
