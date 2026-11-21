// Proxy de servidor para Groq: la clave GROQ_API_KEY vive solo en el servidor
// (Vercel → Environment Variables, o .env.local en desarrollo) y nunca llega al navegador.

const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';

/** Solo los modelos que usa la app */
const ALLOWED_MODELS = new Set(['qwen/qwen3.8-27b', 'llama-3.3-70b-versatile']);
const MAX_TOKENS_CAP = 1200;
const MAX_MESSAGES = 12;
const MAX_TOTAL_CHARS = 24000;

/** Dominios desde los que se acepta la llamada (evita que otros sitios usen la cuenta) */
export function isAllowedOrigin(originOrReferer: string | undefined): boolean {
  if (!originOrReferer) return false;
  try {
    const host = new URL(originOrReferer).hostname;
    return (
      host === 'melsa.cl' ||
      host === 'www.melsa.cl' ||
      host === 'localhost' ||
      host === '127.0.0.1' ||
      (host.startsWith('melsa') && host.endsWith('.vercel.app'))
    );
  } catch {
    return false;
  }
}

export interface ProxyResult {
  status: number;
  body: unknown;
}

export async function handleGroqRequest(payload: any, apiKey: string | undefined): Promise<ProxyResult> {
  if (!apiKey) {
    return { status: 503, body: { error: 'IA no configurada (falta GROQ_API_KEY en el servidor)' } };
  }

  const model = String(payload?.model || '');
  const messages = Array.isArray(payload?.messages) ? payload.messages : null;
  if (!ALLOWED_MODELS.has(model) || !messages || messages.length === 0 || messages.length > MAX_MESSAGES) {
    return { status: 400, body: { error: 'Solicitud de IA no válida' } };
  }

  const cleanMessages = messages.map((m: any) => ({
    role: ['system', 'user', 'assistant'].includes(m?.role) ? m.role : 'user',
    content: String(m?.content ?? '')
  }));
  const totalChars = cleanMessages.reduce((n: number, m: { content: string }) => n + m.content.length, 0);
  if (totalChars > MAX_TOTAL_CHARS) {
    return { status: 413, body: { error: 'Solicitud de IA demasiado larga' } };
  }

  const body: Record<string, unknown> = {
    model,
    messages: cleanMessages,
    temperature: Math.min(Math.max(Number(payload?.temperature ?? 0.6), 0), 1.2),
    max_tokens: Math.min(Number(payload?.max_tokens) || 1000, MAX_TOKENS_CAP)
  };
  if (payload?.response_format?.type === 'json_object') {
    body.response_format = { type: 'json_object' };
  }

  try {
    const res = await fetch(GROQ_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify(body)
    });
    const data = await res.json().catch(() => ({}));
    return { status: res.status, body: data };
  } catch (err: any) {
    return { status: 502, body: { error: 'No se pudo contactar a Groq', details: err?.message } };
  }
}
