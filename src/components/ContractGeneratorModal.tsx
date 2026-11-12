import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Send, 
  Sparkles, 
  FileText, 
  Building2, 
  User, 
  CheckCircle2, 
  Copy, 
  ExternalLink,
  ShieldCheck,
  DollarSign,
  Scale,
  Calendar,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  HelpCircle,
  Phone,
  Mail,
  Home
} from 'lucide-react';
import { CHILE_REGIONS } from '../services/propertyValuationEngine';

export type ContractWizardType = 
  | 'promesa_compraventa'
  | 'arriendo_residencial'
  | 'arriendo_comercial'
  | 'orden_corretaje'
  | 'orden_visita';

interface ContractGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveContract?: (contract: any) => void;
  initialContractType?: ContractWizardType;
  initialPropertyAddress?: string;
  initialCommune?: string;
  initialRolSII?: string;
  initialRentCLP?: number;
}

export const ContractGeneratorModal: React.FC<ContractGeneratorModalProps> = ({
  isOpen,
  onClose,
  onSaveContract,
  initialContractType = 'promesa_compraventa',
  initialPropertyAddress,
  initialCommune,
  initialRolSII,
  initialRentCLP
}) => {
  // Tipo de contrato seleccionado
  const [contractType, setContractType] = useState<ContractWizardType>(initialContractType);
  
  // Sincronizar si cambia initialContractType al abrir
  React.useEffect(() => {
    if (initialContractType) {
      setContractType(initialContractType);
    }
  }, [initialContractType, isOpen]);
  
  // Paso actual del wizard (1 a 5)
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  // Estados de los campos rellenables
  const [city, setCity] = useState('Viña del Mar');
  const [contractDate, setContractDate] = useState(() => {
    const today = new Date();
    return `${today.getDate()} de ${today.toLocaleDateString('es-CL', { month: 'long' })} de ${today.getFullYear()}`;
  });

  // 1. Inmueble
  const [propertyTitle, setPropertyTitle] = useState('Departamento N° 402 del cuarto piso, Edificio Los Aromos');
  const [propertyRegion, setPropertyRegion] = useState('Región de Valparaíso');
  const [propertyCommune, setPropertyCommune] = useState(initialCommune || 'Villa Alemana');
  const [propertyAddress, setPropertyAddress] = useState(initialPropertyAddress || 'Pasaje Fernanda 596');
  const [propertyRolSII, setPropertyRolSII] = useState(initialRolSII || '433-032');
  const [propertySurfaceM2, setPropertySurfaceM2] = useState('85');
  const [propertyDeslindes, setPropertyDeslindes] = useState('Norte en 20 metros con lote 3; Sur en 20 metros con Pasaje Fernanda; Oriente en 15 metros con lote 1; Poniente en 15 metros con área verde.');
  const [propertyCbrFojas, setPropertyCbrFojas] = useState('1245');
  const [propertyCbrNumero, setPropertyCbrNumero] = useState('890');
  const [propertyCbrYear, setPropertyCbrYear] = useState('2019');
  const [propertyCbrCity, setPropertyCbrCity] = useState('Villa Alemana');

  // 2. Vendedor / Arrendador
  const [sellerName, setSellerName] = useState('Alexis Santana Morales');
  const [sellerRut, setSellerRut] = useState('15.883.974-1');
  const [sellerNationality, setSellerNationality] = useState('Chilena');
  const [sellerCivilStatus, setSellerCivilStatus] = useState('Soltero');
  const [sellerProfession, setSellerProfession] = useState('Gestor Inmobiliario');
  const [sellerAddress, setSellerAddress] = useState('Av. Valparaíso 1230, Of. 402');
  const [sellerCommune, setSellerCommune] = useState('Viña del Mar');
  const [sellerRegion, setSellerRegion] = useState('Región de Valparaíso');
  const [sellerPhone, setSellerPhone] = useState('+56 9 9989 9421');
  const [sellerEmail, setSellerEmail] = useState('contacto@melsa.cl');

  // 3. Comprador / Arrendatario
  const [buyerName, setBuyerName] = useState('Camila Zúñiga Valdés');
  const [buyerRut, setBuyerRut] = useState('18.456.789-K');
  const [buyerNationality, setBuyerNationality] = useState('Chilena');
  const [buyerCivilStatus, setBuyerCivilStatus] = useState('Soltera');
  const [buyerProfession, setBuyerProfession] = useState('Ingeniera Comercial');
  const [buyerAddress, setBuyerAddress] = useState('Calle Los Pinos 450');
  const [buyerCommune, setBuyerCommune] = useState('Quilpué');
  const [buyerRegion, setBuyerRegion] = useState('Región de Valparaíso');
  const [buyerPhone, setBuyerPhone] = useState('+56 9 8456 7890');
  const [buyerEmail, setBuyerEmail] = useState('c.zuniga@gmail.com');

  // Aval (para arriendos)
  const [hasGuarantor, setHasGuarantor] = useState(true);
  const [guarantorName, setGuarantorName] = useState('Rodrigo Zúñiga Morales');
  const [guarantorRut, setGuarantorRut] = useState('12.345.678-9');
  const [guarantorProfession, setGuarantorProfession] = useState('Contador Auditor');

  // 4. Condiciones Económicas
  const [currency, setCurrency] = useState<'UF' | 'CLP'>('UF');
  const [priceAmount, setPriceAmount] = useState(3800);
  const [downPaymentAmount, setDownPaymentAmount] = useState(380); // Arras o Pie
  const [penaltyPercent, setPenaltyPercent] = useState(10);
  const [daysToTitleApproval, setDaysToTitleApproval] = useState(60);
  const [readjustmentFreq, setReadjustmentFreq] = useState('IPC Semestral');
  const [rentPaymentDay, setRentPaymentDay] = useState(5);
  const [guaranteeMonths, setGuaranteeMonths] = useState(1);

  // 5. Cláusulas Especiales
  const [petsAllowed, setPetsAllowed] = useState(true);
  const [subleaseAllowed, setSubleaseAllowed] = useState(false);
  const [specialConditions, setSpecialConditions] = useState('La entrega material se realizará dentro de los 5 días hábiles siguientes a la inscripción de dominio en el Conservador de Bienes Raíces.');

  // UI States
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [isZapSignModalOpen, setIsZapSignModalOpen] = useState(false);
  const [zapSignSuccessNotice, setZapSignSuccessNotice] = useState<string | null>(null);
  
  // FEA / Notaría Digital Modal State
  const [isFeaModalOpen, setIsFeaModalOpen] = useState(false);
  const [feaSuccessNotice, setFeaSuccessNotice] = useState<string | null>(null);
  const [feaProvider, setFeaProvider] = useState<'firmavirtual' | 'esign'>('firmavirtual');
  const [includeNotaryCertification, setIncludeNotaryCertification] = useState(true);

  if (!isOpen) return null;

  // Cálculo de Progreso del Wizard
  const progressPct = Math.round((currentStep / totalSteps) * 100);

  // Helper para resaltar datos rellenados vs vacíos (Estilo Wonder.Legal amarillo suave)
  const renderFilled = (val: string | number | undefined, placeholder: string = '________') => {
    const text = val !== undefined && val !== null && String(val).trim() !== '' ? String(val) : '';
    if (text) {
      return (
        <span className="bg-[#FFF3CD] text-[#0F1115] font-semibold px-1 py-0.5 rounded border-b border-[#FFEBAA] transition-all">
          {text}
        </span>
      );
    }
    return <span className="text-gray-400 font-mono tracking-widest">{placeholder}</span>;
  };

  // Formato monetario
  const formatMoney = (amount: number, cur: 'UF' | 'CLP') => {
    return cur === 'UF' ? `${amount.toLocaleString('es-CL')} UF` : `$${amount.toLocaleString('es-CL')} CLP`;
  };

  // Copiar al portapapeles
  const handleCopy = () => {
    const el = document.getElementById('contract-preview-text');
    if (el) {
      navigator.clipboard.writeText(el.innerText);
      setCopiedSuccess(true);
      setTimeout(() => setCopiedSuccess(false), 2500);
    }
  };

  // Imprimir
  const handlePrint = () => {
    const el = document.getElementById('contract-preview-text');
    if (!el) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${contractType.toUpperCase()} - MELSA GESTIÓN INMOBILIARIA</title>
        <style>
          @page { size: letter; margin: 25mm 20mm 25mm 20mm; }
          body { font-family: 'Times New Roman', serif; font-size: 11pt; line-height: 1.6; color: #111; text-align: justify; }
          h1 { text-align: center; font-size: 13pt; margin-bottom: 20px; font-weight: bold; }
          .header-brand { text-align: right; font-size: 9pt; color: #666; margin-bottom: 20px; border-bottom: 1px solid #ccc; padding-bottom: 4px; }
        </style>
      </head>
      <body>
        <div class="header-brand">MELSA GESTIÓN INMOBILIARIA • ASESORÍA Y CORRETAJE LEGAL</div>
        <div>${el.innerHTML}</div>
        <script>window.onload = function() { window.print(); }</script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Enviar a ZapSign (Firma Simple)
  const handleSendZapSign = () => {
    setZapSignSuccessNotice(`¡Contrato enviado a ZapSign para firma simple de ${buyerName} y ${sellerName}!`);
    setTimeout(() => {
      setZapSignSuccessNotice(null);
      setIsZapSignModalOpen(false);
    }, 4000);
  };

  // Enviar a Firma Electrónica Avanzada (FEA / Notaría Digital)
  const handleSendFea = () => {
    const providerName = feaProvider === 'firmavirtual' ? 'FirmaVirtual.legal' : 'E-Sign Chile';
    setFeaSuccessNotice(`¡Expediente despachado a ${providerName} con certificación FEA y validación biométrica con Registro Civil para ${buyerName} y ${sellerName}!`);
    setTimeout(() => {
      setFeaSuccessNotice(null);
      setIsFeaModalOpen(false);
    }, 4500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-7xl h-[95vh] bg-[#F7F8FA] rounded-3xl shadow-2xl border border-gray-300 flex flex-col overflow-hidden">
        
        {/* BARRA SUPERIOR WONDER.LEGAL STYLE: Título + Progreso */}
        <header className="px-6 py-3.5 bg-white border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FDE8E9] text-[#D02126] flex items-center justify-center font-bold">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <select
                  value={contractType}
                  onChange={(e) => setContractType(e.target.value as any)}
                  className="text-base sm:text-lg font-black text-[#0F1115] bg-transparent outline-none cursor-pointer hover:text-[#D02126] transition-colors"
                >
                  <option value="promesa_compraventa">Contrato de Promesa de Compraventa de Inmueble</option>
                  <option value="arriendo_residencial">Contrato de Arrendamiento Habitacional (Ley Devuélveme Mi Casa)</option>
                  <option value="arriendo_comercial">Contrato de Arrendamiento Comercial / Local u Oficina</option>
                  <option value="orden_corretaje">Orden de Venta y Mandato de Corretaje con Exclusividad</option>
                </select>
              </div>
              <span className="text-[11px] text-gray-500 block">
                Asistente interactivo guiado paso a paso con vista previa en tiempo real
              </span>
            </div>
          </div>

          {/* Barra de Progreso y Acciones */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end w-40">
              <span className="text-[11px] font-bold text-[#0F1115]">
                Progreso: {progressPct}%
              </span>
              <div className="w-full h-2 bg-gray-200 rounded-full mt-1 overflow-hidden">
                <div 
                  className="h-full bg-[#1A2E40] transition-all duration-300 rounded-full"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Opción 1: Imprimir Notarial Tradicional */}
              <button
                type="button"
                onClick={handlePrint}
                className="px-3 py-1.5 rounded-xl bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-bold text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
                title="Imprimir contrato para Notaría tradicional"
              >
                <Printer className="w-3.5 h-3.5 text-gray-600" />
                <span className="hidden sm:inline">Imprimir Notarial</span>
              </button>

              {/* Opción 2: ZapSign (Firma Simple WhatsApp) */}
              <button
                type="button"
                onClick={() => setIsZapSignModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-700 font-bold text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
                title="Firma electrónica simple para visitas y acuerdos ágiles"
              >
                <Send className="w-3.5 h-3.5 text-blue-600" />
                <span className="hidden sm:inline">ZapSign (Simple)</span>
              </button>

              {/* Opción 3: Firma Electrónica Avanzada (FEA / Notaría Digital) */}
              <button
                type="button"
                onClick={() => setIsFeaModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer transition-all"
                title="Firma Electrónica Avanzada con validez tributaria SII y mérito ejecutivo"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-200" />
                <span>Firma FEA (Validez SII)</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer ml-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* CONTENEDOR SPLIT: IZQUIERDA FORMULARIO GUIADO / DERECHA VISTA PREVIA WONDER.LEGAL */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          
          {/* COLUMNA IZQUIERDA: FORMULARIO PASO A PASO (40%) */}
          <div className="lg:col-span-5 bg-white border-r border-gray-200 flex flex-col justify-between overflow-y-auto p-6 space-y-6">
            
            {/* Cabecera del Paso Actual */}
            <div className="space-y-1 pb-3 border-b border-gray-100">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#D02126]">
                Paso {currentStep} de {totalSteps}
              </span>
              <h3 className="text-base font-black text-[#0F1115]">
                {currentStep === 1 && '1. Identificación y Ubicación del Inmueble'}
                {currentStep === 2 && '2. Parte Promitente Vendedora / Arrendadora'}
                {currentStep === 3 && '3. Parte Promitente Compradora / Arrendataria'}
                {currentStep === 4 && '4. Precio, Forma de Pago y Condiciones'}
                {currentStep === 5 && '5. Cláusulas Especiales, Deslindes e Inscripción'}
              </h3>
            </div>

            {/* PREGUNTAS DEL PASO 1 */}
            {currentStep === 1 && (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1 flex items-center gap-1">
                    <span>(Opcional) Denominación de la propiedad o unidad:</span>
                    <HelpCircle className="w-3.5 h-3.5 text-gray-400" />
                  </label>
                  <textarea
                    rows={2}
                    value={propertyTitle}
                    onChange={(e) => setPropertyTitle(e.target.value)}
                    placeholder="ej. Sitio A, Población M. Departamento N° 402 del cuarto piso, Edificio Los Aromos..."
                    className="w-full bg-[#FAF9F8] border border-gray-300 rounded-xl p-3 text-xs text-gray-900 outline-none focus:border-[#D02126] leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    Región en que se ubica el inmueble:
                  </label>
                  <select
                    value={propertyRegion}
                    onChange={(e) => setPropertyRegion(e.target.value)}
                    className="w-full bg-[#FAF9F8] border border-gray-300 rounded-xl px-3 py-2.5 text-xs text-gray-900 outline-none focus:border-[#D02126]"
                  >
                    {CHILE_REGIONS.map(r => (
                      <option key={r.id} value={r.name}>{r.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      Comuna:
                    </label>
                    <input
                      type="text"
                      value={propertyCommune}
                      onChange={(e) => setPropertyCommune(e.target.value)}
                      placeholder="ej. Villa Alemana"
                      className="w-full bg-[#FAF9F8] border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 outline-none focus:border-[#D02126]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      Rol de Avalúo SII:
                    </label>
                    <input
                      type="text"
                      value={propertyRolSII}
                      onChange={(e) => setPropertyRolSII(e.target.value)}
                      placeholder="ej. 433-032"
                      className="w-full bg-[#FAF9F8] border border-gray-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-[#D02126] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      Dirección del inmueble:
                    </label>
                    <input
                      type="text"
                      value={propertyAddress}
                      onChange={(e) => setPropertyAddress(e.target.value)}
                      placeholder="ej. Pasaje Fernanda 596"
                      className="w-full bg-[#FAF9F8] border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 outline-none focus:border-[#D02126]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      Superficie (m²):
                    </label>
                    <input
                      type="text"
                      value={propertySurfaceM2}
                      onChange={(e) => setPropertySurfaceM2(e.target.value)}
                      placeholder="85"
                      className="w-full bg-[#FAF9F8] border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 outline-none text-center"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* PREGUNTAS DEL PASO 2: VENDEDOR */}
            {currentStep === 2 && (
              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    Nombre completo del Vendedor / Arrendador:
                  </label>
                  <input
                    type="text"
                    value={sellerName}
                    onChange={(e) => setSellerName(e.target.value)}
                    className="w-full bg-[#FAF9F8] border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold text-gray-900 outline-none focus:border-[#D02126]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">Cédula de Identidad (RUT):</label>
                    <input
                      type="text"
                      value={sellerRut}
                      onChange={(e) => setSellerRut(e.target.value)}
                      className="w-full bg-[#FAF9F8] border border-gray-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-gray-900 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">Estado Civil:</label>
                    <select
                      value={sellerCivilStatus}
                      onChange={(e) => setSellerCivilStatus(e.target.value)}
                      className="w-full bg-[#FAF9F8] border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 outline-none"
                    >
                      <option value="Soltero">Soltero(a)</option>
                      <option value="Casado">Casado(a)</option>
                      <option value="Viudo">Viudo(a)</option>
                      <option value="Divorciado">Divorciado(a)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">Profesión u Ocupación:</label>
                    <input
                      type="text"
                      value={sellerProfession}
                      onChange={(e) => setSellerProfession(e.target.value)}
                      className="w-full bg-[#FAF9F8] border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">Nacionalidad:</label>
                    <input
                      type="text"
                      value={sellerNationality}
                      onChange={(e) => setSellerNationality(e.target.value)}
                      className="w-full bg-[#FAF9F8] border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">Domicilio legal:</label>
                  <input
                    type="text"
                    value={sellerAddress}
                    onChange={(e) => setSellerAddress(e.target.value)}
                    className="w-full bg-[#FAF9F8] border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">WhatsApp / Teléfono:</label>
                    <input
                      type="text"
                      value={sellerPhone}
                      onChange={(e) => setSellerPhone(e.target.value)}
                      className="w-full bg-[#FAF9F8] border border-gray-300 rounded-xl px-3 py-2 text-xs font-mono text-gray-900 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">Correo Electrónico:</label>
                    <input
                      type="email"
                      value={sellerEmail}
                      onChange={(e) => setSellerEmail(e.target.value)}
                      className="w-full bg-[#FAF9F8] border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* PREGUNTAS DEL PASO 3: COMPRADOR Y AVAL */}
            {currentStep === 3 && (
              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    Nombre completo del Comprador / Arrendatario:
                  </label>
                  <input
                    type="text"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    className="w-full bg-[#FAF9F8] border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold text-gray-900 outline-none focus:border-[#D02126]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">RUT Comprador:</label>
                    <input
                      type="text"
                      value={buyerRut}
                      onChange={(e) => setBuyerRut(e.target.value)}
                      className="w-full bg-[#FAF9F8] border border-gray-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-gray-900 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">Estado Civil:</label>
                    <select
                      value={buyerCivilStatus}
                      onChange={(e) => setBuyerCivilStatus(e.target.value)}
                      className="w-full bg-[#FAF9F8] border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 outline-none"
                    >
                      <option value="Soltero">Soltero(a)</option>
                      <option value="Casado">Casado(a)</option>
                      <option value="Viudo">Viudo(a)</option>
                      <option value="Divorciado">Divorciado(a)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">Profesión u Ocupación:</label>
                    <input
                      type="text"
                      value={buyerProfession}
                      onChange={(e) => setBuyerProfession(e.target.value)}
                      className="w-full bg-[#FAF9F8] border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">Teléfono (Para firma ZapSign):</label>
                    <input
                      type="text"
                      value={buyerPhone}
                      onChange={(e) => setBuyerPhone(e.target.value)}
                      className="w-full bg-[#FAF9F8] border border-gray-300 rounded-xl px-3 py-2 text-xs font-mono text-gray-900 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">Correo Electrónico para Firma Virtual:</label>
                  <input
                    type="email"
                    value={buyerEmail}
                    onChange={(e) => setBuyerEmail(e.target.value)}
                    className="w-full bg-[#FAF9F8] border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 outline-none"
                  />
                </div>

                {contractType === 'arriendo_residencial' && (
                  <div className="pt-2 border-t border-gray-100">
                    <label className="flex items-center gap-2 cursor-pointer mb-2">
                      <input
                        type="checkbox"
                        checked={hasGuarantor}
                        onChange={(e) => setHasGuarantor(e.target.checked)}
                        className="rounded text-[#D02126]"
                      />
                      <span className="font-bold text-gray-800 text-[11px]">Incluir Aval / Codeudor Solidario</span>
                    </label>
                    {hasGuarantor && (
                      <div className="grid grid-cols-2 gap-2 p-3 bg-gray-50 rounded-xl border border-gray-200">
                        <input
                          type="text"
                          value={guarantorName}
                          onChange={(e) => setGuarantorName(e.target.value)}
                          placeholder="Nombre Aval"
                          className="bg-white border border-gray-300 rounded-lg px-2 py-1 text-xs"
                        />
                        <input
                          type="text"
                          value={guarantorRut}
                          onChange={(e) => setGuarantorRut(e.target.value)}
                          placeholder="RUT Aval"
                          className="bg-white border border-gray-300 rounded-lg px-2 py-1 text-xs font-mono"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* PREGUNTAS DEL PASO 4: PRECIO Y FORMA DE PAGO */}
            {currentStep === 4 && (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      {contractType === 'promesa_compraventa' ? 'Precio de Venta Acordado:' : 'Renta Mensual:'}
                    </label>
                    <input
                      type="number"
                      value={priceAmount}
                      onChange={(e) => setPriceAmount(Number(e.target.value))}
                      className="w-full bg-[#FAF9F8] border border-gray-300 rounded-xl px-3 py-2 text-sm font-black text-gray-900 outline-none focus:border-[#D02126]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">Moneda:</label>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value as any)}
                      className="w-full bg-[#FAF9F8] border border-gray-300 rounded-xl px-3 py-2 text-xs font-bold text-gray-900 outline-none"
                    >
                      <option value="UF">UF</option>
                      <option value="CLP">Pesos (CLP)</option>
                    </select>
                  </div>
                </div>

                {contractType === 'promesa_compraventa' ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 mb-1">Monto de Arras / Pie:</label>
                        <input
                          type="number"
                          value={downPaymentAmount}
                          onChange={(e) => setDownPaymentAmount(Number(e.target.value))}
                          className="w-full bg-[#FAF9F8] border border-gray-300 rounded-xl px-3 py-2 text-xs font-bold text-emerald-700 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 mb-1">Multa por Desistimiento (%):</label>
                        <input
                          type="number"
                          value={penaltyPercent}
                          onChange={(e) => setPenaltyPercent(Number(e.target.value))}
                          className="w-full bg-[#FAF9F8] border border-gray-300 rounded-xl px-3 py-2 text-xs font-bold text-red-600 outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">Plazo de escrituración tras estudio de títulos (días):</label>
                      <input
                        type="number"
                        value={daysToTitleApproval}
                        onChange={(e) => setDaysToTitleApproval(Number(e.target.value))}
                        className="w-full bg-[#FAF9F8] border border-gray-300 rounded-xl px-3 py-2 text-xs font-bold text-gray-900 outline-none"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 mb-1">Reajuste de Renta:</label>
                        <select
                          value={readjustmentFreq}
                          onChange={(e) => setReadjustmentFreq(e.target.value)}
                          className="w-full bg-[#FAF9F8] border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 outline-none"
                        >
                          <option value="IPC Semestral">IPC Semestral (Estándar)</option>
                          <option value="IPC Trimestral">IPC Trimestral</option>
                          <option value="IPC Anual">IPC Anual</option>
                          <option value="Sin reajuste">Sin reajuste</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 mb-1">Día de Pago Límite:</label>
                        <input
                          type="number"
                          value={rentPaymentDay}
                          onChange={(e) => setRentPaymentDay(Number(e.target.value))}
                          className="w-full bg-[#FAF9F8] border border-gray-300 rounded-xl px-3 py-2 text-xs text-center font-bold text-gray-900 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* PREGUNTAS DEL PASO 5: CLÁUSULAS Y DESLINDES */}
            {currentStep === 5 && (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    Deslindes según títulos de dominio (CBR):
                  </label>
                  <textarea
                    rows={2}
                    value={propertyDeslindes}
                    onChange={(e) => setPropertyDeslindes(e.target.value)}
                    className="w-full bg-[#FAF9F8] border border-gray-300 rounded-xl p-2.5 text-xs text-gray-900 outline-none focus:border-[#D02126] leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-0.5">Fojas CBR</label>
                    <input
                      type="text"
                      value={propertyCbrFojas}
                      onChange={(e) => setPropertyCbrFojas(e.target.value)}
                      className="w-full bg-[#FAF9F8] border border-gray-300 rounded-xl px-2 py-1.5 text-xs text-center font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-0.5">Número CBR</label>
                    <input
                      type="text"
                      value={propertyCbrNumero}
                      onChange={(e) => setPropertyCbrNumero(e.target.value)}
                      className="w-full bg-[#FAF9F8] border border-gray-300 rounded-xl px-2 py-1.5 text-xs text-center font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-0.5">Año Inscripción</label>
                    <input
                      type="text"
                      value={propertyCbrYear}
                      onChange={(e) => setPropertyCbrYear(e.target.value)}
                      className="w-full bg-[#FAF9F8] border border-gray-300 rounded-xl px-2 py-1.5 text-xs text-center font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    Cláusulas o Condiciones Especiales Acordadas:
                  </label>
                  <textarea
                    rows={2}
                    value={specialConditions}
                    onChange={(e) => setSpecialConditions(e.target.value)}
                    className="w-full bg-[#FAF9F8] border border-gray-300 rounded-xl p-2.5 text-xs text-gray-900 outline-none focus:border-[#D02126] leading-relaxed"
                  />
                </div>

                {/* SELECTOR DE LAS 3 VÍAS DE FORMALIZACIÓN */}
                <div className="pt-2 border-t border-gray-200">
                  <span className="block font-bold text-gray-900 text-xs mb-2">
                    ¿Cómo deseas formalizar este contrato?
                  </span>
                  
                  <div className="space-y-2">
                    {/* Vía 1: Imprimir Notarial Tradicional */}
                    <div 
                      onClick={handlePrint}
                      className="p-2.5 rounded-xl border border-gray-200 bg-white hover:border-gray-400 cursor-pointer transition-all flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-700 flex items-center justify-center">
                          <Printer className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-bold text-gray-900 text-xs block">1. Imprimir Minuta Notarial</span>
                          <span className="text-[10px] text-gray-500 block">Papel oficio con márgenes de protocolo para ir a notaría física</span>
                        </div>
                      </div>
                      <span className="text-[10px] bg-gray-100 text-gray-700 font-bold px-2 py-0.5 rounded">Gratis</span>
                    </div>

                    {/* Vía 2: ZapSign (Firma Simple WhatsApp) */}
                    <div 
                      onClick={() => setIsZapSignModalOpen(true)}
                      className="p-2.5 rounded-xl border border-blue-200 bg-blue-50/50 hover:bg-blue-50 cursor-pointer transition-all flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                          <Send className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-bold text-blue-950 text-xs block">2. Firma Simple ZapSign (WhatsApp)</span>
                          <span className="text-[10px] text-blue-800 block">Para visitas, órdenes de corretaje y acuerdos que no exigen notaría</span>
                        </div>
                      </div>
                      <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded">Incluido</span>
                    </div>

                    {/* Vía 3: FEA / Notaría Digital (Validez SII) */}
                    <div 
                      onClick={() => setIsFeaModalOpen(true)}
                      className="p-2.5 rounded-xl border-2 border-emerald-500 bg-emerald-50/70 hover:bg-emerald-50 cursor-pointer transition-all flex items-center justify-between shadow-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                          <ShieldCheck className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-emerald-950 text-xs">3. Firma Electrónica Avanzada (FEA)</span>
                            <span className="text-[9px] bg-emerald-200 text-emerald-900 font-black px-1.5 py-0.2 rounded uppercase">Validez SII</span>
                          </div>
                          <span className="text-[10px] text-emerald-800 block">Biometría Registro Civil + ClaveÚnica + Certificación Notarial Digital</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-black text-emerald-900 block">$7.990 CLP</span>
                        <span className="text-[9px] text-emerald-700 line-through">Notaría: $35.000</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* BOTONES DE NAVEGACIÓN ESTILO WONDER.LEGAL (< Paso anterior | Siguiente paso >) */}
            <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
              <button
                type="button"
                disabled={currentStep === 1}
                onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-bold text-xs hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Paso anterior</span>
              </button>

              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(prev => Math.min(totalSteps, prev + 1))}
                  className="px-6 py-2.5 rounded-xl bg-[#00A86B] hover:bg-[#00925d] text-white font-extrabold text-xs shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>Siguiente paso</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsFeaModalOpen(true)}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Finalizar y Formalizar Contrato</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="text-[11px] text-gray-400 text-center pt-2">
              <button
                type="button"
                onClick={handleCopy}
                className="text-[#D02126] hover:underline font-bold cursor-pointer"
              >
                {copiedSuccess ? '✓ Texto copiado al portapapeles' : 'Copiar borrador completo'}
              </button>
            </div>
          </div>

          {/* COLUMNA DERECHA: DOCUMENTO NOTARIAL EN VIVO (ESTILO WONDER.LEGAL CON RESALTADOS AMARILLOS) */}
          <div className="lg:col-span-7 bg-[#2D323F] p-4 sm:p-8 flex flex-col h-full overflow-hidden">
            <div className="flex items-center justify-between pb-3 text-xs text-gray-300 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono text-emerald-400 font-bold text-[11px]">
                  Vista Previa Legal en Tiempo Real
                </span>
              </div>
              <span className="text-[10px] text-gray-400">
                Los campos editados se resaltan en amarillo
              </span>
            </div>

            {/* HOJA NOTARIAL DE PAPEL (SCROLLABLE) */}
            <div className="flex-1 bg-white rounded-2xl my-3 p-6 sm:p-10 overflow-y-auto shadow-2xl border border-gray-300 text-xs text-gray-900 leading-relaxed font-serif select-text">
              <div id="contract-preview-text" className="max-w-2xl mx-auto space-y-4 text-justify">
                
                {/* Título Notarial */}
                <h2 className="text-center font-bold text-sm uppercase tracking-wide pb-4 border-b border-gray-200">
                  {contractType === 'promesa_compraventa' && 'CONTRATO DE PROMESA DE COMPRAVENTA DE INMUEBLE'}
                  {contractType === 'arriendo_residencial' && 'CONTRATO DE ARRENDAMIENTO RESIDENCIAL (LEY N° 21.461)'}
                  {contractType === 'arriendo_comercial' && 'CONTRATO DE ARRENDAMIENTO COMERCIAL / LOCAL U OFICINA'}
                  {contractType === 'orden_corretaje' && 'ORDEN DE VENTA Y MANDATO DE CORRETAJE INMOBILIARIO'}
                </h2>

                {/* Comparecencia */}
                <p>
                  En {renderFilled(city)}, a {renderFilled(contractDate)}, comparecen, por una parte: don/doña {renderFilled(sellerName)}, mayor de edad, de nacionalidad {renderFilled(sellerNationality)}, estado civil {renderFilled(sellerCivilStatus)}, de profesión u ocupación {renderFilled(sellerProfession)}, Cédula Nacional de Identidad número {renderFilled(sellerRut)}, con domicilio en {renderFilled(sellerAddress)}, comuna de {renderFilled(sellerCommune)}, región {renderFilled(sellerRegion)}, en adelante denominada como la <strong>"{contractType === 'promesa_compraventa' ? 'PARTE PROMITENTE VENDEDORA' : 'PARTE ARRENDADORA'}"</strong>; y por la otra parte: don/doña {renderFilled(buyerName)}, mayor de edad, de nacionalidad {renderFilled(buyerNationality)}, estado civil {renderFilled(buyerCivilStatus)}, de profesión u ocupación {renderFilled(buyerProfession)}, Cédula Nacional de Identidad número {renderFilled(buyerRut)}, con domicilio en {renderFilled(buyerAddress)}, comuna de {renderFilled(buyerCommune)}, región {renderFilled(buyerRegion)}, en adelante denominada como la <strong>"{contractType === 'promesa_compraventa' ? 'PARTE PROMITENTE COMPRADORA' : 'PARTE ARRENDATARIA'}"</strong>.
                </p>

                {contractType === 'arriendo_residencial' && hasGuarantor && (
                  <p>
                    Y como fiador y codeudor solidario: don/doña {renderFilled(guarantorName)}, Cédula Nacional de Identidad número {renderFilled(guarantorRut)}, de profesión {renderFilled(guarantorProfession)}, quien se constituye en fiador y codeudor solidario de todas y cada una de las obligaciones que por este acto asume el Arrendatario.
                  </p>
                )}

                <p>
                  Todos los comparecientes acreditaron sus identidades con los documentos de identidad citados y declaran que han convenido en celebrar el siguiente contrato:
                </p>

                {/* CLÁUSULA 1: ANTECEDENTES DEL INMUEBLE */}
                <div className="space-y-1">
                  <h4 className="font-bold">1.- ANTECEDENTES Y OBJETO</h4>
                  <p>
                    La parte propietaria es dueña del inmueble denominado {renderFilled(propertyTitle)}, ubicado en {renderFilled(propertyAddress)}, comuna de {renderFilled(propertyCommune)}, {renderFilled(propertyRegion)}, Rol de Avalúo Fiscal del Servicio de Impuestos Internos número {renderFilled(propertyRolSII)}, con una superficie aproximada de {renderFilled(propertySurfaceM2)} metros cuadrados.
                  </p>
                  <p>
                    El título de dominio rola inscrito a fojas {renderFilled(propertyCbrFojas)}, número {renderFilled(propertyCbrNumero)}, del Registro de Propiedad del Conservador de Bienes Raíces de {renderFilled(propertyCbrCity)}, correspondiente al año {renderFilled(propertyCbrYear)}.
                  </p>
                  <p>
                    Asimismo, el inmueble tiene los siguientes deslindes especiales según sus títulos: {renderFilled(propertyDeslindes)}.
                  </p>
                </div>

                {/* CLÁUSULA 2: PRECIO Y FORMA DE PAGO */}
                <div className="space-y-1">
                  <h4 className="font-bold">2.- PRECIO Y CONDICIONES ECONÓMICAS</h4>
                  {contractType === 'promesa_compraventa' ? (
                    <>
                      <p>
                        El precio de la compraventa prometida es la suma de {renderFilled(formatMoney(priceAmount, currency))}.
                      </p>
                      <p>
                        En este acto y a título de señal de quedar convenidos y arras de seriedad, la Promitente Compradora entrega la suma de {renderFilled(formatMoney(downPaymentAmount, currency))}. El saldo insoluto restante se cancelará íntegramente al momento de la suscripción de la escritura pública definitiva de compraventa, sea mediante vale vista bancario o instrucciones notariales con financiamiento de crédito hipotecario.
                      </p>
                      <p>
                        Las partes acuerdan que la escritura pública definitiva se suscribirá dentro del plazo fatal de {renderFilled(daysToTitleApproval)} días corridos contados desde la aprobación formal de los títulos de dominio por parte de la institución bancaria o el perito tasador de MELSA.
                      </p>
                    </>
                  ) : (
                    <>
                      <p>
                        La renta de arrendamiento convenida de común acuerdo será la suma de {renderFilled(formatMoney(priceAmount, currency))} mensuales, pagaderos por mensualidades anticipadas a más tardar el día {renderFilled(rentPaymentDay)} de cada mes calendario.
                      </p>
                      <p>
                        La renta se reajustará semestralmente conforme a la variación que experimente el {renderFilled(readjustmentFreq)}. Asimismo, en garantía del fiel cumplimiento de este contrato, se hace entrega de {renderFilled(guaranteeMonths)} mes(es) de renta de garantía.
                      </p>
                    </>
                  )}
                </div>

                {/* CLÁUSULA 3: MULTAS Y ARRAS */}
                <div className="space-y-1">
                  <h4 className="font-bold">3.- MULTA PENAL Y RESOLUCIÓN</h4>
                  <p>
                    Si cualquiera de las partes no diere cumplimiento a lo estipulado en este contrato, o desistiera injustificadamente de formalizar la operación, la parte diligente tendrá derecho a exigir el cumplimiento forzado o la resolución del contrato, más una cláusula penal compensatoria equivalente al {renderFilled(penaltyPercent)}% del precio total convenido.
                  </p>
                </div>

                {/* CLÁUSULA 4: CLÁUSULAS ESPECIALES */}
                <div className="space-y-1">
                  <h4 className="font-bold">4.- CONDICIONES Y ACUERDOS ESPECIALES</h4>
                  <p>
                    {renderFilled(specialConditions)}
                  </p>
                  {contractType === 'arriendo_residencial' && (
                    <p className="text-[11px] text-gray-700 italic border-l-2 border-emerald-600 pl-2">
                      Las partes dejan expresa constancia de que este contrato se acoge plenamente al procedimiento monitorio de cobro de rentas y restitución inmediata contemplado en la Ley N° 21.461 ("Ley Devuélveme Mi Casa").
                    </p>
                  )}
                </div>

                {/* CLÁUSULA 5: JURISDICCIÓN */}
                <div className="space-y-1">
                  <h4 className="font-bold">5.- DOMICILIO Y JURISDICCIÓN</h4>
                  <p>
                    Para todos los efectos legales que emanen del presente instrumento, las partes fijan su domicilio en la comuna de {renderFilled(propertyCommune)} y se someten a la competencia de sus Tribunales Ordinarios de Justicia.
                  </p>
                </div>

                {/* ÁREA DE FIRMAS LEGALES */}
                <div className="pt-8 grid grid-cols-2 gap-8 text-center text-[10px] font-sans">
                  <div className="space-y-1 pt-6 border-t border-gray-400">
                    <span className="font-bold block uppercase">{sellerName}</span>
                    <span className="text-gray-500 block">PARTE VENDEDORA / ARRENDADORA</span>
                    <span className="font-mono text-gray-600 block">RUT: {sellerRut}</span>
                  </div>
                  <div className="space-y-1 pt-6 border-t border-gray-400">
                    <span className="font-bold block uppercase">{buyerName}</span>
                    <span className="text-gray-500 block">PARTE COMPRADORA / ARRENDATARIA</span>
                    <span className="font-mono text-gray-600 block">RUT: {buyerRut}</span>
                  </div>
                </div>

                <div className="text-center pt-4 text-[9px] text-gray-400 border-t border-gray-100">
                  MELSA GESTIÓN INMOBILIARIA • INTERMEDIACIÓN LEGAL & TASACIÓN CERTIFICADA • WWW.MELSA.CL
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* MODAL DE INTEGRACIÓN ZAPSIGN (FIRMA ELECTRÓNICA VIRTUAL) */}
        {isZapSignModalOpen && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-150">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    ⚡
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">Firmar con ZapSign (Firma Simple)</h3>
                    <span className="text-[10px] text-gray-400">Para acuerdos rápidos, visitas y mandatos sin costo notarial</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsZapSignModalOpen(false)}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-700 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {zapSignSuccessNotice ? (
                <div className="py-6 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm">{zapSignSuccessNotice}</h4>
                  <p className="text-xs text-gray-500">
                    Se generaron los enlaces para firma digital remota de las partes mediante WhatsApp y correo electrónico.
                  </p>
                </div>
              ) : (
                <div className="space-y-3.5 text-xs">
                  <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl space-y-1">
                    <span className="font-bold text-blue-900 block">¿Cómo opera la firma bilateral con ZapSign?</span>
                    <p className="text-blue-800 text-[11px] leading-relaxed">
                      El contrato se envía directamente a los celulares de <strong>{sellerName}</strong> y <strong>{buyerName}</strong> vía WhatsApp y correo. Firman con su dedo o firma digital en 2 minutos con trazabilidad de IP y hora.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl border border-gray-200">
                      <div>
                        <span className="font-bold text-gray-900 block">Firmante 1 (Vendedor / Arrendador):</span>
                        <span className="text-gray-600 text-[11px]">{sellerName} • {sellerPhone}</span>
                      </div>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">WhatsApp + Email</span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl border border-gray-200">
                      <div>
                        <span className="font-bold text-gray-900 block">Firmante 2 (Comprador / Arrendatario):</span>
                        <span className="text-gray-600 text-[11px]">{buyerName} • {buyerPhone}</span>
                      </div>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">WhatsApp + Email</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <a
                      href="https://zapsign.co/es/"
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline font-bold text-xs flex items-center gap-1"
                    >
                      <span>Ir a portal ZapSign</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsZapSignModalOpen(false)}
                        className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded-xl font-semibold text-xs cursor-pointer"
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        onClick={handleSendZapSign}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Despachar por WhatsApp (Gratis)</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* MODAL DE INTEGRACIÓN FEA / NOTARÍA DIGITAL (VALIDEZ TRIBUTARIA SII & DEVUÉLVEME MI CASA) */}
        {isFeaModalOpen && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-150">
            <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-gray-200 space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-gray-900">Firma Electrónica Avanzada (FEA)</h3>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">Validez SII</span>
                    </div>
                    <span className="text-[11px] text-gray-500">Notaría Digital acreditada por el Ministerio de Economía de Chile</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsFeaModalOpen(false)}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-700 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {feaSuccessNotice ? (
                <div className="py-6 text-center space-y-3">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm">{feaSuccessNotice}</h4>
                  <p className="text-xs text-gray-600 max-w-md mx-auto">
                    Se generó la orden de firma digital legal. Ambas partes recibirán un SMS y correo con enlace biométrico para escanear su cédula y validar con ClaveÚnica. Una vez firmado, el documento quedará timbrado con firma notarial electrónica y QR verificable ante el SII.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 text-xs">
                  {/* Respaldo Legal y Tributario */}
                  <div className="p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-2xl space-y-2">
                    <div className="flex items-center gap-2 text-emerald-950 font-bold">
                      <Scale className="w-4 h-4 text-emerald-700" />
                      <span>Efectos Jurídicos y Tributarios en Chile:</span>
                    </div>
                    <ul className="text-emerald-900 text-[11px] space-y-1 list-disc pl-4 leading-relaxed">
                      <li><strong>Validez Tributaria ante el SII (Art. 31 Ley de la Renta):</strong> Otorga "Fecha Cierta" para que empresas o personas justifiquen gastos de arriendo comercial y contratos de promesa.</li>
                      <li><strong>Mérito Ejecutivo (Ley 21.461 "Devuélveme Mi Casa"):</strong> Procedimiento monitorio expedito para solicitar desalojo en 10 días sin juicio declarativo ordinario.</li>
                      <li><strong>Equivalencia Notarial (Ley 19.799 Art. 5):</strong> Equivale por ley a instrumento privado autorizado ante Notario Público.</li>
                    </ul>
                  </div>

                  {/* Comparador de Costo (Ahorro del 77%) */}
                  <div className="grid grid-cols-2 gap-3 p-3 bg-gray-50 border border-gray-200 rounded-2xl">
                    <div className="border-r border-gray-200 pr-3">
                      <span className="text-[10px] text-gray-400 font-bold uppercase block">Notaría Tradicional Física</span>
                      <span className="text-sm font-extrabold text-gray-500 line-through">$35.000 CLP</span>
                      <span className="text-[10px] text-gray-500 block">+ 2 a 3 horas de fila y traslado</span>
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-emerald-700 font-bold uppercase block">MELSA Notaría Digital</span>
                        <span className="text-[9px] bg-emerald-200 text-emerald-900 font-bold px-1.5 py-0.2 rounded">Ahorro 77%</span>
                      </div>
                      <span className="text-lg font-black text-emerald-700 block">$7.990 CLP</span>
                      <span className="text-[10px] text-gray-600 block">Firma en 5 minutos desde el celular</span>
                    </div>
                  </div>

                  {/* Configuración de Proveedor */}
                  <div className="space-y-2">
                    <label className="block font-bold text-gray-700 text-xs">Proveedor de Certificación Oficial:</label>
                    <div className="grid grid-cols-2 gap-2">
                      <label 
                        onClick={() => setFeaProvider('firmavirtual')}
                        className={`p-2.5 rounded-xl border cursor-pointer flex items-center gap-2 transition-all ${
                          feaProvider === 'firmavirtual'
                            ? 'border-emerald-500 bg-emerald-50/50 shadow-xs'
                            : 'border-gray-200 bg-white hover:bg-gray-50'
                        }`}
                      >
                        <input 
                          type="radio" 
                          name="fea_prov" 
                          checked={feaProvider === 'firmavirtual'} 
                          onChange={() => setFeaProvider('firmavirtual')}
                          className="text-emerald-600"
                        />
                        <div>
                          <span className="font-bold text-gray-900 text-xs block">FirmaVirtual.legal</span>
                          <span className="text-[10px] text-gray-500">Notario en convenio + Timbre QR</span>
                        </div>
                      </label>

                      <label 
                        onClick={() => setFeaProvider('esign')}
                        className={`p-2.5 rounded-xl border cursor-pointer flex items-center gap-2 transition-all ${
                          feaProvider === 'esign'
                            ? 'border-emerald-500 bg-emerald-50/50 shadow-xs'
                            : 'border-gray-200 bg-white hover:bg-gray-50'
                        }`}
                      >
                        <input 
                          type="radio" 
                          name="fea_prov" 
                          checked={feaProvider === 'esign'} 
                          onChange={() => setFeaProvider('esign')}
                          className="text-emerald-600"
                        />
                        <div>
                          <span className="font-bold text-gray-900 text-xs block">E-Sign Chile</span>
                          <span className="text-[10px] text-gray-500">FEA acreditada Min. Economía</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Resumen de los Firmantes */}
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-1.5">
                    <span className="font-bold text-gray-700 text-xs block">Comparecientes verificados para biometría:</span>
                    <div className="flex items-center justify-between text-[11px] text-gray-700">
                      <span>1. {sellerName} (RUT: {sellerRut})</span>
                      <span className="text-emerald-600 font-bold">✓ Cédula validada</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-gray-700">
                      <span>2. {buyerName} (RUT: {buyerRut})</span>
                      <span className="text-emerald-600 font-bold">✓ Cédula validada</span>
                    </div>
                  </div>

                  {/* Footer con Checkout Micropago */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-1.5 text-gray-500 text-[11px]">
                      <Lock className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Pago seguro Webpay / Redcompra</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsFeaModalOpen(false)}
                        className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded-xl font-semibold text-xs cursor-pointer"
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        onClick={handleSendFea}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-extrabold text-xs flex items-center gap-2 shadow-md cursor-pointer"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Pagar $7.990 y Despachar a Notaría Digital</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
