import React from 'react';
import { WHY_CHOOSE_US, STATS } from '../data/mockData';
import { UserCheck, Building2, ShieldCheck, Award, CheckCircle2 } from 'lucide-react';

export const WhyChooseMelsa: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'UserCheck':
        return <UserCheck className="w-6 h-6 text-[#C5A059]" />;
      case 'Building2':
        return <Building2 className="w-6 h-6 text-[#C5A059]" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6 text-[#C5A059]" />;
      case 'Award':
        return <Award className="w-6 h-6 text-[#C5A059]" />;
      default:
        return <CheckCircle2 className="w-6 h-6 text-[#C5A059]" />;
    }
  };

  return (
    <section className="py-20 bg-white relative overflow-hidden border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A059]/10 text-[#A27E3A] text-xs font-semibold uppercase tracking-wider mb-3">
            <span>Diferencial Melsa</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#0F2042] font-normal tracking-tight mb-4">
            ¿Por qué elegir Melsa?
          </h2>
          <p className="text-gray-600 text-base sm:text-lg font-light leading-relaxed">
            Combinamos conocimiento profundo del mercado inmobiliario, rigor legal y un servicio de acompañamiento exclusivo para garantizar decisiones seguras y rentables.
          </p>
        </div>

        {/* 4 Block Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {WHY_CHOOSE_US.map((item) => (
            <div
              key={item.id}
              className="bg-[#FAF8F5] p-8 rounded-2xl border border-[#E5E0D8] hover:border-[#C5A059] transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#0F2042] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-md">
                {getIcon(item.iconName)}
              </div>
              <h3 className="text-xl font-serif text-[#0F2042] font-medium mb-3">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600 font-light leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Key Corporate Metrics / Stats */}
        <div className="bg-[#0F2042] rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden border border-[#C5A059]/30 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#C5A059]/10 rounded-full filter blur-3xl pointer-events-none" />
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center relative z-10">
            {STATS.map((stat) => (
              <div key={stat.label} className="p-2">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold melsa-text-gold-gradient mb-2">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm font-medium text-gray-300 tracking-wider uppercase">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
