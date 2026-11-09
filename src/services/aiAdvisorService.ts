// aiAdvisorService.ts
// Motor de IA Inmobiliaria con API de Groq (Qwen / Llama 3) para MELSA Gestión Inmobiliaria (Chile).
// Personalidad: Ejecutivo de ventas senior cercano, empático, consultivo y experto en la plataforma.

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

const MELSA_SYSTEM_PROMPT = `
Eres un Ejecutivo Comercial Senior y Asesor Inmobiliario de "MELSA Gestión Inmobiliaria" en Chile.
Tu nombre comercial es "Asesor Ejecutivo Melsa".

PERSONALIDAD Y TONO:
- Tu trato es CERCANO, CÁLIDO, EMPÁTICO, PROFESIONAL Y RESOLUTIVO (como el mejor ejecutivo de ventas inmobiliario chileno que atiende por WhatsApp o en oficina: "¡Hola! Qué gusto saludarte", "Te ayudo de inmediato con eso", "Te cuento cómo funciona").
- NUNCA respondas con plantillas robóticas frías ni suenes como un bot genérico.
- Responde SIEMPRE de forma directa, ágil y concreta a la pregunta exacta del usuario, sin rodeos.
- Usa lenguaje natural chileno corporativo (UF, CLP, comunas de Chile, crédito hipotecario, pie en cuotas, promesa de compraventa, corredor de propiedades).

CONOCIMIENTO INTEGRAL DE MELSA:
1. INGRESO AL PORTAL / INTRANET:
   - Para ingresar a la plataforma, el usuario solo debe hacer clic en el botón "Intranet" o "Software Agencias" ubicado en la barra de navegación superior de la web.
   - Desde ahí acceden:
     • Corredores y Agencias: A su Workspace OS (Daily Copilot, cartera, contratos, cruce de leads y firma digital).
     • Propietarios: A su portal de autoservicio para revisar el estado de sus propiedades en arriendo, visitas en vivo y liquidaciones mensuales.
     • Arrendatarios: Para consultar sus obligaciones por RUT, descargar contratos y pagar arriendos en línea.
   - Si un usuario no recuerda su clave o necesita crear una cuenta nueva, invítalo con calidez a escribirnos directamente al WhatsApp oficial +56 9 9989 9421 para asistirlo al instante.

2. SOFTWARE PARA AGENCIAS Y CORREDORAS (MELSA WORKSPACE OS):
   - Es el sistema operativo para corretaje más moderno de Chile.
   - Incluye:
     • Ingesta Multimodal: Carga propiedades dictando por voz con micrófono o subiendo un PDF antiguo, y la IA de Groq extrae las variables en segundos.
     • Daily Copilot: Centro de comando que prioriza cada mañana los leads más calientes y contratos por vencer.
     • Smart Matching: Cruza automáticamente el inventario con compradores y arrendatarios calificados.
     • LegalTech y Firma Electrónica Notarial (Ley 19.799) con validación OTP y hash criptográfico.
     • Planes accesibles con 14 días de prueba gratuita.

3. ASESORÍA DE COMPRA, INVERSIÓN Y PROYECTOS:
   - Cobertura nacional: Santiago Oriente (Las Condes, Vitacura, Providencia, Lo Barnechea, Ñuñoa), Costa (Viña del Mar, Concón), y Sur (Puerto Varas, Frutillar).
   - Opciones de financiamiento, pago de pie en hasta 30 cuotas sin interés en proyectos en blanco/verde, y análisis de Cap Rate (5.5% a 7.5%) y plusvalía.

4. GESTIÓN Y ADMINISTRACIÓN DE ARRIENDOS:
   - Arriendo garantizado, filtro riguroso de arrendatarios con DICOM y liquidaciones puntuales al propietario.

LLAMADO A LA ACCIÓN:
- Al final de tu respuesta, si corresponde dar el siguiente paso, invita cordialmente a continuar la atención por el WhatsApp oficial (+56 9 9989 9421) o agendar una reunión con el equipo.
- Sé breve y conciso (máximo 2 a 3 párrafos o viñetas claras).
`;

