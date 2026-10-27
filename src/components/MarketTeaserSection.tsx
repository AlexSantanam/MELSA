import React from 'react';
import { Building2, Wrench, ArrowRight, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

interface MarketTeaserSectionProps {
  onOpenMarket: (tab?: 'properties' | 'services' | 'publish') => void;
}

export const MarketTeaserSection: React.FC<MarketTeaserSectionProps> = ({ onOpenMarket }) => {
  return (
    <section id="mercado" className="py-20 bg-[#FAF9F8] border-t border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D02126]/10 text-[#D02126] text-xs font-semibold uppercase tracking-wider mb-3 border border-[#D02126]/20">
            <Building2 className="w-3.5 h-3.5 text-[#D02126]" />
            <span>Ecosistema Abierto Melsa</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#0F1115] font-normal tracking-tight mb-4">
            Melsa Open Market & Red de Servicios Hogar
          </h2>
          <p className="text-gray-600 text-sm sm:text-base font-light leading-relaxed">
            Una vitrina independiente y curada que conecta a propietarios, corredores externos y técnicos para el hogar bajo el estándar de confianza Melsa.
          </p>
        </div>

        {/* 2 Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          
          {/* Card 1: Open Market Corredores */}
          <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#D02126]/10 text-[#D02126] flex items-center justify-center">
                  <Building2 className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-red-50 text-[#D02126] border border-red-100">
                  Tarifa Plana $10.000 CLP
                </span>
              </div>

              <h3 className="text-xl font-serif font-bold text-[#0F1115] mb-2 group-hover:text-[#D02126] transition-colors">
                Vitrina Inmobiliaria de Terceros
              </h3>
              <p className="text-xs text-gray-600 font-light leading-relaxed mb-6">
                Explora cientos de casas y departamentos publicados por corredores independientes y propietarios directos. Si deseas publicar tu propiedad, hazlo con pago único y reescritura SEO con IA de Groq.
              </p>

              <ul className="space-y-2 text-xs text-gray-700 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Sin cobros en UF ni contratos forzosos</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Contacto 100% directo al corredor vía WhatsApp</span>
                </li>
              </ul>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => onOpenMarket('properties')}
                className="flex-1 py-3 px-4 rounded-xl bg-[#0F1115] hover:bg-[#D02126] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Explorar Vitrina</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onOpenMarket('publish')}
                className="py-3 px-4 rounded-xl border border-gray-300 hover:border-[#D02126] text-gray-800 text-xs font-semibold transition-all cursor-pointer"
              >
                Publicar ($10k)
              </button>
            </div>
          </div>

          {/* Card 2: Home Services Confianza */}
          <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Wrench className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Filtro de Confianza
                </span>
              </div>

              <h3 className="text-xl font-serif font-bold text-[#0F1115] mb-2 group-hover:text-emerald-700 transition-colors">
                Red de Confianza para el Hogar
              </h3>
              <p className="text-xs text-gray-600 font-light leading-relaxed mb-6">
                Directorio verificado de gasfitería, electricidad con instaladores SEC, remodelaciones y mantención. Filtro de antecedentes tributarios y baja inmediata ante malas calificaciones.
              </p>

              <ul className="space-y-2 text-xs text-gray-700 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Antecedentes penales y tributarios (SII) auditados</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Cero comisiones: trato directo entre cliente y técnico</span>
                </li>
              </ul>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => onOpenMarket('services')}
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Ver Técnicos Verificados</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
