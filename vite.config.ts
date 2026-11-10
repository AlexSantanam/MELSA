import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import https from 'https';
import url from 'url';
import { defineConfig, loadEnv, Plugin } from 'vite';

function siiProxyPlugin(): Plugin {
  let comunasMap: Record<string, number> | null = null;

  return {
    name: 'sii-proxy-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/sii-lookup')) {
          return next();
        }

        const parsedUrl = url.parse(req.url, true);
        const { comuna, manzana, predio } = parsedUrl.query;

        if (!comuna || !manzana || !predio) {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          return res.end(JSON.stringify({ error: 'Faltan parámetros requeridos: comuna, manzana, predio' }));
        }

        try {
          if (!comunasMap) {
            const comunasPath = path.resolve(__dirname, 'src/data/siiComunas.json');
            if (fs.existsSync(comunasPath)) {
              comunasMap = JSON.parse(fs.readFileSync(comunasPath, 'utf-8'));
            }
          }

          const normComuna = String(comuna)
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim()
            .toUpperCase();

          const comunaCnp = comunasMap ? comunasMap[normComuna] : null;
          if (!comunaCnp) {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({ error: `Comuna no encontrada en catálogo SII: ${comuna}` }));
          }

          const postData = JSON.stringify({
            token: " ",
            action: "BusquedaSC",
            bienesRaices: {
              comunaCnp: comunaCnp,
              manzanaCnp: parseInt(String(manzana), 10),
              predioCnp: parseInt(String(predio), 10)
            }
          });

          const siiReq = https.request('https://www2.sii.cl/app/vicana/v1/bienes-raices/buscar/por-rol', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Content-Length': Buffer.byteLength(postData),
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
              'Referer': 'https://www2.sii.cl/vicana/',
              'Origin': 'https://www2.sii.cl'
            }
          }, (siiRes) => {
            let body = '';
            siiRes.on('data', chunk => body += chunk);
            siiRes.on('end', () => {
              res.statusCode = siiRes.statusCode || 200;
              res.setHeader('Content-Type', 'application/json');
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.end(body);
            });
          });

          siiReq.on('error', (err) => {
            res.statusCode = 502;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Error conectando con SII', details: err.message }));
          });

          siiReq.write(postData);
          siiReq.end();
        } catch (e: any) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Error interno en consulta SII', details: e?.message }));
        }
      });
    }
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, '');
  return {
    plugins: [react(), tailwindcss(), siiProxyPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    define: {
      'import.meta.env.VITE_GROQ_API_KEY': JSON.stringify(env.VITE_GROQ_API_KEY || process.env.VITE_GROQ_API_KEY || ''),
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
