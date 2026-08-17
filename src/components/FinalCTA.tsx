import React from 'react';
import { Calendar, PhoneCall, ArrowUpRight, ShieldCheck } from 'lucide-react';

interface FinalCTAProps {
  onOpenAdvisoryModal: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onOpenAdvisoryModal }) => {
  return (
    <section className="relative py-20 bg-[#0F2042] text-white overflow-hidden">
      {/* Background Architectural Patterns */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#C5A059] filter blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-[#1A3462] filter blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/40 text-[#DFC287] text-xs font-semibold uppercase tracking-wider mb-6">
          <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
          <span>Atención Preferencial Executive</span>
        </div>

        {/* Headline requested in prompt */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-normal text-white mb-6 tracking-tight">
          Conversemos sobre tu <span className="melsa-text-gold-gradient italic font-semibold">próxima propiedad</span>
        </h2>

        <p className="text-gray-300 text-base sm:text-lg font-light leading-relaxed max-w-2xl mx-auto mb-10">
          Ya sea que busques el hogar perfecto para tu familia o estructurar una cartera de inversión rentable, en Melsa te ofrecemos respaldo estratégico y asesoría personalizada.
        </p>

        {/* Big Action Button requested in prompt */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onOpenAdvisoryModal}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-5 rounded-full text-base sm:text-lg font-bold text-[#0F2042] bg-[#C5A059] hover:bg-[#DFC287] transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 border border-[#DFC287]/50 group"
          >
            <Calendar className="w-5 h-5 text-[#0F2042]" />
            <span>Solicitar asesoría</span>
            <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>

          <a
            href="tel:+56987654321"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-5 rounded-full text-base font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md transition-all duration-300"
          >
            <PhoneCall className="w-4 h-4 text-[#C5A059]" />
            <span>Llamar ahora</span>
          </a>
        </div>

      </div>
    </section>
  );
};
