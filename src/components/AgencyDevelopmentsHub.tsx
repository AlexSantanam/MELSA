import React, { useState } from 'react';
import { 
  Building2, 
  Layers, 
  Sparkles, 
  Plus, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  FileText, 
  Share2, 
  Download, 
  ExternalLink, 
  Image as ImageIcon, 
  Tag, 
  Calculator, 
  Percent, 
  Filter, 
  Eye, 
  ChevronRight,
  TrendingUp,
  MapPin,
  Calendar,
  Check,
  X,
  AlertCircle,
  HelpCircle,
  Compass
} from 'lucide-react';
import { UF_CURRENT_CLP } from '../services/propertyValuationEngine';

export interface StackingUnit {
  id: string;
  unitNumber: string; // e.g. "402"
  floor: number;
  typologyId: string;
  typologyName: string;
  status: 'disponible' | 'reservado' | 'vendido' | 'piloto';
  usefulM2: number;
  terraceM2: number;
  priceUF: number;
  orientation: 'Norte' | 'Sur' | 'Oriente' | 'Poniente' | 'Nor-Oriente' | 'Nor-Poniente';
  parkingIncluded: number;
  storageIncluded: number;
  reservedBy?: string;
  reservationDate?: string;
}

export interface ProjectTypology {
  id: string;
  name: string; // e.g. "Modelo Roble (2D + 2B)"
  bedrooms: number;
  bathrooms: number;
  usefulM2: number;
  totalM2: number;
  priceFromUF: number;
  description: string;
  pilotPhotos: string[];
  floorPlanUrl: string;
  virtualTourUrl?: string;
  features: string[];
}

export interface DevelopmentProject {
  id: string;
  name: string;
  developerName: string;
  commune: string;
  address: string;
  stage: 'En Blanco' | 'En Verde' | 'Entrega Inmediata';
  deliveryDate: string;
  totalUnits: number;
  floorsCount: number;
  unitsPerFloor: number;
  coverImage: string;
  bonoPieActive: boolean;
  bonoPiePct: number; // e.g. 10
  discountPozoPct: number; // e.g. 5
  publishedOnMelsa: boolean;
  typologies: ProjectTypology[];
  units: StackingUnit[];
}

