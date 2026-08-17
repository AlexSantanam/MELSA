import React, { useState } from 'react';
import { RealEstateProject } from '../types';
import { X, MapPin, Building2, Calendar, CheckCircle, ShieldCheck, MessageCircle, Eye } from 'lucide-react';

interface ProjectDetailModalProps {
  project: RealEstateProject | null;
  onClose: () => void;
  onOpenAdvisory: (projectId: string) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  onClose,
  onOpenAdvisory
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!project) return null;

  const images = project.galleryImages && project.galleryImages.length > 0
    ? project.galleryImages
    : [project.mainImage];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#E5E0D8] max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-[#0F2042] text-white px-6 py-4 flex items-center justify-between border-b border-[#C5A059]/30 shrink-0">
          <div>
            <span className="text-xs text-[#DFC287] font-semibold uppercase tracking-wider block">
              Ficha Técnica de Proyecto • MELSA
            </span>
            <h3 className="text-xl sm:text-2xl font-serif font-medium">{project.name}</h3>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar space-y-6 flex-1">
          
          {/* Main Gallery Display */}
          <div className="space-y-3">
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-gray-900 border border-gray-200">
              <img
                src={images[activeImageIndex]}
                alt={project.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-3 left-3 bg-[#0F2042]/90 backdrop-blur-md text-[#DFC287] text-xs font-semibold px-3 py-1 rounded-full border border-[#C5A059]/30">
                {project.status}
              </div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-16 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                      activeImageIndex === idx ? 'border-[#C5A059] scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Vista ${idx + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#FAF8F5] p-4 rounded-2xl border border-gray-200">
            <div>
              <span className="text-xs text-gray-500 font-medium block">Ubicación</span>
              <span className="text-sm font-semibold text-[#0F2042] flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
                {project.location}
              </span>
            </div>
            <div>
              <span className="text-xs text-gray-500 font-medium block">Superficie</span>
              <span className="text-sm font-semibold text-[#0F2042]">
                {project.surfaceM2}
              </span>
            </div>
            <div>
              <span className="text-xs text-gray-500 font-medium block">Tipología</span>
              <span className="text-sm font-semibold text-[#0F2042]">
                {project.bedrooms}
              </span>
            </div>
            <div>
              <span className="text-xs text-gray-500 font-medium block">Fecha Entrega</span>
              <span className="text-sm font-semibold text-[#0F2042] flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                {project.deliveryDate}
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-base font-serif font-semibold text-[#0F2042] mb-2">
              Descripción del Desarrollo
            </h4>
            <p className="text-sm text-gray-600 font-light leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Highlights & Investment Yield */}
          <div>
            <h4 className="text-base font-serif font-semibold text-[#0F2042] mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
              <span>Puntos Clave & Beneficios de Inversión</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {project.highlights.map((hl, i) => (
                <div key={i} className="flex items-start gap-2 bg-white p-3 rounded-xl border border-gray-100 text-xs text-gray-700">
                  <CheckCircle className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                  <span>{hl}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Amenities Grid */}
          <div>
            <h4 className="text-base font-serif font-semibold text-[#0F2042] mb-3">
              Equipamiento & Amenidades
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.amenities.map((am, i) => (
                <span
                  key={i}
                  className="bg-[#0F2042]/5 text-[#0F2042] border border-[#0F2042]/10 text-xs px-3 py-1.5 rounded-full font-medium"
                >
                  {am}
                </span>
              ))}
            </div>
          </div>

          {/* Price & Action */}
          <div className="bg-[#0F2042] text-white p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-[#C5A059]/30">
            <div>
              <span className="text-xs text-gray-300 block font-medium">Precio desde</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold melsa-text-gold-gradient">
                  ${project.priceFromUSD.toLocaleString('en-US')} USD
                </span>
                {project.priceFromUF && (
                  <span className="text-xs text-gray-300 font-medium">
                    ({project.priceFromUF.toLocaleString()} UF aprox.)
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => {
                  onClose();
                  onOpenAdvisory(project.id);
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#C5A059] hover:bg-[#DFC287] text-[#0F2042] font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-md"
              >
                <Calendar className="w-4 h-4" />
                <span>Agendar visita / Asesoría</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
