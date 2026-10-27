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
    <section id="inicio" className="relative pt-28 pb-16 md:pt-36 md:pb-24 lg:pt-40 lg:pb-32 overflow-hidden bg-[#0F1115]">
      {/* Plano trasero: Foto limpia en alta resolución (sin logos sobrepuestos) */}
      <div className="absolute inset-0 z-0">
        <img
          src="/asset/hero-service.jpg"
          alt="Melsa Gestión Inmobiliaria - Asesoría y Entrega de Propiedades"
          className="w-full h-full object-cover object-center filter brightness-95"
          referrerPolicy="no-referrer"
        />

        {/* 
          Capa sobrepuesta con gradiente:
          - Izquierda: 30% de transparencia (70% densidad oscura) para máxima legibilidad de los textos
          - Derecha: 90% de transparencia (10% densidad) para visualizar nítidamente a la pareja y la casa
        */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to right, rgba(15, 17, 21, 0.72) 0%, rgba(15, 17, 21, 0.45) 52%, rgba(15, 17, 21, 0.10) 100%)'
          }}
        />

        {/* Suave degradado vertical inferior para transición fluida */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F1115] via-transparent to-[#0F1115]/30 pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Contenido Principal Limpio: Sin tarjetas duplicadas */}
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D02126]/15 border border-[#D02126]/40 text-red-200 text-xs font-semibold uppercase tracking-wider mb-6 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#D02126] animate-pulse" />
            Melsa • Gestión Inmobiliaria
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-normal text-white leading-[1.15] mb-6 tracking-tight drop-shadow-sm">
            Tu próximo hogar e inversión <span className="melsa-text-red-gradient font-semibold italic">comienza aquí</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-gray-200 font-light leading-relaxed mb-8 drop-shadow-xs">
            En <strong className="text-white font-medium">Melsa, Gestión Inmobiliaria</strong> te acompañamos con asesoría experta para descubrir proyectos y propiedades que se ajustan a tu estilo de vida y objetivos de inversión.
          </p>

          {/* Botones de Acción */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-10">
            <a
              href="#proyectos"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-base font-semibold text-white bg-[#D02126] hover:bg-[#B81B1F] transition-all duration-300 shadow-lg shadow-red-950/40 hover:shadow-xl hover:-translate-y-0.5 group"
            >
              <span>Ver proyectos</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>

            <button
              onClick={onOpenAdvisoryModal}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-base font-medium text-white bg-white/10 hover:bg-white/20 border border-white/30 backdrop-blur-md transition-all duration-300 hover:border-[#D02126]"
            >
              <MessageSquare className="w-4 h-4 text-[#D02126]" />
              <span>Hablar con un asesor</span>
            </button>
          </div>
        </div>

        {/* Buscador Rápido de Proyectos */}
        <div className="mt-4 bg-white/95 backdrop-blur-xl rounded-2xl p-4 sm:p-6 shadow-2xl border border-gray-100 max-w-4xl">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-[#D02126]" />
                Tipo de Propiedad
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-[#0F1115] font-medium focus:ring-2 focus:ring-[#D02126] focus:outline-none"
              >
                <option value="Todos">Todos los tipos</option>
                <option value="Apartamento">Apartamentos</option>
                <option value="Penthouse">Penthouses</option>
                <option value="Villa">Villas & Casas</option>
                <option value="Oficinas">Oficinas / Renta</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#D02126]" />
                Ubicación
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-[#0F1115] font-medium focus:ring-2 focus:ring-[#D02126] focus:outline-none"
              >
                <option value="Todas">Todas las ciudades</option>
                <option value="Santiago">Santiago (Las Condes / Providencia)</option>
                <option value="Valparaíso">Costa Central (Zapallar / Reñaca)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-[#D02126]" />
                Estado Proyecto
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-[#0F1115] font-medium focus:ring-2 focus:ring-[#D02126] focus:outline-none"
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
                className="w-full bg-[#0F1115] hover:bg-[#D02126] text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-sm"
              >
                <Search className="w-4 h-4 text-[#D02126] group-hover:text-white" />
                <span>Buscar Proyectos</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
