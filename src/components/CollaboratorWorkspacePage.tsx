import React, { useState } from 'react';
import { MelsaLogo } from './MelsaLogo';
import { AuthUser, ProviderProject, ProviderApplication } from '../types';
import { HOME_SERVICE_PROVIDERS } from '../data/mockData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { 
  Building2, 
  Wrench, 
  Sparkles, 
  ArrowLeft, 
  Plus, 
  ShieldCheck, 
  Phone, 
  CheckCircle2, 
  Star, 
  Calendar, 
  FileText, 
  Trash2, 
  Check, 
  MapPin, 
  Clock, 
  Layers, 
  LogOut, 
  ExternalLink,
  DollarSign,
  AlertCircle,
  FileCheck2,
  XCircle,
  Eye,
  Award
} from 'lucide-react';

interface CollaboratorWorkspacePageProps {
  currentUser: AuthUser;
  onLogout: () => void;
  onBackToHome: () => void;
  applications?: ProviderApplication[];
  onApproveApplication?: (id: string) => void;
  onRejectApplication?: (id: string) => void;
}

// Category-tailored templates for realistic professional works
const CATEGORY_DEFAULTS: { [cat: string]: { label: string; icon: string; typicalServices: string[]; initialProjects: ProviderProject[] } } = {
  'Gasfitería': {
    label: 'Gasfitería & Redes Sanitarias / SEC',
    icon: '🔧',
    typicalServices: [
      'Detección acústica de fugas no visibles de agua',
      'Instalación y mantención de calefonts y calderas de condensación',
      'Prueba de hermeticidad y regularización sello verde SEC',
      'Destape mecanizado de alcantarillado con sonda eléctrica',
      'Cambio y reparación de matrices de cobre y termofusión PPR'
    ],
    initialProjects: [
      {
        id: 'gas-1',
        title: 'Instalación de Caldera Mural de Condensación & Circuito Calefacción',
        description: 'Reemplazo de caldera antigua por equipo Anwo de alta eficiencia, matriz de cobre 1 pulgada y purga de radiadores en San Damián.',
        imageBefore: 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&q=80&w=800',
        imageAfter: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&q=80&w=800',
        completionDate: 'Marzo 2026'
      },
      {
        id: 'gas-2',
        title: 'Detección No Invasiva de Fuga Subterránea & Renovación de Matriz',
        description: 'Localización milimétrica con gas trazador y geófono sin romper piso flotante, empalme nuevo en cobre soldado en Vitacura.',
        imageAfter: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800',
        completionDate: 'Febrero 2026'
      }
    ]
  },
  'Electricidad': {
    label: 'Electricidad SEC, Tableros & Domótica',
    icon: '⚡',
    typicalServices: [
      'Normalización de tableros eléctricos residenciales y diferenciales superinmunizados',
      'Certificación TE1 e inscripción ante la Superintendencia SEC',
      'Montaje de cargadores domiciliarios para autos eléctricos (Wallbox)',
      'Diseño e instalación de iluminación LED arquitectónica y domótica',
      'Medición de malla a tierra y corrección de sobretensiones'
    ],
    initialProjects: [
      {
        id: 'elec-1',
        title: 'Montaje de Tablero General Trifásico & Protecciones Hager',
        description: 'Reemplazo total de tablero antiguo de tapones por protecciones termomagnéticas y diferenciales clase A con barra de tierra en Las Condes.',
        imageBefore: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=800',
        imageAfter: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&q=80&w=800',
        completionDate: 'Febrero 2026'
      },
      {
        id: 'elec-2',
        title: 'Instalación de Punto de Carga EV Wallbox 7.4kW para Auto Eléctrico',
        description: 'Línea directa independiente de 6mm² desde medidor con protección diferencial tipo B y trámite SEC TE1 en Lo Barnechea.',
        imageAfter: 'https://images.unsplash.com/photo-1558441719-8645a27894a4?auto=format&fit=crop&q=80&w=800',
        completionDate: 'Enero 2026'
      }
    ]
  },
  'Remodelación & Pintura': {
    label: 'Remodelación Integral, Obras & Acabados',
    icon: '🔨',
    typicalServices: [
      'Remodelación llave en mano de cocinas con cubiertas de cuarzo o granito',
      'Modernización de baños con duchas italianas y mamparas de cristal',
      'Pisos vinílicos SPC hidrófugos y porcelanatos rectificados de gran formato',
      'Pintura termoplástica exterior resistente a rayos UV y salinidad costera',
      'Ampliaciones en metalcom estructuradas con aislación termoacústica'
    ],
    initialProjects: [
      {
        id: 'rem-1',
        title: 'Remodelación Integral Cocina Isla & Cubierta Silestone Calacatta',
        description: 'Demolición de muro tabique divisorio, muebles termoformados sin tiradores, campana oculta y piso porcelanato en Las Condes.',
        imageBefore: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=800',
        imageAfter: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&q=80&w=800',
        completionDate: 'Febrero 2026'
      },
      {
        id: 'rem-2',
        title: 'Modernización Baño Principal Suite, Ducha Walk-in & Grifería Empotrada',
        description: 'Retiro de tina convencional, instalación de plato de ducha en porcelanato con desagüe oculto y mampara templada en Vitacura.',
        imageBefore: 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&q=80&w=800',
        imageAfter: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&q=80&w=800',
        completionDate: 'Enero 2026'
      },
      {
        id: 'rem-3',
        title: 'Pintura Termoplástica de Fachada & Sellado Hidrófugo en Zapallar',
        description: 'Sellado elástico de microporos contra brisa marina, esmalte al agua de máxima lavabilidad y terminaciones impecables.',
        imageAfter: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=800',
        completionDate: 'Diciembre 2025'
      }
    ]
  },
  'Climatización': {
    label: 'Climatización Residencial & Aire Acondicionado',
    icon: '❄️',
    typicalServices: [
      'Instalación de aires acondicionados Split Inverter frío/calor silenciosos',
      'Mantención preventiva, limpieza química de evaporadores y desinfección',
      'Carga de refrigerante ecológico R410A / R32 con balanza electrónica',
      'Sistemas de calefacción central por suelo radiante o fan coils',
      'Ductería oculta en cielo falso sin alterar fachada'
    ],
    initialProjects: [
      {
        id: 'clim-1',
        title: 'Instalación Multi-Split Inverter 3 Zonas en Departamento Las Condes',
        description: 'Condensadora única en logia y 3 unidades interiores ultrasilenciosas de 9.000 BTU en dormitorios con canalización oculta.',
        imageAfter: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&q=80&w=800',
        completionDate: 'Febrero 2026'
      }
    ]
  },
  'Jardinería': {
    label: 'Paisajismo, Jardinería & Riego Tecnificado',
    icon: '🌿',
    typicalServices: [
      'Instalación de riego automático por goteo con controlador inteligente Wi-Fi',
      'Diseño paisajístico de bajo consumo hídrico y flora nativa chilena',
      'Instalación de césped en palmeta de primera calidad y siembra',
      'Poda de altura de árboles ornamentales con equipo de seguridad certificado',
      'Fertilización orgánica y control biológico de plagas de jardín'
    ],
    initialProjects: [
      {
        id: 'jard-1',
        title: 'Diseño Paisajístico Sustentable & Riego Automatizado por Goteo',
        description: 'Remodelación de jardín de 350 m² con gravilla decorativa, especies xerófilas y programador Hunter con sensor de lluvia en Chicureo.',
        imageAfter: 'https://images.unsplash.com/photo-1558904541-efa8c4a08931?auto=format&fit=crop&q=80&w=800',
        completionDate: 'Enero 2026'
      }
    ]
  },
  'Cerrajería': {
    label: 'Cerrajería de Precisión & Seguridad Residencial',
    icon: '🛡️',
    typicalServices: [
      'Instalación de cerraduras digitales biométricas (huella, clave y app)',
      'Cambio y unificación de cilindros de alta seguridad antibumping y antitaladro',
      'Apertura de urgencia de puertas blindadas sin dañar el marco',
      'Instalación de barras antipánico y cierrapuertas hidráulicos para edificios',
      'Refuerzo de marcos y cerrojos multipunto de seguridad'
    ],
    initialProjects: [
      {
        id: 'cerr-1',
        title: 'Instalación de Cerradura Smart Biometría & Cilindro Yale Antibumping',
        description: 'Blindaje de acceso principal en departamento de Providencia con sensor de apertura y apertura remota.',
        imageAfter: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=800',
        completionDate: 'Febrero 2026'
      }
    ]
  }
};

