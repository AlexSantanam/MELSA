import React, { useState } from 'react';
import { 
  Building2, 
  CheckCircle2, 
  Sparkles, 
  FileText, 
  DollarSign, 
  Wrench, 
  ArrowRight, 
  Zap, 
  Clock, 
  TrendingUp, 
  ShieldCheck, 
  Users, 
  Calculator,
  MessageCircle,
  HelpCircle,
  Laptop,
  Check
} from 'lucide-react';
import { AGENCY_SAAS_PLANS } from '../data/mockData';
import { AgencyPlanTier, AgencySaaSPlan } from '../types';

interface AgencySaaSSectionProps {
  onOpenIntranetModal?: () => void;
  onSelectPlan?: (plan: AgencyPlanTier) => void;
}

export const AgencySaaSSection: React.FC<AgencySaaSSectionProps> = ({
  onOpenIntranetModal,
  onSelectPlan
}) => {
  const [selectedBilling, setSelectedBilling] = useState<'monthly' | 'annual'>('monthly');

  // Interactive Live Settlement Simulator State
  const [simRentCLP, setSimRentCLP] = useState(850000);
  const [simCommissionPct, setSimCommissionPct] = useState(8);
  const [simMaintenanceCLP, setSimMaintenanceCLP] = useState(45000);
  const [simExpensesCLP, setSimExpensesCLP] = useState(0);
  const [simSuccessAlert, setSimSuccessAlert] = useState(false);

  // Calculations
  const commissionAmount = Math.round(simRentCLP * (simCommissionPct / 100));
  const totalDeductions = commissionAmount + simMaintenanceCLP + simExpensesCLP;
  const netOwnerTransfer = Math.max(0, simRentCLP - totalDeductions);

  const formatCLP = (val: number) => {
    return '$' + Math.round(val).toLocaleString('es-CL');
  };

  const handleCtaPlan = (planId: AgencyPlanTier) => {
    if (onSelectPlan) {
      onSelectPlan(planId);
    } else if (onOpenIntranetModal) {
      onOpenIntranetModal();
    } else {
      const msg = encodeURIComponent(`Hola Melsa, deseo contratar el software para agencias en el plan: ${planId.toUpperCase()}`);
      window.open(`https://wa.me/56999899421?text=${msg}`, '_blank');
    }
  };

  return (
    <section id="software-agencias" className="py-24 bg-gradient-to-b from-white via-[#FAF9F8] to-gray-50 border-t border-gray-100 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#D02126]/5 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gray-900/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Tag & Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D02126]/10 text-[#D02126] text-xs font-bold tracking-wide uppercase mb-4">
            <Zap className="w-3.5 h-3.5" />
            <span>Nuevo • MELSA Agency OS</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#0F1115] tracking-tight font-serif-title leading-tight">
            El Software Inmobiliario para <span className="text-[#D02126]">Agencias & Corredoras</span> de Chile
          </h2>
          
          <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
            Menos es más: dile adiós a las planillas de Excel desordenadas y al software engorroso. 
            Administra <span className="font-semibold text-gray-900">Arriendos, Cobranzas automáticas, Reajustes IPC/UF, Ventas y Mantenciones con Sello Melsa</span> desde un único panel intuitivo.
          </p>
        </div>

        {/* 6 Core Pillars of Value (Superando a Altenda) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          
          {/* Pillar 1 */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-red-50 text-[#D02126] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Control de Arriendos & IPC</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Cálculo automático de reajustes por variación de la UF y el IPC del INE. Historial de contratos, vencimientos y ocupación siempre al día.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <MessageCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Cobranzas Multicanal Automáticas</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Recordatorios programados por <strong>WhatsApp, SMS y Correo Electrónico</strong>. Reduce la morosidad a cero sin pasar horas cobrando por teléfono.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <DollarSign className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Liquidaciones a Propietarios en 1 Clic</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Descuento automático de comisiones de administración, gastos comunes y comprobantes oficiales en PDF listos para transferir al banco del dueño.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Portales de Clientes (Dueño & Arrendatario)</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Acceso transparente 24/7: el propietario revisa sus liquidaciones históricas y el arrendatario consulta sus fechas de pago y contratos firmados.
            </p>
          </div>

          {/* Pillar 5 */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Pipeline CRM de Ventas</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Embudo visual desde la captación hasta la promesa y escritura. Coordinación de visitas comerciales y reparto transparente de comisiones de equipo.
            </p>
          </div>

          {/* Pillar 6 (Exclusivo Melsa) */}
          <div className="bg-white rounded-2xl p-6 border-2 border-[#D02126]/30 shadow-sm hover:shadow-md transition-all duration-300 group relative">
            <div className="absolute -top-3 right-4 px-2 py-0.5 rounded-full bg-[#D02126] text-white text-[10px] font-bold tracking-wider uppercase">
              Exclusivo Melsa
            </div>
            <div className="w-12 h-12 rounded-xl bg-red-50 text-[#D02126] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Wrench className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Reparaciones "Sello Melsa"</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              ¿Fuga de gas o cañería rota? Asigna con 1 clic técnicos auditados SEC de la red Melsa y descuenta el gasto en la liquidación del dueño.
            </p>
          </div>

        </div>

        {/* Interactive Live Settlement Demo Box */}
        <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xl overflow-hidden mb-24">
          <div className="bg-[#0F1115] text-white px-6 sm:px-10 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#D02126]">
                <Calculator className="w-4 h-4" />
                <span>Simulador en Vivo</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-serif-title mt-1">
                Prueba el Motor de Liquidaciones al Propietario
              </h3>
            </div>
            <span className="text-xs text-gray-400 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
              Así de simple es pagarle a tus dueños cada mes
            </span>
          </div>

          <div className="p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Inputs Column */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Rent Amount Slider */}
              <div>
                <div className="flex justify-between text-sm font-semibold text-gray-700 mb-2">
                  <span>Canon de Arriendo Mensual:</span>
                  <span className="text-base font-bold text-[#D02126]">{formatCLP(simRentCLP)}</span>
                </div>
                <input 
                  type="range"
                  min={300000}
                  max={2500000}
                  step={20000}
                  value={simRentCLP}
                  onChange={(e) => setSimRentCLP(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#D02126]"
                />
                <div className="flex justify-between text-[11px] text-gray-400 mt-1">
                  <span>$300.000</span>
                  <span>$1.400.000</span>
                  <span>$2.500.000</span>
                </div>
              </div>

              {/* Commission Percentage */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Comisión Agencia (%)
                  </label>
                  <div className="flex items-center gap-2">
                    {[6, 7.5, 8, 10].map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => setSimCommissionPct(pct)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          simCommissionPct === pct 
                            ? 'bg-[#D02126] text-white shadow-sm' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {pct}%
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Mantención Sello Melsa (Opcional)
                  </label>
                  <select
                    value={simMaintenanceCLP}
                    onChange={(e) => setSimMaintenanceCLP(Number(e.target.value))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium text-gray-800 focus:outline-none focus:border-[#D02126]"
                  >
                    <option value={0}>Sin reparaciones este mes ($0)</option>
                    <option value={35000}>Reparación Gasfitería ($35.000)</option>
                    <option value={45000}>Mantención Calefont / SEC ($45.000)</option>
                    <option value={60000}>Cambio Cerradura Digital ($60.000)</option>
                  </select>
                </div>
              </div>

              {/* Additional Notes */}
              <div className="bg-amber-50/80 border border-amber-200/60 rounded-xl p-3 text-xs text-amber-800 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  El sistema genera automáticamente el comprobante en PDF con tu logo corporativo y envía la notificación al WhatsApp del propietario.
                </span>
              </div>

            </div>

            {/* Receipt Preview Box */}
            <div className="lg:col-span-5 bg-[#FAF9F8] rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400">Comprobante de Liquidación</span>
                  <p className="text-xs font-semibold text-gray-800">Depto 1402, Las Condes</p>
                </div>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded">
                  Listo para Transferir
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Canon de Arriendo Cobrado:</span>
                  <span className="font-semibold text-gray-900">{formatCLP(simRentCLP)}</span>
                </div>

                <div className="flex justify-between text-red-600">
                  <span>Comisión Agencia ({simCommissionPct}%):</span>
                  <span>- {formatCLP(commissionAmount)}</span>
                </div>

                {simMaintenanceCLP > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span>Mantención Sello Melsa:</span>
                    <span>- {formatCLP(simMaintenanceCLP)}</span>
                  </div>
                )}

                <div className="border-t-2 border-dashed border-gray-300 pt-3 mt-3 flex justify-between items-center">
                  <div>
                    <span className="text-xs uppercase font-bold text-gray-500 block">Líquido al Dueño:</span>
                    <span className="text-[10px] text-gray-400">Banco Santander Cta Cte</span>
                  </div>
                  <span className="text-xl sm:text-2xl font-black text-emerald-600">
                    {formatCLP(netOwnerTransfer)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSimSuccessAlert(true);
                  setTimeout(() => setSimSuccessAlert(false), 4000);
                }}
                className="w-full mt-6 bg-[#0F1115] hover:bg-black text-white text-xs font-bold py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <FileText className="w-4 h-4 text-[#D02126]" />
                <span>Simular Emisión de Liquidación PDF</span>
              </button>

              {simSuccessAlert && (
                <p className="text-[11px] text-center text-emerald-600 font-medium mt-2 animate-in fade-in">
                  ✓ ¡Liquidación generada con éxito con respaldo de boleta y RUT del propietario!
                </p>
              )}
            </div>

          </div>
        </div>

        {/* Pricing Tiers Section ("Menos es más") */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#D02126] mb-2">
            <span>Precios Transparentes & Justos</span>
          </div>
          <h3 className="text-2xl sm:text-4xl font-extrabold text-[#0F1115] font-serif-title">
            Planes Diseñados para Crecer Sin Sobrecostos
          </h3>
          <p className="mt-2 text-sm sm:text-base text-gray-600">
            Comienza gratis con tus primeros arriendos y escala según el tamaño de tu cartera. Sin contratos forzosos.
          </p>
        </div>

        {/* 4 Plans Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch mb-16">
          {AGENCY_SAAS_PLANS.map((plan: AgencySaaSPlan) => {
            const isPopular = plan.popular;

            return (
              <div
                key={plan.id}
                className={`rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 relative ${
                  isPopular 
                    ? 'bg-white border-2 border-[#D02126] shadow-xl shadow-red-500/10 scale-100 lg:-translate-y-2' 
                    : 'bg-white border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md'
                }`}
              >
                {/* Badge if Popular */}
                {plan.badge && (
                  <div className={`absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase shadow-sm ${
                    isPopular ? 'bg-[#D02126] text-white' : 'bg-[#0F1115] text-white'
                  }`}>
                    {plan.badge}
                  </div>
                )}

                <div>
                  {/* Plan Name & Tagline */}
                  <h4 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h4>
                  <p className="text-xs text-gray-500 min-h-[32px] leading-relaxed mb-4">{plan.description}</p>

                  {/* Price */}
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
                      {plan.priceFormatted}
                    </span>
                    <span className="text-xs font-semibold text-gray-500">CLP</span>
                  </div>
                  <span className="text-[11px] text-gray-400 block mb-6">{plan.billingPeriod}</span>

                  {/* Limit Pill */}
                  <div className="bg-gray-50 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 border border-gray-100 mb-6 flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-[#D02126]" />
                    <span>{plan.propertiesLimit}</span>
                  </div>

                  {/* Features List */}
                  <div className="space-y-3 mb-8">
                    {plan.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-gray-600">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action CTA Button */}
                <div>
                  <button
                    onClick={() => handleCtaPlan(plan.id)}
                    className={`w-full py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-sm ${
                      isPopular
                        ? 'bg-[#D02126] hover:bg-[#B81B1F] text-white hover:shadow-lg hover:shadow-red-500/25'
                        : plan.id === 'gratis'
                        ? 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                        : 'bg-[#0F1115] hover:bg-black text-white'
                    }`}
                  >
                    <span>{plan.ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <span className="text-[10px] text-gray-400 text-center block mt-2">
                    Sin contrato de permanencia • Cancela cuando quieras
                  </span>
                </div>

              </div>
            );
          })}
        </div>

        {/* Direct WhatsApp Concierge for Agencies */}
        <div className="bg-gradient-to-r from-[#0F1115] to-[#1A1E27] rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 border border-white/10 shadow-2xl">
          <div className="max-w-2xl">
            <span className="text-xs font-bold text-[#D02126] uppercase tracking-wider block mb-2">
              Atención Personalizada para Agencias
            </span>
            <h4 className="text-2xl sm:text-3xl font-bold font-serif-title">
              ¿Administras más de 100 propiedades o necesitas migrar tu cartera desde Excel?
            </h4>
            <p className="mt-2 text-sm text-gray-300 leading-relaxed">
              Nuestro equipo técnico realiza la migración de tu base de datos de propietarios y contratos sin costo adicional y te capacita en menos de 24 horas.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 shrink-0 w-full md:w-auto">
            <a
              href="https://wa.me/56999899421?text=Hola%20Melsa,%20deseo%20una%20demostraci%C3%B3n%20del%20Software%20SaaS%20para%20Agencias"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white text-sm font-bold shadow-lg transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Solicitar Demo por WhatsApp</span>
            </a>
            <button
              onClick={onOpenIntranetModal}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-semibold border border-white/20 transition-all cursor-pointer"
            >
              <Laptop className="w-4 h-4" />
              <span>Crear Cuenta de Agencia</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
