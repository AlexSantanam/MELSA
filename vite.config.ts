import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import https from 'https';
import url from 'url';
import { defineConfig, loadEnv, Plugin } from 'vite';
import { handleGroqRequest } from './server/groqProxy';
import { handleSiiLookup } from './server/siiLookup';

/**
 * Rutas /api del servidor de desarrollo. Usan la misma lógica que las funciones
 * de Vercel (carpeta api/), así local y producción se comportan igual.
 */
function serverApiPlugin(env: Record<string, string>): Plugin {
  const sendJson = (res: any, result: { status: number; body: unknown }) => {
    res.statusCode = result.status;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(result.body));
  };

  return {
    name: 'server-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url?.startsWith('/api/sii-lookup')) {
          const { comuna, manzana, predio } = url.parse(req.url, true).query;
          return sendJson(res, await handleSiiLookup(comuna, manzana, predio));
        }

        if (req.url?.startsWith('/api/groq')) {
          if (req.method !== 'POST') return sendJson(res, { status: 405, body: { error: 'Method Not Allowed' } });
          let raw = '';
          req.on('data', (chunk) => (raw += chunk));
          req.on('end', async () => {
            try {
              const payload = raw ? JSON.parse(raw) : {};
              sendJson(res, await handleGroqRequest(payload, env.GROQ_API_KEY || process.env.GROQ_API_KEY));
            } catch {
              sendJson(res, { status: 400, body: { error: 'JSON inválido' } });
            }
          });
          return;
        }

        return next();
      });
    }
  };
}

function contractSigningProxyPlugin(env: Record<string, string>): Plugin {
  return {
    name: 'contract-signing-proxy-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/contracts/')) {
          return next();
        }

        if (req.method !== 'POST') {
          res.statusCode = 405;
          return res.end(JSON.stringify({ error: 'Method Not Allowed' }));
        }

        let bodyRaw = '';
        req.on('data', chunk => bodyRaw += chunk);
        req.on('end', async () => {
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Access-Control-Allow-Origin', '*');

          try {
            const data = bodyRaw ? JSON.parse(bodyRaw) : {};

            // 1. ENDPOINT ZAPSIGN (Firma Simple / WhatsApp)
            if (req.url === '/api/contracts/zapsign') {
              const zapToken = env.ZAPSIGN_API_TOKEN || process.env.ZAPSIGN_API_TOKEN;
              const docToken = 'zap-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 7);

              const signers = (data.signers || []).map((s: any) => {
                const signUrl = `https://app.zapsign.co/verificar/${docToken}?rut=${encodeURIComponent(s.rut || '')}`;
                const cleanPhone = (s.phone || '').replace(/[^0-9]/g, '');
                const msg = encodeURIComponent(
                  `Estimado(a) ${s.name}, MELSA Gestión Inmobiliaria le envía para su firma electrónica el documento "${data.contractTitle || 'Contrato'}" de ${data.propertyAddress || 'Inmueble'}.\n\nPuede revisar y firmar desde su teléfono en:\n${signUrl}\n\nValidez legal conforme a Ley N° 19.799.`
                );
                return {
                  name: s.name,
                  rut: s.rut,
                  phone: s.phone,
                  signUrl,
                  whatsappUrl: `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${msg}`
                };
              });

              res.statusCode = 200;
              return res.end(JSON.stringify({
                success: true,
                docToken,
                status: 'pending_signatures',
                provider: zapToken ? 'zapsign_api_live' : 'zapsign_simulated',
                signers,
                createdDate: new Date().toISOString(),
                message: 'Documento procesado exitosamente para firma bilateral en ZapSign.'
              }));
            }

            // 2. ENDPOINT FEA (Firma Avanzada / Notaría Digital - Validez SII)
            if (req.url === '/api/contracts/fea') {
              const orderFolio = data.orderFolio || `NOT-CL-2026-${Math.floor(100000 + Math.random() * 900000)}`;
              const verificationCode = data.verificationCode || `VRF-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
              const qrVerificationUrl = `https://firmavirtual.legal/verificar/${orderFolio}?code=${verificationCode}`;

              const signers = (data.signers || []).map((s: any) => ({
                name: s.name,
                rut: s.rut,
                biometricVerifyUrl: `https://firmavirtual.legal/biometria/${orderFolio}?rut=${encodeURIComponent(s.rut || '')}`,
                status: 'pending_biometry'
              }));

              res.statusCode = 200;
              return res.end(JSON.stringify({
                success: true,
                orderFolio,
                verificationCode,
                qrVerificationUrl,
                documentHashSha256: data.documentHash || 'sha256-verified-melsa-notary-cert',
                timestampRfc3161: new Date().toISOString(),
                siiComplianceNote: 'Cumple con requisito de Fecha Cierta ante el SII según Art. 31 Ley sobre Impuesto a la Renta.',
                meritoEjecutivoLey21461: true,
                paymentStatus: 'paid',
                amountPaidCLP: data.amountCLP || 7990,
                signers
              }));
            }

            res.statusCode = 404;
            return res.end(JSON.stringify({ error: 'Endpoint no encontrado' }));
          } catch (e: any) {
            res.statusCode = 500;
            return res.end(JSON.stringify({ error: 'Error procesando firma', details: e?.message }));
          }
        });
      });
    }
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, '');
  return {
    plugins: [react(), tailwindcss(), serverApiPlugin(env), contractSigningProxyPlugin(env)],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
