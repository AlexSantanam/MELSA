import React from 'react';
import { TEAM_MEMBERS } from '../data/mockData';
import { Phone, MessageCircle, Calendar, ShieldCheck, Award } from 'lucide-react';

interface TeamSectionProps {
  onContactAgent: (agentId: string) => void;
}

export const TeamSection: React.FC<TeamSectionProps> = ({ onContactAgent }) => {
  return (
    <section id="equipo" className="py-20 bg-[#FAF9F8] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D02126]/10 text-[#D02126] text-xs font-semibold uppercase tracking-wider mb-3">
            <Award className="w-3.5 h-3.5 text-[#D02126]" />
            <span>Respaldo Ejecutivo</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#0F1115] font-normal tracking-tight mb-4">
            Nuestro Equipo
          </h2>
          <p className="text-gray-600 text-base sm:text-lg font-light leading-relaxed">
            Contamos con asesores inmobiliarios de alta trayectoria dedicados a brindarte orientación clara, confidencial y personalizada en cada etapa de tu inversión o búsqueda.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 max-w-5xl mx-auto gap-8 lg:gap-10">
          {TEAM_MEMBERS.map((agent) => (
            <div
              key={agent.id}
              className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:border-[#D02126]/40"
            >
              <div>
                {/* Photo Frame */}
                <div className="relative aspect-[4/4] overflow-hidden bg-[#0F1115]">
                  <img
                    src={agent.photoUrl}
                    alt={agent.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 filter contrast-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F1115]/80 via-transparent to-transparent" />
                  
                  {/* Experience Badge */}
                  <div className="absolute bottom-3 left-4 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-[#0F1115] flex items-center gap-1.5 shadow-sm">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#D02126]" />
                    <span>{agent.experienceYears}+ años de experiencia</span>
                  </div>
                </div>

                {/* Info Details */}
                <div className="p-6">
                  <h3 className="text-xl font-serif text-[#0F1115] font-semibold mb-1">
                    {agent.name}
                  </h3>
                  <p className="text-xs font-semibold text-[#D02126] uppercase tracking-wider mb-3">
                    {agent.role}
                  </p>
                  
                  <div className="mb-4">
                    <span className="text-xs font-medium text-gray-500 block mb-1">Especialidad:</span>
                    <span className="text-xs bg-[#FAF9F8] text-[#0F1115] px-2.5 py-1 rounded-md font-medium border border-gray-200 inline-block">
                      {agent.specialty}
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 font-light leading-relaxed line-clamp-3 mb-4">
                    {agent.bio}
                  </p>
                </div>
              </div>

              {/* Direct Contact Links & Action Button */}
              <div className="px-6 pb-6 pt-0 border-t border-gray-100 mt-2">
                <div className="flex items-center justify-between text-xs text-gray-500 pt-4 mb-4">
                  <a href={`tel:${agent.phone}`} className="flex items-center gap-1.5 hover:text-[#D02126] transition-colors">
                    <Phone className="w-3.5 h-3.5 text-[#D02126]" />
                    <span>{agent.phone}</span>
                  </a>
                  <a
                    href={`https://wa.me/${agent.phone.replace(/[^0-9]/g, '')}?text=Hola%20${encodeURIComponent(agent.name)},%20deseo%20contactarte%20por%20asesor%C3%ADa`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-[#25D366] font-medium hover:underline"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </div>

                <button
                  onClick={() => onContactAgent(agent.id)}
                  className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-white bg-[#0F1115] hover:bg-[#D02126] transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <Calendar className="w-4 h-4 text-white" />
                  <span>Contactar a {agent.name.split(' ')[0]}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
