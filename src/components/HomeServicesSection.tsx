import React, { useState } from 'react';
import { HomeServiceProvider } from '../types';
import { HOME_SERVICE_PROVIDERS } from '../data/mockData';
import { 
  Wrench, 
  Zap, 
  Paintbrush, 
  Wind, 
  Flower2, 
  KeyRound, 
  ShieldCheck, 
  Star, 
  CheckCircle2, 
  Phone, 
  MessageCircle, 
  Search, 
  MapPin, 
  Briefcase, 
  AlertCircle, 
  ArrowRight, 
  X,
  FileCheck2,
  Clock,
  Sparkles
} from 'lucide-react';

interface HomeServicesSectionProps {
  onOpenApplicationModal?: () => void;
  onOpenIntranetModal?: () => void;
}

export const HomeServicesSection: React.FC<HomeServicesSectionProps> = ({
  onOpenApplicationModal,
  onOpenIntranetModal
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedZone, setSelectedZone] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Registration Modal for Technicians
  const [isJoinModalOpen, setIsJoinModalOpen] = useState<boolean>(false);
  const [joinPlan, setJoinPlan] = useState<'independiente' | 'empresa'>('independiente');

  const categories = [
    { id: 'all', label: 'Todas las Especialidades', icon: Briefcase },
    { id: 'Gasfitería', label: 'Gasfitería & Calefón', icon: Wrench },
    { id: 'Electricidad', label: 'Electricidad SEC', icon: Zap },
    { id: 'Remodelación & Pintura', label: 'Remodelación & Pintura', icon: Paintbrush },
    { id: 'Climatización', label: 'Climatización & Aire', icon: Wind },
    { id: 'Jardinería', label: 'Jardinería & Riego', icon: Flower2 },
    { id: 'Cerrajería', label: 'Cerrajería 24/7', icon: KeyRound },
  ];

  const filteredProviders = HOME_SERVICE_PROVIDERS.filter((provider) => {
    if (selectedCategory !== 'all' && provider.category !== selectedCategory) return false;
    
    if (selectedZone !== 'all') {
      const matchesZone = provider.coverageZones.some((z) => 
        z.toLowerCase().includes(selectedZone.toLowerCase())
      );
      if (!matchesZone) return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = provider.name.toLowerCase().includes(q);
      const matchCompany = provider.companyOrTradeName.toLowerCase().includes(q);
      const matchDesc = provider.description.toLowerCase().includes(q);
      if (!matchName && !matchCompany && !matchDesc) return false;
    }

    return true;
  });

  const officialWhatsApp = "56999899421";

  return (
    <section id="servicios-hogar" className="py-24 bg-white relative border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D02126]/10 text-[#D02126] text-xs font-semibold uppercase tracking-wider mb-3 border border-[#D02126]/20">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D02126]" />
              <span>Melsa Home Trust · Red de Confianza para el Hogar</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif text-[#0F1115] font-normal tracking-tight">
              Técnicos & Empresas de Remodelación con Filtro de Confianza
            </h2>
            <p className="text-gray-600 text-xs sm:text-sm font-light mt-2 max-w-2xl">
              Filtramos antecedentes penales, vigencia tributaria en el SII y certificaciones oficiales (SEC). Contacta directo al profesional sin sobreprecios ni comisiones del portal.
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex flex-wrap items-center gap-2.5">
            <button
              onClick={onOpenIntranetModal}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-300 hover:border-[#D02126] text-gray-800 text-xs font-semibold transition-all cursor-pointer bg-white"
            >
              <span>Acceso Prestadores / Intranet</span>
            </button>

            <button
              onClick={onOpenApplicationModal || (() => setIsJoinModalOpen(true))}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D02126] hover:bg-[#B81B1F] text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
            >
              <span>+ Postular con Documentos</span>
            </button>
          </div>
        </div>

        {/* Legal Disclaimer & Reputational Churn Banner */}
        <div className="bg-[#FAF9F8] border border-gray-200/90 rounded-2xl p-4 sm:p-5 mb-10 flex items-start gap-3.5 text-xs text-gray-600 leading-relaxed">
          <AlertCircle className="w-5 h-5 text-[#D02126] shrink-0 mt-0.5" />
          <div>
            <strong className="text-[#0F1115] font-semibold">Marco de Confianza & Regla de Permanencia Melsa:</strong>{' '}
            Melsa actúa exclusivamente como vitrina de difusión y filtro reputacional de antecedentes públicos (SII, Registro Civil, SEC). El acuerdo y pago del servicio es directo entre cliente y técnico. 
            <span className="text-[#D02126] font-medium ml-1">
              Todo profesional que acumule reclamos reiterados o baje de 4.0 estrellas es dado de baja inmediatamente del portal.
            </span>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 no-scrollbar">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-[#D02126] text-white border-[#D02126] shadow-sm'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-[#D02126]'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search & Commune Bar */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm mb-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre, empresa o servicio (ej. calefón, diferencial, cocina)..."
              className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#0F1115] focus:ring-1 focus:ring-[#D02126] outline-none"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <MapPin className="w-4 h-4 text-gray-400 shrink-0 hidden sm:block" />
            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="w-full sm:w-auto bg-[#FAF9F8] border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-700 font-semibold focus:ring-1 focus:ring-[#D02126] outline-none cursor-pointer"
            >
              <option value="all">Todo Chile (Nacional)</option>
              <option value="Metropolitana">Región Metropolitana (Santiago)</option>
              <option value="Las Condes">RM: Las Condes / Vitacura / Lo Barnechea</option>
              <option value="Providencia">RM: Providencia / Ñuñoa / Santiago Centro</option>
              <option value="Chicureo">RM: Chicureo / Colina / La Dehesa</option>
              <option value="Valparaíso">Región de Valparaíso (Viña, Concón, Quilpué)</option>
              <option value="Biobío">Región del Biobío (Concepción, San Pedro, Talcahuano)</option>
              <option value="Coquimbo">Región de Coquimbo (La Serena, Coquimbo)</option>
              <option value="Antofagasta">Región de Antofagasta (Antofagasta, Calama)</option>
              <option value="Los Lagos">Región de Los Lagos (Puerto Montt, Puerto Varas)</option>
              <option value="Araucanía">Región de La Araucanía (Temuco, Pucón)</option>
              <option value="O'Higgins">Región de O'Higgins (Rancagua, Machalí)</option>
              <option value="Maule">Región del Maule (Talca, Curicó)</option>
              <option value="Los Ríos">Región de Los Ríos (Valdivia)</option>
              <option value="Tarapacá">Zona Norte: Arica, Iquique, Copiapó</option>
              <option value="Magallanes">Zona Austral: Punta Arenas, Coyhaique</option>
            </select>
          </div>
        </div>

        {/* Providers Grid */}
        {filteredProviders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProviders.map((item) => (
              <div
                key={item.id}
                className="bg-[#FAF9F8] rounded-3xl p-6 border border-gray-200/90 hover:border-[#D02126]/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  
                  {/* Top: Avatar & Reputation Info */}
                  <div className="flex items-start gap-4 mb-4">
                    <img
                      src={item.avatarUrl}
                      alt={item.name}
                      className="w-14 h-14 rounded-2xl object-cover border border-gray-200 shadow-sm shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 text-amber-500 font-bold text-xs mb-0.5">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{item.rating}</span>
                        <span className="text-gray-400 font-normal">({item.reviewCount} reseñas)</span>
                      </div>
                      <h3 className="text-base font-serif font-bold text-[#0F1115] truncate group-hover:text-[#D02126] transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-[11px] text-gray-500 truncate font-medium">
                        {item.companyOrTradeName}
                      </p>
                    </div>
                  </div>

                  {/* Verification Badges */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {item.badges.map((badge, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                        {badge}
                      </span>
                    ))}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-gray-600 font-light leading-relaxed mb-4 line-clamp-3">
                    {item.description}
                  </p>

                  {/* Coverage zones pills */}
                  <div className="border-t border-gray-200/70 pt-3 mb-4">
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold block mb-1.5">
                      Zonas de Cobertura:
                    </span>
                    <div className="flex flex-wrap gap-1 text-[11px] text-gray-600">
                      {item.coverageZones.map((zone, zidx) => (
                        <span key={zidx} className="bg-white px-2 py-0.5 rounded-md border border-gray-200">
                          {zone}
                        </span>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Card Action */}
                <div className="pt-2">
                  <a
                    href={`https://wa.me/${item.phone.replace('+', '')}?text=${encodeURIComponent(
                      `Hola ${item.name}, te contacto desde la Red de Confianza Hogar de Melsa. Quisiera consultar disponibilidad y presupuesto para un trabajo de ${item.category}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Contactar por WhatsApp (Sin Comisión)</span>
                  </a>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[#FAF9F8] rounded-3xl p-12 text-center border border-gray-200 max-w-md mx-auto">
            <Wrench className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h4 className="text-base font-bold text-gray-800">No encontramos técnicos en esta categoría o zona</h4>
            <p className="text-xs text-gray-500 mt-1 mb-4">Prueba restableciendo los filtros de búsqueda.</p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('all');
                setSelectedZone('all');
                setSearchQuery('');
              }}
              className="text-xs text-[#D02126] font-semibold hover:underline cursor-pointer"
            >
              Ver todos los profesionales
            </button>
          </div>
        )}

      </div>

      {/* ======================================================== */}
      {/* JOIN NETWORK MODAL (TÉCNICOS & EMPRESAS)                  */}
      {/* ======================================================== */}
      {isJoinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-gray-200 relative max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setIsJoinModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-800 p-1 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D02126]/10 text-[#D02126] text-xs font-semibold uppercase tracking-wider mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Membresías Profesionales</span>
              </div>
              <h3 className="text-2xl font-serif font-bold text-[#0F1115]">
                Únete a la Red de Confianza Hogar Melsa
              </h3>
              <p className="text-xs text-gray-600 mt-1">
                Conéctate con miles de propietarios e inversionistas de la red Melsa. Sin comisiones por trabajo: los clientes te pagan a ti directamente.
              </p>
            </div>

            {/* Plan Selector */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                type="button"
                onClick={() => setJoinPlan('independiente')}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  joinPlan === 'independiente'
                    ? 'border-[#D02126] bg-red-50/40 ring-1 ring-[#D02126]'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <span className="text-xs font-bold text-gray-800 block">Técnico Independiente</span>
                <span className="text-lg font-bold font-serif text-[#D02126] block my-1">
                  $19.900 <span className="text-xs font-sans font-normal text-gray-500">CLP/mes</span>
                </span>
                <span className="text-[11px] text-gray-500">Gasfiters, Electricistas SEC, Cerrajeros</span>
              </button>

              <button
                type="button"
                onClick={() => setJoinPlan('empresa')}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  joinPlan === 'empresa'
                    ? 'border-[#D02126] bg-red-50/40 ring-1 ring-[#D02126]'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <span className="text-xs font-bold text-gray-800 block">Empresa Contratista</span>
                <span className="text-lg font-bold font-serif text-[#0F1115] block my-1">
                  1.5 UF <span className="text-xs font-sans font-normal text-gray-500">/mes</span>
                </span>
                <span className="text-[11px] text-gray-500">Remodelaciones, Climatización, Riego</span>
              </button>
            </div>

            {/* Requirements Checklist */}
            <div className="bg-[#FAF9F8] p-4 rounded-2xl border border-gray-200 text-xs space-y-2 mb-6">
              <span className="font-semibold text-gray-800 block">Requisitos de Ingreso Obligatorios:</span>
              <ul className="space-y-1.5 text-gray-600 text-[11px]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Certificado de Antecedentes para Fines Especiales (vigencia &lt; 60 días)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Iniciación de actividades / Carpeta Tributaria SII
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Certificación técnica aplicable (ej. Carnet SEC para gas e iluminación)
                </li>
              </ul>
            </div>

            <a
              href={`https://wa.me/${officialWhatsApp}?text=${encodeURIComponent(
                `Hola equipo Melsa, me interesa postular como prestador en la Red de Confianza Hogar (${joinPlan === 'independiente' ? 'Plan Independiente $19.900 CLP/mes' : 'Plan Empresa 1.5 UF/mes'}). Quisiera enviar mis documentos tributarios y antecedentes para validación.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 rounded-xl bg-[#D02126] hover:bg-[#B81B1F] text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#D02126]/30 cursor-pointer"
            >
              <span>Enviar Documentación para Validación a Melsa</span>
              <ArrowRight className="w-4 h-4" />
            </a>

          </div>
        </div>
      )}

    </section>
  );
};