export async function askMelsaAI(userMessage: string, history: ChatMessage[] = []): Promise<string> {
  const groqApiKey = import.meta.env.VITE_GROQ_API_KEY || (import.meta.env as any).VITE_GROK_API_KEY;

  if (groqApiKey && groqApiKey !== 'TU_GROQ_API_KEY') {
    try {
      const endpoint = 'https://api.groq.com/openai/v1/chat/completions';
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
          temperature: 0.65,
          max_tokens: 550,
        })
      });

      if (response.ok) {
        const data = await response.json();
        const reply = data.choices?.[0]?.message?.content;
        if (reply && reply.trim().length > 0) return reply;
      } else {
        console.warn('Groq API status:', response.status);
      }
    } catch (err) {
      console.error('Error al invocar API de Groq:', err);
    }
  }

  // --- MOTOR LOCAL CERCANO DE RESPALDO (Ejecutivo de Ventas Humano) ---
  const query = userMessage.toLowerCase().trim();

  // 1. Acceso a portal / intranet / login
  if (query.includes('portal') || query.includes('ingreso') || query.includes('ingresar') || query.includes('entrar') || query.includes('login') || query.includes('iniciar sesion') || query.includes('intranet') || query.includes('clave') || query.includes('acceso')) {
    return `¡Hola! Qué gusto saludarte. Te ayudo de inmediato con tu acceso.

Para ingresar a la plataforma, solo debes presionar el botón **"Intranet"** o **"Software Agencias"** ubicado en la barra superior derecha de la página.

Desde allí pueden acceder:
• **Corredoras y Agencias:** Para entrar al Workspace OS y gestionar clientes, cartera y contratos.
• **Propietarios:** Para consultar sus liquidaciones mensuales y visitas en vivo.
• **Arrendatarios:** Para revisar contratos y pagar sus obligaciones online.

Si olvidaste tu clave o necesitas habilitar tu acceso por primera vez, escríbenos directamente a nuestro WhatsApp oficial **+56 9 9989 9421** y te asistimos al instante. ¿Te ayudo con algo más?`;
  }

  // 2. Software agencias / CRM
  if (query.includes('software') || query.includes('agencia') || query.includes('corredor') || query.includes('crm') || query.includes('workspace') || query.includes('copilot') || query.includes('matching')) {
    return `¡Hola! Con mucho gusto te cuento sobre nuestro **Workspace OS para Corredoras**:

Es una plataforma creada exclusivamente para el mercado inmobiliario chileno que automatiza las tareas pesadas del corredor:
• **Ingesta por Voz con IA:** Dictas un audio de 1 minuto y la IA extrae los datos y redacta el copy comercial listo para portales.
• **Daily Copilot:** Te dice cada mañana exactamente qué clientes contactar y qué cierres están calientes.
• **Smart Matching:** Cruza tus propiedades con prospectos calificados en segundos.
• **Firma Electrónica Notarial (Ley 19.799):** Para cerrar promesas y arriendos con validez legal inmediata.

Puedes probarlo gratis por 14 días haciendo clic en **"Software Agencias"** en el menú superior o escribirnos al WhatsApp **+56 9 9989 9421** para darte una demo guiada.`;
  }

  // 3. Financiamiento / crédito / dividendos
  if (query.includes('tasa') || query.includes('crédito') || query.includes('credito') || query.includes('dividendo') || query.includes('banco') || query.includes('financiar') || query.includes('pie')) {
    return `¡Hola! Excelente consulta. Te cuento cómo lo estructuramos en Melsa para que consigas las mejores condiciones:

Actualmente las tasas hipotecarias se ubican en torno al 4.5% - 5.2%. Una de las mejores estrategias que trabajamos con nuestros inversionistas es comprar en **blanco o verde**: esto te permite pagar el pie (15% o 20%) en hasta 30 cuotas sin interés durante la obra, pidiendo el crédito recién al recibir el departamento.

Además, los bancos piden que tu dividendo no supere el 25% a 30% de tu renta líquida. ¿Te gustaría que simulemos tu capacidad crediticia sin costo? Escríbenos al WhatsApp **+56 9 9989 9421** y lo vemos con un asesor financiero.`;
  }

  // 4. Rentabilidad / Cap Rate
  if (query.includes('rentabilidad') || query.includes('cap rate') || query.includes('tir') || query.includes('ganar') || query.includes('inversion') || query.includes('invertir')) {
    return `¡Hola! Con gusto te oriento en números de inversión:

En el mercado chileno actual estamos manejando rentabilidades promedio por arriendo (Cap Rate) muy atractivas:
• **Santiago Oriente (Las Condes / Vitacura):** Cap Rate 5.2% - 5.8% anual, con la plusvalía más sólida y vacancia mínima.
• **Providencia / Ñuñoa:** Cap Rate 5.8% - 6.5%, alta demanda y absorción casi inmediata.
• **Sur & Lagos (Puerto Varas / Frutillar):** Cap Rate sobre 7% con alta plusvalía por escasez de suelo.

Cuéntame qué presupuesto tienes pensado o qué comuna te interesa y te preparo una propuesta personalizada.`;
  }

  // 5. Saludo o consulta general cercana
  return `¡Hola! Qué gusto saludarte. Soy tu asesor comercial en **MELSA Gestión Inmobiliaria**.

Te puedo orientar en lo que necesites hoy:
• ¿Buscas comprar, vender o arrendar una propiedad?
• ¿Quieres conocer nuestro **Software para Corredoras** o ingresar a la Intranet?
• ¿Deseas evaluar opciones de inversión con rentabilidad y financiamiento hipotecario?

Dime qué estás buscando o, si prefieres una atención telefónica inmediata, escríbenos a nuestro WhatsApp oficial **+56 9 9989 9421**. ¡Estamos para ayudarte!`;
}

export async function optimizeListingWithAI(draft: string, meta?: { type?: string; location?: string; price?: string; operation?: string }): Promise<string> {
  const groqApiKey = import.meta.env.VITE_GROQ_API_KEY || (import.meta.env as any).VITE_GROK_API_KEY;

  if (groqApiKey && groqApiKey !== 'TU_GROQ_API_KEY') {
    try {
      const endpoint = 'https://api.groq.com/openai/v1/chat/completions';
      const model = 'qwen/qwen3.8-27b';

      const prompt = `Eres el redactor inmobiliario senior de MELSA Gestión Inmobiliaria (Chile). Transforma las notas o borrador en una ficha de propiedad atractiva, 100% optimizada para SEO en Google Chile y portales como PortalInmobiliario y TocToc.
Datos: Operación: ${meta?.operation || 'Venta'}, Inmueble: ${meta?.type || 'Propiedad'}, Ubicación: ${meta?.location || 'Chile'}, Precio: ${meta?.price || 'A consultar'}.
Estructura:
1. Título Vendedor SEO impactante
2. Resumen Emocional y Atractivo
3. Puntos Fuertes & Distribución (con viñetas)
4. Equipamiento / Entorno y Conectividad
5. Llamado a coordinar visita al WhatsApp de Melsa.
Sé cercano, profesional, elegante y persuasivo.`;

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

¡Contáctanos al WhatsApp +56 9 9989 9421 para coordinar una visita y recibir la ficha técnica completa!`;
}
