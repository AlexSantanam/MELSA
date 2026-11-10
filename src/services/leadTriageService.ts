/**
 * Servicio Central de Leads Omnicanal & Triage con Inteligencia Artificial
 * MELSA Gestión Inmobiliaria
 */

export interface LeadAITriage {
  intent: 'Compra' | 'Venta' | 'Arriendo' | 'Tasación' | 'Asesoría';
  budget: string;
  commune: string;
  typology: string;
  urgency: 'Alta' | 'Media' | 'Baja' | string;
  qualificationScore: number; // 0 - 100
  summary: string;
  suggestedAction?: string;
}

export interface OmnichannelLead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  channel: 'whatsapp' | 'web_form' | 'tasacion_avm' | 'instagram' | 'portal_inmobiliario';
  time: string;
  timestamp: number;
  unread: boolean;
  status: 'nuevo' | 'en_gestion' | 'calificado' | 'cerrado';
  lastMessage: string;
  propertyContext?: {
    commune?: string;
    address?: string;
    propertyType?: string;
    usefulM2?: number;
    totalM2?: number;
    bedrooms?: number;
    bathrooms?: number;
    priceUF?: number;
    priceCLP?: number;
    rolSII?: string;
  };
  aiTriage: LeadAITriage;
  aiSuggestedReply: string;
  matchedPropertyId?: string;
}

const STORAGE_KEY = 'melsa_omnichannel_leads_v2';

// Leads iniciales de referencia profesional (Melsa Marga Marga & Región de Valparaíso)
const SEED_LEADS: OmnichannelLead[] = [
  {
    id: 'lead-real-1',
    name: 'Carolina Tapia Meneses',
    phone: '+56 9 7845 1290',
    email: 'c.tapia@gmail.com',
    channel: 'tasacion_avm',
    time: 'Hace 5 min',
    timestamp: Date.now() - 5 * 60 * 1000,
    unread: true,
    status: 'nuevo',
    lastMessage: 'Hola equipo MELSA, acabo de generar la tasación de mi casa en Peñablanca (Rol 433-032). Deseo coordinar la visita técnica del perito tasador para iniciar la venta.',
    propertyContext: {
      commune: 'Villa Alemana',
      address: 'Pje. Fernanda 596, Los Aromos II',
      propertyType: 'Casa',
      usefulM2: 72,
      totalM2: 135,
      bedrooms: 3,
      bathrooms: 1,
      priceUF: 2350,
      priceCLP: 97000000,
      rolSII: '433-032'
    },
    aiTriage: {
      intent: 'Venta',
      budget: '2.350 UF ($97M CLP)',
      commune: 'Villa Alemana (Peñablanca)',
      typology: 'Casa 3D / 1B (72 m²)',
      urgency: 'Alta (Solicitó visita técnica)',
      qualificationScore: 98,
      summary: 'Propietaria legítima con Rol SII oficial verificado. Alta plusvalía por cercanía a nuevo Hospital de Marga Marga y troncal sur. Propiedad con alta liquidez.',
      suggestedAction: 'Coordinar visita de inspección y firma de orden de corretaje con exclusividad.'
    },
    aiSuggestedReply: '¡Hola Carolina! Mucho gusto. Recibimos la ficha catastral de tu propiedad en Pasaje Fernanda. El perito tasador de MELSA puede coordinar la inspección presencial este viernes a las 11:00 hrs para revisar títulos en el CBR y estructurar el plan de venta. ¿Te acomoda ese horario?'
  },
  {
    id: 'lead-real-2',
    name: 'Gonzalo Silva Ugarte',
    phone: '+56 9 9123 4567',
    email: 'gonzalo.silva@outlook.com',
    channel: 'whatsapp',
    time: 'Hace 32 min',
    timestamp: Date.now() - 32 * 60 * 1000,
    unread: false,
    status: 'calificado',
    lastMessage: 'Buenas tardes Alexis, busco comprar una casa o departamento en Quilpué o Villa Alemana con presupuesto de hasta 3.500 UF. Tengo crédito preaprobado en Banco Santander.',
    propertyContext: {
      commune: 'Quilpué / Villa Alemana',
      propertyType: 'Casa',
      bedrooms: 3,
      bathrooms: 2,
      priceUF: 3500
    },
    aiTriage: {
      intent: 'Compra',
      budget: 'Hasta 3.500 UF ($144M CLP)',
      commune: 'Quilpué / Villa Alemana',
      typology: '3D / 2B',
      urgency: 'Alta (Crédito Santander Preaprobado)',
      qualificationScore: 94,
      summary: 'Comprador altamente solvente con preaprobación bancaria vigente. Busca zona consolidada con buena conectividad al troncal urbano o estación de metro.',
      suggestedAction: 'Cruzar con propiedades activas en cartera de MELSA en Quilpué y enviar set de 3 opciones.'
    },
    aiSuggestedReply: 'Estimado Gonzalo, un gusto saludarte. Excelente, tenemos 2 propiedades que calzan exacto con tu crédito de 3.500 UF en Quilpué y Villa Alemana. Te comparto las fichas con fotos y tour virtual para coordinar visitas este fin de semana.'
  }
];