const INITIAL_PROJECTS: DevelopmentProject[] = [
  {
    id: 'proj-mirador-villa-alemana',
    name: 'Condominio Mirador Real',
    developerName: 'Inmobiliaria Melsa & Asociados',
    commune: 'Villa Alemana',
    address: 'Av. Valparaíso con Calle Huanhualí',
    stage: 'En Verde',
    deliveryDate: 'Noviembre 2026',
    totalUnits: 32,
    floorsCount: 4,
    unitsPerFloor: 8,
    coverImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1200',
    bonoPieActive: true,
    bonoPiePct: 10,
    discountPozoPct: 5,
    publishedOnMelsa: true,
    typologies: [
      {
        id: 'tipo-va-1',
        name: 'Modelo Huanhualí (2D + 2B)',
        bedrooms: 2,
        bathrooms: 2,
        usefulM2: 62,
        totalM2: 70,
        priceFromUF: 2650,
        description: 'Departamento moderno con cocina integrada, cubierta de cuarzo y terraza panorámica hacia el valle.',
        pilotPhotos: [
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800'
        ],
        floorPlanUrl: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=800',
        features: ['Piso gres porcelánico', 'Ventanas termopanel PVC', 'Cocina equipada Teka', 'Espacio para lavadora']
      },
      {
        id: 'tipo-va-2',
        name: 'Modelo Peñablanca (3D + 2B)',
        bedrooms: 3,
        bathrooms: 2,
        usefulM2: 84,
        totalM2: 95,
        priceFromUF: 3400,
        description: 'Distribución familiar amplia con suite principal con walk-in closet y gran terraza.',
        pilotPhotos: [
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=800'
        ],
        floorPlanUrl: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=800',
        features: ['Dormitorio principal en suite', 'Walk-in closet', '2 Estacionamientos', 'Bodega subterránea']
      }
    ],
    units: [
      // Piso 4
      { id: 'u-401', unitNumber: '401', floor: 4, typologyId: 'tipo-va-1', typologyName: 'Modelo Huanhualí (2D + 2B)', status: 'disponible', usefulM2: 62, terraceM2: 8, priceUF: 2680, orientation: 'Nor-Oriente', parkingIncluded: 1, storageIncluded: 1 },
      { id: 'u-402', unitNumber: '402', floor: 4, typologyId: 'tipo-va-1', typologyName: 'Modelo Huanhualí (2D + 2B)', status: 'reservado', usefulM2: 62, terraceM2: 8, priceUF: 2680, orientation: 'Nor-Poniente', parkingIncluded: 1, storageIncluded: 1, reservedBy: 'Carlos Morales (Reserva #884)', reservationDate: '04 Nov 2026' },
      { id: 'u-403', unitNumber: '403', floor: 4, typologyId: 'tipo-va-2', typologyName: 'Modelo Peñablanca (3D + 2B)', status: 'vendido', usefulM2: 84, terraceM2: 11, priceUF: 3450, orientation: 'Nor-Oriente', parkingIncluded: 2, storageIncluded: 1 },
      { id: 'u-404', unitNumber: '404', floor: 4, typologyId: 'tipo-va-2', typologyName: 'Modelo Peñablanca (3D + 2B)', status: 'disponible', usefulM2: 84, terraceM2: 11, priceUF: 3450, orientation: 'Sur-Oriente', parkingIncluded: 2, storageIncluded: 1 },
      // Piso 3
      { id: 'u-301', unitNumber: '301', floor: 3, typologyId: 'tipo-va-1', typologyName: 'Modelo Huanhualí (2D + 2B)', status: 'vendido', usefulM2: 62, terraceM2: 8, priceUF: 2650, orientation: 'Nor-Oriente', parkingIncluded: 1, storageIncluded: 1 },
      { id: 'u-302', unitNumber: '302', floor: 3, typologyId: 'tipo-va-1', typologyName: 'Modelo Huanhualí (2D + 2B)', status: 'disponible', usefulM2: 62, terraceM2: 8, priceUF: 2650, orientation: 'Nor-Poniente', parkingIncluded: 1, storageIncluded: 1 },
      { id: 'u-303', unitNumber: '303', floor: 3, typologyId: 'tipo-va-2', typologyName: 'Modelo Peñablanca (3D + 2B)', status: 'reservado', usefulM2: 84, terraceM2: 11, priceUF: 3400, orientation: 'Nor-Oriente', parkingIncluded: 2, storageIncluded: 1, reservedBy: 'Loreto Silva (Banco BCI)', reservationDate: '06 Nov 2026' },
      { id: 'u-304', unitNumber: '304', floor: 3, typologyId: 'tipo-va-2', typologyName: 'Modelo Peñablanca (3D + 2B)', status: 'disponible', usefulM2: 84, terraceM2: 11, priceUF: 3400, orientation: 'Sur-Oriente', parkingIncluded: 2, storageIncluded: 1 },
      // Piso 2
      { id: 'u-201', unitNumber: '201', floor: 2, typologyId: 'tipo-va-1', typologyName: 'Modelo Huanhualí (2D + 2B)', status: 'disponible', usefulM2: 62, terraceM2: 8, priceUF: 2620, orientation: 'Nor-Oriente', parkingIncluded: 1, storageIncluded: 1 },
      { id: 'u-202', unitNumber: '202', floor: 2, typologyId: 'tipo-va-1', typologyName: 'Modelo Huanhualí (2D + 2B)', status: 'disponible', usefulM2: 62, terraceM2: 8, priceUF: 2620, orientation: 'Nor-Poniente', parkingIncluded: 1, storageIncluded: 1 },
      { id: 'u-203', unitNumber: '203', floor: 2, typologyId: 'tipo-va-2', typologyName: 'Modelo Peñablanca (3D + 2B)', status: 'piloto', usefulM2: 84, terraceM2: 11, priceUF: 3380, orientation: 'Nor-Oriente', parkingIncluded: 2, storageIncluded: 1 },
      { id: 'u-204', unitNumber: '204', floor: 2, typologyId: 'tipo-va-2', typologyName: 'Modelo Peñablanca (3D + 2B)', status: 'vendido', usefulM2: 84, terraceM2: 11, priceUF: 3380, orientation: 'Sur-Oriente', parkingIncluded: 2, storageIncluded: 1 },
      // Piso 1
      { id: 'u-101', unitNumber: '101', floor: 1, typologyId: 'tipo-va-1', typologyName: 'Modelo Huanhualí (2D + 2B)', status: 'disponible', usefulM2: 62, terraceM2: 25, priceUF: 2750, orientation: 'Nor-Oriente', parkingIncluded: 1, storageIncluded: 1 },
      { id: 'u-102', unitNumber: '102', floor: 1, typologyId: 'tipo-va-1', typologyName: 'Modelo Huanhualí (2D + 2B)', status: 'disponible', usefulM2: 62, terraceM2: 25, priceUF: 2750, orientation: 'Nor-Poniente', parkingIncluded: 1, storageIncluded: 1 },
      { id: 'u-103', unitNumber: '103', floor: 1, typologyId: 'tipo-va-2', typologyName: 'Modelo Peñablanca (3D + 2B)', status: 'vendido', usefulM2: 84, terraceM2: 38, priceUF: 3550, orientation: 'Nor-Oriente', parkingIncluded: 2, storageIncluded: 1 },
      { id: 'u-104', unitNumber: '104', floor: 1, typologyId: 'tipo-va-2', typologyName: 'Modelo Peñablanca (3D + 2B)', status: 'vendido', usefulM2: 84, terraceM2: 38, priceUF: 3550, orientation: 'Sur-Oriente', parkingIncluded: 2, storageIncluded: 1 }
    ]
  },
  {
    id: 'proj-bosques-concon',
    name: 'Edificio Bosques de Montemar',
    developerName: 'Desarrollos Costa Brava',
    commune: 'Concón',
    address: 'Av. Concón Reñaca 4500',
    stage: 'En Blanco',
    deliveryDate: 'Marzo 2027',
    totalUnits: 48,
    floorsCount: 6,
    unitsPerFloor: 8,
    coverImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200',
    bonoPieActive: true,
    bonoPiePct: 12,
    discountPozoPct: 7,
    publishedOnMelsa: true,
    typologies: [
      {
        id: 'tipo-cc-1',
        name: 'Studio Costero (1D + 1B)',
        bedrooms: 1,
        bathrooms: 1,
        usefulM2: 44,
        totalM2: 52,
        priceFromUF: 3200,
        description: 'Ideal inversionistas con alta tasa de arriendo temporal o año corrido.',
        pilotPhotos: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800'],
        floorPlanUrl: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=800',
        features: ['Vista despejada', 'Termopanel acústico', 'Gimnasio y piscina']
      }
    ],
    units: [
      { id: 'u-c601', unitNumber: '601', floor: 6, typologyId: 'tipo-cc-1', typologyName: 'Studio Costero (1D + 1B)', status: 'disponible', usefulM2: 44, terraceM2: 8, priceUF: 3250, orientation: 'Nor-Oriente', parkingIncluded: 1, storageIncluded: 1 },
      { id: 'u-c602', unitNumber: '602', floor: 6, typologyId: 'tipo-cc-1', typologyName: 'Studio Costero (1D + 1B)', status: 'disponible', usefulM2: 44, terraceM2: 8, priceUF: 3250, orientation: 'Nor-Poniente', parkingIncluded: 1, storageIncluded: 1 },
      { id: 'u-c501', unitNumber: '501', floor: 5, typologyId: 'tipo-cc-1', typologyName: 'Studio Costero (1D + 1B)', status: 'reservado', usefulM2: 44, terraceM2: 8, priceUF: 3200, orientation: 'Nor-Oriente', parkingIncluded: 1, storageIncluded: 1, reservedBy: 'Inversiones Valpo SpA' },
      { id: 'u-c502', unitNumber: '502', floor: 5, typologyId: 'tipo-cc-1', typologyName: 'Studio Costero (1D + 1B)', status: 'vendido', usefulM2: 44, terraceM2: 8, priceUF: 3200, orientation: 'Nor-Poniente', parkingIncluded: 1, storageIncluded: 1 }
    ]
  }
];

