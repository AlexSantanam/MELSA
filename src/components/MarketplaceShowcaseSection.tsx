import React, { useState } from 'react';
import { ThirdPartyListing } from '../types';
import { THIRD_PARTY_LISTINGS } from '../data/mockData';
import { 
  Building2, 
  MapPin, 
  Bed, 
  Bath, 
  Maximize2, 
  Car, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  Phone, 
  MessageCircle, 
  Filter, 
  TrendingUp, 
  UserCheck, 
  ArrowRight,
  ShieldCheck,
  Search
} from 'lucide-react';

interface MarketplaceShowcaseSectionProps {
  onGoToPublish?: () => void;
}

export const MarketplaceShowcaseSection: React.FC<MarketplaceShowcaseSectionProps> = ({ onGoToPublish }) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'brokers' | 'owners' | 'sale' | 'rent'>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredListings = THIRD_PARTY_LISTINGS.filter((item) => {
    // Tab filter
    if (activeFilter === 'brokers' && item.publisherType !== 'Corredor Independiente') return false;
    if (activeFilter === 'owners' && item.publisherType !== 'Dueño Directo') return false;
    if (activeFilter === 'sale' && item.operation !== 'Venta') return false;
    if (activeFilter === 'rent' && item.operation !== 'Arriendo') return false;

    // City filter
    if (selectedCity !== 'all' && item.city !== selectedCity) return false;

    // Search term
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchLoc = item.location.toLowerCase().includes(q);
      const matchPub = item.publisherName.toLowerCase().includes(q);
      if (!matchTitle && !matchLoc && !matchPub) return false;
    }

    return true;
  });

  return (
    <section id="mercado" className="py-24 bg-[#F8F9FA] relative border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D02126]/10 text-[#D02126] text-xs font-semibold uppercase tracking-wider mb-3 border border-[#D02126]/20">
              <Building2 className="w-3.5 h-3.5 text-[#D02126]" />
              <span>Vitrina Multilateral · Melsa Open Market</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif text-[#0F1115] font-normal tracking-tight">
              Propiedades Publicadas por Corredores & Particulares
            </h2>
            <p className="text-gray-600 text-xs sm:text-sm font-light mt-2 max-w-2xl">
              Explora oportunidades directas de terceros verificadas con tecnología IA. Contacta directamente al corredor o propietario sin comisiones intermedias añadidas por el portal.
            </p>
          </div>

          {/* Call to publish button in header */}
          <div className="mt-4 md:mt-0">
            <button
              type="button"
              onClick={onGoToPublish}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#D02126] hover:bg-[#B81B1F] text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
            >
              <span>+ Publicar mi Propiedad ($10.000 CLP)</span>
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm mb-10 flex flex-col lg:flex-row items-center justify-between gap-4">
          
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 w-full lg:w-auto">
            {[
              { id: 'all', label: 'Todos los Inmuebles' },
              { id: 'brokers', label: 'Corredores Verificados' },
              { id: 'owners', label: 'Dueño Directo (Sin Comisión)' },
              { id: 'sale', label: 'En Venta' },
              { id: 'rent', label: 'En Arriendo' }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeFilter === tab.id
                    ? 'bg-[#0F1115] text-white shadow-sm'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search & City Selectors */}
          <div className="flex items-center gap-3 w-full lg:w-auto">
            
            {/* Search Input */}
            <div className="relative flex-1 sm:w-60">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por sector o título..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-8 pr-3 py-2 text-xs text-[#0F1115] focus:ring-1 focus:ring-[#D02126] outline-none"
              />
            </div>

            {/* City Selector */}
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-700 font-semibold focus:ring-1 focus:ring-[#D02126] outline-none cursor-pointer"
            >
              <option value="all">Todo Chile (Nacional)</option>
              <option value="Santiago">Región Metropolitana (Santiago)</option>
              <option value="Valparaíso">Región de Valparaíso (Viña / Concón)</option>
              <option value="Biobío">Región del Biobío (Concepción / San Pedro)</option>
              <option value="Coquimbo">Región de Coquimbo (La Serena)</option>
              <option value="Antofagasta">Región de Antofagasta</option>
              <option value="La Araucanía">Región de La Araucanía (Temuco)</option>
              <option value="Puerto Varas">Región de Los Lagos (Puerto Varas / Sur)</option>
            </select>

          </div>

        </div>

        {/* Listings Grid */}
        {filteredListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredListings.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl overflow-hidden border border-gray-200 hover:border-[#D02126]/40 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Image Container with Badges */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />

                    {/* Top Left: Operation & Code */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                      <span className="bg-[#0F1115] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                        {item.operation} • {item.code}
                      </span>
                      {item.isAiVerified && (
                        <span className="bg-emerald-600/95 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1 backdrop-blur-xs">
                          <CheckCircle2 className="w-3 h-3" /> Verificado IA Melsa
                        </span>
                      )}
                    </div>

                    {/* Top Right: Expiration Countdown */}
                    <div className="absolute top-3 right-3 bg-black/75 backdrop-blur-md text-white text-[10px] font-medium px-2.5 py-1 rounded-full flex items-center gap-1 border border-white/20">
                      <Clock className="w-3 h-3 text-amber-400" />
                      <span>{item.daysRemaining} días activos</span>
                    </div>

                    {/* Bottom Floating: Publisher Badge */}
                    <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md text-gray-800 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md border border-gray-200 flex items-center gap-1">
                      <UserCheck className="w-3 h-3 text-[#D02126]" />
                      <span>{item.publisherType}</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6">
                    <h3 className="text-base font-serif font-bold text-[#0F1115] mb-1.5 group-hover:text-[#D02126] transition-colors line-clamp-1">
                      {item.title}
                    </h3>

                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-4">
                      <MapPin className="w-3.5 h-3.5 text-[#D02126] shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </div>

                    {/* Specs Pills */}
                    <div className="grid grid-cols-4 gap-2 bg-[#FAF9F8] p-3 rounded-2xl border border-gray-200/80 text-[11px] text-gray-600 text-center mb-4">
                      <div>
                        <span className="text-gray-400 block text-[9px] uppercase font-semibold">Dorms</span>
                        <span className="font-bold text-gray-800">{item.bedrooms || '-'}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[9px] uppercase font-semibold">Baños</span>
                        <span className="font-bold text-gray-800">{item.bathrooms || '-'}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[9px] uppercase font-semibold">Sup.</span>
                        <span className="font-bold text-gray-800">{item.areaM2} m²</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[9px] uppercase font-semibold">Estac.</span>
                        <span className="font-bold text-gray-800">{item.parking || '-'}</span>
                      </div>
                    </div>

                    {/* Pricing Block */}
                    <div className="flex justify-between items-baseline mb-4">
                      <div>
                        <span className="text-xl font-bold font-serif text-[#0F1115]">
                          {item.priceUF > 100 ? `${item.priceUF.toLocaleString('es-CL')} UF` : `$${item.priceCLP.toLocaleString('es-CL')} CLP`}
                        </span>
                        <span className="text-[11px] text-gray-500 block">
                          ~${item.priceCLP.toLocaleString('es-CL')} CLP
                        </span>
                      </div>

                      {item.capRateProyectado && (
                        <div className="text-right">
                          <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-bold inline-flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" /> Cap Rate ~{item.capRateProyectado}%
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Publisher Identifier */}
                    <div className="text-[11px] text-gray-500 border-t border-gray-100 pt-3 flex items-center justify-between">
                      <span className="truncate">Publicado por: <strong>{item.publisherName}</strong></span>
                    </div>

                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="p-6 pt-0">
                  <a
                    href={`https://wa.me/${item.publisherPhone.replace('+', '')}?text=${encodeURIComponent(
                      `Hola, te contacto por tu propiedad "${item.title}" (${item.code}) publicada en Melsa Open Market. ¿Sigue disponible para coordinar una visita?`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Contactar Corredor por WhatsApp</span>
                  </a>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 max-w-md mx-auto">
            <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h4 className="text-base font-bold text-gray-800">No encontramos propiedades con estos filtros</h4>
            <p className="text-xs text-gray-500 mt-1 mb-4">Prueba cambiando la región o la categoría seleccionada.</p>
            <button
              type="button"
              onClick={() => {
                setActiveFilter('all');
                setSelectedCity('all');
                setSearchTerm('');
              }}
              className="text-xs text-[#D02126] font-semibold hover:underline cursor-pointer"
            >
              Restablecer filtros
            </button>
          </div>
        )}

        {/* Promotion Banner for Brokers */}
        <div className="mt-16 bg-gradient-to-r from-[#0F1115] via-[#1A1D24] to-[#0F1115] text-white rounded-3xl p-8 sm:p-10 border border-[#D02126]/30 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-semibold text-[#D02126] uppercase tracking-wider block">
              Para Corredores Inmobiliarios & Dueños Directos
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-normal">
              ¿Quieres que tu propiedad aparezca en esta vitrina?
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 font-light max-w-xl">
              Publica hoy por una tarifa plana de solo $10.000 CLP por 45 días. Reescritura SEO con IA de Groq incluida y contacto 100% directo a tu teléfono.
            </p>
          </div>

          <button
            type="button"
            onClick={onGoToPublish}
            className="px-8 py-4 rounded-2xl bg-[#D02126] hover:bg-[#B81B1F] text-white font-semibold text-sm transition-all shadow-xl shadow-[#D02126]/30 flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <span>Publicar mi Inmueble Ahora</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};

