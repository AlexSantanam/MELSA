import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  ShieldCheck, 
  Building2, 
  User, 
  FileCheck2, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Plus, 
  Image as ImageIcon, 
  LogOut, 
  Calendar, 
  Sparkles, 
  Eye, 
  MapPin, 
  Clock, 
  Layers, 
  FileText, 
  ArrowRight,
  Star,
  Phone,
  Trash2,
  Edit3,
  MessageSquare,
  Wrench,
  Check
} from 'lucide-react';
import { AuthUser, ProviderApplication, HomeServiceProvider, ProviderProject } from '../types';
import { MOCK_APPLICATIONS, HOME_SERVICE_PROVIDERS, MOCK_AUTH_USERS } from '../data/mockData';
import { loginUser, logoutUser, registerNewUser } from '../services/authService';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface IntranetPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  applications: ProviderApplication[];
  onApproveApplication: (id: string) => void;
  onRejectApplication: (id: string) => void;
  currentUser: AuthUser | null;
  onUserChange: (user: AuthUser | null) => void;
  onOpenApplicationModal?: () => void;
  onOpenWorkspace?: () => void;
}

export const IntranetPortalModal: React.FC<IntranetPortalModalProps> = ({
  isOpen,
  onClose,
  applications,
  onApproveApplication,
  onRejectApplication,
  currentUser,
  onUserChange,
  onOpenApplicationModal,
  onOpenWorkspace
}) => {
  // Auth Mode: 'login' | 'register'
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Registration Form State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regAccountType, setRegAccountType] = useState<'provider' | 'broker'>('provider');
  const [regCategory, setRegCategory] = useState('Remodelación & Pintura');
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerSuccessMsg, setRegisterSuccessMsg] = useState<string | null>(null);
  
  // Admin view tab
  const [adminTab, setAdminTab] = useState<'applications' | 'providers'>('applications');
  
  // Provider view sub-tabs: 'projects' | 'profile' | 'documents' | 'reviews'
  const [providerTab, setProviderTab] = useState<'projects' | 'profile' | 'documents' | 'reviews'>('projects');
  
  // Provider project upload form state
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [newProjectLocation, setNewProjectLocation] = useState('Las Condes');
  const [newProjectBeforeImg, setNewProjectBeforeImg] = useState('');
  const [newProjectImg, setNewProjectImg] = useState('https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&q=80&w=800');
  const [newProjectDate, setNewProjectDate] = useState('Marzo 2026');

  // Toggle for Before vs After in each project card
  const [projectImageMode, setProjectImageMode] = useState<{ [id: string]: 'after' | 'before' }>({});

  // Local state for provider's projects with realistic renovation photos
  const [providerProjects, setProviderProjects] = useState<ProviderProject[]>([
    {
      id: 'proj-1',
      title: 'Remodelación Integral Cocina Isla & Cubierta Silestone Calacatta',
      description: 'Demolición de muro tabique, montaje de isla central, muebles termoformados sin tiradores y campana de extracción empotrada en Las Condes.',
      imageBefore: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=800',
      imageAfter: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&q=80&w=800',
      completionDate: 'Febrero 2026'
    },
    {
      id: 'proj-2',
      title: 'Modernización Baño Principal Suite, Ducha Walk-in & Porcelanato Rectificado',
      description: 'Retiro de tina convencional, instalación de plato de ducha a nivel de piso con canaleta oculta, mampara de cristal 8mm y grifería termostática empotrada.',
      imageBefore: 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&q=80&w=800',
      imageAfter: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&q=80&w=800',
      completionDate: 'Enero 2026'
    },
    {
      id: 'proj-3',
      title: 'Pintura Termoplástica de Fachada & Sellado Hidrófugo en Zapallar',
      description: 'Tratamiento antihumedad para brisa marina, micropulido de muros y 3 capas de sellado elástico para máxima resistencia climática.',
      imageAfter: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=800',
      completionDate: 'Noviembre 2025'
    }
  ]);

  if (!isOpen) return null;

  const handleLoginDemo = (role: 'admin' | 'provider') => {
    setLoginError(null);
    if (role === 'admin') {
      onUserChange(MOCK_AUTH_USERS[0]);
    } else {
      onUserChange(MOCK_AUTH_USERS[1]);
    }
  };

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError(null);

    try {
      const res = await loginUser(emailInput, passwordInput);
      if (res.user) {
        onUserChange(res.user);
        onClose();
        onOpenWorkspace?.();
      } else if (res.error) {
        setLoginError(res.error);
      }
    } catch (err: any) {
      setLoginError(err.message || 'Error al autenticar');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setRegisterSuccessMsg(null);

    if (regPassword !== regConfirmPassword) {
      setLoginError('Las contraseñas ingresadas no coinciden.');
      return;
    }

    if (regPassword.length < 6) {
      setLoginError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setIsRegistering(true);

    try {
      const res = await registerNewUser(
        regEmail,
        regPassword,
        regName,
        regAccountType,
        regCategory
      );

      if (res.success && res.user) {
        setRegisterSuccessMsg('¡Cuenta registrada exitosamente en Supabase! Ingresando a tu espacio de trabajo...');
        setTimeout(() => {
          onUserChange(res.user!);
          onClose();
          onOpenWorkspace?.();
        }, 800);
      } else {
        setLoginError(res.error || 'No se pudo crear la cuenta.');
      }
    } catch (err: any) {
      setLoginError(err.message || 'Error de conexión al registrar.');
    } finally {
      setIsRegistering(false);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    onUserChange(null);
    setAuthMode('login');
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectTitle.trim()) return;

    const newProj: ProviderProject = {
      id: 'proj-' + Date.now(),
      title: newProjectTitle,
      description: newProjectDesc,
      imageBefore: newProjectBeforeImg.trim() ? newProjectBeforeImg : undefined,
      imageAfter: newProjectImg,
      completionDate: newProjectDate
    };

    setProviderProjects((prev) => [newProj, ...prev]);

    if (isSupabaseConfigured() && currentUser) {
      supabase.from('provider_projects').insert([{
        provider_id: currentUser.providerId || currentUser.id,
        provider_name: currentUser.name,
        title: newProjectTitle,
        category: 'Remodelación y Obras',
        commune_region: newProjectLocation,
        description: newProjectDesc,
        image_before: newProjectBeforeImg.trim() || null,
        image_after: newProjectImg,
        completion_date: newProjectDate
      }]).then(({ error }) => {
        if (error) console.warn('Supabase project sync notice:', error.message);
      });
    }

    setNewProjectTitle('');
    setNewProjectDesc('');
    setNewProjectBeforeImg('');
    setIsAddingProject(false);
  };

  const handleDeleteProject = (id: string) => {
    setProviderProjects(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-gray-200 relative max-h-[92vh] overflow-y-auto text-[#0F1115]">
        
        {/* Top Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-800 p-1 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ------------------------------------------------------------- */}
        {/* 1. AUTH SCREEN: INICIAR SESIÓN O CREAR CUENTA                 */}
        {/* ------------------------------------------------------------- */}
        {!currentUser ? (
          <div className="max-w-md mx-auto py-4 space-y-5 animate-in fade-in duration-150">
            
            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#D02126]/10 text-[#D02126] mx-auto flex items-center justify-center mb-2">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-[#0F1115]">
                {authMode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta en Melsa'}
              </h3>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                {authMode === 'login'
                  ? 'Acceso a la plataforma de administración o a tu panel privado de colaborador.'
                  : 'Crea tu cuenta oficial para publicar tus servicios o gestionar tus propiedades.'}
              </p>
            </div>

            {/* Switch Tabs: Iniciar Sesión vs Crear Cuenta */}
            <div className="flex p-1 bg-gray-100 rounded-2xl">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setLoginError(null);
                  setRegisterSuccessMsg(null);
                }}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  authMode === 'login'
                    ? 'bg-white text-[#0F1115] shadow-xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Iniciar Sesión
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('register');
                  setLoginError(null);
                  setRegisterSuccessMsg(null);
                }}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  authMode === 'register'
                    ? 'bg-[#D02126] text-white shadow-xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                + Crear Cuenta Nueva
              </button>
            </div>

            {/* Error & Success Messages */}
            {loginError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700 animate-in fade-in duration-150">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            {registerSuccessMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-800 animate-in fade-in duration-150">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{registerSuccessMsg}</span>
              </div>
            )}

            {/* MODE A: LOGIN FORM */}
            {authMode === 'login' ? (
              <form onSubmit={handleManualLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wider">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="ej. admin@melsa.cl o tu-correo@empresa.cl"
                    className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3.5 py-3 text-xs text-[#0F1115] focus:ring-2 focus:ring-[#D02126] focus:border-[#D02126] outline-none transition-all"
                  />
                  <span className="text-[10px] text-gray-400 mt-1 block">
                    * El correo de administración otorga acceso y control total de auditoría.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wider">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3.5 py-3 text-xs text-[#0F1115] focus:ring-2 focus:ring-[#D02126] focus:border-[#D02126] outline-none transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full py-3.5 rounded-xl bg-[#D02126] hover:bg-[#B81B1F] text-white font-semibold text-xs tracking-wider uppercase transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isLoggingIn ? (
                    <>
                      <Clock className="w-4 h-4 animate-spin" />
                      <span>Verificando...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>INICIAR SESIÓN</span>
                    </>
                  )}
                </button>

                {/* Switch to Register */}
                <div className="text-center pt-2">
                  <span className="text-xs text-gray-500">¿No tienes una cuenta aún? </span>
                  <button
                    type="button"
                    onClick={() => setAuthMode('register')}
                    className="text-xs text-[#D02126] font-bold hover:underline cursor-pointer ml-1"
                  >
                    Crear Cuenta de Colaborador
                  </button>
                </div>

              </form>
            ) : (
              /* MODE B: REGISTER / ACCOUNT CREATION FORM */
              <form onSubmit={handleRegister} className="space-y-4 animate-in fade-in duration-150">
                
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wider">
                    Nombre Completo o Razón Social *
                  </label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Ej. Gasfitería Los Dominicos SpA o Juan Morales"
                    className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-[#0F1115] focus:ring-2 focus:ring-[#D02126] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wider">
                    Correo Electrónico (Login) *
                  </label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="contacto@tuempresa.cl"
                    className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-[#0F1115] focus:ring-2 focus:ring-[#D02126] outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wider">
                      Tipo de Perfil
                    </label>
                    <select
                      value={regAccountType}
                      onChange={(e) => setRegAccountType(e.target.value as any)}
                      className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-[#0F1115] focus:ring-2 focus:ring-[#D02126] outline-none"
                    >
                      <option value="provider">Técnico / Empresa Hogar</option>
                      <option value="broker">Corredor Inmobiliario</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wider">
                      Especialidad
                    </label>
                    <select
                      value={regCategory}
                      onChange={(e) => setRegCategory(e.target.value)}
                      className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-[#0F1115] focus:ring-2 focus:ring-[#D02126] outline-none"
                    >
                      <option value="Gasfitería">Gasfitería</option>
                      <option value="Electricidad">Electricidad SEC</option>
                      <option value="Remodelación & Pintura">Remodelación & Pintura</option>
                      <option value="Climatización">Climatización</option>
                      <option value="Jardinería">Jardinería & Riego</option>
                      <option value="Cerrajería">Cerrajería</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wider">
                      Contraseña (mín 6) *
                    </label>
                    <input
                      type="password"
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-[#0F1115] focus:ring-2 focus:ring-[#D02126] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wider">
                      Confirmar Clave *
                    </label>
                    <input
                      type="password"
                      required
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-[#0F1115] focus:ring-2 focus:ring-[#D02126] outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isRegistering}
                  className="w-full py-3.5 rounded-xl bg-[#D02126] hover:bg-[#B81B1F] text-white font-semibold text-xs tracking-wider uppercase transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isRegistering ? (
                    <>
                      <Clock className="w-4 h-4 animate-spin" />
                      <span>Registrando en Supabase...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>CREAR MI CUENTA OFICIAL</span>
                    </>
                  )}
                </button>

                <div className="text-center pt-2">
                  <span className="text-xs text-gray-500">¿Ya tienes cuenta creada? </span>
                  <button
                    type="button"
                    onClick={() => setAuthMode('login')}
                    className="text-xs text-[#D02126] font-bold hover:underline cursor-pointer ml-1"
                  >
                    Iniciar Sesión aquí
                  </button>
                </div>

              </form>
            )}

            {/* Footer helper for new technicians */}
            <div className="text-center pt-2 border-t border-gray-100 text-xs text-gray-500">
              ¿Deseas postular con documentos al Sello Melsa?{' '}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenApplicationModal?.();
                }}
                className="text-[#D02126] font-semibold hover:underline cursor-pointer ml-1 inline-flex items-center gap-1"
              >
                <span>Ficha de Postulación con Documentos</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

          </div>
        ) : currentUser.role === 'admin' ? (
          /* ------------------------------------------------------------- */
          /* 2. INTRANET ADMIN VIEW (EQUIPO MELSA)                         */
          /* ------------------------------------------------------------- */
          <div className="space-y-6">
            
            {/* Admin Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#D02126]/10 text-[#D02126] flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold text-[#0F1115]">
                    Intranet de Auditoría Interna Melsa
                  </h3>
                  <span className="text-xs text-gray-500">Sesión activa como: <strong>{currentUser.name}</strong></span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 text-xs text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Cerrar Sesión</span>
              </button>
            </div>

            {/* Admin Tabs */}
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              <button
                onClick={() => setAdminTab('applications')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  adminTab === 'applications'
                    ? 'bg-[#0F1115] text-white shadow-sm'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                Postulaciones Pendientes ({applications.filter(a => a.status === 'Pendiente').length})
              </button>
              <button
                onClick={() => setAdminTab('providers')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  adminTab === 'providers'
                    ? 'bg-[#0F1115] text-white shadow-sm'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                Técnicos & Empresas Publicadas ({HOME_SERVICE_PROVIDERS.length})
              </button>
            </div>

            {/* Applications List */}
            {adminTab === 'applications' && (
              <div className="space-y-4">
                {applications.length > 0 ? (
                  applications.map((app) => (
                    <div
                      key={app.id}
                      className="bg-[#FAF9F8] p-5 rounded-2xl border border-gray-200 space-y-4"
                    >
                      {/* Top Info */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-gray-500">{app.id}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              app.status === 'Pendiente' ? 'bg-amber-100 text-amber-800' :
                              app.status === 'Aprobado' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {app.status}
                            </span>
                            <span className="text-[10px] bg-gray-200 px-2 py-0.5 rounded text-gray-700 font-medium">
                              {app.applicantType}
                            </span>
                          </div>
                          <h4 className="text-base font-bold text-[#0F1115] mt-1">
                            {app.fullNameOrCompanyName} <span className="text-xs font-normal text-gray-500">({app.rut})</span>
                          </h4>
                          <span className="text-xs text-gray-500 font-light">
                            Rubro: <strong>{app.category}</strong> • Tel: {app.contactPhone} • Email: {app.contactEmail}
                          </span>
                        </div>

                        {/* Audit Action Buttons */}
                        {app.status === 'Pendiente' && (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => onApproveApplication(app.id)}
                              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Aprobar & Publicar</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => onRejectApplication(app.id)}
                              className="px-3 py-2 rounded-xl border border-red-300 text-red-600 hover:bg-red-50 text-xs font-semibold transition-all cursor-pointer"
                            >
                              Rechazar
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Submitted Documents Checklist */}
                      <div className="border-t border-gray-200/80 pt-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-2">
                          Documentación Adjunta Auditada:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          {app.documents.map((doc, didx) => (
                            <div key={didx} className="bg-white p-2.5 rounded-xl border border-gray-200 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                                <span className="font-medium text-gray-800 text-[11px] truncate max-w-[220px]">{doc.name}</span>
                              </div>
                              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                                {doc.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-500 text-center py-8">No hay solicitudes registradas.</p>
                )}
              </div>
            )}

            {adminTab === 'providers' && (
              <div className="space-y-3">
                {HOME_SERVICE_PROVIDERS.map((prov) => (
                  <div key={prov.id} className="bg-[#FAF9F8] p-3.5 rounded-xl border border-gray-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-gray-800 block">{prov.name} ({prov.companyOrTradeName})</span>
                      <span className="text-gray-500 text-[11px]">Especialidad: {prov.category} • Rating: ⭐ {prov.rating} ({prov.reviewCount} reseñas)</span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      Sello Melsa Activo
                    </span>
                  </div>
                ))}
              </div>
            )}

          </div>
        ) : (
          /* ------------------------------------------------------------- */
          /* 3. PROVIDER PORTAL VIEW (TÉCNICO / EMPRESA LOGUEADO)          */
          /* ------------------------------------------------------------- */
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Provider Comprehensive Header */}
            <div className="bg-[#FAF9F8] p-5 rounded-3xl border border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#0F1115] to-[#2D3139] text-white flex items-center justify-center font-serif text-xl font-bold shadow-md shrink-0">
                  {currentUser.name.charAt(0)}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="text-xl font-serif font-bold text-[#0F1115]">
                      {currentUser.name}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      Sello Melsa Verificado
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                    <span><strong>RUT:</strong> 76.994.210-3</span>
                    <span>•</span>
                    <span><strong>Rubro:</strong> Remodelación, Albañilería & Terminaciones</span>
                    <span>•</span>
                    <span><strong>Contacto:</strong> +56 9 7345 6789</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-center">
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer bg-white"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            </div>

            {/* Provider Key Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white p-3.5 rounded-2xl border border-gray-200 text-center">
                <div className="flex items-center justify-center gap-1 text-amber-500 mb-0.5">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="text-base font-bold text-[#0F1115]">4.88</span>
                </div>
                <span className="text-[10px] text-gray-400 block uppercase tracking-wider">41 Calificaciones</span>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-gray-200 text-center">
                <span className="text-base font-bold text-[#D02126] block mb-0.5">19</span>
                <span className="text-[10px] text-gray-400 block uppercase tracking-wider">Contactos este mes</span>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-gray-200 text-center">
                <span className="text-base font-bold text-gray-800 block mb-0.5">85</span>
                <span className="text-[10px] text-gray-400 block uppercase tracking-wider">Obras Auditadas</span>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-gray-200 text-center">
                <span className="text-base font-bold text-emerald-600 block mb-0.5">100%</span>
                <span className="text-[10px] text-gray-400 block uppercase tracking-wider">Papeles al Día</span>
              </div>
            </div>

            {/* Provider Navigation Tabs */}
            <div className="flex items-center gap-1 border-b border-gray-200 pb-2 overflow-x-auto text-xs">
              <button
                onClick={() => setProviderTab('projects')}
                className={`px-4 py-2 rounded-xl font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  providerTab === 'projects'
                    ? 'bg-[#0F1115] text-white shadow-sm'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                📸 Galería de Obras ({providerProjects.length})
              </button>

              <button
                onClick={() => setProviderTab('profile')}
                className={`px-4 py-2 rounded-xl font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  providerTab === 'profile'
                    ? 'bg-[#0F1115] text-white shadow-sm'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                📋 Mi Ficha & Cobertura
              </button>

              <button
                onClick={() => setProviderTab('documents')}
                className={`px-4 py-2 rounded-xl font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  providerTab === 'documents'
                    ? 'bg-[#0F1115] text-white shadow-sm'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                🛡️ Sello & Documentación SII
              </button>

              <button
                onClick={() => setProviderTab('reviews')}
                className={`px-4 py-2 rounded-xl font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  providerTab === 'reviews'
                    ? 'bg-[#0F1115] text-white shadow-sm'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                ⭐ Opiniones de Clientes (3)
              </button>
            </div>

            {/* TAB 1: PROJECTS & GALLERY */}
            {providerTab === 'projects' && (
              <div className="space-y-5 animate-in fade-in duration-150">
                
                {/* Action Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">
                      Obras Realizadas con Evidencia de Calidad
                    </h4>
                    <p className="text-xs text-gray-500 font-light">
                      Muestra fotos de antes y después para transmitir máxima confianza y ser elegido por clientes en Melsa.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsAddingProject(!isAddingProject)}
                    className="px-4 py-2.5 rounded-xl bg-[#D02126] hover:bg-[#B81B1F] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer self-start sm:self-center"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Subir Nuevo Proyecto</span>
                  </button>
                </div>

                {/* Form to Add New Project */}
                {isAddingProject && (
                  <form onSubmit={handleAddProject} className="bg-[#FAF9F8] p-5 rounded-2xl border border-[#D02126]/30 space-y-4 animate-in fade-in duration-150">
                    <span className="text-xs font-bold text-[#D02126] uppercase tracking-wider block">
                      Publicar Nueva Obra Terminada en mi Vitrina
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Título de la Obra</label>
                        <input
                          type="text"
                          required
                          value={newProjectTitle}
                          onChange={(e) => setNewProjectTitle(e.target.value)}
                          placeholder="Ej. Remodelación Cocina Abierta con Isla en Cuarzo"
                          className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#0F1115] focus:ring-1 focus:ring-[#D02126] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Comuna / Región</label>
                        <input
                          type="text"
                          value={newProjectLocation}
                          onChange={(e) => setNewProjectLocation(e.target.value)}
                          placeholder="Ej. Vitacura / RM"
                          className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#0F1115] focus:ring-1 focus:ring-[#D02126] outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Descripción del Trabajo y Materiales Empleados</label>
                      <textarea
                        rows={2}
                        value={newProjectDesc}
                        onChange={(e) => setNewProjectDesc(e.target.value)}
                        placeholder="Detalle de demolición, terminaciones de piso, grifería, tiempo de entrega..."
                        className="w-full bg-white border border-gray-200 rounded-xl p-3 text-xs text-[#0F1115] focus:ring-1 focus:ring-[#D02126] outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">URL Foto Obra Terminada (Después) *</label>
                        <input
                          type="url"
                          required
                          value={newProjectImg}
                          onChange={(e) => setNewProjectImg(e.target.value)}
                          placeholder="https://..."
                          className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#0F1115] focus:ring-1 focus:ring-[#D02126] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">URL Foto Estado Previo (Antes) - Opcional</label>
                        <input
                          type="url"
                          value={newProjectBeforeImg}
                          onChange={(e) => setNewProjectBeforeImg(e.target.value)}
                          placeholder="https://..."
                          className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#0F1115] focus:ring-1 focus:ring-[#D02126] outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsAddingProject(false)}
                        className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 text-xs font-semibold hover:bg-gray-100 transition-colors cursor-pointer"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-[#D02126] hover:bg-[#B81B1F] text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
                      >
                        Guardar Proyecto en Vitrina
                      </button>
                    </div>
                  </form>
                )}

                {/* Projects Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {providerProjects.map((proj) => {
                    const currentMode = projectImageMode[proj.id] || 'after';
                    const activeImg = (currentMode === 'before' && proj.imageBefore) ? proj.imageBefore : proj.imageAfter;

                    return (
                      <div key={proj.id} className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow">
                        <div>
                          {/* Image with Before/After Toggle */}
                          <div className="aspect-[16/11] bg-gray-100 overflow-hidden relative">
                            <img
                              src={activeImg}
                              alt={proj.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />

                            <span className="absolute top-2.5 left-2.5 bg-black/70 text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full backdrop-blur-xs">
                              {proj.completionDate}
                            </span>

                            {/* Before/After Pills if before exists */}
                            {proj.imageBefore && (
                              <div className="absolute top-2.5 right-2.5 flex items-center bg-black/70 p-0.5 rounded-lg backdrop-blur-xs">
                                <button
                                  type="button"
                                  onClick={() => setProjectImageMode(prev => ({ ...prev, [proj.id]: 'before' }))}
                                  className={`px-2 py-0.5 rounded text-[9px] font-bold transition-all cursor-pointer ${
                                    currentMode === 'before' ? 'bg-[#D02126] text-white' : 'text-gray-300 hover:text-white'
                                  }`}
                                >
                                  Antes
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setProjectImageMode(prev => ({ ...prev, [proj.id]: 'after' }))}
                                  className={`px-2 py-0.5 rounded text-[9px] font-bold transition-all cursor-pointer ${
                                    currentMode === 'after' ? 'bg-emerald-600 text-white' : 'text-gray-300 hover:text-white'
                                  }`}
                                >
                                  Después
                                </button>
                              </div>
                            )}
                          </div>

                          <div className="p-4 space-y-2">
                            <h5 className="text-xs font-bold text-[#0F1115] leading-snug">{proj.title}</h5>
                            <p className="text-[11px] text-gray-500 font-light line-clamp-3 leading-relaxed">
                              {proj.description}
                            </p>
                          </div>
                        </div>

                        <div className="p-4 pt-0 border-t border-gray-100 flex items-center justify-between mt-2">
                          <span className="text-[10px] text-emerald-700 bg-emerald-50 font-bold px-2 py-0.5 rounded">
                            Visible en Ficha Melsa
                          </span>

                          <button
                            type="button"
                            onClick={() => handleDeleteProject(proj.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Eliminar proyecto"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            )}

            {/* TAB 2: PROFILE & COVERAGE */}
            {providerTab === 'profile' && (
              <div className="bg-[#FAF9F8] p-6 rounded-2xl border border-gray-200 space-y-5 animate-in fade-in duration-150 text-xs">
                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-1">Datos Públicos de tu Empresa / Ficha Técnica</h4>
                  <p className="text-gray-500">Esta información se muestra a los propietarios e inversionistas de Melsa que buscan técnicos en tu zona.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1 uppercase tracking-wider text-[10px]">Razón Social / Nombre Comercial</label>
                    <input type="text" readOnly value="Constructora & Diseño Alerce SpA" className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-gray-700" />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1 uppercase tracking-wider text-[10px]">RUT Empresa Auditado</label>
                    <input type="text" readOnly value="76.994.210-3" className="w-full bg-gray-100 border border-gray-200 rounded-xl px-3.5 py-2.5 text-gray-500 cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1 uppercase tracking-wider text-[10px]">Teléfono de Contacto / WhatsApp</label>
                    <input type="text" defaultValue="+56 9 7345 6789" className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-gray-900 focus:ring-1 focus:ring-[#D02126]" />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1 uppercase tracking-wider text-[10px]">Email de Notificaciones</label>
                    <input type="email" defaultValue="contacto@alercediseno.cl" className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-gray-900 focus:ring-1 focus:ring-[#D02126]" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-gray-700 mb-1 uppercase tracking-wider text-[10px]">Comunas de Cobertura Activas</label>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {['Las Condes', 'Vitacura', 'Lo Barnechea', 'Concón', 'Viña del Mar', 'Puerto Varas'].map(zone => (
                        <span key={zone} className="px-3 py-1 rounded-xl bg-white border border-gray-300 font-medium text-gray-800 flex items-center gap-1.5 shadow-2xs">
                          <Check className="w-3 h-3 text-[#D02126]" />
                          {zone}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button type="button" className="px-5 py-2.5 rounded-xl bg-[#0F1115] text-white font-semibold hover:bg-gray-800 transition-colors cursor-pointer">
                    Guardar Cambios de Ficha
                  </button>
                </div>
              </div>
            )}

            {/* TAB 3: DOCUMENTS AUDITED BY MELSA */}
            {providerTab === 'documents' && (
              <div className="bg-[#FAF9F8] p-6 rounded-2xl border border-gray-200 space-y-4 animate-in fade-in duration-150 text-xs">
                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-1">Documentos Auditados para el Sello Melsa</h4>
                  <p className="text-gray-500">Melsa revisa periódicamente estos registros para mantener tu perfil destacado con máxima confianza.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-white p-4 rounded-xl border border-emerald-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-gray-800 block">Carpeta Tributaria Electrónica SII</span>
                      <span className="text-[11px] text-gray-500">Últimos 12 meses declarados • F29 al día</span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
                      Auditado ✅
                    </span>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-emerald-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-gray-800 block">Certificado de Antecedentes Fines Especiales</span>
                      <span className="text-[11px] text-gray-500">Registro Civil e Identificación • Sin anotaciones</span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
                      Auditado ✅
                    </span>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-emerald-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-gray-800 block">Certificado de Vigencia de Poderes</span>
                      <span className="text-[11px] text-gray-500">Registro Electrónico de Empresas y Sociedades</span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
                      Vigente ✅
                    </span>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-emerald-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-gray-800 block">Acreditación Técnica de Instalador</span>
                      <span className="text-[11px] text-gray-500">Carnet SEC / Certificaciones de Fábrica</span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
                      Acreditado ✅
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 text-emerald-900 text-[11px] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Tu membresía cuenta con el <strong>Sello de Confianza Melsa 2026</strong>. La próxima revisión de antecedentes se realizará en 6 meses.</span>
                </div>
              </div>
            )}

            {/* TAB 4: CUSTOMER REVIEWS */}
            {providerTab === 'reviews' && (
              <div className="space-y-3 animate-in fade-in duration-150 text-xs">
                <div className="bg-[#FAF9F8] p-4 rounded-2xl border border-gray-200 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">Opiniones Auditadas de Clientes Melsa</h4>
                    <span className="text-gray-500">Evaluaciones de propietarios luego de contratar tus servicios.</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-amber-500 font-bold text-sm bg-white px-3 py-1.5 rounded-xl border border-gray-200">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span>4.88 / 5.0</span>
                  </div>
                </div>

                {[
                  {
                    client: 'Marcela Edwards V.',
                    commune: 'Las Condes (San Damián)',
                    work: 'Remodelación integral de cocina isla',
                    rating: 5,
                    date: 'Hace 2 semanas',
                    comment: 'Excelente experiencia con Alerce. Muy rigurosos en los plazos, dejaron todo limpio cada tarde y las terminaciones del cuarzo quedaron de revista.'
                  },
                  {
                    client: 'Ignacio Larraín P.',
                    commune: 'Vitacura',
                    work: 'Modernización de 2 baños suite',
                    rating: 5,
                    date: 'Hace 1 mes',
                    comment: 'Cambiaron las tinas por duchas italianas con mamparas sin filtraciones. El personal con papeles al día dio mucha tranquilidad en casa.'
                  },
                  {
                    client: 'Rodrigo Schmidt M.',
                    commune: 'Concón (Costa de Montemar)',
                    work: 'Pintura exterior y sellado de ventanas',
                    rating: 4.8,
                    date: 'Hace 2 meses',
                    comment: 'Muy profesionales. El sellado resistió perfecto los temporales del invierno costero. 100% recomendados.'
                  }
                ].map((rev, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-2xl border border-gray-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-gray-900 block">{rev.client}</span>
                        <span className="text-[11px] text-gray-500">{rev.commune} • {rev.work}</span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600 text-[11px] leading-relaxed italic bg-gray-50 p-3 rounded-xl border border-gray-100">
                      &quot;{rev.comment}&quot;
                    </p>
                    <span className="text-[10px] text-gray-400 block text-right">{rev.date}</span>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};