export const AgencyDevelopmentsHub: React.FC = () => {
  const [projects, setProjects] = useState<DevelopmentProject[]>(INITIAL_PROJECTS);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(INITIAL_PROJECTS[0].id);
  const [activeSubTab, setActiveSubTab] = useState<'stacking' | 'typologies' | 'offers' | 'quoter'>('stacking');
  
  // Selected Unit for details modal or quotation
  const [selectedUnit, setSelectedUnit] = useState<StackingUnit | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'disponible' | 'reservado' | 'vendido'>('all');

  // Quotation parameters
  const [quotePiePercent, setQuotePiePercent] = useState<number>(15);
  const [quoteInstallments, setQuoteInstallments] = useState<number>(24);
  const [quoteInterestRate, setQuoteInterestRate] = useState<number>(4.8);
  const [quoteYears, setQuoteYears] = useState<number>(25);
  const [quoteClientName, setQuoteClientName] = useState<string>('');
  const [quoteClientPhone, setQuoteClientPhone] = useState<string>('');
  const [quoteClientEmail, setQuoteClientEmail] = useState<string>('');
  const [quoteSuccessMsg, setQuoteSuccessMsg] = useState(false);

  // New Project Form Modal
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [newProjName, setNewProjName] = useState('');
  const [newProjCommune, setNewProjCommune] = useState('Villa Alemana');
  const [newProjAddress, setNewProjAddress] = useState('');
  const [newProjStage, setNewProjStage] = useState<'En Blanco' | 'En Verde' | 'Entrega Inmediata'>('En Verde');
  const [newProjFloors, setNewProjFloors] = useState<number>(5);
  const [newProjUnitsPerFloor, setNewProjUnitsPerFloor] = useState<number>(4);

  const activeProject = projects.find(p => p.id === selectedProjectId) || projects[0];

  // Stats
  const totalUnitsCount = activeProject.units.length;
  const availableUnits = activeProject.units.filter(u => u.status === 'disponible');
  const reservedUnits = activeProject.units.filter(u => u.status === 'reservado');
  const soldUnits = activeProject.units.filter(u => u.status === 'vendido');
  const percentSold = totalUnitsCount > 0 ? Math.round(((soldUnits.length + reservedUnits.length) / totalUnitsCount) * 100) : 0;

  // Change Unit Status
  const handleUpdateUnitStatus = (unitId: string, newStatus: StackingUnit['status'], clientName?: string) => {
    setProjects(prev => prev.map(proj => {
      if (proj.id !== activeProject.id) return proj;
      return {
        ...proj,
        units: proj.units.map(u => {
          if (u.id !== unitId) return u;
          return {
            ...u,
            status: newStatus,
            reservedBy: newStatus === 'reservado' ? (clientName || 'Cliente en proceso') : undefined,
            reservationDate: newStatus === 'reservado' ? new Date().toLocaleDateString('es-CL') : undefined
          };
        })
      };
    }));

    if (selectedUnit && selectedUnit.id === unitId) {
      setSelectedUnit(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  // Toggle Bono Pie
  const handleToggleBonoPie = () => {
    setProjects(prev => prev.map(proj => {
      if (proj.id !== activeProject.id) return proj;
      return { ...proj, bonoPieActive: !proj.bonoPieActive };
    }));
  };

  // Toggle Vitrina Publicada
  const handleTogglePublished = () => {
    setProjects(prev => prev.map(proj => {
      if (proj.id !== activeProject.id) return proj;
      return { ...proj, publishedOnMelsa: !proj.publishedOnMelsa };
    }));
  };

  // Create Project
  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjName.trim()) return;

    const newUnits: StackingUnit[] = [];
    for (let f = newProjFloors; f >= 1; f--) {
      for (let u = 1; u <= newProjUnitsPerFloor; u++) {
        const uNum = `${f}0${u}`;
        newUnits.push({
          id: `u-${Date.now()}-${f}-${u}`,
          unitNumber: uNum,
          floor: f,
          typologyId: 't-default',
          typologyName: 'Tipología Estándar (2D + 2B)',
          status: 'disponible',
          usefulM2: 65,
          terraceM2: 8,
          priceUF: 2800 + (f * 30),
          orientation: 'Nor-Oriente',
          parkingIncluded: 1,
          storageIncluded: 1
        });
      }
    }

    const newProject: DevelopmentProject = {
      id: `proj-${Date.now()}`,
      name: newProjName,
      developerName: 'Inmobiliaria Registrada',
      commune: newProjCommune,
      address: newProjAddress || 'Sector Residencial',
      stage: newProjStage,
      deliveryDate: 'Diciembre 2026',
      totalUnits: newProjFloors * newProjUnitsPerFloor,
      floorsCount: newProjFloors,
      unitsPerFloor: newProjUnitsPerFloor,
      coverImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1200',
      bonoPieActive: true,
      bonoPiePct: 10,
      discountPozoPct: 5,
      publishedOnMelsa: false,
      typologies: [
        {
          id: 't-default',
          name: 'Modelo Estándar (2D + 2B)',
          bedrooms: 2,
          bathrooms: 2,
          usefulM2: 65,
          totalM2: 73,
          priceFromUF: 2800,
          description: 'Distribución contemporánea con finas terminaciones.',
          pilotPhotos: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=800'],
          floorPlanUrl: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=800',
          features: ['Ventanas termopanel', 'Cubierta granito', 'Estacionamiento']
        }
      ],
      units: newUnits
    };

    setProjects(prev => [newProject, ...prev]);
    setSelectedProjectId(newProject.id);
    setIsNewProjectModalOpen(false);
    setNewProjName('');
  };

  // Quotation Calculations
  const quotedUnit = selectedUnit || availableUnits[0] || activeProject.units[0];
  const unitPriceUF = quotedUnit ? quotedUnit.priceUF : 2800;
  const bonoPieUF = activeProject.bonoPieActive ? Math.round(unitPriceUF * (activeProject.bonoPiePct / 100)) : 0;
  const netPriceUF = unitPriceUF - bonoPieUF;

  // Pie efectivo
  const pieEffectiveUF = Math.round(unitPriceUF * (quotePiePercent / 100));
  const reservationAmountCLP = 300000;
  const reservationUF = Math.round(reservationAmountCLP / UF_CURRENT_CLP);
  const pieBalanceUF = Math.max(0, pieEffectiveUF - reservationUF);
  const monthlyInstallmentUF = quoteInstallments > 0 ? (pieBalanceUF / quoteInstallments) : 0;
  const monthlyInstallmentCLP = Math.round(monthlyInstallmentUF * UF_CURRENT_CLP);

  // Hipotecario
  const loanUF = unitPriceUF - bonoPieUF - pieEffectiveUF;
  const monthlyRate = (quoteInterestRate / 100) / 12;
  const totalMonths = quoteYears * 12;
  const dividendUF = monthlyRate > 0 && totalMonths > 0
    ? (loanUF * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths))) / (Math.pow(1 + monthlyRate, totalMonths) - 1)
    : 0;
  const dividendCLP = Math.round(dividendUF * UF_CURRENT_CLP);
  const requiredIncomeCLP = Math.round(dividendCLP / 0.25); // Dividendo máx 25% del sueldo

  // Group units by floor descending (Top floor down to 1st)
  const floorNumbers = Array.from(new Set(activeProject.units.map(u => u.floor))).sort((a, b) => b - a);

  // Send quote via WhatsApp
  const handleSendQuoteWhatsApp = () => {
    if (!quotedUnit) return;
    const text = `🏢 *COTIZACIÓN OFICIAL — ${activeProject.name.toUpperCase()}*
📍 Ubicación: ${activeProject.address}, ${activeProject.commune}
🔑 *Unidad ${quotedUnit.unitNumber}* (Piso ${quotedUnit.floor}) — ${quotedUnit.typologyName}
📐 Superficie: ${quotedUnit.usefulM2} m² útiles + ${quotedUnit.terraceM2} m² terraza

💰 *Condiciones Financieras de Venta:*
• Valor de Lista: ${unitPriceUF.toLocaleString('es-CL')} UF ($${(unitPriceUF * UF_CURRENT_CLP).toLocaleString('es-CL')} CLP)
${activeProject.bonoPieActive ? `• *Bono Pie Especial (${activeProject.bonoPiePct}%):* -${bonoPieUF.toLocaleString('es-CL')} UF` : ''}
• Reserva Inicial: $${reservationAmountCLP.toLocaleString('es-CL')} CLP
• Pie Efectivo (${quotePiePercent}%): ${pieEffectiveUF.toLocaleString('es-CL')} UF pagadero en *${quoteInstallments} cuotas sin interés* de:
  👉 *$${monthlyInstallmentCLP.toLocaleString('es-CL')} CLP/mes* (${monthlyInstallmentUF.toFixed(2)} UF)

🏦 *Crédito Hipotecario Proyectado:*
• Saldo financiado: ${loanUF.toLocaleString('es-CL')} UF a ${quoteYears} años
• Dividendo mensual estimado: *$${dividendCLP.toLocaleString('es-CL')} CLP/mes*
• Renta líquida familiar sugerida: $${requiredIncomeCLP.toLocaleString('es-CL')} CLP

Emitido por: ${activeProject.developerName} vía MELSA Agency OS.`;

    const phone = quoteClientPhone.replace(/\D/g, '') || '56999899421';
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
    setQuoteSuccessMsg(true);
    setTimeout(() => setQuoteSuccessMsg(false), 4000);
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Header Bar: Selector de Proyectos & Acciones Rápidas */}
      <div className="bg-white rounded-3xl border border-gray-200/90 p-5 sm:p-6 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#D02126]/10 text-[#D02126] border border-[#D02126]/20 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5" />
              <span>Hub de Desarrollos & Masterplan</span>
            </span>
            <span className="text-xs text-gray-500">• Gestión Inmobiliaria Centralizada</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F1115] tracking-tight">
            Administrador de Proyectos & Edificios
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Control de Stacking Plan interactivo por pisos, catálogo de tipologías, fotos de piloto, promociones de Bono Pie y cotizador de cuotas.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Project Selector */}
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="bg-[#FAF9F8] border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-[#0F1115] font-bold outline-none focus:border-[#D02126] shadow-2xs"
          >
            {projects.map(proj => (
              <option key={proj.id} value={proj.id}>
                🏢 {proj.name} ({proj.commune}) — {proj.stage}
              </option>
            ))}
          </select>

          <button
            onClick={() => setIsNewProjectModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#D02126] hover:bg-[#b01b20] text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Proyecto</span>
          </button>
        </div>
      </div>

      {/* 2. Project Executive Overview Banner */}
      <div className="bg-gradient-to-r from-[#0F1115] via-[#1A1D23] to-[#0F1115] rounded-3xl text-white p-6 shadow-xl border border-white/10 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold">
                ● {activeProject.stage}
              </span>
              <span className="text-xs text-gray-300 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#D02126]" />
                {activeProject.address}, {activeProject.commune}
              </span>
              <span className="text-xs text-gray-400">• Entrega: {activeProject.deliveryDate}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {activeProject.name}
            </h2>
            <p className="text-xs text-gray-300">
              Desarrollado por: <strong className="text-white">{activeProject.developerName}</strong> • {activeProject.floorsCount} pisos • {totalUnitsCount} unidades totales
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
              <span className="block text-[10px] text-gray-400 font-bold uppercase">Disponibles</span>
              <span className="text-xl font-extrabold text-emerald-400">{availableUnits.length}</span>
              <span className="block text-[9px] text-gray-400">para venta</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
              <span className="block text-[10px] text-gray-400 font-bold uppercase">Reservadas</span>
              <span className="text-xl font-extrabold text-amber-400">{reservedUnits.length}</span>
              <span className="block text-[9px] text-gray-400">en cierre</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
              <span className="block text-[10px] text-gray-400 font-bold uppercase">Vendidas</span>
              <span className="text-xl font-extrabold text-rose-400">{soldUnits.length}</span>
              <span className="block text-[9px] text-gray-400">promesadas</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
              <span className="block text-[10px] text-gray-400 font-bold uppercase">Avance Comercial</span>
              <span className="text-xl font-extrabold text-white">{percentSold}%</span>
              <span className="block text-[9px] text-emerald-400 font-bold">colocación</span>
            </div>
          </div>
        </div>

        {/* Vitrina & Promo Controls */}
        <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4">
            <button
              onClick={handleTogglePublished}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                activeProject.publishedOnMelsa
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-white/5 text-gray-400 border-white/10'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{activeProject.publishedOnMelsa ? '✓ Publicado en Vitrina Melsa' : 'Borrador (Oculto)'}</span>
            </button>

            <button
              onClick={handleToggleBonoPie}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                activeProject.bonoPieActive
                  ? 'bg-[#D02126]/20 text-[#ff6b6e] border-[#D02126]/40'
                  : 'bg-white/5 text-gray-400 border-white/10'
              }`}
            >
              <Tag className="w-3.5 h-3.5" />
              <span>Bono Pie {activeProject.bonoPiePct}%: {activeProject.bonoPieActive ? 'Activo' : 'Desactivado'}</span>
            </button>
          </div>

          <div className="text-[11px] text-gray-400">
            Valor UF Referencial: <strong className="text-white">${UF_CURRENT_CLP.toLocaleString('es-CL')} CLP</strong>
          </div>
        </div>
      </div>

      {/* 3. Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2 overflow-x-auto text-xs">
        <button
          onClick={() => setActiveSubTab('stacking')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
            activeSubTab === 'stacking'
              ? 'bg-[#0F1115] text-white shadow-sm'
              : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <Layers className="w-4 h-4 text-[#D02126]" />
          <span>Stacking Plan (Pisos & Unidades)</span>
          <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full">{totalUnitsCount}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('typologies')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
            activeSubTab === 'typologies'
              ? 'bg-[#0F1115] text-white shadow-sm'
              : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <Building2 className="w-4 h-4 text-[#D02126]" />
          <span>Tipologías & Fotos Piloto</span>
          <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full">{activeProject.typologies.length}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('quoter')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
            activeSubTab === 'quoter'
              ? 'bg-[#0F1115] text-white shadow-sm'
              : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <Calculator className="w-4 h-4 text-[#D02126]" />
          <span>Cotizador Financiero & Plan Cuotas Pie</span>
        </button>

        <button
          onClick={() => setActiveSubTab('offers')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
            activeSubTab === 'offers'
              ? 'bg-[#0F1115] text-white shadow-sm'
              : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <Percent className="w-4 h-4 text-[#D02126]" />
          <span>Promociones & Bono Pie</span>
        </button>
      </div>

      {/* 4. SUB-TAB 1: STACKING PLAN INTERACTIVO */}
      {activeSubTab === 'stacking' && (
        <div className="space-y-4">
          
          {/* Legend and Filter Controls */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-bold text-gray-700">Estado de Unidades:</span>
              <span className="flex items-center gap-1.5 text-gray-600">
                <span className="w-3 h-3 rounded-md bg-emerald-500 inline-block" />
                <span>Disponible ({availableUnits.length})</span>
              </span>
              <span className="flex items-center gap-1.5 text-gray-600">
                <span className="w-3 h-3 rounded-md bg-amber-400 inline-block" />
                <span>Reservado ({reservedUnits.length})</span>
              </span>
              <span className="flex items-center gap-1.5 text-gray-600">
                <span className="w-3 h-3 rounded-md bg-rose-500 inline-block" />
                <span>Vendido / Promesado ({soldUnits.length})</span>
              </span>
              <span className="flex items-center gap-1.5 text-gray-600">
                <span className="w-3 h-3 rounded-md bg-purple-500 inline-block" />
                <span>Depto Piloto</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="bg-[#FAF9F8] border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-700 outline-none"
              >
                <option value="all">Ver todas las unidades</option>
                <option value="disponible">Solo Disponibles</option>
                <option value="reservado">Solo Reservadas</option>
                <option value="vendido">Solo Vendidas</option>
              </select>
            </div>
          </div>

          {/* Stacking Grid by Floor */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm space-y-6">
            <div className="space-y-4">
              {floorNumbers.map(floorNum => {
                const floorUnits = activeProject.units.filter(u => u.floor === floorNum);
                const visibleUnits = floorUnits.filter(u => filterStatus === 'all' || u.status === filterStatus);

                return (
                  <div key={floorNum} className="flex flex-col sm:flex-row sm:items-center gap-3 pb-4 border-b border-gray-100 last:border-b-0">
                    {/* Floor Label */}
                    <div className="w-24 shrink-0 font-extrabold text-xs text-gray-500 flex items-center gap-1">
                      <span className="px-2 py-1 rounded-lg bg-gray-100 text-gray-700">Piso {floorNum}</span>
                    </div>

                    {/* Units Row */}
                    <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
                      {visibleUnits.map(unit => {
                        const isSelected = selectedUnit?.id === unit.id;
                        let badgeColor = 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:border-emerald-500';
                        if (unit.status === 'reservado') badgeColor = 'bg-amber-50 border-amber-200 text-amber-800 hover:border-amber-500';
                        if (unit.status === 'vendido') badgeColor = 'bg-rose-50 border-rose-200 text-rose-800 opacity-75';
                        if (unit.status === 'piloto') badgeColor = 'bg-purple-50 border-purple-200 text-purple-800';

                        return (
                          <button
                            key={unit.id}
                            onClick={() => setSelectedUnit(unit)}
                            className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer relative ${badgeColor} ${
                              isSelected ? 'ring-2 ring-[#D02126] shadow-md' : 'shadow-2xs'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-extrabold text-sm text-[#0F1115]">#{unit.unitNumber}</span>
                              <span className={`w-2 h-2 rounded-full ${
                                unit.status === 'disponible' ? 'bg-emerald-500' :
                                unit.status === 'reservado' ? 'bg-amber-500' :
                                unit.status === 'vendido' ? 'bg-rose-500' : 'bg-purple-500'
                              }`} />
                            </div>

                            <div className="text-[10px] text-gray-500 truncate">{unit.typologyName.split(' ')[0]}</div>
                            <div className="font-extrabold text-xs text-[#0F1115] mt-1">{unit.priceUF.toLocaleString('es-CL')} UF</div>
                            <div className="text-[9px] text-gray-400 mt-0.5">{unit.usefulM2} m² • {unit.orientation}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Unit Quick Inspector / Action Drawer */}
          {selectedUnit && (
            <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#D02126]/10 text-[#D02126] flex items-center justify-center font-extrabold text-base">
                    #{selectedUnit.unitNumber}
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-[#0F1115]">
                      Ficha de Unidad {selectedUnit.unitNumber} (Piso {selectedUnit.floor})
                    </h3>
                    <p className="text-xs text-gray-500">
                      {selectedUnit.typologyName} • {selectedUnit.usefulM2} m² útiles + {selectedUnit.terraceM2} m² terraza • Orientación {selectedUnit.orientation}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setActiveSubTab('quoter');
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#0F1115] text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Calculator className="w-3.5 h-3.5 text-[#D02126]" />
                    <span>Cotizar Cuotas de Pie</span>
                  </button>

                  <button
                    onClick={() => setSelectedUnit(null)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Status and Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200/80">
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Precio Lista</span>
                  <span className="text-base font-extrabold text-[#0F1115]">{selectedUnit.priceUF.toLocaleString('es-CL')} UF</span>
                  <span className="text-[10px] text-gray-500 block">${(selectedUnit.priceUF * UF_CURRENT_CLP).toLocaleString('es-CL')} CLP</span>
                </div>

                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200/80">
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Estacionamientos & Bodega</span>
                  <span className="text-sm font-bold text-[#0F1115]">{selectedUnit.parkingIncluded} Estac. / {selectedUnit.storageIncluded} Bodega</span>
                  <span className="text-[10px] text-emerald-600 font-semibold block">Incluidos en precio</span>
                </div>

                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200/80">
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Estado Actual</span>
                  <span className={`inline-block mt-0.5 px-2 py-0.5 rounded-full text-[11px] font-bold ${
                    selectedUnit.status === 'disponible' ? 'bg-emerald-100 text-emerald-800' :
                    selectedUnit.status === 'reservado' ? 'bg-amber-100 text-amber-800' :
                    selectedUnit.status === 'vendido' ? 'bg-rose-100 text-rose-800' : 'bg-purple-100 text-purple-800'
                  }`}>
                    ● {selectedUnit.status.toUpperCase()}
                  </span>
                  {selectedUnit.reservedBy && (
                    <span className="text-[10px] text-gray-500 block mt-1 truncate">{selectedUnit.reservedBy}</span>
                  )}
                </div>

                {/* Change State Controls */}
                <div className="flex flex-col justify-center gap-1.5">
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Cambiar Estado</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleUpdateUnitStatus(selectedUnit.id, 'disponible')}
                      className="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[10px] border border-emerald-200"
                    >
                      Disponible
                    </button>
                    <button
                      onClick={() => handleUpdateUnitStatus(selectedUnit.id, 'reservado', 'Reserva Corredor')}
                      className="px-2 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold text-[10px] border border-amber-200"
                    >
                      Reservar
                    </button>
                    <button
                      onClick={() => handleUpdateUnitStatus(selectedUnit.id, 'vendido')}
                      className="px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[10px] border border-rose-200"
                    >
                      Vendido
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* 5. SUB-TAB 2: TIPOLOGÍAS & FOTOS PILOTO */}
      {activeSubTab === 'typologies' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeProject.typologies.map(tipo => (
              <div key={tipo.id} className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm flex flex-col justify-between">
                <div>
                  {/* Photo Gallery Carousel / Cover */}
                  <div className="relative h-56 bg-gray-100 overflow-hidden">
                    <img
                      src={tipo.pilotPhotos[0]}
                      alt={tipo.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-[#0F1115]/80 backdrop-blur-md px-3 py-1 rounded-xl text-white text-xs font-bold">
                      📸 Fotos del Depto Piloto
                    </div>
                    <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-xl text-[#0F1115] text-xs font-extrabold shadow-sm">
                      Desde {tipo.priceFromUF.toLocaleString('es-CL')} UF
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-6 space-y-4 text-xs">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-extrabold text-[#0F1115]">
                        {tipo.name}
                      </h3>
                      <span className="text-xs text-gray-500 font-bold">
                        {tipo.bedrooms}D / {tipo.bathrooms}B
                      </span>
                    </div>

                    <p className="text-gray-600 leading-relaxed">
                      {tipo.description}
                    </p>

                    <div className="grid grid-cols-2 gap-2 text-xs bg-gray-50 p-3 rounded-2xl border border-gray-200/80">
                      <div>
                        <span className="text-gray-400 block text-[10px] uppercase font-bold">Superficie Útil</span>
                        <span className="font-extrabold text-[#0F1115]">{tipo.usefulM2} m²</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[10px] uppercase font-bold">Superficie Total</span>
                        <span className="font-extrabold text-[#0F1115]">{tipo.totalM2} m²</span>
                      </div>
                    </div>

                    {/* Features checklist */}
                    <div className="space-y-1.5 pt-2">
                      <span className="text-[10px] uppercase font-bold text-gray-400">Terminaciones & Equipamiento:</span>
                      <div className="grid grid-cols-2 gap-1.5">
                        {tipo.features.map((feat, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 text-gray-600 text-[11px]">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span className="truncate">{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                  <a
                    href={tipo.floorPlanUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-700 hover:text-[#D02126]"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#D02126]" />
                    <span>Ver Plano Arquitectura</span>
                  </a>

                  <button
                    onClick={() => {
                      const matchedUnit = activeProject.units.find(u => u.typologyId === tipo.id && u.status === 'disponible');
                      if (matchedUnit) setSelectedUnit(matchedUnit);
                      setActiveSubTab('quoter');
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#0F1115] text-white text-xs font-bold hover:bg-[#D02126] transition-colors cursor-pointer"
                  >
                    <Calculator className="w-3.5 h-3.5" />
                    <span>Simular Cuotas</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. SUB-TAB 3: COTIZADOR FINANCIERO & CUOTAS DE PIE */}
      {activeSubTab === 'quoter' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Form: Parámetros del Comprador & Crédito */}
          <div className="lg:col-span-6 bg-white rounded-3xl border border-gray-200 p-6 sm:p-7 shadow-sm space-y-6 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-extrabold text-[#0F1115]">
                  Parámetros de Financiamiento en Blanco / Verde
                </h3>
                <p className="text-gray-500 text-xs mt-0.5">
                  Calcula el saldo del pie dividido en cuotas mensuales y el dividendo hipotecario proyectado.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-xl bg-rose-50 text-[#D02126] font-bold text-xs border border-rose-200/80">
                Unidad #{quotedUnit?.unitNumber || '401'}
              </span>
            </div>

            {/* Selector de Unidad a Cotizar */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider">
                Seleccionar Unidad a Cotizar
              </label>
              <select
                value={quotedUnit?.id}
                onChange={(e) => {
                  const u = activeProject.units.find(item => item.id === e.target.value);
                  if (u) setSelectedUnit(u);
                }}
                className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-[#0F1115] font-semibold outline-none focus:border-[#D02126]"
              >
                {activeProject.units.map(u => (
                  <option key={u.id} value={u.id}>
                    #{u.unitNumber} (Piso {u.floor}) — {u.typologyName} — {u.priceUF.toLocaleString('es-CL')} UF ({u.status})
                  </option>
                ))}
              </select>
            </div>

            {/* Slider de Pie % */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">
                  Porcentaje de Pie a Pagar
                </label>
                <span className="font-extrabold text-[#D02126] text-sm">{quotePiePercent}% del valor</span>
              </div>
              <input
                type="range"
                min="10"
                max="30"
                step="5"
                value={quotePiePercent}
                onChange={(e) => setQuotePiePercent(Number(e.target.value))}
                className="w-full accent-[#D02126] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-400 font-semibold">
                <span>10% (Con Bono Pie)</span>
                <span>15% (Recomendado)</span>
                <span>20% (Estándar Banco)</span>
                <span>30%</span>
              </div>
            </div>

            {/* Cuotas de Pie */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">
                  Plazo de Entrega (Cuotas de Pie sin Interés)
                </label>
                <span className="font-extrabold text-[#0F1115] text-sm">{quoteInstallments} Cuotas mensuales</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[12, 18, 24, 36].map(months => (
                  <button
                    key={months}
                    type="button"
                    onClick={() => setQuoteInstallments(months)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      quoteInstallments === months
                        ? 'bg-[#0F1115] text-white border-[#0F1115]'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {months} meses
                  </button>
                ))}
              </div>
            </div>

            {/* Parámetros Crédito Hipotecario */}
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Tasa Hipotecaria Estimada (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={quoteInterestRate}
                  onChange={(e) => setQuoteInterestRate(Number(e.target.value))}
                  className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-[#D02126]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Plazo Crédito Hipotecario
                </label>
                <select
                  value={quoteYears}
                  onChange={(e) => setQuoteYears(Number(e.target.value))}
                  className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-[#D02126]"
                >
                  <option value={20}>20 Años</option>
                  <option value={25}>25 Años</option>
                  <option value={30}>30 Años</option>
                </select>
              </div>
            </div>

            {/* Datos del Cliente para Ficha */}
            <div className="space-y-3 pt-2 border-t border-gray-100">
              <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block">
                Datos del Prospecto / Comprador:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Nombre y Apellidos"
                  value={quoteClientName}
                  onChange={(e) => setQuoteClientName(e.target.value)}
                  className="bg-[#FAF9F8] border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none"
                />
                <input
                  type="text"
                  placeholder="WhatsApp (+56 9 ...)"
                  value={quoteClientPhone}
                  onChange={(e) => setQuoteClientPhone(e.target.value)}
                  className="bg-[#FAF9F8] border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none"
                />
              </div>
            </div>

          </div>

          {/* Right Card: Hoja de Resumen de Cotización */}
          <div className="lg:col-span-6 bg-gradient-to-br from-[#0F1115] to-[#1A1D23] rounded-3xl text-white p-6 sm:p-8 shadow-xl border border-white/10 space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Simulación Comercial Oficial</span>
                <h3 className="text-xl font-extrabold text-white">
                  Hoja de Liquidación de Venta
                </h3>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#D02126] text-white">
                MELSA Sales Engine
              </span>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                <span className="text-gray-400">Valor de Lista (Unidad #{quotedUnit?.unitNumber}):</span>
                <span className="font-extrabold text-white text-sm">{unitPriceUF.toLocaleString('es-CL')} UF (${(unitPriceUF * UF_CURRENT_CLP).toLocaleString('es-CL')} CLP)</span>
              </div>

              {activeProject.bonoPieActive && (
                <div className="flex justify-between items-center py-1.5 border-b border-white/5 text-emerald-400">
                  <span>★ Bono Pie Inmobiliario ({activeProject.bonoPiePct}%):</span>
                  <span className="font-bold">-{bonoPieUF.toLocaleString('es-CL')} UF</span>
                </div>
              )}

              <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                <span className="text-gray-400">Monto de Reserva:</span>
                <span className="font-bold text-white">${reservationAmountCLP.toLocaleString('es-CL')} CLP (~{reservationUF} UF)</span>
              </div>

              {/* Cuota Mensual Destacada */}
              <div className="p-4 rounded-2xl bg-white/5 border border-[#D02126]/30 text-center space-y-1">
                <span className="text-[11px] font-bold text-gray-300 uppercase tracking-wider block">
                  Pie en {quoteInstallments} Cuotas Mensuales Sin Interés
                </span>
                <div className="text-3xl font-extrabold text-[#ff6b6e] tracking-tight">
                  ${monthlyInstallmentCLP.toLocaleString('es-CL')} CLP/mes
                </div>
                <span className="text-xs text-gray-400 font-mono">
                  ({monthlyInstallmentUF.toFixed(2)} UF/mes durante la construcción)
                </span>
              </div>

              {/* Crédito Hipotecario Proyectado */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-300">Crédito Hipotecario al Recibir:</span>
                  <span className="font-bold text-white">{loanUF.toLocaleString('es-CL')} UF</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-300">Dividendo Estimado ({quoteYears} años al {quoteInterestRate}%):</span>
                  <span className="font-extrabold text-emerald-400 text-sm">${dividendCLP.toLocaleString('es-CL')} CLP</span>
                </div>
                <div className="flex justify-between text-xs pt-1 border-t border-white/10 text-[11px]">
                  <span className="text-gray-400">Renta Familiar Mínima Sugerida:</span>
                  <span className="text-gray-200 font-semibold">${requiredIncomeCLP.toLocaleString('es-CL')} CLP</span>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handleSendQuoteWhatsApp}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-md cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>Enviar Cotización Formal por WhatsApp al Cliente</span>
              </button>

              {quoteSuccessMsg && (
                <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs text-center border border-emerald-500/30">
                  ✓ Cotización preparada y enviada correctamente.
                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {/* 7. SUB-TAB 4: MOTOR DE OFERTAS & BONO PIE */}
      {activeSubTab === 'offers' && (
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h3 className="text-lg font-extrabold text-[#0F1115]">
              Gestión de Campañas Comerciales & Bono Pie
            </h3>
            <p className="text-xs text-gray-500">
              Configura descuentos dinámicos y condiciones de pie que se reflejan de inmediato en todas las cotizaciones de tu equipo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Card 1: Bono Pie */}
            <div className="p-5 rounded-2xl border border-gray-200 bg-[#FAF9F8] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#D02126]" />
                  <h4 className="font-extrabold text-sm text-[#0F1115]">Bono Pie Inmobiliario</h4>
                </div>
                <button
                  onClick={handleToggleBonoPie}
                  className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-colors ${
                    activeProject.bonoPieActive ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {activeProject.bonoPieActive ? 'Activo' : 'Pausado'}
                </button>
              </div>

              <p className="text-gray-600 text-xs">
                La inmobiliaria subsidia un porcentaje del pie para que el cliente califique al crédito con un 90% o menor exigencia de ahorro previo.
              </p>

              <div className="flex items-center gap-3">
                <span className="font-bold text-gray-700">Porcentaje de Bono:</span>
                <span className="text-base font-extrabold text-[#D02126]">{activeProject.bonoPiePct}% del valor de lista</span>
              </div>
            </div>

            {/* Card 2: Descuento Pozo */}
            <div className="p-5 rounded-2xl border border-gray-200 bg-[#FAF9F8] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Percent className="w-4 h-4 text-[#D02126]" />
                  <h4 className="font-extrabold text-sm text-[#0F1115]">Descuento Lanzamiento en Pozo</h4>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  Vigente hasta fin de mes
                </span>
              </div>

              <p className="text-gray-600 text-xs">
                Descuento directo al valor de lista para las primeras 10 promesas en etapa Blanco / Verde.
              </p>

              <div className="flex items-center gap-3">
                <span className="font-bold text-gray-700">Descuento aplicado:</span>
                <span className="text-base font-extrabold text-emerald-700">{activeProject.discountPozoPct}% OFF</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8. Modal: Crear Nuevo Proyecto */}
      {isNewProjectModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#D02126]" />
                <h3 className="text-lg font-extrabold text-[#0F1115]">
                  Crear Nuevo Proyecto / Edificio
                </h3>
              </div>
              <button
                onClick={() => setIsNewProjectModalOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Nombre del Proyecto</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Condominio Alturas de Peñablanca"
                  value={newProjName}
                  onChange={(e) => setNewProjName(e.target.value)}
                  className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#D02126]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Comuna</label>
                  <select
                    value={newProjCommune}
                    onChange={(e) => setNewProjCommune(e.target.value)}
                    className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-[#D02126]"
                  >
                    <option value="Villa Alemana">Villa Alemana</option>
                    <option value="Quilpué">Quilpué</option>
                    <option value="Viña del Mar">Viña del Mar</option>
                    <option value="Concón">Concón</option>
                    <option value="Las Condes">Las Condes</option>
                    <option value="Providencia">Providencia</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Etapa de Venta</label>
                  <select
                    value={newProjStage}
                    onChange={(e) => setNewProjStage(e.target.value as any)}
                    className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-[#D02126]"
                  >
                    <option value="En Blanco">En Blanco</option>
                    <option value="En Verde">En Verde</option>
                    <option value="Entrega Inmediata">Entrega Inmediata</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Cantidad de Pisos</label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={newProjFloors}
                    onChange={(e) => setNewProjFloors(Number(e.target.value))}
                    className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-[#D02126]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Unidades por Piso</label>
                  <input
                    type="number"
                    min="1"
                    max="15"
                    value={newProjUnitsPerFloor}
                    onChange={(e) => setNewProjUnitsPerFloor(Number(e.target.value))}
                    className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-[#D02126]"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewProjectModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#D02126] text-white font-bold hover:bg-[#b01b20]"
                >
                  Generar Stacking Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