/**
 * Obtiene todos los leads almacenados
 */
export function getStoredLeads(): OmnichannelLead[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_LEADS));
      return SEED_LEADS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : SEED_LEADS;
  } catch (err) {
    console.error('Error al cargar leads desde localStorage:', err);
    return SEED_LEADS;
  }
}

/**
 * Guarda los leads en localStorage y notifica a los componentes
 */
export function saveLeads(leads: OmnichannelLead[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
    window.dispatchEvent(new CustomEvent('melsa_leads_updated', { detail: leads }));
  } catch (err) {
    console.error('Error al guardar leads:', err);
  }
}

/**
 * Analizador Inteligente de Mensajes con IA (Groq / Heurística de Respaldo)
 */
export async function analyzeLeadWithAI(
  message: string,
  context?: {
    name?: string;
    commune?: string;
    propertyType?: string;
    priceUF?: number;
    priceCLP?: number;
    channel?: string;
  }
): Promise<{ triage: LeadAITriage; suggestedReply: string }> {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY || (import.meta.env as any).VITE_GROK_API_KEY;

  if (apiKey && apiKey !== 'TU_GROQ_API_KEY') {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: `Eres el Copiloto de Ventas y Triage de MELSA Gestión Inmobiliaria (Chile).
Tu trabajo es analizar el mensaje entrante de un cliente y devolver estrictamente un JSON válido con este formato:
{
  "intent": "Compra" | "Venta" | "Arriendo" | "Tasación" | "Asesoría",
  "budget": "string descriptivo con UF o CLP",
  "commune": "comuna detectada en Chile",
  "typology": "ej. 3D / 2B o Tipo de propiedad",
  "urgency": "Alta" | "Media" | "Baja" con motivo breve,
  "qualificationScore": número entero entre 60 y 99 según solidez del lead,
  "summary": "1 a 2 oraciones profesionales analizando el perfil comercial del cliente",
  "suggestedAction": "paso comercial inmediato sugerido para el corredor",
  "suggestedReply": "Respuesta cálida, profesional y persuasiva por WhatsApp de parte de MELSA Gestión Inmobiliaria"
}`
            },
            {
              role: 'user',
              content: `Cliente: ${context?.name || 'Cliente Web'}
Canal: ${context?.channel || 'Web Form'}
Contexto adicional: Comuna: ${context?.commune || 'No especificada'}, Valor estimado: ${context?.priceUF ? context.priceUF + ' UF' : 'Por definir'}
Mensaje del cliente: "${message}"`
            }
          ],
          temperature: 0.2,
          response_format: { type: 'json_object' }
        })
      });

      if (response.ok) {
        const json = await response.json();
        const content = json.choices?.[0]?.message?.content;
        if (content) {
          const parsed = JSON.parse(content);
          return {
            triage: {
              intent: parsed.intent || 'Tasación',
              budget: parsed.budget || (context?.priceUF ? `${context.priceUF.toLocaleString('es-CL')} UF` : 'A definir'),
              commune: parsed.commune || context?.commune || 'Región de Valparaíso',
              typology: parsed.typology || context?.propertyType || 'Propiedad Residencial',
              urgency: parsed.urgency || 'Alta',
              qualificationScore: Number(parsed.qualificationScore) || 90,
              summary: parsed.summary || 'Lead interesado recibido a través de la plataforma web de MELSA.',
              suggestedAction: parsed.suggestedAction || 'Contactar vía WhatsApp para coordinar visita.'
            },
            suggestedReply: parsed.suggestedReply || `¡Hola ${context?.name ? context.name.split(' ')[0] : ''}! Gracias por contactar a MELSA Gestión Inmobiliaria. Revisamos tu solicitud y nos encantaría coordinar una llamada o visita. ¿Qué horario te acomoda hoy?`
          };
        }
      }
    } catch (err) {
      console.warn('[Lead Triage AI] Groq API fallback to heuristic analysis:', err);
    }
  }

  // Heurística Semántica de Respaldo (Rápida y precisa)
  const norm = (message || '').toLowerCase();
  let intent: LeadAITriage['intent'] = 'Tasación';
  if (norm.includes('compr') || norm.includes('busco') || norm.includes('interesa')) intent = 'Compra';
  else if (norm.includes('arrend') || norm.includes('alquil')) intent = 'Arriendo';
  else if (norm.includes('vend') || norm.includes('tasac') || norm.includes('perit')) intent = 'Venta';

  const budget = context?.priceUF 
    ? `${context.priceUF.toLocaleString('es-CL')} UF ($${(context.priceCLP || 0).toLocaleString('es-CL')} CLP)`
    : (norm.match(/(\d+[\.\d]*)\s*(uf|millones|\$)/i)?.[0] || 'En evaluación de mercado');

  const commune = context?.commune || (norm.includes('villa alemana') ? 'Villa Alemana' : norm.includes('quilpue') ? 'Quilpué' : norm.includes('vina') ? 'Viña del Mar' : 'Región de Valparaíso');

  const firstName = context?.name ? context.name.split(' ')[0] : 'Estimado/a';

  return {
    triage: {
      intent,
      budget,
      commune,
      typology: context?.propertyType || 'Inmueble Residencial',
      urgency: 'Alta (Solicitó contacto directo)',
      qualificationScore: context?.priceUF ? 96 : 88,
      summary: `Lead calificado ingresado por ${context?.channel === 'tasacion_avm' ? 'Tasador AVM' : 'Formulario Web'}. Requiere atención prioritaria por interés activo en ${commune}.`,
      suggestedAction: 'Contactar vía WhatsApp oficial para agendar cita o enviar comparables.'
    },
    suggestedReply: `¡Hola ${firstName}! Te saluda el equipo de MELSA Gestión Inmobiliaria. Recibimos tu solicitud para ${commune} con gran interés. ¿Te acomoda que coordinemos una breve llamada de 5 minutos o prefieres que te enviemos los detalles por este medio?`
  };
}

