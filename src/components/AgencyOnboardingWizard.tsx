import React, { useState } from 'react';
import { 
  Building2, 
  Mail, 
  Phone, 
  CreditCard, 
  UploadCloud, 
  Palette, 
  CheckCircle2, 
  ArrowRight, 
  FileText, 
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Check,
  Copy,
  Users,
  Zap,
  Globe,
  Landmark,
  Layers,
  Lock
} from 'lucide-react';
import { AuthUser, AgencyOnboardingData, AgencyPlanTier } from '../types';
import { MelsaLogo } from './MelsaLogo';

interface AgencyOnboardingWizardProps {
  currentUser: AuthUser;
  onComplete: (data: AgencyOnboardingData) => void;
  onSkip: () => void;
  initialData?: Partial<AgencyOnboardingData>;
}

export const AgencyOnboardingWizard: React.FC<AgencyOnboardingWizardProps> = ({
  currentUser,
  onComplete,
  onSkip,
  initialData
}) => {
  // Plan limits
  const planLimits: { [k in AgencyPlanTier]: number } = {
    gratis: 3,
    basico: 15,
    intermedio: 50,
    pro: 9999
  };
  const propertiesLimit = planLimits[currentUser.agencyPlan || 'basico'] || 15;

  // Active section tab: 'identity' | 'banking' | 'portals'
  const [activeSection, setActiveSection] = useState<'identity' | 'banking' | 'portals'>('identity');

  // 1. Legal & Contact Info
  const [companyName, setCompanyName] = useState(initialData?.companyName || currentUser.companyName || 'Los Pinos Gestión Inmobiliaria');
  const [companyRut, setCompanyRut] = useState(initialData?.companyRut || '15.883.974-1');
  const [legalAddress, setLegalAddress] = useState(initialData?.legalAddress || 'Los Pinos 356, Las Condes');
  const [legalRepresentative, setLegalRepresentative] = useState(initialData?.legalRepresentative || currentUser.name || 'Alexis Rassmusen');
  const [contactEmail, setContactEmail] = useState(initialData?.contactEmail || currentUser.email || 'alexis.s.m@gmail.com');
  const [contactPhone, setContactPhone] = useState(initialData?.contactPhone || '+56 9 7388 8336');

  // 2. Bank Account & Settlements
  const [bankAccountHolder, setBankAccountHolder] = useState(initialData?.bankAccountHolder || 'Los Pinos SpA');
  const [bankAccountHolderRut, setBankAccountHolderRut] = useState(initialData?.bankAccountHolderRut || '15.883.974-1');
  const [bankName, setBankName] = useState(initialData?.bankName || 'Banco Santander Chile');
  const [bankAccountType, setBankAccountType] = useState(initialData?.bankAccountType || 'Cuenta Corriente');
  const [bankAccountNumber, setBankAccountNumber] = useState(initialData?.bankAccountNumber || '84-938210-4');
  const [receiptEmail, setReceiptEmail] = useState(initialData?.receiptEmail || currentUser.email || 'alexis.s.m@gmail.com');
  const [bankTransferActive, setBankTransferActive] = useState(true);
  const [webpayActive, setWebpayActive] = useState(true);

  // 3. Portals, Team & Tools
  const [portalName, setPortalName] = useState(initialData?.portalName || 'Los Pinos');
  const [portalPrimaryColor, setPortalPrimaryColor] = useState(initialData?.portalPrimaryColor || '#0F1115');
  const [portalAccentColor, setPortalAccentColor] = useState(initialData?.portalAccentColor || '#D02126');
  const [portalLogoUrl, setPortalLogoUrl] = useState<string | undefined>(initialData?.portalLogoUrl);
  const [importedCount, setImportedCount] = useState<number>(initialData?.importedCount || 3);
  
  // Team Member (optional)
  const [teamMemberName, setTeamMemberName] = useState('');
  const [teamMemberEmail, setTeamMemberEmail] = useState('');
  const [teamMemberRole, setTeamMemberRole] = useState<'Colaborador' | 'Administrador'>('Colaborador');

  // Additional settings
  const [monthlyFeePercent] = useState<number>(initialData?.monthlyFeePercent || 7);
  const [placementFeePercent] = useState<number>(initialData?.placementFeePercent || 50);
  const [salesCommissionPercent] = useState<number>(initialData?.salesCommissionPercent || 2);
  const [reminderDaysBefore] = useState<number>(initialData?.reminderDaysBefore || 3);
  const [enableWhatsAppReminders] = useState<boolean>(initialData?.enableWhatsAppReminders ?? true);
  const [enableEmailReminders] = useState<boolean>(initialData?.enableEmailReminders ?? true);

  // Copy link notifications
  const [copiedPayNotice, setCopiedPayNotice] = useState(false);
  const [copiedOwnerNotice, setCopiedOwnerNotice] = useState(false);
  const [autofillSuccessNotice, setAutofillSuccessNotice] = useState(false);

  // Complete and launch
  const handleFinish = () => {
    const finalData: AgencyOnboardingData = {
      companyName,
      companyRut,
      legalAddress,
      legalRepresentative,
      contactEmail,
      contactPhone,
      bankAccountHolder,
      bankAccountHolderRut,
      bankName,
      bankAccountType,
      bankAccountNumber,
      receiptEmail,
      importedCount,
      propertiesLimit,
      portalName,
      portalPrimaryColor,
      portalAccentColor,
      portalLogoUrl,
      monthlyFeePercent,
      placementFeePercent,
      salesCommissionPercent,
      reminderDaysBefore,
      enableWhatsAppReminders,
      enableEmailReminders,
      isCompleted: true
    };

    try {
      localStorage.setItem('melsa_agency_onboarding_completed', 'true');
      localStorage.setItem('melsa_agency_onboarding_data', JSON.stringify(finalData));
    } catch (e) {
      console.warn('Error saving onboarding data:', e);
    }

    onComplete(finalData);
  };

  // Smart Autofill simulation
  const handleSmartAutofill = () => {
    setCompanyName('Inmobiliaria & Corretaje Los Pinos SpA');
    setCompanyRut('76.890.140-5');
    setLegalAddress('Av. Apoquindo 4400, Oficina 802, Las Condes');
    setLegalRepresentative('Alexis Santana M.');
    setContactEmail('contacto@lospinospropiedades.cl');
    setContactPhone('+56 9 9123 4567');
    setBankAccountHolder('Inmobiliaria & Corretaje Los Pinos SpA');
    setBankAccountHolderRut('76.890.140-5');
    setBankName('Banco de Chile');
    setBankAccountType('Cuenta Corriente');
    setBankAccountNumber('00-142-99014');
    setPortalName('Los Pinos Propiedades');
    setAutofillSuccessNotice(true);
    setTimeout(() => setAutofillSuccessNotice(false), 4000);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F8] text-[#0F1115] flex flex-col justify-between py-6 px-4 sm:px-8 font-sans">
      
      {/* Top Header */}
      <header className="max-w-5xl mx-auto w-full flex items-center justify-between pb-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <MelsaLogo isLight={false} className="h-8" />
          <div className="hidden sm:block border-l border-gray-200 pl-3">
            <span className="text-xs font-extrabold tracking-tight text-[#0F1115] block">Centro de Activación</span>
            <span className="text-[10px] text-gray-400 block">Workspace OS para Corredoras</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSmartAutofill}
            className="px-3.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-[#D02126] font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5 border border-rose-200/60"
            title="Autocompletar con datos de ejemplo"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>⚡ Autocompletar con RUT</span>
          </button>

          <button
            onClick={onSkip}
            className="text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
          >
            Omitir y configurar después →
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto w-full my-6 space-y-6">
        
        {/* Hero Title & Status Card */}
        <div className="bg-gradient-to-r from-[#0F1115] via-[#1A181C] to-[#0F1115] rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-[#D02126]/30">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#D02126] text-white">
                Activación Inteligente
              </span>
              <span className="text-xs text-rose-300 font-medium">Configuración de un solo vistazo</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Configura tu Ecosistema Inmobiliario
            </h1>
            <p className="text-xs text-gray-300 leading-relaxed">
              En lugar de llenar 8 formularios lentos, revisa estos 3 módulos esenciales. Tus portales de cobro, contratos y enlaces se activarán de inmediato.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xs p-5 rounded-2xl border border-white/10 flex flex-col justify-between w-full md:w-64 shrink-0 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-300 font-semibold">Score de Preparación:</span>
              <span className="font-mono font-bold text-emerald-400 text-sm">88% Listo</span>
            </div>
            <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-[#D02126] to-emerald-400 h-full rounded-full w-[88%]" />
            </div>
            <div className="text-[10px] text-gray-300 flex items-center justify-between pt-1">
              <span>✓ Ley 19.799</span>
              <span>✓ Portales API</span>
              <span>✓ Copilot IA</span>
            </div>
          </div>
        </div>

        {autofillSuccessNotice && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 font-semibold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>¡Datos de tu corredora y cuenta bancaria autocompletados con éxito mediante consulta fiscal!</span>
          </div>
        )}

        {/* 3 Unified Tabs Navigation */}
        <div className="flex border-b border-gray-200 text-xs font-semibold">
          <button
            onClick={() => setActiveSection('identity')}
            className={`py-3 px-5 border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeSection === 'identity'
                ? 'border-[#D02126] text-[#D02126] font-bold bg-white rounded-t-xl'
                : 'border-transparent text-gray-500 hover:text-[#0F1115]'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>1. Identidad de tu Corredora</span>
          </button>
          
          <button
            onClick={() => setActiveSection('banking')}
            className={`py-3 px-5 border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeSection === 'banking'
                ? 'border-[#D02126] text-[#D02126] font-bold bg-white rounded-t-xl'
                : 'border-transparent text-gray-500 hover:text-[#0F1115]'
            }`}
          >
            <Landmark className="w-4 h-4" />
            <span>2. Canales de Cobro & Banco</span>
          </button>

          <button
            onClick={() => setActiveSection('portals')}
            className={`py-3 px-5 border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeSection === 'portals'
                ? 'border-[#D02126] text-[#D02126] font-bold bg-white rounded-t-xl'
                : 'border-transparent text-gray-500 hover:text-[#0F1115]'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>3. Portales, Equipo & Firma</span>
          </button>
        </div>

        {/* ============================================================ */}
        {/* SECTION 1: IDENTIDAD DE TU CORREDORA (LEGAL & CONTACTO)      */}
        {/* ============================================================ */}
        {activeSection === 'identity' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-2xs space-y-6 animate-in fade-in duration-150">
            <div>
              <h3 className="text-base font-bold text-[#0F1115]">
                Información Legal y Comercial de tu Corredora
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Estos datos identificarán automáticamente tus contratos de arriendo, promesas de compraventa y liquidaciones.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Razón Social o Nombre Comercial *</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="ej. Los Pinos Propiedades SpA"
                  className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-[#0F1115] focus:outline-none focus:border-[#D02126]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">RUT de la Corredora *</label>
                <input
                  type="text"
                  value={companyRut}
                  onChange={(e) => setCompanyRut(e.target.value)}
                  placeholder="15.883.974-1"
                  className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-mono text-[#0F1115] focus:outline-none focus:border-[#D02126]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Domicilio Legal / Oficina *</label>
                <input
                  type="text"
                  value={legalAddress}
                  onChange={(e) => setLegalAddress(e.target.value)}
                  placeholder="ej. Los Pinos 356, Las Condes"
                  className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-[#0F1115] focus:outline-none focus:border-[#D02126]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Representante Legal *</label>
                <input
                  type="text"
                  value={legalRepresentative}
                  onChange={(e) => setLegalRepresentative(e.target.value)}
                  placeholder="ej. Alexis Santana M."
                  className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-[#0F1115] focus:outline-none focus:border-[#D02126]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Correo Electrónico de Contacto *</label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="contacto@corredora.cl"
                  className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-[#0F1115] focus:outline-none focus:border-[#D02126]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Teléfono Móvil / WhatsApp Comercial *</label>
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="+56 9 7388 8336"
                  className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-[#0F1115] focus:outline-none focus:border-[#D02126]"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setActiveSection('banking')}
                className="px-5 py-2.5 rounded-xl bg-[#0F1115] hover:bg-black text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>Siguiente: Cuentas y Cobranzas</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* SECTION 2: CANALES DE COBRO & CUENTA BANCARIA                */}
        {/* ============================================================ */}
        {activeSection === 'banking' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-2xs space-y-6 animate-in fade-in duration-150">
            <div>
              <h3 className="text-base font-bold text-[#0F1115]">
                Canales de Recaudación y Cuenta de Abonos
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Define la cuenta bancaria donde tus arrendatarios transferirán o pagarán en línea los cánones mensuales.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Banco Receptor *</label>
                <select
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-[#0F1115] focus:outline-none focus:border-[#D02126] cursor-pointer"
                >
                  <option value="Banco Santander Chile">Banco Santander Chile</option>
                  <option value="Banco de Chile / Edwards">Banco de Chile / Edwards</option>
                  <option value="Banco BCI">Banco BCI</option>
                  <option value="BancoEstado">BancoEstado</option>
                  <option value="Banco Scotiabank">Banco Scotiabank</option>
                  <option value="Banco Itaú">Banco Itaú</option>
                  <option value="Banco BICE">Banco BICE</option>
                  <option value="Banco Security">Banco Security</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Tipo de Cuenta *</label>
                <select
                  value={bankAccountType}
                  onChange={(e) => setBankAccountType(e.target.value)}
                  className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-[#0F1115] focus:outline-none focus:border-[#D02126] cursor-pointer"
                >
                  <option value="Cuenta Corriente">Cuenta Corriente</option>
                  <option value="Cuenta Vista / RUT">Cuenta Vista / RUT</option>
                  <option value="Cuenta de Ahorro">Cuenta de Ahorro</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Número de Cuenta *</label>
                <input
                  type="text"
                  value={bankAccountNumber}
                  onChange={(e) => setBankAccountNumber(e.target.value)}
                  placeholder="ej. 84-938210-4"
                  className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-mono text-[#0F1115] focus:outline-none focus:border-[#D02126]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Titular de la Cuenta *</label>
                <input
                  type="text"
                  value={bankAccountHolder}
                  onChange={(e) => setBankAccountHolder(e.target.value)}
                  placeholder="ej. Los Pinos SpA"
                  className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-[#0F1115] focus:outline-none focus:border-[#D02126]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">RUT del Titular *</label>
                <input
                  type="text"
                  value={bankAccountHolderRut}
                  onChange={(e) => setBankAccountHolderRut(e.target.value)}
                  placeholder="15.883.974-1"
                  className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-mono text-[#0F1115] focus:outline-none focus:border-[#D02126]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Correo para Comprobantes *</label>
                <input
                  type="email"
                  value={receiptEmail}
                  onChange={(e) => setReceiptEmail(e.target.value)}
                  placeholder="pagos@corredora.cl"
                  className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-[#0F1115] focus:outline-none focus:border-[#D02126]"
                />
              </div>
            </div>

            {/* Live Payment Link Generator */}
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3 text-xs">
              <span className="font-bold text-[#0F1115] block">
                Tu Enlace de Pago en Línea (Webpay Plus & Transferencia)
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={`https://user.melsa.cl/pay/${companyName.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'tu-corredora'}`}
                  className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2 font-mono text-gray-700 text-xs select-all"
                />
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(`https://user.melsa.cl/pay/${companyName.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'tu-corredora'}`);
                    setCopiedPayNotice(true);
                    setTimeout(() => setCopiedPayNotice(false), 2000);
                  }}
                  className="px-3 py-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-100 font-bold text-gray-700 shrink-0 cursor-pointer flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedPayNotice ? 'Copiado!' : 'Copiar'}</span>
                </button>
              </div>
              <span className="text-[10px] text-gray-400 block">
                Tus arrendatarios podrán consultar su deuda por RUT y pagar con tarjeta de crédito, débito o transferencia.
              </span>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setActiveSection('identity')}
                className="text-xs font-semibold text-gray-500 hover:text-[#0F1115] cursor-pointer"
              >
                ← Volver a Identidad
              </button>

              <button
                type="button"
                onClick={() => setActiveSection('portals')}
                className="px-5 py-2.5 rounded-xl bg-[#0F1115] hover:bg-black text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>Siguiente: Portales y Superpoderes</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* SECTION 3: PORTALES, EQUIPO & SUPERPODERES                   */}
        {/* ============================================================ */}
        {activeSection === 'portals' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-2xs space-y-6 animate-in fade-in duration-150">
            <div>
              <h3 className="text-base font-bold text-[#0F1115]">
                Portales Públicos, Equipo y Firma Electrónica
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Personaliza la experiencia para tus propietarios y activa las herramientas agénticas de MELSA.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              
              {/* Owner Transparency Portal Link */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
                <div className="flex items-center gap-2 text-[#0F1115]">
                  <Users className="w-4 h-4 text-[#D02126]" />
                  <span className="font-bold">Portal del Propietario (Tiempo Real)</span>
                </div>
                <p className="text-[11px] text-gray-500 leading-snug">
                  Los dueños inician sesión con su correo o RUT sin contraseña para ver visualizaciones, visitas y feedback en vivo.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    readOnly
                    value={`https://user.melsa.cl/my/${companyName.toLowerCase().replace(/[^a-z0-9]/g, '-') || '33'}`}
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-1.5 font-mono text-[11px] text-gray-600 select-all"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText(`https://user.melsa.cl/my/${companyName.toLowerCase().replace(/[^a-z0-9]/g, '-') || '33'}`);
                      setCopiedOwnerNotice(true);
                      setTimeout(() => setCopiedOwnerNotice(false), 2000);
                    }}
                    className="p-1.5 rounded-xl bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 shrink-0 cursor-pointer"
                    title="Copiar enlace"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Digital Signing Badge */}
              <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-200/60 space-y-2">
                <div className="flex items-center gap-2 text-[#0F1115]">
                  <ShieldCheck className="w-4 h-4 text-[#D02126]" />
                  <span className="font-bold">Firma Electrónica Nativa (Ley 19.799)</span>
                </div>
                <p className="text-[11px] text-gray-600 leading-snug">
                  Habilitado para firma de órdenes de visita, cartas de oferta, contratos de arriendo y promesas con validación OTP.
                </p>
                <span className="text-[10px] font-bold text-[#D02126] bg-white px-2.5 py-1 rounded-full border border-rose-200 inline-block mt-1">
                  ✓ Certificados SHA-256 Activos
                </span>
              </div>
            </div>

            {/* Optional: Add 1st Team Member */}
            <div className="pt-2 border-t border-gray-100 space-y-3 text-xs">
              <span className="font-bold text-[#0F1115] block">
                Invitar Colaborador o Asistente (Opcional)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  value={teamMemberName}
                  onChange={(e) => setTeamMemberName(e.target.value)}
                  placeholder="Nombre y Apellido"
                  className="bg-[#FAF9F8] border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#0F1115] outline-none"
                />
                <input
                  type="email"
                  value={teamMemberEmail}
                  onChange={(e) => setTeamMemberEmail(e.target.value)}
                  placeholder="correo@corredora.cl"
                  className="bg-[#FAF9F8] border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#0F1115] outline-none"
                />
                <select
                  value={teamMemberRole}
                  onChange={(e) => setTeamMemberRole(e.target.value as any)}
                  className="bg-[#FAF9F8] border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#0F1115] outline-none cursor-pointer"
                >
                  <option value="Colaborador">Colaborador (Captación y visitas)</option>
                  <option value="Administrador">Administrador (Control total)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setActiveSection('banking')}
                className="text-xs font-semibold text-gray-500 hover:text-[#0F1115] cursor-pointer"
              >
                ← Volver a Cuentas
              </button>

              <button
                type="button"
                onClick={handleFinish}
                className="px-6 py-3 rounded-xl bg-[#D02126] hover:bg-[#B81B1F] text-white font-bold text-xs tracking-wider uppercase transition-all shadow-md cursor-pointer flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>🚀 Lanzar Espacio de Trabajo Ahora</span>
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Footer Info */}
      <footer className="max-w-5xl mx-auto w-full pt-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-600">MELSA Workspace OS</span>
          <span>·</span>
          <span>Cumplimiento Ley N° 19.799 de Firma Digital</span>
        </div>
        <div>
          <span>Todos tus ajustes pueden modificarse luego en Configuración</span>
        </div>
      </footer>

    </div>
  );
};
