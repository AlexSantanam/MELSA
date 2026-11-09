// propertyAiExtractor.ts
// Servicio para ingesta multimodal e IA extractiva inmobiliaria con Groq (Qwen / Llama) y Web Speech API en Chile.
// Fidelidad estricta a lo que dicta el usuario sin alterar tipología ni número de habitaciones.

export interface ExtractedPropertyData {
  title: string;
  address: string;
  commune: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  surfaceM2: number;
  rentCLP: number;
  priceUF: number;
  parking: number;
  storage: number;
  maintenanceStatus: string;
  generatedCopy: string;
}

const numWordsMap: Record<string, number> = {
  un: 1, una: 1, uno: 1, dos: 2, tres: 3, cuatro: 4, cinco: 5,
  seis: 6, siete: 7, ocho: 8, nueve: 9, diez: 10, once: 11, doce: 12
};

/**
 * Llama a la API de Groq con el modelo ultra-rápido qwen/qwen3.8-27b
 * respetando con fidelidad matemática las características que el usuario dictó.
 */
export async function extractPropertyWithGroq(inputText: string): Promise<ExtractedPropertyData> {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY || (import.meta.env as any).VITE_GROK_API_KEY;

  if (!inputText || inputText.trim().length === 0) {
    return extractPropertyHeuristic('Casa de 3 dormitorios');
  }

  if (apiKey && apiKey !== 'TU_GROQ_API_KEY') {
    try {
      const endpoint = 'https://api.groq.com/openai/v1/chat/completions';
      const systemPrompt = `
Eres el motor de IA inmobiliaria de MELSA Gestión Inmobiliaria (Chile).
Tu trabajo es escuchar con FIDELIDAD MATEMÁTICA ABSOLUTA lo que el usuario describe y estructurarlo.

REGLAS DE ORO OBLIGATORIAS:
1. DORMITORIOS / HABITACIONES:
   - Extrae el número EXACTO de habitaciones, dormitorios o piezas que el usuario mencionó.
   - Si el usuario dice "casa de 5 habitaciones", bedrooms DEBE SER 5. Jamás pongas 2 ni inventes otro número.
   - Si usa palabras (ej. "cinco habitaciones", "tres piezas"), convierte la palabra al número correspondiente (5, 3).
2. TIPO DE INMUEBLE:
   - Si dice "casa", type = "Casa".
   - Si dice "depto" o "departamento", type = "Depto".
   - Si dice "oficina", type = "Oficina".
   - Si dice "parcela", type = "Parcela".
3. BAÑOS Y SUPERFICIE (M2):
   - Si el usuario los especifica, usa sus números exactos.
   - Si NO los especifica, estima valores proporcionales reales según el número de habitaciones (ej. una casa de 5 habitaciones suele tener entre 3 a 4 baños y ~180 a 240 m² útiles; no pongas 70 m² para 5 dormitorios).
4. PRECIOS (CLP / UF):
   - Si el usuario menciona precio, extráelo con precisión ("800 lucas" = 800000 CLP, "5000 UF" = 5000 UF).
   - Si NO menciona precio de arriendo o venta, puedes dejarlo en 0 o estimar un valor referencial coherente para esa comuna.
5. TÍTULO Y COPY COMERCIAL:
   - El título debe reflejar la tipología y cantidad real de habitaciones (ej: "Amplia Casa de 5 Habitaciones en ...").
   - Redacta un copy persuasivo, profesional y elegante para portales inmobiliarios (PortalInmobiliario, TocToc).

Debes responder EXCLUSIVAMENTE con un JSON válido con esta estructura:
{
  "title": string,
  "address": string,
  "commune": string,
  "type": "Casa" | "Depto" | "Oficina" | "Parcela",
  "bedrooms": number,
  "bathrooms": number,
  "surfaceM2": number,
  "rentCLP": number,
  "priceUF": number,
  "parking": number,
  "storage": number,
  "maintenanceStatus": string,
  "generatedCopy": string
}
`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'qwen/qwen3.8-27b',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: inputText }
          ],
          temperature: 0.1,
          response_format: { type: 'json_object' }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        if (content) {
          const parsed = JSON.parse(content);
          return {
            title: parsed.title || `${parsed.type || 'Inmueble'} de ${parsed.bedrooms || 3} Habitaciones`,
            address: parsed.address || 'Sector residencial destacado',
            commune: parsed.commune && parsed.commune !== 'No especificada' ? parsed.commune : 'Santiago, RM',
            type: parsed.type || (inputText.toLowerCase().includes('casa') ? 'Casa' : 'Depto'),
            bedrooms: Number(parsed.bedrooms) || 3,
            bathrooms: Number(parsed.bathrooms) || 2,
            surfaceM2: Number(parsed.surfaceM2) || 120,
            rentCLP: Number(parsed.rentCLP) || 0,
            priceUF: Number(parsed.priceUF) || 0,
            parking: typeof parsed.parking === 'boolean' ? (parsed.parking ? 1 : 0) : Number(parsed.parking) || 0,
            storage: typeof parsed.storage === 'boolean' ? (parsed.storage ? 1 : 0) : Number(parsed.storage) || 0,
            maintenanceStatus: parsed.maintenanceStatus && parsed.maintenanceStatus !== 'null' ? parsed.maintenanceStatus : 'Impecable / Listo para habitar',
            generatedCopy: parsed.generatedCopy || inputText
          };
        }
      } else {
        console.warn(`Groq API respondió ${response.status}. Usando extractor heurístico local.`);
      }
    } catch (error) {
      console.error('Error al procesar con Groq:', error);
    }
  }

  return extractPropertyHeuristic(inputText);
}

