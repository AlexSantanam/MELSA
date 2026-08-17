import React, { useState } from 'react';
import { ArrowRight, Search, Building, MapPin, MessageSquare } from 'lucide-react';

interface HeroProps {
  onOpenAdvisoryModal: () => void;
  onSearchProjects: (filters: { type: string; city: string; status: string }) => void;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenAdvisoryModal,
  onSearchProjects
}) => {
  const [selectedType, setSelectedType] = useState('Todos');
  const [selectedCity, setSelectedCity] = useState('Todas');
  const [selectedStatus, setSelectedStatus] = useState('Todos');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchProjects({
      type: selectedType,
      city: selectedCity,
      status: selectedStatus
    });
    const section = document.getElementById('proyectos');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="inicio" className="relative pt-28 pb-16 md:pt-36 md:pb-24 lg:pt-40 lg:pb-32 overflow-hidden bg-[#0F2042]">
      {/* Background Image with Dark & Gradient Overlays */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=2000"
          alt="Edificio moderno Melsa Gestión Inmobiliaria"
          className="w-full h-full object-cover object-center scale-105 filter brightness-90 transform transition-transform duration-10000 hover:scale-100"
          referrerPolicy="no-referrer"
        />
        {/* Dark Overlay for High Legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F2042]/95 via-[#0F2042]/85 to-[#0F2042]/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F2042] via-transparent to-[#0F2042]/40" />
      </div>

      {/* Decorative Architectural Line Art Background */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <line x1="0" y1="100" x2="100" y2="0" stroke="#C5A059" strokeWidth="0.2" />
          <line x1="20" y1="100" x2="100" y2="20" stroke="#C5A059" strokeWidth="0.2" />
          <circle cx="50" cy="50" r="30" stroke="#C5A059" strokeWidth="0.1" fill="none" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/40 text-[#DFC287] text-xs font-semibold uppercase tracking-wider mb-6 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#C5A059] animate-pulse" />
            Melsa • Gestión Inmobiliaria Premium
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-normal text-white leading-[1.15] mb-6 tracking-tight">
            Tu próximo hogar e inversión <span className="melsa-text-gold-gradient font-semibold italic">comienza aquí</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-gray-200 font-light leading-relaxed mb-8 max-w-2xl">
            En <strong className="text-white font-medium">Melsa, Gestión Inmobiliaria</strong> te acompañamos con asesoría experta para descubrir proyectos y propiedades que se ajustan a tu estilo de vida y objetivos de inversión.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-12">
            <a
              href="#proyectos"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-base font-semibold text-[#0F2042] bg-[#C5A059] hover:bg-[#DFC287] transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 group"
            >
              <span>Ver proyectos</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>

            <button
              onClick={onOpenAdvisoryModal}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-base font-medium text-white bg-white/10 hover:bg-white/20 border border-white/30 backdrop-blur-md transition-all duration-300 hover:border-[#C5A059]"
            >
              <MessageSquare className="w-4 h-4 text-[#C5A059]" />
              <span>Hablar con un asesor</span>
            </button>
          </div>
        </div>

        {/* Quick Search & Filter Card */}
        <div className="mt-6 bg-white/95 backdrop-blur-xl rounded-2xl p-4 sm:p-6 shadow-2xl border border-white/40 max-w-4xl">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-[#C5A059]" />
                Tipo de Propiedad
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-[#0F2042] font-medium focus:ring-2 focus:ring-[#C5A059] focus:outline-none"
              >
                <option value="Todos">Todos los tipos</option>
                <option value="Apartamento">Apartamentos</option>
                <option value="Penthouse">Penthouses</option>
                <option value="Villa">Villas & Casas</option>
                <option value="Oficinas">Oficinas / Renta</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
                Ubicación
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-[#0F2042] font-medium focus:ring-2 focus:ring-[#C5A059] focus:outline-none"
              >
                <option value="Todas">Todas las ciudades</option>
                <option value="Santiago">Santiago (Las Condes / Providencia)</option>
                <option value="Valparaíso">Costa Central (Zapallar / Reñaca)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-[#C5A059]" />
                Estado Proyecto
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-[#0F2042] font-medium focus:ring-2 focus:ring-[#C5A059] focus:outline-none"
              >
                <option value="Todos">Todos los estados</option>
                <option value="Preventa / Pozo">Preventa / Pozo</option>
                <option value="Entrega Inmediata">Entrega Inmediata</option>
                <option value="Inversión">Oportunidades Inversión</option>
              </select>
            </div>

            <div>
              <button
                type="submit"
                className="w-full bg-[#0F2042] hover:bg-[#1A3462] text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition-all duration-200 flex items-center justify-center gap-2 border border-[#C5A059]/40 shadow-sm"
              >
                <Search className="w-4 h-4 text-[#C5A059]" />
                <span>Buscar Proyectos</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
