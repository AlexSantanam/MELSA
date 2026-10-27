import React, { useState } from 'react';
import { 
  ShieldCheck, 
  TrendingUp, 
  Camera, 
  Building2, 
  Scale, 
  UserCheck, 
  FileCheck, 
  Compass, 
  Briefcase, 
  ArrowRight, 
  Sparkles,
  CheckCircle2,
  PieChart,
  Layers
} from 'lucide-react';

interface ServicesSectionProps {
  onSelectService: (serviceName: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectService }) => {
  const [activeCategory, setActiveCategory] = useState<'investors' | 'owners' | 'developers'>('investors');

  const categories = [
    {
      id: 'investors',
      label: 'Compradores e Inversionistas',
      sublabel: 'Patrimonio & Rentabilidad',
      icon: TrendingUp
    },
    {
      id: 'owners',
      label: 'Propietarios & Venta Exclusiva',
      sublabel: 'Captación & Alto Valor',
      icon: Camera
    },
    {
      id: 'developers',
      label: 'Inmobiliarias & Desarrolladores',
      sublabel: 'Brokerage & Estrategia Comercial',
      icon: Building2
    }
  ];

  const servicesData = {
    investors: [
      {
        icon: Scale,
        title: 'Auditoría Legal & Due Diligence Inmobiliario',
        tag: 'Seguridad Jurídica',
        description: 'Estudio exhaustivo de títulos de 30 años, verificación de gravámenes, prohibiciones, saneamiento de dominio y redacción blindada de promesas y escrituras públicas.',
        deliverables: [
          'Informe legal de dominio pre-adquisición',
          'Blindaje contra embargos y litigios hereditarios',
          'Acompañamiento presencial en notaría y CBR'
        ],
        ctaText: 'Solicitar Due Diligence'
      },
      {
        icon: PieChart,
        title: 'Estructuración Financiera & Análisis ROI/TIR',
        tag: 'Inteligencia de Mercado',
        description: 'Evaluación algorítmica de rentabilidad neta por arriendo, análisis de plusvalía a 3 y 5 años con Big Data y convenios bancarios preferenciales para financiamiento.',
        deliverables: [
          'Modelación financiera de flujo de caja',
          'Gestión directa de mutuo y crédito hipotecario',
          'Estrategia de optimización tributaria inmobiliaria'
        ],
        ctaText: 'Solicitar Evaluación Financiera'
      },
      {
        icon: Compass,
        title: 'Acceso Privado a Oportunidades Off-Market',
        tag: 'Exclusividad',
        description: 'Conexión con propiedades que no se publican en portales masivos y asignación preferencial en lanzamientos en pozo con listas de precios "Familia & Amigos".',
        deliverables: [
          'Propiedades en blanco con hasta 18% de descuento',
          'Pie financiado en hasta 36 cuotas sin interés',
          'Asignación directa con directores comerciales'
        ],
        ctaText: 'Ver Oportunidades Off-Market'
      }
    ],
    owners: [
      {
        icon: FileCheck,
        title: 'Tasación Profesional e Inteligencia de Precios',
        tag: 'Precisión Comercial',
        description: 'Determinación certera del valor de mercado mediante analítica de precios reales de cierre (no precios inflados de lista), reduciendo el tiempo de venta hasta en un 55%.',
        deliverables: [
          'Dossier comparativo de mercado (ACM)',
          'Estrategia de fijación de precio óptimo',
          'Estudio de absorción de demanda por zona'
        ],
        ctaText: 'Solicitar Tasación Gratuita'
      },
      {
        icon: Camera,
        title: 'Marketing Inmobiliario Digital de Alta Gama',
        tag: 'Producción Audiovisual',
        description: 'Presentación editorial de tu propiedad con fotografía arquitectónica profesional, tomas aéreas con dron 4K, recorridos 3D inmersivos y pauta publicitaria hipersegmentada.',
        deliverables: [
          'Tour virtual interactivo 3D Matterport',
          'Video cinematográfico con dron 4K',
          'Campaña en redes para inversionistas calificados'
        ],
        ctaText: 'Conocer Plan de Marketing'
      },
      {
        icon: UserCheck,
        title: 'Filtro Estricto y Calificación de Compradores',
        tag: 'Seguridad & Discreción',
        description: 'Cero visitas de curiosos. Evaluamos solvencia patrimonial, pre-aprobación bancaria e identidad de cada interesado antes de abrir las puertas de tu propiedad.',
        deliverables: [
          'Pre-calificación crediticia obligatoria',
          'Protocolo de confidencialidad para clientes VIP',
          'Coordinación ejecutiva y reporte semanal de métricas'
        ],
        ctaText: 'Consignar Mi Propiedad'
      }
    ],
    developers: [
      {
        icon: Briefcase,
        title: 'Master Brokerage & Comercialización de Proyectos',
        tag: 'Alianzas B2B',
        description: 'Estructuración integral de la fuerza de venta externa para edificios residenciales, loteos y condominios. Lideramos el proceso comercial desde la venta en blanco hasta la entrega final.',
        deliverables: [
          'Estrategia de lanzamiento y cronograma de metas',
          'Fuerza de ventas senior dedicada y capacitada',
          'Integración CRM y reportabilidad ejecutiva 24/7'
        ],
        ctaText: 'Conversar Alianza B2B'
      },
      {
        icon: Layers,
        title: 'Gestión Comercial PMO y Mitigación de Desistimientos',
        tag: 'Control Operativo',
        description: 'Seguimiento meticuloso a promesas de compraventa, cobranza de cuotas de pie, rescates de créditos y acompañamiento activo en recepción municipal y escrituración.',
        deliverables: [
          'Tasa de caída de promesas inferior al 4%',
          'Gestión coordinada con bancos tasadores',
          'Auditoría y soporte postventa a propietarios'
        ],
        ctaText: 'Solicitar Propuesta PMO'
      },
      {
        icon: Building2,
        title: 'Búsqueda Estratégica de Paños y Terrenos',
        tag: 'Desarrollo Urbano',
        description: 'Identificación de terrenos estratégicos con potencial inmobiliario, análisis de normativa CIP (Certificado de Informaciones Previas), cabida preliminar y negociación de adquisición.',
        deliverables: [
          'Estudio de constructibilidad y densidad',
          'Negociación estructurada con propietarios de suelo',
          'Validación de factibilidad sanitaria y vial'
        ],
        ctaText: 'Consultar por Suelo Urbano'
      }
    ]
  };

  return (
    <section id="servicios" className="py-24 bg-white relative overflow-hidden border-t border-gray-100">
      {/* Decorative Brand Accent Background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#D02126]/5 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#0F1115]/5 rounded-full filter blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D02126]/10 text-[#D02126] text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Capacidades Institucionales Melsa</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#0F1115] font-normal tracking-tight mb-5">
            Ecosistema de Servicios Integrales
          </h2>
          <p className="text-gray-600 text-base sm:text-lg font-light leading-relaxed">
            Más que una agencia de corretaje, somos una firma consultora inmobiliaria que fusiona rigor legal, estructuración financiera, marketing digital y gestión de proyectos de alto valor.
          </p>
        </div>

        {/* Category Switcher Tabs */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 max-w-4xl mx-auto mb-16 p-1.5 bg-[#FAF9F8] rounded-2xl border border-gray-200">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`flex-1 flex items-center justify-center sm:justify-start gap-3 py-3.5 px-5 rounded-xl transition-all duration-300 text-left ${
                  isActive
                    ? 'bg-[#0F1115] text-white shadow-lg shadow-black/10'
                    : 'text-gray-600 hover:text-[#0F1115] hover:bg-white/80'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                  isActive ? 'bg-[#D02126] text-white' : 'bg-gray-200/70 text-gray-700'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className={`text-xs font-bold leading-tight ${isActive ? 'text-white' : 'text-[#0F1115]'}`}>
                    {cat.label}
                  </div>
                  <div className={`text-[11px] font-normal ${isActive ? 'text-gray-300' : 'text-gray-500'}`}>
                    {cat.sublabel}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* 3 Interactive Cards for Selected Category */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {servicesData[activeCategory].map((service, idx) => {
            const Icon = service.icon;

            return (
              <div
                key={idx}
                className="bg-[#FAF9F8] rounded-3xl p-8 border border-gray-200 hover:border-[#D02126] transition-all duration-300 flex flex-col justify-between group hover:shadow-2xl hover:-translate-y-1 relative overflow-hidden"
              >
                {/* Subtle top indicator */}
                <div className="absolute top-0 left-8 right-8 h-1 bg-gradient-to-r from-transparent via-[#D02126] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div>
                  {/* Top Bar with Icon & Tag */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-13 h-13 rounded-2xl bg-[#0F1115] flex items-center justify-center text-[#D02126] shadow-md group-hover:bg-[#D02126] group-hover:text-white transition-colors duration-300">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] uppercase tracking-wider font-bold text-[#D02126] bg-[#D02126]/10 px-3 py-1 rounded-full border border-[#D02126]/20">
                      {service.tag}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-serif text-[#0F1115] font-semibold mb-3 leading-snug group-hover:text-[#D02126] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 font-light leading-relaxed mb-6">
                    {service.description}
                  </p>

                  {/* Deliverables Checklist */}
                  <div className="space-y-2.5 pt-4 border-t border-gray-200/80 mb-6">
                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                      Entregables & Garantías:
                    </span>
                    {service.deliverables.map((deliv, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-gray-700">
                        <CheckCircle2 className="w-4 h-4 text-[#D02126] shrink-0 mt-0.5" />
                        <span>{deliv}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Action Button */}
                <button
                  onClick={() => onSelectService(service.title)}
                  className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold text-[#0F1115] bg-white hover:bg-[#D02126] hover:text-white border border-gray-200 hover:border-[#D02126] transition-all duration-300 flex items-center justify-center gap-2 group/btn shadow-xs"
                >
                  <span>{service.ctaText}</span>
                  <ArrowRight className="w-4 h-4 text-[#D02126] group-hover/btn:text-white group-hover/btn:translate-x-1 transition-all" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Corporate Trust Strip */}
        <div className="bg-[#0F1115] text-white rounded-3xl p-8 sm:p-10 border border-[#D02126]/30 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#D02126]/20 border border-[#D02126]/40 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-8 h-8 text-[#D02126]" />
            </div>
            <div>
              <h4 className="text-lg font-serif font-bold text-white mb-1">
                Garantía Institucional de Rigor Jurídico
              </h4>
              <p className="text-xs sm:text-sm text-gray-300 font-light max-w-xl">
                Cada operación firmada bajo el sello MELSA cuenta con respaldo de pólizas notariales, archivo de trazabilidad de títulos y asesoría presencial en notaría y bancos.
              </p>
            </div>
          </div>

          <a
            href="#contacto"
            className="shrink-0 px-6 py-3.5 rounded-full text-xs sm:text-sm font-semibold text-white bg-[#D02126] hover:bg-[#B81B1F] transition-all shadow-md text-center"
          >
            Hablar con Asesor Senior
          </a>
        </div>

      </div>
    </section>
  );
};