/**
 * Extractor heurístico local de alta fidelidad (para respaldo sin conexión)
 */
export function extractPropertyHeuristic(text: string): ExtractedPropertyData {
  if (!text || text.trim().length === 0) {
    return {
      title: 'Casa Residencial Amplia',
      address: 'Sector residencial',
      commune: 'Santiago, RM',
      type: 'Casa',
      bedrooms: 4,
      bathrooms: 3,
      surfaceM2: 180,
      rentCLP: 1200000,
      priceUF: 7500,
      parking: 2,
      storage: 1,
      maintenanceStatus: 'Excelente estado general',
      generatedCopy: 'Gran propiedad familiar con amplios espacios y conectividad.'
    };
  }

  // Normalización sin acentos para evitar descalces
  const norm = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  // 1. Tipo de inmueble
  const isCasa = norm.includes('casa');
  const isOficina = norm.includes('oficina');
  const isParcela = norm.includes('parcela') || norm.includes('terreno');
  const type = isCasa ? 'Casa' : isOficina ? 'Oficina' : isParcela ? 'Parcela' : 'Depto';

  // 2. Dormitorios / Habitaciones (detecta números y palabras como cinco, tres, etc.)
  let bedrooms = isCasa ? 4 : 2;
  const bedNumMatch = norm.match(/(\d+)\s*(?:dormitorio|dorm|habitacion|pieza|cuarto|alcoba|d\b)/);
  if (bedNumMatch) {
    bedrooms = parseInt(bedNumMatch[1], 10);
  } else {
    const bedWordMatch = norm.match(/(un|una|uno|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez)\s*(?:dormitorio|dorm|habitacion|pieza|cuarto)/);
    if (bedWordMatch && numWordsMap[bedWordMatch[1]]) {
      bedrooms = numWordsMap[bedWordMatch[1]];
    }
  }

  // 3. Baños
  let bathrooms = Math.max(1, Math.round(bedrooms * 0.7));
  const bathNumMatch = norm.match(/(\d+)\s*(?:bano|baño|b\b)/);
  if (bathNumMatch) {
    bathrooms = parseInt(bathNumMatch[1], 10);
  } else {
    const bathWordMatch = norm.match(/(un|una|uno|dos|tres|cuatro|cinco)\s*(?:bano|baño)/);
    if (bathWordMatch && numWordsMap[bathWordMatch[1]]) {
      bathrooms = numWordsMap[bathWordMatch[1]];
    }
  }

  // 4. Superficie m2 proporcional real
  let surfaceM2 = isCasa ? Math.max(140, bedrooms * 36) : Math.max(45, bedrooms * 26);
  const m2Match = norm.match(/(\d+)\s*(?:m2|m²|metro)/);
  if (m2Match) {
    surfaceM2 = parseInt(m2Match[1], 10);
  }

  // 5. Canon arriendo o precio UF
  let rentCLP = 0;
  const clpMatch = norm.match(/\$\s*([\d\.]+)/);
  const lucasMatch = norm.match(/(\d+)\s*(?:lucas|mil)/);
  if (clpMatch) {
    rentCLP = parseInt(clpMatch[1].replace(/\./g, ''), 10);
  } else if (lucasMatch) {
    rentCLP = parseInt(lucasMatch[1], 10) * 1000;
  } else {
    // Estimación coherente si no se dice
    rentCLP = isCasa ? bedrooms * 240000 : bedrooms * 320000;
  }

  let priceUF = 0;
  const ufMatch = norm.match(/(\d+[\.\,]?\d*)\s*(?:uf|u\.f\.)/);
  if (ufMatch) {
    priceUF = parseFloat(ufMatch[1].replace('.', '').replace(',', '.'));
  } else {
    priceUF = Math.round(surfaceM2 * 55);
  }

  // 6. Comuna
  let commune = 'Santiago, RM';
  const communes = ['las condes', 'vitacura', 'lo barnechea', 'providencia', 'ñuñoa', 'la reina', 'chicureo', 'colina', 'viña del mar', 'concon', 'puerto varas', 'frutillar', 'concepcion'];
  for (const c of communes) {
    if (norm.includes(c)) {
      commune = c.charAt(0).toUpperCase() + c.slice(1) + ', Chile';
      break;
    }
  }

  const parking = norm.includes('estacionamiento') || norm.includes('auto') || isCasa ? (bedrooms >= 4 ? 2 : 1) : 0;
  const storage = norm.includes('bodega') ? 1 : 0;
  const maintenanceStatus = norm.includes('pintura') ? 'Falta pintura menor' : 'Impecable / Excelente estado';

  return {
    title: `${type} de ${bedrooms} Habitaciones en ${commune.split(',')[0]}`,
    address: 'Sector residencial consolidado',
    commune,
    type,
    bedrooms,
    bathrooms,
    surfaceM2,
    rentCLP,
    priceUF,
    parking,
    storage,
    maintenanceStatus,
    generatedCopy: `🏡 DESTACADA ${type.toUpperCase()} DE ${bedrooms} HABITACIONES 🏡\n\nExcelente propiedad de ${surfaceM2} m² con amplios espacios familiares y gran luminosidad.\n\n• ${bedrooms} Habitaciones de excelente tamaño\n• ${bathrooms} Baños completos\n• ${parking > 0 ? `${parking} Estacionamiento(s)` : 'Sin estacionamiento'}\n• Entorno tranquilo y residencial en ${commune}\n\n💰 Valor referencial: $${rentCLP.toLocaleString('es-CL')} / mes. ¡Contáctanos para coordinar tu visita!`
  };
}
