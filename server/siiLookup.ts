// Consulta de rol al servicio público del SII (Vicana), compartida entre el servidor
// de desarrollo (vite.config.ts) y la función de Vercel (api/sii-lookup.ts).
// Solo devuelve los campos que usa la app: el SII también entrega el RUT del
// propietario y otros datos personales que no deben llegar al navegador.

import comunasMap from './siiComunas.js';
import type { ProxyResult } from './groqProxy.js';

const SII_ENDPOINT = 'https://www2.sii.cl/app/vicana/v1/bienes-raices/buscar/por-rol';
const SAFE_FIELDS = ['comuna', 'rol', 'direccion', 'destino', 'avaluoFiscal', 'avaluoFiscalS', 'totalContrib', 'totalContribS'];

// Nombres oficiales de comuna que el catálogo SII escribe distinto
const SII_ALIASES: Record<string, string> = {
  'MOSTAZAL': 'SAN FRANCISCO DE MOSTAZAL',
  'TREGUACO': 'TREHUACO',
  'TILTIL': 'TIL-TIL',
  "O'HIGGINS": 'OHIGGINS',
  'LLAILLAY': 'LLAY-LLAY',
  'SANTIAGO CENTRO': 'SANTIAGO'
};

export async function handleSiiLookup(comuna: unknown, manzana: unknown, predio: unknown): Promise<ProxyResult> {
  if (!comuna || !manzana || !predio) {
    return { status: 400, body: { error: 'Faltan parámetros requeridos: comuna, manzana, predio' } };
  }

  const normComuna = String(comuna).normalize('NFD').replace(/[̀-ͯ]/g, '').trim().toUpperCase();
  const lookupKey = SII_ALIASES[normComuna] || normComuna;
  const comunaCnp = (comunasMap as Record<string, number>)[lookupKey];
  if (!comunaCnp) {
    return { status: 404, body: { error: `Comuna no encontrada en catálogo SII: ${comuna}` } };
  }

  const m = parseInt(String(manzana), 10);
  const p = parseInt(String(predio), 10);
  if (!m || !p) {
    return { status: 400, body: { error: 'Rol inválido' } };
  }

  try {
    const res = await fetch(SII_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Referer': 'https://www2.sii.cl/vicana/',
        'Origin': 'https://www2.sii.cl'
      },
      body: JSON.stringify({
        token: ' ',
        action: 'BusquedaSC',
        bienesRaices: { comunaCnp, manzanaCnp: m, predioCnp: p }
      })
    });
    const parsed = await res.json().catch(() => null);
    if (!res.ok || !Array.isArray(parsed)) {
      return { status: res.ok ? 502 : res.status, body: { error: 'Respuesta inválida del SII' } };
    }
    const safe = parsed.map((item: Record<string, unknown>) =>
      Object.fromEntries(SAFE_FIELDS.filter((k) => k in item).map((k) => [k, item[k]]))
    );
    return { status: 200, body: safe };
  } catch (err: any) {
    return { status: 502, body: { error: 'Error conectando con SII', details: err?.message } };
  }
}
