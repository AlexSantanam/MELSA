import React from 'react';
import { MelsaLogo } from './MelsaLogo';
import { CheckCircle2, Shield, Target, Compass } from 'lucide-react';

export const AboutUsSection: React.FC = () => {
  return (
    <section id="nosotros" className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Image Stack */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-[#FAF8F5]">
              <img
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200"
                alt="Oficina Melsa Gestión Inmobiliaria"
                className="w-full h-[460px] object-cover object-center"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F2042]/70 via-transparent to-transparent" />
              
              {/* Overlay Badge */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-5 rounded-2xl border border-gray-100 shadow-xl">
                <div className="flex items-center gap-4">
                  <MelsaLogo variant="emblem" height={40} />
                  <div>
                    <h4 className="text-sm font-serif font-bold text-[#0F2042]">
                      Sede Central Santiago
                    </h4>
                    <p className="text-xs text-gray-500 font-medium">
                      Atención ejecutiva personalizada con cita previa
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Accent Gold Corner Ornament */}
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[#C5A059]/10 rounded-3xl -z-10 border border-[#C5A059]/30" />
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-[#0F2042]/5 rounded-3xl -z-10" />
          </div>

          {/* Right Column: Corporate Story & Manifesto */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A059]/10 text-[#A27E3A] text-xs font-semibold uppercase tracking-wider mb-4">
              <span>Nuestra Historia & Propósito</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-serif text-[#0F2042] font-normal tracking-tight mb-6 leading-tight">
              Sobre Nosotros
            </h2>

            {/* Corporate Highlight Quote requested by prompt */}
            <blockquote className="text-lg sm:text-xl font-serif italic text-[#0F2042] border-l-4 border-[#C5A059] pl-6 py-2 mb-8 bg-[#FAF8F5] rounded-r-2xl">
              "Melsa, Gestión Inmobiliaria nace con el propósito de ofrecer una experiencia inmobiliaria cercana, profesional y estratégica, conectando personas con propiedades y proyectos de alto valor."
            </blockquote>

            <p className="text-gray-600 text-sm sm:text-base font-light leading-relaxed mb-8">
              Entendemos que una transacción inmobiliaria no es solo un trámite, sino uno de los hitos financieros y emocionales más significativos en la vida de una persona o familia. Por ello, combinamos análisis riguroso de mercado, estructuración legal impecable y una cálida vocación de servicio.
            </p>

            {/* Strategic Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-[#FAF8F5] border border-gray-100">
                <Shield className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-sm font-semibold text-[#0F2042]">Rigor Legal</h5>
                  <p className="text-xs text-gray-500">Estudio exhaustivo de títulos y resguardo de inversión.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-[#FAF8F5] border border-gray-100">
                <Target className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-sm font-semibold text-[#0F2042]">Enfoque Estratégico</h5>
                  <p className="text-xs text-gray-500">Optimizamos plusvalía y retorno de capital.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-[#FAF8F5] border border-gray-100">
                <Compass className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-sm font-semibold text-[#0F2042]">Red de Alianzas</h5>
                  <p className="text-xs text-gray-500">Convenios bancarios preferenciales y notarías.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-[#FAF8F5] border border-gray-100">
                <CheckCircle2 className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-sm font-semibold text-[#0F2042]">Atención Confidencial</h5>
                  <p className="text-xs text-gray-500">Discreción total para patrimonios exigentes.</p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
