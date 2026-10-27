import React from 'react';
import { TESTIMONIALS } from '../data/mockData';
import { Star, Quote, CheckCircle } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-20 bg-[#FAF9F8] relative border-t border-gray-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D02126]/10 text-[#D02126] text-xs font-semibold uppercase tracking-wider mb-3">
            <span>Experiencias de Clientes</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#0F1115] font-normal tracking-tight mb-4">
            Testimonios
          </h2>
          <p className="text-gray-600 text-base font-light leading-relaxed">
            La confianza de nuestros clientes es nuestro mayor activo. Conoce las historias de quienes compraron, vendieron o invirtieron junto a Melsa.
          </p>
        </div>

        {/* 3 Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between relative hover:border-[#D02126]/30"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-[#D02126]/15 pointer-events-none" />

              <div>
                {/* 5 Stars in Brand Red */}
                <div className="flex items-center gap-1 mb-6 text-[#D02126]">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                {/* Comment */}
                <p className="text-sm text-gray-700 font-light leading-relaxed italic mb-6">
                  "{testimonial.comment}"
                </p>
              </div>

              {/* Client Info */}
              <div className="pt-4 border-t border-gray-100 flex items-center gap-3">
                <img
                  src={testimonial.avatarUrl}
                  alt={testimonial.clientName}
                  className="w-11 h-11 rounded-full object-cover border-2 border-[#D02126]"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="text-sm font-semibold text-[#0F1115]">
                    {testimonial.clientName}
                  </h4>
                  <div className="flex items-center gap-1 text-xs text-gray-500 font-medium">
                    <CheckCircle className="w-3 h-3 text-[#D02126]" />
                    <span>{testimonial.propertyType}</span>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