/**
 * Registra un Lead Real desde el Formulario de Tasación / Venta
 */
export async function addLeadFromValuation(data: {
  name: string;
  phone: string;
  email?: string;
  propertyType: string;
  commune: string;
  address?: string;
  rolSII?: string;
  usefulM2: number;
  totalM2: number;
  bedrooms: number;
  bathrooms: number;
  baseMarketUF: number;
  baseMarketCLP: number;
  specialAttributes?: string;
}): Promise<OmnichannelLead> {
  const message = `Hola equipo MELSA, acabo de generar la tasación de mi ${data.propertyType} en ${data.commune} (${data.address || 'Sector residencial'}). Rol SII: ${data.rolSII || 'No indicado'}. Valor sugerido: ${data.baseMarketUF.toLocaleString('es-CL')} UF ($${data.baseMarketCLP.toLocaleString('es-CL')} CLP). Solicito asesoría para el proceso de venta.`;

  const { triage, suggestedReply } = await analyzeLeadWithAI(message, {
    name: data.name,
    commune: data.commune,
    propertyType: data.propertyType,
    priceUF: data.baseMarketUF,
    priceCLP: data.baseMarketCLP,
    channel: 'tasacion_avm'
  });

  const newLead: OmnichannelLead = {
    id: `lead-real-${Date.now()}`,
    name: data.name.trim() || 'Propietario Interesado',
    phone: data.phone.trim() || '+56 9 9989 9421',
    email: data.email?.trim() || undefined,
    channel: 'tasacion_avm',
    time: 'Hace un momento',
    timestamp: Date.now(),
    unread: true,
    status: 'nuevo',
    lastMessage: message,
    propertyContext: {
      commune: data.commune,
      address: data.address,
      propertyType: data.propertyType,
      usefulM2: data.usefulM2,
      totalM2: data.totalM2,
      bedrooms: data.bedrooms,
      bathrooms: data.bathrooms,
      priceUF: data.baseMarketUF,
      priceCLP: data.baseMarketCLP,
      rolSII: data.rolSII
    },
    aiTriage: triage,
    aiSuggestedReply: suggestedReply
  };

  const existing = getStoredLeads();
  const updated = [newLead, ...existing];
  saveLeads(updated);

  return newLead;
}

