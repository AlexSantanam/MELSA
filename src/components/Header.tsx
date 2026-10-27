import React, { useState, useEffect } from 'react';
import { MelsaLogo } from './MelsaLogo';
import { Phone, Mail, Calendar, Menu, X, MessageCircle, Lock, User, ShieldCheck } from 'lucide-react';
import { AuthUser } from '../types';

interface HeaderProps {
  onOpenAdvisoryModal: (agentId?: string, projectId?: string) => void;
  onOpenMarket?: (tab?: 'properties' | 'services' | 'publish') => void;
  onOpenIntranetModal?: () => void;
  currentUser?: AuthUser | null;
}

export const Header: React.FC<HeaderProps> = ({ 
  onOpenAdvisoryModal, 
  onOpenMarket, 
  onOpenIntranetModal,
  currentUser 
}) => {
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
    { label: 'Market', href: '#mercado' },
    { label: 'Inteligencia IA', href: '#inteligencia-financiera' },
    { label: 'Servicios', href: '#servicios' },
    { label: 'Contacto', href: '#contacto' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Top Contact Bar */}
      <div className={`bg-[#0F1115] text-white/80 text-xs py-2 px-4 transition-all duration-300 hidden md:block border-b border-[#D02126]/20 ${
        isScrolled ? 'max-h-0 py-0 opacity-0 overflow-hidden' : 'max-h-12 opacity-100'
      }`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <a href="tel:+56999899421" className="flex items-center gap-2 hover:text-[#D02126] transition-colors">
              <Phone className="w-3.5 h-3.5 text-[#D02126]" />
              <span>+56 9 9989 9421</span>
            </a>
            <a href="mailto:contacto@melsainmobiliaria.com" className="flex items-center gap-2 hover:text-[#D02126] transition-colors">
              <Mail className="w-3.5 h-3.5 text-[#D02126]" />
              <span>contacto@melsainmobiliaria.com</span>
            </a>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-300 font-medium">Santiago • Las Condes • Zapallar</span>
            <span className="text-white/40">|</span>
            <a
              href="https://wa.me/56999899421?text=Hola%20Melsa,%20deseo%20solicitar%20asesor%C3%ADa%20inmobiliaria"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-[#D02126] hover:underline font-medium"
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
            ? 'bg-white/95 backdrop-blur-md shadow-md py-3 border-b border-[#D02126]/20'
            : 'bg-white/95 backdrop-blur-sm py-4 border-b border-gray-100 shadow-sm'
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
                onClick={(e) => {
                  if (link.href === '#mercado') {
                    e.preventDefault();
                    onOpenMarket?.('properties');
                  }
                }}
                className="text-sm font-medium text-[#0F1115] hover:text-[#D02126] transition-colors relative py-1 group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D02126] transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* 1 Solo Botón Superior Derecho: Iniciar Sesión / Mi Cuenta */}
          <div className="hidden sm:flex items-center">
            <button
              onClick={onOpenIntranetModal}
              className="relative group inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-white bg-[#D02126] hover:bg-[#B81B1F] shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              {currentUser ? (
                currentUser.role === 'admin' ? (
                  <>
                    <ShieldCheck className="w-4 h-4 text-white" />
                    <span>Admin Melsa</span>
                  </>
                ) : (
                  <>
                    <User className="w-4 h-4 text-white" />
                    <span>Mi Panel ({currentUser.name.split(' ')[0]})</span>
                  </>
                )
              ) : (
                <>
                  <User className="w-4 h-4 text-white" />
                  <span>INICIAR SESIÓN</span>
                </>
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={onOpenIntranetModal}
              className="p-2 text-xs font-semibold text-white bg-[#D02126] rounded-xl sm:hidden flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <User className="w-3.5 h-3.5 text-white" />
              <span>{currentUser ? (currentUser.role === 'admin' ? 'Admin' : 'Mi Panel') : 'INICIAR SESIÓN'}</span>
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-[#0F1115] hover:bg-gray-100 focus:outline-none"
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
                onClick={(e) => {
                  if (link.href === '#mercado') {
                    e.preventDefault();
                    onOpenMarket?.('properties');
                  }
                  setIsMobileMenuOpen(false);
                }}
                className="block text-base font-medium text-[#0F1115] hover:text-[#D02126] py-2 border-b border-gray-100"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-2">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenIntranetModal?.();
                }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#D02126] text-white text-sm font-semibold shadow-md cursor-pointer"
              >
                <User className="w-4 h-4 text-white" />
                <span>{currentUser ? 'Acceder a Mi Cuenta' : 'INICIAR SESIÓN'}</span>
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
