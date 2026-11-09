import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowLeft, 
  TrendingDown, 
  Sparkles, 
  Flame, 
  Wrench, 
  Receipt, 
  Users, 
  Vote, 
  Package, 
  Car, 
  Phone, 
  ExternalLink, 
  FileText, 
  Check, 
  X, 
  Clock, 
  HelpCircle,
  Smartphone,
  Tablet,
  Laptop,
  ArrowRight,
  CreditCard,
  Briefcase,
  QrCode,
  Zap,
  Lock,
  User,
  LogOut
} from 'lucide-react';
import { MelsaLogo } from './MelsaLogo';
import { BuildingManagementHub } from './BuildingManagementHub';
import { CommunityAuthModal } from './CommunityAuthModal';
import { 
  CommunityUser, 
  getStoredCommunityUser, 
  saveStoredCommunityUser 
} from '../services/communityAuthService';

interface MelsaCommunitiesPortalPageProps {
  onBackToHome: () => void;
  onOpenWorkspace?: () => void;
  currentUser?: any;
}

export const MelsaCommunitiesPortalPage: React.FC<MelsaCommunitiesPortalPageProps> = ({
  onBackToHome,
  onOpenWorkspace
}) => {
  // Independent Community User Session
  const [communityUser, setCommunityUser] = useState<CommunityUser | null>(getStoredCommunityUser());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalInitialMode, setAuthModalInitialMode] = useState<'login' | 'register'>('register');

  // Active View: 'presentation' (Landing Institucional) | 'console' (Sistema Operativo de Edificio)
  const [activeView, setActiveView] = useState<'presentation' | 'console'>(
    getStoredCommunityUser() ? 'console' : 'presentation'
  );

  // Sub-Navigation within Console
  const [consoleQuickTab, setConsoleQuickTab] = useState<'expenses' | 'conciliation' | 'payroll' | 'concierge' | 'maintenances'>('expenses');

  // Savings Calculator State
  const [calculatorUnits, setCalculatorUnits] = useState<number>(64);
  const cfPriceMonthlyCLP = Math.round(calculatorUnits * 1450); // ComunidadFeliz approx market pricing
  const melsaPriceMonthlyCLP = Math.round(calculatorUnits * 550); // Melsa low-cost pricing (~0.85 UF)
  const monthlySavingsCLP = cfPriceMonthlyCLP - melsaPriceMonthlyCLP;
  const annualSavingsCLP = monthlySavingsCLP * 12;

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthModalInitialMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleLoginSuccess = (user: CommunityUser) => {
    setCommunityUser(user);
    setActiveView('console');
  };

  const handleLogoutCommunity = () => {
    saveStoredCommunityUser(null);
    setCommunityUser(null);
    setActiveView('presentation');
  };

  return (
    <div className="min-h-screen bg-[#FAF9F8] text-[#0F1115] font-sans selection:bg-[#D02126] selection:text-white pb-20">
      
      {/* ============================================================== */}
      {/* 1. TOP NAVBAR: IMPECCABLE MELSA CORPORATE BRANDING            */}
      {/* ============================================================== */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200/80 shadow-xs px-4 sm:px-8 py-3.5">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">
          
          {/* Left: Back Link & Logo */}
          <div className="flex items-center gap-4 shrink-0">
            <button
              onClick={onBackToHome}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-semibold text-gray-700 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sitio Inmobiliario</span>
            </button>

            <div className="h-6 w-px bg-gray-200 hidden sm:block" />

            {/* Melsa Brand */}
            <div className="flex items-center gap-2.5">
              <MelsaLogo height={38} />
              <div className="hidden lg:block pl-2 border-l border-gray-200">
                <span className="text-[11px] font-black tracking-wider uppercase text-[#D02126] block leading-tight">
                  COMUNIDADES OS
                </span>
                <span className="text-[10px] text-gray-400 font-medium leading-none">
                  Ley de Copropiedad 21.442
                </span>
              </div>
            </div>
          </div>

          {/* Center Navigation Links (Presentation Mode) */}
          {activeView === 'presentation' && (
            <div className="hidden xl:flex items-center gap-5 text-xs font-semibold text-gray-700">
              <a href="#soluciones" className="hover:text-[#D02126] transition-colors">Soluciones</a>
              <a href="#comparativa-cf" className="hover:text-[#D02126] transition-colors flex items-center gap-1">
                <span>vs ComunidadFeliz</span>
                <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200">-65%</span>
              </a>
              <a href="#calculadora-ahorro" className="hover:text-[#D02126] transition-colors">Calculadora Ahorro</a>
              <a href="#mantenimiento-sec" className="hover:text-[#D02126] transition-colors">Red Mantención SEC</a>
            </div>
          )}

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5 shrink-0">
            {communityUser ? (
              /* User is logged in to a Community */
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs">
                  <div className="w-6 h-6 rounded-lg bg-[#D02126]/10 text-[#D02126] flex items-center justify-center font-bold">
                    <Building2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-extrabold text-[#0F1115] block leading-tight text-[11px]">
                      {communityUser.communityName}
                    </span>
                    <span className="text-[10px] text-gray-500">
                      {communityUser.name.split(' ')[0]} ({communityUser.role === 'admin_edificio' ? 'Administrador' : communityUser.role === 'conserje' ? 'Conserjería' : 'Residente'})
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setActiveView(activeView === 'console' ? 'presentation' : 'console')}
                  className="px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-700 cursor-pointer"
                >
                  {activeView === 'console' ? 'Ver Portada' : 'Ir a Consola'}
                </button>

                <button
                  onClick={handleLogoutCommunity}
                  title="Cerrar Sesión del Edificio"
                  className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              /* User is anonymous / guest */
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenAuth('login')}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-gray-700 hover:text-[#0F1115] hover:bg-gray-100 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5 text-gray-400" />
                  <span>Iniciar Sesión Edificio</span>
                </button>

                <button
                  onClick={() => handleOpenAuth('register')}
                  className="px-4 py-2 rounded-xl bg-[#D02126] hover:bg-[#B81B1F] text-white text-xs font-extrabold shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>Crear Cuenta de Edificio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ============================================================== */}
      {/* VIEW A: LANDING INSTITUCIONAL (PERSONALIDAD MELSA IMPECABLE)  */}
      {/* ============================================================== */}
      {activeView === 'presentation' && (
        <div className="space-y-24 animate-in fade-in duration-200">
          
          {/* HERO SECTION */}
          <section className="relative overflow-hidden bg-gradient-to-b from-white via-[#FAF9F8] to-white pt-16 pb-20 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="text-center max-w-4xl mx-auto space-y-6">
                
                {/* Badge Tag */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D02126]/10 text-[#D02126] text-xs font-black uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Nuevo • MELSA Comunidades OS • Ley de Copropiedad 21.442</span>
                </div>

                {/* Main Headline */}
                <h1 className="text-4xl sm:text-6xl font-extrabold text-[#0F1115] tracking-tight font-serif-title leading-[1.12]">
                  La Administración de Edificios & Condominios, <span className="text-[#D02126]">Reinventada</span>.
                </h1>

                {/* Subtitle */}
                <p className="text-base sm:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
                  Prorrateo de gastos comunes al milímetro, conciliación bancaria automática, sueldos de conserjería con Previred, conserjería QR y la <strong>única red de técnicos certificados SEC</strong> con hasta un <strong>65% de ahorro real</strong> frente a ComunidadFeliz.
                </p>

                {/* Action CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
                  <button
                    onClick={() => handleOpenAuth('register')}
                    className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-[#D02126] hover:bg-[#B81B1F] text-white text-sm font-black shadow-lg shadow-red-900/25 transition-all cursor-pointer flex items-center justify-center gap-2 group"
                  >
                    <span>Crear Cuenta de Edificio (30 Días Gratis)</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    onClick={() => setActiveView('console')}
                    className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white hover:bg-gray-50 text-[#0F1115] border border-gray-200 text-sm font-bold shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Laptop className="w-4 h-4 text-gray-500" />
                    <span>Explorar Demostración en Vivo</span>
                  </button>
                </div>

                {/* 4 Feature Trust Bullets */}
                <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left max-w-3xl mx-auto">
                  <div className="p-3.5 bg-white rounded-2xl border border-gray-100 shadow-xs">
                    <span className="text-base font-black text-[#D02126] block">0,8 a 1,2 UF</span>
                    <span className="text-[11px] text-gray-500 font-semibold">Costo plano por edificio</span>
                  </div>
                  <div className="p-3.5 bg-white rounded-2xl border border-gray-100 shadow-xs">
                    <span className="text-base font-black text-emerald-600 block">Previred & Banco</span>
                    <span className="text-[11px] text-gray-500 font-semibold">100% Incluidos sin costo extra</span>
                  </div>
                  <div className="p-3.5 bg-white rounded-2xl border border-gray-100 shadow-xs">
                    <span className="text-base font-black text-blue-600 block">Red SEC Melsa</span>
                    <span className="text-[11px] text-gray-500 font-semibold">Calderas, ascensores y bombas</span>
                  </div>
                  <div className="p-3.5 bg-white rounded-2xl border border-gray-100 shadow-xs">
                    <span className="text-base font-black text-purple-600 block">Ley 21.442</span>
                    <span className="text-[11px] text-gray-500 font-semibold">Corte Art. 20 y quórum legal</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 6 CORE PILLARS SECTION */}
          <section id="soluciones" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-black text-[#D02126] uppercase tracking-wider">Ecosistema Integral</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F1115] font-serif-title">
                Todo lo que tu edificio necesita, en una sola plataforma.
              </h2>
              <p className="text-sm text-gray-600">
                Diseñado para Administradores Minvu, Comités de Administración, Conserjes y Copropietarios.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Card 1 */}
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs hover:shadow-md transition-shadow space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#D02126] flex items-center justify-center font-bold">
                  <Receipt className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#0F1115]">Gastos Comunes & Prorrateo Justo</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Cálculo automático de alícuotas fiscales, consumos individuales de remarcadores (agua caliente, gas), fondo de reserva obligatorio del 5% y envío de boletas desglosadas por WhatsApp.
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs hover:shadow-md transition-shadow space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <CreditCard className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#0F1115]">Conciliación Bancaria Automática</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Cruce inteligente de transferencias bancarias (BancoEstado, Banco de Chile, Santander, BCI). Identifica el depto por monto y glosa y concilia todo masivamente en 1 clic (CF cobra 2 UF extra).
                </p>
              </div>

              {/* Card 3 */}
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs hover:shadow-md transition-shadow space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                  <Briefcase className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#0F1115]">Remuneraciones & Previred (.txt)</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Liquidaciones de sueldo oficiales para conserjes en turnos 4x4 o 6x1 con gratificación legal Art. 50, horas extras al 50% y exportación del archivo plano de Previred para pagar imposiciones al día.
                </p>
              </div>

              {/* Card 4 */}
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs hover:shadow-md transition-shadow space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <QrCode className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#0F1115]">Conserjería Digital & Pases QR</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Adiós a los libros de papel. Pases QR de invitados válidos por 4 horas, recepción de encomiendas con aviso automático al celular del vecino y control de estacionamientos de visitas.
                </p>
              </div>

              {/* Card 5 */}
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs hover:shadow-md transition-shadow space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Wrench className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#0F1115]">Red de Técnicos Certificados SEC</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  La gran ventaja Melsa: supervisión de calderas (Sello Verde SEC), ascensores (Minvu Ley 20.296) y bombas de agua con botón de cotización directa e inspectores certificados con garantía.
                </p>
              </div>

              {/* Card 6 */}
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs hover:shadow-md transition-shadow space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#0F1115]">Cumplimiento Ley 21.442 & Art. 20</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Generador del oficio legal de corte de suministro eléctrico para unidades morosas (+3 meses) listo para notificar a la compañía distribuidora, y quórums de asambleas por porcentaje de copropiedad.
                </p>
              </div>
            </div>
          </section>

          {/* SIMULATOR SECTION */}
          <section id="calculadora-ahorro" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-br from-white via-gray-50 to-white rounded-3xl border border-gray-200 p-8 sm:p-10 shadow-sm space-y-8">
              <div className="text-center max-w-xl mx-auto space-y-2">
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Ahorro Comprobado</span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0F1115] font-serif-title">
                  Simulador de Ahorro para tu Condominio
                </h3>
                <p className="text-xs text-gray-500">
                  Comprueba cuánto dinero recupera tu comunidad al año sustituyendo software tradicional por MELSA Comunidades OS.
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-gray-700">Cantidad de Departamentos / Casas:</span>
                    <span className="text-xl font-black text-[#D02126]">{calculatorUnits} unidades</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="200"
                    step="1"
                    value={calculatorUnits}
                    onChange={(e) => setCalculatorUnits(Number(e.target.value))}
                    className="w-full accent-[#D02126] cursor-pointer"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-white border border-gray-200">
                    <span className="text-xs text-gray-500 block">ComunidadFeliz estimado:</span>
                    <span className="text-lg font-extrabold text-red-500 line-through">
                      ${cfPriceMonthlyCLP.toLocaleString('es-CL')} CLP / mes
                    </span>
                    <span className="text-[10px] text-gray-400 block mt-1">(Plan base + conciliación + remuneraciones)</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                    <span className="text-xs text-emerald-800 font-bold block">MELSA Comunidades OS:</span>
                    <span className="text-xl font-black text-emerald-700">
                      ${melsaPriceMonthlyCLP.toLocaleString('es-CL')} CLP / mes
                    </span>
                    <span className="text-[10px] text-emerald-600 font-semibold block mt-1">Todo incluido sin add-ons</span>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-[#0F1115] text-white text-center space-y-1">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Ahorro Anual que va a tu Fondo de Reserva:</span>
                  <div className="text-3xl sm:text-4xl font-black text-emerald-400">
                    ${annualSavingsCLP.toLocaleString('es-CL')} CLP
                  </div>
                  <p className="text-[11px] text-gray-400">Suficiente para financiar certificaciones de calderas y mantenciones de ascensores del edificio.</p>
                </div>

                <div className="text-center">
                  <button
                    onClick={() => handleOpenAuth('register')}
                    className="px-8 py-3.5 rounded-2xl bg-[#D02126] hover:bg-[#B81B1F] text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
                  >
                    Activar este Ahorro para {calculatorUnits} Unidades →
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* DETAILED COMPARISON TABLE SECTION */}
          <section id="comparativa-cf" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-bold text-[#D02126] uppercase tracking-wider">Transparencia Total</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0F1115] font-serif-title">
                ¿Por qué los comités se cambian a MELSA?
              </h3>
            </div>

            <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden">
              <div className="grid grid-cols-12 bg-gray-50 p-4 border-b border-gray-200 text-xs font-black uppercase text-gray-500">
                <div className="col-span-5">Característica / Capacidad</div>
                <div className="col-span-3 text-center text-red-500">ComunidadFeliz</div>
                <div className="col-span-4 text-center text-emerald-700 font-black">MELSA Comunidades OS</div>
              </div>

              <div className="divide-y divide-gray-100 text-xs">
                <div className="grid grid-cols-12 p-4 items-center">
                  <div className="col-span-5">
                    <strong className="text-gray-900 block font-bold">Costo del Software</strong>
                    <span className="text-gray-500 text-[11px]">Para edificios de 50 a 100 departamentos</span>
                  </div>
                  <div className="col-span-3 text-center text-red-600 font-bold">
                    2 a 5 UF ($80.000 - $200.000)
                  </div>
                  <div className="col-span-4 text-center text-emerald-700 font-black bg-emerald-50 py-1.5 rounded-xl border border-emerald-200">
                    0,8 a 1,2 UF ($33.000 - $49.000)
                  </div>
                </div>

                <div className="grid grid-cols-12 p-4 items-center">
                  <div className="col-span-5">
                    <strong className="text-gray-900 block font-bold">Conciliación Bancaria Automática</strong>
                    <span className="text-gray-500 text-[11px]">Cruce de transferencias y cartolas</span>
                  </div>
                  <div className="col-span-3 text-center text-red-600 font-bold">
                    +2 UF extra (~$78.000 CLP)
                  </div>
                  <div className="col-span-4 text-center text-emerald-700 font-black">
                    ✓ 100% Incluido ($0)
                  </div>
                </div>

                <div className="grid grid-cols-12 p-4 items-center">
                  <div className="col-span-5">
                    <strong className="text-gray-900 block font-bold">Remuneraciones & Previred (.txt)</strong>
                    <span className="text-gray-500 text-[11px]">Sueldos de conserjes y turnos 4x4</span>
                  </div>
                  <div className="col-span-3 text-center text-red-600 font-bold">
                    +1 UF extra (~$39.000 CLP)
                  </div>
                  <div className="col-span-4 text-center text-emerald-700 font-black">
                    ✓ 100% Incluido ($0)
                  </div>
                </div>

                <div className="grid grid-cols-12 p-4 items-center">
                  <div className="col-span-5">
                    <strong className="text-gray-900 block font-bold">Red Técnica Propia SEC</strong>
                    <span className="text-gray-500 text-[11px]">Calderas, ascensores, bombas de agua</span>
                  </div>
                  <div className="col-span-3 text-center text-gray-400 font-bold">
                    NO TIENE
                  </div>
                  <div className="col-span-4 text-center text-emerald-700 font-black">
                    ✓ Red Certificada Melsa con Garantía
                  </div>
                </div>

                <div className="grid grid-cols-12 p-4 items-center">
                  <div className="col-span-5">
                    <strong className="text-gray-900 block font-bold">Pases QR y Avisos por WhatsApp</strong>
                    <span className="text-gray-500 text-[11px]">Notificación directa de encomiendas</span>
                  </div>
                  <div className="col-span-3 text-center text-gray-400">
                    Costo adicional o hardware extra
                  </div>
                  <div className="col-span-4 text-center text-emerald-700 font-black">
                    ✓ 100% Incluido ($0)
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* FINAL CTA BANNER */}
          <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-[#0F1115] to-[#1F2430] rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
              <div className="space-y-2 max-w-xl">
                <span className="text-xs font-bold text-[#D02126] uppercase">Comienza Hoy Mismo</span>
                <h4 className="text-2xl sm:text-3xl font-extrabold font-serif-title">
                  ¿Listo para modernizar tu edificio y ahorrar más de $2.000.000 al año?
                </h4>
                <p className="text-xs sm:text-sm text-gray-400">
                  Activamos tu comunidad en menos de 24 horas y migramos tus datos desde Excel o ComunidadFeliz sin costo.
                </p>
              </div>

              <button
                onClick={() => handleOpenAuth('register')}
                className="shrink-0 px-8 py-4 rounded-2xl bg-[#D02126] hover:bg-[#B81B1F] text-white font-black text-sm shadow-lg shadow-red-900/40 cursor-pointer transition-all"
              >
                Crear Cuenta de Edificio Gratis →
              </button>
            </div>
          </section>

        </div>
      )}

      {/* ============================================================== */}
      {/* VIEW B: CONSOLA OPERATIVA INDEPENDIENTE DE LA COMUNIDAD       */}
      {/* ============================================================== */}
      {activeView === 'console' && (
        <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-gray-200">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Sesión Activa
                </span>
                <span className="text-xs text-gray-500">
                  Comunidad: <strong>{communityUser?.communityName || 'Edificio Parque Almagro 1450'}</strong>
                </span>
              </div>
              <h2 className="text-2xl font-black text-[#0F1115]">Centro de Control de Edificio</h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveView('presentation')}
                className="px-3.5 py-1.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Volver a la Presentación
              </button>
              <button
                onClick={() => handleOpenAuth('register')}
                className="px-3.5 py-1.5 rounded-xl bg-[#D02126] text-white text-xs font-bold hover:bg-[#B81B1F] transition-colors cursor-pointer"
              >
                + Registrar Nuevo Edificio
              </button>
            </div>
          </div>

          {/* Embedded Full-Power Operating Hub */}
          <BuildingManagementHub />
        </main>
      )}

      {/* Independent Authentication Modal */}
      <CommunityAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        initialMode={authModalInitialMode}
      />

    </div>
  );
};