/**
 * Registra un Lead Real desde el Modal de Asesoría / Contacto
 */
export async function addLeadFromAdvisory(data: {
  name: string;
  phone: string;
  email?: string;
  topic?: string;
  preferredTime?: string;
  notes?: string;
}): Promise<OmnichannelLead> {
  const message = `Solicitud de Asesoría Inmobiliaria: Motivo: ${data.topic || 'General'}. Horario preferido: ${data.preferredTime || 'A convenir'}. Mensaje: "${data.notes || 'Quiero recibir información sobre sus servicios inmobiliarios.'}"`;

  const { triage, suggestedReply } = await analyzeLeadWithAI(message, {
    name: data.name,
    channel: 'web_form'
  });

  const newLead: OmnichannelLead = {
    id: `lead-real-${Date.now()}`,
    name: data.name.trim() || 'Contacto Web',
    phone: data.phone.trim() || '+56 9 9989 9421',
    email: data.email?.trim(),
    channel: 'web_form',
    time: 'Hace un momento',
    timestamp: Date.now(),
    unread: true,
    status: 'nuevo',
    lastMessage: message,
    aiTriage: triage,
    aiSuggestedReply: suggestedReply
  };

  const existing = getStoredLeads();
  const updated = [newLead, ...existing];
  saveLeads(updated);

  return newLead;
}

/**
 * Crea un lead interactivo manual o simulado en vivo para pruebas
 */
export async function createManualLiveLead(data: {
  name: string;
  phone: string;
  channel: 'whatsapp' | 'web_form' | 'instagram' | 'portal_inmobiliario';
  message: string;
  commune?: string;
}): Promise<OmnichannelLead> {
  const { triage, suggestedReply } = await analyzeLeadWithAI(data.message, {
    name: data.name,
    commune: data.commune,
    channel: data.channel
  });

  const newLead: OmnichannelLead = {
    id: `lead-manual-${Date.now()}`,
    name: data.name.trim() || 'Nuevo Contacto',
    phone: data.phone.trim() || '+56 9 1234 5678',
    channel: data.channel,
    time: 'Hace un momento',
    timestamp: Date.now(),
    unread: true,
    status: 'nuevo',
    lastMessage: data.message,
    aiTriage: triage,
    aiSuggestedReply: suggestedReply
  };

  const existing = getStoredLeads();
  const updated = [newLead, ...existing];
  saveLeads(updated);

  return newLead;
}

/**
 * Marca un lead como leído
 */
export function markLeadAsRead(leadId: string): void {
  const leads = getStoredLeads();
  const updated = leads.map(l => l.id === leadId ? { ...l, unread: false } : l);
  saveLeads(updated);
}

/**
 * Elimina un lead
 */
export function deleteLead(leadId: string): void {
  const leads = getStoredLeads();
  const updated = leads.filter(l => l.id !== leadId);
  saveLeads(updated);
}
