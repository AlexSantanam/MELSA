import React from 'react';
import { MelsaLogo } from './MelsaLogo';
import { MapPin, Phone, Mail, Instagram, Linkedin, Facebook, MessageCircle, ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="contacto" className="bg-[#0A162D] text-white pt-16 pb-8 border-t border-[#C5A059]/20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-12 border-b border-gray-800">
          
          {/* Col 1: Logo & Mission */}
          <div className="space-y-4">
            <MelsaLogo variant="light" height={42} />
            <p className="text-xs text-gray-400 font-light leading-relaxed">
              Gestión inmobiliaria estratégica. Conectamos personas e inversionistas con propiedades y desarrollos de alto estándar.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#C5A059] text-gray-300 hover:text-[#0F2042] flex items-center justify-center transition-all duration-300 border border-white/10"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#C5A059] text-gray-300 hover:text-[#0F2042] flex items-center justify-center transition-all duration-300 border border-white/10"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#C5A059] text-gray-300 hover:text-[#0F2042] flex items-center justify-center transition-all duration-300 border border-white/10"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/56987654321"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#25D366] text-gray-300 hover:text-white flex items-center justify-center transition-all duration-300 border border-white/10"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-sm font-serif font-semibold text-white uppercase tracking-wider mb-4 border-b border-[#C5A059]/30 pb-2 inline-block">
              Enlaces Rápidos
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-300">
              <li>
                <a href="#inicio" className="hover:text-[#C5A059] transition-colors">Inicio</a>
              </li>
              <li>
                <a href="#proyectos" className="hover:text-[#C5A059] transition-colors">Proyectos Destacados</a>
              </li>
              <li>
                <a href="#propiedades" className="hover:text-[#C5A059] transition-colors">Propiedades</a>
              </li>
              <li>
                <a href="#equipo" className="hover:text-[#C5A059] transition-colors">Nuestro Equipo</a>
              </li>
              <li>
                <a href="#nosotros" className="hover:text-[#C5A059] transition-colors">Sobre Nosotros</a>
              </li>
              <li>
                <a href="#contacto" className="hover:text-[#C5A059] transition-colors">Contacto & Ubicación</a>
              </li>
            </ul>
          </div>

          {/* Col 3: Direct Contact Information */}
          <div>
            <h4 className="text-sm font-serif font-semibold text-white uppercase tracking-wider mb-4 border-b border-[#C5A059]/30 pb-2 inline-block">
              Contacto
            </h4>
            <ul className="space-y-3 text-xs text-gray-300">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                <span>Av. El Golf 140, Piso 12, Las Condes, Santiago, Chile</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C5A059] shrink-0" />
                <a href="tel:+56987654321" className="hover:text-[#C5A059] transition-colors">
                  +56 9 8765 4321
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#C5A059] shrink-0" />
                <a href="mailto:contacto@melsainmobiliaria.com" className="hover:text-[#C5A059] transition-colors">
                  contacto@melsainmobiliaria.com
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Horario & Atención Executive */}
          <div>
            <h4 className="text-sm font-serif font-semibold text-white uppercase tracking-wider mb-4 border-b border-[#C5A059]/30 pb-2 inline-block">
              Horario de Atención
            </h4>
            <p className="text-xs text-gray-400 mb-3">
              Lunes a Viernes: 09:00 - 19:00 hrs
              <br />
              Sábados: 10:00 - 14:00 hrs (Previa cita)
            </p>
            <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-xs text-gray-300">
              <span className="text-[#C5A059] font-medium block mb-1">¿Tienes una propiedad para vender?</span>
              Ofrecemos valoración gratuita y estrategia de venta personalizada.
            </div>
          </div>

        </div>

        {/* Bottom Bar: Legal & Back to top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <p>© Melsa, Gestión Inmobiliaria. Todos los derechos reservados.</p>
          <div className="flex items-center space-x-6">
            <a
              href="https://universo693.com"
              target="_blank"
              rel="noopener"
              className="text-gray-400 hover:text-[#C5A059] transition-colors"
            >
              Desarrollado por <span className="font-medium">Uni-Verso693</span>
            </a>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 text-[#C5A059] hover:underline font-medium focus:outline-none"
            >
              <span>Volver arriba</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
