// aiAdvisorService.ts
// Motor de conexión para IA Inmobiliaria con API de Groq (Llama 3.3 70B / 8B) o xAI Grok.
// Altísima velocidad (~300-500 tokens/seg) y costos mínimos (fracción de centavo por consulta vs Claude).

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

const MELSA_SYSTEM_PROMPT = `
Eres "Melsa AI", el asesor cuantitativo y consultor patrimonial de MELSA Gestión Inmobiliaria a nivel NACIONAL en todo Chile.
Tu propósito es asesorar a clientes e inversionistas en todas las regiones del país:
1. Cobertura Nacional Completa:
   - Región Metropolitana (Santiago, Las Condes, Vitacura, Providencia, Chicureo, Maipú, etc.).
   - Zona Norte: Antofagasta, Calama, Iquique, Arica y La Serena/Coquimbo.
   - Zona Centro & Costa: Gran Valparaíso, Viña del Mar, Concón, Rancagua, Talca.
   - Zona Sur & Austral: Gran Concepción (Biobío), Temuco (Araucanía), Valdivia, Puerto Varas / Puerto Montt (Los Lagos), Punta Arenas.
2. Análisis de viabilidad y rentabilidad (Cap Rate de arriendo 5% a 8.5%, TIR esperada 11% a 16%).
3. Estructuración financiera bancaria en Chile (UF y CLP, pie en cuotas, dividendos y créditos hipotecarios).
4. Tono: Ejecutivo, analítico, seguro, elegante y transparente.
5. Llamado a la acción: Invita a contactar a los ejecutivos de Melsa al WhatsApp +56 9 9989 9421.
Sé conciso y claro en tus respuestas (máximo 2-3 párrafos o puntos clave).
`;

