import React, { useState, useEffect } from 'react';
import { MelsaLogo } from './MelsaLogo';
import { Phone, Mail, Calendar, Menu, X, MessageCircle } from 'lucide-react';

interface HeaderProps {
  onOpenAdvisoryModal: (agentId?: string, projectId?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAdvisoryModal }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Inicio', href: '#inicio' },
    { label: 'Proyectos', href: '#proyectos' },
    { label: 'Propiedades', href: '#propiedades' },
    { label: 'Equipo', href: '#equipo' },
    { label: 'Nosotros', href: '#nosotros' },
    { label: 'Contacto', href: '#contacto' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Top Contact Bar */}
      <div className={`bg-[#0F2042] text-white/80 text-xs py-2 px-4 transition-all duration-300 hidden md:block border-b border-[#C5A059]/20 ${
        isScrolled ? 'max-h-0 py-0 opacity-0 overflow-hidden' : 'max-h-12 opacity-100'
      }`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <a href="tel:+56987654321" className="flex items-center gap-2 hover:text-[#C5A059] transition-colors">
              <Phone className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>+56 9 8765 4321</span>
            </a>
            <a href="mailto:contacto@melsainmobiliaria.com" className="flex items-center gap-2 hover:text-[#C5A059] transition-colors">
              <Mail className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>contacto@melsainmobiliaria.com</span>
            </a>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-[#C5A059] font-medium">Santiago • Las Condes • Zapallar</span>
            <span className="text-white/40">|</span>
            <a
              href="https://wa.me/56987654321?text=Hola%20Melsa,%20deseo%20solicitar%20asesor%C3%ADa%20inmobiliaria"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-[#C5A059] hover:underline font-medium"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Atención Inmediata WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-[#FAF8F5]/95 backdrop-blur-md shadow-md py-3 border-b border-[#C5A059]/30'
            : 'bg-white/90 backdrop-blur-sm py-4 border-b border-gray-100 shadow-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo Aligned Left */}
          <a href="#inicio" className="flex items-center focus:outline-none">
            <MelsaLogo height={isScrolled ? 42 : 48} />
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-[#0F2042] hover:text-[#C5A059] transition-colors relative py-1 group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#C5A059] transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* Action Button */}
          <div className="hidden sm:flex items-center gap-4">
            <button
              onClick={() => onOpenAdvisoryModal()}
              className="relative group inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-[#0F2042] hover:bg-[#1A3462] shadow-md hover:shadow-lg transition-all duration-300 border border-[#C5A059]/40 hover:border-[#C5A059]"
            >
              <Calendar className="w-4 h-4 text-[#C5A059] group-hover:scale-110 transition-transform" />
              <span>Agenda una asesoría</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => onOpenAdvisoryModal()}
              className="p-2 text-xs font-medium text-white bg-[#0F2042] rounded-lg sm:hidden flex items-center gap-1"
            >
              <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Asesoría</span>
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-[#0F2042] hover:bg-gray-100 focus:outline-none"
              aria-label="Abrir menú"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-gray-200 shadow-xl px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top duration-300">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-base font-medium text-[#0F2042] hover:text-[#C5A059] py-2 border-b border-gray-100"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-2">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenAdvisoryModal();
                }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#0F2042] text-white text-sm font-semibold border border-[#C5A059]"
              >
                <Calendar className="w-4 h-4 text-[#C5A059]" />
                <span>Agenda una asesoría</span>
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
