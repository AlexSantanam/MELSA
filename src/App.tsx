import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProjectsSection } from './components/ProjectsSection';
import { ServicesSection } from './components/ServicesSection';
import { SellPropertySection } from './components/SellPropertySection';
import { MarketTeaserSection } from './components/MarketTeaserSection';
import { MarketplacePortalPage } from './components/MarketplacePortalPage';
import { ProviderApplicationModal } from './components/ProviderApplicationModal';
import { IntranetPortalModal } from './components/IntranetPortalModal';
import { WhyChooseMelsa } from './components/WhyChooseMelsa';
import { InvestmentCalculator } from './components/InvestmentCalculator';
import { PropertiesSection } from './components/PropertiesSection';
import { TeamSection } from './components/TeamSection';
import { AboutUsSection } from './components/AboutUsSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';
import { AdvisoryModal } from './components/AdvisoryModal';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { WhatsAppWidget } from './components/WhatsAppWidget';
import { AIAssistantWidget } from './components/AIAssistantWidget';
import { RealEstateProject, ProviderApplication, AuthUser } from './types';
import { MOCK_APPLICATIONS } from './data/mockData';
import { getStoredUser, logoutUser } from './services/authService';
import { CollaboratorWorkspacePage } from './components/CollaboratorWorkspacePage';

