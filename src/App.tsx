import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProjectsSection } from './components/ProjectsSection';
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
import { RealEstateProject } from './types';

export default function App() {
  const [isAdvisoryModalOpen, setIsAdvisoryModalOpen] = useState(false);
  const [preselectedAgentId, setPreselectedAgentId] = useState<string | undefined>();
  const [preselectedProjectId, setPreselectedProjectId] = useState<string | undefined>();
  
  const [selectedProjectForModal, setSelectedProjectForModal] = useState<RealEstateProject | null>(null);

  const [activeHeroFilter, setActiveHeroFilter] = useState<{
    type: string;
    city: string;
    status: string;
  } | undefined>();

  const handleOpenAdvisoryModal = (agentId?: string, projectId?: string) => {
    setPreselectedAgentId(agentId);
    setPreselectedProjectId(projectId);
    setIsAdvisoryModalOpen(true);
  };

  const handleSearchProjects = (filters: { type: string; city: string; status: string }) => {
    setActiveHeroFilter(filters);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#1E293B] font-sans selection:bg-[#C5A059] selection:text-white">
      
      {/* 1. Sticky Header & Navigation */}
      <Header onOpenAdvisoryModal={handleOpenAdvisoryModal} />

      {/* Main Content */}
      <main>
        {/* 2. Hero Principal */}
        <Hero
          onOpenAdvisoryModal={() => handleOpenAdvisoryModal()}
          onSearchProjects={handleSearchProjects}
        />

        {/* 3. Proyectos Destacados */}
        <ProjectsSection
          onSelectProject={(proj) => setSelectedProjectForModal(proj)}
          activeFilter={activeHeroFilter}
        />

        {/* 4. ¿Por qué elegir Melsa? */}
        <WhyChooseMelsa />

        {/* 5. Simulador Financiero & ROI Inmobiliario */}
        <InvestmentCalculator />

        {/* 6. Cartera de Propiedades Individuales */}
        <PropertiesSection
          onOpenAdvisory={(agentId) => handleOpenAdvisoryModal(agentId)}
        />

        {/* 7. Nuestro Equipo */}
        <TeamSection
          onContactAgent={(agentId) => handleOpenAdvisoryModal(agentId)}
        />

        {/* 8. Sobre Nosotros */}
        <AboutUsSection />

        {/* 9. Testimonios */}
        <TestimonialsSection />

        {/* 10. Llamado a la acción final (CTA) */}
        <FinalCTA
          onOpenAdvisoryModal={() => handleOpenAdvisoryModal()}
        />
      </main>

      {/* 11. Footer */}
      <Footer />

      {/* 12. Floating Left WhatsApp Button */}
      <WhatsAppWidget />

      {/* 13. Interactive Modals */}
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

    </div>
  );
}
