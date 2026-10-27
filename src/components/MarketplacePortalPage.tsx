import React, { useState, useEffect } from 'react';
import { MelsaLogo } from './MelsaLogo';
import { MarketplaceShowcaseSection } from './MarketplaceShowcaseSection';
import { HomeServicesSection } from './HomeServicesSection';
import { BrokerMarketplaceSection } from './BrokerMarketplaceSection';
import { 
  Building2, 
  Wrench, 
  Sparkles, 
  ArrowLeft, 
  PlusCircle, 
  ShieldCheck, 
  ExternalLink,
  Phone,
  CheckCircle2
} from 'lucide-react';

import { AuthUser } from '../types';

interface MarketplacePortalPageProps {
  onBackToHome: () => void;
  initialTab?: 'properties' | 'services' | 'publish';
  onOpenApplicationModal?: () => void;
  onOpenIntranetModal?: () => void;
  currentUser?: AuthUser | null;
}

export const MarketplacePortalPage: React.FC<MarketplacePortalPageProps> = ({ 
  onBackToHome, 
  initialTab = 'properties',
  onOpenApplicationModal,
  onOpenIntranetModal,
  currentUser
}) => {
  const [activeTab, setActiveTab] = useState<'properties' | 'services' | 'publish'>(initialTab);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-[#FAF9F8] text-[#0F1115] font-sans">
      
      {/* Dedicated Portal Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-[#0F1115] text-white border-b border-[#D02126]/30 shadow-xl backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo & Portal Badge */}
          <div className="flex items-center gap-4">
            <button
              onClick={onBackToHome}
              className="flex items-center gap-2 text-xs font-semibold text-gray-300 hover:text-white transition-colors cursor-pointer mr-2 py-1.5 px-3 rounded-lg hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 text-[#D02126]" />
              <span className="hidden sm:inline">Volver a Web Melsa</span>
            </button>

            <div className="h-6 w-px bg-white/20 hidden sm:block" />

            <div className="flex items-center gap-3">
              <MelsaLogo isLight={true} className="h-8" />
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#D02126] text-white">
                Market & Servicios
              </span>
            </div>
          </div>

          {/* Portal Switcher Tabs */}
          <div className="flex items-center gap-1.5 bg-white/10 p-1 rounded-2xl border border-white/10">
            <button
              onClick={() => setActiveTab('properties')}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'properties'
                  ? 'bg-[#D02126] text-white shadow-md'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Inmuebles Terceros</span>
            </button>

            <button
              onClick={() => setActiveTab('services')}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'services'
                  ? 'bg-[#D02126] text-white shadow-md'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Técnicos & Hogar</span>
            </button>

            <button
              onClick={() => setActiveTab('publish')}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'publish'
                  ? 'bg-[#D02126] text-white shadow-md'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Publicar ($10k)</span>
            </button>
          </div>

          {/* Intranet / Prestadores Access Button */}
          <button
            onClick={onOpenIntranetModal}
            className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-xl border border-white/20 text-xs font-semibold text-gray-200 hover:text-white hover:border-[#D02126] hover:bg-white/5 transition-all cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-[#D02126]" />
            <span>{currentUser ? (currentUser.role === 'admin' ? 'Admin Melsa' : 'Mi Panel') : 'INICIAR SESIÓN'}</span>
          </button>

        </div>
      </header>

      {/* Sub-Header Banner */}
      <div className="bg-gradient-to-r from-[#171A21] via-[#0F1115] to-[#171A21] text-white py-10 px-4 border-b border-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          <span className="text-xs font-semibold text-[#D02126] uppercase tracking-wider block mb-1">
            Ecosistema Abierto Multilateral
          </span>
          <h1 className="text-2xl sm:text-4xl font-serif font-normal">
            {activeTab === 'properties' && 'Vitrina Pública de Inmuebles: Corredores & Propietarios'}
            {activeTab === 'services' && 'Red de Confianza Hogar: Técnicos & Empresas Verificadas'}
            {activeTab === 'publish' && 'Portal de Publicación & Pasarela de Pago ($10.000 CLP)'}
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-2 max-w-2xl mx-auto font-light">
            {activeTab === 'properties' && 'Catálogo independiente de propiedades con verificación de datos y contacto directo al corredor sin comisiones adicionales.'}
            {activeTab === 'services' && 'Directorio de gasfitería, electricidad SEC, remodelación y mantención con filtro reputacional y de antecedentes.'}
            {activeTab === 'publish' && 'Publica tu casa o departamento en Melsa con reescritura SEO anti-duplicado con IA de Groq y pago único.'}
          </p>
        </div>
      </div>

      {/* Main Tab Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'properties' && (
          <MarketplaceShowcaseSection onGoToPublish={() => setActiveTab('publish')} />
        )}
        {activeTab === 'services' && (
          <HomeServicesSection 
            onOpenApplicationModal={onOpenApplicationModal}
            onOpenIntranetModal={onOpenIntranetModal}
          />
        )}
        {activeTab === 'publish' && <BrokerMarketplaceSection />}
      </main>

      {/* Simple Footer for Portal */}
      <footer className="bg-[#0F1115] text-white/70 py-10 border-t border-gray-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <MelsaLogo isLight={true} className="h-6" />
            <span className="text-gray-500">· Portal Multilateral & Servicios</span>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={onBackToHome} className="hover:text-white transition-colors cursor-pointer">
              Web Principal Melsa
            </button>
            <a href="https://wa.me/56999899421" target="_blank" rel="noopener noreferrer" className="hover:text-[#25D366] transition-colors">
              Soporte WhatsApp (+56 9 9989 9421)
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
};
