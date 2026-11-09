// propertyAiExtractor.ts
// Servicio para ingesta multimodal e IA extractiva inmobiliaria con Groq (Qwen / Llama) y Web Speech API en Chile.

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

const FALLBACK_DEFAULT: ExtractedPropertyData = {
  title: 'Departamento Vista Despejada Manuel Montt',
  address: 'Manuel Montt 890',
  commune: 'Providencia, RM',
  type: 'Depto',
  bedrooms: 2,
  bathrooms: 2,
  surfaceM2: 75,
  rentCLP: 780000,
  priceUF: 5200,
  parking: 1,
  storage: 1,
  maintenanceStatus: 'Falta pintura en living (Agendado)',
  generatedCopy: '✨ VIVE EN EL CORAZÓN DE PROVIDENCIA ✨\n\nDepartamento en piso alto con privilegiada vista norte despejada hacia el Cerro San Cristóbal. A pasos del Metro Manuel Montt.\n\n• 2 Dormitorios amplios (principal en suite)\n• 2 Baños completos con finas terminaciones\n• 75 m² útiles con terraza privada\n• Incluye estacionamiento subterráneo y bodega amplia\n\n💰 Canon arriendo: $780.000 / mes · Disponibilidad inmediata.'
};

/**
 * Llama a la API de Groq con el modelo ultra-rápido qwen/qwen3.8-27b
 * para estructurar texto libre en variables inmobiliarias y generar copy publicitario.
 */
