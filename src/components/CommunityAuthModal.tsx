import React, { useState } from 'react';
import { 
  Building2, 
  X, 
  Lock, 
  Mail, 
  Phone, 
  User, 
  MapPin, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Check, 
  Smartphone, 
  KeyRound,
  Layers
} from 'lucide-react';
import { 
  CommunityUser, 
  DEMO_COMMUNITY_USERS, 
  registerCommunityAccount, 
  saveStoredCommunityUser 
} from '../services/communityAuthService';

interface CommunityAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: CommunityUser) => void;
  initialMode?: 'login' | 'register';
}

export const CommunityAuthModal: React.FC<CommunityAuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialMode = 'login'
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Login Form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register Form
  const [regCommunityName, setRegCommunityName] = useState('');
  const [regCommune, setRegCommune] = useState('Las Condes, RM');
  const [regUnitsCount, setRegUnitsCount] = useState<number>(48);
  const [regAdminName, setRegAdminName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const emailClean = loginEmail.toLowerCase().trim();
    if (!emailClean) {
      setErrorMsg('Por favor ingresa un correo electrónico.');
      return;
    }

    // Match demo users or create session
    let matchedUser: CommunityUser | null = null;
    if (emailClean.includes('conserje')) {
      matchedUser = DEMO_COMMUNITY_USERS.conserje;
    } else if (emailClean.includes('residente')) {
      matchedUser = DEMO_COMMUNITY_USERS.residente;
    } else {
      matchedUser = {
        ...DEMO_COMMUNITY_USERS.admin,
        email: emailClean,
        name: emailClean.split('@')[0].toUpperCase() + ' (Admin)'
      };
    }

    saveStoredCommunityUser(matchedUser);
    onLoginSuccess(matchedUser);
    onClose();
  };

  const handleFastDemoLogin = (role: 'admin' | 'conserje' | 'residente') => {
    const demoUser = DEMO_COMMUNITY_USERS[role];
    saveStoredCommunityUser(demoUser);
    onLoginSuccess(demoUser);
    onClose();
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!regCommunityName.trim() || !regAdminName.trim() || !regEmail.trim()) {
      setErrorMsg('Por favor completa todos los campos requeridos.');
      return;
    }

    const newUser = registerCommunityAccount({
      communityName: regCommunityName,
      commune: regCommune,
      unitsCount: Number(regUnitsCount) || 40,
      adminName: regAdminName,
      email: regEmail,
      phone: regPhone || '+56 9 9989 9421'
    });

    onLoginSuccess(newUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 space-y-6 my-8 animate-in fade-in zoom-in-95 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#D02126] text-white flex items-center justify-center shadow-md shadow-red-900/20">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-[#0F1115]">MELSA COMUNIDADES OS</span>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Ley 21.442
              </span>
            </div>
            <p className="text-xs text-gray-500">Plataforma Independiente para Edificios, Condominios & Comités</p>
          </div>
        </div>

        {/* Tab Toggle: Iniciar Sesión vs Crear Cuenta */}
        <div className="flex p-1 bg-gray-100 rounded-2xl text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2.5 rounded-xl transition-all cursor-pointer text-center ${
              mode === 'login'
                ? 'bg-white text-[#0F1115] shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Iniciar Sesión Edificio
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2.5 rounded-xl transition-all cursor-pointer text-center ${
              mode === 'register'
                ? 'bg-[#D02126] text-white shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Crear Cuenta de Edificio (Gratis)
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        {/* ============================================================== */}
        {/* MODE: LOGIN                                                    */}
        {/* ============================================================== */}
        {mode === 'login' && (
          <div className="space-y-5">
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1.5">Correo Electrónico de la Administración:</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="admin@parquealmagro.cl"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-3 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 outline-none focus:border-[#D02126] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1.5">Contraseña:</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-3 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 outline-none focus:border-[#D02126] transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#D02126] hover:bg-[#B81B1F] text-white font-extrabold text-xs shadow-md shadow-red-900/20 cursor-pointer transition-all flex items-center justify-center gap-2"
              >
                <span>Acceder a la Consola de Edificio</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* 1-Click Demo Profiles */}
            <div className="pt-4 border-t border-gray-100 space-y-2.5">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block text-center">
                O ingresa al instante con un perfil de prueba:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleFastDemoLogin('admin')}
                  className="p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-left transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-gray-900 group-hover:text-[#D02126]">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#D02126]" />
                    <span>Administrador</span>
                  </div>
                  <span className="text-[10px] text-gray-500 block mt-0.5">Control Total</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleFastDemoLogin('conserje')}
                  className="p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-left transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-gray-900 group-hover:text-[#D02126]">
                    <Smartphone className="w-3.5 h-3.5 text-amber-600" />
                    <span>Conserjería</span>
                  </div>
                  <span className="text-[10px] text-gray-500 block mt-0.5">Modo Portería</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleFastDemoLogin('residente')}
                  className="p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-left transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-gray-900 group-hover:text-[#D02126]">
                    <User className="w-3.5 h-3.5 text-blue-600" />
                    <span>Copropietario</span>
                  </div>
                  <span className="text-[10px] text-gray-500 block mt-0.5">Boleta & Quinchos</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* MODE: REGISTER (CREAR CUENTA EDIFICIO)                         */}
        {/* ============================================================== */}
        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
              <span><strong>Prueba Gratuita de 30 Días:</strong> Sin tarjeta de crédito. Activa tu edificio y ahorra hasta un 65% frente a ComunidadFeliz.</span>
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Nombre del Edificio o Condominio:</label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Ej. Condominio Mirador del Valle"
                  value={regCommunityName}
                  onChange={(e) => setRegCommunityName(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 border border-gray-200 rounded-xl font-semibold text-gray-900 outline-none focus:border-[#D02126]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Comuna & Región:</label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Ej. Viña del Mar / Santiago"
                    value={regCommune}
                    onChange={(e) => setRegCommune(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-xl font-semibold text-gray-900 outline-none focus:border-[#D02126]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">N° de Departamentos / Casas:</label>
                <div className="relative">
                  <Layers className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    min="5"
                    max="500"
                    required
                    value={regUnitsCount}
                    onChange={(e) => setRegUnitsCount(Number(e.target.value))}
                    className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-xl font-semibold text-gray-900 outline-none focus:border-[#D02126]"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Nombre Administrador o Presidente Comité:</label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Ej. Rodrigo Silva"
                  value={regAdminName}
                  onChange={(e) => setRegAdminName(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2 border border-gray-200 rounded-xl font-semibold text-gray-900 outline-none focus:border-[#D02126]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Email de Contacto:</label>
                <input
                  type="email"
                  required
                  placeholder="admin@condominio.cl"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl font-semibold text-gray-900 outline-none focus:border-[#D02126]"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Teléfono / WhatsApp:</label>
                <input
                  type="tel"
                  placeholder="+56 9 9989 9421"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl font-semibold text-gray-900 outline-none focus:border-[#D02126]"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Crear Contraseña:</label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-xl font-semibold text-gray-900 outline-none focus:border-[#D02126]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#D02126] to-[#A0181C] hover:from-[#E0262B] hover:to-[#B51C20] text-white font-black text-xs shadow-lg shadow-red-900/30 cursor-pointer transition-all flex items-center justify-center gap-2"
            >
              <span>Activar Edificio Gratis & Abrir Consola</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
