import React, { useState } from 'react';
import { RealEstateProject } from '../types';
import { FEATURED_PROJECTS } from '../data/mockData';
import { MapPin, Building2, Calendar, Eye, Sparkles } from 'lucide-react';

interface ProjectsSectionProps {
  onSelectProject: (project: RealEstateProject) => void;
  activeFilter?: { type: string; city: string; status: string };
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  onSelectProject,
  activeFilter
}) => {
  const [selectedTab, setSelectedTab] = useState<string>('Todos');

  const filterTabs = [
    'Todos',
    'Preventa / Pozo',
    'Entrega Inmediata',
    'Inversión'
  ];

  const filteredProjects = FEATURED_PROJECTS.filter((proj) => {
    // Tab filter
    if (selectedTab !== 'Todos' && proj.status !== selectedTab) {
      return false;
    }

    // Hero Search filter if applied
    if (activeFilter) {
      if (activeFilter.type !== 'Todos' && proj.type !== activeFilter.type) {
        return false;
      }
      if (activeFilter.city !== 'Todas' && proj.city !== activeFilter.city) {
        return false;
      }
      if (activeFilter.status !== 'Todos' && proj.status !== activeFilter.status) {
        return false;
      }
    }

    return true;
  });

  return (
    <section id="proyectos" className="py-20 bg-[#FAF8F5] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A059]/10 text-[#A27E3A] text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Portafolio Exclusivo</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#0F2042] font-normal tracking-tight mb-4">
            Proyectos Destacados
          </h2>
          <p className="text-gray-600 text-base sm:text-lg font-light leading-relaxed">
            Descubre nuestros lanzamientos inmobiliarios de alto valor en las mejores ubicaciones. Proyectos seleccionados con estándares de arquitectura, diseño y plusvalía.
          </p>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {filterTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ${
                  selectedTab === tab
                    ? 'bg-[#0F2042] text-white shadow-md border border-[#C5A059]/50'
                    : 'bg-white text-gray-600 hover:text-[#0F2042] hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* 3-Column Desktop Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group bg-white rounded-2xl overflow-hidden border border-gray-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Image & Status Tag */}
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                  <img
                    src={project.mainImage}
                    alt={project.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                  {/* Status Badge */}
                  <div className="absolute top-4 left-4 bg-[#0F2042]/90 backdrop-blur-md text-[#DFC287] text-xs font-semibold px-3 py-1 rounded-full border border-[#C5A059]/30">
                    {project.status}
                  </div>

                  {/* Property Type Badge */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-[#0F2042] text-xs font-semibold px-2.5 py-1 rounded-full">
                    {project.type}
                  </div>

                  {/* Location Overlay at Image Bottom */}
                  <div className="absolute bottom-3 left-4 right-4 text-white flex items-center gap-1.5 text-xs font-medium">
                    <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>{project.location}</span>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-6">
                  <h3 className="text-xl font-serif text-[#0F2042] font-medium group-hover:text-[#C5A059] transition-colors mb-1">
                    {project.name}
                  </h3>
                  <p className="text-xs text-gray-500 font-medium mb-4 line-clamp-1">
                    {project.subtitle}
                  </p>

                  {/* Property Specs Pills */}
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 bg-[#FAF8F5] p-3 rounded-xl mb-5">
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>{project.bedrooms}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>Entrega: {project.deliveryDate}</span>
                    </div>
                  </div>

                  {/* Price From */}
                  <div className="border-t border-gray-100 pt-4 flex items-baseline justify-between">
                    <div>
                      <span className="text-xs text-gray-400 font-medium block">
                        Precio desde
                      </span>
                      <span className="text-lg font-bold text-[#0F2042]">
                        ${project.priceFromUSD.toLocaleString('en-US')} USD
                      </span>
                    </div>
                    {project.priceFromUF && (
                      <span className="text-xs font-semibold text-[#A27E3A] bg-[#C5A059]/10 px-2 py-0.5 rounded">
                        {project.priceFromUF.toLocaleString()} UF
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Footer Button */}
              <div className="px-6 pb-6 pt-0">
                <button
                  onClick={() => onSelectProject(project)}
                  className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-[#0F2042] bg-[#FAF8F5] hover:bg-[#0F2042] hover:text-white border border-gray-200 hover:border-[#0F2042] transition-all duration-300 flex items-center justify-center gap-2 group/btn"
                >
                  <Eye className="w-4 h-4 text-[#C5A059] group-hover/btn:text-[#DFC287]" />
                  <span>Ver proyecto</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
            <p className="text-gray-500 text-sm">
              No encontramos proyectos con los filtros seleccionados.
            </p>
            <button
              onClick={() => setSelectedTab('Todos')}
              className="mt-3 text-xs font-semibold text-[#C5A059] underline"
            >
              Ver todos los proyectos
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
