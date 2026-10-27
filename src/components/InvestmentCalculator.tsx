import React, { useState } from 'react';
import { 
  Cpu, 
  TrendingUp, 
  ShieldAlert, 
  Activity, 
  CheckCircle2, 
  Sliders, 
  Building2, 
  DollarSign, 
  Percent, 
  Info, 
  ArrowRight,
  Sparkles,
  BarChart3,
  Award,
  Zap
} from 'lucide-react';

interface ZoneData {
  name: string;
  baseCapRate: number;
  appreciationRate: number;
  demandIndex: string;
  riskLevel: 'Bajo' | 'Moderado' | 'Estratégico';
  drivers: string;
}

const ZONES_DATA: Record<string, ZoneData> = {
  'oriente': {
    name: 'Sector Oriente (Las Condes / Vitacura / Lo Barnechea)',
    baseCapRate: 5.4,
    appreciationRate: 6.8,
    demandIndex: 'Muy Alta (Vacancia < 3%)',
    riskLevel: 'Bajo',
    drivers: 'Zona de refugio patrimonial, alta plusvalía consolidada, demanda ejecutiva y diplomática internacional.',
  },
  'providencia': {
    name: 'Providencia / Ñuñoa (Corredor Urbano Central)',
    baseCapRate: 6.3,
    appreciationRate: 5.5,
    demandIndex: 'Inmediata (Absorción < 25 días)',
    riskLevel: 'Bajo',
    drivers: 'Alta densidad de profesionales jóvenes, excelente conectividad Metro y máxima liquidez de reventa.',
  },
  'costa': {
    name: 'Costa Premium (Concón / Reñaca / Zapallar)',
    baseCapRate: 6.9,
    appreciationRate: 7.2,
    demandIndex: 'Alta (Turismo & Residencia Segunda Vivienda)',
    riskLevel: 'Moderado',
    drivers: 'Demanda dual (renta temporal de verano y residencia ejecutiva teletrabajo), alta valorización de bordemar.',
  },
  'sur': {
    name: 'Zona Sur & Lagos (Puerto Varas / Frutillar / Pucón)',
    baseCapRate: 7.4,
    appreciationRate: 8.5,
    demandIndex: 'Creciente (Migración de alto patrimonio)',
    riskLevel: 'Estratégico',
    drivers: 'Escasez de suelo normado, fuerte migración de familias ABC1 y auge del ecoturismo premium.',
  },
  'norte': {
    name: 'Norte Costero (La Serena / Coquimbo)',
    baseCapRate: 6.7,
    appreciationRate: 5.2,
    demandIndex: 'Estable con peaks estacionales',
    riskLevel: 'Moderado',
    drivers: 'Crecimiento de servicios mineros y polos universitarios, excelente rentabilidad por m².',
  },
  'biobio': {
    name: 'Gran Concepción & Biobío (Concepción / San Pedro / Talcahuano)',
    baseCapRate: 6.8,
    appreciationRate: 5.8,
    demandIndex: 'Alta (Polo Universitario & Industrial)',
    riskLevel: 'Bajo',
    drivers: 'Gran polo industrial, universitario y portuario. Fuerte demanda de arriendo y rentabilidades netas sólidas.',
  },
  'antofagasta': {
    name: 'Norte Minero (Antofagasta / Calama)',
    baseCapRate: 7.2,
    appreciationRate: 6.4,
    demandIndex: 'Alta Ejecutiva (Contratos Mineros Corporativos)',
    riskLevel: 'Estratégico',
    drivers: 'Arriendos corporativos de alto valor por contratos de faenas mineras, ticket de arriendo superior al promedio nacional.',
  }
};

