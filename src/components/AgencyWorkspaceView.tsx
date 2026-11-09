import React, { useState } from 'react';
import { 
  LayoutDashboard,
  Home,
  Building2, 
  Calendar, 
  Users, 
  FileText, 
  Receipt, 
  CreditCard, 
  FileSpreadsheet, 
  Layers, 
  Wrench, 
  UserPlus, 
  Sparkles,
  Plus, 
  ArrowUpRight, 
  ArrowRight, 
  ExternalLink, 
  Clock, 
  Check, 
  CheckCircle2, 
  AlertCircle, 
  Phone, 
  MessageCircle, 
  Download, 
  TrendingUp, 
  LogOut, 
  Settings, 
  Bell, 
  Trash2, 
  Filter, 
  UploadCloud,
  ChevronRight,
  ShieldCheck,
  Search,
  X,
  Zap,
  ArrowLeft
} from 'lucide-react';
import { 
  AuthUser, 
  AgencyRentalContract, 
  AgencyMaintenanceTicket, 
  AgencySalePipeline, 
  AgencyPlanTier, 
  AgencySaaSPlan,
  AgencyOnboardingData 
} from '../types';
import { 
  MOCK_AGENCY_CONTRACTS, 
  MOCK_AGENCY_TICKETS, 
  MOCK_AGENCY_SALES, 
  AGENCY_SAAS_PLANS 
} from '../data/mockData';
import { MelsaLogo } from './MelsaLogo';
import { PropertyPhotoUploader } from './PropertyPhotoUploader';

interface AgencyWorkspaceViewProps {
  currentUser: AuthUser;
  onBackToHome?: () => void;
  onLogout?: () => void;
  onOpenOnboarding?: () => void;
  isAdmin?: boolean;
  onToggleAdminView?: () => void;
}

export interface AgencyPropertyItem {
  id: string;
  title: string;
  address: string;
  commune: string;
  type: 'Depto' | 'Casa' | 'Oficina';
  bedrooms: number;
  bathrooms: number;
  surfaceM2: number;
  rentCLP: number;
  ownerName: string;
  tenantName?: string;
  status: 'arrendada' | 'disponible' | 'en_mantencion';
  coverPhoto?: string;
}

export interface AgencyCalendarEvent {
  id: string;
  day: number;
  month: number;
  year: number;
  title: string;
  type: 'visita' | 'reunion' | 'feriado' | 'firma';
  time?: string;
  client?: string;
}

