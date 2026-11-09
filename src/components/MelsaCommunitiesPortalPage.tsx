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
  Laptop
} from 'lucide-react';
import { BuildingManagementHub } from './BuildingManagementHub';
import { UF_CURRENT_CLP } from '../services/propertyValuationEngine';

interface MelsaCommunitiesPortalPageProps {
  onBackToHome: () => void;
  onOpenWorkspace?: () => void;
  currentUser?: any;
}

export const MelsaCommunitiesPortalPage: React.FC<MelsaCommunitiesPortalPageProps> = ({
  onBackToHome,
  onOpenWorkspace,
  currentUser
}) => {
  // Navigation inside Communities Portal
  const [activeSection, setActiveSection] = useState<'console' | 'comparison' | 'calculator' | 'concierge-tablet' | 'resident-app'>('console');
  
  // Savings Calculator State
  const [calculatorUnits, setCalculatorUnits] = useState<number>(64);
  const cfPriceMonthlyCLP = Math.round(calculatorUnits * 1450); // ComunidadFeliz approx market pricing
  const melsaPriceMonthlyCLP = Math.round(calculatorUnits * 550); // Melsa low-cost pricing (~0.85 UF)
  const monthlySavingsCLP = cfPriceMonthlyCLP - melsaPriceMonthlyCLP;
  const annualSavingsCLP = monthlySavingsCLP * 12;

  return (
    <div className="min-h-screen bg-[#0B0D11] text-white font-sans selection:bg-[#D02126] selection:text-white pb-20">
      {/* ============================================================== */}
      {/* TOP STANDALONE NAVIGATION HEADER                              */}
      {/* ============================================================== */}
      <header className="sticky top-0 z-50 bg-[#0F1115]/95 backdrop-blur-md border-b border-gray-800 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Logo & Identity */}
          <div className="flex items-center gap-4">
            <button
              onClick={onBackToHome}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-900 border border-gray-800 text-xs font-semibold text-gray-300 hover:text-white hover:border-gray-700 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Volver a MELSA</span>
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#D02126] to-[#991418] flex items-center justify-center text-white shadow-lg shadow-red-950/40">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-sm tracking-tight text-white">MELSA COMUNIDADES OS</span>
                  <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Ley 21.442
                  </span>
                </div>
                <p className="text-[11px] text-gray-400">Plataforma Integral de Copropiedad, Conserjería & Mantención SEC</p>
              </div>
            </div>
          </div>

          {/* Section Navigation Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <button
              onClick={() => setActiveSection('console')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeSection === 'console'
                  ? 'bg-[#D02126] text-white shadow-md shadow-red-900/30'
                  : 'bg-gray-900 text-gray-300 hover:bg-gray-800'
              }`}
            >
              <Laptop className="w-3.5 h-3.5" />
              <span>Consola Operativa</span>
            </button>

            <button
              onClick={() => setActiveSection('concierge-tablet')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeSection === 'concierge-tablet'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-900/30'
                  : 'bg-gray-900 text-gray-300 hover:bg-gray-800'
              }`}
            >
              <Tablet className="w-3.5 h-3.5" />
              <span>Terminal Conserjería</span>
            </button>

            <button
              onClick={() => setActiveSection('resident-app')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeSection === 'resident-app'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                  : 'bg-gray-900 text-gray-300 hover:bg-gray-800'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>App Copropietario</span>
            </button>

            <button
              onClick={() => setActiveSection('comparison')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeSection === 'comparison'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30'
                  : 'bg-gray-900 text-gray-300 hover:bg-gray-800'
              }`}
            >
              <TrendingDown className="w-3.5 h-3.5" />
              <span>vs ComunidadFeliz (-65%)</span>
            </button>

            <button
              onClick={() => setActiveSection('calculator')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeSection === 'calculator'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-900/30'
                  : 'bg-gray-900 text-gray-300 hover:bg-gray-800'
              }`}
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>Calculadora de Ahorro</span>
            </button>
          </div>

          {/* Quick Contact & Action */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="https://wa.me/56976652425?text=Hola,%20solicito%20cotizaci%C3%B3n%20de%20MELSA%20Comunidades%20OS%20para%20nuestro%20edificio."
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-md shadow-emerald-950/40"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Cotizar Edificio</span>
            </a>
          </div>
        </div>
      </header>

      {/* ============================================================== */}
      {/* HERO BANNER: STANDALONE PRESENTATION & VALUE PROP             */}
      {/* ============================================================== */}
      <section className="relative overflow-hidden border-b border-gray-800 bg-gradient-to-b from-[#13171F] to-[#0B0D11] px-4 sm:px-8 py-10">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#D02126]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-[#FF474D] text-xs font-extrabold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Alternativa Oficial de Alta Eficiencia a ComunidadFeliz</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                El Software para Edificios & Condominios <span className="text-[#D02126]">más Completo y Accesible</span> de Chile.
              </h1>
              <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                Prorrateo de gastos comunes al milímetro, avisos automáticos por WhatsApp, libro de visitas digital y la 
                <strong className="text-white font-bold"> única red de técnicos certificados SEC</strong> (gasfitería, electricidad, calderas y ascensores) integrada nativamente.
              </p>

              {/* Badges / Differentiators */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3 rounded-2xl bg-gray-900/80 border border-gray-800">
                  <span className="text-lg font-black text-emerald-400">0,8 UF</span>
                  <p className="text-[11px] text-gray-400">Desde por edificio (vs 3-8 UF CF)</p>
                </div>
                <div className="p-3 rounded-2xl bg-gray-900/80 border border-gray-800">
                  <span className="text-lg font-black text-amber-400">100% WhatsApp</span>
                  <p className="text-[11px] text-gray-400">Avisos de encomiendas y cobros</p>
                </div>
                <div className="p-3 rounded-2xl bg-gray-900/80 border border-gray-800">
                  <span className="text-lg font-black text-blue-400">SEC Chile</span>
                  <p className="text-[11px] text-gray-400">Red técnica propia para mantención</p>
                </div>
                <div className="p-3 rounded-2xl bg-gray-900/80 border border-gray-800">
                  <span className="text-lg font-black text-purple-400">Ley 21.442</span>
                  <p className="text-[11px] text-gray-400">Minvu, alícuotas y cortes Art. 20</p>
                </div>
              </div>
            </div>

            {/* Quick Interactive Savings Card */}
            <div className="w-full lg:w-96 bg-gray-900/90 border border-gray-800 rounded-3xl p-6 shadow-2xl relative">
              <div className="flex items-center justify-between pb-3 border-b border-gray-800">
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-emerald-400" />
                  <span className="text-sm font-black text-white">Simulador de Ahorro Real</span>
                </div>
                <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                  -62% Costo
                </span>
              </div>

              <div className="py-4 space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-gray-400">Número de Unidades:</span>
                    <span className="font-extrabold text-white text-sm">{calculatorUnits} dptos / casas</span>
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

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-gray-800/60">
                    <span className="text-gray-400">ComunidadFeliz estimado:</span>
                    <span className="font-bold text-red-400 line-through">${cfPriceMonthlyCLP.toLocaleString('es-CL')}/mes</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-800/60">
                    <span className="text-gray-400">MELSA Comunidades OS:</span>
                    <span className="font-extrabold text-emerald-400">${melsaPriceMonthlyCLP.toLocaleString('es-CL')}/mes</span>
                  </div>
                  <div className="pt-2 flex justify-between items-baseline">
                    <span className="text-xs font-bold text-gray-300">Ahorro Anual Edificio:</span>
                    <span className="text-lg font-black text-emerald-400">${annualSavingsCLP.toLocaleString('es-CL')} CLP</span>
                  </div>
                  <p className="text-[10px] text-gray-400 text-right">Dinero directo que va a tu Fondo de Reserva</p>
                </div>

                <a
                  href={`https://wa.me/56976652425?text=Hola,%20mi%20edificio%20tiene%20${calculatorUnits}%20unidades%20y%20quiero%20ahorrar%20con%20MELSA%20Comunidades.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#D02126] to-[#A0181C] hover:from-[#E0262B] hover:to-[#B51C20] text-white text-xs font-black text-center block transition-all shadow-lg shadow-red-950/40 cursor-pointer"
                >
                  Solicitar Activación para {calculatorUnits} Unidades →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* MAIN VIEW CONTENT CONTAINER                                   */}
      {/* ============================================================== */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 mt-8">
        {/* ========================================================== */}
        {/* VIEW 1: FULL OPERATIONAL CONSOLE (BuildingManagementHub)   */}
        {/* ========================================================== */}
        {activeSection === 'console' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <div>
                <h2 className="text-xl font-black text-white">Consola de Operaciones en Vivo</h2>
                <p className="text-xs text-gray-400">Edificio de Demostración Activo: Parque Almagro 1450 (64 Unidades)</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Servidor Conectado 24/7
                </span>
              </div>
            </div>

            {/* Embedded Core Operating Hub */}
            <BuildingManagementHub />
          </div>
        )}

        {/* ========================================================== */}
        {/* VIEW 2: TERMINAL CONSERJERÍA (TABLET KIOSK MODE)           */}
        {/* ========================================================== */}
        {activeSection === 'concierge-tablet' && (
          <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Tablet className="w-6 h-6 text-amber-400" />
                <div>
                  <h3 className="text-sm font-extrabold text-white">Modo Terminal de Portería / Tablet</h3>
                  <p className="text-xs text-amber-200/80">Diseño táctil de alto contraste pensado para el conserje o guardia en portería.</p>
                </div>
              </div>
              <button
                onClick={() => setActiveSection('console')}
                className="px-3 py-1.5 rounded-xl bg-gray-900 text-xs font-bold text-gray-300 hover:text-white"
              >
                Volver a Consola
              </button>
            </div>

            {/* Simulated Tablet Frame */}
            <div className="bg-[#12151B] border-4 border-gray-800 rounded-3xl p-6 shadow-2xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white">Conserjería - Edificio Parque Almagro</h2>
                    <p className="text-xs text-gray-400">Turno Día: Don Jorge Morales (Conserje Titular)</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xl font-mono font-black text-emerald-400">14:32:08</span>
                  <p className="text-[10px] text-gray-400">Lun 09 Nov 2026</p>
                </div>
              </div>

              {/* 3 Large Action Cards for Tablet */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-gray-900 border border-gray-800 hover:border-amber-500/50 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-3">
                    <Users className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-white text-base">Registrar Visita</h4>
                  <p className="text-xs text-gray-400 mt-1">Ingreso con RUT, patente vehicular y autorización del depto.</p>
                  <button 
                    onClick={() => setActiveSection('console')}
                    className="mt-4 w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
                  >
                    Abrir Registro Visitas →
                  </button>
                </div>

                <div className="p-5 rounded-2xl bg-gray-900 border border-gray-800 hover:border-amber-500/50 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-3">
                    <Package className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-white text-base">Recepción de Paquete</h4>
                  <p className="text-xs text-gray-400 mt-1">Dispara aviso instantáneo por WhatsApp al celular del residente.</p>
                  <button 
                    onClick={() => setActiveSection('console')}
                    className="mt-4 w-full py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold"
                  >
                    Registrar Encomienda →
                  </button>
                </div>

                <div className="p-5 rounded-2xl bg-gray-900 border border-gray-800 hover:border-amber-500/50 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
                    <Car className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-white text-base">Estacionamiento Visitas</h4>
                  <p className="text-xs text-gray-400 mt-1">3 de 8 libres. Alarma automática al superar 4 horas de estadía.</p>
                  <button 
                    onClick={() => setActiveSection('console')}
                    className="mt-4 w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                  >
                    Ver Estacionamientos →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* VIEW 3: RESIDENT PORTAL (MOBILE PREVIEW)                   */}
        {/* ========================================================== */}
        {activeSection === 'resident-app' && (
          <div className="max-w-md mx-auto space-y-6 animate-in fade-in duration-200">
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="w-6 h-6 text-blue-400" />
                <div>
                  <h3 className="text-sm font-extrabold text-white">App Móvil del Copropietario</h3>
                  <p className="text-xs text-blue-200/80">Vista que recibe el dueño o arrendatario en su smartphone.</p>
                </div>
              </div>
            </div>

            {/* Simulated Phone Shell */}
            <div className="bg-[#12151B] border-4 border-gray-800 rounded-[2.5rem] p-5 shadow-2xl space-y-5">
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-gray-800">
                <div>
                  <span className="text-[10px] text-gray-400">Edificio Parque Almagro</span>
                  <h3 className="text-base font-black text-white">Departamento 502</h3>
                </div>
                <div className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-extrabold border border-emerald-500/30">
                  Al Día
                </div>
              </div>

              {/* Bill Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-gray-900 to-[#181D26] border border-gray-700/80 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[11px] text-gray-400">Gasto Común Noviembre 2026</span>
                    <p className="text-2xl font-black text-white">$88.920</p>
                  </div>
                  <span className="text-[10px] text-gray-400">Vence: 15 Nov</span>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-gray-800 text-[11px] text-gray-300">
                  <div className="flex justify-between">
                    <span>Base Prorrateo (2,15%):</span>
                    <span className="font-bold">$75.250</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Remarcador Agua Caliente:</span>
                    <span className="font-bold">$9.900</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fondo Reserva Ley 21.442 (5%):</span>
                    <span className="font-bold">$3.770</span>
                  </div>
                </div>

                <button className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-950/40 cursor-pointer">
                  Pagar en Línea con Webpay / Fintoc →
                </button>
              </div>

              {/* Quick Resident Tools */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-gray-900 border border-gray-800 text-center">
                  <Package className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                  <span className="text-xs font-bold text-white block">1 Encomienda</span>
                  <span className="text-[10px] text-gray-400">En portería (MercadoLibre)</span>
                </div>
                <div className="p-3 rounded-xl bg-gray-900 border border-gray-800 text-center">
                  <Vote className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                  <span className="text-xs font-bold text-white block">Votación Activa</span>
                  <span className="text-[10px] text-gray-400">Pintura Fachada 2026</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* VIEW 4: COMPARISON MATRIX VS COMUNIDADFELIZ                */}
        {/* ========================================================== */}
        {activeSection === 'comparison' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black text-white">¿Por qué cambiar a MELSA Comunidades OS?</h2>
              <p className="text-sm text-gray-400">Comparativa técnica, financiera y operativa frente al líder del mercado tradicional.</p>
            </div>

            {/* Table */}
            <div className="bg-[#12151B] border border-gray-800 rounded-3xl overflow-hidden shadow-2xl">
              <div className="grid grid-cols-12 bg-gray-900/90 p-4 border-b border-gray-800 text-xs font-black uppercase text-gray-400">
                <div className="col-span-5">Característica / Capacidad</div>
                <div className="col-span-3 text-center text-red-400">ComunidadFeliz</div>
                <div className="col-span-4 text-center text-emerald-400 font-extrabold">MELSA Comunidades OS</div>
              </div>

              <div className="divide-y divide-gray-800 text-xs">
                {/* Row 1 */}
                <div className="grid grid-cols-12 p-4 items-center">
                  <div className="col-span-5">
                    <strong className="text-white block font-bold">Costo Mensual del Software</strong>
                    <span className="text-gray-400 text-[11px]">Tarifa fija por edificio de 60-100 dptos</span>
                  </div>
                  <div className="col-span-3 text-center text-red-400 font-bold">
                    2 a 8 UF ($80.000 - $320.000)
                  </div>
                  <div className="col-span-4 text-center text-emerald-400 font-black text-sm bg-emerald-500/10 py-1.5 rounded-xl border border-emerald-500/30">
                    0,8 a 1,2 UF ($33.000 - $49.000) <br />
                    <span className="text-[10px] text-emerald-300 font-bold">Ahorro de hasta 65%</span>
                  </div>
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-12 p-4 items-center">
                  <div className="col-span-5">
                    <strong className="text-white block font-bold">Red de Técnicos de Mantención SEC</strong>
                    <span className="text-gray-400 text-[11px]">Gasfitería, calderas, bombas, ascensores</span>
                  </div>
                  <div className="col-span-3 text-center text-gray-500">
                    <span className="text-red-400 font-bold">NO TIENE</span> <br />
                    <span className="text-[10px]">El admin debe buscar solo</span>
                  </div>
                  <div className="col-span-4 text-center text-emerald-400 font-bold">
                    <span className="text-white font-extrabold">RED PROPIA CERTIFICADA</span> <br />
                    <span className="text-[10px] text-gray-400">Técnicos SEC con seguro de garantía Melsa</span>
                  </div>
                </div>

                {/* Row 3 */}
                <div className="grid grid-cols-12 p-4 items-center">
                  <div className="col-span-5">
                    <strong className="text-white block font-bold">Avisos de Paquetería por WhatsApp</strong>
                    <span className="text-gray-400 text-[11px]">Notificación instantánea al residente</span>
                  </div>
                  <div className="col-span-3 text-center text-gray-400">
                    Costo adicional o plan superior
                  </div>
                  <div className="col-span-4 text-center text-emerald-400 font-bold">
                    100% Incluido sin costo extra
                  </div>
                </div>

                {/* Row 4 */}
                <div className="grid grid-cols-12 p-4 items-center">
                  <div className="col-span-5">
                    <strong className="text-white block font-bold">Cumplimiento Ley de Copropiedad 21.442</strong>
                    <span className="text-gray-400 text-[11px]">Cortes de luz Art. 20 y quórums fiscales</span>
                  </div>
                  <div className="col-span-3 text-center text-gray-300">
                    Cumplimiento estándar
                  </div>
                  <div className="col-span-4 text-center text-emerald-400 font-bold">
                    Automatizado con dictamen legal
                  </div>
                </div>

                {/* Row 5 */}
                <div className="grid grid-cols-12 p-4 items-center">
                  <div className="col-span-5">
                    <strong className="text-white block font-bold">Soporte Técnico en Terreno</strong>
                    <span className="text-gray-400 text-[11px]">Urgencias nocturnas o filtraciones graves</span>
                  </div>
                  <div className="col-span-3 text-center text-gray-500">
                    100% Remoto (Helpdesk)
                  </div>
                  <div className="col-span-4 text-center text-emerald-400 font-bold">
                    Mesa 24/7 y visita en terreno en RM y V Región
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* VIEW 5: CALCULATOR DETAILED BREAKDOWN                     */}
        {/* ========================================================== */}
        {activeSection === 'calculator' && (
          <div className="max-w-2xl mx-auto bg-[#12151B] border border-gray-800 rounded-3xl p-8 space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-black text-white">Calculadora de Ahorro para tu Comunidad</h2>
              <p className="text-xs text-gray-400">Comprueba cuánto dinero recupera tu edificio cambiando a MELSA Comunidades OS.</p>
            </div>

            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-300 font-bold">Total de Departamentos / Unidades:</span>
                  <span className="text-xl font-black text-[#D02126]">{calculatorUnits}</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="300"
                  step="5"
                  value={calculatorUnits}
                  onChange={(e) => setCalculatorUnits(Number(e.target.value))}
                  className="w-full accent-[#D02126] cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="p-4 rounded-2xl bg-gray-900 border border-gray-800">
                  <span className="text-[11px] text-gray-400 block">ComunidadFeliz al año:</span>
                  <span className="text-lg font-black text-red-400 line-through">
                    ${(cfPriceMonthlyCLP * 12).toLocaleString('es-CL')} CLP
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
                  <span className="text-[11px] text-emerald-300 block font-bold">MELSA Comunidades al año:</span>
                  <span className="text-lg font-black text-emerald-400">
                    ${(melsaPriceMonthlyCLP * 12).toLocaleString('es-CL')} CLP
                  </span>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-emerald-900/20 border border-emerald-500/40 text-center space-y-1">
                <span className="text-xs font-bold text-gray-300">Ahorro Neto Anual para la Comunidad:</span>
                <p className="text-3xl font-black text-emerald-400">
                  ${annualSavingsCLP.toLocaleString('es-CL')} CLP
                </p>
                <p className="text-[11px] text-gray-400">Suficiente para financiar la mantención de calderas o bombas de agua completas.</p>
              </div>

              <a
                href={`https://wa.me/56976652425?text=Hola,%20calcule%20un%20ahorro%20de%20${annualSavingsCLP}%20CLP%20para%20mi%20edificio%20de%20${calculatorUnits}%20unidades.%20Quiero%20activarlo.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 rounded-xl bg-[#D02126] hover:bg-[#B51C20] text-white font-black text-sm text-center block transition-all shadow-xl shadow-red-950/50 cursor-pointer"
              >
                Solicitar Demostración y Migración Gratuita desde ComunidadFeliz →
              </a>
            </div>
          </div>
        )}
      </main>

      {/* ============================================================== */}
      {/* FOOTER                                                         */}
      {/* ============================================================== */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-8 mt-20 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-[#D02126]" />
          <span className="text-gray-300 font-bold">MELSA Comunidades OS</span>
          <span>• Cumplimiento Certificado Ley 21.442 de Copropiedad Inmobiliaria</span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={onBackToHome} className="hover:text-white transition-colors cursor-pointer">
            Portal Melsa Inmobiliaria
          </button>
          <span>•</span>
          <a href="https://wa.me/56976652425" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">
            Soporte & Urgencias SEC: +56 9 7665 2425
          </a>
        </div>
      </footer>
    </div>
  );
};
