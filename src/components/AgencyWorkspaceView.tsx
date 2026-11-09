import React, { useState, useEffect, useRef } from 'react';
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
  Compass,
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
  Globe,
  Share2,
  Send,
  Bot,
  Eye,
  CheckCheck,
  BarChart2,
  Mic,
  Flame,
  Sliders,
  BarChart3,
  Activity,
  FileBarChart,
  RefreshCw,
  Play,
  Volume2,
  Target
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
import { extractPropertyWithGroq, ExtractedPropertyData } from '../services/propertyAiExtractor';

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
  // Navigation Vertical Tabs (Exact 13 modules from Altenda sidebar + Integraciones + Configuración + Superpoderes Proptech)
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'properties' | 'sales' | 'agenda' | 'clients' | 'contracts' | 
    'collections' | 'payments' | 'settlement' | 'portals' | 'maintenance' | 'users' | 'plans' |
    'settings' | 'integrations' | 'inbox' | 'matching'
  >('dashboard');

  // Superpoder 1: Inbox Omnicanal & Triage IA State
  const [inboxFilter, setInboxFilter] = useState<'all' | 'whatsapp' | 'instagram' | 'portales'>('all');
  const [selectedLeadId, setSelectedLeadId] = useState<string>('lead-1');
  const [inboxLeads, setInboxLeads] = useState([
    {
      id: 'lead-1',
      name: 'Camila Zúñiga Valdés',
      phone: '+56 9 8456 7890',
      channel: 'whatsapp',
      time: 'Hace 4 min',
      unread: true,
      lastMessage: 'Hola! Vi el departamento en Parque Araucano, ¿sigue disponible para visitar este sábado?',
      aiTriage: {
        intent: 'Arriendo',
        budget: '$850.000 / mes',
        commune: 'Las Condes',
        typology: '2D / 2B',
        urgency: 'Alta (Muda fin de mes)',
        qualificationScore: 96,
        summary: 'Lead altamente calificado. Cumple 3x renta con aval bancario listo.'
      },
      matchedPropertyId: 'prop-1'
    },
    {
      id: 'lead-2',
      name: 'Matías Edwards Larraín',
      phone: '+56 9 9234 5678',
      channel: 'portal_inmobiliario',
      time: 'Hace 28 min',
      unread: true,
      lastMessage: 'Estimados, me interesa agendar orden de visita para la casa en Los Pinos.',
      aiTriage: {
        intent: 'Compra',
        budget: '6.500 a 7.200 UF',
        commune: 'Lo Barnechea',
        typology: '4D / 4B',
        urgency: 'Media (Aprobación bancaria Scotia)',
        qualificationScore: 92,
        summary: 'Preaprobación hipotecaria activa en Scotiabank por 6.800 UF.'
      },
      matchedPropertyId: 'prop-3'
    },
    {
      id: 'lead-3',
      name: 'Ignacia Fontaine R.',
      phone: '+56 9 7321 0987',
      channel: 'instagram',
      time: 'Hace 1 hora',
      unread: false,
      lastMessage: 'Hola buenas tardes, ¿cuál es el gasto común del dúplex en El Golf?',
      aiTriage: {
        intent: 'Arriendo',
        budget: '$1.600.000 / mes',
        commune: 'Las Condes (El Golf)',
        typology: '3D / 3B Dúplex',
        urgency: 'Media',
        qualificationScore: 88,
        summary: 'Consulta específica de GGCC (~$280.000). Perfil profesional idóneo.'
      },
      matchedPropertyId: 'prop-2'
    }
  ]);
  const [chatReplyText, setChatReplyText] = useState('');
  const [chatSuccessNotice, setChatSuccessNotice] = useState<string | null>(null);

  // Superpoder 2: Smart Matching State
  const [matchingFilterProp, setMatchingFilterProp] = useState<string>('all');
  const [smartMatchSentAlert, setSmartMatchSentAlert] = useState<string | null>(null);

  // Superpoder 3: Multiposting & IA Listing Generator State
  const [multipostPlatforms, setMultipostPlatforms] = useState({
    portalInmobiliario: true,
    toctoc: true,
    yapo: true,
    enlace: false,
    sitioWeb: true
  });
  const [aiGeneratingCopy, setAiGeneratingCopy] = useState(false);
  const [aiGeneratedListingCopy, setAiGeneratedListingCopy] = useState('');
  const [isAiCopyModalOpen, setIsAiCopyModalOpen] = useState(false);

  // Superpoder 5: LegalTech Firma Electrónica Nativa State
  const [isLegalSignModalOpen, setIsLegalSignModalOpen] = useState(false);
  const [legalSignContract, setLegalSignContract] = useState<any>(null);
  const [isSigningProcess, setIsSigningProcess] = useState(false);
  const [signedDocCertificate, setSignedDocCertificate] = useState<string | null>(null);

  // KILLER 1: Ingesta Multimodal de Propiedades (Voz / PDF / Link) con Groq AI y Web Speech API
  const [isMultimodalModalOpen, setIsMultimodalModalOpen] = useState(false);
  const [multimodalTab, setMultimodalTab] = useState<'voice' | 'doc' | 'url'>('voice');
  const [isListeningVoice, setIsListeningVoice] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const speechRecognitionRef = useRef<any>(null);
  const [multimodalTranscript, setMultimodalTranscript] = useState('');
  const [multimodalUrlInput, setMultimodalUrlInput] = useState('https://www.portalinmobiliario.com/venta/departamento/providencia-metropolitana/123456');
  const [isProcessingMultimodal, setIsProcessingMultimodal] = useState(false);
  const [extractedPropertyResult, setExtractedPropertyResult] = useState<ExtractedPropertyData | null>(null);

  const toggleVoiceRecording = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechError('Tu navegador no soporta reconocimiento por voz nativo. Puedes escribir o pegar la descripción en el cuadro de texto.');
      return;
    }

    if (isListeningVoice) {
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.stop();
      }
      setIsListeningVoice(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'es-CL';
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListeningVoice(true);
        setSpeechError(null);
        setMultimodalTranscript(''); // Limpiar para captar tu voz en vivo desde cero
      };

      recognition.onresult = (event: any) => {
        let transcriptAccum = '';
        for (let i = 0; i < event.results.length; i++) {
          transcriptAccum += event.results[i][0].transcript;
        }
        if (transcriptAccum.trim()) {
          setMultimodalTranscript(transcriptAccum);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('SpeechRecognition error:', event.error);
        if (event.error === 'not-allowed') {
          setSpeechError('Permiso de micrófono denegado en tu navegador.');
        }
        setIsListeningVoice(false);
      };

      recognition.onend = () => {
        setIsListeningVoice(false);
      };

      speechRecognitionRef.current = recognition;
      recognition.start();
    } catch (e: any) {
      console.warn('Excepción al iniciar reconocimiento de voz:', e);
      setIsListeningVoice(false);
      setSpeechError('No se pudo acceder al micrófono.');
    }
  };

  // KILLER 2: Daily Copilot (Centro de Comando Proactivo)
  const [dismissedCopilotActions, setDismissedCopilotActions] = useState<string[]>([]);
  const [copilotActionNotice, setCopilotActionNotice] = useState<string | null>(null);

  // KILLER 3: Creador de Propuestas de Inversión (Pitch Generator / Dossier)
  const [isPitchGeneratorOpen, setIsPitchGeneratorOpen] = useState(false);
  const [pitchTargetInvestor, setPitchTargetInvestor] = useState('Gonzalo Vial Echenique');
  const [pitchPropertyId, setPitchPropertyId] = useState('prop-1');
  const [pitchDownPaymentPct, setPitchDownPaymentPct] = useState(20);
  const [pitchInterestRate, setPitchInterestRate] = useState(4.8);
  const [pitchLoanTermYears, setPitchLoanTermYears] = useState(25);
  const [pitchInflationUF, setPitchInflationUF] = useState(3.5);
  const [pitchGeneratingDossier, setPitchGeneratingDossier] = useState(false);
  const [pitchDossierReady, setPitchDossierReady] = useState(true);
  const [pitchCopiedNotice, setPitchCopiedNotice] = useState<string | null>(null);

  // KILLER 4: Smart Match Visual y Bidireccional
  const [propMatchesExpandedId, setPropMatchesExpandedId] = useState<string | null>(null);
  const [selectedLeadForMatch, setSelectedLeadForMatch] = useState<any | null>(null);
  const [isLeadMatchModalOpen, setIsLeadMatchModalOpen] = useState(false);

  // KILLER 5: Hub de Analítica de la Vitrina & Reporte Automático para Propietario
  const [isOwnerReportModalOpen, setIsOwnerReportModalOpen] = useState(false);
  const [ownerReportSentAlert, setOwnerReportSentAlert] = useState<string | null>(null);

  // Configuración View State (Altenda screenshot 3 & detailed subtabs)
  const [settingsTab, setSettingsTab] = useState<'legal' | 'contact' | 'payments' | 'notifications'>('legal');
  const [configCompanyName, setConfigCompanyName] = useState('Los Pinos');
  const [configRut, setConfigRut] = useState('15.883.974-1');
  const [configAddress, setConfigAddress] = useState('Los Pinos 356');
  const [configRepresentative, setConfigRepresentative] = useState('Alexis Rassmusen');
  const [configSavedNotice, setConfigSavedNotice] = useState(false);
  const [configBankTransferActive, setConfigBankTransferActive] = useState(true);
  const [configNotifDays, setConfigNotifDays] = useState(['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes']);
  const [configNotifFrom, setConfigNotifFrom] = useState('08:00');
  const [configNotifTo, setConfigNotifTo] = useState('18:00');
  const [configNotifFallback, setConfigNotifFallback] = useState('Anticipar al día habilitado anterior');
  const [configNotifFirstDays, setConfigNotifFirstDays] = useState(3);
  const [configNotifOverdueDays, setConfigNotifOverdueDays] = useState(3);
  const [configNotifHoursBefore, setConfigNotifHoursBefore] = useState(2);
  const [configNotifOwnerMandateDays, setConfigNotifOwnerMandateDays] = useState(14);
  const [configNotifSecondNotice, setConfigNotifSecondNotice] = useState(true);

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

  // Properties State (Persistente con LocalStorage)
  const [propertiesTab, setPropertiesTab] = useState<'active' | 'trash'>('active');
  const [properties, setProperties] = useState<AgencyPropertyItem[]>(() => {
    try {
      const saved = localStorage.getItem('melsa_agency_properties');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Error leyendo propiedades guardadas:', e);
    }
    return [
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
    ];
  });

  // Guardado persistente automático
  useEffect(() => {
    try {
      localStorage.setItem('melsa_agency_properties', JSON.stringify(properties));
    } catch (e) {
      console.warn('Error guardando propiedades:', e);
    }
  }, [properties]);
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
  const [portalPrimaryColor, setPortalPrimaryColor] = useState('#0F1115');
  const [portalAccentColor, setPortalAccentColor] = useState('#D02126');
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
    <div className="min-h-screen bg-[#FAF9F8] text-[#0F1115] flex flex-col font-sans">
      
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
              <span className="text-[#D02126] font-bold">↑</span>
              <span>UF: <strong>$41.295,46</strong></span>
            </span>
            <span className="flex items-center gap-1">
              <span className="text-[#D02126] font-bold">↑</span>
              <span>IPC: <strong>0,50%</strong></span>
            </span>
          </div>

          {/* Plan Pill */}
          <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs bg-rose-50 text-[#D02126] border border-rose-200/80">
            <span className="font-semibold">
              Plan {currentPlan.toUpperCase()} · Sello MELSA
            </span>
            <button
              onClick={() => setActiveTab('plans')}
              className="font-bold text-[#D02126] hover:underline cursor-pointer ml-1"
            >
              Registrar tarjeta
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
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#D02126]" />
          </button>

          <button 
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`p-2 rounded-xl transition-colors cursor-pointer ${
              activeTab === 'settings' ? 'text-[#D02126] bg-rose-50' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'
            }`}
            title="Configuración de Corredora"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* User Profile Pill */}
          <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
            <div className="w-8 h-8 rounded-full bg-[#0F1115] text-white font-bold flex items-center justify-center text-xs shadow-xs border border-[#D02126]/30">
              {representativeName.charAt(0) || 'A'}
            </div>
            <div className="hidden md:block text-left text-xs leading-tight">
              <span className="font-bold text-[#0F1115] block">{representativeName}</span>
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
        
        {/* LEFT VERTICAL SIDEBAR (MELSA EXECUTIVE WORKSPACE OS) */}
        <aside className="w-64 bg-[#0F1115] border-r border-white/5 shrink-0 flex flex-col justify-between py-4 px-3 overflow-y-auto">
          <div className="space-y-4">

            {/* GRUPO 1: COMANDO AGÉNTICO */}
            <div className="space-y-1">
              <span className="px-3 text-[10px] uppercase font-bold tracking-widest text-[#D02126] flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" />
                <span>Comando Agéntico</span>
              </span>
              <div className="space-y-0.5 pt-1">
                {[
                  { id: 'dashboard', label: 'Panel General', icon: LayoutDashboard },
                  { id: 'inbox', label: 'Inbox Omnicanal (IA)', icon: MessageCircle, badge: '3 leads', badgeStyle: 'bg-[#D02126] text-white' },
                  { id: 'matching', label: 'Smart Matching (IA)', icon: Sparkles, badge: 'Auto', badgeStyle: 'bg-white/10 text-amber-300' }
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as any)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left border-l-2 ${
                        isActive
                          ? 'bg-[#1A1D23] text-white font-bold border-[#D02126]'
                          : 'text-gray-400 hover:text-white hover:bg-white/5 border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#D02126]' : 'text-gray-500'}`} />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${item.badgeStyle}`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* GRUPO 2: CARTERA & CIERRE */}
            <div className="space-y-1">
              <span className="px-3 text-[10px] uppercase font-bold tracking-widest text-gray-500">
                Cartera & Cierre
              </span>
              <div className="space-y-0.5 pt-1">
                {[
                  { id: 'properties', label: 'Propiedades', icon: Home },
                  { id: 'sales', label: 'Cartera de Ventas', icon: Building2 },
                  { id: 'agenda', label: 'Agenda & Visitas', icon: Calendar },
                  { id: 'clients', label: 'Clientes & Inversionistas', icon: Users }
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as any)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left border-l-2 ${
                        isActive
                          ? 'bg-[#1A1D23] text-white font-bold border-[#D02126]'
                          : 'text-gray-400 hover:text-white hover:bg-white/5 border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#D02126]' : 'text-gray-500'}`} />
                        <span className="truncate">{item.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* GRUPO 3: GESTIÓN & FINANZAS */}
            <div className="space-y-1">
              <span className="px-3 text-[10px] uppercase font-bold tracking-widest text-gray-500">
                Gestión & Finanzas
              </span>
              <div className="space-y-0.5 pt-1">
                {[
                  { id: 'contracts', label: 'Contratos & Ley 19.799', icon: FileText },
                  { id: 'collections', label: 'Cobranzas', icon: Receipt },
                  { id: 'payments', label: 'Pagos & Abonos', icon: CreditCard },
                  { id: 'settlement', label: 'Liquidaciones (7%)', icon: FileSpreadsheet },
                  { id: 'maintenance', label: 'Gastos & Servicios SEC', icon: Wrench }
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as any)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left border-l-2 ${
                        isActive
                          ? 'bg-[#1A1D23] text-white font-bold border-[#D02126]'
                          : 'text-gray-400 hover:text-white hover:bg-white/5 border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#D02126]' : 'text-gray-500'}`} />
                        <span className="truncate">{item.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* GRUPO 4: PLATAFORMA & MARCA */}
            <div className="space-y-1">
              <span className="px-3 text-[10px] uppercase font-bold tracking-widest text-gray-500">
                Plataforma
              </span>
              <div className="space-y-0.5 pt-1">
                {[
                  { id: 'portals', label: 'Portales & Vitrina', icon: Layers },
                  { id: 'users', label: 'Equipo & Roles', icon: UserPlus },
                  { id: 'plans', label: 'Mi Plan Melsa', icon: Sparkles }
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as any)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left border-l-2 ${
                        isActive
                          ? 'bg-[#1A1D23] text-white font-bold border-[#D02126]'
                          : 'text-gray-400 hover:text-white hover:bg-white/5 border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#D02126]' : 'text-gray-500'}`} />
                        <span className="truncate">{item.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Quick Setup Shortcut Sello Melsa */}
          <div className="pt-4 border-t border-white/10">
            <button
              onClick={onOpenOnboarding}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-[11px] font-semibold text-gray-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer border border-white/10"
            >
              <span className="flex items-center gap-1.5 font-bold">
                <span className="w-2 h-2 rounded-full bg-[#D02126]" />
                Activación de Corredora
              </span>
              <span className="text-[10px] text-emerald-300 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">88%</span>
            </button>
          </div>
        </aside>

        {/* MAIN VIEW CONTAINER */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8 bg-[#FAF9F8]">
          <div className="max-w-6xl mx-auto space-y-6">
            
            {/* ========================================================== */}
            {/* TAB 1: PANEL GENERAL (SCREENSHOTS 1 & 2 EXACT MATCH)      */}
            {/* ========================================================== */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                
                {/* Header Welcome + Quick Tools CTA */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F1115]">
                      Hola, {representativeName.split(' ')[0]}!
                    </h1>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Tu espacio de trabajo agéntico ha pre-procesado las tareas críticas de hoy.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsMultimodalModalOpen(true)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-[#D02126] hover:from-emerald-700 hover:to-[#B81B1F] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                      title="Ingesta por Voz o Documento"
                    >
                      <Mic className="w-3.5 h-3.5" />
                      <span>Ingesta por Voz / PDF</span>
                    </button>

                    <button
                      onClick={() => setIsPitchGeneratorOpen(true)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#0F1115] hover:bg-[#0A2230] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                      title="Generador de Dossier Financiero"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>Pitch Generator</span>
                    </button>

                    <button
                      onClick={() => {
                        if (onBackToHome) {
                          onBackToHome();
                          setTimeout(() => {
                            const el = document.getElementById('vender');
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                          }, 150);
                        } else {
                          const el = document.getElementById('vender');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 hover:border-[#D02126] text-[#0F1115] text-xs font-bold transition-all shadow-2xs cursor-pointer"
                      title="Motor de Tasación Inmobiliaria AVM (NCh 3658)"
                    >
                      <Compass className="w-3.5 h-3.5 text-[#D02126]" />
                      <span>Tasador AVM / CMA</span>
                    </button>

                    <button
                      onClick={() => setIsAddingPropertyModal(true)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-bold transition-all cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#D02126]" />
                      <span>Nueva propiedad</span>
                    </button>
                  </div>
                </div>

                {/* KILLER 2: CENTRO DE COMANDO PROACTIVO (DAILY COPILOT) */}
                <div className="bg-gradient-to-br from-[#0F1115] via-[#1A181C] to-[#0A0C0F] rounded-3xl p-6 text-white shadow-xl space-y-4 border border-[#D02126]/30">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#D02126] to-[#B81B1F] text-white flex items-center justify-center shadow-md">
                        <Bot className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-white tracking-tight">MELSA Copilot Pro</h3>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#D02126]/20 text-rose-300 border border-[#D02126]/40">
                            3 Acciones Sugeridas
                          </span>
                        </div>
                        <p className="text-xs text-gray-300">
                          Acciones que el sistema ya analizó para que solo revises y tomes decisiones.
                        </p>
                      </div>
                    </div>

                    <span className="text-xs text-rose-300 font-mono font-medium flex items-center gap-1.5 self-start sm:self-auto bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                      <span className="w-2 h-2 rounded-full bg-[#D02126] animate-ping" />
                      Motor Agéntico MELSA Activo
                    </span>
                  </div>

                  {copilotActionNotice && (
                    <div className="p-3 bg-[#D02126]/20 border border-[#D02126]/40 rounded-2xl text-xs text-rose-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>{copilotActionNotice}</span>
                      </div>
                      <button 
                        onClick={() => setCopilotActionNotice(null)}
                        className="text-gray-300 hover:text-white text-xs cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                  )}

                  {/* Priority Triage Action Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                    
                    {/* Action 1: Hot Lead */}
                    <div className="bg-white/5 hover:bg-white/10 transition-colors border border-white/10 rounded-2xl p-4 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                            <Flame className="w-3 h-3 text-amber-400" />
                            Lead Caliente
                          </span>
                          <span className="text-[10px] text-gray-400">Hace 4 hrs</span>
                        </div>
                        <h4 className="text-xs font-bold text-white">Matías Edwards evaluó simulación</h4>
                        <p className="text-[11px] text-gray-300 mt-1 leading-snug">
                          Calculó 3 veces el Cap Rate (5.8%) de Los Pinos 356. Cuenta con crédito pre-aprobado.
                        </p>
                      </div>

                      <div className="pt-2 border-t border-white/10 flex items-center gap-1.5">
                        <a
                          href={`https://wa.me/56991234567?text=${encodeURIComponent('Hola Matías, vi que estuviste simulando el retorno de Los Pinos 356. ¿Te gustaría que te prepare el Dossier Ejecutivo de inversión con el flujo de caja neto?')}`}
                          target="_blank"
                          rel="noreferrer"
                          onClick={() => {
                            setCopilotActionNotice('✓ ¡WhatsApp comercial enviado a Matías Edwards con pitch de inversión!');
                          }}
                          className="flex-1 py-1.5 px-2 rounded-xl bg-[#D02126] hover:bg-[#B81B1F] text-white text-[11px] font-bold text-center transition-colors flex items-center justify-center gap-1"
                        >
                          <Zap className="w-3 h-3 text-amber-300" />
                          <span>WhatsApp Pitch</span>
                        </a>
                        <button
                          onClick={() => {
                            setPitchTargetInvestor('Matías Edwards');
                            setIsPitchGeneratorOpen(true);
                          }}
                          className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs cursor-pointer"
                          title="Abrir Pitch Generator"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        </button>
                      </div>
                    </div>

                    {/* Action 2: Deadline Promesa */}
                    <div className="bg-white/5 hover:bg-white/10 transition-colors border border-white/10 rounded-2xl p-4 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-rose-400" />
                            Vence en 48 hrs
                          </span>
                          <span className="text-[10px] text-gray-400">LegalTech</span>
                        </div>
                        <h4 className="text-xs font-bold text-white">Promesa MEL-801 Los Pinos</h4>
                        <p className="text-[11px] text-gray-300 mt-1 leading-snug">
                          Falta firma electrónica de la parte compradora. Documento listo en Ley 19.799.
                        </p>
                      </div>

                      <div className="pt-2 border-t border-white/10 flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setLegalSignContract(contracts[0]);
                            setIsLegalSignModalOpen(true);
                          }}
                          className="flex-1 py-1.5 px-2 rounded-xl bg-[#0F1115] hover:bg-black text-white text-[11px] font-bold text-center transition-colors flex items-center justify-center gap-1 cursor-pointer border border-white/20"
                        >
                          <ShieldCheck className="w-3 h-3 text-rose-400" />
                          <span>Firma Ley 19.799</span>
                        </button>
                        <button
                          onClick={() => {
                            setCopilotActionNotice('✓ Notificación enviada al comprador extendiendo 5 días hábiles.');
                          }}
                          className="px-2 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white text-[10px] font-bold cursor-pointer"
                        >
                          +5 días
                        </button>
                      </div>
                    </div>

                    {/* Action 3: Cold Lead Match */}
                    <div className="bg-white/5 hover:bg-white/10 transition-colors border border-white/10 rounded-2xl p-4 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1">
                            <Target className="w-3 h-3 text-blue-400" />
                            Match 98%
                          </span>
                          <span className="text-[10px] text-gray-400">Reactivación</span>
                        </div>
                        <h4 className="text-xs font-bold text-white">Camila Soto busca en Providencia</h4>
                        <p className="text-[11px] text-gray-300 mt-1 leading-snug">
                          El departamento recién ingresado calza exactamente en su presupuesto de $800.000.
                        </p>
                      </div>

                      <div className="pt-2 border-t border-white/10 flex items-center gap-1.5">
                        <a
                          href={`https://wa.me/56987654321?text=${encodeURIComponent('Hola Camila! Acaba de ingresar a nuestra cartera un departamento en Providencia 2D/2B que coincide al 98% con lo que buscabas. Te adjunto la ficha antes de que se publique masivamente.')}`}
                          target="_blank"
                          rel="noreferrer"
                          onClick={() => {
                            setCopilotActionNotice('✓ Ficha exclusiva enviada a Camila Soto por WhatsApp.');
                          }}
                          className="flex-1 py-1.5 px-2 rounded-xl bg-[#D02126] hover:bg-[#B81B1F] text-white text-[11px] font-bold text-center transition-colors flex items-center justify-center gap-1"
                        >
                          <Send className="w-3 h-3" />
                          <span>Despachar Ficha</span>
                        </a>
                      </div>
                    </div>

                  </div>
                </div>

                {/* 4 Top Metric Cards (MELSA Executive KPI Cards - NO MORE PASTEL CLONES / NO NaN) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  
                  {/* Card 1: Propiedades activas */}
                  <div 
                    onClick={() => setActiveTab('properties')}
                    className="bg-white p-5 rounded-3xl flex flex-col justify-between transition-all hover:shadow-md cursor-pointer border border-gray-200/80 hover:border-[#D02126]/40 group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-2xl bg-rose-50 text-[#D02126] flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Home className="w-5 h-5" />
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-[#D02126] transition-colors" />
                    </div>
                    <div className="my-4">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Propiedades Activas</span>
                      <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0F1115] tabular-nums block mt-1">{properties.length}</span>
                    </div>
                    <span className="text-xs font-bold text-[#D02126] group-hover:underline flex items-center gap-1">
                      Ver cartera →
                    </span>
                  </div>

                  {/* Card 2: Contratos vigentes */}
                  <div 
                    onClick={() => setActiveTab('contracts')}
                    className="bg-white p-5 rounded-3xl flex flex-col justify-between transition-all hover:shadow-md cursor-pointer border border-gray-200/80 hover:border-[#0F1115]/30 group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-2xl bg-gray-100 text-[#0F1115] flex items-center justify-center group-hover:scale-105 transition-transform">
                        <FileText className="w-5 h-5" />
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-[#0F1115] transition-colors" />
                    </div>
                    <div className="my-4">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Contratos Vigentes</span>
                      <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0F1115] tabular-nums block mt-1">{contracts.length}</span>
                    </div>
                    <span className="text-xs font-bold text-[#0F1115] group-hover:underline flex items-center gap-1">
                      Ver contratos →
                    </span>
                  </div>

                  {/* Card 3: Cobranza del mes */}
                  <div 
                    onClick={() => setActiveTab('collections')}
                    className="bg-white p-5 rounded-3xl flex flex-col justify-between transition-all hover:shadow-md cursor-pointer border border-gray-200/80 hover:border-[#D02126]/40 group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-2xl bg-rose-50 text-[#D02126] flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Receipt className="w-5 h-5" />
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-[#D02126] transition-colors" />
                    </div>
                    <div className="my-4">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Cobranza Proyectada</span>
                      <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#D02126] tabular-nums block mt-1">
                        {formatCLP(contracts.reduce((acc, c) => acc + (c.rentAmountCLP || (c as any).rentCLP || 0), 0) || 3280000)}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-[#D02126] group-hover:underline flex items-center gap-1">
                      Ver cobranzas →
                    </span>
                  </div>

                  {/* Card 4: Pagos del mes */}
                  <div 
                    onClick={() => setActiveTab('payments')}
                    className="bg-white p-5 rounded-3xl flex flex-col justify-between transition-all hover:shadow-md cursor-pointer border border-gray-200/80 hover:border-amber-400/40 group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-amber-700 transition-colors" />
                    </div>
                    <div className="my-4">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Pagos Conciliados</span>
                      <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0F1115] tabular-nums block mt-1">$0</span>
                    </div>
                    <span className="text-xs font-bold text-amber-800 group-hover:underline flex items-center gap-1">
                      Ver conciliación →
                    </span>
                  </div>

                </div>

                {/* Mid Row: Resumen Financiero + Últimos seis meses */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                  
                  {/* Resumen Financiero */}
                  <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-gray-200/80 shadow-2xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                        <Building2 className="w-4 h-4 text-[#D02126]" />
                        <span>Resumen financiero</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">Movimientos del mes actual, en pesos chilenos.</p>
                      
                      <button
                        onClick={() => setActiveTab('payments')}
                        className="text-xs font-bold text-[#D02126] hover:underline mt-2 inline-flex items-center gap-1 cursor-pointer"
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
                          <span className="font-bold text-[#0F1115]">$0</span>
                        </div>

                        <div className="flex items-center justify-between text-xs py-1.5 border-b border-gray-50">
                          <span className="text-gray-600 flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-gray-400" />
                            <span>Cargos programados</span>
                          </span>
                          <span className="font-bold text-[#0F1115]">$0</span>
                        </div>

                        <div className="flex items-center justify-between text-xs py-1.5">
                          <span className="text-gray-600 flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-gray-400" />
                            <span>Contactos</span>
                          </span>
                          <span className="font-bold text-[#0F1115]">{contracts.length * 2}</span>
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
                      <TrendingUp className="w-4 h-4 text-[#D02126]" />
                      <span>Últimos seis meses</span>
                    </div>

                    <div className="my-auto py-8 text-center max-w-md mx-auto space-y-3">
                      <div className="w-14 h-14 rounded-2xl bg-[#FDE8E9] text-[#D02126] flex items-center justify-center mx-auto">
                        <Home className="w-7 h-7" />
                      </div>
                      <h4 className="text-base font-bold text-[#0F1115]">
                        Tu corredora, conectada
                      </h4>
                      <p className="text-xs text-gray-500 leading-relaxed font-light">
                        Organiza arriendos y ventas, coordina visitas y comparte documentos con tus clientes desde un solo lugar.
                      </p>
                      <button
                        onClick={() => setActiveTab('integrations')}
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#D02126] hover:underline cursor-pointer pt-1"
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
                        <Home className="w-4 h-4 text-[#D02126]" />
                        <span>Propiedades recientes</span>
                      </div>
                      <button
                        onClick={() => setActiveTab('properties')}
                        className="text-xs font-bold text-[#D02126] hover:underline cursor-pointer"
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
                          className="px-4 py-2 rounded-xl bg-[#D02126] hover:bg-[#B81B1F] text-white text-xs font-bold cursor-pointer"
                        >
                          + Agregar propiedad
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {properties.slice(0, 3).map((prop) => (
                          <div 
                            key={prop.id} 
                            className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 hover:bg-[#FDE8E9]/50 border border-gray-100 transition-colors cursor-pointer"
                            onClick={() => setActiveTab('properties')}
                          >
                            <div className="flex items-center gap-3">
                              <img 
                                src={prop.coverPhoto} 
                                alt={prop.title} 
                                className="w-12 h-12 rounded-xl object-cover" 
                              />
                              <div>
                                <span className="text-xs font-bold text-[#0F1115] block">{prop.address}</span>
                                <span className="text-[10px] text-gray-400 block">{prop.commune} · {prop.bedrooms}D/{prop.bathrooms}B</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-xs font-bold text-[#D02126] block">{formatCLP(prop.rentCLP)}/mes</span>
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
                      <LayoutDashboard className="w-4 h-4 text-[#D02126]" />
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
                              <div className="w-8 h-8 rounded-xl bg-gray-100 text-[#D02126] flex items-center justify-center group-hover:bg-[#FDE8E9]">
                                <Icon className="w-4 h-4" />
                              </div>
                              <div>
                                <span className="text-xs font-bold text-[#0F1115] block">{item.label}</span>
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
            {/* SUPERPODER 1: INBOX OMNICANAL & TRIAGE INTELIGENTE (IA)    */}
            {/* ========================================================== */}
            {activeTab === 'inbox' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F1115] flex items-center gap-2">
                      <MessageCircle className="w-6 h-6 text-[#D02126]" />
                      <span>Inbox Omnicanal & Triage con IA</span>
                    </h1>
                    <p className="text-xs text-gray-500 mt-1">
                      Centraliza WhatsApp, Instagram, Facebook y formularios web en una sola bandeja. Tu copiloto de IA perfila a los leads 24/7.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Agente IA Activo · 24/7</span>
                    </span>
                  </div>
                </div>

                {chatSuccessNotice && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{chatSuccessNotice}</span>
                  </div>
                )}

                {/* 2-Column Omnichannel Split: Leads list + AI Conversation Workspace */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Left Column: Unified Leads List */}
                  <div className="lg:col-span-5 bg-white rounded-3xl p-5 border border-gray-200/90 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                      <span className="text-xs font-bold text-gray-700">Conversaciones entrantes ({inboxLeads.length})</span>
                      <div className="flex items-center gap-1 text-[11px]">
                        <button
                          onClick={() => setInboxFilter('all')}
                          className={`px-2 py-0.5 rounded-lg font-bold cursor-pointer transition-colors ${
                            inboxFilter === 'all' ? 'bg-[#FDE8E9] text-[#D02126]' : 'text-gray-400 hover:text-gray-600'
                          }`}
                        >
                          Todos
                        </button>
                        <button
                          onClick={() => setInboxFilter('whatsapp')}
                          className={`px-2 py-0.5 rounded-lg font-bold cursor-pointer transition-colors ${
                            inboxFilter === 'whatsapp' ? 'bg-emerald-50 text-emerald-700' : 'text-gray-400 hover:text-gray-600'
                          }`}
                        >
                          WhatsApp
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {inboxLeads
                        .filter(l => inboxFilter === 'all' || l.channel === inboxFilter)
                        .map((lead) => {
                          const isSelected = lead.id === selectedLeadId;
                          return (
                            <div
                              key={lead.id}
                              onClick={() => {
                                setSelectedLeadId(lead.id);
                                setChatReplyText(`Hola ${lead.name.split(' ')[0]}! Sí, la propiedad sigue disponible. ¿Te acomoda visitarla este sábado a las 11:30 hrs? Te comparto el enlace con la ficha técnica completa.`);
                              }}
                              className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                                isSelected
                                  ? 'bg-[#F4F9F8] border-[#D02126] shadow-xs ring-1 ring-[#D02126]/20'
                                  : 'bg-white border-gray-100 hover:border-gray-200 hover:bg-gray-50/50'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-full bg-[#FDE8E9] text-[#D02126] font-bold flex items-center justify-center text-xs">
                                    {lead.name.charAt(0)}
                                  </div>
                                  <div>
                                    <span className="font-bold text-xs text-[#0F1115] block">{lead.name}</span>
                                    <span className="text-[10px] text-gray-400 font-mono">{lead.phone}</span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <span className="text-[10px] text-gray-400 block">{lead.time}</span>
                                  <span className={`inline-block mt-0.5 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                                    lead.channel === 'whatsapp' ? 'bg-emerald-100 text-emerald-800' :
                                    lead.channel === 'portal_inmobiliario' ? 'bg-amber-100 text-amber-800' : 'bg-purple-100 text-purple-800'
                                  }`}>
                                    {lead.channel === 'whatsapp' ? 'WhatsApp' : lead.channel === 'portal_inmobiliario' ? 'Portal Inmob' : 'Instagram'}
                                  </span>
                                </div>
                              </div>

                              <p className="text-xs text-gray-600 line-clamp-2 font-light">
                                "{lead.lastMessage}"
                              </p>

                              {/* AI Triage Mini Tag */}
                              <div className="pt-2 border-t border-gray-100/60 flex items-center justify-between text-[11px]">
                                <span className="text-gray-500 font-medium">
                                  {lead.aiTriage.intent} · {lead.aiTriage.typology}
                                </span>
                                <span className="font-bold text-[#D02126] bg-emerald-50 px-2 py-0.5 rounded-full">
                                  {lead.aiTriage.qualificationScore}% Score
                                </span>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>

                  {/* Right Column: AI Triage Copilot + Conversation Thread */}
                  {(() => {
                    const activeLead = inboxLeads.find(l => l.id === selectedLeadId) || inboxLeads[0];
                    return (
                      <div className="lg:col-span-7 space-y-5">
                        
                        {/* AI Triage Profile Card */}
                        <div className="bg-white rounded-3xl p-6 border border-gray-200/90 shadow-2xs space-y-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                            <div>
                              <div className="flex items-center gap-2">
                                <Bot className="w-5 h-5 text-[#D02126]" />
                                <h3 className="text-base font-bold text-[#0F1115]">Perfil Calificado por IA</h3>
                              </div>
                              <p className="text-xs text-gray-500 mt-0.5">
                                Analizado automáticamente al ingresar el mensaje del lead.
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                                {activeLead.aiTriage.qualificationScore} / 100 Calificación
                              </span>
                            </div>
                          </div>

                          {/* Hard Variables Extracted by AI */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                            <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100">
                              <span className="text-[10px] uppercase font-bold text-gray-400 block">Intención</span>
                              <span className="font-bold text-[#0F1115] block mt-0.5">{activeLead.aiTriage.intent}</span>
                            </div>
                            <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100">
                              <span className="text-[10px] uppercase font-bold text-gray-400 block">Presupuesto</span>
                              <span className="font-bold text-[#D02126] block mt-0.5">{activeLead.aiTriage.budget}</span>
                            </div>
                            <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100">
                              <span className="text-[10px] uppercase font-bold text-gray-400 block">Ubicación</span>
                              <span className="font-bold text-[#0F1115] block mt-0.5">{activeLead.aiTriage.commune}</span>
                            </div>
                            <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100">
                              <span className="text-[10px] uppercase font-bold text-gray-400 block">Urgencia</span>
                              <span className="font-bold text-amber-700 block mt-0.5">{activeLead.aiTriage.urgency}</span>
                            </div>
                          </div>

                          <div className="p-3 rounded-2xl bg-[#F0F7F6] border border-[#CDEAE6] text-xs space-y-1">
                            <span className="font-bold text-[#0F1115] flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-[#D02126]" />
                              <span>Diagnóstico de Cierre</span>
                            </span>
                            <p className="text-gray-600 leading-relaxed">
                              {activeLead.aiTriage.summary}
                            </p>
                          </div>
                        </div>

                        {/* Interactive Message + Fast Action Reply */}
                        <div className="bg-white rounded-3xl p-6 border border-gray-200/90 shadow-2xs space-y-4">
                          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                            <div>
                              <span className="font-bold text-xs text-[#0F1115] block">{activeLead.name}</span>
                              <span className="text-[11px] text-gray-400 font-mono">{activeLead.phone}</span>
                            </div>
                            <a
                              href={`https://wa.me/${activeLead.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(chatReplyText || activeLead.lastMessage)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
                            >
                              <Phone className="w-3.5 h-3.5" />
                              <span>Abrir en WhatsApp</span>
                            </a>
                          </div>

                          {/* Message Bubble Incoming */}
                          <div className="bg-[#FAF9F8] p-4 rounded-2xl border border-gray-100 space-y-1 max-w-lg">
                            <span className="text-[10px] font-bold text-[#D02126] block">Mensaje del Lead</span>
                            <p className="text-xs text-gray-700 leading-relaxed font-normal">
                              "{activeLead.lastMessage}"
                            </p>
                          </div>

                          {/* AI Suggested Response Box */}
                          <div className="space-y-2 pt-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-gray-700 flex items-center gap-1">
                                <Sparkles className="w-3.5 h-3.5 text-[#D02126]" />
                                <span>Respuesta Sugerida por Copiloto de Ventas</span>
                              </span>
                              <button
                                onClick={() => setChatReplyText(`Hola ${activeLead.name.split(' ')[0]}! Sí, la propiedad sigue disponible. ¿Te acomoda visitarla este sábado a las 11:30 hrs? Te comparto el enlace con la ficha técnica completa.`)}
                                className="text-[#D02126] hover:underline font-bold cursor-pointer"
                              >
                                Regenerar con IA
                              </button>
                            </div>

                            <textarea
                              rows={3}
                              value={chatReplyText || `Hola ${activeLead.name.split(' ')[0]}! Sí, la propiedad sigue disponible. ¿Te acomoda visitarla este sábado a las 11:30 hrs? Te comparto el enlace con la ficha técnica completa.`}
                              onChange={(e) => setChatReplyText(e.target.value)}
                              className="w-full bg-[#FAF9F8] border border-gray-200 rounded-2xl p-3.5 text-xs text-gray-700 focus:outline-none focus:border-[#D02126] leading-relaxed"
                            />

                            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => {
                                    setActiveTab('agenda');
                                    setIsAddingActivityModal(true);
                                  }}
                                  className="px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs cursor-pointer flex items-center gap-1.5"
                                >
                                  <Calendar className="w-3.5 h-3.5 text-[#D02126]" />
                                  <span>Agendar Visita</span>
                                </button>
                                <button
                                  onClick={() => {
                                    setActiveTab('sales');
                                  }}
                                  className="px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs cursor-pointer flex items-center gap-1.5"
                                >
                                  <Building2 className="w-3.5 h-3.5 text-[#D02126]" />
                                  <span>Mover a Pipeline</span>
                                </button>
                              </div>

                              <button
                                onClick={() => {
                                  setChatSuccessNotice(`¡Respuesta enviada a ${activeLead.name} vía WhatsApp y registrada en el CRM!`);
                                  setTimeout(() => setChatSuccessNotice(null), 3500);
                                }}
                                className="px-5 py-2.5 rounded-xl bg-[#D02126] hover:bg-[#B81B1F] text-white font-bold text-xs shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center gap-2"
                              >
                                <Send className="w-3.5 h-3.5" />
                                <span>Enviar Respuesta & Registrar</span>
                              </button>
                            </div>
                          </div>
                        </div>

                      </div>
                    );
                  })()}

                </div>
              </div>
            )}

            {/* ========================================================== */}
            {/* SUPERPODER 2: SMART MATCHING (CRUCE DE DEMANDAS CON IA)    */}
            {/* ========================================================== */}
            {activeTab === 'matching' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F1115] flex items-center gap-2">
                      <Sparkles className="w-6 h-6 text-[#D02126]" />
                      <span>Smart Matching (Cruce Automático de Demandas)</span>
                    </h1>
                    <p className="text-xs text-gray-500 mt-1">
                      El algoritmo de cruce analiza en tiempo real tu inventario de propiedades y te muestra qué clientes están buscando exactamente lo que tienes para cerrar en 1 clic.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <select
                      value={matchingFilterProp}
                      onChange={(e) => setMatchingFilterProp(e.target.value)}
                      className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-700 outline-none shadow-2xs cursor-pointer"
                    >
                      <option value="all">Todas las propiedades ({properties.length})</option>
                      {properties.map(p => (
                        <option key={p.id} value={p.id}>{p.title}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {smartMatchSentAlert && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{smartMatchSentAlert}</span>
                  </div>
                )}

                {/* Grid of Matches */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {[
                    {
                      id: 'match-1',
                      score: 96,
                      propTitle: 'Depto Parque Araucano',
                      propPrice: '$850.000 / mes',
                      prospectName: 'Camila Zúñiga Valdés',
                      prospectPhone: '+56 9 8456 7890',
                      budget: '$900.000 max',
                      demandReason: 'Busca 2D/2B en Las Condes con mudanza urgente a fin de mes. Aprobación financiera 3x renta.',
                      propId: 'prop-1'
                    },
                    {
                      id: 'match-2',
                      score: 93,
                      propTitle: 'Casa Mediterránea Los Pinos',
                      propPrice: '6.500 UF',
                      prospectName: 'Matías Edwards Larraín',
                      prospectPhone: '+56 9 9234 5678',
                      budget: '7.000 UF',
                      demandReason: 'Preaprobación bancaria activa en Scotiabank para casa familiar en Lo Barnechea.',
                      propId: 'prop-3'
                    },
                    {
                      id: 'match-3',
                      score: 89,
                      propTitle: 'Penthouse Dúplex El Golf',
                      propPrice: '$1.650.000 / mes',
                      prospectName: 'Ignacia Fontaine R.',
                      prospectPhone: '+56 9 7321 0987',
                      budget: '$1.700.000 max',
                      demandReason: 'Interesada en terraza con quincho y cercanía a barrio financiero El Golf.',
                      propId: 'prop-2'
                    }
                  ]
                    .filter(m => matchingFilterProp === 'all' || m.propId === matchingFilterProp)
                    .map((match) => (
                      <div
                        key={match.id}
                        className="bg-white rounded-3xl p-6 border border-gray-200 shadow-2xs flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="px-3 py-1 rounded-full bg-[#FDE8E9] text-[#D02126] text-xs font-bold flex items-center gap-1">
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>{match.score}% Cruce Perfecto</span>
                            </span>
                            <span className="text-xs font-mono font-bold text-[#0F1115]">{match.propPrice}</span>
                          </div>

                          <div>
                            <h4 className="text-sm font-bold text-[#0F1115] leading-snug">{match.propTitle}</h4>
                            <p className="text-[11px] text-gray-400 mt-0.5">Prospecto compatible:</p>
                            <span className="text-xs font-bold text-[#D02126] block">{match.prospectName}</span>
                          </div>

                          <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100 text-xs space-y-1">
                            <span className="text-[10px] uppercase font-bold text-gray-400 block">Motivo del Match</span>
                            <p className="text-gray-600 text-[11px] leading-relaxed">
                              {match.demandReason}
                            </p>
                          </div>
                        </div>

                        <div className="pt-2">
                          <button
                            onClick={() => {
                              const msg = `Hola ${match.prospectName.split(' ')[0]}! Te contacto de la corredora Los Pinos. Acaba de ingresar una propiedad que coincide en 96% con lo que buscas: ${match.propTitle} (${match.propPrice}). ¿Te gustaría coordinar una visita exclusiva?`;
                              window.open(`https://wa.me/${match.prospectPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
                              setSmartMatchSentAlert(`¡Ficha comercial enviada con éxito por WhatsApp a ${match.prospectName}!`);
                              setTimeout(() => setSmartMatchSentAlert(null), 3000);
                            }}
                            className="w-full py-2.5 rounded-xl bg-[#D02126] hover:bg-[#B81B1F] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Enviar Ficha por WhatsApp (1 Clic)</span>
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
            {activeTab === 'properties' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F1115]">
                      Propiedades
                    </h1>
                    <div className="flex items-center gap-4 text-xs font-semibold text-gray-500 mt-1">
                      <button
                        onClick={() => setPropertiesTab('active')}
                        className={`transition-colors cursor-pointer ${
                          propertiesTab === 'active' ? 'text-[#D02126] font-bold border-b-2 border-[#D02126] pb-0.5' : 'hover:text-gray-900'
                        }`}
                      >
                        Propiedades activas ({properties.length})
                      </button>
                      <button
                        onClick={() => setPropertiesTab('trash')}
                        className={`transition-colors cursor-pointer ${
                          propertiesTab === 'trash' ? 'text-[#D02126] font-bold border-b-2 border-[#D02126] pb-0.5' : 'hover:text-gray-900'
                        }`}
                      >
                        Papelera (0)
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => setIsMultimodalModalOpen(true)}
                      className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-[#D02126] hover:from-emerald-700 hover:to-[#B81B1F] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                    >
                      <Mic className="w-3.5 h-3.5" />
                      <span>⚡ Ingesta Multimodal IA</span>
                    </button>
                    <button
                      onClick={() => onOpenOnboarding?.()}
                      className="px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <UploadCloud className="w-3.5 h-3.5 text-[#D02126]" />
                      <span>Importar propiedades</span>
                    </button>
                    <button
                      onClick={() => setIsAddingPropertyModal(true)}
                      className="px-4 py-2.5 rounded-xl bg-[#0F1115] hover:bg-[#0A2230] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Nueva propiedad</span>
                    </button>
                  </div>
                </div>

                {/* SUPERPODER 3: MULTIPOSTING A 1 CLIC (PORTAL INMOBILIARIO, TOCTOC, YAPO, SITIO WEB) */}
                <div className="bg-gradient-to-r from-[#0F1115] to-[#0A2230] rounded-3xl p-5 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-[#D02126] text-white uppercase tracking-wider">
                        Multiposting Sincronizado
                      </span>
                      <span className="text-xs text-emerald-300 font-semibold flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        API Portales Activa
                      </span>
                    </div>
                    <p className="text-xs text-gray-200">
                      Publica, actualiza o da de baja tu inventario simultáneamente en los mayores portales de Chile con un solo clic.
                    </p>
                    <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-gray-300">
                      <span className="flex items-center gap-1">✓ Portal Inmobiliario / ML</span>
                      <span className="flex items-center gap-1">✓ TocToc</span>
                      <span className="flex items-center gap-1">✓ Yapo</span>
                      <span className="flex items-center gap-1">✓ Web Melsa Propia</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-stretch sm:self-auto shrink-0">
                    <button
                      onClick={() => {
                        const sample = properties[0];
                        if (sample) {
                          setAiGeneratingCopy(true);
                          setIsAiCopyModalOpen(true);
                          setTimeout(() => {
                            setAiGeneratedListingCopy(
                              `✨ ESPECTACULAR OPORTUNIDAD EN ${sample.commune.toUpperCase()} ✨\n\n` +
                              `📍 Ubicación privilegiada: ${sample.address}, a pasos de servicios, locomoción y áreas verdes.\n\n` +
                              `🏡 Características principales:\n` +
                              `• ${sample.bedrooms} Dormitorios luminosos con clóset integrado\n` +
                              `• ${sample.bathrooms} Baños completos de fina terminación\n` +
                              `• ${sample.surfaceM2} m² construidos con distribución eficiente\n` +
                              `• Cocina equipada, pisos de alto tráfico y vista despejada\n\n` +
                              `💰 Canon mensual: ${formatCLP(sample.rentCLP)} / mes\n` +
                              `🔒 Requisitos simples, contrato digital Ley 19.799 y soporte Sello Melsa.\n\n` +
                              `📲 ¡Agenda tu visita hoy mismo por WhatsApp y sé el primero en conocerlo!`
                            );
                            setAiGeneratingCopy(false);
                          }, 800);
                        }
                      }}
                      className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/20 cursor-pointer flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>Redactar Ficha con IA</span>
                    </button>
                    <button
                      onClick={() => alert('✓ ¡Cartera sincronizada con éxito en Portal Inmobiliario, TocToc y Sitio Web!')}
                      className="px-4 py-2 rounded-xl bg-[#D02126] hover:bg-[#B81B1F] text-white text-xs font-bold transition-all cursor-pointer shadow-sm"
                    >
                      Sincronizar a Portales
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
                              prop.status === 'arrendada' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-[#D02126] text-white'
                            }`}>
                              {prop.status === 'arrendada' ? '✓ Arrendada' : 'Disponible'}
                            </span>
                            <div className="absolute bottom-2 left-2 flex gap-1">
                              <span className="bg-black/60 backdrop-blur-xs text-[9px] text-white font-bold px-2 py-0.5 rounded-full">
                                Portal Inm. ✓
                              </span>
                              <span className="bg-black/60 backdrop-blur-xs text-[9px] text-white font-bold px-2 py-0.5 rounded-full">
                                TocToc ✓
                              </span>
                            </div>
                          </div>
                          <div className="p-5 space-y-2">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-bold text-[#0F1115] leading-snug">{prop.title}</h4>
                            </div>
                            <p className="text-xs text-gray-500">{prop.address}, {prop.commune}</p>
                            <div className="flex items-center gap-3 text-xs text-gray-600 pt-2 border-t border-gray-100">
                              <span>🛏️ {prop.bedrooms} Dorm</span>
                              <span>🚿 {prop.bathrooms} Baños</span>
                              <span>📐 {prop.surfaceM2} m²</span>
                            </div>
                          </div>
                        </div>

                        <div className="p-5 pt-0 space-y-3 border-t border-gray-100/60 mt-2">
                          <div className="flex items-center justify-between pt-3">
                            <div>
                              <span className="text-[10px] uppercase font-bold text-gray-400 block">Canon Mensual</span>
                              <span className="text-base font-bold text-[#D02126]">{formatCLP(prop.rentCLP)}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => {
                                  setPitchPropertyId(prop.id);
                                  setIsPitchGeneratorOpen(true);
                                }}
                                className="px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 border border-amber-200/60"
                                title="Crear Dossier Financiero"
                              >
                                <Sparkles className="w-3 h-3 text-amber-500" />
                                <span>Pitch</span>
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedContractId(contracts[0]?.id || '');
                                  setActiveTab('contracts');
                                }}
                                className="px-2.5 py-1.5 rounded-xl bg-gray-100 hover:bg-[#FDE8E9] text-[#D02126] text-xs font-bold transition-colors cursor-pointer"
                              >
                                Contrato →
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={() => {
                                setPropMatchesExpandedId(propMatchesExpandedId === prop.id ? null : prop.id);
                              }}
                              className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition-colors cursor-pointer flex items-center justify-center gap-1 border ${
                                propMatchesExpandedId === prop.id 
                                  ? 'bg-[#0F1115] text-white border-[#0F1115]' 
                                  : 'bg-blue-50 hover:bg-blue-100 text-blue-800 border-blue-200'
                              }`}
                            >
                              <Target className="w-3 h-3 text-blue-500" />
                              <span>{propMatchesExpandedId === prop.id ? 'Ocultar Matches' : '🎯 3 Matches'}</span>
                            </button>

                            <button
                              onClick={() => {
                                setAiGeneratingCopy(true);
                                setIsAiCopyModalOpen(true);
                                setTimeout(() => {
                                  setAiGeneratedListingCopy(
                                    `✨ OPORTUNIDAD EN ${prop.commune.toUpperCase()} ✨\n\n` +
                                    `📍 Dirección: ${prop.address}\n\n` +
                                    `🏡 Distribución y comodidades:\n` +
                                    `• ${prop.bedrooms} Dormitorios | ${prop.bathrooms} Baños\n` +
                                    `• Superficie útil: ${prop.surfaceM2} m²\n` +
                                    `• Excelente conectividad y plusvalía garantizada\n\n` +
                                    `💰 Canon mensual: ${formatCLP(prop.rentCLP)}\n` +
                                    `📲 Contactar directamente para coordinar visita express.`
                                  );
                                  setAiGeneratingCopy(false);
                                }, 600);
                              }}
                              className="py-1.5 px-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#D02126] text-[11px] font-bold transition-colors cursor-pointer flex items-center justify-center gap-1 border border-emerald-200/60"
                            >
                              <Sparkles className="w-3 h-3 text-[#D02126]" />
                              <span>Ficha IA</span>
                            </button>
                          </div>

                          {/* KILLER 4 (PARTE 1): SMART MATCH VISUAL DESDE LA PROPIEDAD */}
                          {propMatchesExpandedId === prop.id && (
                            <div className="p-3 bg-blue-50/60 rounded-2xl border border-blue-100 space-y-2 text-xs animate-in fade-in duration-150">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-[#0F1115] flex items-center gap-1 text-[11px]">
                                  <Users className="w-3 h-3 text-blue-600" />
                                  <span>Leads con Demanda Activa:</span>
                                </span>
                                <span className="text-[10px] font-bold text-blue-700 bg-white px-2 py-0.5 rounded-full border border-blue-200">
                                  3 Encontrados
                                </span>
                              </div>

                              <div className="space-y-1.5 pt-1">
                                {[
                                  { name: 'Matías Edwards', match: '98%', reason: 'Presupuesto calza y pre-aprobado', phone: '+56 9 9123 4567' },
                                  { name: 'Camila Soto', match: '94%', reason: 'Busca 2D en Providencia urgente', phone: '+56 9 8765 4321' },
                                  { name: 'Ignacio Larraín', match: '91%', reason: 'Inversionista renta residencial', phone: '+56 9 7654 3210' }
                                ].map((lead, lIdx) => (
                                  <div key={lIdx} className="p-2 bg-white rounded-xl border border-blue-100 flex items-center justify-between gap-2">
                                    <div>
                                      <div className="flex items-center gap-1.5">
                                        <span className="font-bold text-[#0F1115] text-[11px]">{lead.name}</span>
                                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                                          {lead.match}
                                        </span>
                                      </div>
                                      <span className="text-[10px] text-gray-500 block">{lead.reason}</span>
                                    </div>
                                    <a
                                      href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hola ${lead.name}! Te escribo de Los Pinos porque captamos una propiedad en ${prop.address} (${prop.bedrooms}D/${prop.bathrooms}B) que calza con tu búsqueda. ¿Te comparto la ficha completa?`)}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[10px] font-bold shrink-0 transition-colors"
                                      title="Enviar Ficha por WhatsApp"
                                    >
                                      <Send className="w-3.5 h-3.5" />
                                    </a>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
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
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F1115]">
                      Cartera de ventas
                    </h1>
                    <div className="flex items-center gap-4 text-xs font-semibold text-gray-500 mt-1">
                      <button
                        onClick={() => setSalesTab('pipeline')}
                        className={`transition-colors cursor-pointer ${
                          salesTab === 'pipeline' ? 'text-[#D02126] font-bold border-b-2 border-[#D02126] pb-0.5' : 'hover:text-gray-900'
                        }`}
                      >
                        Cartera de venta ({sales.length})
                      </button>
                      <button
                        onClick={() => setSalesTab('buyers')}
                        className={`transition-colors cursor-pointer ${
                          salesTab === 'buyers' ? 'text-[#D02126] font-bold border-b-2 border-[#D02126] pb-0.5' : 'hover:text-gray-900'
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
                    className="px-4 py-2.5 rounded-xl bg-[#D02126] hover:bg-[#B81B1F] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Nueva propiedad en venta</span>
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="text-base font-bold text-[#0F1115]">Pipeline Visual Inmobiliario</h3>
                      <p className="text-xs text-gray-500">
                        Construye tu cartera de ventas y activa workflows automáticos de seguimiento por WhatsApp para acelerar el cierre.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Workflows WhatsApp Activos
                      </span>
                    </div>
                  </div>
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
                            <h5 className="font-bold text-[#0F1115] leading-snug">{item.propertyTitle}</h5>
                            <div className="flex items-center justify-between text-gray-600">
                              <span className="font-mono font-bold text-[#D02126]">{item.priceUF} UF</span>
                              <span className="text-[10px] text-gray-400">Comisión 2%: ~{formatCLP(item.commissionEstCLP)}</span>
                            </div>
                            <span className="text-[10px] text-gray-500 block">Interesado: <strong>{item.buyerCandidate}</strong></span>

                            {/* Automated Workflows Trigger Buttons */}
                            <div className="pt-2 border-t border-gray-100 flex flex-col gap-1.5">
                              {col.stage === 'visitas' && (
                                <>
                                  <a
                                    href={`https://wa.me/?text=${encodeURIComponent(`Hola ${item.buyerCandidate}! Te recordamos tu visita programada para mañana a las 11:00 hrs en ${item.propertyTitle}. ¿Nos confirmas tu asistencia? ¡Saludos de Alexis Santana!`)}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-full py-1 px-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-[10px] text-center border border-emerald-200 transition-colors flex items-center justify-center gap-1"
                                  >
                                    <span>⚡ Recordatorio Visita 24h</span>
                                  </a>
                                  <a
                                    href={`https://wa.me/?text=${encodeURIComponent(`Hola ${item.buyerCandidate}! Esperamos que te haya gustado la visita a ${item.propertyTitle}. Cuéntanos, ¿qué te pareció la propiedad? ¿Te gustaría presentar una reserva u oferta?`)}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-full py-1 px-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold text-[10px] text-center border border-blue-200 transition-colors flex items-center justify-center gap-1"
                                  >
                                    <span>⚡ Solicitar Feedback Post-Visita</span>
                                  </a>
                                </>
                              )}

                              {col.stage === 'captacion' && (
                                <a
                                  href={`https://wa.me/?text=${encodeURIComponent(`Hola ${item.buyerCandidate}! Te escribo de Los Pinos Inmobiliaria. Tenemos nuevas opciones que se ajustan a tu búsqueda en ${item.propertyTitle}. ¿Te gustaría que te comparta la ficha actualizada?`)}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="w-full py-1 px-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-[10px] text-center border border-amber-200 transition-colors flex items-center justify-center gap-1"
                                >
                                  <span>⚡ Reactivar Lead (+15 días)</span>
                                </a>
                              )}

                              {(col.stage === 'oferta' || col.stage === 'promesa') && (
                                <button
                                  onClick={() => {
                                    setLegalSignContract({
                                      id: item.id,
                                      propertyAddress: item.propertyTitle,
                                      tenantName: item.buyerCandidate,
                                      rentCLP: item.commissionEstCLP * 50,
                                      type: col.stage === 'promesa' ? 'Promesa de Compraventa' : 'Carta de Oferta y Cierre'
                                    });
                                    setIsLegalSignModalOpen(true);
                                  }}
                                  className="w-full py-1 px-2 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-800 font-bold text-[10px] text-center border border-purple-200 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                                >
                                  <span>✍️ Enviar a Firma Electrónica</span>
                                </button>
                              )}
                            </div>
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
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F1115]">
                      Agenda
                    </h1>
                    <p className="text-xs text-gray-500 mt-1">
                      Actividades de todas tus propiedades y de tu corredora. Los feriados son solo informativos.
                    </p>
                  </div>

                  <button
                    onClick={() => setIsAddingActivityModal(true)}
                    className="px-4 py-2.5 rounded-xl bg-[#D02126] hover:bg-[#B81B1F] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Nueva actividad</span>
                  </button>
                </div>

                {/* Calendar Card View */}
                <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-2xs space-y-6">
                  
                  {/* Calendar Top Month Navigation */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
                    <h3 className="text-sm sm:text-base font-bold text-[#0F1115] flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#D02126]" />
                      <span>Visitas, reuniones y actividades</span>
                    </h3>

                    <div className="flex items-center gap-3 text-xs font-bold text-[#0F1115]">
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
                                ? 'bg-emerald-50/30 border-[#D02126]/30 hover:border-[#D02126]'
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
                                      : 'bg-[#D02126] text-white shadow-2xs'
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F1115]">
                      Clientes
                    </h1>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Base unificada de propietarios, compradores e inversionistas con perfiles de demanda activos.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowDemoData(!showDemoData)}
                      className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      {showDemoData ? '👁️ Ver limpio inicial' : '📊 Ver datos de ejemplo'}
                    </button>
                    <button
                      onClick={() => setIsNewClientModalOpen(true)}
                      className="px-3.5 py-1.5 rounded-xl bg-[#D02126] hover:bg-[#B81B1F] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Nuevo cliente</span>
                    </button>
                  </div>
                </div>

                {/* KILLER 4 (PARTE 2): SMART MATCH BIDIRECCIONAL DESDE EL LEAD */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50/50 rounded-3xl p-5 border border-blue-200/70 shadow-xs space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                        <Target className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#0F1115]">Perfil Inversionista Activo · Gonzalo Vial Echenique</h4>
                        <span className="text-[10px] text-gray-500">Capacidad de compra: 8.500 UF · Stress Test: Aprobado (Renta $6.5M/mes)</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setPitchTargetInvestor('Gonzalo Vial Echenique');
                        setIsPitchGeneratorOpen(true);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#0F1115] hover:bg-[#0A2230] text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs self-start sm:self-auto"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>Generar Dossier Financiero</span>
                    </button>
                  </div>

                  <div className="pt-2 border-t border-blue-200/50">
                    <span className="text-[10px] font-bold text-blue-900 uppercase tracking-wider block mb-2">
                      Top 3 Propiedades Recomendadas por IA para este Perfil:
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                      {[
                        { title: 'Depto Los Pinos 356', com: 'Las Condes', uf: '4.850 UF', cap: 'Cap Rate 5.9%', match: '98% Match' },
                        { title: 'Depto Manuel Montt 890', com: 'Providencia', uf: '5.200 UF', cap: 'Cap Rate 5.6%', match: '95% Match' },
                        { title: 'Oficina El Golf 200', com: 'Las Condes', uf: '6.400 UF', cap: 'Cap Rate 6.2%', match: '92% Match' }
                      ].map((sug, sIdx) => (
                        <div key={sIdx} className="bg-white p-3 rounded-2xl border border-blue-100 flex items-center justify-between">
                          <div>
                            <span className="font-bold text-[#0F1115] block">{sug.title}</span>
                            <span className="text-[10px] text-gray-400">{sug.com} · {sug.uf}</span>
                            <span className="text-[10px] text-emerald-600 font-bold block">{sug.cap}</span>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            {sug.match}
                          </span>
                        </div>
                      ))}
                    </div>
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
                          <div className="col-span-4 font-bold text-[#0F1115] flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-[#FDE8E9] text-[#D02126] font-bold flex items-center justify-center text-xs">
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
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F1115]">
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
                        className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#D02126] shadow-2xs transition-colors"
                      />
                    </div>

                    <div className="w-full sm:w-48">
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                        Estado
                      </label>
                      <select
                        value={contractsStatusFilter}
                        onChange={(e) => setContractsStatusFilter(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-gray-700 focus:outline-none focus:border-[#D02126] shadow-2xs transition-colors cursor-pointer"
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
                      className="px-4 py-2.5 rounded-xl bg-[#D02126] hover:bg-[#B81B1F] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Nuevo contrato</span>
                    </button>
                    <button
                      onClick={() => setIsTemplatesModalOpen(true)}
                      className="px-3.5 py-2.5 rounded-xl bg-[#F0F7F6] text-[#D02126] hover:bg-[#E2F1EF] text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 border border-[#CDEAE6]"
                    >
                      <FileCode className="w-3.5 h-3.5" />
                      <span>Plantillas y variables</span>
                    </button>
                  </div>
                </div>

                {/* Banner LegalTech Firma Electrónica */}
                <div className="bg-[#0F1115] rounded-2xl p-4 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-xs">
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div>
                      <span className="font-bold block">Firma Electrónica Nativa con Validez Legal (Ley 19.799)</span>
                      <span className="text-gray-300 text-[11px] block">
                        Cierra reservas, contratos de arriendo y órdenes de visita con verificación de identidad por RUT y OTP sin ir a notaría.
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setLegalSignContract(contracts[0]);
                      setIsLegalSignModalOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs transition-colors shrink-0 cursor-pointer shadow-xs"
                  >
                    ✍️ Firmar Contrato Activo
                  </button>
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
                            <th className="pb-3 text-right">Acciones</th>
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
                                <td className="py-3 font-semibold text-[#0F1115]">{c.propertyAddress}</td>
                                <td className="py-3 text-gray-600">{c.tenantName}</td>
                                <td className="py-3 font-mono font-bold text-[#D02126]">{formatCLP(c.rentCLP)}</td>
                                <td className="py-3 text-gray-500">{c.readjustmentIndex}</td>
                                <td className="py-3">
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                    Vigente
                                  </span>
                                </td>
                                <td className="py-3 text-right space-x-2">
                                  <button
                                    onClick={() => {
                                      setLegalSignContract(c);
                                      setIsLegalSignModalOpen(true);
                                    }}
                                    className="px-2 py-1 rounded-lg bg-emerald-50 text-[#D02126] font-bold hover:bg-emerald-100 text-[11px] cursor-pointer"
                                    title="Firmar digitalmente según Ley 19.799"
                                  >
                                    ✍️ Firmar
                                  </button>
                                  <button 
                                    onClick={() => {
                                      setSelectedContractId(c.id);
                                      setActiveTab('settlement');
                                    }}
                                    className="text-gray-500 hover:text-gray-900 font-semibold text-[11px] cursor-pointer"
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
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F1115]">
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
                              <span className="font-bold text-[#0F1115] block">{c.propertyAddress}</span>
                              <span className="text-gray-400 text-[11px]">{c.tenantName} · Vence el 05 de cada mes</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="font-mono font-bold text-[#D02126]">{formatCLP(c.rentCLP)}</span>
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
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F1115]">
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
                        paymentsTab === 'saldos_abonos' ? 'text-[#D02126] border-b-2 border-[#D02126]' : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      <Receipt className="w-4 h-4" />
                      <span>Saldos y abonos</span>
                    </button>

                    <button
                      onClick={() => setPaymentsTab('online')}
                      className={`flex items-center gap-2 font-bold pb-2 -mb-3 transition-colors cursor-pointer ${
                        paymentsTab === 'online' ? 'text-[#D02126] border-b-2 border-[#D02126]' : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Pagos en línea</span>
                    </button>

                    <button
                      onClick={() => setPaymentsTab('transfers')}
                      className={`flex items-center gap-2 font-bold pb-2 -mb-3 transition-colors cursor-pointer ${
                        paymentsTab === 'transfers' ? 'text-[#D02126] border-b-2 border-[#D02126]' : 'text-gray-500 hover:text-gray-900'
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
                            paymentsSubTab === 'saldos' ? 'text-[#D02126]' : 'text-gray-400 hover:text-gray-600'
                          }`}
                        >
                          <span>→ Saldos</span>
                        </button>
                        <button
                          onClick={() => setPaymentsSubTab('historial')}
                          className={`flex items-center gap-1.5 font-bold cursor-pointer ${
                            paymentsSubTab === 'historial' ? 'text-[#D02126]' : 'text-gray-400 hover:text-gray-600'
                          }`}
                        >
                          <span>→ Historial de abonos</span>
                        </button>
                      </div>

                      <div className="space-y-1">
                        <h3 className="text-base font-bold text-[#0F1115]">
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
                                <span className="font-bold text-[#0F1115] block">{c.propertyAddress}</span>
                                <span className="text-gray-400">{c.tenantName} · Arriendo Mensual</span>
                              </div>
                              <div className="text-right">
                                <span className="font-mono font-bold text-[#D02126] block">{formatCLP(c.rentCLP)}</span>
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
                        <h4 className="font-bold text-[#0F1115]">Integración Pasarela Webpay Plus & Khipu</h4>
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
                        <h4 className="font-bold text-[#0F1115]">Conciliación Bancaria Automática</h4>
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
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F1115]">
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
                      className="px-3.5 py-1.5 rounded-xl bg-[#D02126] hover:bg-[#B81B1F] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
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
                          <h3 className="text-base font-bold text-[#0F1115]">{activeSettlementContract.propertyAddress}</h3>
                          <p className="text-xs text-gray-500">Propietario: {activeSettlementContract.ownerName} ({activeSettlementContract.ownerBank})</p>
                        </div>

                        <button
                          onClick={() => {
                            setSettlementSuccessMsg(true);
                            setTimeout(() => setSettlementSuccessMsg(false), 3000);
                          }}
                          className="px-4 py-2.5 rounded-xl bg-[#D02126] hover:bg-[#B81B1F] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
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
                          <span className="text-xl font-bold text-[#0F1115] block mt-1">{formatCLP(activeSettlementContract.rentCLP)}</span>
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
                        <div className="p-4 rounded-2xl bg-[#FDE8E9] border border-[#D02126]/30">
                          <span className="text-[#D02126] block font-bold text-[10px] uppercase">Total Líquido Propietario</span>
                          <span className="text-xl font-bold text-[#D02126] block mt-1">
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F1115]">
                    Portales
                  </h1>
                  <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5 self-start sm:self-auto">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Portal Autoservicio Propietarios Activo
                  </span>
                </div>

                {/* SUPERPODER 5 (PARTE 1): TRANSPARENCIA EN TIEMPO REAL - PORTAL DEL PROPIETARIO */}
                <div className="bg-gradient-to-br from-white to-emerald-50/30 rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-sm space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-[#D02126] text-white flex items-center justify-center shadow-xs">
                        <BarChart2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-[#0F1115]">Portal del Propietario en Tiempo Real</h3>
                        <p className="text-xs text-gray-500">
                          Autoservicio donde el dueño del inmueble inicia sesión y supervisa métricas en vivo sin tener que llamar al corredor.
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono font-bold text-[#D02126] bg-white px-3 py-1 rounded-xl border border-[#D02126]/30">
                      Vista Propietario: Los Pinos 356
                    </span>
                  </div>

                  {/* 4 Live Metrics Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-2xl border border-gray-200/90 shadow-2xs space-y-1">
                      <span className="text-[10px] uppercase font-bold text-gray-400 block">Visualizaciones Web</span>
                      <span className="text-2xl font-extrabold tracking-tight text-[#0F1115] tabular-nums block">1.420</span>
                      <span className="text-[10px] text-emerald-600 font-bold block">↑ +18% esta semana</span>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-gray-200/90 shadow-2xs space-y-1">
                      <span className="text-[10px] uppercase font-bold text-gray-400 block">Leads Calificados</span>
                      <span className="text-2xl font-extrabold tracking-tight text-[#D02126] tabular-nums block">14</span>
                      <span className="text-[10px] text-gray-500 block">Filtrados con IA</span>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-gray-200/90 shadow-2xs space-y-1">
                      <span className="text-[10px] uppercase font-bold text-gray-400 block">Visitas Físicas</span>
                      <span className="text-2xl font-extrabold tracking-tight text-[#0F1115] tabular-nums block">5</span>
                      <span className="text-[10px] text-purple-600 font-bold block">1 programada mañana</span>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-gray-200/90 shadow-2xs space-y-1">
                      <span className="text-[10px] uppercase font-bold text-gray-400 block">Ofertas Formales</span>
                      <span className="text-2xl font-extrabold tracking-tight text-amber-600 tabular-nums block">2</span>
                      <span className="text-[10px] text-amber-600 font-bold block">En evaluación</span>
                    </div>
                  </div>

                  {/* Feedback summary in real time */}
                  <div className="p-4 rounded-2xl bg-white border border-gray-200/80 space-y-2 text-xs">
                    <span className="font-bold text-[#0F1115] flex items-center gap-1.5">
                      💬 Feedback Reciente de Interesados (Recopilado por WhatsApp):
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-600">
                      <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                        <p className="italic">"Excelente luminosidad y mantención del inmueble. El cliente evalúa si califica al crédito."</p>
                        <span className="text-[10px] text-gray-400 font-medium block mt-1">— Visita de Matías Edwards</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                        <p className="italic">"Propiedad en excelente punto de Las Condes. Solicitó borrador de promesa para revisar con abogado."</p>
                        <span className="text-[10px] text-gray-400 font-medium block mt-1">— Visita de Carolina Ruiz</span>
                      </div>
                    </div>
                  </div>

                  {/* KILLER 5: HEATMAP DE INTERÉS & REPORTE PARA EL PROPIETARIO */}
                  <div className="pt-2 border-t border-gray-100 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h4 className="font-bold text-[#0F1115] text-xs flex items-center gap-1.5">
                          <Activity className="w-4 h-4 text-[#D02126]" />
                          <span>Heatmap de Interés & Comportamiento en Vitrina</span>
                        </h4>
                        <p className="text-[11px] text-gray-500">
                          Tracking profundo de las acciones de los usuarios en la ficha pública y portales.
                        </p>
                      </div>

                      <button
                        onClick={() => setIsOwnerReportModalOpen(true)}
                        className="px-3.5 py-2 rounded-xl bg-[#D02126] hover:bg-[#B81B1F] text-white font-bold text-xs cursor-pointer shadow-xs transition-all flex items-center gap-1.5 self-start sm:self-auto"
                      >
                        <FileBarChart className="w-3.5 h-3.5" />
                        <span>Generar Reporte Mensual Propietario</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div className="p-3 bg-white rounded-xl border border-gray-200/80">
                        <span className="text-gray-500 text-[10px] block">Usaron Simulador</span>
                        <span className="font-bold text-base text-[#0F1115] block mt-0.5">47 personas</span>
                        <span className="text-[9px] text-emerald-600 font-medium">Calculando dividendo</span>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-gray-200/80">
                        <span className="text-gray-500 text-[10px] block">Descargaron Brochure</span>
                        <span className="font-bold text-base text-[#0F1115] block mt-0.5">18 descargas</span>
                        <span className="text-[9px] text-blue-600 font-medium">Dossier de inversión</span>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-gray-200/80">
                        <span className="text-gray-500 text-[10px] block">Evaluaron Cap Rate</span>
                        <span className="font-bold text-base text-[#0F1115] block mt-0.5">23 inversionistas</span>
                        <span className="text-[9px] text-purple-600 font-medium">Retorno 5.8%</span>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-gray-200/80">
                        <span className="text-gray-500 text-[10px] block">Solicitudes de Visita</span>
                        <span className="font-bold text-base text-[#0F1115] block mt-0.5">9 contactos</span>
                        <span className="text-[9px] text-amber-600 font-medium">5 ya concretadas</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 1: Acceso de propietarios y arrendatarios */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/90 shadow-2xs space-y-4">
                  <div className="flex items-center gap-2.5 text-[#0F1115]">
                    <div className="w-8 h-8 rounded-full bg-[#FDE8E9] text-[#D02126] flex items-center justify-center">
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
                        className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-700 font-mono pr-20 select-all"
                      />
                      <div className="absolute right-2 flex items-center gap-1">
                        <button
                          onClick={() => {
                            navigator.clipboard?.writeText(`https://user.melsa.cl/my/33`);
                            setPortalCopiedItem('personal');
                            setTimeout(() => setPortalCopiedItem(null), 2000);
                          }}
                          className="p-1.5 text-gray-400 hover:text-[#D02126] transition-colors cursor-pointer"
                          title="Copiar enlace"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <a
                          href={`https://user.melsa.cl/my/33`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 text-gray-400 hover:text-[#D02126] transition-colors"
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
                  <div className="flex items-center gap-2.5 text-[#0F1115]">
                    <div className="w-8 h-8 rounded-full bg-[#FDE8E9] text-[#D02126] flex items-center justify-center">
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
                        className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-700 focus:outline-none focus:border-[#D02126]"
                      />
                    </div>

                    {/* Colores */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                          Color principal
                        </label>
                        <div className="flex items-center gap-2 bg-[#FAF9F8] border border-gray-200 rounded-xl px-3 py-2">
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
                        <div className="flex items-center gap-2 bg-[#FAF9F8] border border-gray-200 rounded-xl px-3 py-2">
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
                        <UploadCloud className="w-6 h-6 text-[#D02126] mx-auto mb-1.5" />
                        <p className="text-xs font-bold text-[#0F1115]">
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
                        className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-gray-700 font-mono focus:outline-none focus:border-[#D02126]"
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
                        className="w-4 h-4 rounded text-[#D02126] border-gray-300 focus:ring-[#D02126] cursor-pointer"
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
                        className="px-5 py-2.5 rounded-xl bg-[#D02126] hover:bg-[#B81B1F] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-2"
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
                    <h4 className="text-xs font-bold text-[#0F1115]">Enlace de tu portal</h4>
                    <label className="block text-[11px] text-gray-500">URL pública</label>
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        readOnly
                        value={`https://user.melsa.cl/pay/c8fd0927723bfabb542051e19c733246`}
                        className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-700 font-mono pr-20 select-all"
                      />
                      <div className="absolute right-2 flex items-center gap-1">
                        <button
                          onClick={() => {
                            navigator.clipboard?.writeText(`https://user.melsa.cl/pay/c8fd0927723bfabb542051e19c733246`);
                            setPortalCopiedItem('public');
                            setTimeout(() => setPortalCopiedItem(null), 2000);
                          }}
                          className="p-1.5 text-gray-400 hover:text-[#D02126] transition-colors cursor-pointer"
                          title="Copiar enlace"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <a
                          href={`https://user.melsa.cl/pay/c8fd0927723bfabb542051e19c733246`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 text-gray-400 hover:text-[#D02126] transition-colors"
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
                    <h4 className="text-xs font-bold text-[#0F1115]">Widget para tu web</h4>
                    <p className="text-[11px] text-gray-500">
                      Copia este código en un bloque HTML de uno de los sitios autorizados.
                    </p>
                    <div className="relative">
                      <textarea
                        readOnly
                        rows={3}
                        value={`<iframe src="https://user.melsa.cl/pay/c8fd0927723bfabb542051e19c733246?widget=1" title="Portal de pagos" width="100%" height="720" style="border:0" loading="lazy" referrerpolicy="no-referrer"></iframe>`}
                        className="w-full bg-[#0F1115] text-[#00E5D4] p-3 rounded-xl font-mono text-[11px] border border-gray-700 focus:outline-none select-all"
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
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F1115]">
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
                      className="px-3.5 py-1.5 rounded-xl bg-[#D02126] hover:bg-[#B81B1F] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
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
                              <span className="font-bold text-[#0F1115]">{t.propertyAddress}</span>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                                {t.category}
                              </span>
                            </div>
                            <p className="text-gray-500 text-[11px] mt-0.5">{t.description}</p>
                            <span className="text-[10px] text-gray-400">Técnico SEC Sello Melsa: <strong>{t.assignedTechnician}</strong></span>
                          </div>
                          <div className="text-right">
                            <span className="font-mono font-bold text-[#0F1115] block">{formatCLP(t.costEstimateCLP)}</span>
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
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F1115]">
                    Usuarios
                  </h1>
                </div>

                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/90 shadow-2xs space-y-6">
                  {/* User rows */}
                  <div className="space-y-3">
                    {teamMembers.map(usr => (
                      <div key={usr.id} className="bg-[#FAF9F8] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-gray-100">
                        <div className="flex items-center gap-3.5">
                          <div className="w-10 h-10 rounded-full bg-[#FDE8E9] text-[#D02126] font-bold flex items-center justify-center text-sm shadow-2xs">
                            {usr.name.charAt(0) || 'A'}
                          </div>
                          <div>
                            <span className="font-bold text-sm text-[#0F1115] block">{usr.name}</span>
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
                      className="px-5 py-2.5 rounded-xl bg-[#D02126] hover:bg-[#B81B1F] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Crear usuario</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================== */}
            {/* TAB 13: MI PLAN (SCREENSHOT 1 EXACT MATCH)                */}
            {/* ========================================================== */}
            {activeTab === 'plans' && (
              <div className="space-y-8 animate-in fade-in duration-150">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F1115]">
                  Mi plan
                </h1>

                {planChangeAlert && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{planChangeAlert}</span>
                  </div>
                )}

                {/* Dark Navy Banner matching Altenda Screenshot 1 */}
                <div className="bg-[#0F1115] text-white rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
                  <div className="space-y-2 max-w-lg">
                    <span className="text-xs text-gray-300 font-semibold block tracking-wider">
                      Tu plan actual
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                      Inicial
                    </h2>
                    <p className="text-xs text-gray-300 font-light leading-relaxed">
                      Tu prueba termina el 23/11/2026. Al suscribirte, el primer cobro se programa para el término de la prueba.
                    </p>
                  </div>

                  <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-900/60 text-emerald-300 border border-emerald-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Prueba gratuita
                    </span>

                    <div className="flex items-center gap-6 pt-2">
                      <div className="text-left md:text-right">
                        <span className="text-2xl font-bold text-white block">15</span>
                        <span className="text-[11px] text-gray-300 block max-w-[130px] leading-tight">
                          propiedades de arriendo y la misma cantidad para venta
                        </span>
                      </div>
                      <div className="text-left md:text-right border-l border-gray-700/60 pl-6">
                        <span className="text-2xl font-bold text-white block">2</span>
                        <span className="text-[11px] text-gray-300 block">usuarios</span>
                      </div>
                    </div>

                    <span className="text-[11px] text-gray-400 font-light pt-1">
                      Facturación mensual
                    </span>
                  </div>
                </div>

                {/* Section: Elige tu próximo plan */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-[#0F1115]">
                      Elige tu próximo plan
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Todos los precios incluyen IVA. Elige el espacio que necesita tu empresa.
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Tu primer cobro será al terminar la prueba. La tarjeta se autoriza en el siguiente paso, con Mercado Pago.
                    </p>
                  </div>

                  {/* 4 Plan Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                    {[
                      {
                        id: 'inicial',
                        name: 'Inicial',
                        price: '$17.990',
                        badge: 'Tu plan en prueba',
                        isTrial: true,
                        props: '15 propiedades',
                        users: '2 usuarios'
                      },
                      {
                        id: 'profesional',
                        name: 'Profesional',
                        price: '$35.990',
                        badge: undefined,
                        isTrial: false,
                        props: '50 propiedades',
                        users: '5 usuarios'
                      },
                      {
                        id: 'empresa',
                        name: 'Empresa',
                        price: '$59.990',
                        badge: undefined,
                        isTrial: false,
                        props: '150 propiedades',
                        users: '10 usuarios'
                      },
                      {
                        id: 'corporativo',
                        name: 'Corporativo',
                        price: '$95.990',
                        badge: undefined,
                        isTrial: false,
                        props: 'Ilimitadas propiedades',
                        users: 'Usuarios ilimitados'
                      }
                    ].map((plan) => (
                      <div
                        key={plan.id}
                        className={`bg-white rounded-3xl p-6 border transition-all flex flex-col justify-between ${
                          plan.isTrial ? 'border-[#D02126] ring-2 ring-[#D02126]/10 shadow-sm' : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="space-y-3">
                          <h4 className="text-base font-bold text-[#0F1115]">{plan.name}</h4>
                          {plan.badge && (
                            <span className="inline-block px-2.5 py-1 rounded-lg bg-[#FDE8E9] text-[#D02126] text-[11px] font-bold">
                              {plan.badge}
                            </span>
                          )}
                          <div>
                            <span className="text-2xl font-bold text-[#0F1115]">{plan.price}</span>
                            <span className="text-xs text-gray-500 font-mono ml-1">CLP</span>
                            <span className="text-xs text-gray-400 block font-light mt-0.5">al mes, IVA incluido</span>
                          </div>
                          <div className="pt-2 text-xs text-gray-500 space-y-1 border-t border-gray-100 font-light">
                            <p>• {plan.props}</p>
                            <p>• {plan.users}</p>
                          </div>
                        </div>

                        <div className="pt-6">
                          <button
                            disabled={plan.isTrial}
                            onClick={() => {
                              setPlanChangeAlert(`¡Plan ${plan.name} seleccionado para renovación automática!`);
                              setTimeout(() => setPlanChangeAlert(null), 3000);
                            }}
                            className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              plan.isTrial
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-[#D02126] hover:bg-[#B81B1F] text-white shadow-xs'
                            }`}
                          >
                            {plan.isTrial ? 'Plan Actual' : 'Seleccionar Plan'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================== */}
            {/* TAB 14: INTEGRACIONES (SCREENSHOT 2 EXACT MATCH)           */}
            {/* ========================================================== */}
            {activeTab === 'integrations' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F1115]">
                    Integraciones
                  </h1>
                  <p className="text-xs text-gray-500 mt-1">
                    Conecta los servicios que utiliza tu corredora. Cada integración conserva sus propios permisos y configuración.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {/* 1. Mercado Pago */}
                  <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-2xs flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                          🤝
                        </div>
                        <span className="text-[11px] font-semibold text-gray-500">Disponible</span>
                      </div>
                      <h4 className="text-base font-bold text-[#0F1115]">Mercado Pago</h4>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        Cobros en línea para arriendos y otras cuotas.
                      </p>
                      <span className="text-[11px] text-emerald-600 font-medium block">
                        ✓ Sin costo · Incluido en tu suscripción
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-xs">
                      <button className="text-gray-500 hover:text-gray-900 font-semibold cursor-pointer">
                        👁 Ver detalles
                      </button>
                      <button className="text-[#D02126] hover:underline font-bold cursor-pointer">
                        Configurar →
                      </button>
                    </div>
                  </div>

                  {/* 2. Flow */}
                  <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-2xs flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-sm">
                          flow$
                        </div>
                        <span className="text-[11px] font-semibold text-gray-500">Disponible</span>
                      </div>
                      <h4 className="text-base font-bold text-[#0F1115]">Flow</h4>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        Pagos de arriendos y obligaciones en tu propia cuenta Flow.
                      </p>
                      <span className="text-[11px] text-emerald-600 font-medium block">
                        ✓ Sin costo · Incluido en tu suscripción
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-xs">
                      <button className="text-gray-500 hover:text-gray-900 font-semibold cursor-pointer">
                        👁 Ver detalles
                      </button>
                      <button className="text-[#D02126] hover:underline font-bold cursor-pointer">
                        Ver integración →
                      </button>
                    </div>
                  </div>

                  {/* 3. Transferencia bancaria */}
                  <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-2xs flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#D02126] flex items-center justify-center font-bold text-sm">
                          <Landmark className="w-5 h-5" />
                        </div>
                        <span className="text-[11px] font-semibold text-gray-500">Disponible</span>
                      </div>
                      <h4 className="text-base font-bold text-[#0F1115]">Transferencia bancaria</h4>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        Recibe comprobantes de transferencia y valida cada ingreso.
                      </p>
                      <span className="text-[11px] text-emerald-600 font-medium block">
                        ✓ Sin costo · Incluido en tu suscripción
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-xs">
                      <button className="text-gray-500 hover:text-gray-900 font-semibold cursor-pointer">
                        👁 Ver detalles
                      </button>
                      <button className="text-[#D02126] hover:underline font-bold cursor-pointer">
                        Ver integración →
                      </button>
                    </div>
                  </div>

                  {/* 4. API de consulta */}
                  <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-2xs flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-sm">
                          <Layers className="w-5 h-5" />
                        </div>
                        <span className="text-[11px] font-semibold text-gray-500">Consulta básica</span>
                      </div>
                      <h4 className="text-base font-bold text-[#0F1115]">API de consulta</h4>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        Consulta propiedades y cuotas desde otro software. Solo lectura.
                      </p>
                      <span className="text-[11px] text-emerald-600 font-medium block">
                        ✓ Sin costo · Incluido en tu suscripción
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-xs">
                      <button className="text-gray-500 hover:text-gray-900 font-semibold cursor-pointer">
                        👁 Ver detalles
                      </button>
                      <button className="text-[#D02126] hover:underline font-bold cursor-pointer">
                        Ver integración →
                      </button>
                    </div>
                  </div>

                  {/* 5. Webpay Plus */}
                  <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-2xs flex flex-col justify-between space-y-4 opacity-90">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-xs">
                          TBK
                        </div>
                        <span className="text-[11px] font-semibold text-gray-400">Próximamente</span>
                      </div>
                      <h4 className="text-base font-bold text-[#0F1115]">Webpay Plus</h4>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        Pagos con tarjetas a través de Transbank.
                      </p>
                      <span className="text-[11px] text-amber-600 font-medium block">
                        🕒 Costo por confirmar
                      </span>
                    </div>
                    <div className="pt-4 border-t border-gray-100 text-xs">
                      <button className="text-gray-500 hover:text-gray-900 font-semibold cursor-pointer">
                        👁 Ver detalles
                      </button>
                    </div>
                  </div>

                  {/* 6. Tribuno */}
                  <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-2xs flex flex-col justify-between space-y-4 opacity-90">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-sm">
                          ⚖️
                        </div>
                        <span className="text-[11px] font-semibold text-gray-400">Próximamente</span>
                      </div>
                      <h4 className="text-base font-bold text-[#0F1115]">Tribuno</h4>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        Facturación electrónica para corredoras.
                      </p>
                      <span className="text-[11px] text-amber-600 font-medium block">
                        🕒 Costo por confirmar
                      </span>
                    </div>
                    <div className="pt-4 border-t border-gray-100 text-xs">
                      <button className="text-gray-500 hover:text-gray-900 font-semibold cursor-pointer">
                        👁 Ver detalles
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================== */}
            {/* TAB 15: CONFIGURACIÓN (SCREENSHOT 3 EXACT MATCH)           */}
            {/* ========================================================== */}
            {activeTab === 'settings' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F1115]">
                    Configuración
                  </h1>
                  <p className="text-xs text-gray-500 mt-1">
                    Administra los datos de tu corredora, sus medios de pago y las comunicaciones a tus clientes.
                  </p>
                </div>

                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/90 shadow-2xs space-y-6">
                  {/* Secondary Tab Navigation */}
                  <div className="flex items-center gap-6 border-b border-gray-100 pb-3 text-xs">
                    <button
                      onClick={() => setSettingsTab('legal')}
                      className={`font-bold pb-2 -mb-3 transition-colors cursor-pointer ${
                        settingsTab === 'legal' ? 'text-[#D02126] border-b-2 border-[#D02126]' : 'text-gray-400 hover:text-gray-700'
                      }`}
                    >
                      → Información legal
                    </button>
                    <button
                      onClick={() => setSettingsTab('contact')}
                      className={`font-bold pb-2 -mb-3 transition-colors cursor-pointer ${
                        settingsTab === 'contact' ? 'text-[#D02126] border-b-2 border-[#D02126]' : 'text-gray-400 hover:text-gray-700'
                      }`}
                    >
                      → Contacto
                    </button>
                    <button
                      onClick={() => setSettingsTab('payments')}
                      className={`font-bold pb-2 -mb-3 transition-colors cursor-pointer ${
                        settingsTab === 'payments' ? 'text-[#D02126] border-b-2 border-[#D02126]' : 'text-gray-400 hover:text-gray-700'
                      }`}
                    >
                      Medios de pago
                    </button>
                    <button
                      onClick={() => setSettingsTab('notifications')}
                      className={`font-bold pb-2 -mb-3 transition-colors cursor-pointer ${
                        settingsTab === 'notifications' ? 'text-[#D02126] border-b-2 border-[#D02126]' : 'text-gray-400 hover:text-gray-700'
                      }`}
                    >
                      Notificaciones
                    </button>
                  </div>

                  {/* Subtab Content: Información legal */}
                  {settingsTab === 'legal' && (
                    <div className="space-y-6 pt-2">
                      <h3 className="text-base font-bold text-[#0F1115]">
                        Información legal
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                            Razón social
                          </label>
                          <input
                            type="text"
                            value={configCompanyName}
                            onChange={(e) => setConfigCompanyName(e.target.value)}
                            className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-700 focus:outline-none focus:border-[#D02126]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                            RUT
                          </label>
                          <input
                            type="text"
                            value={configRut}
                            onChange={(e) => setConfigRut(e.target.value)}
                            className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-700 focus:outline-none focus:border-[#D02126]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                            Domicilio legal
                          </label>
                          <input
                            type="text"
                            value={configAddress}
                            onChange={(e) => setConfigAddress(e.target.value)}
                            className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-700 focus:outline-none focus:border-[#D02126]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                            Representante legal
                          </label>
                          <input
                            type="text"
                            value={configRepresentative}
                            onChange={(e) => setConfigRepresentative(e.target.value)}
                            className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-700 focus:outline-none focus:border-[#D02126]"
                          />
                        </div>
                      </div>

                      <div className="pt-2">
                        <button
                          onClick={() => {
                            setConfigSavedNotice(true);
                            setTimeout(() => setConfigSavedNotice(false), 3000);
                          }}
                          className="px-5 py-2.5 rounded-xl bg-[#D02126] hover:bg-[#B81B1F] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-2"
                        >
                          <Save className="w-4 h-4" />
                          <span>Guardar configuración</span>
                        </button>
                      </div>

                      {configSavedNotice && (
                        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>¡Configuración legal guardada con éxito!</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Subtab Content: Contacto */}
                  {settingsTab === 'contact' && (
                    <div className="space-y-4 pt-2 text-xs">
                      <h3 className="text-base font-bold text-[#0F1115]">Datos de contacto oficial</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-semibold text-gray-600 mb-1.5">Correo de contacto</label>
                          <input
                            type="email"
                            defaultValue="alexis.s.m@gmail.com"
                            className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-gray-700"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-gray-600 mb-1.5">Teléfono WhatsApp</label>
                          <input
                            type="text"
                            defaultValue="+56 9 7388 8336"
                            className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-gray-700"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Subtab Content: Medios de pago (Screenshot 1 Exact Match) */}
                  {settingsTab === 'payments' && (
                    <div className="space-y-6 pt-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[#0F1115]">
                          <CreditCard className="w-5 h-5 text-[#D02126]" />
                          <h3 className="text-base font-bold">Medios de pago de tus portales</h3>
                        </div>
                        <p className="text-xs text-gray-500 font-normal">
                          Elige las opciones que podrán usar tus clientes. Cada medio se configura en Integraciones.
                        </p>
                      </div>

                      <div className="space-y-3 max-w-2xl">
                        {/* 1. Mercado Pago */}
                        <div className="bg-[#FAF9F8] rounded-2xl p-4 flex items-center justify-between border border-gray-100">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                              🤝
                            </div>
                            <div>
                              <span className="font-bold text-xs text-[#0F1115] block">Mercado Pago</span>
                              <span className="text-[11px] text-gray-400 block">Configura primero este medio en Integraciones</span>
                            </div>
                          </div>
                          <button
                            onClick={() => setActiveTab('integrations')}
                            className="text-xs font-bold text-[#D02126] hover:underline cursor-pointer"
                          >
                            Configurar →
                          </button>
                        </div>

                        {/* 2. Flow */}
                        <div className="bg-[#FAF9F8] rounded-2xl p-4 flex items-center justify-between border border-gray-100">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">
                              flow$
                            </div>
                            <div>
                              <span className="font-bold text-xs text-[#0F1115] block">Flow</span>
                              <span className="text-[11px] text-gray-400 block">Configura primero este medio en Integraciones</span>
                            </div>
                          </div>
                          <button
                            onClick={() => setActiveTab('integrations')}
                            className="text-xs font-bold text-[#D02126] hover:underline cursor-pointer"
                          >
                            Configurar →
                          </button>
                        </div>

                        {/* 3. Transferencia bancaria */}
                        <div className="bg-[#FAF9F8] rounded-2xl p-4 flex items-center justify-between border border-gray-100">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-teal-50 text-[#D02126] flex items-center justify-center font-bold text-xs">
                              <Landmark className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="font-bold text-xs text-[#0F1115] block">Transferencia bancaria</span>
                              <span className="text-[11px] text-gray-400 block">Disponible para activar</span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setConfigBankTransferActive(!configBankTransferActive)}
                            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                              configBankTransferActive ? 'bg-[#D02126] justify-end' : 'bg-gray-300 justify-start'
                            }`}
                          >
                            <span className="w-4 h-4 rounded-full bg-white shadow-xs" />
                          </button>
                        </div>
                      </div>

                      <div className="pt-2">
                        <button
                          onClick={() => {
                            setConfigSavedNotice(true);
                            setTimeout(() => setConfigSavedNotice(false), 3000);
                          }}
                          className="px-5 py-2.5 rounded-xl bg-[#D02126] hover:bg-[#B81B1F] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-2"
                        >
                          <Save className="w-4 h-4" />
                          <span>Guardar preferencias</span>
                        </button>
                      </div>

                      {configSavedNotice && (
                        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>¡Preferencias de medios de pago actualizadas!</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Subtab Content: Notificaciones (Screenshots 2, 3, 4, 5 Exact Match) */}
                  {settingsTab === 'notifications' && (
                    <div className="space-y-8 pt-2">
                      <div className="space-y-1">
                        <h3 className="text-base font-bold text-[#0F1115]">
                          Notificaciones a tus clientes
                        </h3>
                        <p className="text-xs text-gray-500 font-normal">
                          Define cuándo enviar tus avisos y elige los canales para cada comunicación.
                        </p>
                      </div>

                      {/* 1. Días y horario de envío */}
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <h4 className="text-xs font-bold text-[#0F1115]">Días y horario de envío</h4>
                          <p className="text-[11px] text-gray-500">Horarios de Chile. Estos ajustes se aplican a los avisos de tu corredora.</p>
                        </div>

                        {/* Days checkboxes */}
                        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-700">
                          {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map((day) => {
                            const isChecked = configNotifDays.includes(day);
                            return (
                              <label key={day} className="flex items-center gap-1.5 cursor-pointer select-none">
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => {
                                    if (isChecked) {
                                      setConfigNotifDays(configNotifDays.filter(d => d !== day));
                                    } else {
                                      setConfigNotifDays([...configNotifDays, day]);
                                    }
                                  }}
                                  className="w-4 h-4 rounded text-[#D02126] border-gray-300 focus:ring-[#D02126]"
                                />
                                <span>{day}</span>
                              </label>
                            );
                          })}
                        </div>

                        {/* Time range */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
                          <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Desde</label>
                            <input
                              type="time"
                              value={configNotifFrom}
                              onChange={(e) => setConfigNotifFrom(e.target.value)}
                              className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-700 outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Hasta</label>
                            <input
                              type="time"
                              value={configNotifTo}
                              onChange={(e) => setConfigNotifTo(e.target.value)}
                              className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-700 outline-none"
                            />
                          </div>
                        </div>

                        {/* Non-business day fallback */}
                        <div className="max-w-xl">
                          <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                            Si el aviso de vencimiento cae en un día no habilitado
                          </label>
                          <select
                            value={configNotifFallback}
                            onChange={(e) => setConfigNotifFallback(e.target.value)}
                            className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-700 outline-none"
                          >
                            <option value="Anticipar al día habilitado anterior">Anticipar al día habilitado anterior</option>
                            <option value="Postergar al día hábil siguiente">Postergar al día hábil siguiente</option>
                            <option value="Enviar de todas formas">Enviar de todas formas</option>
                          </select>
                        </div>
                      </div>

                      {/* 2. Recordatorios */}
                      <div className="space-y-4 pt-4 border-t border-gray-100">
                        <h4 className="text-xs font-bold text-[#0F1115]">Recordatorios</h4>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Primer aviso: días antes del vencimiento</label>
                            <input
                              type="number"
                              value={configNotifFirstDays}
                              onChange={(e) => setConfigNotifFirstDays(Number(e.target.value))}
                              className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-gray-700 outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Aviso de saldo vencido: días después</label>
                            <input
                              type="number"
                              value={configNotifOverdueDays}
                              onChange={(e) => setConfigNotifOverdueDays(Number(e.target.value))}
                              className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-gray-700 outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Recordatorio de citas: horas antes</label>
                            <input
                              type="number"
                              value={configNotifHoursBefore}
                              onChange={(e) => setConfigNotifHoursBefore(Number(e.target.value))}
                              className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-gray-700 outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Propietarios: días antes del término del contrato o mandato</label>
                            <input
                              type="number"
                              value={configNotifOwnerMandateDays}
                              onChange={(e) => setConfigNotifOwnerMandateDays(Number(e.target.value))}
                              className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-gray-700 outline-none"
                            />
                          </div>
                        </div>

                        <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer pt-1 select-none">
                          <input
                            type="checkbox"
                            checked={configNotifSecondNotice}
                            onChange={(e) => setConfigNotifSecondNotice(e.target.checked)}
                            className="w-4 h-4 rounded text-[#D02126] border-gray-300 focus:ring-[#D02126]"
                          />
                          <span>Añadir un segundo aviso para el vencimiento</span>
                        </label>
                      </div>

                      {/* 3. Canales por aviso */}
                      <div className="space-y-6 pt-4 border-t border-gray-100">
                        <div className="space-y-1">
                          <h4 className="text-xs font-bold text-[#0F1115]">Canales por aviso</h4>
                          <p className="text-[11px] text-gray-500">Marca los medios que deseas utilizar en cada caso.</p>
                        </div>

                        {/* Helper table builder matching exact Altenda Screenshot groups */}
                        {[
                          {
                            sectionTitle: 'Notificaciones de arrendatarios',
                            items: [
                              'Bienvenida al portal',
                              'Nuevo cobro de arriendo',
                              'Aviso previo al vencimiento',
                              'Aviso de vencimiento',
                              'Saldo vencido',
                              'Pago registrado'
                            ]
                          },
                          {
                            sectionTitle: 'Documentos y firmas',
                            items: [
                              'Documento para firmar',
                              'Documento firmado'
                            ]
                          },
                          {
                            sectionTitle: 'Propietarios de arriendos',
                            items: [
                              'Arriendo: pago registrado',
                              'Arriendo: saldo vencido',
                              'Arriendo: liquidación cerrada'
                            ]
                          },
                          {
                            sectionTitle: 'Propietarios: documentos',
                            items: [
                              'Documento para firmar',
                              'Documento firmado'
                            ]
                          },
                          {
                            sectionTitle: 'Cartera de ventas',
                            items: [
                              'Venta: actividad confirmada',
                              'Venta: actividad cancelada',
                              'Venta: cambio de estado'
                            ]
                          },
                          {
                            sectionTitle: 'Visitas y demostraciones',
                            items: [
                              'Visita a propiedad confirmada',
                              'Reunión o firma agendada',
                              'Recordatorio de cita',
                              'Cita cancelada'
                            ]
                          }
                        ].map((group, gIdx) => (
                          <div key={gIdx} className="space-y-3">
                            <h5 className="text-xs font-bold text-[#0F1115]">{group.sectionTitle}</h5>
                            
                            <div className="border border-gray-100 rounded-2xl overflow-hidden">
                              <table className="w-full text-left text-xs">
                                <thead>
                                  <tr className="bg-[#FAF9F8] border-b border-gray-100 text-gray-400 font-semibold text-[11px]">
                                    <th className="py-2.5 px-4 w-1/2">
                                      <span className="flex items-center gap-1">Aviso <ArrowUpDown className="w-3 h-3" /></span>
                                    </th>
                                    <th className="py-2.5 px-4 text-center">
                                      <span className="inline-flex items-center gap-1">Email <ArrowUpDown className="w-3 h-3" /></span>
                                    </th>
                                    <th className="py-2.5 px-4 text-center">
                                      <span className="inline-flex items-center gap-1">WhatsApp <ArrowUpDown className="w-3 h-3" /></span>
                                    </th>
                                    <th className="py-2.5 px-4 text-center">
                                      <span className="inline-flex items-center gap-1">SMS <ArrowUpDown className="w-3 h-3" /></span>
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 bg-white">
                                  {group.items.map((rowName, rIdx) => (
                                    <tr key={rIdx} className="hover:bg-gray-50/50">
                                      <td className="py-3 px-4 font-medium text-gray-700">{rowName}</td>
                                      <td className="py-3 px-4 text-center">
                                        <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-[#D02126] border-gray-300 focus:ring-[#D02126]" />
                                      </td>
                                      <td className="py-3 px-4 text-center">
                                        <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-[#D02126] border-gray-300 focus:ring-[#D02126]" />
                                      </td>
                                      <td className="py-3 px-4 text-center">
                                        <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-[#D02126] border-gray-300 focus:ring-[#D02126]" />
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        ))}

                        <div className="pt-2">
                          <button
                            onClick={() => {
                              setConfigSavedNotice(true);
                              setTimeout(() => setConfigSavedNotice(false), 3000);
                            }}
                            className="px-5 py-2.5 rounded-xl bg-[#D02126] hover:bg-[#B81B1F] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-2"
                          >
                            <Save className="w-4 h-4" />
                            <span>Guardar notificaciones</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="text-center text-xs text-gray-400 pt-6">
                  © 2026 Melsa V1.0.0
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
              <h3 className="text-base font-bold text-[#0F1115]">Agregar Nueva Propiedad</h3>
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
                  className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-[#0F1115] outline-none"
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
                    className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#0F1115] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Canon Arriendo CLP *</label>
                  <input
                    type="number"
                    value={newPropRent}
                    onChange={(e) => setNewPropRent(Number(e.target.value))}
                    className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#0F1115] font-bold outline-none"
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
                    className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#0F1115] outline-none"
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
                    className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#0F1115] outline-none"
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
                  className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-[#0F1115] outline-none"
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
                className="w-full py-3 rounded-xl bg-[#D02126] hover:bg-[#B81B1F] text-white font-bold text-xs tracking-wider uppercase transition-all shadow-xs cursor-pointer mt-2"
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
              <h3 className="text-base font-bold text-[#0F1115]">Agendar Actividad</h3>
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
                  className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-[#0F1115] outline-none"
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
                    className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#0F1115] outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Hora</label>
                  <input
                    type="time"
                    value={newActivityTime}
                    onChange={(e) => setNewActivityTime(e.target.value)}
                    className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#0F1115] outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#D02126] hover:bg-[#B81B1F] text-white font-bold text-xs tracking-wider uppercase transition-all shadow-xs cursor-pointer mt-2"
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
              <h3 className="text-base font-bold text-[#0F1115]">Nueva Propiedad en Venta</h3>
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
                  className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-[#0F1115] outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Precio en UF</label>
                <input
                  type="number"
                  value={newSaleUF}
                  onChange={(e) => setNewSaleUF(Number(e.target.value))}
                  className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-[#0F1115] font-mono font-bold outline-none"
                />
                <span className="text-[10px] text-gray-400 mt-1 block">
                  Comisión estimada (2%): ~{formatCLP(Math.round(newSaleUF * 41295 * 0.02))}
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#D02126] hover:bg-[#B81B1F] text-white font-bold text-xs tracking-wider uppercase transition-all shadow-xs cursor-pointer mt-2"
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
              <h3 className="text-base font-bold text-[#0F1115]">Crear Nuevo Contrato de Arriendo</h3>
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
                  className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-[#0F1115] outline-none"
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
                  className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-[#0F1115] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Canon Mensual CLP *</label>
                  <input
                    type="number"
                    value={newContractRent}
                    onChange={(e) => setNewContractRent(Number(e.target.value))}
                    className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#0F1115] font-bold outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Reajuste Periódico</label>
                  <select
                    value={newContractIndex}
                    onChange={(e) => setNewContractIndex(e.target.value)}
                    className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#0F1115] outline-none"
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
                className="w-full py-3 rounded-xl bg-[#D02126] hover:bg-[#B81B1F] text-white font-bold text-xs tracking-wider uppercase transition-all shadow-xs cursor-pointer mt-2"
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
                <FileCode className="w-5 h-5 text-[#D02126]" />
                <h3 className="text-base font-bold text-[#0F1115]">Plantillas y Variables Dinámicas</h3>
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
                    <code className="text-[#D02126] font-mono font-bold text-xs">{v.tag}</code>
                    <p className="text-gray-500 text-[11px] mt-0.5">{v.desc}</p>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(v.tag);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white border border-gray-200 text-gray-600 hover:text-[#D02126] text-[10px] font-bold cursor-pointer"
                  >
                    Copiar
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <button
                onClick={() => setIsTemplatesModalOpen(false)}
                className="w-full py-2.5 rounded-xl bg-[#D02126] hover:bg-[#B81B1F] text-white font-bold text-xs cursor-pointer"
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
              <h3 className="text-base font-bold text-[#0F1115]">Agregar Nuevo Cliente</h3>
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
                  className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#0F1115] outline-none"
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
                  className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#0F1115] outline-none"
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
                  className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#0F1115] outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#D02126] hover:bg-[#B81B1F] text-white font-bold text-xs tracking-wider uppercase transition-all shadow-xs cursor-pointer mt-2"
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
              <h3 className="text-base font-bold text-[#0F1115]">Registrar Gasto o Servicio</h3>
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
                  className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#0F1115] outline-none"
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
                    className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#0F1115] outline-none"
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
                    className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#0F1115] font-bold outline-none"
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
                  className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#0F1115] outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#D02126] hover:bg-[#B81B1F] text-white font-bold text-xs tracking-wider uppercase transition-all shadow-xs cursor-pointer mt-2"
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
              <h3 className="text-base font-bold text-[#0F1115]">Crear Nuevo Usuario</h3>
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
                  className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#0F1115] outline-none"
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
                  className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#0F1115] outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Rol de Acceso</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as any)}
                  className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#0F1115] outline-none"
                >
                  <option value="Colaborador">Colaborador (Acceso a captación y cartera)</option>
                  <option value="Administrador">Administrador (Control total y liquidaciones)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#D02126] hover:bg-[#B81B1F] text-white font-bold text-xs tracking-wider uppercase transition-all shadow-xs cursor-pointer mt-2"
              >
                Invitar al Equipo
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: REDACTOR DE FICHAS COMERCIALES CON IA (SUPERPODER 3)    */}
      {/* ============================================================== */}
      {isAiCopyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0F1115]">Redactor Comercial con IA</h3>
                  <span className="text-[10px] text-gray-400">Optimizado para Portal Inmobiliario, TocToc y WhatsApp</span>
                </div>
              </div>
              <button 
                onClick={() => setIsAiCopyModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {aiGeneratingCopy ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-10 h-10 border-3 border-[#D02126] border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-gray-600 font-semibold">
                  Generando redacción publicitaria de alta conversión...
                </p>
                <span className="text-[10px] text-gray-400">Analizando metros cuadrados, conectividad y puntos de interés.</span>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-2xl">
                  <textarea
                    rows={10}
                    value={aiGeneratedListingCopy}
                    onChange={(e) => setAiGeneratedListingCopy(e.target.value)}
                    className="w-full bg-transparent text-xs text-gray-800 font-sans focus:outline-none resize-none leading-relaxed"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(aiGeneratedListingCopy);
                      alert('✓ ¡Ficha comercial copiada al portapapeles!');
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-[#D02126] hover:bg-[#B81B1F] text-white font-bold text-xs transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copiar Ficha al Portapapeles</span>
                  </button>

                  <button
                    onClick={() => {
                      setAiGeneratingCopy(true);
                      setTimeout(() => {
                        setAiGeneratedListingCopy(prev => prev + '\n\n⭐ Bono especial: Gastos comunes rebajados el primer mes.');
                        setAiGeneratingCopy(false);
                      }, 500);
                    }}
                    className="px-3.5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs cursor-pointer transition-colors"
                  >
                    Variar tono
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: LEGALTECH FIRMA ELECTRÓNICA NATIVA LEY 19.799 (PODER 5) */}
      {/* ============================================================== */}
      {isLegalSignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-200 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-50 text-[#D02126] flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0F1115]">Firma Electrónica Nativa</h3>
                  <span className="text-[10px] text-gray-400">Conforme a la Ley N° 19.799 de Chile</span>
                </div>
              </div>
              <button 
                onClick={() => {
                  setIsLegalSignModalOpen(false);
                  setSignedDocCertificate(null);
                }}
                className="text-gray-400 hover:text-gray-700 cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {signedDocCertificate ? (
              <div className="py-6 space-y-4 text-center">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-[#0F1115]">¡Documento Firmado con Éxito!</h4>
                  <p className="text-xs text-gray-500">
                    Se ha generado el certificado criptográfico de firma electrónica con estampado de tiempo.
                  </p>
                </div>

                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 font-mono text-[10px] text-gray-600 text-left space-y-1">
                  <div><strong>ID Documento:</strong> DOC-{Date.now().toString().slice(-6)}</div>
                  <div><strong>Certificado Hash:</strong> {signedDocCertificate}</div>
                  <div><strong>Firmantes validados:</strong> 2 de 2 (Corredor y Arrendatario)</div>
                  <div><strong>Validez Jurídica:</strong> Plena prueba legal en tribunales chilenos</div>
                </div>

                <button
                  onClick={() => {
                    setIsLegalSignModalOpen(false);
                    setSignedDocCertificate(null);
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#D02126] hover:bg-[#B81B1F] text-white font-bold text-xs cursor-pointer shadow-xs"
                >
                  Cerrar y Ver Contrato Firmado
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setIsSigningProcess(true);
                  setTimeout(() => {
                    setIsSigningProcess(false);
                    setSignedDocCertificate('SHA256:8b4e72f910cd4a61b8f' + Date.now().toString(16));
                  }, 1200);
                }}
                className="space-y-3.5 text-xs"
              >
                <div className="p-3 rounded-2xl bg-[#FAF9F8] border border-gray-200 space-y-1.5">
                  <span className="text-[10px] font-bold text-gray-400 uppercase block">Documento a Suscribir</span>
                  <div className="font-bold text-[#0F1115]">{legalSignContract?.propertyAddress || 'Los Pinos 356, Las Condes'}</div>
                  <div className="text-gray-500 text-[11px]">
                    Parte Interesada: <strong>{legalSignContract?.tenantName || 'Alexis Santana'}</strong>
                  </div>
                  <div className="text-[#D02126] font-bold text-[11px]">
                    Canon: {formatCLP(legalSignContract?.rentCLP || 750000)} / mes
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">RUT del Representante / Corredor *</label>
                  <input
                    type="text"
                    required
                    defaultValue="15.883.974-1"
                    className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3 py-2 text-xs font-mono text-[#0F1115] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Código de Validación OTP (Enviado al correo/móvil) *</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      maxLength={6}
                      defaultValue="209676"
                      className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3 py-2 text-xs font-mono text-[#0F1115] tracking-widest text-center font-bold outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => alert('Código OTP reenviado al correo alexis.s.m@gmail.com')}
                      className="px-3 py-2 rounded-xl border border-gray-200 text-[11px] text-gray-600 hover:bg-gray-50 font-semibold cursor-pointer shrink-0"
                    >
                      Reenviar
                    </button>
                  </div>
                  <span className="text-[10px] text-gray-400 block mt-1">Código de 6 dígitos con validez de 24 horas.</span>
                </div>

                <div className="flex items-start gap-2 pt-1 text-[11px] text-gray-600">
                  <input type="checkbox" required defaultChecked id="legalTerms" className="mt-0.5 accent-[#D02126]" />
                  <label htmlFor="legalTerms" className="cursor-pointer">
                    Acepto suscribir electrónicamente este instrumento privado con validez jurídica según la <strong>Ley 19.799</strong> de Chile.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSigningProcess}
                  className="w-full py-2.5 rounded-xl bg-[#D02126] hover:bg-[#B81B1F] text-white font-bold text-xs tracking-wider uppercase transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
                >
                  {isSigningProcess ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Validando Firma Criptográfica...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Firmar Instrumento Ahora</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* KILLER 1: MODAL INGESTA MULTIMODAL IA (VOZ / PDF / URL)        */}
      {/* ============================================================== */}
      {isMultimodalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-gray-200 space-y-4 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#D02126] flex items-center justify-center">
                  <Mic className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0F1115]">Ingesta Multimodal de Propiedades</h3>
                  <span className="text-[10px] text-gray-400">Cero fricción: Extrae datos desde voz, folletos o portales</span>
                </div>
              </div>
              <button 
                onClick={() => {
                  setIsMultimodalModalOpen(false);
                  setExtractedPropertyResult(null);
                }}
                className="text-gray-400 hover:text-gray-700 cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 3 Source Tabs */}
            <div className="flex border-b border-gray-200 text-xs font-semibold">
              <button
                onClick={() => setMultimodalTab('voice')}
                className={`flex-1 py-2 text-center border-b-2 transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                  multimodalTab === 'voice' ? 'border-[#D02126] text-[#D02126] font-bold' : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                <Mic className="w-3.5 h-3.5" />
                <span>Nota de Voz (Audio)</span>
              </button>
              <button
                onClick={() => setMultimodalTab('doc')}
                className={`flex-1 py-2 text-center border-b-2 transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                  multimodalTab === 'doc' ? 'border-[#D02126] text-[#D02126] font-bold' : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>PDF / Brochure Antiguo</span>
              </button>
              <button
                onClick={() => setMultimodalTab('url')}
                className={`flex-1 py-2 text-center border-b-2 transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                  multimodalTab === 'url' ? 'border-[#D02126] text-[#D02126] font-bold' : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Enlace de Portal</span>
              </button>
            </div>

            {!extractedPropertyResult ? (
              <div className="space-y-4 text-xs">
                {multimodalTab === 'voice' && (
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#0F1115]">Dicta o describe el inmueble:</span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-semibold">
                          Micro en vivo
                        </span>
                      </div>
                      <button
                        onClick={toggleVoiceRecording}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                          isListeningVoice 
                            ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse shadow-md' 
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                        }`}
                      >
                        <Mic className="w-3.5 h-3.5" />
                        <span>{isListeningVoice ? '⏹️ Detener Grabación' : '🎙️ Dictar por Micrófono'}</span>
                      </button>
                    </div>

                    {isListeningVoice && (
                      <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700 animate-in fade-in">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
                        <span className="font-medium text-[11px]">
                          Escuchando activamente... Habla claro (ej: <em>"Depto 2 dormitorios en Las Condes, arriendo 850 mil, 75 metros..."</em>)
                        </span>
                      </div>
                    )}

                    {speechError && (
                      <div className="p-2 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-[11px]">
                        {speechError}
                      </div>
                    )}

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] uppercase font-bold text-gray-400">Transcripción / Texto a procesar:</label>
                        <span className="text-[10px] text-gray-400">Puedes editar el texto antes de extraer</span>
                      </div>
                      <textarea
                        rows={4}
                        value={multimodalTranscript}
                        onChange={(e) => setMultimodalTranscript(e.target.value)}
                        placeholder="Presiona '🎙️ Dictar por Micrófono' y habla (ej: 'Casa de 5 habitaciones en Las Condes...'), o escribe directamente aquí."
                        className="w-full bg-white border border-gray-200 rounded-xl p-3 text-xs text-gray-700 leading-relaxed focus:outline-none focus:border-[#D02126]"
                      />
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[10px] text-gray-400 font-medium">Ejemplos para probar:</span>
                        <button
                          type="button"
                          onClick={() => setMultimodalTranscript('Casa de 5 habitaciones en Las Condes, 4 baños, 220 m², arriendo $2.400.000 con patio y quincho')}
                          className="text-[10px] bg-white border border-gray-200 hover:border-[#D02126] text-gray-700 px-2.5 py-1 rounded-lg cursor-pointer transition-colors shadow-2xs"
                        >
                          🏡 Casa 5 Habitaciones
                        </button>
                        <button
                          type="button"
                          onClick={() => setMultimodalTranscript('Departamento de 2 dormitorios y 2 baños en Providencia cerca de Metro Manuel Montt, 75 m², $780.000 con estacionamiento')}
                          className="text-[10px] bg-white border border-gray-200 hover:border-[#D02126] text-gray-700 px-2.5 py-1 rounded-lg cursor-pointer transition-colors shadow-2xs"
                        >
                          🏢 Depto 2D Providencia
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {multimodalTab === 'doc' && (
                  <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center space-y-2 bg-gray-50/50">
                    <UploadCloud className="w-8 h-8 text-[#D02126] mx-auto" />
                    <div className="font-bold text-[#0F1115]">Arrastra aquí la ficha antigua, orden de visita o PDF del inmueble</div>
                    <p className="text-[11px] text-gray-400">El modelo extraerá metros útiles, orientación, rol, arriendo y tasación</p>
                    <button
                      onClick={() => {
                        setMultimodalTranscript('Ficha Técnica de Depto: Manuel Montt 890, Providencia. Rol 1289-4. 2 dormitorios, 2 baños, 75 m² construidos, orientación Norte. Canon sugerido: $780.000. Incluye 1 estacionamiento y 1 bodega.');
                      }}
                      className="px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-gray-700 font-semibold text-xs hover:bg-gray-50 cursor-pointer shadow-2xs"
                    >
                      Cargar muestra Ficha_Providencia.pdf
                    </button>
                  </div>
                )}

                {multimodalTab === 'url' && (
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
                    <label className="font-bold text-[#0F1115] block">Pega la URL de Portal Inmobiliario, TocToc o Yapo:</label>
                    <input
                      type="url"
                      value={multimodalUrlInput}
                      onChange={(e) => setMultimodalUrlInput(e.target.value)}
                      placeholder="https://www.portalinmobiliario.com/..."
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-mono text-gray-700 outline-none"
                    />
                    <span className="text-[10px] text-gray-400 block">
                      Extrae las variables del inmueble sin tener que volver a digitar cada campo.
                    </span>
                  </div>
                )}

                <button
                  disabled={isProcessingMultimodal || !multimodalTranscript.trim()}
                  onClick={async () => {
                    setIsProcessingMultimodal(true);
                    try {
                      const extracted = await extractPropertyWithGroq(multimodalTranscript);
                      setExtractedPropertyResult(extracted);
                    } catch (e) {
                      console.error('Error extrayendo con Groq:', e);
                    } finally {
                      setIsProcessingMultimodal(false);
                    }
                  }}
                  className="w-full py-3 rounded-xl bg-[#D02126] hover:bg-[#B81B1F] text-white font-bold text-xs tracking-wider uppercase transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isProcessingMultimodal ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Extrayendo Variables con Groq AI (Qwen 3.8 / Llama 3)...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>⚡ Procesar y Extraer con Groq AI en Vivo</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              /* Review & Approval Step (Zero Friction) */
              <div className="space-y-4 text-xs animate-in fade-in">
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-emerald-800">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="font-bold">Datos estructurados por Groq AI. Revisa y aprueba:</span>
                  </div>
                  <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded-full border border-emerald-300">
                    Groq 400 tok/s
                  </span>
                </div>

                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-1">
                  <span className="text-[10px] text-gray-400 uppercase font-bold">Título de la Propiedad</span>
                  <input
                    type="text"
                    value={extractedPropertyResult.title}
                    onChange={(e) => setExtractedPropertyResult({ ...extractedPropertyResult, title: e.target.value })}
                    className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 font-bold text-[#0F1115] text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-200">
                    <span className="text-[10px] text-gray-400 block uppercase font-bold">Comuna</span>
                    <input
                      type="text"
                      value={extractedPropertyResult.commune}
                      onChange={(e) => setExtractedPropertyResult({ ...extractedPropertyResult, commune: e.target.value })}
                      className="w-full bg-white border border-gray-200 rounded px-1.5 py-0.5 font-bold text-[#0F1115] text-xs"
                    />
                  </div>
                  <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-200">
                    <span className="text-[10px] text-gray-400 block uppercase font-bold">Distribución</span>
                    <span className="font-bold text-[#0F1115] block pt-1">{extractedPropertyResult.bedrooms}D / {extractedPropertyResult.bathrooms}B</span>
                  </div>
                  <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-200">
                    <span className="text-[10px] text-gray-400 block uppercase font-bold">Superficie</span>
                    <span className="font-bold text-[#0F1115] block pt-1">{extractedPropertyResult.surfaceM2} m²</span>
                  </div>
                  <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-200">
                    <span className="text-[10px] text-gray-400 block uppercase font-bold">Canon Arriendo</span>
                    <span className="font-bold text-[#D02126] block pt-1">{formatCLP(extractedPropertyResult.rentCLP)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2 bg-gray-50 rounded-xl border border-gray-200">
                    <span className="text-[10px] text-gray-400 block uppercase font-bold">Estacionamientos</span>
                    <span className="font-bold text-[#0F1115]">{extractedPropertyResult.parking} unid.</span>
                  </div>
                  <div className="p-2 bg-gray-50 rounded-xl border border-gray-200">
                    <span className="text-[10px] text-gray-400 block uppercase font-bold">Bodegas</span>
                    <span className="font-bold text-[#0F1115]">{extractedPropertyResult.storage} unid.</span>
                  </div>
                  <div className="p-2 bg-gray-50 rounded-xl border border-gray-200">
                    <span className="text-[10px] text-gray-400 block uppercase font-bold">Mantenimiento</span>
                    <span className="font-bold text-gray-700 truncate block" title={extractedPropertyResult.maintenanceStatus}>
                      {extractedPropertyResult.maintenanceStatus}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#0F1115]">Descripción Comercial Generada por IA (SEO Ready):</label>
                  <textarea
                    rows={5}
                    value={extractedPropertyResult.generatedCopy}
                    onChange={(e) => setExtractedPropertyResult({ ...extractedPropertyResult, generatedCopy: e.target.value })}
                    className="w-full bg-white border border-gray-200 rounded-xl p-3 text-xs text-gray-800 leading-relaxed focus:outline-none focus:border-[#D02126]"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => {
                      const newProp: AgencyPropertyItem = {
                        id: 'prop-' + Date.now(),
                        title: extractedPropertyResult.title,
                        address: extractedPropertyResult.address || 'Dirección registrada',
                        commune: extractedPropertyResult.commune,
                        type: extractedPropertyResult.type === 'Casa' ? 'Casa' : 'Depto',
                        bedrooms: extractedPropertyResult.bedrooms,
                        bathrooms: extractedPropertyResult.bathrooms,
                        surfaceM2: extractedPropertyResult.surfaceM2,
                        rentCLP: extractedPropertyResult.rentCLP,
                        ownerName: 'Propietario Captado por IA',
                        status: 'disponible',
                        coverPhoto: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800'
                      };
                      setProperties(prev => [newProp, ...prev]);
                      setIsMultimodalModalOpen(false);
                      setExtractedPropertyResult(null);
                      setCopilotActionNotice(`✓ ¡Propiedad "${newProp.title}" incorporada a tu cartera y guardada en el sistema!`);
                    }}
                    className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs tracking-wider uppercase transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>✓ Aprobar e Incorporar a Cartera Activa</span>
                  </button>

                  <button
                    onClick={() => setExtractedPropertyResult(null)}
                    className="px-4 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold text-xs cursor-pointer"
                  >
                    Reintentar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* KILLER 3: CREADOR DE PROPUESTAS DE INVERSIÓN (PITCH GENERATOR)  */}
      {/* ============================================================== */}
      {isPitchGeneratorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-gray-200 space-y-4 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0F1115]">Creador de Propuestas de Inversión (Pitch Generator)</h3>
                  <span className="text-[10px] text-gray-400">Genera Dossiers ejecutivos con Cap Rate, TIR y análisis de plusvalía</span>
                </div>
              </div>
              <button 
                onClick={() => setIsPitchGeneratorOpen(false)}
                className="text-gray-400 hover:text-gray-700 cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Financial Parameters Panel */}
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Inversionista Destino</label>
                  <input
                    type="text"
                    value={pitchTargetInvestor}
                    onChange={(e) => setPitchTargetInvestor(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 font-semibold text-[#0F1115] outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Propiedad del Inventario</label>
                  <select
                    value={pitchPropertyId}
                    onChange={(e) => setPitchPropertyId(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 font-semibold text-[#0F1115] outline-none cursor-pointer"
                  >
                    {properties.map(p => (
                      <option key={p.id} value={p.id}>{p.title} ({p.commune})</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Sliders: Pie, Tasa, Plazo */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-gray-200">
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-gray-500 font-semibold">Pie Inicial:</span>
                    <span className="font-bold text-[#D02126]">{pitchDownPaymentPct}%</span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={30}
                    step={5}
                    value={pitchDownPaymentPct}
                    onChange={(e) => setPitchDownPaymentPct(Number(e.target.value))}
                    className="w-full accent-[#D02126] cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-gray-500 font-semibold">Tasa Hipotecaria:</span>
                    <span className="font-bold text-[#D02126]">{pitchInterestRate}%</span>
                  </div>
                  <input
                    type="range"
                    min={3.5}
                    max={6.5}
                    step={0.1}
                    value={pitchInterestRate}
                    onChange={(e) => setPitchInterestRate(Number(e.target.value))}
                    className="w-full accent-[#D02126] cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-gray-500 font-semibold">Plazo Crédito:</span>
                    <span className="font-bold text-[#D02126]">{pitchLoanTermYears} años</span>
                  </div>
                  <input
                    type="range"
                    min={20}
                    max={30}
                    step={5}
                    value={pitchLoanTermYears}
                    onChange={(e) => setPitchLoanTermYears(Number(e.target.value))}
                    className="w-full accent-[#D02126] cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Generated Executive Dossier Preview */}
            <div className="bg-[#0F1115] rounded-3xl p-6 text-white space-y-4 shadow-md">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div>
                  <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider block">
                    Dossier Ejecutivo de Inversión
                  </span>
                  <h4 className="text-base font-bold text-white">Preparado para: {pitchTargetInvestor}</h4>
                </div>
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-xl bg-white/10 text-emerald-300 border border-white/10">
                  Viability Score: 94 / 100
                </span>
              </div>

              {/* 4 Financial KPI Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="bg-white/10 p-3 rounded-2xl">
                  <span className="text-[10px] text-gray-300 block">Cap Rate Neto</span>
                  <span className="text-xl font-bold text-emerald-400 block mt-0.5">5.92% anual</span>
                  <span className="text-[9px] text-gray-300">Sobre valor compra</span>
                </div>
                <div className="bg-white/10 p-3 rounded-2xl">
                  <span className="text-[10px] text-gray-300 block">TIR Proyectada (10a)</span>
                  <span className="text-xl font-bold text-amber-300 block mt-0.5">11.4% anual</span>
                  <span className="text-[9px] text-gray-300">Con plusvalía UF</span>
                </div>
                <div className="bg-white/10 p-3 rounded-2xl">
                  <span className="text-[10px] text-gray-300 block">Cash Flow Mensual</span>
                  <span className="text-xl font-bold text-emerald-400 block mt-0.5">+$68.400</span>
                  <span className="text-[9px] text-gray-300">Arriendo - Dividendo</span>
                </div>
                <div className="bg-white/10 p-3 rounded-2xl">
                  <span className="text-[10px] text-gray-300 block">Beneficio Tributario</span>
                  <span className="text-xl font-bold text-white block mt-0.5">DFL-2 100%</span>
                  <span className="text-[9px] text-gray-300">Exento contribuciones 10a</span>
                </div>
              </div>

              <p className="text-[11px] text-gray-300 leading-relaxed bg-white/5 p-3 rounded-2xl border border-white/10">
                💡 <strong>Tesis de Inversión Melsa:</strong> El activo genera un flujo neto positivo inmediato apalancado al {100 - pitchDownPaymentPct}%. La vacancia histórica en el sector es inferior al 3.1%, asegurando continuidad operacional y resguardo frente a la inflación en UF.
              </p>
            </div>

            {/* Actions: Download PDF or Share via WhatsApp */}
            <div className="flex items-center gap-2 pt-2">
              <a
                href={`https://wa.me/56991234567?text=${encodeURIComponent(`Estimado ${pitchTargetInvestor}, te adjunto la propuesta ejecutiva de inversión inmobiliaria preparada por Los Pinos Proptech con Cap Rate 5.92% y TIR 11.4%. ¿Cuándo podríamos revisarla en una breve llamada?`)}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs tracking-wider uppercase transition-all shadow-xs flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Enviar Dossier por WhatsApp (1 Clic)</span>
              </a>

              <button
                onClick={() => {
                  alert('✓ Descargando Dossier Ejecutivo en formato PDF interactivo con el logo de tu empresa...');
                }}
                className="px-4 py-3 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 font-bold text-xs cursor-pointer flex items-center gap-1.5 shadow-2xs"
              >
                <Download className="w-4 h-4 text-[#D02126]" />
                <span>Descargar PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* KILLER 5: MODAL REPORTE AUTOMÁTICO PARA EL PROPIETARIO         */}
      {/* ============================================================== */}
      {isOwnerReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 space-y-4 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#D02126] flex items-center justify-center">
                  <FileBarChart className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0F1115]">Reporte Periódico de Gestión</h3>
                  <span className="text-[10px] text-gray-400">Justificación formal de gestión comercial para el propietario</span>
                </div>
              </div>
              <button 
                onClick={() => setIsOwnerReportModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Inmueble Reportado</span>
                  <span className="font-bold text-[#0F1115]">Los Pinos 356, Las Condes</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Período: Noviembre 2026
                </span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-gray-200 space-y-1.5 leading-relaxed text-gray-700">
                <p>
                  <strong>Estimado Propietario(a):</strong>
                </p>
                <p>
                  Durante los últimos 30 días, su propiedad ha tenido una excelente recepción en nuestra red de vitrinas y portales sincronizados:
                </p>
                <ul className="list-disc pl-4 space-y-0.5 text-gray-600">
                  <li><strong>1.420 visualizaciones</strong> directas (+18% sobre el promedio de la comuna).</li>
                  <li><strong>47 interesados</strong> utilizaron el simulador financiero para calcular su crédito.</li>
                  <li><strong>5 visitas presenciales guiadas</strong> y 2 cartas de oferta formales recibidas.</li>
                  <li><strong>Benchmark de Valor:</strong> Su precio actual se ubica un 4.5% sobre la mediana de cierre en Las Condes. Sugerimos mantener o negociar un margen del 3% para concretar promesa esta misma semana.</li>
                </ul>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <a
                href={`https://wa.me/56991234567?text=${encodeURIComponent('Estimado propietario de Los Pinos 356, le comparto su Reporte Mensual de Gestión Comercial de Noviembre con el detalle de 1.420 visitas y 5 recorridos presenciales. Quedo atento a sus comentarios.')}`}
                target="_blank"
                rel="noreferrer"
                onClick={() => {
                  setIsOwnerReportModalOpen(false);
                  alert('✓ ¡Reporte mensual despachado por WhatsApp al propietario!');
                }}
                className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs tracking-wider uppercase transition-all shadow-xs flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Enviar Reporte por WhatsApp al Propietario</span>
              </a>

              <button
                onClick={() => {
                  alert('✓ Descargando Reporte Formal de Propietario en PDF...');
                }}
                className="px-4 py-3 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 font-bold text-xs cursor-pointer flex items-center gap-1.5"
              >
                <Download className="w-4 h-4 text-[#D02126]" />
                <span>PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