export const AgencyWorkspaceView: React.FC<AgencyWorkspaceViewProps> = ({ 
  currentUser,
  onBackToHome,
  onLogout,
  onOpenOnboarding,
  isAdmin,
  onToggleAdminView
}) => {
  // Navigation Vertical Tabs (Exact 13 modules from Altenda sidebar)
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'properties' | 'sales' | 'agenda' | 'clients' | 'contracts' | 
    'collections' | 'payments' | 'settlement' | 'portals' | 'maintenance' | 'users' | 'plans'
  >('dashboard');

  // Load custom onboarding data if saved
  const [onboardingData] = useState<Partial<AgencyOnboardingData>>(() => {
    try {
      const raw = localStorage.getItem('melsa_agency_onboarding_data');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const companyDisplayName = onboardingData?.companyName || currentUser.companyName || 'Los Pinos';
  const representativeName = onboardingData?.legalRepresentative || currentUser.name || 'Alexis Santana';

  // Agency Subscription Plan
  const [currentPlan, setCurrentPlan] = useState<AgencyPlanTier>(currentUser.agencyPlan || 'basico');
  const [planChangeAlert, setPlanChangeAlert] = useState<string | null>(null);

  // Properties State
  const [propertiesTab, setPropertiesTab] = useState<'active' | 'trash'>('active');
  const [properties, setProperties] = useState<AgencyPropertyItem[]>([
    {
      id: 'prop-1',
      title: 'Depto Vista Despejada Parque Araucano',
      address: 'Av. Las Condes 10450, Depto 1402',
      commune: 'Las Condes, RM',
      type: 'Depto',
      bedrooms: 2,
      bathrooms: 2,
      surfaceM2: 78,
      rentCLP: 850000,
      ownerName: 'Gonzalo Vial Echenique',
      tenantName: 'Sebastián Valenzuela R.',
      status: 'arrendada',
      coverPhoto: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'prop-2',
      title: 'Penthouse Dúplex con Quincho Privado',
      address: 'Camino El Golf 320, Depto 1101',
      commune: 'Las Condes, RM',
      type: 'Depto',
      bedrooms: 3,
      bathrooms: 3,
      surfaceM2: 145,
      rentCLP: 1650000,
      ownerName: 'Inversiones Los Andes SpA',
      tenantName: 'Carolina Morales P.',
      status: 'arrendada',
      coverPhoto: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'prop-3',
      title: 'Casa Mediterránea en Condominio Cerrado',
      address: 'Los Pinos 356',
      commune: 'Lo Barnechea, RM',
      type: 'Casa',
      bedrooms: 4,
      bathrooms: 4,
      surfaceM2: 240,
      rentCLP: 2400000,
      ownerName: 'Rodrigo Matte Larraín',
      tenantName: 'Felipe Correa B.',
      status: 'disponible',
      coverPhoto: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800'
    }
  ]);
  const [isAddingPropertyModal, setIsAddingPropertyModal] = useState(false);
  const [newPropAddress, setNewPropAddress] = useState('');
  const [newPropCommune, setNewPropCommune] = useState('Las Condes');
  const [newPropRent, setNewPropRent] = useState(750000);
  const [newPropBedrooms, setNewPropBedrooms] = useState(2);
  const [newPropBathrooms, setNewPropBathrooms] = useState(2);
  const [newPropOwner, setNewPropOwner] = useState('');
  const [newPropPhotos, setNewPropPhotos] = useState<string[]>([]);

  // Contracts State
  const [contracts, setContracts] = useState<AgencyRentalContract[]>(MOCK_AGENCY_CONTRACTS);

  // Sales Pipeline State (Screenshot 4/8 Cartera de ventas)
  const [salesTab, setSalesTab] = useState<'pipeline' | 'buyers' | 'agenda'>('pipeline');
  const [sales, setSales] = useState<AgencySalePipeline[]>(MOCK_AGENCY_SALES);
  const [isAddingSaleModal, setIsAddingSaleModal] = useState(false);
  const [newSaleTitle, setNewSaleTitle] = useState('');
  const [newSaleUF, setNewSaleUF] = useState(6500);

  // Agenda State (Screenshot 5/8 Agenda)
  const [agendaEvents, setAgendaEvents] = useState<AgencyCalendarEvent[]>([
    { id: 'ev-1', day: 1, month: 11, year: 2026, title: 'Día de Todos los Santos', type: 'feriado' },
    { id: 'ev-2', day: 9, month: 11, year: 2026, title: 'Visita Depto Parque Araucano', type: 'visita', time: '11:30', client: 'Matías Silva' },
    { id: 'ev-3', day: 12, month: 11, year: 2026, title: 'Firma Notaría Promesa El Golf', type: 'firma', time: '15:00', client: 'Carolina Morales' },
    { id: 'ev-4', day: 18, month: 11, year: 2026, title: 'Reunión Propietario Los Pinos', type: 'reunion', time: '10:00', client: 'Rodrigo Matte' }
  ]);
  const [isAddingActivityModal, setIsAddingActivityModal] = useState(false);
  const [newActivityTitle, setNewActivityTitle] = useState('');
  const [newActivityDay, setNewActivityDay] = useState(15);
  const [newActivityTime, setNewActivityTime] = useState('11:00');

  // Settlements State
  const [selectedContractId, setSelectedContractId] = useState<string>(MOCK_AGENCY_CONTRACTS[0].id);
  const [settlementMaintenanceDeduction, setSettlementMaintenanceDeduction] = useState(35000);
  const [settlementSuccessMsg, setSettlementSuccessMsg] = useState(false);
  const activeSettlementContract = contracts.find(c => c.id === selectedContractId) || contracts[0];

  // Portals Preview State
  const [portalPreviewMode, setPortalPreviewMode] = useState<'owner' | 'tenant'>('tenant');
  const [copiedLinkNotice, setCopiedLinkNotice] = useState<string | null>(null);

  // Tickets (Gastos y servicios Sello Melsa)
  const [tickets, setTickets] = useState<AgencyMaintenanceTicket[]>(MOCK_AGENCY_TICKETS);

  const formatCLP = (val: number) => '$' + Math.round(val).toLocaleString('es-CL');

  // Add Property Handler
  const handleAddProperty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPropAddress.trim()) return;

    const newItem: AgencyPropertyItem = {
      id: 'prop-' + Date.now(),
      title: `Propiedad en ${newPropAddress}`,
      address: newPropAddress,
      commune: newPropCommune,
      type: 'Depto',
      bedrooms: newPropBedrooms,
      bathrooms: newPropBathrooms,
      surfaceM2: 80,
      rentCLP: newPropRent,
      ownerName: newPropOwner.trim() || 'Propietario Registrado',
      status: 'disponible',
      coverPhoto: newPropPhotos[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=800'
    };

    setProperties(prev => [newItem, ...prev]);
    setIsAddingPropertyModal(false);
    setNewPropAddress('');
    setNewPropOwner('');
    setNewPropPhotos([]);
  };

  // Add Agenda Event
  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActivityTitle.trim()) return;
    setAgendaEvents(prev => [
      ...prev,
      {
        id: 'ev-' + Date.now(),
        day: newActivityDay,
        month: 11,
        year: 2026,
        title: newActivityTitle,
        type: 'visita',
        time: newActivityTime
      }
    ]);
    setIsAddingActivityModal(false);
    setNewActivityTitle('');
  };

  return (
    <div className="min-h-screen bg-[#F4F8F7] text-[#153B50] flex flex-col font-sans">
      
      {/* ============================================================== */}
      {/* 1. TOP CORPORATE HEADER BAR (MATCHING ALTENDA EXACTLY)         */}
      {/* ============================================================== */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200/90 shadow-2xs h-16 px-4 sm:px-6 flex items-center justify-between">
        
        {/* Left: Brand Logo & Economic Indicators */}
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-2">
            <MelsaLogo isLight={false} className="h-7 cursor-pointer" />
          </div>

          <div className="hidden lg:flex items-center gap-4 text-xs font-semibold text-gray-700 border-l border-gray-200 pl-4">
            <span className="flex items-center gap-1">
              <span className="text-[#008E88] font-bold">↑</span>
              <span>UF: <strong>$41.295,46</strong></span>
            </span>
            <span className="flex items-center gap-1">
              <span className="text-[#008E88] font-bold">↑</span>
              <span>IPC: <strong>0,50%</strong></span>
            </span>
          </div>

          {/* Plan Pill */}
          <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs bg-emerald-50 text-emerald-800 border border-emerald-200/70">
            <span className="font-semibold">
              Plan {currentPlan.toUpperCase()} · 14 días restantes
            </span>
            <button
              onClick={() => setActiveTab('plans')}
              className="font-bold text-[#008E88] hover:underline cursor-pointer ml-1"
            >
              Registrar mi tarjeta
            </button>
          </div>
        </div>

        {/* Right: Date, Notifications, Settings, User profile, Logout */}
        <div className="flex items-center gap-3">
          
          <span className="hidden xl:inline-flex items-center gap-1.5 text-xs text-gray-500 font-medium mr-1">
            <Calendar className="w-3.5 h-3.5 text-gray-400" />
            <span>09 Nov 2026</span>
          </span>

          <button 
            type="button" 
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors relative cursor-pointer"
            title="Notificaciones"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#008E88]" />
          </button>

          <button 
            type="button"
            onClick={onOpenOnboarding}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
            title="Asistente de Configuración (8 pasos)"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* User Profile Pill */}
          <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
            <div className="w-8 h-8 rounded-full bg-[#E6F4EA] text-[#008E88] font-bold flex items-center justify-center text-xs shadow-2xs">
              {representativeName.charAt(0) || 'A'}
            </div>
            <div className="hidden md:block text-left text-xs leading-tight">
              <span className="font-bold text-[#153B50] block">{representativeName}</span>
              <span className="text-[10px] text-gray-400 block">{companyDisplayName}</span>
            </div>
          </div>

          {/* Admin Switcher if authorized */}
          {isAdmin && (
            <button
              onClick={onToggleAdminView}
              className="hidden lg:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-semibold cursor-pointer"
              title="Panel Auditoría Sello Melsa"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              <span>Auditoría</span>
            </button>
          )}

          {/* Back to Home Web */}
          {onBackToHome && (
            <button
              onClick={onBackToHome}
              className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold transition-colors cursor-pointer"
              title="Ver Landing Page de Melsa"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Sitio Web</span>
            </button>
          )}

          {/* Logout Button */}
          {onLogout && (
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 text-xs font-semibold transition-colors cursor-pointer ml-1"
              title="Cerrar sesión"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          )}

        </div>

      </header>

      {/* ============================================================== */}
      {/* 2. BODY LAYOUT: LEFT SIDEBAR + MAIN CONTENT AREA               */}
      {/* ============================================================== */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT VERTICAL SIDEBAR (ALTENDA 13 MODULES) */}
        <aside className="w-60 bg-white border-r border-gray-200/90 shrink-0 flex flex-col justify-between py-4 px-3 overflow-y-auto">
          <nav className="space-y-0.5">
            {[
              { id: 'dashboard', label: 'Panel general', icon: LayoutDashboard },
              { id: 'properties', label: 'Propiedades', icon: Home },
              { id: 'sales', label: 'Cartera de ventas', icon: Building2 },
              { id: 'agenda', label: 'Agenda', icon: Calendar },
              { id: 'clients', label: 'Clientes', icon: Users },
              { id: 'contracts', label: 'Contratos', icon: FileText },
              { id: 'collections', label: 'Cobranzas', icon: Receipt },
              { id: 'payments', label: 'Pagos', icon: CreditCard },
              { id: 'settlement', label: 'Liquidaciones', icon: FileSpreadsheet },
              { id: 'portals', label: 'Portales', icon: Layers },
              { id: 'maintenance', label: 'Gastos y servicios', icon: Wrench },
              { id: 'users', label: 'Usuarios', icon: UserPlus },
              { id: 'plans', label: 'Mi plan', icon: Sparkles }
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left ${
                    isActive
                      ? 'bg-[#E6F4EA] text-[#008E88] font-bold shadow-2xs'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#008E88]' : 'text-gray-400'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Quick Setup Shortcut */}
          <div className="pt-4 border-t border-gray-100">
            <button
              onClick={onOpenOnboarding}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-[11px] font-semibold text-gray-500 hover:text-[#008E88] hover:bg-emerald-50/50 transition-colors cursor-pointer"
            >
              <span>⚙️ Asistente Corredora</span>
              <span className="text-[10px] text-[#008E88] font-bold">1-8</span>
            </button>
          </div>
        </aside>

        {/* MAIN VIEW CONTAINER */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8 bg-[#F4F8F7]">
          <div className="max-w-6xl mx-auto space-y-6">
            
            {/* ========================================================== */}
            {/* TAB 1: PANEL GENERAL (SCREENSHOTS 1 & 2 EXACT MATCH)      */}
            {/* ========================================================== */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                
                {/* Header Welcome + CTA */}
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#153B50]">
                    Hola, {representativeName.split(' ')[0]}!
                  </h1>
                  <button
                    onClick={() => setIsAddingPropertyModal(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#008E88] hover:bg-[#08736E] text-white text-xs font-bold transition-all shadow-xs hover:shadow-md cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Nueva propiedad</span>
                  </button>
                </div>

                {/* 4 Top Metric Cards (Green, Blue, Purple, Peach) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Card 1: Propiedades activas */}
                  <div 
                    onClick={() => setActiveTab('properties')}
                    className="bg-[#EBF6F0] p-5 rounded-2xl flex flex-col justify-between transition-all hover:shadow-sm cursor-pointer border border-[#EBF6F0]"
                  >
                    <div className="flex items-center justify-between text-[#008E88]">
                      <Home className="w-5 h-5" />
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                    <div className="my-4">
                      <span className="text-xs font-medium text-gray-600 block">Propiedades activas</span>
                      <span className="text-3xl font-bold text-[#153B50] block mt-0.5">{properties.length}</span>
                    </div>
                    <span className="text-xs font-bold text-[#008E88] hover:underline">Ver propiedades</span>
                  </div>

                  {/* Card 2: Contratos vigentes */}
                  <div 
                    onClick={() => setActiveTab('contracts')}
                    className="bg-[#EFF3FB] p-5 rounded-2xl flex flex-col justify-between transition-all hover:shadow-sm cursor-pointer border border-[#EFF3FB]"
                  >
                    <div className="flex items-center justify-between text-[#2563EB]">
                      <FileText className="w-5 h-5" />
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                    <div className="my-4">
                      <span className="text-xs font-medium text-gray-600 block">Contratos vigentes</span>
                      <span className="text-3xl font-bold text-[#153B50] block mt-0.5">{contracts.length}</span>
                    </div>
                    <span className="text-xs font-bold text-[#2563EB] hover:underline">Ver contratos</span>
                  </div>

                  {/* Card 3: Cobranza del mes */}
                  <div 
                    onClick={() => setActiveTab('collections')}
                    className="bg-[#F4EEFB] p-5 rounded-2xl flex flex-col justify-between transition-all hover:shadow-sm cursor-pointer border border-[#F4EEFB]"
                  >
                    <div className="flex items-center justify-between text-[#7C3AED]">
                      <Receipt className="w-5 h-5" />
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                    <div className="my-4">
                      <span className="text-xs font-medium text-gray-600 block">Cobranza del mes</span>
                      <span className="text-3xl font-bold text-[#153B50] block mt-0.5">
                        {formatCLP(contracts.reduce((acc, c) => acc + c.rentCLP, 0))}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-[#7C3AED] hover:underline">Ver cobranzas</span>
                  </div>

                  {/* Card 4: Pagos del mes */}
                  <div 
                    onClick={() => setActiveTab('payments')}
                    className="bg-[#FEF5EC] p-5 rounded-2xl flex flex-col justify-between transition-all hover:shadow-sm cursor-pointer border border-[#FEF5EC]"
                  >
                    <div className="flex items-center justify-between text-[#D97706]">
                      <CreditCard className="w-5 h-5" />
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                    <div className="my-4">
                      <span className="text-xs font-medium text-gray-600 block">Pagos del mes</span>
                      <span className="text-3xl font-bold text-[#153B50] block mt-0.5">$0</span>
                    </div>
                    <span className="text-xs font-bold text-[#D97706] hover:underline">Ver pagos</span>
                  </div>
                </div>

                {/* Mid Row: Resumen Financiero + Últimos seis meses */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                  
                  {/* Resumen Financiero */}
                  <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-gray-200/80 shadow-2xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                        <Building2 className="w-4 h-4 text-[#008E88]" />
                        <span>Resumen financiero</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">Movimientos del mes actual, en pesos chilenos.</p>
                      
                      <button
                        onClick={() => setActiveTab('payments')}
                        className="text-xs font-bold text-[#008E88] hover:underline mt-2 inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>Ver pagos</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      <div className="space-y-3 mt-6">
                        <div className="flex items-center justify-between text-xs py-1.5 border-b border-gray-50">
                          <span className="text-gray-600 flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Pagos registrados</span>
                          </span>
                          <span className="font-bold text-[#153B50]">$0</span>
                        </div>

                        <div className="flex items-center justify-between text-xs py-1.5 border-b border-gray-50">
                          <span className="text-gray-600 flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-gray-400" />
                            <span>Cargos programados</span>
                          </span>
                          <span className="font-bold text-[#153B50]">$0</span>
                        </div>

                        <div className="flex items-center justify-between text-xs py-1.5">
                          <span className="text-gray-600 flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-gray-400" />
                            <span>Contactos</span>
                          </span>
                          <span className="font-bold text-[#153B50]">{contracts.length * 2}</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-[11px] text-gray-400 pt-4 border-t border-gray-100">
                      Aún no hay cargos programados este mes.
                    </p>
                  </div>

                  {/* Últimos seis meses Promo */}
                  <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-gray-200/80 shadow-2xs flex flex-col justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                      <TrendingUp className="w-4 h-4 text-[#008E88]" />
                      <span>Últimos seis meses</span>
                    </div>

                    <div className="my-auto py-8 text-center max-w-md mx-auto space-y-3">
                      <div className="w-14 h-14 rounded-2xl bg-[#E6F4EA] text-[#008E88] flex items-center justify-center mx-auto">
                        <Home className="w-7 h-7" />
                      </div>
                      <h4 className="text-base font-bold text-[#153B50]">
                        Tu corredora, conectada
                      </h4>
                      <p className="text-xs text-gray-500 leading-relaxed font-light">
                        Organiza arriendos y ventas, coordina visitas y comparte documentos con tus clientes desde un solo lugar.
                      </p>
                      <button
                        onClick={() => setActiveTab('portals')}
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#008E88] hover:underline cursor-pointer pt-1"
                      >
                        <span>Conoce las integraciones</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-[10px] text-gray-400 text-center">
                      Reportes analíticos mensuales automáticos
                    </div>
                  </div>

                </div>

                {/* Bottom Row: Propiedades Recientes + A Mano */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                  
                  {/* Propiedades Recientes */}
                  <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-gray-200/80 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-800">
                        <Home className="w-4 h-4 text-[#008E88]" />
                        <span>Propiedades recientes</span>
                      </div>
                      <button
                        onClick={() => setActiveTab('properties')}
                        className="text-xs font-bold text-[#008E88] hover:underline cursor-pointer"
                      >
                        Ver propiedades →
                      </button>
                    </div>

                    {properties.length === 0 ? (
                      <div className="py-12 text-center space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-gray-50 text-gray-400 flex items-center justify-center mx-auto">
                          <Home className="w-6 h-6" />
                        </div>
                        <h4 className="text-sm font-bold text-gray-700">Todavía no hay propiedades</h4>
                        <p className="text-xs text-gray-400">Agrega la primera propiedad para comenzar.</p>
                        <button
                          onClick={() => setIsAddingPropertyModal(true)}
                          className="px-4 py-2 rounded-xl bg-[#008E88] hover:bg-[#08736E] text-white text-xs font-bold cursor-pointer"
                        >
                          + Agregar propiedad
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {properties.slice(0, 3).map((prop) => (
                          <div 
                            key={prop.id} 
                            className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 hover:bg-[#E6F4EA]/50 border border-gray-100 transition-colors cursor-pointer"
                            onClick={() => setActiveTab('properties')}
                          >
                            <div className="flex items-center gap-3">
                              <img 
                                src={prop.coverPhoto} 
                                alt={prop.title} 
                                className="w-12 h-12 rounded-xl object-cover" 
                              />
                              <div>
                                <span className="text-xs font-bold text-[#153B50] block">{prop.address}</span>
                                <span className="text-[10px] text-gray-400 block">{prop.commune} · {prop.bedrooms}D/{prop.bathrooms}B</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-xs font-bold text-[#008E88] block">{formatCLP(prop.rentCLP)}/mes</span>
                              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                prop.status === 'arrendada' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                              }`}>
                                {prop.status === 'arrendada' ? 'Arrendada' : 'Disponible'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* A Mano (Quick Access Widget from Altenda) */}
                  <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-gray-200/80 shadow-2xs space-y-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-800 pb-3 border-b border-gray-100">
                      <LayoutDashboard className="w-4 h-4 text-[#008E88]" />
                      <span>A mano</span>
                    </div>

                    <div className="space-y-2">
                      {[
                        { tab: 'clients', label: 'Clientes', desc: 'Consulta cada cartera', icon: Users },
                        { tab: 'contracts', label: 'Contratos', desc: 'Documentos y firmas', icon: FileText },
                        { tab: 'settlement', label: 'Liquidaciones', desc: 'Revisa las entregas', icon: FileSpreadsheet },
                        { tab: 'portals', label: 'Portales', desc: 'Personaliza tus accesos', icon: Layers }
                      ].map((item) => {
                        const Icon = item.icon;
                        return (
                          <div
                            key={item.tab}
                            onClick={() => setActiveTab(item.tab as any)}
                            className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer group"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-xl bg-gray-100 text-[#008E88] flex items-center justify-center group-hover:bg-[#E6F4EA]">
                                <Icon className="w-4 h-4" />
                              </div>
                              <div>
                                <span className="text-xs font-bold text-[#153B50] block">{item.label}</span>
                                <span className="text-[10px] text-gray-400 block">{item.desc}</span>
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-600 transition-colors" />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* ========================================================== */}
            {/* TAB 2: PROPIEDADES (SCREENSHOT 3 EXACT MATCH)              */}
            {/* ========================================================== */}
            {activeTab === 'properties' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#153B50]">
                      Propiedades
                    </h1>
                    <div className="flex items-center gap-4 text-xs font-semibold text-gray-500 mt-1">
                      <button
                        onClick={() => setPropertiesTab('active')}
                        className={`transition-colors cursor-pointer ${
                          propertiesTab === 'active' ? 'text-[#008E88] font-bold border-b-2 border-[#008E88] pb-0.5' : 'hover:text-gray-900'
                        }`}
                      >
                        Propiedades activas ({properties.length})
                      </button>
                      <button
                        onClick={() => setPropertiesTab('trash')}
                        className={`transition-colors cursor-pointer ${
                          propertiesTab === 'trash' ? 'text-[#008E88] font-bold border-b-2 border-[#008E88] pb-0.5' : 'hover:text-gray-900'
                        }`}
                      >
                        Papelera (0)
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenOnboarding?.()}
                      className="px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <UploadCloud className="w-3.5 h-3.5 text-[#008E88]" />
                      <span>Importar propiedades</span>
                    </button>
                    <button
                      onClick={() => setIsAddingPropertyModal(true)}
                      className="px-4 py-2.5 rounded-xl bg-[#008E88] hover:bg-[#08736E] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Nueva propiedad</span>
                    </button>
                  </div>
                </div>

                <p className="text-xs text-gray-500">
                  Consulta el estado de tus inmuebles y accede a sus fichas.
                </p>

                {/* Grid of properties */}
                {properties.length === 0 ? (
                  <div className="bg-white rounded-3xl p-16 text-center border border-gray-200 shadow-2xs space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-gray-50 text-gray-300 mx-auto flex items-center justify-center">
                      <Home className="w-7 h-7" />
                    </div>
                    <p className="text-xs text-gray-500">
                      Todavía no tienes propiedades registradas. Utiliza Nueva propiedad para comenzar.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {properties.map((prop) => (
                      <div key={prop.id} className="bg-white rounded-3xl overflow-hidden border border-gray-200/80 shadow-2xs flex flex-col justify-between">
                        <div>
                          <div className="relative h-44 w-full bg-gray-100">
                            <img src={prop.coverPhoto} alt={prop.title} className="w-full h-full object-cover" />
                            <span className={`absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-full ${
                              prop.status === 'arrendada' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-[#008E88] text-white'
                            }`}>
                              {prop.status === 'arrendada' ? '✓ Arrendada' : 'Disponible'}
                            </span>
                          </div>
                          <div className="p-5 space-y-2">
                            <h4 className="text-sm font-bold text-[#153B50] leading-snug">{prop.title}</h4>
                            <p className="text-xs text-gray-500">{prop.address}, {prop.commune}</p>
                            <div className="flex items-center gap-3 text-xs text-gray-600 pt-2 border-t border-gray-100">
                              <span>🛏️ {prop.bedrooms} Dorm</span>
                              <span>🚿 {prop.bathrooms} Baños</span>
                              <span>📐 {prop.surfaceM2} m²</span>
                            </div>
                          </div>
                        </div>

                        <div className="p-5 pt-0 flex items-center justify-between border-t border-gray-100/60 mt-2">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-gray-400 block">Canon Mensual</span>
                            <span className="text-base font-bold text-[#008E88]">{formatCLP(prop.rentCLP)}</span>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedContractId(contracts[0]?.id || '');
                              setActiveTab('contracts');
                            }}
                            className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-[#E6F4EA] text-[#008E88] text-xs font-bold transition-colors cursor-pointer"
                          >
                            Ver contrato →
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ========================================================== */}
            {/* TAB 3: CARTERA DE VENTAS (SCREENSHOT 4 EXACT MATCH)       */}
            {/* ========================================================== */}
            {activeTab === 'sales' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#153B50]">
                      Cartera de ventas
                    </h1>
                    <div className="flex items-center gap-4 text-xs font-semibold text-gray-500 mt-1">
                      <button
                        onClick={() => setSalesTab('pipeline')}
                        className={`transition-colors cursor-pointer ${
                          salesTab === 'pipeline' ? 'text-[#008E88] font-bold border-b-2 border-[#008E88] pb-0.5' : 'hover:text-gray-900'
                        }`}
                      >
                        Cartera de venta ({sales.length})
                      </button>
                      <button
                        onClick={() => setSalesTab('buyers')}
                        className={`transition-colors cursor-pointer ${
                          salesTab === 'buyers' ? 'text-[#008E88] font-bold border-b-2 border-[#008E88] pb-0.5' : 'hover:text-gray-900'
                        }`}
                      >
                        Posibles compradores
                      </button>
                      <button
                        onClick={() => setActiveTab('agenda')}
                        className="hover:text-gray-900 transition-colors cursor-pointer"
                      >
                        Agenda
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsAddingSaleModal(true)}
                    className="px-4 py-2.5 rounded-xl bg-[#008E88] hover:bg-[#08736E] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Nueva propiedad en venta</span>
                  </button>
                </div>

                <div className="space-y-2">
                  <h3 className="text-base font-bold text-[#153B50]">Propiedades en venta</h3>
                  <p className="text-xs text-gray-500">
                    Construye tu cartera de ventas. Registra tu propiedad en venta, define su mandato y coordina las visitas de tus interesados.
                  </p>
                </div>

                {/* Visual Kanban Stages */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                  {[
                    { stage: 'captacion', title: '1. Captación', color: 'border-blue-400 bg-blue-50/40' },
                    { stage: 'visitas', title: '2. En Visitas', color: 'border-amber-400 bg-amber-50/40' },
                    { stage: 'oferta', title: '3. Oferta & Negociación', color: 'border-purple-400 bg-purple-50/40' },
                    { stage: 'promesa', title: '4. Promesa & Escritura', color: 'border-emerald-400 bg-emerald-50/40' }
                  ].map((col) => {
                    const stageItems = sales.filter(s => s.stage === col.stage || (col.stage === 'promesa' && s.stage === 'escritura'));
                    return (
                      <div key={col.stage} className={`p-4 rounded-3xl border-2 ${col.color} space-y-3 min-h-[220px]`}>
                        <div className="flex items-center justify-between pb-2 border-b border-gray-200/60">
                          <span className="text-xs font-bold text-gray-800">{col.title}</span>
                          <span className="text-xs font-mono font-bold text-gray-500 bg-white px-2 py-0.5 rounded-full shadow-2xs">
                            {stageItems.length}
                          </span>
                        </div>

                        {stageItems.map((item) => (
                          <div key={item.id} className="bg-white p-3.5 rounded-2xl border border-gray-200/80 shadow-2xs space-y-2 text-xs">
                            <h5 className="font-bold text-[#153B50] leading-snug">{item.propertyTitle}</h5>
                            <div className="flex items-center justify-between text-gray-600">
                              <span className="font-mono font-bold text-[#008E88]">{item.priceUF} UF</span>
                              <span className="text-[10px] text-gray-400">Comisión 2%: ~{formatCLP(item.commissionEstCLP)}</span>
                            </div>
                            <span className="text-[10px] text-gray-500 block">Interesado: <strong>{item.buyerCandidate}</strong></span>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ========================================================== */}
            {/* TAB 4: AGENDA (SCREENSHOT 5 EXACT MATCH)                   */}
            {/* ========================================================== */}
            {activeTab === 'agenda' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#153B50]">
                      Agenda
                    </h1>
                    <p className="text-xs text-gray-500 mt-1">
                      Actividades de todas tus propiedades y de tu corredora. Los feriados son solo informativos.
                    </p>
                  </div>

                  <button
                    onClick={() => setIsAddingActivityModal(true)}
                    className="px-4 py-2.5 rounded-xl bg-[#008E88] hover:bg-[#08736E] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Nueva actividad</span>
                  </button>
                </div>

                {/* Calendar Card View */}
                <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-2xs space-y-6">
                  
                  {/* Calendar Top Month Navigation */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
                    <h3 className="text-sm sm:text-base font-bold text-[#153B50] flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#008E88]" />
                      <span>Visitas, reuniones y actividades</span>
                    </h3>

                    <div className="flex items-center gap-3 text-xs font-bold text-[#153B50]">
                      <button className="p-1 rounded-lg hover:bg-gray-100 text-gray-500 cursor-pointer">
                        &lt; Anterior
                      </button>
                      <span className="px-3 py-1 bg-gray-50 rounded-lg border border-gray-200">
                        11 / 2026
                      </span>
                      <button className="p-1 rounded-lg hover:bg-gray-100 text-gray-500 cursor-pointer">
                        Siguiente &gt;
                      </button>
                    </div>
                  </div>

                  {/* Calendar 7 Columns Grid (Lu - Do) */}
                  <div className="space-y-2">
                    <div className="grid grid-cols-7 text-center text-xs font-bold text-gray-400 py-2 border-b border-gray-100">
                      <span>Lu</span>
                      <span>Ma</span>
                      <span>Mi</span>
                      <span>Ju</span>
                      <span>Vi</span>
                      <span>Sá</span>
                      <span>Do</span>
                    </div>

                    <div className="grid grid-cols-7 gap-2">
                      {/* Days 1 to 30 */}
                      {Array.from({ length: 30 }).map((_, idx) => {
                        const dayNum = idx + 1;
                        const dayEvents = agendaEvents.filter(e => e.day === dayNum && e.month === 11);
                        return (
                          <div 
                            key={dayNum}
                            className={`min-h-[75px] sm:min-h-[90px] p-2 rounded-2xl border transition-all text-xs flex flex-col justify-between ${
                              dayEvents.length > 0
                                ? 'bg-emerald-50/30 border-[#008E88]/30 hover:border-[#008E88]'
                                : 'bg-[#FAF9F8] border-gray-100 hover:border-gray-200'
                            }`}
                          >
                            <span className="font-bold text-gray-400 block text-right">{dayNum}</span>
                            <div className="space-y-1">
                              {dayEvents.map((ev) => (
                                <div 
                                  key={ev.id}
                                  className={`text-[9px] sm:text-[10px] p-1 rounded-md font-semibold truncate ${
                                    ev.type === 'feriado'
                                      ? 'bg-amber-100 text-amber-900 border border-amber-200'
                                      : ev.type === 'firma'
                                      ? 'bg-purple-100 text-purple-900'
                                      : 'bg-[#008E88] text-white shadow-2xs'
                                  }`}
                                  title={ev.title}
                                >
                                  {ev.time ? `${ev.time} ` : ''}{ev.title}
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* ========================================================== */}
            {/* TAB 5: CLIENTES                                            */}
            {/* ========================================================== */}
            {activeTab === 'clients' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#153B50]">
                    Cartera de Clientes
                  </h1>
                </div>
                <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-2xs space-y-4">
                  <div className="divide-y divide-gray-100">
                    {contracts.map((cnt) => (
                      <div key={cnt.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div>
                          <span className="font-bold text-[#153B50] block text-sm">{cnt.tenantName} (Arrendatario)</span>
                          <span className="text-gray-400 block">RUT: {cnt.tenantRut} · Propiedad: {cnt.propertyAddress}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <a
                            href={`https://wa.me/56999899421?text=Hola%20${encodeURIComponent(cnt.tenantName)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-bold flex items-center gap-1.5 transition-colors"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </a>
                          <span className="font-mono text-gray-600 font-bold">{formatCLP(cnt.rentCLP)}/mes</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================== */}
            {/* TAB 6: CONTRATOS                                           */}
            {/* ========================================================== */}
            {activeTab === 'contracts' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#153B50]">
                  Contratos Vigentes
                </h1>
                <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-2xs space-y-4">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-gray-200 text-gray-400 uppercase font-bold text-[10px]">
                          <th className="pb-3">Inmueble</th>
                          <th className="pb-3">Arrendatario</th>
                          <th className="pb-3">Canon CLP</th>
                          <th className="pb-3">Reajuste</th>
                          <th className="pb-3">Estado</th>
                          <th className="pb-3 text-right">Acción</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {contracts.map((c) => (
                          <tr key={c.id}>
                            <td className="py-3 font-semibold text-[#153B50]">{c.propertyAddress}</td>
                            <td className="py-3 text-gray-600">{c.tenantName}</td>
                            <td className="py-3 font-mono font-bold text-[#008E88]">{formatCLP(c.rentCLP)}</td>
                            <td className="py-3 text-gray-500">{c.readjustmentIndex}</td>
                            <td className="py-3">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                Al Día
                              </span>
                            </td>
                            <td className="py-3 text-right">
                              <button 
                                onClick={() => {
                                  setSelectedContractId(c.id);
                                  setActiveTab('settlement');
                                }}
                                className="text-[#008E88] font-bold hover:underline cursor-pointer"
                              >
                                Liquidar →
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================== */}
            {/* TAB 7: COBRANZAS                                           */}
            {/* ========================================================== */}
            {activeTab === 'collections' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#153B50]">
                  Control de Cobranzas Automáticas
                </h1>
                <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-2xs space-y-4 text-xs">
                  <p className="text-gray-500">
                    Recordatorios automáticos sincronizados por WhatsApp y Correo para el día 5 de cada mes.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                      <span className="text-[10px] uppercase font-bold text-emerald-700 block">Al Día</span>
                      <span className="text-2xl font-bold text-emerald-900 block mt-1">3 Arriendos</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                      <span className="text-[10px] uppercase font-bold text-amber-700 block">Por Vencer</span>
                      <span className="text-2xl font-bold text-amber-900 block mt-1">0 Arriendos</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-red-50 border border-red-200">
                      <span className="text-[10px] uppercase font-bold text-red-700 block">Morosos</span>
                      <span className="text-2xl font-bold text-red-900 block mt-1">0 Arriendos</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================== */}
            {/* TAB 8: PAGOS                                               */}
            {/* ========================================================== */}
            {activeTab === 'payments' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#153B50]">
                  Historial de Pagos & Transferencias
                </h1>
                <div className="bg-white rounded-3xl p-8 text-center border border-gray-200 shadow-2xs space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#E6F4EA] text-[#008E88] mx-auto flex items-center justify-center">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-[#153B50]">Sin pagos registrados este mes</h4>
                  <p className="text-xs text-gray-400 max-w-sm mx-auto">
                    Cuando los arrendatarios paguen por Webpay, Khipu o transferencia bancaria, se reflejarán aquí automáticamente.
                  </p>
                </div>
              </div>
            )}

            {/* ========================================================== */}
            {/* TAB 9: LIQUIDACIONES                                       */}
            {/* ========================================================== */}
            {activeTab === 'settlement' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#153B50]">
                  Liquidaciones a Propietarios
                </h1>
                
                <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-2xs space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
                    <div>
                      <h3 className="text-base font-bold text-[#153B50]">{activeSettlementContract.propertyAddress}</h3>
                      <p className="text-xs text-gray-500">Propietario: {activeSettlementContract.ownerName} ({activeSettlementContract.ownerBank})</p>
                    </div>

                    <button
                      onClick={() => {
                        setSettlementSuccessMsg(true);
                        setTimeout(() => setSettlementSuccessMsg(false), 3000);
                      }}
                      className="px-4 py-2.5 rounded-xl bg-[#008E88] hover:bg-[#08736E] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Emitir Liquidación Oficial PDF</span>
                    </button>
                  </div>

                  {settlementSuccessMsg && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>¡Liquidación emitida con éxito! Se ha descargado el comprobante para el propietario.</span>
                    </div>
                  )}

                  {/* Calculator Breakdown */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                      <span className="text-gray-400 block font-bold text-[10px] uppercase">Renta Recibida</span>
                      <span className="text-xl font-bold text-[#153B50] block mt-1">{formatCLP(activeSettlementContract.rentCLP)}</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                      <span className="text-gray-400 block font-bold text-[10px] uppercase">Comisión Agencia (7%)</span>
                      <span className="text-xl font-bold text-red-600 block mt-1">
                        -{formatCLP(activeSettlementContract.rentCLP * 0.07)}
                      </span>
                    </div>
                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                      <span className="text-gray-400 block font-bold text-[10px] uppercase">Mantenciones / Reparaciones</span>
                      <span className="text-xl font-bold text-red-600 block mt-1">
                        -{formatCLP(settlementMaintenanceDeduction)}
                      </span>
                    </div>
                    <div className="p-4 rounded-2xl bg-[#E6F4EA] border border-[#008E88]/30">
                      <span className="text-[#008E88] block font-bold text-[10px] uppercase">Total Líquido Propietario</span>
                      <span className="text-xl font-bold text-[#008E88] block mt-1">
                        {formatCLP(activeSettlementContract.rentCLP * 0.93 - settlementMaintenanceDeduction)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================== */}
            {/* TAB 10: PORTALES DE AUTOSERVICIO                           */}
            {/* ========================================================== */}
            {activeTab === 'portals' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#153B50]">
                      Portales de Clientes
                    </h1>
                    <p className="text-xs text-gray-500 mt-1">
                      Enlaces personalizados para que tus arrendatarios y propietarios consulten su estado en línea.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPortalPreviewMode('tenant')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        portalPreviewMode === 'tenant' ? 'bg-[#008E88] text-white' : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      Portal Arrendatario
                    </button>
                    <button
                      onClick={() => setPortalPreviewMode('owner')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        portalPreviewMode === 'owner' ? 'bg-[#008E88] text-white' : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      Portal Propietario
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100 text-xs">
                    <div>
                      <span className="font-bold text-[#153B50] block">Enlace público de tu portal:</span>
                      <span className="text-[#008E88] font-mono">
                        {portalPreviewMode === 'tenant' 
                          ? `https://user.melsa.cl/pay/${companyDisplayName.toLowerCase().replace(/\s+/g, '-')}`
                          : `https://user.melsa.cl/my/33`}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText(`https://user.melsa.cl/pay/${companyDisplayName.toLowerCase().replace(/\s+/g, '-')}`);
                        setCopiedLinkNotice('¡Enlace copiado!');
                        setTimeout(() => setCopiedLinkNotice(null), 2000);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-[#E6F4EA] text-[#008E88] font-bold text-xs cursor-pointer"
                    >
                      {copiedLinkNotice || 'Copiar Enlace'}
                    </button>
                  </div>

                  {/* Simulator Box */}
                  <div className="bg-[#FAF9F8] p-6 rounded-2xl border border-gray-200 max-w-md mx-auto text-center space-y-3">
                    <h4 className="text-sm font-bold text-[#153B50]">
                      {portalPreviewMode === 'tenant' ? '🏠 Consulta tus pagos de arriendo' : '🏢 Liquidaciones para propietarios'}
                    </h4>
                    <p className="text-xs text-gray-400">
                      Tus clientes ingresan su RUT y ven su estado de cuenta en tiempo real.
                    </p>
                    <input
                      type="text"
                      readOnly
                      value="18.999.888-7"
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-center text-gray-500 font-mono"
                    />
                    <button
                      style={{ backgroundColor: onboardingData?.portalAccentColor || '#008E88' }}
                      className="w-full py-2.5 rounded-xl text-white font-bold text-xs shadow-xs"
                    >
                      {portalPreviewMode === 'tenant' ? 'Pagar con Webpay / Khipu' : 'Ver Liquidación'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================== */}
            {/* TAB 11: GASTOS Y SERVICIOS (SELLO MELSA RED TÉCNICA)      */}
            {/* ========================================================== */}
            {activeTab === 'maintenance' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#153B50]">
                      Gastos y Servicios Técnicos
                    </h1>
                    <p className="text-xs text-gray-500 mt-1">
                      Helpdesk de reparaciones con técnicos certificados del Sello Melsa.
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-2xs space-y-4">
                  <div className="divide-y divide-gray-100">
                    {tickets.map((tck) => (
                      <div key={tck.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#153B50]">{tck.propertyAddress}</span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                              {tck.category}
                            </span>
                          </div>
                          <p className="text-gray-500 mt-0.5">{tck.description}</p>
                          <span className="text-[10px] text-gray-400">Técnico SEC: <strong>{tck.assignedTechnician}</strong></span>
                        </div>
                        <div className="text-right">
                          <span className="font-mono font-bold text-[#153B50] block">{formatCLP(tck.costEstimateCLP)}</span>
                          <span className="text-[10px] text-emerald-700 font-semibold">Gasto imputado a liquidación</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================== */}
            {/* TAB 12: USUARIOS Y EQUIPO                                 */}
            {/* ========================================================== */}
            {activeTab === 'users' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#153B50]">
                  Usuarios y Permisos
                </h1>
                <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-2xs space-y-4 text-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <div>
                      <span className="font-bold text-[#153B50] block text-sm">{representativeName}</span>
                      <span className="text-gray-400 block">{currentUser.email}</span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#E6F4EA] text-[#008E88]">
                      Administrador Principal
                    </span>
                  </div>
                  <p className="text-gray-500">
                    Tienes 1 de 2 cupos de usuarios en uso según tu plan actual.
                  </p>
                </div>
              </div>
            )}

            {/* ========================================================== */}
            {/* TAB 13: MI PLAN                                            */}
            {/* ========================================================== */}
            {activeTab === 'plans' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#153B50]">
                    Planes & Suscripción
                  </h1>
                  <p className="text-xs text-gray-500 mt-1">
                    Tarifas transparentes para corredores. Menos es más.
                  </p>
                </div>

                {planChangeAlert && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{planChangeAlert}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {AGENCY_SAAS_PLANS.map((plan) => (
                    <div 
                      key={plan.id}
                      className={`p-6 rounded-3xl border-2 flex flex-col justify-between transition-all bg-white ${
                        currentPlan === plan.id ? 'border-[#008E88] shadow-md ring-2 ring-[#008E88]/10' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-sm text-[#153B50]">{plan.name}</h4>
                          {currentPlan === plan.id && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E6F4EA] text-[#008E88]">
                              Activo
                            </span>
                          )}
                        </div>
                        <div>
                          <span className="text-2xl font-bold text-[#153B50]">{plan.priceFormatted}</span>
                          <span className="text-xs text-gray-400 block font-light">/ mes</span>
                        </div>
                        <p className="text-xs text-gray-500 font-light">{plan.description}</p>
                      </div>

                      <div className="pt-6">
                        <button
                          disabled={currentPlan === plan.id}
                          onClick={() => {
                            setCurrentPlan(plan.id);
                            setPlanChangeAlert(`¡Plan actualizado con éxito al ${plan.name}!`);
                            setTimeout(() => setPlanChangeAlert(null), 3000);
                          }}
                          className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            currentPlan === plan.id
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-[#008E88] hover:bg-[#08736E] text-white shadow-xs'
                          }`}
                        >
                          {currentPlan === plan.id ? 'Plan Actual' : 'Seleccionar Plan'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </main>
      </div>

      {/* ============================================================== */}
      {/* MODAL: NUEVA PROPIEDAD                                         */}
      {/* ============================================================== */}
      {isAddingPropertyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="text-base font-bold text-[#153B50]">Agregar Nueva Propiedad</h3>
              <button 
                onClick={() => setIsAddingPropertyModal(false)}
                className="text-gray-400 hover:text-gray-700 cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddProperty} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Dirección del Inmueble *</label>
                <input
                  type="text"
                  required
                  value={newPropAddress}
                  onChange={(e) => setNewPropAddress(e.target.value)}
                  placeholder="ej. Av. Las Condes 10450, Depto 1402"
                  className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-[#153B50] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Comuna</label>
                  <input
                    type="text"
                    value={newPropCommune}
                    onChange={(e) => setNewPropCommune(e.target.value)}
                    placeholder="Las Condes"
                    className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#153B50] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Canon Arriendo CLP *</label>
                  <input
                    type="number"
                    value={newPropRent}
                    onChange={(e) => setNewPropRent(Number(e.target.value))}
                    className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#153B50] font-bold outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Dormitorios</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={newPropBedrooms}
                    onChange={(e) => setNewPropBedrooms(Number(e.target.value))}
                    className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#153B50] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Baños</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={newPropBathrooms}
                    onChange={(e) => setNewPropBathrooms(Number(e.target.value))}
                    className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#153B50] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Nombre del Propietario</label>
                <input
                  type="text"
                  value={newPropOwner}
                  onChange={(e) => setNewPropOwner(e.target.value)}
                  placeholder="ej. Gonzalo Vial Echenique"
                  className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-[#153B50] outline-none"
                />
              </div>

              {/* Photo Uploader */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Fotografías de la Propiedad</label>
                <PropertyPhotoUploader
                  photos={newPropPhotos}
                  onPhotosChange={setNewPropPhotos}
                  maxPhotos={6}
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#008E88] hover:bg-[#08736E] text-white font-bold text-xs tracking-wider uppercase transition-all shadow-xs cursor-pointer mt-2"
              >
                Guardar y Publicar en Mi Cartera
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: NUEVA ACTIVIDAD / REUNIÓN                               */}
      {/* ============================================================== */}
      {isAddingActivityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gray-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="text-base font-bold text-[#153B50]">Agendar Actividad</h3>
              <button 
                onClick={() => setIsAddingActivityModal(false)}
                className="text-gray-400 hover:text-gray-700 cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddActivity} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Título de la actividad *</label>
                <input
                  type="text"
                  required
                  value={newActivityTitle}
                  onChange={(e) => setNewActivityTitle(e.target.value)}
                  placeholder="ej. Visita Depto Parque Araucano"
                  className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-[#153B50] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Día (Noviembre 2026)</label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={newActivityDay}
                    onChange={(e) => setNewActivityDay(Number(e.target.value))}
                    className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#153B50] outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Hora</label>
                  <input
                    type="time"
                    value={newActivityTime}
                    onChange={(e) => setNewActivityTime(e.target.value)}
                    className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#153B50] outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#008E88] hover:bg-[#08736E] text-white font-bold text-xs tracking-wider uppercase transition-all shadow-xs cursor-pointer mt-2"
              >
                Agendar en Calendario
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: NUEVA PROPIEDAD EN VENTA (CRM PIPELINE)                 */}
      {/* ============================================================== */}
      {isAddingSaleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gray-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="text-base font-bold text-[#153B50]">Nueva Propiedad en Venta</h3>
              <button 
                onClick={() => setIsAddingSaleModal(false)}
                className="text-gray-400 hover:text-gray-700 cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (!newSaleTitle.trim()) return;
                setSales(prev => [
                  {
                    id: 'sale-' + Date.now(),
                    propertyTitle: newSaleTitle,
                    priceUF: newSaleUF,
                    stage: 'captacion',
                    commissionEstCLP: Math.round(newSaleUF * 41295 * 0.02),
                    buyerCandidate: 'Por asignar',
                    agentName: representativeName
                  },
                  ...prev
                ]);
                setIsAddingSaleModal(false);
                setNewSaleTitle('');
              }} 
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Título del Inmueble *</label>
                <input
                  type="text"
                  required
                  value={newSaleTitle}
                  onChange={(e) => setNewSaleTitle(e.target.value)}
                  placeholder="ej. Casa Mediterránea en La Dehesa"
                  className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-[#153B50] outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Precio en UF</label>
                <input
                  type="number"
                  value={newSaleUF}
                  onChange={(e) => setNewSaleUF(Number(e.target.value))}
                  className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-[#153B50] font-mono font-bold outline-none"
                />
                <span className="text-[10px] text-gray-400 mt-1 block">
                  Comisión estimada (2%): ~{formatCLP(Math.round(newSaleUF * 41295 * 0.02))}
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#008E88] hover:bg-[#08736E] text-white font-bold text-xs tracking-wider uppercase transition-all shadow-xs cursor-pointer mt-2"
              >
                Agregar a Captación
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