export default function App() {
  const [viewMode, setViewMode] = useState<'home' | 'market' | 'workspace'>('home');
  const [marketInitialTab, setMarketInitialTab] = useState<'properties' | 'services' | 'publish'>('properties');
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(getStoredUser());

  const [isAdvisoryModalOpen, setIsAdvisoryModalOpen] = useState(false);
  const [preselectedAgentId, setPreselectedAgentId] = useState<string | undefined>();
  const [preselectedProjectId, setPreselectedProjectId] = useState<string | undefined>();
  
  const [selectedProjectForModal, setSelectedProjectForModal] = useState<RealEstateProject | null>(null);

  // Intranet & Application Modals
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [isIntranetModalOpen, setIsIntranetModalOpen] = useState(false);
  const [applications, setApplications] = useState<ProviderApplication[]>(MOCK_APPLICATIONS);

  const [activeHeroFilter, setActiveHeroFilter] = useState<{
    type: string;
    city: string;
    status: string;
  } | undefined>();

  // URL Hash synchronization for indexed sub-pages
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#workspace' || hash === '#panel' || hash === '#intranet') {
        setViewMode('workspace');
      } else if (hash === '#mercado' || hash === '#market') {
        setViewMode('market');
        setMarketInitialTab('properties');
      } else if (hash === '#servicios-hogar' || hash === '#tecnicos') {
        setViewMode('market');
        setMarketInitialTab('services');
      } else if (hash === '#publicar') {
        setViewMode('market');
        setMarketInitialTab('publish');
      } else if (hash === '#inicio' || hash === '') {
        setViewMode('home');
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleOpenMarket = (tab: 'properties' | 'services' | 'publish' = 'properties') => {
    setMarketInitialTab(tab);
    setViewMode('market');
    if (tab === 'publish') {
      window.location.hash = '#publicar';
    } else if (tab === 'services') {
      window.location.hash = '#servicios-hogar';
    } else {
      window.location.hash = '#mercado';
    }
  };

  const handleBackToHome = () => {
    setViewMode('home');
    window.location.hash = '#inicio';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogoutUser = async () => {
    await logoutUser();
    setCurrentUser(null);
    setViewMode('home');
    window.location.hash = '#inicio';
  };

  const handleOpenIntranetOrWorkspace = () => {
    if (currentUser) {
      setViewMode('workspace');
      window.location.hash = '#workspace';
    } else {
      setIsIntranetModalOpen(true);
    }
  };

  const handleOpenAdvisoryModal = (agentId?: string, projectId?: string) => {
    setPreselectedAgentId(agentId);
    setPreselectedProjectId(projectId);
    setIsAdvisoryModalOpen(true);
  };

  const handleSearchProjects = (filters: { type: string; city: string; status: string }) => {
    setActiveHeroFilter(filters);
  };

  const handleSelectService = (serviceName: string) => {
    setPreselectedProjectId(`Servicio: ${serviceName}`);
    setIsAdvisoryModalOpen(true);
  };

  // Provider Application Flow
  const handleSubmitApplication = (newApp: ProviderApplication) => {
    setApplications((prev) => [newApp, ...prev]);
  };

  const handleApproveApplication = (id: string) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: 'Aprobado' } : app))
    );
  };

  const handleRejectApplication = (id: string) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: 'Rechazado' } : app))
    );
  };

  // Full-Screen Dedicated Workspace for Collaborators & Admins
  if (viewMode === 'workspace' && currentUser) {
    return (
      <CollaboratorWorkspacePage
        currentUser={currentUser}
        onLogout={handleLogoutUser}
        onBackToHome={handleBackToHome}
        applications={applications}
        onApproveApplication={handleApproveApplication}
        onRejectApplication={handleRejectApplication}
      />
    );
  }

  // If user navigated to the dedicated Market Portal sub-page:
  if (viewMode === 'market') {
    return (
      <div className="min-h-screen bg-[#FAF9F8] text-[#1E293B] font-sans selection:bg-[#D02126] selection:text-white">
        <MarketplacePortalPage 
          onBackToHome={handleBackToHome}
          initialTab={marketInitialTab}
          onOpenApplicationModal={() => setIsApplicationModalOpen(true)}
          onOpenIntranetModal={handleOpenIntranetOrWorkspace}
          currentUser={currentUser}
        />
        
        {/* Floating Utilities */}
        <WhatsAppWidget />
        <AIAssistantWidget />

        <AdvisoryModal
          isOpen={isAdvisoryModalOpen}
          onClose={() => setIsAdvisoryModalOpen(false)}
          preselectedAgentId={preselectedAgentId}
          preselectedProjectId={preselectedProjectId}
        />

        <ProviderApplicationModal
          isOpen={isApplicationModalOpen}
          onClose={() => setIsApplicationModalOpen(false)}
          onSubmitApplication={handleSubmitApplication}
        />

        <IntranetPortalModal
          isOpen={isIntranetModalOpen}
          onClose={() => setIsIntranetModalOpen(false)}
          applications={applications}
          onApproveApplication={handleApproveApplication}
          onRejectApplication={handleRejectApplication}
          currentUser={currentUser}
          onUserChange={setCurrentUser}
          onOpenApplicationModal={() => setIsApplicationModalOpen(true)}
          onOpenWorkspace={() => {
            setViewMode('workspace');
            window.location.hash = '#workspace';
          }}
        />
      </div>
    );
  }

  // Standard Clean Institutional Landing Page
  return (
    <div className="min-h-screen bg-[#FAF9F8] text-[#1E293B] font-sans selection:bg-[#D02126] selection:text-white">
      
      {/* 1. Sticky Header & Navigation */}
      <Header 
        onOpenAdvisoryModal={handleOpenAdvisoryModal}
        onOpenMarket={handleOpenMarket}
        onOpenIntranetModal={handleOpenIntranetOrWorkspace}
        currentUser={currentUser}
      />

      {/* Main Content */}
      <main>
        {/* 2. Hero Principal */}
        <Hero
          onOpenAdvisoryModal={() => handleOpenAdvisoryModal()}
          onSearchProjects={handleSearchProjects}
        />

        {/* 3. Proyectos Destacados Exclusivos Melsa */}
        <ProjectsSection
          onSelectProject={(proj) => setSelectedProjectForModal(proj)}
          activeFilter={activeHeroFilter}
        />

        {/* 4. Ecosistema de Servicios Corporativos & Patrimoniales */}
        <ServicesSection onSelectService={handleSelectService} />

        {/* 5. Consigna o Vende tu Propiedad con Melsa (Captación & Tasación) */}
        <SellPropertySection />

        {/* 6. Melsa Open Market & Red de Servicios (Teaser elegante que enlaza al Portal Indexado) */}
        <MarketTeaserSection onOpenMarket={handleOpenMarket} />

        {/* 7. ¿Por qué elegir Melsa? */}
        <WhyChooseMelsa />

        {/* 8. Centro de Inteligencia Financiera & Algoritmos IA (Groq) */}
        <InvestmentCalculator />

        {/* 9. Cartera de Propiedades Individuales */}
        <PropertiesSection
          onOpenAdvisory={(agentId) => handleOpenAdvisoryModal(agentId)}
        />

        {/* 10. Nuestro Equipo */}
        <TeamSection
          onContactAgent={(agentId) => handleOpenAdvisoryModal(agentId)}
        />

        {/* 11. Sobre Nosotros */}
        <AboutUsSection />

        {/* 12. Testimonios */}
        <TestimonialsSection />

        {/* 13. Llamado a la acción final (CTA) */}
        <FinalCTA
          onOpenAdvisoryModal={() => handleOpenAdvisoryModal()}
        />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Utilities */}
      <WhatsAppWidget />
      <AIAssistantWidget />

      {/* Modals */}
      <AdvisoryModal
        isOpen={isAdvisoryModalOpen}
        onClose={() => setIsAdvisoryModalOpen(false)}
        preselectedAgentId={preselectedAgentId}
        preselectedProjectId={preselectedProjectId}
      />

      <ProjectDetailModal
        project={selectedProjectForModal}
        onClose={() => setSelectedProjectForModal(null)}
        onOpenAdvisory={(projectId) => handleOpenAdvisoryModal(undefined, projectId)}
      />

      {/* Pre-Filter Application Modal */}
      <ProviderApplicationModal
        isOpen={isApplicationModalOpen}
        onClose={() => setIsApplicationModalOpen(false)}
        onSubmitApplication={handleSubmitApplication}
      />

      {/* Intranet & Provider Private Portal */}
      <IntranetPortalModal
        isOpen={isIntranetModalOpen}
        onClose={() => setIsIntranetModalOpen(false)}
        applications={applications}
        onApproveApplication={handleApproveApplication}
        onRejectApplication={handleRejectApplication}
        currentUser={currentUser}
        onUserChange={setCurrentUser}
        onOpenApplicationModal={() => setIsApplicationModalOpen(true)}
        onOpenWorkspace={() => {
          setViewMode('workspace');
          window.location.hash = '#workspace';
        }}
      />

    </div>
  );
}
