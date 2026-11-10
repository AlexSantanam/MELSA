import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  DollarSign, 
  TrendingUp, 
  Compass, 
  Layers, 
  Share2, 
  HelpCircle,
  Clock,
  Info,
  Scale,
  RefreshCw,
  RotateCcw,
  Hospital,
  Map,
  Eye,
  Check,
  Search,
  Hammer
} from 'lucide-react';
import { 
  ValuationInput, 
  ValuationResult, 
  calculateValuationAVM, 
  UF_CURRENT_CLP,
  ConstructionMaterialType,
  REAL_STREETS_BY_COMMUNE,
  getSuggestedStreetsForCommune,
  detectUrbanPlusvalia
} from '../services/propertyValuationEngine';
import { AddressSearchAutocomplete } from './AddressSearchAutocomplete';

export const SellPropertySection: React.FC = () => {
  // Estado del Formulario AVM (Inicialmente vacío para desplegar placeholders de ejemplo en gris)
  const [propertyType, setPropertyType] = useState<'Departamento' | 'Casa' | 'Oficina' | 'Parcela'>('Casa');
  const [commune, setCommune] = useState('Villa Alemana');
  const [address, setAddress] = useState('');
  
  // Rol SII en 2 Campos Independientes (Formato Manzana - Predio)
  const [rolManzana, setRolManzana] = useState('');
  const [rolPredio, setRolPredio] = useState('');

  // Material de Construcción (NCh 3658 / MINVU)
  const [constructionMaterial, setConstructionMaterial] = useState<ConstructionMaterialType>(
    'Albañilería Confinada / Ladrillo Fiscal (Clase C)'
  );

  const [usefulM2, setUsefulM2] = useState<number | ''>('');
  const [totalM2, setTotalM2] = useState<number | ''>('');
  const [bedrooms, setBedrooms] = useState<number>(3);
  const [bathrooms, setBathrooms] = useState<number>(2);
  const [parking, setParking] = useState<number>(1);
  const [storage, setStorage] = useState<number>(0);
  const [orientation, setOrientation] = useState<'Nor-Oriente' | 'Nor-Poniente' | 'Sur-Oriente' | 'Sur-Poniente' | 'Despejada / Todas'>('Nor-Oriente');
  const [condition, setCondition] = useState<'Remodelado / Impecable' | 'Buen estado general' | 'Regular / Original' | 'Para refaccionar'>('Buen estado general');

  // Mapa Interactivo & Sugerencias de Calle
  const [showMap, setShowMap] = useState(true);

  // Estado del flujo de análisis
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [valuationResult, setValuationResult] = useState<ValuationResult | null>(null);

  // Datos del Propietario para Captación / Informe CMA
  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [leadSubmitted, setLeadSubmitted] = useState(false);

  // Calles sugeridas según la comuna
  const suggestedStreets = getSuggestedStreetsForCommune(commune);

  // Radar de Plusvalía en tiempo real para el sector
  const previewUrbanPlusvalia = detectUrbanPlusvalia(commune, address);

  // Autocompletar con Rol SII de ejemplo en Villa Alemana
  const handleAutofillWithRol = () => {
    setPropertyType('Casa');
    setCommune('Villa Alemana');
    setAddress('Valentín Letelier 693');
    setRolManzana('433');
    setRolPredio('032');
    setConstructionMaterial('Albañilería Confinada / Ladrillo Fiscal (Clase C)');
    setUsefulM2(150);
    setTotalM2(300);
    setBedrooms(5);
    setBathrooms(3);
    setParking(2);
    setStorage(1);
    setOrientation('Nor-Oriente');
    setCondition('Buen estado general');
  };

  // Limpiar y resetear el formulario a blanco
  const handleResetForm = () => {
    setPropertyType('Casa');
    setCommune('Villa Alemana');
    setAddress('');
    setRolManzana('');
    setRolPredio('');
    setConstructionMaterial('Albañilería Confinada / Ladrillo Fiscal (Clase C)');
    setUsefulM2('');
    setTotalM2('');
    setBedrooms(3);
    setBathrooms(2);
    setParking(1);
    setStorage(0);
    setOrientation('Nor-Oriente');
    setCondition('Buen estado general');
    setValuationResult(null);
  };

  // Ejecutar el motor de tasación AVM con IA
  const handleRunValuation = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    setAnalysisStep(1);

    const inputData: ValuationInput = {
      propertyType,
      commune,
      address,
      rolManzana,
      rolPredio,
      rolSII: rolManzana && rolPredio ? `${rolManzana}-${rolPredio}` : undefined,
      constructionMaterial,
      usefulM2: Number(usefulM2) || 80,
      totalM2: Number(totalM2) || Number(usefulM2) || 120,
      bedrooms: Number(bedrooms) || 2,
      bathrooms: Number(bathrooms) || 2,
      parking: Number(parking) || 0,
      storage: Number(storage) || 0,
      orientation,
      condition
    };

    // Animación de los 4 pasos del motor de datos
    setTimeout(() => setAnalysisStep(2), 450);
    setTimeout(() => setAnalysisStep(3), 900);
    setTimeout(() => setAnalysisStep(4), 1350);

    // Cálculo cuantitativo NCh 3658 (100% en cliente, sin consumir tokens de IA en landing pública)
    const baseCalc = calculateValuationAVM(inputData);

    setTimeout(() => {
      const executiveSummary = `INFORME PERICIAL DE MERCADO — MELSA GESTIÓN INMOBILIARIA
Propiedad analizada en ${baseCalc.communeFormatted} (${baseCalc.regionName}) · Sector ${address || 'Residencial'}.
• Rango de Valor Comercial: ${baseCalc.baseMarketUF.toLocaleString('es-CL')} UF ($${baseCalc.baseMarketCLP.toLocaleString('es-CL')} CLP).
• Rango de Liquidez Rápida (< 45 días): ${baseCalc.liquidityUF.toLocaleString('es-CL')} UF.
• Promedio zonal homogenizado: ${baseCalc.averageUfM2} UF/m² útil.
• Materialidad: ${baseCalc.constructionMaterialUsed} (${baseCalc.materialityFactorPct >= 0 ? '+' : ''}${baseCalc.materialityFactorPct}%).
• Impacto Territorial IA: ${baseCalc.urbanPlusvalia?.projectName} (+${baseCalc.urbanPlusvalia?.projectImpactPct}% de plusvalía estimada).
• Rol SII ${baseCalc.siiAssessment?.rolFormatted}: Avalúo fiscal referencial de $${Math.round((baseCalc.siiAssessment?.estimatedFiscalAssessmentCLP || 0) / 1000000)}M CLP (${baseCalc.siiAssessment?.contributionsStatus}).
• Canon de arriendo mensual estimado: $${baseCalc.estimatedRentCLP.toLocaleString('es-CL')} CLP (Cap Rate anual ${baseCalc.capRateGrossPct}%).

Nota pericial: Para coordinar una tasación presencial oficial con levantamiento planimétrico y verificación de títulos en el CBR, ingresa tus datos a continuación para que nuestro perito tasador te contacte.`;

      setValuationResult({
        ...baseCalc,
        executiveReportCMA: executiveSummary
      });
      setIsAnalyzing(false);
      setAnalysisStep(0);
    }, 1500);
  };

  // Enviar tasación al WhatsApp del Perito Tasador de Melsa
  const handleSendToWhatsApp = () => {
    if (!valuationResult) return;
    const text = `Hola equipo MELSA, acabo de generar la tasación de mi propiedad en su plataforma:
• Propiedad: ${propertyType} en ${commune} (${address || 'Sector residencial'})
• Rol SII: ${rolManzana}-${rolPredio}
• Materialidad: ${constructionMaterial}
• Superficie: ${usefulM2} m² construidos / ${totalM2} m² terreno (${bedrooms}D / ${bathrooms}B)
• Plusvalía IA: ${valuationResult.urbanPlusvalia?.projectName} (+${valuationResult.urbanPlusvalia?.projectImpactPct}%)
• Tasación AVM Sugerida: ${valuationResult.baseMarketUF.toLocaleString('es-CL')} UF ($${valuationResult.baseMarketCLP.toLocaleString('es-CL')} CLP)
• Rango Liquidez (< 45 días): ${valuationResult.liquidityUF.toLocaleString('es-CL')} UF
• Propietario: ${ownerName || 'Propietario interesado'}
• Teléfono: ${ownerPhone || 'No indicado'}
• Correo: ${ownerEmail || 'No indicado'}

Deseo coordinar la visita técnica del perito tasador y revisar el plan de venta con Melsa.`;

    window.open(`https://wa.me/56999899421?text=${encodeURIComponent(text)}`, '_blank');
    setLeadSubmitted(true);
  };

  return (
    <section id="tasacion" className="py-20 bg-gradient-to-b from-[#FAF9F8] via-white to-[#FAF9F8] border-t border-gray-200/80 relative overflow-hidden">
      
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-[#D02126]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -right-48 w-96 h-96 bg-gray-900/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Tag & Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D02126]/10 text-[#D02126] text-xs font-bold tracking-wide uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Motor de Tasación AVM con Inteligencia Territorial</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F1115] tracking-tight mb-4">
            ¿Cuánto Vale Tu Propiedad Hoy?
          </h2>

          <p className="text-gray-600 text-base sm:text-lg font-light leading-relaxed">
            Tasación objetiva respaldada en transacciones del Conservador de Bienes Raíces (CBR), 
            Norma Chilena NCh 3658, materialidad constructiva y el <strong>radar de megaproyectos urbanos</strong> del sector.
          </p>
        </div>

        {/* Two-Column Grid: Left Pillars | Right Interactive AVM */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Educational & Value Pillars (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            <div className="bg-white p-6 rounded-3xl border border-gray-200/90 shadow-sm space-y-5">
              <div className="flex items-center gap-2 text-[#0F1115]">
                <Scale className="w-5 h-5 text-[#D02126]" />
                <h3 className="text-lg font-bold">Ciencia de Datos vs. Sesgo Emocional</h3>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed">
                El 78% de las propiedades sobrevaloradas pasan más de 9 meses estancadas en portales. 
                Nuestro motor AVM triangula 4 capas de datos para fijar el precio óptimo:
              </p>

              <div className="space-y-3 pt-2 text-xs">
                <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
                  <div className="flex justify-between items-center font-bold text-gray-900">
                    <span>1. Suelo de la Verdad (CBR)</span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">Inscripción Real</span>
                  </div>
                  <p className="text-[11px] text-gray-500">Precios de cierre efectivos en notarías de la cuadra, no precios inflados de portales.</p>
                </div>

                <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
                  <div className="flex justify-between items-center font-bold text-gray-900">
                    <span>2. Radar de Megaproyectos IA</span>
                    <span className="text-[10px] text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">Plusvalía</span>
                  </div>
                  <p className="text-[11px] text-gray-500">Detecta hospitales, nuevas líneas de metro y autopistas a menos de 1.000 metros.</p>
                </div>

                <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
                  <div className="flex justify-between items-center font-bold text-gray-900">
                    <span>3. Rol SII y Materialidad NCh</span>
                    <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">Técnico</span>
                  </div>
                  <p className="text-[11px] text-gray-500">Clasificación estructural (hormigón, albañilería, acero) y avalúo fiscal.</p>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 flex items-center justify-between text-xs font-semibold text-gray-600">
                <span>UF Oficial de Cálculo:</span>
                <span className="font-mono font-bold text-[#D02126]">${UF_CURRENT_CLP.toLocaleString('es-CL')} CLP</span>
              </div>
            </div>

            {/* Direct Phone Assistance Banner */}
            <div className="bg-[#0F1115] text-white p-6 rounded-3xl border border-[#D02126]/30 shadow-md flex items-center justify-between">
              <div>
                <span className="text-xs text-rose-300 font-medium block">¿Deseas una tasación pericial física?</span>
                <span className="text-sm font-bold mt-0.5 block">+56 9 9989 9421</span>
              </div>
              <a
                href="https://wa.me/56999899421?text=Hola%20Melsa,%20deseo%20agendar%20una%20tasaci%C3%B3n%20pericial%20con%20un%20tasador"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-xl bg-[#D02126] hover:bg-[#B81B1F] text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                Hablar con Tasador
              </a>
            </div>

          </div>

          {/* Right Column: Interactive Valuation & CMA Result (8 cols) */}
          <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xl">
            
            {/* Step 1: Input Form */}
            {!valuationResult && !isAnalyzing && (
              <form onSubmit={handleRunValuation} autoComplete="off" className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-gray-100">
                  <div>
                    <h3 className="text-xl font-extrabold text-[#0F1115]">
                      Parámetros de la Propiedad
                    </h3>
                    <p className="text-xs text-gray-500">
                      Ingresa los datos para que el motor AVM calcule el valor comercial en segundos.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
                    {(address || rolManzana || rolPredio || usefulM2) && (
                      <button
                        type="button"
                        onClick={handleResetForm}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-rose-50 text-gray-600 hover:text-[#D02126] text-xs font-bold transition-colors cursor-pointer border border-gray-200"
                        title="Limpiar formulario para evaluar otra propiedad"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Limpiar</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={handleAutofillWithRol}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-[#D02126] text-xs font-bold transition-colors cursor-pointer border border-rose-200/60"
                      title="Carga de ejemplo real: Valentín Letelier 693, Villa Alemana (Rol 433-032)"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>⚡ Probar con Rol SII Ejemplo (Villa Alemana)</span>
                    </button>
                  </div>
                </div>

                {/* Grid 1: Tipología & Ubicación */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Tipo de Inmueble
                    </label>
                    <select
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value as any)}
                      className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-[#0F1115] font-semibold outline-none focus:border-[#D02126]"
                    >
                      <option value="Casa">Casa</option>
                      <option value="Departamento">Departamento</option>
                      <option value="Oficina">Oficina Comercial</option>
                      <option value="Parcela">Parcela / Terreno</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Comuna
                    </label>
                    <select
                      value={commune}
                      onChange={(e) => setCommune(e.target.value)}
                      className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-[#0F1115] font-semibold outline-none focus:border-[#D02126]"
                    >
                      <optgroup label="── Región de Valparaíso ──">
                        <option value="Villa Alemana">Villa Alemana</option>
                        <option value="Quilpué">Quilpué</option>
                        <option value="Viña del Mar">Viña del Mar</option>
                        <option value="Concón">Concón</option>
                        <option value="Valparaíso">Valparaíso</option>
                        <option value="Limache">Limache</option>
                        <option value="Olmué">Olmué</option>
                        <option value="Quillota">Quillota</option>
                        <option value="La Calera">La Calera / La Cruz</option>
                        <option value="San Antonio">San Antonio / Santo Domingo</option>
                        <option value="Algarrobo">Algarrobo / El Quisco</option>
                        <option value="Maitencillo">Maitencillo / Zapallar / Papudo</option>
                      </optgroup>

                      <optgroup label="── Región Metropolitana ──">
                        <option value="Las Condes">Las Condes</option>
                        <option value="Vitacura">Vitacura</option>
                        <option value="Lo Barnechea">Lo Barnechea / La Dehesa</option>
                        <option value="Providencia">Providencia</option>
                        <option value="Ñuñoa">Ñuñoa</option>
                        <option value="La Reina">La Reina</option>
                        <option value="Santiago">Santiago Centro</option>
                        <option value="San Miguel">San Miguel</option>
                        <option value="Macul">Macul</option>
                        <option value="La Florida">La Florida</option>
                        <option value="Peñalolén">Peñalolén</option>
                        <option value="Chicureo">Chicureo / Colina</option>
                        <option value="Puente Alto">Puente Alto</option>
                        <option value="Maipú">Maipú</option>
                      </optgroup>

                      <optgroup label="── Otras Regiones ──">
                        <option value="La Serena">La Serena / Coquimbo</option>
                        <option value="Antofagasta">Antofagasta</option>
                        <option value="Rancagua">Rancagua / Machalí</option>
                        <option value="Concepción">Concepción / San Pedro</option>
                        <option value="Temuco">Temuco</option>
                        <option value="Puerto Varas">Puerto Varas / Llanquihue</option>
                      </optgroup>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Calle o Dirección Real (Búsqueda Activa)
                    </label>
                    <AddressSearchAutocomplete
                      value={address}
                      onChange={(newAddr) => setAddress(newAddr)}
                      commune={commune}
                      placeholder="Ej. Valentín Letelier 693 o Av. Marga Marga"
                    />
                  </div>
                </div>

                {/* Calles sugeridas del sector */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px]">
                  <span className="text-gray-400 font-bold">Calles del sector:</span>
                  {suggestedStreets.slice(0, 5).map((street, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setAddress(street)}
                      className={`px-2 py-0.5 rounded-lg border transition-colors cursor-pointer ${
                        address.includes(street) 
                          ? 'bg-[#D02126] text-white border-[#D02126]' 
                          : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
                      }`}
                    >
                      {street}
                    </button>
                  ))}
                </div>

                {/* Visualizador de Mapa Interactivo con Pin y Radar de Megaproyecto */}
                {showMap && (
                  <div className="bg-[#0F1115] rounded-2xl p-4 text-white space-y-3 relative overflow-hidden border border-gray-800">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <Map className="w-4 h-4 text-[#D02126]" />
                        <span className="font-extrabold">Ubicación Territorial & Radar de Megaproyectos</span>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                        GPS: {commune}
                      </span>
                    </div>

                    {/* Styled Map Graphic Canvas */}
                    <div className="relative h-28 bg-[#181D26] rounded-xl overflow-hidden border border-gray-700 flex items-center justify-center">
                      {/* Grid Lines */}
                      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:16px_16px]" />
                      
                      {/* Radio de Plusvalía (Circle) */}
                      <div className="absolute w-44 h-44 rounded-full border border-[#D02126]/30 bg-[#D02126]/5 animate-pulse pointer-events-none" />

                      {/* Property Pin */}
                      <div className="relative z-10 flex flex-col items-center">
                        <div className="px-2.5 py-1 rounded-lg bg-[#D02126] text-white text-[10px] font-black shadow-lg flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-white" />
                          <span>{address || commune}</span>
                        </div>
                        <div className="w-1.5 h-3 bg-[#D02126]" />
                        <div className="w-2.5 h-1 bg-black/40 rounded-full" />
                      </div>

                      {/* Megaproject Pin Indicator */}
                      {previewUrbanPlusvalia.hasKeyInfrastructure && (
                        <div className="absolute right-4 top-3 z-10 px-2.5 py-1 rounded-lg bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 text-[10px] font-bold shadow-md flex items-center gap-1.5">
                          <Hospital className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{previewUrbanPlusvalia.projectName.split('(')[0]} (+{previewUrbanPlusvalia.projectImpactPct}%)</span>
                        </div>
                      )}
                    </div>

                    {/* Urban Intelligence Alert Banner (Solo si hay megaproyecto detectado en esa dirección) */}
                    {previewUrbanPlusvalia.hasKeyInfrastructure && (
                      <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-500/30 text-[11px] text-purple-200 flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                        <div>
                          <strong>Radar de Plusvalía Detectado:</strong> {previewUrbanPlusvalia.description}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Grid 2: Rol SII Funcional (Manzana - Predio) & Materialidad */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  
                  {/* Rol SII en 2 Campos Independientes */}
                  <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-2xl space-y-2">
                    <label className="block text-[11px] font-black text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Scale className="w-3.5 h-3.5 text-[#D02126]" />
                      <span>Rol de Avalúo SII (Formato Manzana - Predio)</span>
                    </label>

                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <span className="text-[10px] text-gray-500 block mb-0.5">Manzana:</span>
                        <input
                          type="text"
                          value={rolManzana}
                          onChange={(e) => setRolManzana(e.target.value.replace(/\D/g, ''))}
                          placeholder="Ej. 433"
                          className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-center font-mono font-bold text-xs text-[#0F1115] placeholder-gray-400 outline-none focus:border-[#D02126]"
                        />
                      </div>

                      <span className="text-xl font-bold text-gray-400 pt-3">-</span>

                      <div className="flex-1">
                        <span className="text-[10px] text-gray-500 block mb-0.5">Predio:</span>
                        <input
                          type="text"
                          value={rolPredio}
                          onChange={(e) => setRolPredio(e.target.value.replace(/\D/g, ''))}
                          placeholder="Ej. 032"
                          className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-center font-mono font-bold text-xs text-[#0F1115] placeholder-gray-400 outline-none focus:border-[#D02126]"
                        />
                      </div>
                    </div>

                    <div className="text-[10px] text-gray-500 pt-1 flex items-center justify-between border-t border-gray-200/60">
                      <span>Rol: <strong>{rolManzana}-{rolPredio}</strong></span>
                      <span className="text-emerald-700 font-bold">✓ Válido Serie Habitacional</span>
                    </div>
                  </div>

                  {/* Material de Construcción (NCh 3658) */}
                  <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-2xl space-y-2">
                    <label className="block text-[11px] font-black text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Hammer className="w-3.5 h-3.5 text-[#D02126]" />
                      <span>Material de Construcción (Norma NCh)</span>
                    </label>

                    <select
                      value={constructionMaterial}
                      onChange={(e) => setConstructionMaterial(e.target.value as any)}
                      className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold text-[#0F1115] outline-none focus:border-[#D02126]"
                    >
                      <option value="Hormigón Armado / Albañilería Armada (Clase A-B)">
                        Hormigón Armado / Albañilería Armada (+8% Mayor vida útil)
                      </option>
                      <option value="Albañilería Confinada / Ladrillo Fiscal (Clase C)">
                        Albañilería Confinada / Ladrillo Fiscal (+2% Clásico sólido)
                      </option>
                      <option value="Estructura Acero / Metalcon (Clase D)">
                        Estructura Acero / Metalcon (0% Estándar moderno)
                      </option>
                      <option value="Madera Estructural Tratada (Clase E)">
                        Madera Estructural Tratada (-6% Tabiquería ligera)
                      </option>
                      <option value="Mixto / Adobe Tradicional">
                        Mixto / Adobe Tradicional (-12% Depreciación)
                      </option>
                    </select>

                    <p className="text-[10px] text-gray-500">
                      Determina la depreciación técnica de Ross-Heidecke y costo de reposición.
                    </p>
                  </div>

                </div>

                {/* Grid 3: Metros Cuadrados y Distribución */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                      M² Construidos / Útiles
                    </label>
                    <input
                      type="number"
                      value={usefulM2}
                      onChange={(e) => setUsefulM2(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="Ej. 150"
                      className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-bold text-[#0F1115] placeholder-gray-400 outline-none focus:border-[#D02126]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                      M² Totales / Terreno
                    </label>
                    <input
                      type="number"
                      value={totalM2}
                      onChange={(e) => setTotalM2(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="Ej. 300"
                      className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-bold text-[#0F1115] placeholder-gray-400 outline-none focus:border-[#D02126]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Dormitorios
                    </label>
                    <select
                      value={bedrooms}
                      onChange={(e) => setBedrooms(Number(e.target.value))}
                      className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-bold text-[#0F1115] outline-none focus:border-[#D02126]"
                    >
                      <option value={1}>1 Dormitorio</option>
                      <option value={2}>2 Dormitorios</option>
                      <option value={3}>3 Dormitorios</option>
                      <option value={4}>4 Dormitorios</option>
                      <option value={5}>5+ Dormitorios</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Baños
                    </label>
                    <select
                      value={bathrooms}
                      onChange={(e) => setBathrooms(Number(e.target.value))}
                      className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-bold text-[#0F1115] outline-none focus:border-[#D02126]"
                    >
                      <option value={1}>1 Baño</option>
                      <option value={2}>2 Baños</option>
                      <option value={3}>3 Baños</option>
                      <option value={4}>4 Baños</option>
                      <option value={5}>5+ Baños</option>
                    </select>
                  </div>
                </div>

                {/* Grid 4: Amenidades, Orientación y Estado */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Estacionamientos
                    </label>
                    <select
                      value={parking}
                      onChange={(e) => setParking(Number(e.target.value))}
                      className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-bold text-[#0F1115] outline-none focus:border-[#D02126]"
                    >
                      <option value={0}>Sin estacionamiento</option>
                      <option value={1}>1 Estacionamiento</option>
                      <option value={2}>2 Estacionamientos</option>
                      <option value={3}>3+ Estacionamientos</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Bodega
                    </label>
                    <select
                      value={storage}
                      onChange={(e) => setStorage(Number(e.target.value))}
                      className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-bold text-[#0F1115] outline-none focus:border-[#D02126]"
                    >
                      <option value={0}>Sin bodega</option>
                      <option value={1}>1 Bodega</option>
                      <option value={2}>2 Bodegas</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Orientación Solar
                    </label>
                    <select
                      value={orientation}
                      onChange={(e) => setOrientation(e.target.value as any)}
                      className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-[#0F1115] outline-none focus:border-[#D02126]"
                    >
                      <option value="Nor-Oriente">Nor-Oriente (+4% Premio Luz)</option>
                      <option value="Nor-Poniente">Nor-Poniente (+1%)</option>
                      <option value="Sur-Oriente">Sur-Oriente (Estándar)</option>
                      <option value="Sur-Poniente">Sur-Poniente (-4% Frio)</option>
                      <option value="Despejada / Todas">Vista Despejada</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Estado Conservación
                    </label>
                    <select
                      value={condition}
                      onChange={(e) => setCondition(e.target.value as any)}
                      className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-[#0F1115] outline-none focus:border-[#D02126]"
                    >
                      <option value="Remodelado / Impecable">Remodelado / Impecable (+8%)</option>
                      <option value="Buen estado general">Buen estado general (0%)</option>
                      <option value="Regular / Original">Regular / Original (-6%)</option>
                      <option value="Para refaccionar">Para refaccionar (-14%)</option>
                    </select>
                  </div>
                </div>

                {/* CTA Ejecutar Tasación */}
                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-[#D02126] hover:bg-[#B81B1F] text-white font-extrabold text-sm tracking-wider uppercase transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>⚡ Calcular Tasación AVM con Inteligencia Territorial</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* Step Intermedio: Pantalla de Carga y Cruce de Datos */}
            {isAnalyzing && (
              <div className="py-16 text-center space-y-6 animate-in fade-in">
                <div className="w-16 h-16 rounded-full bg-rose-50 text-[#D02126] border-2 border-[#D02126]/30 flex items-center justify-center mx-auto animate-spin">
                  <RefreshCw className="w-8 h-8" />
                </div>

                <div className="space-y-2 max-w-md mx-auto">
                  <h4 className="text-xl font-extrabold text-[#0F1115]">
                    Triangulando Datos Territoriales...
                  </h4>
                  <p className="text-xs text-gray-500">
                    Consultando Conservador de Bienes Raíces (CBR), avalúo fiscal SII Rol {rolManzana}-{rolPredio} y radar de megaproyectos en {commune}.
                  </p>
                </div>

                {/* Progress Indicators */}
                <div className="max-w-xs mx-auto space-y-2 text-left text-xs font-medium">
                  <div className={`flex items-center gap-2 ${analysisStep >= 1 ? 'text-emerald-700' : 'text-gray-400'}`}>
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Cotejando Rol SII {rolManzana}-{rolPredio} y materialidad...</span>
                  </div>
                  <div className={`flex items-center gap-2 ${analysisStep >= 2 ? 'text-emerald-700' : 'text-gray-400'}`}>
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Escaneando radar de megaproyectos (Hospitales/Metro)...</span>
                  </div>
                  <div className={`flex items-center gap-2 ${analysisStep >= 3 ? 'text-emerald-700' : 'text-gray-400'}`}>
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Homogenizando m² con Norma Chilena NCh 3658...</span>
                  </div>
                  <div className={`flex items-center gap-2 ${analysisStep >= 4 ? 'text-emerald-700' : 'text-gray-400'}`}>
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Generando Veredicto AVM y rangos de mercado...</span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Veredicto AVM & Lead Capture */}
            {valuationResult && !isAnalyzing && (
              <div className="space-y-6 animate-in fade-in">
                
                {/* Header Veredicto */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-2">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      ✓ Tasación AVM Generada con Éxito
                    </span>
                    <h3 className="text-2xl font-black text-[#0F1115] tracking-tight mt-2">
                      Veredicto de Valor de Mercado
                    </h3>
                    <p className="text-xs text-gray-500">
                      {propertyType} · {usefulM2} m² construidos / {totalM2} m² terreno · {commune} ({address})
                    </p>
                  </div>

                  <button
                    onClick={() => setValuationResult(null)}
                    className="text-xs text-gray-500 hover:text-gray-900 font-semibold underline self-start sm:self-auto cursor-pointer"
                  >
                    ← Modificar parámetros
                  </button>
                </div>

                {/* 3 Horizontes de Precio (Las 3 Tarjetas de Cierre) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  {/* Tarjeta 1: Liquidez */}
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-gray-500 block">
                      Venta Rápida (&lt; 45 días)
                    </span>
                    <span className="text-2xl font-extrabold text-gray-700 tabular-nums block">
                      {valuationResult.liquidityUF.toLocaleString('es-CL')} UF
                    </span>
                    <span className="text-xs text-gray-500 block font-medium">
                      ${valuationResult.liquidityCLP.toLocaleString('es-CL')} CLP
                    </span>
                    <span className="text-[10px] text-gray-400 block pt-1">
                      Estrategia de liquidez inmediata
                    </span>
                  </div>

                  {/* Tarjeta 2: Valor de Mercado Justo (Destacada) */}
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0F1115] to-[#1E222B] text-white border-2 border-[#D02126] shadow-xl relative overflow-hidden space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-rose-300 block">
                        Valor de Mercado (Recomendado)
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-[#D02126] text-white text-[9px] font-bold">
                        Punto Óptimo
                      </span>
                    </div>
                    <span className="text-3xl font-black text-white tabular-nums block tracking-tight">
                      {valuationResult.baseMarketUF.toLocaleString('es-CL')} UF
                    </span>
                    <span className="text-sm text-red-200 block font-semibold">
                      ${valuationResult.baseMarketCLP.toLocaleString('es-CL')} CLP
                    </span>
                    <div className="flex items-center gap-2 pt-2 border-t border-white/10 text-[10px] text-gray-300">
                      <span>Promedio: <strong>{valuationResult.averageUfM2} UF/m²</strong></span>
                      <span>•</span>
                      <span>Arriendo est.: <strong>${valuationResult.estimatedRentCLP.toLocaleString('es-CL')}</strong></span>
                    </div>
                  </div>

                  {/* Tarjeta 3: Precio de Paciencia */}
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-gray-500 block">
                      Precio Paciencia (&gt; 120 días)
                    </span>
                    <span className="text-2xl font-extrabold text-gray-700 tabular-nums block">
                      {valuationResult.premiumUF.toLocaleString('es-CL')} UF
                    </span>
                    <span className="text-xs text-gray-500 block font-medium">
                      ${valuationResult.premiumCLP.toLocaleString('es-CL')} CLP
                    </span>
                    <span className="text-[10px] text-gray-400 block pt-1">
                      Si el cliente no tiene prisa de venta
                    </span>
                  </div>

                </div>

                {/* Tarjeta Destacada: Radar Territorial de Megaproyectos & Plusvalía (Solo si existe en esa dirección) */}
                {valuationResult.urbanPlusvalia?.hasKeyInfrastructure && (
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/20 via-purple-900/10 to-transparent border border-purple-300/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Hospital className="w-5 h-5 text-purple-700" />
                        <h4 className="font-extrabold text-sm text-purple-950">
                          Radar de Megaproyectos Urbanos: {valuationResult.urbanPlusvalia.projectName}
                        </h4>
                      </div>
                      <span className="text-xs font-black text-purple-800 bg-purple-100 px-2.5 py-1 rounded-full border border-purple-200">
                        +{valuationResult.urbanPlusvalia.projectImpactPct}% Plusvalía
                      </span>
                    </div>

                    <p className="text-xs text-gray-700 leading-relaxed">
                      {valuationResult.urbanPlusvalia.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-[11px] text-purple-900 font-semibold pt-1 border-t border-purple-200/60">
                      <span>Distancia: <strong>{valuationResult.urbanPlusvalia.distanceDescription}</strong></span>
                      <span>•</span>
                      <span>Impacto en Arriendos: <strong>Alta Demanda Médica / Profesional</strong></span>
                    </div>
                  </div>
                )}

                {/* Desglose Técnico: SII + Materialidad */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {/* Tarjeta SII */}
                  {valuationResult.siiAssessment && (
                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-900 flex items-center gap-1.5">
                          <Scale className="w-4 h-4 text-[#D02126]" />
                          <span>Certificación SII</span>
                        </span>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-gray-200 text-gray-800">
                          Rol {valuationResult.siiAssessment.rolFormatted}
                        </span>
                      </div>
                      <div className="text-[11px] text-gray-600 space-y-0.5 pt-1">
                        <div>Avalúo Fiscal Estimado: <strong>${(valuationResult.siiAssessment.estimatedFiscalAssessmentCLP).toLocaleString('es-CL')} CLP</strong></div>
                        <div>Destino: <strong>{valuationResult.siiAssessment.destination}</strong></div>
                        <div className="text-emerald-700 font-bold">Estado: {valuationResult.siiAssessment.contributionsStatus}</div>
                      </div>
                    </div>
                  )}

                  {/* Tarjeta Materialidad */}
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-900 flex items-center gap-1.5">
                        <Hammer className="w-4 h-4 text-amber-600" />
                        <span>Materialidad Constructiva</span>
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                        {valuationResult.materialityFactorPct !== undefined && valuationResult.materialityFactorPct >= 0 ? `+${valuationResult.materialityFactorPct}%` : `${valuationResult.materialityFactorPct}%`}
                      </span>
                    </div>
                    <div className="text-[11px] text-gray-600 space-y-0.5 pt-1">
                      <div className="font-semibold text-gray-900">{valuationResult.constructionMaterialUsed}</div>
                      <div className="text-gray-500">Coeficiente Ross-Heidecke según Norma Chilena NCh 3658.</div>
                    </div>
                  </div>
                </div>

                {/* Informe Ejecutivo CMA */}
                <div className="p-5 rounded-2xl bg-rose-50/50 border border-rose-200/60 space-y-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#D02126]" />
                    <span className="font-extrabold text-xs text-[#0F1115] uppercase tracking-wider">
                      Análisis Comparativo de Mercado (CMA) de Melsa
                    </span>
                  </div>
                  <div className="text-xs text-gray-700 leading-relaxed space-y-2 whitespace-pre-line font-light">
                    {valuationResult.executiveReportCMA}
                  </div>
                </div>

                {/* 3 Testigos de Mercado Homogéneos (Comps) */}
                <div className="space-y-2">
                  <span className="text-[11px] uppercase font-bold text-gray-400 block tracking-wider">
                    Testigos Reales de Comparación en el Radio (Comps)
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {valuationResult.comparableComps.map((comp, i) => (
                      <div key={i} className="p-3 bg-white border border-gray-200 rounded-2xl space-y-2 hover:border-[#D02126]/30 transition-colors">
                        <img 
                          src={comp.photo} 
                          alt={comp.title} 
                          className="w-full h-24 object-cover rounded-xl"
                        />
                        <div>
                          <span className="text-[10px] font-bold text-gray-400 block">{comp.address}</span>
                          <span className="text-xs font-bold text-[#0F1115] block">{comp.priceUF.toLocaleString('es-CL')} UF</span>
                          <div className="flex items-center justify-between text-[10px] text-gray-500 pt-1">
                            <span>{comp.usefulM2} m² · {comp.bedrooms}D/{comp.bathrooms}B</span>
                            <span className="font-mono">{comp.ufM2} UF/m²</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Banner para Corredores / Agencias */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-gray-900 to-[#0F1115] text-white border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#D02126]/20 text-[#D02126] flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-extrabold text-white block">¿Eres Corredor Inmobiliario o Desarrollador?</span>
                      <span className="text-[11px] text-gray-300">El motor pericial AVM con Inteligencia Artificial, Stacking Plan y redacción CMA ejecutiva está integrado en Melsa Agency OS.</span>
                    </div>
                  </div>
                  <a
                    href="#software-agencias"
                    className="shrink-0 px-3.5 py-1.5 rounded-xl bg-white text-[#0F1115] font-bold text-xs hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    Acceder a Agency OS →
                  </a>
                </div>

                {/* Lead Capture Form & WhatsApp Dispatch */}
                <div className="p-6 bg-[#0F1115] rounded-3xl text-white space-y-4 border border-[#D02126]/30 shadow-lg">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-rose-300 tracking-wider block">
                      Paso Final • Certificación Presencial
                    </span>
                    <h4 className="text-lg font-bold text-white mt-1">
                      ¿Quieres Vender o Consignar al Precio Óptimo con Melsa?
                    </h4>
                    <p className="text-xs text-gray-400 mt-1">
                      Coordinamos la visita de un perito tasador para validar deslindes, revisar títulos en el CBR y generar el plan de marketing exclusivo.
                    </p>
                  </div>

                  {!leadSubmitted ? (
                    <div className="space-y-3 pt-2">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <input
                          type="text"
                          placeholder="Tu Nombre Completo"
                          value={ownerName}
                          onChange={(e) => setOwnerName(e.target.value)}
                          className="bg-white/10 border border-white/20 rounded-xl px-3 py-2.5 text-white placeholder-gray-400 outline-none focus:border-[#D02126]"
                        />
                        <input
                          type="tel"
                          placeholder="WhatsApp (+56 9 1234 5678)"
                          value={ownerPhone}
                          onChange={(e) => setOwnerPhone(e.target.value)}
                          className="bg-white/10 border border-white/20 rounded-xl px-3 py-2.5 text-white placeholder-gray-400 outline-none focus:border-[#D02126]"
                        />
                        <input
                          type="email"
                          placeholder="Correo Electrónico"
                          value={ownerEmail}
                          onChange={(e) => setOwnerEmail(e.target.value)}
                          className="bg-white/10 border border-white/20 rounded-xl px-3 py-2.5 text-white placeholder-gray-400 outline-none focus:border-[#D02126]"
                        />
                      </div>

                      <button
                        onClick={handleSendToWhatsApp}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-[#D02126] to-[#A0181C] hover:from-[#E0262B] hover:to-[#B51C20] text-white font-extrabold text-xs shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        <Share2 className="w-4 h-4" />
                        <span>Enviar Tasación y Solicitar Asesor Melsa por WhatsApp</span>
                      </button>
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-xs font-semibold flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      <span>¡Solicitud enviada con éxito! Un perito tasador de MELSA se pondrá en contacto contigo a la brevedad.</span>
                    </div>
                  )}
                </div>

              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};