export const InvestmentCalculator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'viability' | 'stresstest' | 'prequalify'>('viability');

  // --- TAB 1: Melsa Viability Score States ---
  const [selectedZone, setSelectedZone] = useState<string>('oriente');
  const [assetType, setAssetType] = useState<string>('departamento');
  const [ticketPrice, setTicketPrice] = useState<number>(240000);
  const [timeHorizon, setTimeHorizon] = useState<number>(5);

  // Tab 1 dynamic computations
  const currentZone = ZONES_DATA[selectedZone];
  const assetMultiplier = assetType === 'departamento' ? 1.0 : assetType === 'casa' ? 0.95 : assetType === 'comercial' ? 1.15 : 1.25;
  const computedCapRate = Number((currentZone.baseCapRate * assetMultiplier).toFixed(2));
  const computedTIR = Number((computedCapRate + currentZone.appreciationRate * 0.9).toFixed(1));
  const estimatedAppreciationGain = Math.round(ticketPrice * (Math.pow(1 + currentZone.appreciationRate / 100, timeHorizon) - 1));
  
  // Algorithmic Viability Score (0-100)
  const baseScore = currentZone.riskLevel === 'Bajo' ? 88 : currentZone.riskLevel === 'Moderado' ? 84 : 89;
  const scoreBonus = computedCapRate > 6.0 ? 5 : 2;
  const viabilityScore = Math.min(98, baseScore + scoreBonus);

  // --- TAB 2: Stress Testing States ---
  const [stressPropertyPrice, setStressPropertyPrice] = useState<number>(220000);
  const [stressDownPaymentPercent, setStressDownPaymentPercent] = useState<number>(20);
  const [stressInterestRate, setStressInterestRate] = useState<number>(4.8);
  const [stressLoanYears, setStressLoanYears] = useState<number>(25);
  const [estimatedMonthlyRent, setEstimatedMonthlyRent] = useState<number>(1100);

  // Quick Macro Scenarios
  const applyScenario = (type: 'optimistic' | 'base' | 'stress') => {
    if (type === 'optimistic') {
      setStressInterestRate(3.9);
      setEstimatedMonthlyRent(Math.round(stressPropertyPrice * 0.0055));
    } else if (type === 'base') {
      setStressInterestRate(4.8);
      setEstimatedMonthlyRent(Math.round(stressPropertyPrice * 0.0049));
    } else {
      setStressInterestRate(6.8);
      setEstimatedMonthlyRent(Math.round(stressPropertyPrice * 0.0042));
    }
  };

  const stressDownPaymentAmount = (stressPropertyPrice * stressDownPaymentPercent) / 100;
  const stressLoanAmount = stressPropertyPrice - stressDownPaymentAmount;
  const stressMonthlyRate = stressInterestRate / 100 / 12;
  const stressTotalMonths = stressLoanYears * 12;

  const stressMonthlyDividend =
    stressMonthlyRate > 0
      ? (stressLoanAmount *
          (stressMonthlyRate * Math.pow(1 + stressMonthlyRate, stressTotalMonths))) /
        (Math.pow(1 + stressMonthlyRate, stressTotalMonths) - 1)
      : stressLoanAmount / stressTotalMonths;

  const monthlyNetCashflow = estimatedMonthlyRent - stressMonthlyDividend;
  const coverageRatio = Number(((estimatedMonthlyRent / (stressMonthlyDividend || 1)) * 100).toFixed(0));

  // --- TAB 3: Pre-Calificador Crediticio IA States ---
  const [monthlyIncome, setMonthlyIncome] = useState<number>(4500);
  const [savedSavings, setSavedSavings] = useState<number>(45000);
  const [employmentStatus, setEmploymentStatus] = useState<string>('indefinido');

  // Banking underwriting rules: Max 25-30% debt-to-income
  const maxSafeMonthlyPayment = Math.round(monthlyIncome * 0.28);
  // Max loan capacity with 4.8% rate at 25 yrs
  const maxLoanMultiplier = 160; 
  const estimatedMaxLoan = maxSafeMonthlyPayment * maxLoanMultiplier;
  const maxPropertyBudget = Math.round(estimatedMaxLoan + savedSavings);

  const officialWhatsApp = "56999899421";

  return (
    <section id="inteligencia-financiera" className="py-24 bg-[#0F1115] text-white relative overflow-hidden border-t border-b border-gray-800">
      
      {/* Background Decorative Grid and Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(#D02126_1px,transparent_1px)] [background-size:32px_32px] opacity-10 pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#D02126]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#D02126]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D02126]/15 border border-[#D02126]/40 text-[#D02126] text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm">
            <Cpu className="w-3.5 h-3.5 text-[#D02126] animate-pulse" />
            <span>Melsa Analytics & AI Engine</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif text-white font-normal tracking-tight mb-5">
            Centro de Inteligencia Financiera & Algoritmos Inmobiliarios
          </h2>
          <p className="text-gray-300 text-sm sm:text-base font-light leading-relaxed">
            Transformamos la compra e inversión tradicional en decisiones cuantitativas respaldadas por modelos de viabilidad, proyecciones de rentabilidad y simulaciones de riesgo macroeconómico.
          </p>
        </div>

        {/* Tab Selector Nav */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex flex-wrap justify-center p-1.5 bg-black/60 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl gap-1">
            <button
              onClick={() => setActiveTab('viability')}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'viability'
                  ? 'bg-[#D02126] text-white shadow-lg shadow-[#D02126]/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>1. Viability Score™ & TIR</span>
            </button>

            <button
              onClick={() => setActiveTab('stresstest')}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'stresstest'
                  ? 'bg-[#D02126] text-white shadow-lg shadow-[#D02126]/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>2. Stress Test Macroeconómico</span>
            </button>

            <button
              onClick={() => setActiveTab('prequalify')}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'prequalify'
                  ? 'bg-[#D02126] text-white shadow-lg shadow-[#D02126]/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>3. Pre-Calificador Crediticio</span>
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* TAB 1: VIABILITY SCORE & PLUSVALÍA                       */}
        {/* ======================================================== */}
        {activeTab === 'viability' && (
          <div className="bg-[#15181E] rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Input Parameters (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              <div>
                <span className="text-xs font-semibold text-[#D02126] uppercase tracking-wider block mb-1">
                  Parámetros de Entrada
                </span>
                <h3 className="text-xl font-serif text-white">Evaluación Cuantitativa de la Oportunidad</h3>
              </div>

              {/* Zone Selector */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                  Ubicación & Micro-Mercado
                </label>
                <select
                  value={selectedZone}
                  onChange={(e) => setSelectedZone(e.target.value)}
                  className="w-full bg-[#0F1115] border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-[#D02126] focus:border-transparent outline-none cursor-pointer"
                >
                  <option value="oriente">Sector Oriente (Las Condes / Vitacura / Lo Barnechea)</option>
                  <option value="providencia">Providencia / Ñuñoa (Corredor Urbano Central)</option>
                  <option value="costa">Costa Premium (Concón / Reñaca / Zapallar)</option>
                  <option value="biobio">Gran Concepción & Biobío (Concepción / San Pedro)</option>
                  <option value="sur">Zona Sur & Lagos (Puerto Varas / Frutillar / Pucón)</option>
                  <option value="norte">Norte Costero (La Serena / Coquimbo)</option>
                  <option value="antofagasta">Norte Minero (Antofagasta / Calama)</option>
                </select>
              </div>

              {/* Asset Type Selector */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                  Tipología de Activo Inmobiliario
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'departamento', label: 'Departamento' },
                    { id: 'casa', label: 'Casa / Townhouse' },
                    { id: 'comercial', label: 'Local / Oficina' },
                    { id: 'lote', label: 'Macrolote / Suelo' }
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setAssetType(item.id)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-medium border text-center transition-all cursor-pointer ${
                        assetType === item.id
                          ? 'bg-[#D02126]/20 border-[#D02126] text-white font-semibold'
                          : 'bg-[#0F1115] border-white/10 text-gray-400 hover:text-white hover:border-white/20'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ticket Price Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Ticket de Inversión Proyectado
                  </label>
                  <span className="text-lg font-bold text-white">
                    ${ticketPrice.toLocaleString('en-US')} USD
                  </span>
                </div>
                <input
                  type="range"
                  min={90000}
                  max={900000}
                  step={10000}
                  value={ticketPrice}
                  onChange={(e) => setTicketPrice(Number(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#D02126]"
                />
                <div className="flex justify-between text-[11px] text-gray-500 mt-1">
                  <span>$90,000 USD</span>
                  <span>$900,000 USD</span>
                </div>
              </div>

              {/* Time Horizon */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                  Horizonte de Desinversión / Maduración
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[3, 5, 10].map((years) => (
                    <button
                      key={years}
                      type="button"
                      onClick={() => setTimeHorizon(years)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-semibold border text-center transition-all cursor-pointer ${
                        timeHorizon === years
                          ? 'bg-[#D02126] border-[#D02126] text-white'
                          : 'bg-[#0F1115] border-white/10 text-gray-400 hover:text-white'
                      }`}
                    >
                      {years} Años
                    </button>
                  ))}
                </div>
              </div>

              {/* Algorithmic Qualitative Rationale */}
              <div className="bg-[#0F1115] p-4 rounded-2xl border border-white/10 text-xs text-gray-300 space-y-1.5">
                <div className="flex items-center gap-1.5 font-semibold text-white">
                  <Activity className="w-3.5 h-3.5 text-[#D02126]" />
                  <span>Drivers de Plusvalía Identificados por Algoritmo Melsa:</span>
                </div>
                <p className="leading-relaxed font-light">{currentZone.drivers}</p>
              </div>

            </div>

            {/* Scorecard Results (5 cols) */}
            <div className="lg:col-span-5 bg-gradient-to-b from-[#1C2028] to-[#121418] p-6 sm:p-8 rounded-3xl border border-[#D02126]/30 flex flex-col justify-between space-y-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#D02126]/10 rounded-full blur-2xl pointer-events-none" />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs text-red-300 font-semibold uppercase tracking-wider flex items-center gap-1">
                    <Award className="w-4 h-4 text-[#D02126]" /> Melsa Viability Index™
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#D02126]/20 text-[#D02126] border border-[#D02126]/40">
                    Clasificación A+
                  </span>
                </div>

                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-5xl font-serif font-bold text-white">{viabilityScore}</span>
                  <span className="text-xl text-gray-400 font-light">/ 100</span>
                </div>

                <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden mb-6">
                  <div
                    className="bg-gradient-to-r from-red-600 to-[#D02126] h-full rounded-full transition-all duration-700"
                    style={{ width: `${viabilityScore}%` }}
                  />
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 gap-3.5 mb-6">
                  <div className="bg-[#0F1115] p-3.5 rounded-xl border border-white/5">
                    <span className="text-[11px] text-gray-400 block mb-1">Cap Rate Bruto Anual</span>
                    <span className="text-lg font-bold text-emerald-400">~{computedCapRate}%</span>
                    <span className="text-[10px] text-gray-500 block">Flujo de arriendo</span>
                  </div>

                  <div className="bg-[#0F1115] p-3.5 rounded-xl border border-white/5">
                    <span className="text-[11px] text-gray-400 block mb-1">TIR Proyectada</span>
                    <span className="text-lg font-bold text-amber-400">~{computedTIR}%</span>
                    <span className="text-[10px] text-gray-500 block">Renta + Plusvalía</span>
                  </div>

                  <div className="bg-[#0F1115] p-3.5 rounded-xl border border-white/5">
                    <span className="text-[11px] text-gray-400 block mb-1">Plusvalía a {timeHorizon} años</span>
                    <span className="text-lg font-bold text-white">+${estimatedAppreciationGain.toLocaleString('en-US')} USD</span>
                    <span className="text-[10px] text-gray-500 block">+{currentZone.appreciationRate}% promedio/año</span>
                  </div>

                  <div className="bg-[#0F1115] p-3.5 rounded-xl border border-white/5">
                    <span className="text-[11px] text-gray-400 block mb-1">Perfil de Riesgo</span>
                    <span className="text-lg font-bold text-sky-400">{currentZone.riskLevel}</span>
                    <span className="text-[10px] text-gray-500 block">{currentZone.demandIndex}</span>
                  </div>
                </div>

              </div>

              {/* Action Button */}
              <a
                href={`https://wa.me/${officialWhatsApp}?text=${encodeURIComponent(
                  `Hola equipo Melsa, estuve revisando el Melsa Viability Index en su web para una inversión de $${ticketPrice.toLocaleString('en-US')} USD en ${currentZone.name} (${assetType}). Me gustaría agendar una reunión para ver oportunidades disponibles.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-xl bg-[#D02126] hover:bg-[#B81B1F] text-white font-semibold text-sm transition-all text-center flex items-center justify-center gap-2 shadow-lg shadow-[#D02126]/30"
              >
                <span>Solicitar Cartera Calificada para esta Zona</span>
                <ArrowRight className="w-4 h-4" />
              </a>

            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: STRESS TEST MACROECONÓMICO                         */}
        {/* ======================================================== */}
        {activeTab === 'stresstest' && (
          <div className="bg-[#15181E] rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-xs font-semibold text-[#D02126] uppercase tracking-wider block mb-1">
                  Simulación de Resiliencia Financiera
                </span>
                <h3 className="text-xl font-serif text-white">Stress Test de Tasas & Cobertura de Dividendo</h3>
                <p className="text-xs text-gray-400 mt-1 font-light">
                  Evalúa cómo reacciona tu flujo mensual ante fluctuaciones de la tasa de política monetaria y variaciones en el canon de arriendo.
                </p>
              </div>

              {/* Quick Scenario Buttons */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                  Probar Escenario Macroeconómico Inmediato:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => applyScenario('optimistic')}
                    className="p-3 rounded-xl bg-[#0F1115] hover:bg-emerald-950/40 border border-emerald-500/30 text-left transition-all cursor-pointer"
                  >
                    <span className="text-xs font-bold text-emerald-400 block">🟢 Expansivo / Favorable</span>
                    <span className="text-[11px] text-gray-400">Tasa 3.9% · Arriendo dinámico</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => applyScenario('base')}
                    className="p-3 rounded-xl bg-[#0F1115] hover:bg-blue-950/40 border border-blue-500/30 text-left transition-all cursor-pointer"
                  >
                    <span className="text-xs font-bold text-sky-400 block">🟡 Escenario Base Actual</span>
                    <span className="text-[11px] text-gray-400">Tasa 4.8% · Mercado normal</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => applyScenario('stress')}
                    className="p-3 rounded-xl bg-[#0F1115] hover:bg-red-950/40 border border-[#D02126]/50 text-left transition-all cursor-pointer"
                  >
                    <span className="text-xs font-bold text-red-400 block">🔴 Stress Test Extremo</span>
                    <span className="text-[11px] text-gray-400">Tasa 6.8% · Vacancia restrictiva</span>
                  </button>
                </div>
              </div>

              {/* Sliders Grid */}
              <div className="space-y-4 pt-2">
                
                {/* Property Price */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-gray-300">Valor de la Propiedad</label>
                    <span className="text-sm font-bold text-white">${stressPropertyPrice.toLocaleString('en-US')} USD</span>
                  </div>
                  <input
                    type="range"
                    min={90000}
                    max={600000}
                    step={10000}
                    value={stressPropertyPrice}
                    onChange={(e) => setStressPropertyPrice(Number(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#D02126]"
                  />
                </div>

                {/* Down Payment */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-gray-300">Pie / Enganche Inicial ({stressDownPaymentPercent}%)</label>
                    <span className="text-sm font-semibold text-[#D02126]">${stressDownPaymentAmount.toLocaleString('en-US')} USD</span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={50}
                    step={5}
                    value={stressDownPaymentPercent}
                    onChange={(e) => setStressDownPaymentPercent(Number(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#D02126]"
                  />
                </div>

                {/* Rate & Rent Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      Tasa de Interés Hipotecaria (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="2.5"
                      max="10.0"
                      value={stressInterestRate}
                      onChange={(e) => setStressInterestRate(Number(e.target.value))}
                      className="w-full bg-[#0F1115] border border-white/15 rounded-xl px-3 py-2 text-sm text-white focus:ring-2 focus:ring-[#D02126] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      Arriendo Mensual Estimado (USD/mes)
                    </label>
                    <input
                      type="number"
                      step="50"
                      min="200"
                      max="6000"
                      value={estimatedMonthlyRent}
                      onChange={(e) => setEstimatedMonthlyRent(Number(e.target.value))}
                      className="w-full bg-[#0F1115] border border-white/15 rounded-xl px-3 py-2 text-sm text-white focus:ring-2 focus:ring-[#D02126] outline-none"
                    />
                  </div>
                </div>

              </div>

            </div>

            {/* Stress Test Dashboard Results */}
            <div className="lg:col-span-5 bg-gradient-to-b from-[#1C2028] to-[#121418] p-6 sm:p-8 rounded-3xl border border-white/15 flex flex-col justify-between space-y-6">
              
              <div>
                <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider block mb-2">
                  Balance de Flujo Mensual
                </span>

                <div className="space-y-3 bg-[#0F1115] p-4 rounded-2xl border border-white/10 mb-4">
                  <div className="flex justify-between items-center text-xs text-gray-300">
                    <span>Dividendo Hipotecario Estimado:</span>
                    <span className="font-bold text-white">${Math.round(stressMonthlyDividend).toLocaleString('en-US')} USD</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-gray-300">
                    <span>Ingreso Proyectado por Arriendo:</span>
                    <span className="font-bold text-emerald-400">+${estimatedMonthlyRent.toLocaleString('en-US')} USD</span>
                  </div>
                  <div className="border-t border-white/10 pt-2 flex justify-between items-center">
                    <span className="text-xs font-semibold text-gray-200">Flujo de Caja Neto Mensual:</span>
                    <span className={`text-base font-bold ${monthlyNetCashflow >= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {monthlyNetCashflow >= 0 ? `+$${Math.round(monthlyNetCashflow)}` : `-$${Math.abs(Math.round(monthlyNetCashflow))}`} USD/mes
                    </span>
                  </div>
                </div>

                {/* Coverage Index Ratio */}
                <div className="p-4 rounded-2xl bg-[#0F1115] border border-white/10 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-300 font-medium">Índice de Cobertura (DSCR):</span>
                    <span className={`font-bold ${coverageRatio >= 100 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {coverageRatio}%
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-400 font-light leading-relaxed">
                    {coverageRatio >= 100 ? (
                      <span className="text-emerald-300">
                        ✓ Activo autofinanciado: El canon de renta supera el dividendo bancario, generando excedente mensual.
                      </span>
                    ) : (
                      <span className="text-amber-300">
                        ⚠ Co-pago requerido: Se requiere un aporte de bolsillo de ~${Math.abs(Math.round(monthlyNetCashflow))} USD/mes para amortizar la deuda de largo plazo.
                      </span>
                    )}
                  </div>
                </div>

              </div>

              <a
                href={`https://wa.me/${officialWhatsApp}?text=${encodeURIComponent(
                  `Hola Melsa, realicé un Stress Test financiero en su web para una propiedad de $${stressPropertyPrice.toLocaleString('en-US')} USD con dividendo de $${Math.round(stressMonthlyDividend)} USD. Quisiera evaluar alternativas con su área de gestión hipotecaria.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-xl bg-[#D02126] hover:bg-[#B81B1F] text-white font-semibold text-sm transition-all text-center block shadow-lg shadow-[#D02126]/30"
              >
                Diseñar Estructura de Financiamiento a Medida
              </a>

            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: PRE-CALIFICADOR CREDITICIO                         */}
        {/* ======================================================== */}
        {activeTab === 'prequalify' && (
          <div className="bg-[#15181E] rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-xs font-semibold text-[#D02126] uppercase tracking-wider block mb-1">
                  Scoring Financiero Inmediato
                </span>
                <h3 className="text-xl font-serif text-white">Pre-Calificador de Capacidad de Inversión</h3>
                <p className="text-xs text-gray-400 mt-1 font-light">
                  Aplica las pautas estándar del sistema bancario chileno e internacional para calcular tu ticket óptimo de compra sin sobre-endeudarte.
                </p>
              </div>

              {/* Monthly Income */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Ingreso Mensual Líquido Familiar
                  </label>
                  <span className="text-lg font-bold text-white">
                    ${monthlyIncome.toLocaleString('en-US')} USD
                  </span>
                </div>
                <input
                  type="range"
                  min={1500}
                  max={15000}
                  step={250}
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#D02126]"
                />
                <div className="flex justify-between text-[11px] text-gray-500 mt-1">
                  <span>$1,500 USD (~1.4M CLP)</span>
                  <span>$15,000 USD (~14M CLP)</span>
                </div>
              </div>

              {/* Savings Available for Down Payment */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Ahorro o Liquidez Disponible para Pie / Enganche
                  </label>
                  <span className="text-lg font-bold text-[#D02126]">
                    ${savedSavings.toLocaleString('en-US')} USD
                  </span>
                </div>
                <input
                  type="range"
                  min={10000}
                  max={150000}
                  step={2500}
                  value={savedSavings}
                  onChange={(e) => setSavedSavings(Number(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#D02126]"
                />
              </div>

              {/* Employment Profile */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                  Tipo de Actividad Laboral / Perfil Tributario
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {[
                    { id: 'indefinido', label: 'Empleado Contrato Indefinido' },
                    { id: 'independiente', label: 'Profesional Independiente' },
                    { id: 'empresario', label: 'Socio / Empresa / Rentista' }
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setEmploymentStatus(item.id)}
                      className={`p-3 rounded-xl text-xs font-medium border text-left transition-all cursor-pointer ${
                        employmentStatus === item.id
                          ? 'bg-[#D02126]/20 border-[#D02126] text-white font-semibold'
                          : 'bg-[#0F1115] border-white/10 text-gray-400 hover:text-white'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-400 bg-[#0F1115] p-3 rounded-xl border border-white/10">
                <Info className="w-4 h-4 text-[#D02126] shrink-0" />
                <span>
                  Melsa mantiene alianzas directas con bancos e instituciones mutuas para tramitar tu pre-aprobación con tasas preferenciales.
                </span>
              </div>

            </div>

            {/* Prequalification Results */}
            <div className="lg:col-span-5 bg-gradient-to-b from-[#1C2028] to-[#121418] p-6 sm:p-8 rounded-3xl border border-[#D02126]/40 flex flex-col justify-between space-y-6">
              
              <div>
                <span className="text-xs text-red-300 font-semibold uppercase tracking-wider block mb-1">
                  Diagnóstico Financiero Preliminar
                </span>
                
                <div className="my-3">
                  <span className="text-xs text-gray-400 block mb-0.5">Capacidad Máxima de Compra Recomendada:</span>
                  <div className="text-4xl font-serif font-bold text-white">
                    ${maxPropertyBudget.toLocaleString('en-US')} <span className="text-sm font-sans font-normal text-gray-400">USD</span>
                  </div>
                </div>

                <div className="space-y-2.5 border-t border-white/10 pt-4 text-xs">
                  <div className="flex justify-between items-center text-gray-300">
                    <span>Dividendo mensual máx. seguro:</span>
                    <span className="font-semibold text-white">${maxSafeMonthlyPayment.toLocaleString('en-US')} USD</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-300">
                    <span>Monto de crédito estimado:</span>
                    <span className="font-semibold text-white">${estimatedMaxLoan.toLocaleString('en-US')} USD</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-300">
                    <span>Proporción de financiamiento:</span>
                    <span className="font-semibold text-emerald-400">
                      {Math.round((estimatedMaxLoan / maxPropertyBudget) * 100)}% Crédito / {Math.round((savedSavings / maxPropertyBudget) * 100)}% Pie
                    </span>
                  </div>
                </div>

                <div className="mt-5 p-3.5 bg-[#0F1115] rounded-xl border border-white/10 text-xs space-y-1">
                  <span className="font-semibold text-white block">Sugerencia de Inventario Melsa:</span>
                  <p className="text-gray-400 font-light text-[11px] leading-relaxed">
                    Tu perfil califica con holgura para unidades 1D+1B y 2D+2B en Santiago Oriente, Providencia o proyectos con pago de pie en cuotas en Puerto Varas.
                  </p>
                </div>
              </div>

              <a
                href={`https://wa.me/${officialWhatsApp}?text=${encodeURIComponent(
                  `Hola Melsa, completé el Pre-Calificador Financiero en su web con un ingreso de $${monthlyIncome.toLocaleString('en-US')} USD y pie de $${savedSavings.toLocaleString('en-US')} USD (presupuesto $${maxPropertyBudget.toLocaleString('en-US')} USD). Me gustaría gestionar mi pre-aprobación y conocer propiedades que calcen con mi presupuesto.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-xl bg-[#D02126] hover:bg-[#B81B1F] text-white font-semibold text-sm transition-all text-center flex items-center justify-center gap-2 shadow-lg shadow-[#D02126]/30"
              >
                <Zap className="w-4 h-4" />
                <span>Solicitar Pre-Aprobación Bancaria con Melsa</span>
              </a>

            </div>

          </div>
        )}

      </div>
    </section>
  );
};