export const CollaboratorWorkspacePage: React.FC<CollaboratorWorkspacePageProps> = ({
  currentUser,
  onLogout,
  onBackToHome,
  applications = [],
  onApproveApplication,
  onRejectApplication
}) => {
  const isAdmin = currentUser.role === 'admin';
  const userCategory = currentUser.category || 'Remodelación & Pintura';
  const categoryConfig = CATEGORY_DEFAULTS[userCategory] || CATEGORY_DEFAULTS['Remodelación & Pintura'];

  // Active Workspace Navigation Tab
  const [activeTab, setActiveTab] = useState<'projects' | 'profile' | 'rates' | 'documents' | 'reviews' | 'admin-audit' | 'admin-providers'>(
    isAdmin ? 'admin-audit' : 'projects'
  );

  // Projects State
  const [projects, setProjects] = useState<ProviderProject[]>(categoryConfig.initialProjects);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [projectImageMode, setProjectImageMode] = useState<{ [id: string]: 'after' | 'before' }>({});

  // Form New Project
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newLocation, setNewLocation] = useState('Las Condes / RM');
  const [newImgAfter, setNewImgAfter] = useState('https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&q=80&w=800');
  const [newImgBefore, setNewImgBefore] = useState('');
  const [newDate, setNewDate] = useState('Marzo 2026');

  // Contact & Profile Editable State
  const [companyName, setCompanyName] = useState(currentUser.name || 'Mi Empresa de Servicios');
  const [contactPhone, setContactPhone] = useState('+56 9 7345 6789');
  const [contactEmail, setContactEmail] = useState(currentUser.email);
  const [coverageZones, setCoverageZones] = useState<string[]>([
    'Las Condes', 'Vitacura', 'Lo Barnechea', 'Providencia', 'Concón', 'Viña del Mar', 'Puerto Varas'
  ]);
  const [savedProfileAlert, setSavedProfileAlert] = useState(false);

  // Rates State
  const [visitFee, setVisitFee] = useState('20.000');
  const [warrantyPeriod, setWarrantyPeriod] = useState('1 Año por Contrato Escrito');

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const created: ProviderProject = {
      id: 'proj-' + Date.now(),
      title: newTitle,
      description: newDesc,
      imageBefore: newImgBefore.trim() || undefined,
      imageAfter: newImgAfter,
      completionDate: newDate
    };

    setProjects(prev => [created, ...prev]);

    // Save to Supabase if connected
    if (isSupabaseConfigured()) {
      supabase.from('provider_projects').insert([{
        provider_id: currentUser.id,
        provider_name: companyName,
        title: newTitle,
        category: userCategory,
        commune_region: newLocation,
        description: newDesc,
        image_before: newImgBefore.trim() || null,
        image_after: newImgAfter,
        completion_date: newDate
      }]).then(({ error }) => {
        if (error) console.warn('Supabase sync notice:', error.message);
      });
    }

    setNewTitle('');
    setNewDesc('');
    setNewImgBefore('');
    setIsAddingProject(false);
  };

  const handleDeleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedProfileAlert(true);
    setTimeout(() => setSavedProfileAlert(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#0F1115] font-sans flex flex-col">
      
      {/* 1. TOP CORPORATE BAR */}
      <header className="sticky top-0 z-40 bg-[#0F1115] text-white border-b border-[#D02126]/30 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo & Workspace Breadcrumb */}
          <div className="flex items-center gap-4">
            <button
              onClick={onBackToHome}
              className="flex items-center gap-2 text-xs font-semibold text-gray-300 hover:text-white transition-colors cursor-pointer py-1.5 px-3 rounded-xl hover:bg-white/10"
              title="Regresar a la página principal de Melsa"
            >
              <ArrowLeft className="w-4 h-4 text-[#D02126]" />
              <span className="hidden sm:inline">Ver Sitio Web Público</span>
            </button>

            <div className="h-6 w-px bg-white/20 hidden sm:block" />

            <div className="flex items-center gap-3">
              <MelsaLogo isLight={true} className="h-8" />
              <div className="hidden md:flex flex-col">
                <span className="text-[11px] font-bold text-gray-200 uppercase tracking-wider flex items-center gap-1.5">
                  <span>{isAdmin ? '🛡️ Auditoría Interna & Control Total' : `${categoryConfig.icon} Panel Profesional Melsa`}</span>
                </span>
                <span className="text-[10px] text-gray-400 font-light">
                  {isAdmin ? 'Administración Central Inmobiliaria' : categoryConfig.label}
                </span>
              </div>
            </div>
          </div>

          {/* User Session Status & Logout */}
          <div className="flex items-center gap-3">
            {!isAdmin && (
              <span className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Sello Melsa Verificado</span>
              </span>
            )}

            <div className="flex items-center gap-2 pl-2 sm:border-l sm:border-white/10">
              <div className="w-9 h-9 rounded-xl bg-[#D02126] text-white font-bold flex items-center justify-center text-sm shadow-sm">
                {currentUser.name.charAt(0)}
              </div>
              <div className="hidden sm:block text-left">
                <span className="text-xs font-bold text-white block leading-tight">{currentUser.name}</span>
                <span className="text-[10px] text-gray-400 block font-light">{currentUser.email}</span>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-red-500/20 hover:text-red-400 border border-white/15 text-xs font-semibold text-gray-200 transition-all cursor-pointer ml-1"
              title="Cerrar sesión actual"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </button>
          </div>

        </div>
      </header>

      {/* 2. WORKSPACE HERO BANNER */}
      <section className="bg-gradient-to-r from-[#0F1115] via-[#1A1D24] to-[#0F1115] text-white py-8 px-4 sm:px-6 lg:px-8 border-b border-gray-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D02126]/20 text-[#D02126] text-xs font-bold uppercase tracking-wider mb-2 border border-[#D02126]/30">
              <span>{isAdmin ? 'Centro de Mando Inmobiliario' : 'Espacio de Trabajo para Especialistas del Hogar'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
              {isAdmin ? 'Auditoría y Admisión Nacional Melsa' : companyName}
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-2xl font-light">
              {isAdmin
                ? 'Panel de control centralizado para la validación tributaria (SII), antecedentes penales y acreditaciones técnicas de empresas postulantes en las 16 regiones de Chile.'
                : `Gestiona tu vitrina oficial en Melsa. Modifica tus fotos de obras reales en ${userCategory}, define tus tarifas y mantén tu Sello de Confianza vigente.`}
            </p>
          </div>

          {/* Key Metrics Header Card */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
            {!isAdmin ? (
              <>
                <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl text-center backdrop-blur-xs">
                  <div className="flex items-center justify-center gap-1 text-amber-400 mb-0.5">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span className="text-lg font-bold text-white">4.92</span>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider text-gray-400 block font-medium">Calificación Melsa</span>
                </div>

                <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl text-center backdrop-blur-xs">
                  <span className="text-lg font-bold text-[#D02126] block mb-0.5">24</span>
                  <span className="text-[10px] uppercase tracking-wider text-gray-400 block font-medium">Clientes este mes</span>
                </div>

                <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl text-center backdrop-blur-xs col-span-2 sm:col-span-1">
                  <span className="text-lg font-bold text-emerald-400 block mb-0.5">Al Día</span>
                  <span className="text-[10px] uppercase tracking-wider text-gray-400 block font-medium">Carpeta SII & SEC</span>
                </div>
              </>
            ) : (
              <>
                <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl text-center backdrop-blur-xs">
                  <span className="text-lg font-bold text-amber-400 block mb-0.5">{applications.filter(a => a.status === 'Pendiente').length}</span>
                  <span className="text-[10px] uppercase tracking-wider text-gray-400 block font-medium">Postulaciones Pendientes</span>
                </div>

                <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl text-center backdrop-blur-xs">
                  <span className="text-lg font-bold text-emerald-400 block mb-0.5">{HOME_SERVICE_PROVIDERS.length}</span>
                  <span className="text-[10px] uppercase tracking-wider text-gray-400 block font-medium">Técnicos Publicados</span>
                </div>

                <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl text-center backdrop-blur-xs">
                  <span className="text-lg font-bold text-white block mb-0.5">16</span>
                  <span className="text-[10px] uppercase tracking-wider text-gray-400 block font-medium">Regiones Cobertura</span>
                </div>
              </>
            )}
          </div>

        </div>
      </section>

      {/* 3. WORKSPACE NAVIGATION TABS */}
      <div className="bg-white border-b border-gray-200 sticky top-20 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 overflow-x-auto py-2.5">
          {!isAdmin ? (
            <>
              <button
                onClick={() => setActiveTab('projects')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'projects'
                    ? 'bg-[#0F1115] text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-black'
                }`}
              >
                <span>📸 Obras & Trabajos ({projects.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('profile')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'profile'
                    ? 'bg-[#0F1115] text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-black'
                }`}
              >
                <span>📋 Mi Ficha & Cobertura</span>
              </button>

              <button
                onClick={() => setActiveTab('rates')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'rates'
                    ? 'bg-[#0F1115] text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-black'
                }`}
              >
                <span>💰 Tarifario & Servicios Típicos</span>
              </button>

              <button
                onClick={() => setActiveTab('documents')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'documents'
                    ? 'bg-[#0F1115] text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-black'
                }`}
              >
                <span>🛡️ Sello Melsa & Auditoría SII</span>
              </button>

              <button
                onClick={() => setActiveTab('reviews')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'reviews'
                    ? 'bg-[#0F1115] text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-black'
                }`}
              >
                <span>⭐ Opiniones de Clientes</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setActiveTab('admin-audit')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'admin-audit'
                    ? 'bg-[#0F1115] text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-black'
                }`}
              >
                <span>📑 Postulaciones Pendientes ({applications.filter(a => a.status === 'Pendiente').length})</span>
              </button>

              <button
                onClick={() => setActiveTab('admin-providers')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'admin-providers'
                    ? 'bg-[#0F1115] text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-black'
                }`}
              >
                <span>👷 Red de Prestadores Publicados ({HOME_SERVICE_PROVIDERS.length})</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* 4. WORKSPACE BODY CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">

        {/* ------------------------------------------------------------- */}
        {/* COLLABORATOR TAB 1: OBRAS & PROYECTOS DEL RUBRO               */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'projects' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-200 shadow-xs">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{categoryConfig.icon}</span>
                  <h2 className="text-lg font-serif font-bold text-[#0F1115]">
                    Galería de Trabajos Ejecutados ({userCategory})
                  </h2>
                </div>
                <p className="text-xs text-gray-500 font-light max-w-xl">
                  Estas fotografías se presentan en tu ficha pública cuando los propietarios buscan especialistas en tu rubro. Los proyectos con fotos de <strong>Antes y Después</strong> obtienen un 68% más de contactos.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsAddingProject(!isAddingProject)}
                className="px-5 py-3 rounded-2xl bg-[#D02126] hover:bg-[#B81B1F] text-white text-xs font-bold flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>+ Registrar Nueva Obra Realizada</span>
              </button>
            </div>

            {/* Form to Add Work */}
            {isAddingProject && (
              <form onSubmit={handleCreateProject} className="bg-white p-6 rounded-3xl border-2 border-[#D02126]/30 shadow-lg space-y-5 animate-in slide-in-from-top-3 duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <span className="text-xs font-bold text-[#D02126] uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    Nueva Evidencia de Calidad para tu Ficha
                  </span>
                  <button type="button" onClick={() => setIsAddingProject(false)} className="text-gray-400 hover:text-black">
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                      Título Descriptivo del Trabajo *
                    </label>
                    <input
                      type="text"
                      required
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder={`Ej. ${categoryConfig.initialProjects[0]?.title || 'Instalación de caldera en Lo Barnechea'}`}
                      className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-[#0F1115] focus:ring-2 focus:ring-[#D02126] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                      Comuna / Región *
                    </label>
                    <input
                      type="text"
                      required
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      placeholder="Ej. Las Condes / Santiago"
                      className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-[#0F1115] focus:ring-2 focus:ring-[#D02126] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                    Memoria Técnica & Materiales Empleados
                  </label>
                  <textarea
                    rows={2}
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="Describe las marcas de materiales (ej. Anwo, Silestone, Schneider), dimensiones y estándares de seguridad aplicados..."
                    className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl p-3 text-xs text-[#0F1115] focus:ring-2 focus:ring-[#D02126] outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                      Foto Trabajo Terminado (Después) *
                    </label>
                    <input
                      type="url"
                      required
                      value={newImgAfter}
                      onChange={(e) => setNewImgAfter(e.target.value)}
                      placeholder="https://..."
                      className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-[#0F1115] focus:ring-2 focus:ring-[#D02126] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                      Foto Estado Previo / Obra Gruesa (Antes) - Opcional
                    </label>
                    <input
                      type="url"
                      value={newImgBefore}
                      onChange={(e) => setNewImgBefore(e.target.value)}
                      placeholder="https://..."
                      className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-[#0F1115] focus:ring-2 focus:ring-[#D02126] outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingProject(false)}
                    className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 text-xs font-semibold hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#D02126] hover:bg-[#B81B1F] text-white text-xs font-bold shadow-md transition-all cursor-pointer"
                  >
                    Guardar & Publicar en Ficha
                  </button>
                </div>
              </form>
            )}

            {/* Grid of Projects */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((proj) => {
                const currentMode = projectImageMode[proj.id] || 'after';
                const activeImg = (currentMode === 'before' && proj.imageBefore) ? proj.imageBefore : proj.imageAfter;

                return (
                  <div key={proj.id} className="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
                    <div>
                      {/* Image Viewer */}
                      <div className="aspect-[16/11] bg-gray-100 overflow-hidden relative">
                        <img
                          src={activeImg}
                          alt={proj.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />

                        <span className="absolute top-3 left-3 bg-black/70 text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full backdrop-blur-xs">
                          {proj.completionDate}
                        </span>

                        {/* Interactive Before & After Switch */}
                        {proj.imageBefore && (
                          <div className="absolute top-3 right-3 flex items-center bg-black/75 p-0.5 rounded-xl backdrop-blur-xs shadow-md">
                            <button
                              type="button"
                              onClick={() => setProjectImageMode(prev => ({ ...prev, [proj.id]: 'before' }))}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                                currentMode === 'before' ? 'bg-[#D02126] text-white' : 'text-gray-300 hover:text-white'
                              }`}
                            >
                              Antes
                            </button>
                            <button
                              type="button"
                              onClick={() => setProjectImageMode(prev => ({ ...prev, [proj.id]: 'after' }))}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                                currentMode === 'after' ? 'bg-emerald-600 text-white' : 'text-gray-300 hover:text-white'
                              }`}
                            >
                              Después
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-5 space-y-2">
                        <div className="flex items-center gap-1 text-[11px] text-[#D02126] font-semibold">
                          <span>{categoryConfig.label}</span>
                        </div>
                        <h3 className="text-sm font-bold text-[#0F1115] leading-snug">
                          {proj.title}
                        </h3>
                        <p className="text-xs text-gray-500 font-light line-clamp-3 leading-relaxed">
                          {proj.description}
                        </p>
                      </div>
                    </div>

                    <div className="p-5 pt-0 border-t border-gray-100 flex items-center justify-between mt-3">
                      <span className="text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200 font-bold px-2.5 py-1 rounded-lg">
                        Activo en Vitrina Pública
                      </span>

                      <button
                        type="button"
                        onClick={() => handleDeleteProject(proj.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                        title="Eliminar este proyecto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* COLLABORATOR TAB 2: MI FICHA & COBERTURA                      */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6 animate-in fade-in duration-150">
            <div className="border-b border-gray-100 pb-4">
              <h2 className="text-lg font-serif font-bold text-[#0F1115]">
                Ficha Oficial de Atención & Zonas de Cobertura
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Los clientes que busquen técnicos en estas comunas recibirán tus datos de contacto directo.
              </p>
            </div>

            {savedProfileAlert && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-xs text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Tus datos de contacto y comunas fueron actualizados exitosamente en la red de Melsa.</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1 uppercase tracking-wider text-[11px]">Razón Social o Nombre Comercial</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-4 py-3 text-xs text-[#0F1115] focus:ring-2 focus:ring-[#D02126] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1 uppercase tracking-wider text-[11px]">RUT Verificado en SII</label>
                <input
                  type="text"
                  readOnly
                  value="76.994.210-3 (Auditado)"
                  className="w-full bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1 uppercase tracking-wider text-[11px]">Teléfono de Urgencias & WhatsApp</label>
                <input
                  type="text"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-4 py-3 text-xs text-[#0F1115] focus:ring-2 focus:ring-[#D02126] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1 uppercase tracking-wider text-[11px]">Correo Electrónico de Contacto</label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-4 py-3 text-xs text-[#0F1115] focus:ring-2 focus:ring-[#D02126] outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-bold text-gray-700 mb-2 uppercase tracking-wider text-[11px]">
                  Comunas & Zonas de Cobertura Nacional Activas:
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Las Condes', 'Vitacura', 'Lo Barnechea', 'Providencia', 'Ñuñoa', 'La Reina',
                    'Chicureo / Colina', 'Viña del Mar', 'Concón', 'Zapallar', 'Maitencillo',
                    'Concepción', 'San Pedro de la Paz', 'Antofagasta', 'La Serena', 'Temuco', 'Puerto Varas'
                  ].map((comuna) => {
                    const isSelected = coverageZones.includes(comuna);
                    return (
                      <button
                        key={comuna}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            setCoverageZones(coverageZones.filter(c => c !== comuna));
                          } else {
                            setCoverageZones([...coverageZones, comuna]);
                          }
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-[#0F1115] text-white border-[#0F1115]'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                        <span>{comuna}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100">
              <button
                type="submit"
                className="px-6 py-3 rounded-2xl bg-[#D02126] hover:bg-[#B81B1F] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                Guardar Cambios de Ficha
              </button>
            </div>
          </form>
        )}

        {/* ------------------------------------------------------------- */}
        {/* COLLABORATOR TAB 3: TARIFARIO & SERVICIOS TÍPICOS             */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'rates' && (
          <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6 animate-in fade-in duration-150">
            <div className="border-b border-gray-100 pb-4">
              <h2 className="text-lg font-serif font-bold text-[#0F1115]">
                Tarifario Referencial & Política de Garantía ({userCategory})
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                La transparencia en precios de visita y garantías escritas es el pilar de confianza del Sello Melsa.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="p-5 rounded-2xl bg-[#FAF9F8] border border-gray-200 space-y-3">
                <span className="font-bold text-gray-900 uppercase tracking-wider text-[11px] block">
                  Costo de Visita Técnica en Domicilio
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-serif font-bold text-[#D02126]">$</span>
                  <input
                    type="text"
                    value={visitFee}
                    onChange={(e) => setVisitFee(e.target.value)}
                    className="w-36 bg-white border border-gray-300 rounded-xl px-3 py-2 text-base font-bold text-gray-900 text-center focus:ring-2 focus:ring-[#D02126] outline-none"
                  />
                  <span className="text-gray-500 text-xs">CLP (Se descuenta si el cliente aprueba el trabajo)</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#FAF9F8] border border-gray-200 space-y-3">
                <span className="font-bold text-gray-900 uppercase tracking-wider text-[11px] block">
                  Política de Garantía Melsa
                </span>
                <input
                  type="text"
                  value={warrantyPeriod}
                  onChange={(e) => setWarrantyPeriod(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2.5 text-xs text-gray-900 focus:ring-2 focus:ring-[#D02126] outline-none font-semibold"
                />
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
                Servicios Habituales en tu Catálogo Profesional:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {categoryConfig.typicalServices.map((srv, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-[#FAF9F8] border border-gray-200 flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-medium text-gray-800">{srv}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* COLLABORATOR TAB 4: SELLO MELSA & DOCUMENTOS SII              */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'documents' && (
          <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6 animate-in fade-in duration-150">
            <div className="border-b border-gray-100 pb-4">
              <h2 className="text-lg font-serif font-bold text-[#0F1115]">
                Expediente Legal & Sello de Confianza Melsa
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Documentación pública auditada por el equipo legal y tributario de Melsa Inmobiliaria.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-gray-900 block">Carpeta Tributaria Electrónica (SII)</span>
                  <span className="text-[11px] text-gray-500">F29 y pagos de IVA últimos 12 meses declarados</span>
                </div>
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Auditado ✅
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-gray-900 block">Certificado de Antecedentes Especiales</span>
                  <span className="text-[11px] text-gray-500">Registro Civil e Identificación • Sin anotaciones</span>
                </div>
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Limpio ✅
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-gray-900 block">Certificación de Especialidad Técnica</span>
                  <span className="text-[11px] text-gray-500">Licencia SEC / Título Técnico en Electricidad o Sanitaria</span>
                </div>
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Vigente ✅
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-gray-900 block">Constitución de Sociedad & Vigencia de Poderes</span>
                  <span className="text-[11px] text-gray-500">Registro de Empresas y Sociedades</span>
                </div>
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Al Día ✅
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-xs text-gray-600 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-[#D02126] shrink-0" />
              <span>
                Tu cuenta cuenta con el <strong>Sello Melsa Verificado 2026</strong>. Para renovar o adjuntar un nuevo documento, envía el archivo a <strong className="text-black">auditoria@melsainmobiliaria.com</strong>.
              </span>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* COLLABORATOR TAB 5: OPINIONES DE CLIENTES                     */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'reviews' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs flex items-center justify-between">
              <div>
                <h2 className="text-lg font-serif font-bold text-[#0F1115]">
                  Reseñas Verificadas de Clientes
                </h2>
                <p className="text-xs text-gray-500 font-light">
                  Comentarios directos emitidos por propietarios tras recibir tu servicio a través de Melsa.
                </p>
              </div>
              <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-2xl border border-amber-200 text-amber-700 font-bold text-sm">
                <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                <span>4.92 / 5.0 (24 Evaluaciones)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  author: 'Claudio Mackenna V.',
                  location: 'Las Condes (San Damián)',
                  rating: 5,
                  date: 'Hace 5 días',
                  text: 'Excelente servicio. Muy profesionales, llegaron a la hora exacta, resolvieron el problema de raíz y entregaron boleta electrónica sin inconvenientes.'
                },
                {
                  author: 'Patricia Zañartu R.',
                  location: 'Vitacura',
                  rating: 5,
                  date: 'Hace 2 semanas',
                  text: 'El personal con antecedentes limpios y sello Melsa me dio mucha tranquilidad para recibirlos en mi casa. Terminaciones impecables.'
                },
                {
                  author: 'Felipe Valdivieso G.',
                  location: 'Zapallar',
                  rating: 4.8,
                  date: 'Hace 1 mes',
                  text: 'Muy buen trabajo en la mantención completa. Todo quedó funcionando de forma óptima.'
                }
              ].map((rev, i) => (
                <div key={i} className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-gray-900 block text-sm">{rev.author}</span>
                      <span className="text-[11px] text-gray-400">{rev.location} • {rev.date}</span>
                    </div>
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star key={idx} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed italic bg-[#FAF9F8] p-3.5 rounded-2xl border border-gray-100">
                    &quot;{rev.text}&quot;
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* ADMIN TAB 1: AUDITORÍA DE POSTULACIONES PENDIENTES           */}
        {/* ------------------------------------------------------------- */}
        {isAdmin && activeTab === 'admin-audit' && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs flex items-center justify-between">
              <div>
                <h2 className="text-lg font-serif font-bold text-[#0F1115]">
                  Cola de Postulaciones Pendientes de Revisión ({applications.filter(a => a.status === 'Pendiente').length})
                </h2>
                <p className="text-xs text-gray-500 font-light">
                  Revisa los certificados tributarios, antecedentes penales y autorizaciones técnicas antes de otorgar el Sello Melsa.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {applications.length > 0 ? (
                applications.map((app) => (
                  <div key={app.id} className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4 text-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono font-bold text-xs text-gray-400">{app.id}</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            app.status === 'Pendiente' ? 'bg-amber-100 text-amber-800' :
                            app.status === 'Aprobado' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {app.status}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] bg-gray-100 text-gray-700 font-semibold">
                            {app.applicantType}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-[#0F1115]">
                          {app.fullNameOrCompanyName} <span className="text-xs font-normal text-gray-500 font-mono">({app.rut})</span>
                        </h3>
                        <span className="text-gray-500 text-[11px]">
                          Especialidad: <strong>{app.category}</strong> • Tel: {app.contactPhone} • Email: {app.contactEmail}
                        </span>
                      </div>

                      {app.status === 'Pendiente' && (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onApproveApplication?.(app.id)}
                            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Aprobar Sello Melsa</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => onRejectApplication?.(app.id)}
                            className="px-3.5 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 font-semibold text-xs transition-all cursor-pointer"
                          >
                            Rechazar
                          </button>
                        </div>
                      )}
                    </div>

                    <div>
                      <span className="font-bold text-gray-700 text-[11px] uppercase tracking-wider block mb-2">
                        Documentos Cargados para Verificación:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {app.documents.map((doc, idx) => (
                          <div key={idx} className="bg-[#FAF9F8] p-3 rounded-xl border border-gray-200 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                              <span className="font-medium text-gray-800 text-[11px]">{doc.name}</span>
                            </div>
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                              {doc.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                ))
              ) : (
                <p className="text-center py-12 text-gray-500 text-xs">No hay postulaciones registradas.</p>
              )}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* ADMIN TAB 2: PRESTADORES PUBLICADOS EN CHILE                  */}
        {/* ------------------------------------------------------------- */}
        {isAdmin && activeTab === 'admin-providers' && (
          <div className="space-y-4 animate-in fade-in duration-150 text-xs">
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs flex items-center justify-between">
              <div>
                <h2 className="text-lg font-serif font-bold text-[#0F1115]">
                  Red Nacional de Técnicos & Empresas con Sello Melsa Activo ({HOME_SERVICE_PROVIDERS.length})
                </h2>
                <p className="text-xs text-gray-500 font-light">
                  Todos los prestadores que superaron el filtro y cuentan con vitrina pública activa en el portal.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {HOME_SERVICE_PROVIDERS.map((prov) => (
                <div key={prov.id} className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <img src={prov.avatarUrl} alt={prov.name} className="w-12 h-12 rounded-2xl object-cover shrink-0" />
                    <div>
                      <h4 className="font-bold text-[#0F1115] text-sm">{prov.name}</h4>
                      <span className="text-[11px] text-gray-500 block">{prov.companyOrTradeName}</span>
                      <span className="text-[11px] font-semibold text-[#D02126] block mt-0.5">{prov.category}</span>
                      <span className="text-[10px] text-gray-400 block mt-1">Zonas: {prov.coverageZones.join(', ')}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 block mb-2">
                      Sello Melsa Activo
                    </span>
                    <span className="text-xs font-bold text-amber-500">⭐ {prov.rating} ({prov.reviewCount})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

    </div>
  );
};

