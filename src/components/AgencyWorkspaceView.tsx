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
  ArrowLeft,
  Inbox,
  ArrowUpDown,
  Landmark,
  FileCode,
  FolderOpen,
  Save,
  Copy,
  Lock,
  Mail,
  Globe
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

  // View toggle: Clean Initial State (matches Altenda fresh account) vs Demo Populated State
  const [showDemoData, setShowDemoData] = useState(false);

  // Contracts module state (Altenda screenshot 2)
  const [contractsSearch, setContractsSearch] = useState('');
  const [contractsStatusFilter, setContractsStatusFilter] = useState('Todos');
  const [isNewContractModalOpen, setIsNewContractModalOpen] = useState(false);
  const [isTemplatesModalOpen, setIsTemplatesModalOpen] = useState(false);
  const [newContractProperty, setNewContractProperty] = useState('');
  const [newContractTenant, setNewContractTenant] = useState('');
  const [newContractRent, setNewContractRent] = useState(750000);
  const [newContractIndex, setNewContractIndex] = useState('IPC Semestral');

  // Payments module state (Altenda screenshot 4)
  const [paymentsTab, setPaymentsTab] = useState<'saldos_abonos' | 'online' | 'transfers'>('saldos_abonos');
  const [paymentsSubTab, setPaymentsSubTab] = useState<'saldos' | 'historial'>('saldos');

  // Liquidaciones state (Altenda screenshot 5)
  const [showSettlementCalculator, setShowSettlementCalculator] = useState(false);

  // Clientes state (Altenda screenshot 1)
  const [isNewClientModalOpen, setIsNewClientModalOpen] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');

  // Portales module state (Altenda screenshots 1, 2, 3)
  const [portalCustomName, setPortalCustomName] = useState(companyDisplayName || 'Los Pinos');
  const [portalPrimaryColor, setPortalPrimaryColor] = useState('#153b50');
  const [portalAccentColor, setPortalAccentColor] = useState('#008e88');
  const [portalAllowedDomains, setPortalAllowedDomains] = useState('https://www.tuempresa.cl');
  const [portalPublishRut, setPortalPublishRut] = useState(true);
  const [portalSavedAlert, setPortalSavedAlert] = useState(false);
  const [portalCopiedItem, setPortalCopiedItem] = useState<string | null>(null);

  // Gastos y servicios module state (Altenda screenshot 4)
  const [isNewExpenseModalOpen, setIsNewExpenseModalOpen] = useState(false);
  const [newExpenseProp, setNewExpenseProp] = useState('');
  const [newExpenseCat, setNewExpenseCat] = useState('Gasfitería');
  const [newExpenseAmount, setNewExpenseAmount] = useState(45000);
  const [newExpenseDesc, setNewExpenseDesc] = useState('');

  // Usuarios module state (Altenda screenshot 5)
  const [teamMembers, setTeamMembers] = useState([
    {
      id: 'usr-1',
      name: representativeName,
      email: currentUser.email || 'alexis.s.m@gmail.com',
      role: 'Propietario de la empresa',
      type: 'Cuenta de equipo'
    }
  ]);
  const [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<'Colaborador' | 'Administrador'>('Colaborador');

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
            {/* TAB 5: CLIENTES (SCREENSHOT 1 EXACT MATCH)                */}
            {/* ========================================================== */}
            {activeTab === 'clients' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#153B50]">
                    Clientes
                  </h1>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowDemoData(!showDemoData)}
                      className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      {showDemoData ? '👁️ Ver limpio inicial' : '📊 Ver datos de ejemplo'}
                    </button>
                    <button
                      onClick={() => setIsNewClientModalOpen(true)}
                      className="px-3.5 py-1.5 rounded-xl bg-[#008E88] hover:bg-[#08736E] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Nuevo cliente</span>
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/90 shadow-2xs space-y-6 min-h-[360px]">
                  <p className="text-xs text-gray-500 font-normal">
                    Propietarios registrados en tus propiedades. Consulta su cartera, ingresos y relación comercial.
                  </p>

                  {/* Altenda Exact Table Header */}
                  <div className="grid grid-cols-12 text-xs font-semibold text-gray-400 border-b border-gray-100 pb-3">
                    <div className="col-span-4 flex items-center gap-1 cursor-pointer hover:text-gray-600 select-none">
                      <span>Cliente</span>
                      <ArrowUpDown className="w-3 h-3 text-gray-300" />
                    </div>
                    <div className="col-span-2 flex items-center gap-1 cursor-pointer hover:text-gray-600 select-none">
                      <span>Propiedades</span>
                      <ArrowUpDown className="w-3 h-3 text-gray-300" />
                    </div>
                    <div className="col-span-3 flex items-center gap-1 cursor-pointer hover:text-gray-600 select-none">
                      <span>Correo</span>
                      <ArrowUpDown className="w-3 h-3 text-gray-300" />
                    </div>
                    <div className="col-span-3 flex items-center gap-1 cursor-pointer hover:text-gray-600 select-none">
                      <span>Teléfono</span>
                      <ArrowUpDown className="w-3 h-3 text-gray-300" />
                    </div>
                  </div>

                  {/* Body: Empty State matching Screenshot or Demo Records */}
                  {!showDemoData ? (
                    <div className="py-20 text-center text-xs text-gray-400 font-normal">
                      Completa los datos del propietario en una propiedad para que aparezca aquí.
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100 text-xs">
                      {[
                        { name: 'Gonzalo Vial Echenique', props: '1 propiedad', email: 'gvial@inversionesvial.cl', phone: '+56 9 9123 4567' },
                        { name: 'Inversiones Los Andes SpA', props: '2 propiedades', email: 'contacto@losandes.cl', phone: '+56 9 8234 5678' },
                        { name: 'Rodrigo Matte Larraín', props: '1 propiedad', email: 'rmatte@larrain.cl', phone: '+56 9 7345 6789' }
                      ].map((cli, idx) => (
                        <div key={idx} className="grid grid-cols-12 py-3.5 items-center text-gray-700 hover:bg-gray-50/60 rounded-xl px-2 transition-colors">
                          <div className="col-span-4 font-bold text-[#153B50] flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-[#E6F4EA] text-[#008E88] font-bold flex items-center justify-center text-xs">
                              {cli.name.charAt(0)}
                            </div>
                            <span>{cli.name}</span>
                          </div>
                          <div className="col-span-2 text-gray-500 font-medium">{cli.props}</div>
                          <div className="col-span-3 text-gray-600 font-mono text-[11px]">{cli.email}</div>
                          <div className="col-span-3 flex items-center justify-between">
                            <span className="text-gray-600 font-mono text-[11px]">{cli.phone}</span>
                            <a
                              href={`https://wa.me/${cli.phone.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-[10px] flex items-center gap-1"
                            >
                              <Phone className="w-3 h-3" />
                              <span>WhatsApp</span>
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ========================================================== */}
            {/* TAB 6: CONTRATOS (SCREENSHOT 2 EXACT MATCH)               */}
            {/* ========================================================== */}
            {activeTab === 'contracts' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#153B50]">
                    Contratos
                  </h1>
                  <button
                    onClick={() => setShowDemoData(!showDemoData)}
                    className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 cursor-pointer self-start sm:self-auto transition-colors"
                  >
                    {showDemoData ? '👁️ Ver limpio inicial' : '📊 Ver contratos de ejemplo'}
                  </button>
                </div>

                {/* Filter and Action Bar matching Screenshot 2 */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 max-w-2xl">
                    <div className="flex-1">
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                        Buscar contratos
                      </label>
                      <input
                        type="text"
                        value={contractsSearch}
                        onChange={(e) => setContractsSearch(e.target.value)}
                        placeholder="Propiedad, título o código"
                        className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#008E88] shadow-2xs transition-colors"
                      />
                    </div>

                    <div className="w-full sm:w-48">
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                        Estado
                      </label>
                      <select
                        value={contractsStatusFilter}
                        onChange={(e) => setContractsStatusFilter(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-gray-700 focus:outline-none focus:border-[#008E88] shadow-2xs transition-colors cursor-pointer"
                      >
                        <option value="Todos">Todos</option>
                        <option value="Vigente">Vigente</option>
                        <option value="Por vencer">Por vencer</option>
                        <option value="Finalizado">Finalizado</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start lg:self-end">
                    <button
                      onClick={() => setIsNewContractModalOpen(true)}
                      className="px-4 py-2.5 rounded-xl bg-[#008E88] hover:bg-[#08736E] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Nuevo contrato</span>
                    </button>
                    <button
                      onClick={() => setIsTemplatesModalOpen(true)}
                      className="px-3.5 py-2.5 rounded-xl bg-[#F0F7F6] text-[#008E88] hover:bg-[#E2F1EF] text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 border border-[#CDEAE6]"
                    >
                      <FileCode className="w-3.5 h-3.5" />
                      <span>Plantillas y variables</span>
                    </button>
                  </div>
                </div>

                {/* Content Box with Empty State or Filtered Table */}
                <div className="bg-white rounded-3xl p-6 sm:p-12 border border-gray-200/90 shadow-2xs min-h-[300px] flex flex-col justify-center">
                  {!showDemoData && contractsSearch === '' ? (
                    <div className="flex items-center justify-center gap-2.5 text-xs text-gray-400 py-16">
                      <Inbox className="w-5 h-5 text-gray-400 shrink-0" />
                      <span>Aún no hay contratos registrados.</span>
                    </div>
                  ) : (
                    <div className="overflow-x-auto w-full">
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
                          {contracts
                            .filter(c => {
                              if (contractsStatusFilter !== 'Todos' && contractsStatusFilter !== 'Vigente') return false;
                              if (contractsSearch.trim()) {
                                return c.propertyAddress.toLowerCase().includes(contractsSearch.toLowerCase()) ||
                                       c.tenantName.toLowerCase().includes(contractsSearch.toLowerCase());
                              }
                              return true;
                            })
                            .map((c) => (
                              <tr key={c.id} className="hover:bg-gray-50/60 transition-colors">
                                <td className="py-3 font-semibold text-[#153B50]">{c.propertyAddress}</td>
                                <td className="py-3 text-gray-600">{c.tenantName}</td>
                                <td className="py-3 font-mono font-bold text-[#008E88]">{formatCLP(c.rentCLP)}</td>
                                <td className="py-3 text-gray-500">{c.readjustmentIndex}</td>
                                <td className="py-3">
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                    Vigente
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
                  )}
                </div>
              </div>
            )}

            {/* ========================================================== */}
            {/* TAB 7: COBRANZAS (SCREENSHOT 3 EXACT MATCH)               */}
            {/* ========================================================== */}
            {activeTab === 'collections' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#153B50]">
                    Cobranzas
                  </h1>
                  <button
                    onClick={() => setShowDemoData(!showDemoData)}
                    className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    {showDemoData ? '👁️ Ver limpio inicial' : '📊 Ver cobranzas de ejemplo'}
                  </button>
                </div>

                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/90 shadow-2xs flex flex-col justify-between min-h-[360px]">
                  <div>
                    <p className="text-xs text-gray-500 font-normal">
                      Obligaciones programadas; no representan pagos recibidos.
                    </p>
                  </div>

                  {!showDemoData ? (
                    <div className="py-20 text-center flex items-center justify-center gap-2.5 text-xs text-gray-400">
                      <Inbox className="w-5 h-5 text-gray-400 shrink-0" />
                      <span>Todavía no hay movimientos para mostrar.</span>
                    </div>
                  ) : (
                    <div className="py-6 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                          <span className="text-[10px] uppercase font-bold text-emerald-700 block">Al Día</span>
                          <span className="text-2xl font-bold text-emerald-900 block mt-1">3 Arriendos</span>
                        </div>
                        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                          <span className="text-[10px] uppercase font-bold text-amber-700 block">Por Vencer (Día 5)</span>
                          <span className="text-2xl font-bold text-amber-900 block mt-1">0 Arriendos</span>
                        </div>
                        <div className="p-4 rounded-2xl bg-red-50 border border-red-200">
                          <span className="text-[10px] uppercase font-bold text-red-700 block">Morosos</span>
                          <span className="text-2xl font-bold text-red-900 block mt-1">0 Arriendos</span>
                        </div>
                      </div>

                      <div className="divide-y divide-gray-100 pt-2 text-xs">
                        {contracts.map(c => (
                          <div key={c.id} className="py-3 flex items-center justify-between">
                            <div>
                              <span className="font-bold text-[#153B50] block">{c.propertyAddress}</span>
                              <span className="text-gray-400 text-[11px]">{c.tenantName} · Vence el 05 de cada mes</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="font-mono font-bold text-[#008E88]">{formatCLP(c.rentCLP)}</span>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                Programado
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t border-gray-100 text-xs text-gray-500">
                    Primero registra un contrato para programar sus cobros.
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================== */}
            {/* TAB 8: PAGOS (SCREENSHOT 4 EXACT MATCH)                   */}
            {/* ========================================================== */}
            {activeTab === 'payments' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#153B50]">
                    Pagos
                  </h1>
                  <button
                    onClick={() => setShowDemoData(!showDemoData)}
                    className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    {showDemoData ? '👁️ Ver limpio inicial' : '📊 Ver pagos de ejemplo'}
                  </button>
                </div>

                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/90 shadow-2xs space-y-6 min-h-[420px]">
                  <p className="text-xs text-gray-500 font-normal">
                    Revisa saldos, abonos y el estado de los pagos recibidos.
                  </p>

                  {/* Altenda Exact Sub Tabs with Icons */}
                  <div className="flex items-center gap-8 border-b border-gray-100 pb-3 text-xs">
                    <button
                      onClick={() => setPaymentsTab('saldos_abonos')}
                      className={`flex items-center gap-2 font-bold pb-2 -mb-3 transition-colors cursor-pointer ${
                        paymentsTab === 'saldos_abonos' ? 'text-[#008E88] border-b-2 border-[#008E88]' : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      <Receipt className="w-4 h-4" />
                      <span>Saldos y abonos</span>
                    </button>

                    <button
                      onClick={() => setPaymentsTab('online')}
                      className={`flex items-center gap-2 font-bold pb-2 -mb-3 transition-colors cursor-pointer ${
                        paymentsTab === 'online' ? 'text-[#008E88] border-b-2 border-[#008E88]' : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Pagos en línea</span>
                    </button>

                    <button
                      onClick={() => setPaymentsTab('transfers')}
                      className={`flex items-center gap-2 font-bold pb-2 -mb-3 transition-colors cursor-pointer ${
                        paymentsTab === 'transfers' ? 'text-[#008E88] border-b-2 border-[#008E88]' : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      <Landmark className="w-4 h-4" />
                      <span>Transferencias</span>
                    </button>
                  </div>

                  {/* Sub-tab 1: Saldos y abonos (Exact Altenda View) */}
                  {paymentsTab === 'saldos_abonos' && (
                    <div className="space-y-6 pt-2">
                      {/* Secondary Sublinks: -> Saldos  -> Historial de abonos */}
                      <div className="flex items-center gap-6 text-xs">
                        <button
                          onClick={() => setPaymentsSubTab('saldos')}
                          className={`flex items-center gap-1.5 font-bold cursor-pointer ${
                            paymentsSubTab === 'saldos' ? 'text-[#008E88]' : 'text-gray-400 hover:text-gray-600'
                          }`}
                        >
                          <span>→ Saldos</span>
                        </button>
                        <button
                          onClick={() => setPaymentsSubTab('historial')}
                          className={`flex items-center gap-1.5 font-bold cursor-pointer ${
                            paymentsSubTab === 'historial' ? 'text-[#008E88]' : 'text-gray-400 hover:text-gray-600'
                          }`}
                        >
                          <span>→ Historial de abonos</span>
                        </button>
                      </div>

                      <div className="space-y-1">
                        <h3 className="text-base font-bold text-[#153B50]">
                          Saldos por obligación
                        </h3>
                        <p className="text-xs text-gray-500">
                          Registros ingresados por usuarios; no constituyen confirmación bancaria.
                        </p>
                      </div>

                      {!showDemoData ? (
                        <div className="py-20 text-center flex items-center justify-center gap-2.5 text-xs text-gray-400">
                          <Inbox className="w-5 h-5 text-gray-400 shrink-0" />
                          <span>Todavía no hay movimientos para mostrar.</span>
                        </div>
                      ) : (
                        <div className="divide-y divide-gray-100 text-xs">
                          {contracts.map(c => (
                            <div key={c.id} className="py-3 flex items-center justify-between">
                              <div>
                                <span className="font-bold text-[#153B50] block">{c.propertyAddress}</span>
                                <span className="text-gray-400">{c.tenantName} · Arriendo Mensual</span>
                              </div>
                              <div className="text-right">
                                <span className="font-mono font-bold text-[#008E88] block">{formatCLP(c.rentCLP)}</span>
                                <span className="text-[10px] text-emerald-600 font-bold">✓ Saldo al día</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Sub-tab 2: Pagos en línea (Webpay / Khipu) */}
                  {paymentsTab === 'online' && (
                    <div className="space-y-4 pt-2 text-xs">
                      <div className="p-5 rounded-2xl bg-[#F0F7F6] border border-[#CDEAE6] space-y-2">
                        <h4 className="font-bold text-[#153B50]">Integración Pasarela Webpay Plus & Khipu</h4>
                        <p className="text-gray-600 leading-relaxed">
                          Tus arrendatarios pagan directamente con tarjeta de débito, crédito o transferencia directa. Comisión estándar 1,49% + IVA. Los fondos se depositan automáticamente en la cuenta bancaria de tu corredora configurada en el Asistente.
                        </p>
                        <span className="inline-block mt-2 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                          ✓ Enlace de pago activo
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Sub-tab 3: Transferencias bancarias */}
                  {paymentsTab === 'transfers' && (
                    <div className="space-y-4 pt-2 text-xs">
                      <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
                        <h4 className="font-bold text-[#153B50]">Conciliación Bancaria Automática</h4>
                        <p className="text-gray-600 leading-relaxed">
                          Sincroniza comprobantes de transferencia electrónica por correo o lectura de cartolas bancarias chilenas (Banco de Chile, Santander, BCI, BancoEstado).
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ========================================================== */}
            {/* TAB 9: LIQUIDACIONES (SCREENSHOT 5 EXACT MATCH)           */}
            {/* ========================================================== */}
            {activeTab === 'settlement' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#153B50]">
                    Liquidaciones
                  </h1>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowDemoData(!showDemoData)}
                      className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      {showDemoData ? '👁️ Ver limpio inicial' : '📊 Ver liquidaciones de ejemplo'}
                    </button>
                    <button
                      onClick={() => setShowSettlementCalculator(true)}
                      className="px-3.5 py-1.5 rounded-xl bg-[#008E88] hover:bg-[#08736E] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Emitir Liquidación</span>
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/90 shadow-2xs space-y-6 min-h-[360px]">
                  <p className="text-xs text-gray-500 font-normal">
                    Resumen de abonos registrados. Cerrar una liquidación no transfiere fondos al propietario.
                  </p>

                  {!showDemoData && !showSettlementCalculator ? (
                    <div className="py-24 text-center flex items-center justify-center gap-2.5 text-xs text-gray-400">
                      <Inbox className="w-5 h-5 text-gray-400 shrink-0" />
                      <span>Todavía no hay movimientos para mostrar.</span>
                    </div>
                  ) : (
                    <div className="space-y-6 animate-in fade-in">
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
                          <span>Descargar Liquidación Oficial PDF</span>
                        </button>
                      </div>

                      {settlementSuccessMsg && (
                        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>¡Liquidación emitida con éxito! Se ha descargado el comprobante para el propietario.</span>
                        </div>
                      )}

                      {/* Chilean Calculator Breakdown */}
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
                          <span className="text-gray-400 block font-bold text-[10px] uppercase">Mantenciones</span>
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
                  )}
                </div>
              </div>
            )}

            {/* ========================================================== */}
            {/* TAB 10: PORTALES (SCREENSHOTS 1, 2, 3 EXACT MATCH)        */}
            {/* ========================================================== */}
            {activeTab === 'portals' && (
              <div className="space-y-8 animate-in fade-in duration-150">
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#153B50]">
                  Portales
                </h1>

                {/* Section 1: Acceso de propietarios y arrendatarios */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/90 shadow-2xs space-y-4">
                  <div className="flex items-center gap-2.5 text-[#153B50]">
                    <div className="w-8 h-8 rounded-full bg-[#E6F4EA] text-[#008E88] flex items-center justify-center">
                      <Users className="w-4 h-4" />
                    </div>
                    <h3 className="text-base font-bold">Acceso de propietarios y arrendatarios</h3>
                  </div>

                  <p className="text-xs text-gray-500 font-normal leading-relaxed">
                    Las personas registradas con correo acceden solicitando un código. Cada cuenta conserva sus permisos y los documentos que le corresponden.
                  </p>

                  <div className="space-y-1.5 pt-1">
                    <label className="block text-xs font-semibold text-gray-600">
                      Enlace de acceso personal
                    </label>
                    <div className="relative flex items-center max-w-2xl">
                      <input
                        type="text"
                        readOnly
                        value={`https://user.melsa.cl/my/33`}
                        className="w-full bg-[#F4F8F7] border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-700 font-mono pr-20 select-all"
                      />
                      <div className="absolute right-2 flex items-center gap-1">
                        <button
                          onClick={() => {
                            navigator.clipboard?.writeText(`https://user.melsa.cl/my/33`);
                            setPortalCopiedItem('personal');
                            setTimeout(() => setPortalCopiedItem(null), 2000);
                          }}
                          className="p-1.5 text-gray-400 hover:text-[#008E88] transition-colors cursor-pointer"
                          title="Copiar enlace"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <a
                          href={`https://user.melsa.cl/my/33`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 text-gray-400 hover:text-[#008E88] transition-colors"
                          title="Abrir enlace"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                    {portalCopiedItem === 'personal' && (
                      <span className="text-[10px] text-emerald-600 font-bold block">✓ ¡Enlace copiado al portapapeles!</span>
                    )}
                  </div>
                </div>

                {/* Section 2: Tu portal de pagos */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/90 shadow-2xs space-y-6">
                  <div className="flex items-center gap-2.5 text-[#153B50]">
                    <div className="w-8 h-8 rounded-full bg-[#E6F4EA] text-[#008E88] flex items-center justify-center">
                      <Globe className="w-4 h-4" />
                    </div>
                    <h3 className="text-base font-bold">Tu portal de pagos</h3>
                  </div>

                  <p className="text-xs text-gray-500 font-normal leading-relaxed">
                    Personaliza el portal donde tus arrendatarios consultan sus obligaciones por RUT. Puedes publicarlo también en tu sitio web.
                  </p>

                  <div className="space-y-4 max-w-2xl">
                    {/* Nombre del portal */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                        Nombre del portal
                      </label>
                      <input
                        type="text"
                        value={portalCustomName}
                        onChange={(e) => setPortalCustomName(e.target.value)}
                        className="w-full bg-[#F4F8F7] border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-700 focus:outline-none focus:border-[#008E88]"
                      />
                    </div>

                    {/* Colores */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                          Color principal
                        </label>
                        <div className="flex items-center gap-2 bg-[#F4F8F7] border border-gray-200 rounded-xl px-3 py-2">
                          <input
                            type="color"
                            value={portalPrimaryColor}
                            onChange={(e) => setPortalPrimaryColor(e.target.value)}
                            className="w-7 h-7 rounded-lg border-0 cursor-pointer p-0 bg-transparent"
                          />
                          <input
                            type="text"
                            value={portalPrimaryColor}
                            onChange={(e) => setPortalPrimaryColor(e.target.value)}
                            className="bg-transparent text-xs font-mono text-gray-700 outline-none w-24"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                          Color de acento
                        </label>
                        <div className="flex items-center gap-2 bg-[#F4F8F7] border border-gray-200 rounded-xl px-3 py-2">
                          <input
                            type="color"
                            value={portalAccentColor}
                            onChange={(e) => setPortalAccentColor(e.target.value)}
                            className="w-7 h-7 rounded-lg border-0 cursor-pointer p-0 bg-transparent"
                          />
                          <input
                            type="text"
                            value={portalAccentColor}
                            onChange={(e) => setPortalAccentColor(e.target.value)}
                            className="bg-transparent text-xs font-mono text-gray-700 outline-none w-24"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Logo de tu empresa */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                        Logo de tu empresa
                      </label>
                      <div className="border-2 border-dashed border-[#D2E7E4] bg-[#F4F9F8] rounded-2xl p-6 text-center cursor-pointer hover:bg-emerald-50/40 transition-colors relative">
                        <UploadCloud className="w-6 h-6 text-[#008E88] mx-auto mb-1.5" />
                        <p className="text-xs font-bold text-[#153B50]">
                          Arrastra un archivo aquí o haz clic para seleccionarlo
                        </p>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          Selecciona un archivo compatible
                        </p>
                        <span className="inline-block mt-3 px-3 py-1 bg-gray-900 text-white text-[10px] rounded font-mono">
                          Ningún archivo seleccionado
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400 mt-1.5">
                        PNG, JPG o WebP de hasta 500 KB. Se optimiza a un máximo de 400 px de ancho.
                      </p>
                    </div>

                    {/* Sitios autorizados para insertar el widget */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                        Sitios autorizados para insertar el widget
                      </label>
                      <textarea
                        rows={2}
                        value={portalAllowedDomains}
                        onChange={(e) => setPortalAllowedDomains(e.target.value)}
                        placeholder="https://www.tuempresa.cl"
                        className="w-full bg-[#F4F8F7] border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-gray-700 font-mono focus:outline-none focus:border-[#008E88]"
                      />
                      <p className="text-[11px] text-gray-400 mt-1">
                        Un dominio HTTPS por línea. Añade por separado las versiones con y sin www que utilices.
                      </p>
                    </div>

                    {/* Checkbox Publicar */}
                    <div className="flex items-center gap-2.5 pt-1">
                      <input
                        type="checkbox"
                        id="pub-rut"
                        checked={portalPublishRut}
                        onChange={(e) => setPortalPublishRut(e.target.checked)}
                        className="w-4 h-4 rounded text-[#008E88] border-gray-300 focus:ring-[#008E88] cursor-pointer"
                      />
                      <label htmlFor="pub-rut" className="text-xs text-gray-700 cursor-pointer select-none">
                        Publicar portal y aceptar consultas por RUT
                      </label>
                    </div>

                    {/* Guardar portal de pagos button */}
                    <div className="pt-2">
                      <button
                        onClick={() => {
                          setPortalSavedAlert(true);
                          setTimeout(() => setPortalSavedAlert(false), 3000);
                        }}
                        className="px-5 py-2.5 rounded-xl bg-[#008E88] hover:bg-[#08736E] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        <span>Guardar portal de pagos</span>
                      </button>
                    </div>

                    {portalSavedAlert && (
                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>¡Configuración del portal guardada con éxito!</span>
                      </div>
                    )}

                    <p className="text-[11px] text-gray-500 leading-relaxed pt-2">
                      Para habilitar los pagos de este portal, configura al menos una opción: Flow o transferencia bancaria. El acceso personal por correo es independiente de los medios de pago. Melsa protege las consultas con su comprobación de seguridad.
                    </p>
                  </div>

                  {/* Section 3: Enlace de tu portal */}
                  <div className="pt-6 border-t border-gray-100 space-y-2 max-w-2xl">
                    <h4 className="text-xs font-bold text-[#153B50]">Enlace de tu portal</h4>
                    <label className="block text-[11px] text-gray-500">URL pública</label>
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        readOnly
                        value={`https://user.melsa.cl/pay/c8fd0927723bfabb542051e19c733246`}
                        className="w-full bg-[#F4F8F7] border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-700 font-mono pr-20 select-all"
                      />
                      <div className="absolute right-2 flex items-center gap-1">
                        <button
                          onClick={() => {
                            navigator.clipboard?.writeText(`https://user.melsa.cl/pay/c8fd0927723bfabb542051e19c733246`);
                            setPortalCopiedItem('public');
                            setTimeout(() => setPortalCopiedItem(null), 2000);
                          }}
                          className="p-1.5 text-gray-400 hover:text-[#008E88] transition-colors cursor-pointer"
                          title="Copiar enlace"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <a
                          href={`https://user.melsa.cl/pay/c8fd0927723bfabb542051e19c733246`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 text-gray-400 hover:text-[#008E88] transition-colors"
                          title="Abrir enlace"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                    {portalCopiedItem === 'public' && (
                      <span className="text-[10px] text-emerald-600 font-bold block">✓ ¡URL pública copiada!</span>
                    )}
                  </div>

                  {/* Section 4: Widget para tu web */}
                  <div className="pt-4 border-t border-gray-100 space-y-2 max-w-2xl">
                    <h4 className="text-xs font-bold text-[#153B50]">Widget para tu web</h4>
                    <p className="text-[11px] text-gray-500">
                      Copia este código en un bloque HTML de uno de los sitios autorizados.
                    </p>
                    <div className="relative">
                      <textarea
                        readOnly
                        rows={3}
                        value={`<iframe src="https://user.melsa.cl/pay/c8fd0927723bfabb542051e19c733246?widget=1" title="Portal de pagos" width="100%" height="720" style="border:0" loading="lazy" referrerpolicy="no-referrer"></iframe>`}
                        className="w-full bg-[#153B50] text-[#00E5D4] p-3 rounded-xl font-mono text-[11px] border border-gray-700 focus:outline-none select-all"
                      />
                      <button
                        onClick={() => {
                          navigator.clipboard?.writeText(`<iframe src="https://user.melsa.cl/pay/c8fd0927723bfabb542051e19c733246?widget=1" title="Portal de pagos" width="100%" height="720" style="border:0" loading="lazy" referrerpolicy="no-referrer"></iframe>`);
                          setPortalCopiedItem('widget');
                          setTimeout(() => setPortalCopiedItem(null), 2000);
                        }}
                        className="absolute top-2 right-2 px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
                      >
                        {portalCopiedItem === 'widget' ? '✓ Copiado' : 'Copiar Widget'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================== */}
            {/* TAB 11: GASTOS Y SERVICIOS (SCREENSHOT 4 EXACT MATCH)     */}
            {/* ========================================================== */}
            {activeTab === 'maintenance' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#153B50]">
                    Gastos y servicios
                  </h1>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowDemoData(!showDemoData)}
                      className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      {showDemoData ? '👁️ Ver limpio inicial' : '📊 Ver gastos de ejemplo'}
                    </button>
                    <button
                      onClick={() => setIsNewExpenseModalOpen(true)}
                      className="px-3.5 py-1.5 rounded-xl bg-[#008E88] hover:bg-[#08736E] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Registrar gasto</span>
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/90 shadow-2xs space-y-4 min-h-[360px] flex flex-col justify-between">
                  <p className="text-xs text-gray-500 font-normal">
                    Registra y consulta los gastos de tus propiedades. Los pagos se anotan manualmente y no modifican por sí solos las liquidaciones.
                  </p>

                  {!showDemoData ? (
                    <div className="py-20 text-center flex items-center justify-center gap-2.5 text-xs text-gray-400">
                      <Inbox className="w-5 h-5 text-gray-400 shrink-0" />
                      <span>Todavía no hay movimientos para mostrar.</span>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100 text-xs py-2">
                      {tickets.map(t => (
                        <div key={t.id} className="py-3 flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-[#153B50]">{t.propertyAddress}</span>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                                {t.category}
                              </span>
                            </div>
                            <p className="text-gray-500 text-[11px] mt-0.5">{t.description}</p>
                            <span className="text-[10px] text-gray-400">Técnico SEC Sello Melsa: <strong>{t.assignedTechnician}</strong></span>
                          </div>
                          <div className="text-right">
                            <span className="font-mono font-bold text-[#153B50] block">{formatCLP(t.costEstimateCLP)}</span>
                            <span className="text-[10px] text-emerald-600 font-bold">Imputable a liquidación</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="pt-4 border-t border-gray-100 text-[11px] text-gray-400">
                    Soporte técnico y mantenciones respaldadas bajo el estándar de calidad del Sello Melsa.
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================== */}
            {/* TAB 12: USUARIOS (SCREENSHOT 5 EXACT MATCH)                */}
            {/* ========================================================== */}
            {activeTab === 'users' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#153B50]">
                    Usuarios
                  </h1>
                </div>

                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/90 shadow-2xs space-y-6">
                  {/* User rows */}
                  <div className="space-y-3">
                    {teamMembers.map(usr => (
                      <div key={usr.id} className="bg-[#FAF9F8] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-gray-100">
                        <div className="flex items-center gap-3.5">
                          <div className="w-10 h-10 rounded-full bg-[#E6F4EA] text-[#008E88] font-bold flex items-center justify-center text-sm shadow-2xs">
                            {usr.name.charAt(0) || 'A'}
                          </div>
                          <div>
                            <span className="font-bold text-sm text-[#153B50] block">{usr.name}</span>
                            <span className="text-xs text-gray-400 block">{usr.type}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Mail className="w-3.5 h-3.5 text-gray-400" />
                          <span className="font-mono">{usr.email}</span>
                        </div>

                        <div className="flex items-center gap-2 text-xs font-semibold text-gray-600">
                          <Lock className="w-3.5 h-3.5 text-gray-400" />
                          <span>{usr.role}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Bottom Action: + Crear usuario */}
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => setIsNewUserModalOpen(true)}
                      className="px-5 py-2.5 rounded-xl bg-[#008E88] hover:bg-[#08736E] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Crear usuario</span>
                    </button>
                  </div>
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

      {/* ============================================================== */}
      {/* MODAL: NUEVO CONTRATO (ALTENDA SCREENSHOT 2)                    */}
      {/* ============================================================== */}
      {isNewContractModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="text-base font-bold text-[#153B50]">Crear Nuevo Contrato de Arriendo</h3>
              <button 
                onClick={() => setIsNewContractModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (!newContractTenant.trim()) return;
                const newC: AgencyRentalContract = {
                  id: 'cnt-' + Date.now(),
                  propertyAddress: newContractProperty || (properties[0]?.address || 'Av. Las Condes 10450'),
                  tenantName: newContractTenant,
                  tenantRut: '18.456.789-K',
                  rentCLP: newContractRent,
                  readjustmentIndex: newContractIndex,
                  paymentDay: 5,
                  ownerName: companyDisplayName,
                  ownerBank: 'Banco de Chile'
                };
                setContracts(prev => [newC, ...prev]);
                setShowDemoData(true);
                setIsNewContractModalOpen(false);
                setNewContractTenant('');
              }}
              className="space-y-3.5 text-xs"
            >
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Propiedad Asociada *</label>
                <select
                  value={newContractProperty}
                  onChange={(e) => setNewContractProperty(e.target.value)}
                  className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-[#153B50] outline-none"
                >
                  {properties.map(p => (
                    <option key={p.id} value={p.address}>{p.address} ({p.commune})</option>
                  ))}
                  <option value="Nueva propiedad en Las Condes">Nueva propiedad en Las Condes</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Nombre Completo Arrendatario *</label>
                <input
                  type="text"
                  required
                  value={newContractTenant}
                  onChange={(e) => setNewContractTenant(e.target.value)}
                  placeholder="ej. Sebastián Valenzuela"
                  className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-[#153B50] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Canon Mensual CLP *</label>
                  <input
                    type="number"
                    value={newContractRent}
                    onChange={(e) => setNewContractRent(Number(e.target.value))}
                    className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#153B50] font-bold outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Reajuste Periódico</label>
                  <select
                    value={newContractIndex}
                    onChange={(e) => setNewContractIndex(e.target.value)}
                    className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#153B50] outline-none"
                  >
                    <option value="IPC Semestral">IPC Semestral</option>
                    <option value="UF Mensual">UF Mensual</option>
                    <option value="IPC Anual">IPC Anual</option>
                    <option value="Fijo sin reajuste">Fijo</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#008E88] hover:bg-[#08736E] text-white font-bold text-xs tracking-wider uppercase transition-all shadow-xs cursor-pointer mt-2"
              >
                Activar y Programar Cobranzas
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: PLANTILLAS Y VARIABLES (ALTENDA SCREENSHOT 2)            */}
      {/* ============================================================== */}
      {isTemplatesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <FileCode className="w-5 h-5 text-[#008E88]" />
                <h3 className="text-base font-bold text-[#153B50]">Plantillas y Variables Dinámicas</h3>
              </div>
              <button 
                onClick={() => setIsTemplatesModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-500">
              Utiliza estas variables en tus contratos tipo para que se completen de manera 100% automática al emitir documentos a tus clientes.
            </p>

            <div className="space-y-2.5 text-xs">
              {[
                { tag: '{{arrendatario_nombre}}', desc: 'Nombre completo o razón social del arrendatario' },
                { tag: '{{arrendatario_rut}}', desc: 'RUT chileno validado del arrendatario' },
                { tag: '{{propiedad_direccion}}', desc: 'Dirección completa, depto y comuna del inmueble' },
                { tag: '{{canon_pesos}}', desc: 'Monto mensual en CLP formateado ($)' },
                { tag: '{{reajuste_tipo}}', desc: 'Cláusula de reajuste (IPC Semestral / UF)' },
                { tag: '{{cuenta_banco}}', desc: 'Datos bancarios para transferencia de arriendos' },
                { tag: '{{representante_legal}}', desc: 'Nombre del representante legal de la corredora' }
              ].map((v, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                  <div>
                    <code className="text-[#008E88] font-mono font-bold text-xs">{v.tag}</code>
                    <p className="text-gray-500 text-[11px] mt-0.5">{v.desc}</p>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(v.tag);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white border border-gray-200 text-gray-600 hover:text-[#008E88] text-[10px] font-bold cursor-pointer"
                  >
                    Copiar
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <button
                onClick={() => setIsTemplatesModalOpen(false)}
                className="w-full py-2.5 rounded-xl bg-[#008E88] hover:bg-[#08736E] text-white font-bold text-xs cursor-pointer"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: NUEVO CLIENTE (ALTENDA SCREENSHOT 1)                     */}
      {/* ============================================================== */}
      {isNewClientModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gray-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="text-base font-bold text-[#153B50]">Agregar Nuevo Cliente</h3>
              <button 
                onClick={() => setIsNewClientModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newClientName.trim()) return;
                setShowDemoData(true);
                setIsNewClientModalOpen(false);
                setNewClientName('');
                setNewClientEmail('');
                setNewClientPhone('');
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Nombre Completo o Razón Social *</label>
                <input
                  type="text"
                  required
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  placeholder="ej. Gonzalo Vial"
                  className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#153B50] outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Correo Electrónico *</label>
                <input
                  type="email"
                  required
                  value={newClientEmail}
                  onChange={(e) => setNewClientEmail(e.target.value)}
                  placeholder="ej. cliente@correo.cl"
                  className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#153B50] outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Teléfono Móvil (WhatsApp) *</label>
                <input
                  type="tel"
                  required
                  value={newClientPhone}
                  onChange={(e) => setNewClientPhone(e.target.value)}
                  placeholder="+56 9 9123 4567"
                  className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#153B50] outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#008E88] hover:bg-[#08736E] text-white font-bold text-xs tracking-wider uppercase transition-all shadow-xs cursor-pointer mt-2"
              >
                Guardar Cliente
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: REGISTRAR GASTO / MANTENCIÓN (ALTENDA SCREENSHOT 4)     */}
      {/* ============================================================== */}
      {isNewExpenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gray-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="text-base font-bold text-[#153B50]">Registrar Gasto o Servicio</h3>
              <button 
                onClick={() => setIsNewExpenseModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const newTck: AgencyMaintenanceTicket = {
                  id: 'tck-' + Date.now(),
                  propertyAddress: newExpenseProp || (properties[0]?.address || 'Av. Las Condes 10450'),
                  category: newExpenseCat,
                  costEstimateCLP: newExpenseAmount,
                  description: newExpenseDesc.trim() || 'Servicio de mantenimiento preventivo',
                  assignedTechnician: 'Técnico SEC Autorizado Melsa',
                  status: 'en_curso'
                };
                setTickets(prev => [newTck, ...prev]);
                setShowDemoData(true);
                setIsNewExpenseModalOpen(false);
                setNewExpenseDesc('');
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Propiedad Asociada *</label>
                <select
                  value={newExpenseProp}
                  onChange={(e) => setNewExpenseProp(e.target.value)}
                  className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#153B50] outline-none"
                >
                  {properties.map(p => (
                    <option key={p.id} value={p.address}>{p.address}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Categoría</label>
                  <select
                    value={newExpenseCat}
                    onChange={(e) => setNewExpenseCat(e.target.value)}
                    className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#153B50] outline-none"
                  >
                    <option value="Gasfitería">Gasfitería</option>
                    <option value="Electricidad SEC">Electricidad SEC</option>
                    <option value="Pintura y Muros">Pintura y Muros</option>
                    <option value="Gasto Común">Gasto Común</option>
                    <option value="Cerrajería">Cerrajería</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Monto CLP *</label>
                  <input
                    type="number"
                    value={newExpenseAmount}
                    onChange={(e) => setNewExpenseAmount(Number(e.target.value))}
                    className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#153B50] font-bold outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Descripción del Trabajo</label>
                <textarea
                  rows={2}
                  value={newExpenseDesc}
                  onChange={(e) => setNewExpenseDesc(e.target.value)}
                  placeholder="ej. Reparación de monomando en baño principal"
                  className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#153B50] outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#008E88] hover:bg-[#08736E] text-white font-bold text-xs tracking-wider uppercase transition-all shadow-xs cursor-pointer mt-2"
              >
                Registrar Gasto
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: CREAR USUARIO (ALTENDA SCREENSHOT 5)                     */}
      {/* ============================================================== */}
      {isNewUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gray-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="text-base font-bold text-[#153B50]">Crear Nuevo Usuario</h3>
              <button 
                onClick={() => setIsNewUserModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newUserName.trim() || !newUserEmail.trim()) return;
                setTeamMembers(prev => [
                  ...prev,
                  {
                    id: 'usr-' + Date.now(),
                    name: newUserName,
                    email: newUserEmail,
                    role: newUserRole,
                    type: 'Cuenta de equipo'
                  }
                ]);
                setIsNewUserModalOpen(false);
                setNewUserName('');
                setNewUserEmail('');
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Nombre y Apellido *</label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="ej. Claudia Pizarro"
                  className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#153B50] outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Correo Electrónico (Acceso) *</label>
                <input
                  type="email"
                  required
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="ej. claudia@corredora.cl"
                  className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#153B50] outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Rol de Acceso</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as any)}
                  className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#153B50] outline-none"
                >
                  <option value="Colaborador">Colaborador (Acceso a captación y cartera)</option>
                  <option value="Administrador">Administrador (Control total y liquidaciones)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#008E88] hover:bg-[#08736E] text-white font-bold text-xs tracking-wider uppercase transition-all shadow-xs cursor-pointer mt-2"
              >
                Invitar al Equipo
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