export async function extractPropertyWithGroq(inputText: string): Promise<ExtractedPropertyData> {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY || (import.meta.env as any).VITE_GROK_API_KEY;

  if (!apiKey || apiKey === 'TU_GROQ_API_KEY') {
    console.warn('API key de Groq no configurada, usando extractor heurístico local.');
    return extractPropertyHeuristic(inputText);
  }

  try {
    const endpoint = 'https://api.groq.com/openai/v1/chat/completions';
    const systemPrompt = `
Eres el motor de IA inmobiliaria de MELSA Gestión Inmobiliaria (Chile).
Tu misión es recibir una descripción, nota de voz transcrita o ficha técnica de un inmueble en Chile, extraer todas sus variables cuantitativas y redactar un copy comercial de alta conversión para portales (PortalInmobiliario, TocToc, Yapo).

Debes responder EXCLUSIVAMENTE con un JSON válido (sin etiquetas markdown adicionales ni explicaciones) con la siguiente estructura:
{
  "title": "string representativo y atractivo del inmueble (ej: Depto 2D/2B con Vista Despejada en Providencia)",
  "address": "string con la calle o dirección aproximada",
  "commune": "string con la comuna y región (ej: Providencia, RM)",
  "type": "Depto" | "Casa" | "Oficina" | "Comercial",
  "bedrooms": number (dormitorios o piezas),
  "bathrooms": number (baños),
  "surfaceM2": number (metros cuadrados útiles o totales),
  "rentCLP": number (canon mensual en pesos chilenos, entiende jerga como '800 lucas' = 800000),
  "priceUF": number (valor en UF si se menciona, sino estimar según m2 y comuna o 0),
  "parking": number (número de estacionamientos),
  "storage": number (número de bodegas),
  "maintenanceStatus": "string con reparaciones pendientes o 'Impecable'",
  "generatedCopy": "string con la redacción comercial persuasiva, con emojis ejecutivos, viñetas de amenidades y llamado a la acción comercial chileno"
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

    if (!response.ok) {
      console.warn(`Groq API respondió ${response.status}. Usando extractor local.`);
      return extractPropertyHeuristic(inputText);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      return extractPropertyHeuristic(inputText);
    }

    const parsed = JSON.parse(content);
    return {
      title: parsed.title || 'Propiedad Captada por IA',
      address: parsed.address || 'Ubicación central',
      commune: parsed.commune || 'Santiago, RM',
      type: parsed.type || 'Depto',
      bedrooms: Number(parsed.bedrooms) || 2,
      bathrooms: Number(parsed.bathrooms) || 1,
      surfaceM2: Number(parsed.surfaceM2) || 60,
      rentCLP: Number(parsed.rentCLP) || 650000,
      priceUF: Number(parsed.priceUF) || 4500,
      parking: typeof parsed.parking === 'boolean' ? (parsed.parking ? 1 : 0) : Number(parsed.parking) || 0,
      storage: typeof parsed.storage === 'boolean' ? (parsed.storage ? 1 : 0) : Number(parsed.storage) || 0,
      maintenanceStatus: parsed.maintenanceStatus || 'Impecable / Listo para habitar',
      generatedCopy: parsed.generatedCopy || inputText
    };
  } catch (error) {
    console.error('Error al procesar con Groq:', error);
    return extractPropertyHeuristic(inputText);
  }
}

/**
 * Extractor heurístico de respaldo local sin conexión
 */
export function extractPropertyHeuristic(text: string): ExtractedPropertyData {
  if (!text || text.trim().length === 0) return FALLBACK_DEFAULT;

  const lower = text.toLowerCase();
  
  // Dormitorios
  const bedMatch = lower.match(/(\d+)\s*(?:dormitorio|dorm|habitación|pieza|d\b)/);
  const bedrooms = bedMatch ? parseInt(bedMatch[1], 10) : 2;

  // Baños
  const bathMatch = lower.match(/(\d+)\s*(?:baño|bano|b\b)/);
  const bathrooms = bathMatch ? parseInt(bathMatch[1], 10) : 2;

  // Metros cuadrados
  const m2Match = lower.match(/(\d+)\s*(?:m2|m²|metros)/);
  const surfaceM2 = m2Match ? parseInt(m2Match[1], 10) : 70;

  // Valor UF
  const ufMatch = lower.match(/(\d+[\.\,]?\d*)\s*(?:uf|u\.f\.)/);
  let priceUF = 5000;
  if (ufMatch) {
    priceUF = parseFloat(ufMatch[1].replace('.', '').replace(',', '.'));
  }

  // Arriendo CLP
  let rentCLP = 750000;
  const lucasMatch = lower.match(/(\d+)\s*(?:lucas|mil)/);
  const clpMatch = lower.match(/\$\s*([\d\.]+)/);
  if (clpMatch) {
    rentCLP = parseInt(clpMatch[1].replace(/\./g, ''), 10);
  } else if (lucasMatch) {
    rentCLP = parseInt(lucasMatch[1], 10) * 1000;
  }

  // Comuna
  let commune = 'Santiago, RM';
  const communes = ['providencia', 'las condes', 'ñuñoa', 'vitacura', 'lo barnechea', 'santiago centro', 'macul', 'la reina', 'viña del mar', 'concepción'];
  for (const c of communes) {
    if (lower.includes(c)) {
      commune = c.charAt(0).toUpperCase() + c.slice(1) + ', Chile';
      break;
    }
  }

  return {
    title: `Inmueble ${bedrooms}D/${bathrooms}B en ${commune.split(',')[0]}`,
    address: 'Sector residencial destacado',
    commune,
    type: lower.includes('casa') ? 'Casa' : 'Depto',
    bedrooms,
    bathrooms,
    surfaceM2,
    rentCLP,
    priceUF,
    parking: lower.includes('estacionamiento') || lower.includes('auto') ? 1 : 0,
    storage: lower.includes('bodega') ? 1 : 0,
    maintenanceStatus: lower.includes('pintura') ? 'Falta pintura menor' : 'En excelente estado',
    generatedCopy: `🏙️ OPORTUNIDAD DESTACADA EN ${commune.toUpperCase()} 🏙️\n\nPropiedad de ${surfaceM2} m² con excelente conectividad.\n• ${bedrooms} Dormitorios\n• ${bathrooms} Baños\n• Incluye ${lower.includes('estacionamiento') ? 'estacionamiento' : 'sin estacionamiento'}\n\n💰 Valor: $${rentCLP.toLocaleString('es-CL')} / mes. ¡Contáctanos para agendar visita!`
  };
}