export async function askMelsaAI(userMessage: string, history: ChatMessage[] = []): Promise<string> {
  const groqApiKey = import.meta.env.VITE_GROQ_API_KEY || (import.meta.env as any).VITE_GROK_API_KEY;

  if (groqApiKey && groqApiKey !== 'TU_GROQ_API_KEY') {
    try {
      const endpoint = 'https://api.groq.com/openai/v1/chat/completions';
      // qwen/qwen3.8-27b en Groq responde en milisegundos con excelente español
      const model = 'qwen/qwen3.8-27b';

      const messages: ChatMessage[] = [
        { role: 'system', content: MELSA_SYSTEM_PROMPT },
        ...history.slice(-4),
        { role: 'user', content: userMessage }
      ];

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${groqApiKey}`
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.6,
          max_tokens: 500,
        })
      });

      if (response.ok) {
        const data = await response.json();
        const reply = data.choices?.[0]?.message?.content;
        if (reply && reply.trim().length > 0) return reply;
      } else {
        console.warn('Groq API respondió con status:', response.status);
      }
    } catch (err) {
      console.error('Error al invocar API de Groq:', err);
    }
  }

  // --- MOTOR LOCAL INTELIGENTE DE RESPALDO (Sin necesidad de key o si está offline) ---
  const query = userMessage.toLowerCase();

  if (query.includes('tasa') || query.includes('crédito') || query.includes('dividendo') || query.includes('banco') || query.includes('financiar')) {
    return `Para optimizar tu financiamiento, los bancos chilenos exigen que el dividendo mensual no supere el 25% a 30% de tus ingresos líquidos demostrables. 

Actualmente, las tasas hipotecarias se sitúan en torno al 4.5% - 5.2%. Una estrategia muy rentable es invertir en proyectos en blanco o verde: puedes pagar el 15% o 20% del pie en hasta 30 cuotas sin interés durante la construcción, y solicitar el crédito recién al momento de la entrega. 

¿Te gustaría que evaluemos tu capacidad de endeudamiento exacta? Puedes contactarnos directamente a nuestro WhatsApp oficial +56 9 9989 9421.`;
  }

  if (query.includes('rentabilidad') || query.includes('cap rate') || query.includes('tir') || query.includes('ganar') || query.includes('roi')) {
    return `En el mercado chileno actual, la rentabilidad anual bruta por arriendo (Cap Rate) se distribuye de la siguiente manera:

• Santiago Oriente (Las Condes / Vitacura): Cap Rate 5.2% - 5.8% anual, con la plusvalía más sólida y menor vacancia del país (< 3%).
• Providencia / Ñuñoa: Cap Rate 5.8% - 6.5% anual, altísima rotación y absorción de arriendo inmediata.
• Puerto Varas & Zona Sur: Cap Rate 6.8% - 7.6% con TIR sobre 13% debido a la escasez de suelo y migración de familias.

En Melsa te asesoramos para armar una cartera que equilibre flujo mensual de arriendo con plusvalía de largo plazo.`;
  }

  if (query.includes('sector') || query.includes('donde') || query.includes('zona') || query.includes('comuna') || query.includes('puerto varas') || query.includes('condes')) {
    return `La mejor zona depende de tu objetivo patrimonial:

1. Si buscas Preservación de Capital y Prestigio: Vitacura, Las Condes y Lo Barnechea son el activo refugio indiscutido.
2. Si buscas Flujo de Arriendo Inmediato: Providencia y unidades 1D+1B cercanas a líneas de Metro tienen vacancia prácticamente nula.
3. Si buscas Alta Plusvalía a 5 años: La cuenca del Lago Llanquihue (Puerto Varas / Frutillar) y Concón bordemar presentan el mayor potencial de valorización por m².

Podemos filtrar las propiedades vigentes de Melsa que mejor calcen con tu presupuesto. ¿De qué monto dispones para invertir?`;
  }

  // Respuesta general de consultoría Melsa
  return `¡Hola! Como asistente financiero de Melsa Gestión Inmobiliaria, analizo opciones de inversión considerando Cap Rate, plusvalía proyectada y capacidad de crédito.

¿En qué puedo orientarte hoy?
• ¿Quieres evaluar la rentabilidad de una comuna o zona específica?
• ¿Deseas calcular tu capacidad máxima de compra con crédito hipotecario?
• ¿Buscas propiedades para vivir o para renta residencial?

También puedes coordinar una sesión directa con nuestros asesores en el WhatsApp +56 9 9989 9421.`;
}

export async function optimizeListingWithAI(draft: string, meta?: { type?: string; location?: string; price?: string; operation?: string }): Promise<string> {
  const groqApiKey = import.meta.env.VITE_GROQ_API_KEY || (import.meta.env as any).VITE_GROK_API_KEY;

  if (groqApiKey && groqApiKey !== 'TU_GROQ_API_KEY') {
    try {
      const endpoint = 'https://api.groq.com/openai/v1/chat/completions';
      const model = 'qwen/qwen3.8-27b';

      const prompt = `Eres el redactor inmobiliario senior de MELSA. Transforma las notas o borrador del usuario en una ficha de propiedad irresistible, 100% libre de duplicados de otros portales, optimizada para SEO en Google Chile.
Datos adicionales: Operación: ${meta?.operation || 'Venta'}, Inmueble: ${meta?.type || 'Propiedad'}, Ubicación: ${meta?.location || 'Chile'}, Precio: ${meta?.price || 'A consultar'}.
Estructura la respuesta con:
1. Título Vendedor SEO impactante
2. Resumen Emocional y Atractivo
3. Puntos Fuertes & Distribución (con viñetas)
4. Equipamiento / Entorno y Conectividad
5. Llamado a coordinar visita.
Sé profesional, elegante y persuasivo.`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${groqApiKey}`
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: prompt },
            { role: 'user', content: draft }
          ],
          temperature: 0.6,
          max_tokens: 650,
        })
      });

      if (response.ok) {
        const data = await response.json();
        const reply = data.choices?.[0]?.message?.content;
        if (reply && reply.trim().length > 0) return reply;
      }
    } catch (err) {
      console.error('Error optimizando ficha con Groq:', err);
    }
  }

  // Fallback local
  return `# Oportunidad Inmobiliaria Destacada en ${meta?.location || 'Excelente Ubicación'}

## Descripción General
Presentamos una excelente propiedad diseñada para quienes buscan confort, conectividad y calidad de vida. Ubicada estratégicamente con acceso expedito a comercios, servicios y áreas verdes.

### Características Principales
• Tipología: ${meta?.type || 'Inmueble'}
• Operación: ${meta?.operation || 'Venta'}
• Precio Referencial: ${meta?.price || 'Consultar con ejecutivo'}
• Detalles: ${draft}

### Entorno y Conectividad
Sector consolidado de alta demanda, excelente plusvalía y seguridad para vivir o invertir.

¡Contáctanos para coordinar una visita y recibir la ficha técnica completa!`;
}

