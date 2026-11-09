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
  ArrowLeft, 
  FileText, 
  Download, 
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Check,
  Copy,
  Users
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
  // Step state (1 to 8)
  const [step, setStep] = useState<number>(1);

  // Plan limits (Gratis: 3, Básico: 15, Crecimiento: 50, Pro: 9999)
  const planLimits: { [k in AgencyPlanTier]: number } = {
    gratis: 3,
    basico: 15,
    intermedio: 50,
    pro: 9999
  };
  const propertiesLimit = planLimits[currentUser.agencyPlan || 'basico'] || 15;

  // 1. Legal info
  const [companyName, setCompanyName] = useState(initialData?.companyName || currentUser.companyName || 'Los Pinos');
  const [companyRut, setCompanyRut] = useState(initialData?.companyRut || '15.883.974-1');
  const [legalAddress, setLegalAddress] = useState(initialData?.legalAddress || 'Los Pinos 356');
  const [legalRepresentative, setLegalRepresentative] = useState(initialData?.legalRepresentative || currentUser.name || 'Alexis Rassmusen');

  // 2. Contact info
  const [contactEmail, setContactEmail] = useState(initialData?.contactEmail || currentUser.email || 'alexis.s.m@gmail.com');
  const [contactPhone, setContactPhone] = useState(initialData?.contactPhone || '+56973888336');

  // 3. Bank Transfer
  const [bankAccountHolder, setBankAccountHolder] = useState(initialData?.bankAccountHolder || 'Los Pinos');
  const [bankAccountHolderRut, setBankAccountHolderRut] = useState(initialData?.bankAccountHolderRut || '15.883.974-1');
  const [bankName, setBankName] = useState(initialData?.bankName || 'Banco Santander Chile');
  const [bankAccountType, setBankAccountType] = useState(initialData?.bankAccountType || 'Cuenta Corriente');
  const [bankAccountNumber, setBankAccountNumber] = useState(initialData?.bankAccountNumber || '84-938210-4');
  const [receiptEmail, setReceiptEmail] = useState(initialData?.receiptEmail || currentUser.email || 'alexis.s.m@gmail.com');

  // 4. Properties import
  const [importedCount, setImportedCount] = useState<number>(initialData?.importedCount || 0);
  const [importedFileNotice, setImportedFileNotice] = useState<string | null>(null);

  // 5. Payment portal branding
  const [portalName, setPortalName] = useState(initialData?.portalName || 'Los Pinos');
  const [portalPrimaryColor, setPortalPrimaryColor] = useState(initialData?.portalPrimaryColor || '#153b50');
  const [portalAccentColor, setPortalAccentColor] = useState(initialData?.portalAccentColor || '#008e88');
  const [portalLogoUrl, setPortalLogoUrl] = useState<string | undefined>(initialData?.portalLogoUrl);

  // 6. Payment Link (Screenshot 6/8)
  const [paymentLink, setPaymentLink] = useState<string>(
    `https://user.melsa.cl/pay/c8fd0927723bfabb542051e19c733246`
  );
  const [isPaymentLinkActive, setIsPaymentLinkActive] = useState<boolean>(false);
  const [copiedPaymentLink, setCopiedPaymentLink] = useState<boolean>(false);

  // 7. Client Access Link (Screenshot 7/8)
  const [personalAccessLink, setPersonalAccessLink] = useState<string>(
    `https://user.melsa.cl/my/33`
  );
  const [copiedAccessLink, setCopiedAccessLink] = useState<boolean>(false);

  // 8. Team Member (Screenshot 8/8)
  const [teamMemberName, setTeamMemberName] = useState<string>('');
  const [teamMemberEmail, setTeamMemberEmail] = useState<string>('');
  const [teamMemberPassword, setTeamMemberPassword] = useState<string>('');
  const [teamMemberRole, setTeamMemberRole] = useState<'Colaborador' | 'Administrador'>('Colaborador');

  // Additional settings
  const [monthlyFeePercent, setMonthlyFeePercent] = useState<number>(initialData?.monthlyFeePercent || 7);
  const [placementFeePercent, setPlacementFeePercent] = useState<number>(initialData?.placementFeePercent || 50);
  const [salesCommissionPercent, setSalesCommissionPercent] = useState<number>(initialData?.salesCommissionPercent || 2);
  const [reminderDaysBefore, setReminderDaysBefore] = useState<number>(initialData?.reminderDaysBefore || 3);
  const [enableWhatsAppReminders, setEnableWhatsAppReminders] = useState<boolean>(initialData?.enableWhatsAppReminders ?? true);
  const [enableEmailReminders, setEnableEmailReminders] = useState<boolean>(initialData?.enableEmailReminders ?? true);

  const handleNext = () => {
    if (step < 8) {
      setStep(prev => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    }
  };

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

  const handleSimulateImport = () => {
    setImportedCount(5);
    setImportedFileNotice('¡Archivo importado con éxito! 5 propiedades agregadas a tu cartera.');
    setTimeout(() => setImportedFileNotice(null), 3500);
  };

  const handleDownloadTemplate = (type: 'csv' | 'excel') => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Dirección,Comuna,Propietario,RUT Propietario,Arrendatario,RUT Arrendatario,Canon Arriendo CLP,Día Pago\n" +
      "Los Pinos 356,Las Condes,Gonzalo Vial,11.222.333-4,Matías Silva,18.999.888-7,850000,5\n" +
      "Av. Apoquindo 4400 Depto 802,Las Condes,Inversiones Los Andes,76.543.210-K,Carolina Morales,16.444.555-2,1200000,5\n";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `plantilla_propiedades_melsa.${type === 'csv' ? 'csv' : 'txt'}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#F0F5F4] text-[#153B50] flex flex-col justify-between py-8 px-4 sm:px-6">
      
      {/* Top Brand Nav */}
      <div className="max-w-3xl mx-auto w-full flex items-center justify-between pb-6">
        <div className="flex items-center gap-2">
          <MelsaLogo isLight={false} className="h-7" />
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400 border-l border-gray-300 pl-2">
            Configuración Inicial
          </span>
        </div>

        <button
          onClick={onSkip}
          className="text-xs text-gray-500 hover:text-[#008E88] font-semibold transition-colors cursor-pointer"
        >
          Saltar configuración y ver panel →
        </button>
      </div>

      {/* Main Form Center Box */}
      <div className="max-w-2xl mx-auto w-full bg-transparent my-auto">
        
        {/* ============================================================== */}
        {/* STEP 1: INFORMACIÓN LEGAL (SCREENSHOT 1/8)                     */}
        {/* ============================================================== */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="text-center sm:text-left space-y-1">
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#153B50] tracking-tight">
                Información legal
              </h1>
              <p className="text-xs sm:text-sm text-gray-500">
                Identifica a tu corredora para los contratos y documentos que emitas.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Razón social
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Los Pinos"
                  className="w-full bg-[#E6F0EE] border border-transparent focus:border-[#008E88] rounded-xl px-4 py-3 text-sm text-[#153B50] outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  RUT de la corredora
                </label>
                <input
                  type="text"
                  value={companyRut}
                  onChange={(e) => setCompanyRut(e.target.value)}
                  placeholder="15.883.974-1"
                  className="w-full bg-[#E6F0EE] border border-[#008E88]/40 focus:border-[#008E88] rounded-xl px-4 py-3 text-sm text-[#153B50] outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Domicilio legal
                </label>
                <input
                  type="text"
                  value={legalAddress}
                  onChange={(e) => setLegalAddress(e.target.value)}
                  placeholder="Los Pinos 356"
                  className="w-full bg-[#E6F0EE] border border-transparent focus:border-[#008E88] rounded-xl px-4 py-3 text-sm text-[#153B50] outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Representante legal
                </label>
                <input
                  type="text"
                  value={legalRepresentative}
                  onChange={(e) => setLegalRepresentative(e.target.value)}
                  placeholder="Alexis Rassmusen"
                  className="w-full bg-[#E6F0EE] border border-transparent focus:border-[#008E88] rounded-xl px-4 py-3 text-sm text-[#153B50] outline-none transition-all"
                />
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* STEP 2: INFORMACIÓN DE CONTACTO (SCREENSHOT 2/8)               */}
        {/* ============================================================== */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="text-center sm:text-left space-y-1">
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#153B50] tracking-tight">
                Información de contacto
              </h1>
              <p className="text-xs sm:text-sm text-gray-500">
                Indica cómo pueden comunicarse contigo propietarios y arrendatarios.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Correo de contacto
                </label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="alexis.s.m@gmail.com"
                  className="w-full bg-[#E6F0EE] border border-transparent focus:border-[#008E88] rounded-xl px-4 py-3 text-sm text-[#153B50] outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Teléfono de contacto
                </label>
                <input
                  type="text"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="+56973888336"
                  className="w-full bg-[#E6F0EE] border border-transparent focus:border-[#008E88] rounded-xl px-4 py-3 text-sm text-[#153B50] outline-none transition-all"
                />
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* STEP 3: CUENTA PARA TRANSFERENCIAS (SCREENSHOT 3/8)           */}
        {/* ============================================================== */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="text-center sm:text-left space-y-1">
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#153B50] tracking-tight">
                Cuenta para transferencias
              </h1>
              <p className="text-xs sm:text-sm text-gray-500">
                Al continuar, se guardará y habilitará esta cuenta para recibir transferencias.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Titular de la cuenta
                </label>
                <input
                  type="text"
                  value={bankAccountHolder}
                  onChange={(e) => setBankAccountHolder(e.target.value)}
                  placeholder="Los Pinos"
                  className="w-full bg-[#E6F0EE] border border-transparent focus:border-[#008E88] rounded-xl px-4 py-3 text-sm text-[#153B50] outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  RUT del titular
                </label>
                <input
                  type="text"
                  value={bankAccountHolderRut}
                  onChange={(e) => setBankAccountHolderRut(e.target.value)}
                  placeholder="15.883.974-1"
                  className="w-full bg-[#E6F0EE] border border-[#008E88]/40 focus:border-[#008E88] rounded-xl px-4 py-3 text-sm text-[#153B50] outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Banco o cuenta digital
                </label>
                <select
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full bg-[#E6F0EE] border border-transparent focus:border-[#008E88] rounded-xl px-4 py-3 text-sm text-[#153B50] outline-none transition-all cursor-pointer"
                >
                  <option value="Banco Santander Chile">Banco Santander Chile</option>
                  <option value="Banco de Chile / Edwards">Banco de Chile / Edwards</option>
                  <option value="BCI (Banco de Crédito e Inversiones)">BCI</option>
                  <option value="BancoEstado (CuentaRUT / Cta Corriente)">BancoEstado</option>
                  <option value="Scotiabank Chile">Scotiabank Chile</option>
                  <option value="Banco Itaú Chile">Banco Itaú</option>
                  <option value="Banco BICE">Banco BICE</option>
                  <option value="Banco Security">Banco Security</option>
                  <option value="Banco Falabella">Banco Falabella</option>
                  <option value="MACH (Bci)">MACH</option>
                  <option value="Tenpo">Tenpo</option>
                  <option value="Mercado Pago">Mercado Pago</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Tipo de cuenta
                </label>
                <select
                  value={bankAccountType}
                  onChange={(e) => setBankAccountType(e.target.value)}
                  className="w-full bg-[#E6F0EE] border border-transparent focus:border-[#008E88] rounded-xl px-4 py-3 text-sm text-[#153B50] outline-none transition-all cursor-pointer"
                >
                  <option value="Cuenta Corriente">Cuenta Corriente</option>
                  <option value="Cuenta Vista / CuentaRUT">Cuenta Vista / RUT</option>
                  <option value="Cuenta de Ahorro">Cuenta de Ahorro</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Número de cuenta
                </label>
                <input
                  type="text"
                  value={bankAccountNumber}
                  onChange={(e) => setBankAccountNumber(e.target.value)}
                  placeholder="00-1234567-8"
                  className="w-full bg-[#E6F0EE] border border-transparent focus:border-[#008E88] rounded-xl px-4 py-3 text-sm text-[#153B50] outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Correo para comprobantes
                </label>
                <input
                  type="email"
                  value={receiptEmail}
                  onChange={(e) => setReceiptEmail(e.target.value)}
                  placeholder="alexis.s.m@gmail.com"
                  className="w-full bg-[#E6F0EE] border border-transparent focus:border-[#008E88] rounded-xl px-4 py-3 text-sm text-[#153B50] outline-none transition-all"
                />
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* STEP 4: IMPORTA TUS PROPIEDADES (SCREENSHOT 4/8)              */}
        {/* ============================================================== */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="text-center sm:text-left space-y-1">
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#153B50] tracking-tight">
                Importa tus propiedades
              </h1>
              <p className="text-xs sm:text-sm text-gray-500">
                Trae tu cartera de arriendo y revisa las propiedades antes de guardarlas.
              </p>
            </div>

            {/* Dropzone Box */}
            <div 
              onClick={handleSimulateImport}
              className="bg-[#E6F0EE]/70 hover:bg-[#E6F0EE] border-2 border-dashed border-[#008E88]/40 hover:border-[#008E88] rounded-3xl p-8 sm:p-12 text-center transition-all cursor-pointer shadow-xs group"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#008E88]/15 text-[#008E88] flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <UploadCloud className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-[#153B50]">
                Arrastra tu archivo aquí
              </h4>
              <p className="text-sm text-[#008E88] font-semibold underline mt-1">
                o elige un archivo
              </p>
              <span className="text-xs text-gray-400 mt-2 block">
                CSV o XLSX · Hasta 5 MB y 1.000 propiedades
              </span>
            </div>

            {importedFileNotice && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{importedFileNotice}</span>
              </div>
            )}

            {/* Quota & Templates */}
            <div className="flex items-center justify-between text-xs text-gray-600 pt-1">
              <span className="font-semibold text-gray-700">
                {importedCount} de {propertiesLimit === 9999 ? '∞' : propertiesLimit} cupos en uso
              </span>
              <div className="flex items-center gap-2">
                <span>Plantillas:</span>
                <button
                  type="button"
                  onClick={() => handleDownloadTemplate('csv')}
                  className="font-bold text-[#008E88] underline hover:text-[#0B6B67] cursor-pointer"
                >
                  CSV
                </button>
                <span className="text-gray-300">|</span>
                <button
                  type="button"
                  onClick={() => handleDownloadTemplate('excel')}
                  className="font-bold text-[#008E88] underline hover:text-[#0B6B67] cursor-pointer"
                >
                  Excel
                </button>
              </div>
            </div>

            <p className="text-[11px] text-gray-400 font-light">
              El exceso de cupo queda Sin operación. La importación no genera contratos ni cobros.
            </p>
          </div>
        )}

        {/* ============================================================== */}
        {/* STEP 5: TU PORTAL DE PAGOS (SCREENSHOT 5/8)                   */}
        {/* ============================================================== */}
        {step === 5 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="text-center sm:text-left space-y-1">
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#153B50] tracking-tight">
                Tu portal de pagos
              </h1>
              <p className="text-xs sm:text-sm text-gray-500">
                Personaliza el portal que compartirás con tus arrendatarios.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              
              {/* Left Settings */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Nombre del portal
                  </label>
                  <input
                    type="text"
                    value={portalName}
                    onChange={(e) => setPortalName(e.target.value)}
                    placeholder="Los Pinos"
                    className="w-full bg-[#E6F0EE] border border-transparent focus:border-[#008E88] rounded-xl px-4 py-2.5 text-sm text-[#153B50] outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Color principal
                    </label>
                    <div className="flex items-center gap-2 bg-[#E6F0EE] rounded-xl px-3 py-2">
                      <input
                        type="color"
                        value={portalPrimaryColor}
                        onChange={(e) => setPortalPrimaryColor(e.target.value)}
                        className="w-6 h-6 rounded-md border-0 cursor-pointer"
                      />
                      <span className="text-xs font-mono font-semibold text-gray-700 uppercase">
                        {portalPrimaryColor}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Color de acento
                    </label>
                    <div className="flex items-center gap-2 bg-[#E6F0EE] rounded-xl px-3 py-2">
                      <input
                        type="color"
                        value={portalAccentColor}
                        onChange={(e) => setPortalAccentColor(e.target.value)}
                        className="w-6 h-6 rounded-md border-0 cursor-pointer"
                      />
                      <span className="text-xs font-mono font-semibold text-gray-700 uppercase">
                        {portalAccentColor}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Logo de la corredora
                  </label>
                  <label className="flex items-center gap-3 bg-[#E6F0EE] hover:bg-[#D9E9E6] p-3 rounded-2xl cursor-pointer transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-[#008E88]/15 text-[#008E88] flex items-center justify-center shrink-0">
                      <UploadCloud className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#153B50] block">
                        Logo de la corredora
                      </span>
                      <span className="text-[11px] text-gray-500 block">
                        Elige una imagen para ajustarla (PNG o SVG)
                      </span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (ev) => setPortalLogoUrl(ev.target?.result as string);
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* Right: Live Portal Card Preview (exact match to Screenshot 5/8) */}
              <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-sm space-y-4">
                
                {/* Simulated Portal Top Header */}
                <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                  {portalLogoUrl ? (
                    <img src={portalLogoUrl} alt="Logo" className="h-6 w-auto object-contain rounded" />
                  ) : (
                    <Building2 className="w-4 h-4 text-[#153B50]" />
                  )}
                  <span className="text-sm font-bold text-[#153B50]">
                    {portalName || 'Los Pinos'}
                  </span>
                </div>

                <div className="space-y-3 pt-1">
                  <h4 className="text-base font-bold text-[#153B50]">
                    Consulta tus pagos
                  </h4>
                  <div>
                    <label className="block text-[11px] text-gray-500 mb-1">
                      RUT del arrendatario
                    </label>
                    <div className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-400">
                      18.999.888-7
                    </div>
                  </div>

                  <button
                    type="button"
                    style={{ backgroundColor: portalAccentColor || '#008E88' }}
                    className="w-full py-2.5 rounded-xl text-white font-bold text-xs shadow-xs transition-opacity hover:opacity-90 cursor-pointer"
                  >
                    Consultar pagos
                  </button>
                </div>

                <div className="text-[10px] text-gray-400 text-center pt-2">
                  Previsualización en vivo para tus clientes
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* STEP 6: TU ENLACE DE PAGO (SCREENSHOT 6/8)                     */}
        {/* ============================================================== */}
        {step === 6 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="text-center sm:text-left space-y-1">
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#153B50] tracking-tight">
                Tu enlace de pago
              </h1>
              <p className="text-xs sm:text-sm text-gray-500">
                Activa tu enlace y compártelo con tus arrendatarios.
              </p>
            </div>

            <div className="text-center sm:text-left">
              <span className={`text-xs font-semibold ${isPaymentLinkActive ? 'text-emerald-700' : 'text-gray-500'}`}>
                {isPaymentLinkActive 
                  ? '✓ Enlace preparado · Enlace activado y listo para cobrar' 
                  : 'Enlace preparado · Pendiente de activación'}
              </span>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-700">
                Enlace de tu portal de pagos
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={paymentLink}
                  className="w-full bg-[#E6F0EE] border border-transparent rounded-xl px-4 py-3 text-xs sm:text-sm text-[#153B50] font-mono outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(paymentLink);
                    setCopiedPaymentLink(true);
                    setTimeout(() => setCopiedPaymentLink(false), 2000);
                  }}
                  className="p-3 rounded-xl bg-[#E6F0EE] hover:bg-[#D9E9E6] text-[#008E88] transition-colors cursor-pointer shrink-0"
                  title="Copiar enlace"
                >
                  {copiedPaymentLink ? <Check className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
              {copiedPaymentLink && (
                <span className="text-[11px] text-emerald-600 font-semibold block">
                  ¡Enlace copiado al portapapeles!
                </span>
              )}
            </div>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setIsPaymentLinkActive(true)}
                className={`px-8 py-3 rounded-xl font-bold text-xs sm:text-sm tracking-wide transition-all shadow-xs cursor-pointer inline-flex items-center gap-2 ${
                  isPaymentLinkActive 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-[#008E88] hover:bg-[#08736E] text-white'
                }`}
              >
                <span>{isPaymentLinkActive ? '✓ Enlace Activado' : 'Activar enlace'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* STEP 7: ACCESO DE PROPIETARIOS Y ARRENDATARIOS (7/8)          */}
        {/* ============================================================== */}
        {step === 7 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="text-center sm:text-left space-y-1">
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#153B50] tracking-tight">
                Acceso de propietarios y arrendatarios
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                Ambos entran desde el mismo enlace. Usan el correo que registraste en Melsa y reciben un código de acceso. Cada persona ve solo lo que le corresponde.
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-700">
                Enlace de acceso personal
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={personalAccessLink}
                  className="w-full bg-[#E6F0EE] border border-transparent rounded-xl px-4 py-3 text-xs sm:text-sm text-[#153B50] font-mono outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(personalAccessLink);
                    setCopiedAccessLink(true);
                    setTimeout(() => setCopiedAccessLink(false), 2000);
                  }}
                  className="p-3 rounded-xl bg-[#E6F0EE] hover:bg-[#D9E9E6] text-[#008E88] transition-colors cursor-pointer shrink-0"
                  title="Copiar enlace personal"
                >
                  {copiedAccessLink ? <Check className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
              {copiedAccessLink && (
                <span className="text-[11px] text-emerald-600 font-semibold block">
                  ¡Enlace copiado al portapapeles!
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-[#153B50]">Propietarios</h4>
                <p className="text-xs text-gray-500">
                  Consultan sus documentos y liquidaciones disponibles.
                </p>
              </div>

              <div className="space-y-1">
                <h4 className="text-sm font-bold text-[#153B50]">Arrendatarios</h4>
                <p className="text-xs text-gray-500">
                  Revisan sus documentos, obligaciones y comprobantes.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* STEP 8: TU EQUIPO (SCREENSHOT 8/8)                             */}
        {/* ============================================================== */}
        {step === 8 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="text-center sm:text-left space-y-1">
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#153B50] tracking-tight">
                Tu equipo
              </h1>
              <p className="text-xs sm:text-sm text-gray-500">
                Crea cuentas para quienes trabajarán contigo en Melsa.
              </p>
            </div>

            <div className="text-center sm:text-left">
              <span className="text-xs font-semibold text-gray-500">
                Tienes 1 cupo disponible. Tu cuenta ya ocupa un cupo.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              <div className="sm:col-span-3">
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  value={teamMemberName}
                  onChange={(e) => setTeamMemberName(e.target.value)}
                  placeholder="ej. Juan Pérez"
                  className="w-full bg-[#E6F0EE] border border-transparent focus:border-[#008E88] rounded-xl px-3.5 py-2.5 text-xs text-[#153B50] outline-none"
                />
              </div>

              <div className="sm:col-span-4">
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Correo
                </label>
                <input
                  type="email"
                  value={teamMemberEmail}
                  onChange={(e) => setTeamMemberEmail(e.target.value)}
                  placeholder="ej. juan@los-pinos.cl"
                  className="w-full bg-[#E6F0EE] border border-transparent focus:border-[#008E88] rounded-xl px-3.5 py-2.5 text-xs text-[#153B50] outline-none"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Contraseña inicial
                </label>
                <input
                  type="password"
                  value={teamMemberPassword}
                  onChange={(e) => setTeamMemberPassword(e.target.value)}
                  placeholder="Mínimo 12 caracteres"
                  className="w-full bg-[#E6F0EE] border border-transparent focus:border-[#008E88] rounded-xl px-3.5 py-2.5 text-xs text-[#153B50] outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Permiso
                </label>
                <button
                  type="button"
                  onClick={() => setTeamMemberRole(prev => prev === 'Colaborador' ? 'Administrador' : 'Colaborador')}
                  className="flex items-center gap-2 cursor-pointer pt-1"
                >
                  <div className={`w-9 h-5 rounded-full transition-colors p-0.5 ${
                    teamMemberRole === 'Administrador' ? 'bg-[#008E88]' : 'bg-gray-400'
                  }`}>
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      teamMemberRole === 'Administrador' ? 'translate-x-4' : 'translate-x-0'
                    }`} />
                  </div>
                  <span className="text-xs font-semibold text-gray-700">
                    {teamMemberRole}
                  </span>
                </button>
              </div>
            </div>

            <p className="text-[11px] text-gray-500 font-light pt-1">
              Un administrador puede gestionar la configuración y el equipo. Puedes añadir más usuarios desde Usuarios según los cupos disponibles.
            </p>
          </div>
        )}

      </div>

      {/* ============================================================== */}
      {/* BOTTOM NAVIGATION BAR: ← Volver   X / 8   Siguiente / Finalizar */}
      {/* ============================================================== */}
      <div className="max-w-2xl mx-auto w-full pt-8">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handleBack}
            disabled={step === 1}
            className={`text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
              step === 1 ? 'opacity-0 pointer-events-none' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver</span>
          </button>

          <span className="text-xs font-semibold text-gray-500">
            {step} / 8
          </span>

          <button
            type="button"
            onClick={handleNext}
            className="px-6 py-2.5 rounded-xl bg-[#008E88] hover:bg-[#08736E] text-white font-bold text-xs tracking-wider transition-all shadow-xs hover:shadow-md cursor-pointer flex items-center gap-1.5"
          >
            <span>{step === 8 ? 'Finalizar' : 'Siguiente'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="text-center mt-3">
          <button
            type="button"
            onClick={step === 8 ? handleFinish : handleNext}
            className="text-xs text-[#008E88] hover:underline cursor-pointer"
          >
            Omitir este paso
          </button>
        </div>
      </div>

    </div>
  );
};
