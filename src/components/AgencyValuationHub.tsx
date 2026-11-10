import React, { useState } from 'react';
import { 
  Compass, 
  Sparkles, 
  Building2, 
  DollarSign, 
  TrendingUp, 
  ShieldCheck, 
  FileText, 
  Share2, 
  Copy, 
  Check, 
  Layers, 
  MapPin, 
  Printer, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  HelpCircle,
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import { 
  calculateValuationAVM, 
  generateValuationReportWithAI, 
  ValuationInput, 
  ValuationResult,
  ConstructionMaterialType,
  getSuggestedStreetsForCommune,
  UF_CURRENT_CLP 
} from '../services/propertyValuationEngine';
import { AddressSearchAutocomplete } from './AddressSearchAutocomplete';

interface AgencyValuationHubProps {
  onAddPropertyToPortfolio?: (prop: {
    address: string;
    commune: string;
    bedrooms: number;
    bathrooms: number;
    surfaceM2: number;
    priceUF: number;
    rentCLP: number;
  }) => void;
}

export const AgencyValuationHub: React.FC<AgencyValuationHubProps> = ({ onAddPropertyToPortfolio }) => {
  // Form State (Inicialmente vacíos con placeholders de ejemplo en gris)
  const [propertyType, setPropertyType] = useState<'Departamento' | 'Casa' | 'Oficina' | 'Parcela'>('Casa');
  const [commune, setCommune] = useState('Villa Alemana');
  const [address, setAddress] = useState('');
  const [rolManzana, setRolManzana] = useState('');
  const [rolPredio, setRolPredio] = useState('');
  const [constructionMaterial, setConstructionMaterial] = useState<ConstructionMaterialType>('Albañilería Confinada / Ladrillo Fiscal (Clase C)');
  const [usefulM2, setUsefulM2] = useState<number | ''>('');
  const [totalM2, setTotalM2] = useState<number | ''>('');
  const [bedrooms, setBedrooms] = useState<number>(3);
  const [bathrooms, setBathrooms] = useState<number>(2);
  const [parking, setParking] = useState<number>(1);
  const [storage, setStorage] = useState<number>(0);
  const [orientation, setOrientation] = useState<'Nor-Oriente' | 'Nor-Poniente' | 'Sur-Oriente' | 'Sur-Poniente' | 'Despejada / Todas'>('Nor-Oriente');
  const [condition, setCondition] = useState<'Remodelado / Impecable' | 'Buen estado general' | 'Regular / Original' | 'Para refaccionar'>('Buen estado general');

  // Execution State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [valuationResult, setValuationResult] = useState<ValuationResult | null>(null);
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [addedToPortfolioSuccess, setAddedToPortfolioSuccess] = useState(false);

  // Quick preset helper
  const handleLoadPreset = (presetCommune: string, presetAddress: string, manzana: string, predio: string, m2: number, totM2: number, beds: number, baths: number) => {
    setCommune(presetCommune);
    setAddress(presetAddress);
    setRolManzana(manzana);
    setRolPredio(predio);
    setUsefulM2(m2);
    setTotalM2(totM2);
    setBedrooms(beds);
    setBathrooms(baths);
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

  // Run Quantitative + AI Valuation
  const handleExecuteValuation = async (e: React.FormEvent) => {
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
      usefulM2: Number(usefulM2) || 100,
      totalM2: Number(totalM2) || Number(usefulM2) || 120,
      bedrooms: Number(bedrooms) || 3,
      bathrooms: Number(bathrooms) || 2,
      parking: Number(parking) || 1,
      storage: Number(storage) || 0,
      orientation,
      condition
    };

    setTimeout(() => setAnalysisStep(2), 500);
    setTimeout(() => setAnalysisStep(3), 1000);
    setTimeout(() => setAnalysisStep(4), 1500);

    const baseCalc = calculateValuationAVM(inputData);

    try {
      const cmaText = await generateValuationReportWithAI(inputData, baseCalc);
      setValuationResult({
        ...baseCalc,
        executiveReportCMA: cmaText
      });
    } catch (err) {
      console.error('Error generating AI CMA report:', err);
      setValuationResult({
        ...baseCalc,
        executiveReportCMA: `INFORME COMPARATIVO DE MERCADO (CMA) - MELSA VALUATION ENGINE
Propiedad analizada en ${commune} (${baseCalc.regionName}).
Valor comercial sugerido: ${baseCalc.baseMarketUF.toLocaleString('es-CL')} UF ($${baseCalc.baseMarketCLP.toLocaleString('es-CL')} CLP).
Rango de liquidez rápida: ${baseCalc.liquidityUF.toLocaleString('es-CL')} UF.
Cap Rate bruto proyectado: ${baseCalc.capRateGrossPct}% anual sobre canon estimado de $${baseCalc.estimatedRentCLP.toLocaleString('es-CL')} CLP.`
      });
    } finally {
      setIsAnalyzing(false);
      setAnalysisStep(0);
    }
  };

  // Copy to clipboard for WhatsApp
  const handleCopyReport = () => {
    if (!valuationResult) return;
    const text = `📊 *INFORME DE TASACIÓN AVM & MERCADO — MELSA AGENCY OS*
🏠 *Inmueble:* ${propertyType} en ${valuationResult.communeFormatted} (${address || 'Sector residencial'})
📐 *Superficie:* ${usefulM2} m² útiles (${bedrooms}D / ${bathrooms}B / ${parking}E)
🏛 *Norma de Tasación:* NCh 3658 / Conservador de Bienes Raíces (CBR)

💰 *Valor Comercial Sugerido:* ${valuationResult.baseMarketUF.toLocaleString('es-CL')} UF (*$${valuationResult.baseMarketCLP.toLocaleString('es-CL')} CLP*)
⚡ *Rango Liquidez (< 45 días):* ${valuationResult.liquidityUF.toLocaleString('es-CL')} UF
🏆 *Precio Máximo de Paciencia:* ${valuationResult.premiumUF.toLocaleString('es-CL')} UF
📈 *Promedio m² Zona:* ${valuationResult.averageUfM2} UF/m²
🏢 *Canon Arriendo Estimado:* $${valuationResult.estimatedRentCLP.toLocaleString('es-CL')} CLP/mes (Cap Rate: ${valuationResult.capRateGrossPct}%)

📑 *Análisis Pericial:*
${valuationResult.executiveReportCMA}

Generado con tecnología pericial MELSA.`;

    navigator.clipboard.writeText(text);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 3000);
  };

  // Add to portfolio
  const handleAddToPortfolio = () => {
    if (!valuationResult || !onAddPropertyToPortfolio) return;
    onAddPropertyToPortfolio({
      address: address || `${propertyType} en ${commune}`,
      commune: valuationResult.communeFormatted,
      bedrooms,
      bathrooms,
      surfaceM2: Number(usefulM2) || 100,
      priceUF: valuationResult.baseMarketUF,
      rentCLP: valuationResult.estimatedRentCLP
    });
    setAddedToPortfolioSuccess(true);
    setTimeout(() => setAddedToPortfolioSuccess(false), 4000);
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Header Bar */}
      <div className="bg-white rounded-3xl border border-gray-200/90 p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#D02126]/10 text-[#D02126] border border-[#D02126]/20 flex items-center gap-1">
              <Compass className="w-3.5 h-3.5" />
              <span>Módulo Exclusivo para Clientes Melsa</span>
            </span>
            <span className="text-xs text-gray-400">• Norma Chilena NCh 3658</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F1115] tracking-tight">
            Motor de Tasación AVM & Informes CMA con IA
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Tasaciones cuantitativas objetivas con transacciones efectivas del Conservador de Bienes Raíces (CBR), homogeneización de atributos y redactor de reportes Groq.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <div className="px-3.5 py-2 rounded-2xl bg-gray-50 border border-gray-200 text-gray-700 font-semibold">
            UF Hoy: <strong className="text-[#0F1115]">${UF_CURRENT_CLP.toLocaleString('es-CL')} CLP</strong>
          </div>
        </div>
      </div>

      {/* 2. Grid Layout: Formulario Parámetros + Resultados */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Input Form (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-gray-200 p-6 shadow-sm space-y-5 text-xs">
          <div className="pb-3 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-[#0F1115]">
                Parámetros Técnicos de la Propiedad
              </h3>
              <span className="text-[10px] text-gray-400 font-mono">SII / CBR • NCh 3658</span>
            </div>

            <div className="flex items-center gap-2">
              {(address || rolManzana || rolPredio || usefulM2 || valuationResult) && (
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-rose-50 text-gray-600 hover:text-[#D02126] text-[11px] font-bold transition-all cursor-pointer border border-gray-200"
                  title="Limpiar formulario para evaluar otra propiedad"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Limpiar</span>
                </button>
              )}
            </div>
          </div>

          <form onSubmit={handleExecuteValuation} autoComplete="off" className="space-y-4">
            
            {/* Tipo de Inmueble y Comuna */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                  Comuna de Chile
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
                  <option value="Independencia">Independencia / Recoleta</option>
                  <option value="Estación Central">Estación Central</option>
                  <option value="Maipú">Maipú</option>
                  <option value="Puente Alto">Puente Alto</option>
                  <option value="San Bernardo">San Bernardo</option>
                  <option value="Chicureo">Chicureo / Colina</option>
                  <option value="Buin">Buin / Paine</option>
                  <option value="Talagante">Talagante / Peñaflor</option>
                </optgroup>

                <optgroup label="── Región de Coquimbo ──">
                  <option value="La Serena">La Serena</option>
                  <option value="Coquimbo">Coquimbo</option>
                  <option value="Ovalle">Ovalle</option>
                </optgroup>

                <optgroup label="── Región de Antofagasta ──">
                  <option value="Antofagasta">Antofagasta</option>
                  <option value="Calama">Calama</option>
                </optgroup>

                <optgroup label="── Región de O'Higgins y Maule ──">
                  <option value="Rancagua">Rancagua / Machalí</option>
                  <option value="Talca">Talca</option>
                  <option value="Curicó">Curicó</option>
                </optgroup>

                <optgroup label="── Región del Biobío ──">
                  <option value="Concepción">Concepción</option>
                  <option value="San Pedro de la Paz">San Pedro de la Paz</option>
                  <option value="Chiguayante">Chiguayante</option>
                  <option value="Talcahuano">Talcahuano / Hualpén</option>
                  <option value="Los Ángeles">Los Ángeles</option>
                </optgroup>

                <optgroup label="── Región de La Araucanía y Los Ríos ──">
                  <option value="Temuco">Temuco</option>
                  <option value="Pucón">Pucón / Villarrica</option>
                  <option value="Valdivia">Valdivia</option>
                </optgroup>

                <optgroup label="── Región de Los Lagos y Magallanes ──">
                  <option value="Puerto Varas">Puerto Varas / Frutillar</option>
                  <option value="Puerto Montt">Puerto Montt</option>
                  <option value="Osorno">Osorno</option>
                  <option value="Punta Arenas">Punta Arenas</option>
                </optgroup>
              </select>
            </div>
          </div>

            {/* Dirección o Sector con Búsqueda Reactiva Inteligente */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider">
                  Dirección, Calle o Sector
                </label>
                <span className="text-[10px] text-gray-400">Autocompletado y geocodificación activa</span>
              </div>
              
              <AddressSearchAutocomplete
                value={address}
                onChange={(newAddr) => setAddress(newAddr)}
                commune={commune}
                placeholder="Ej. Av. Los Pinos 1420"
              />

              {/* Sugerencias de calles principales de la comuna */}
              <div className="mt-2 flex flex-wrap gap-1.5 items-center">
                <span className="text-[10px] text-gray-400 font-medium">Frecuentes:</span>
                {getSuggestedStreetsForCommune(commune).slice(0, 4).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setAddress(st)}
                    className="text-[10px] px-2 py-0.5 rounded-lg bg-gray-100 hover:bg-red-50 hover:text-[#D02126] text-gray-600 transition-colors border border-gray-200 cursor-pointer"
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Rol de Avalúo SII Funcional (Dos campos independientes: Manzana - Predio) */}
            <div className="p-3 bg-red-50/50 rounded-2xl border border-red-100 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#D02126]" />
                  <label className="text-[11px] font-bold text-gray-800 uppercase tracking-wide">
                    Rol de Avalúo SII (Formato Oficial)
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() => handleLoadPreset('Villa Alemana', 'Av. Valparaíso 1420', '1245', '68', 120, 240, 3, 2)}
                  className="text-[10px] font-bold text-[#D02126] hover:underline cursor-pointer"
                >
                  ⚡ Cargar Caso Ejemplo (Ficticio)
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-gray-500 font-medium block mb-1">Manzana (SII)</span>
                  <input
                    type="text"
                    value={rolManzana}
                    onChange={(e) => setRolManzana(e.target.value.replace(/\D/g, '').slice(0, 5))}
                    placeholder="Ej. 1245"
                    className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-[#0F1115] text-center focus:border-[#D02126] outline-none"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 font-medium block mb-1">Predio / Unidad</span>
                  <input
                    type="text"
                    value={rolPredio}
                    onChange={(e) => setRolPredio(e.target.value.replace(/\D/g, '').slice(0, 5))}
                    placeholder="Ej. 68"
                    className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-[#0F1115] text-center focus:border-[#D02126] outline-none"
                  />
                </div>
              </div>
              <p className="text-[10px] text-gray-500 italic">
                Formato SII: <span className="font-mono font-semibold text-gray-700">{rolManzana || '---'}-{rolPredio || '---'}</span> • Calcula avalúo fiscal y exención DFL-2.
              </p>
            </div>

            {/* Material de Construcción (NCh 3658) */}
            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                Material Estructural Predominante (NCh 3658)
              </label>
              <select
                value={constructionMaterial}
                onChange={(e) => setConstructionMaterial(e.target.value as ConstructionMaterialType)}
                className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-[#0F1115] font-semibold outline-none focus:border-[#D02126]"
              >
                <option value="Albañilería Confinada / Ladrillo Fiscal (Clase C)">
                  Albañilería Confinada / Ladrillo Fiscal (Clase C) • Estándar Chileno
                </option>
                <option value="Hormigón Armado / Albañilería Armada (Clase A-B)">
                  Hormigón Armado / Antisísmico (Clase A-B) • Alta Plusvalía (+8%)
                </option>
                <option value="Estructura Acero / Metalcon (Clase D)">
                  Estructura Acero / Metalcon Galvanizado (Clase D)
                </option>
                <option value="Madera Estructural Tratada (Clase E)">
                  Madera Estructural Tratada (Clase E)
                </option>
                <option value="Mixto / Adobe Tradicional">
                  Adobe Tradicional / Autoconstrucción Mixta (-12%)
                </option>
              </select>
            </div>

            {/* Superficies */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                  M² Útiles Construidos
                </label>
                <input
                  type="number"
                  min="20"
                  max="2000"
                  value={usefulM2}
                  onChange={(e) => setUsefulM2(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="Ej. 150"
                  className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-[#0F1115] font-semibold outline-none focus:border-[#D02126]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                  M² Totales / Terreno
                </label>
                <input
                  type="number"
                  min="20"
                  max="50000"
                  value={totalM2}
                  onChange={(e) => setTotalM2(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="Ej. 300"
                  className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-[#0F1115] font-semibold outline-none focus:border-[#D02126]"
                />
              </div>
            </div>

            {/* Dormitorios, Baños, Estac, Bodega */}
            <div className="grid grid-cols-4 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Dorms</label>
                <select
                  value={bedrooms}
                  onChange={(e) => setBedrooms(Number(e.target.value))}
                  className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-2 py-2 text-xs font-semibold outline-none"
                >
                  {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n} D</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Baños</label>
                <select
                  value={bathrooms}
                  onChange={(e) => setBathrooms(Number(e.target.value))}
                  className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-2 py-2 text-xs font-semibold outline-none"
                >
                  {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} B</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Estac.</label>
                <select
                  value={parking}
                  onChange={(e) => setParking(Number(e.target.value))}
                  className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-2 py-2 text-xs font-semibold outline-none"
                >
                  {[0, 1, 2, 3, 4].map(n => <option key={n} value={n}>{n} E</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Bodega</label>
                <select
                  value={storage}
                  onChange={(e) => setStorage(Number(e.target.value))}
                  className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-2 py-2 text-xs font-semibold outline-none"
                >
                  {[0, 1, 2, 3].map(n => <option key={n} value={n}>{n} B</option>)}
                </select>
              </div>
            </div>

            {/* Orientación y Estado */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Orientación
                </label>
                <select
                  value={orientation}
                  onChange={(e) => setOrientation(e.target.value as any)}
                  className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none"
                >
                  <option value="Nor-Oriente">Nor-Oriente (+5%)</option>
                  <option value="Nor-Poniente">Nor-Poniente (+3%)</option>
                  <option value="Sur-Oriente">Sur-Oriente (Estándar)</option>
                  <option value="Sur-Poniente">Sur-Poniente (-2%)</option>
                  <option value="Despejada / Todas">Despejada (+4%)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Estado Conservación
                </label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value as any)}
                  className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none"
                >
                  <option value="Remodelado / Impecable">Remodelado (+6%)</option>
                  <option value="Buen estado general">Buen estado (Base)</option>
                  <option value="Regular / Original">Regular (-6%)</option>
                  <option value="Para refaccionar">Para refaccionar (-12%)</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isAnalyzing}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-[#D02126] hover:bg-[#b01b20] text-white font-bold text-xs transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Procesando NCh 3658 & IA ({analysisStep}/4)...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Ejecutar Tasación AVM & Redactar Informe CMA</span>
                </>
              )}
            </button>

          </form>
        </div>

        {/* Right Column: Resultados Periciales (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {valuationResult ? (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              {/* Card 1: Cifras Clave del Inmueble */}
              <div className="bg-gradient-to-br from-[#0F1115] via-[#1A1D23] to-[#0A0C0F] rounded-3xl text-white p-6 sm:p-7 shadow-xl border border-white/10 space-y-5">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/10">
                  <div>
                    <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Tasación Certificada NCh 3658 • {valuationResult.regionName}</span>
                    </span>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-0.5">
                      {propertyType} en {valuationResult.communeFormatted}
                    </h2>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyReport}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-200 text-xs font-bold transition-all cursor-pointer"
                      title="Copiar informe formal para WhatsApp"
                    >
                      {copiedSuccess ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedSuccess ? '¡Copiado!' : 'Copiar'}</span>
                    </button>

                    <button
                      onClick={handleAddToPortfolio}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#D02126] hover:bg-[#b01b20] text-white text-xs font-bold transition-all cursor-pointer"
                    >
                      <Building2 className="w-3.5 h-3.5" />
                      <span>Añadir a Cartera</span>
                    </button>
                  </div>
                </div>

                {addedToPortfolioSuccess && (
                  <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs text-center border border-emerald-500/30">
                    ✓ Propiedad incorporada exitosamente a la Cartera de la Agencia.
                  </div>
                )}

                {/* Primary Number: Base Market */}
                <div className="text-center py-2 space-y-1">
                  <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider block">
                    Valor Comercial Sugerido (Punto Central de Mercado)
                  </span>
                  <div className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                    {valuationResult.baseMarketUF.toLocaleString('es-CL')} <span className="text-2xl text-[#D02126]">UF</span>
                  </div>
                  <div className="text-lg font-bold text-gray-300">
                    ${valuationResult.baseMarketCLP.toLocaleString('es-CL')} CLP
                  </div>
                  <span className="text-xs text-gray-400 block pt-1">
                    Promedio zonal homogenizado: <strong>{valuationResult.averageUfM2} UF/m² útil</strong>
                  </span>
                </div>

                {/* 3 Price Scenarios */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-white/10 text-center">
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
                    <span className="block text-[10px] text-gray-400 font-bold uppercase">Liquidez (&lt; 45 Días)</span>
                    <span className="text-base font-extrabold text-amber-300">{valuationResult.liquidityUF.toLocaleString('es-CL')} UF</span>
                    <span className="block text-[10px] text-gray-400">${valuationResult.liquidityCLP.toLocaleString('es-CL')} CLP</span>
                  </div>

                  <div className="bg-[#D02126]/10 border border-[#D02126]/30 rounded-2xl p-3">
                    <span className="block text-[10px] text-rose-300 font-bold uppercase">Precio Sugerido</span>
                    <span className="text-base font-extrabold text-white">{valuationResult.baseMarketUF.toLocaleString('es-CL')} UF</span>
                    <span className="block text-[10px] text-gray-300">${valuationResult.baseMarketCLP.toLocaleString('es-CL')} CLP</span>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
                    <span className="block text-[10px] text-gray-400 font-bold uppercase">Techo de Paciencia</span>
                    <span className="text-base font-extrabold text-emerald-300">{valuationResult.premiumUF.toLocaleString('es-CL')} UF</span>
                    <span className="block text-[10px] text-gray-400">${valuationResult.premiumCLP.toLocaleString('es-CL')} CLP</span>
                  </div>
                </div>

                {/* Financial Yield & Rent Estimation */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs">
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">Canon de Arriendo Estimado</span>
                    <span className="text-base font-extrabold text-white">${valuationResult.estimatedRentCLP.toLocaleString('es-CL')} CLP/mes</span>
                  </div>
                  <div className="text-right">
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">Cap Rate Bruto Anual</span>
                    <span className="text-base font-extrabold text-emerald-400">{valuationResult.capRateGrossPct}%</span>
                  </div>
                </div>

              </div>

              {/* Card 1.5: Radar de Megaproyectos Urbanos e Impacto en Plusvalía */}
              {valuationResult.urbanPlusvalia?.hasKeyInfrastructure && (
                <div className="bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-transparent p-5 rounded-3xl border border-amber-300/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-[#D02126]" />
                      <span>Radar de Infraestructura & Megaproyectos IA</span>
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-[#D02126] text-white">
                      +{valuationResult.urbanPlusvalia.projectImpactPct}% Plusvalía
                    </span>
                  </div>
                  <h4 className="text-sm font-extrabold text-[#0F1115] flex flex-wrap items-center gap-1.5">
                    <span>{valuationResult.urbanPlusvalia.projectName}</span>
                    <span className="text-xs text-[#D02126] font-bold">• {valuationResult.urbanPlusvalia.distanceDescription}</span>
                  </h4>
                  <p className="text-xs text-gray-700 leading-relaxed">
                    {valuationResult.urbanPlusvalia.description}
                  </p>
                </div>
              )}

              {/* Card 1.8: Certificación SII y Materialidad NCh 3658 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* SII Assessment */}
                {valuationResult.siiAssessment && (
                  <div className="p-4 bg-white rounded-2xl border border-gray-200 shadow-sm space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Certificación SII</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {valuationResult.siiAssessment.contributionsStatus}
                      </span>
                    </div>
                    <div className="text-xs font-mono font-extrabold text-[#0F1115]">
                      Rol: {valuationResult.siiAssessment.rolFormatted}
                    </div>
                    <div className="text-xs text-gray-600">
                      Avalúo Fiscal Estimado: <strong>${valuationResult.siiAssessment.estimatedFiscalAssessmentCLP.toLocaleString('es-CL')} CLP</strong>
                    </div>
                    <div className="text-[10px] text-gray-400">
                      {valuationResult.siiAssessment.destination}
                    </div>
                  </div>
                )}

                {/* Materialidad Constructiva */}
                <div className="p-4 bg-white rounded-2xl border border-gray-200 shadow-sm space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Materialidad NCh 3658</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${(valuationResult.materialityFactorPct || 0) >= 0 ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'}`}>
                      {(valuationResult.materialityFactorPct || 0) >= 0 ? `+${valuationResult.materialityFactorPct}%` : `${valuationResult.materialityFactorPct}%`} Factor
                    </span>
                  </div>
                  <div className="text-xs font-bold text-[#0F1115] truncate">
                    {valuationResult.constructionMaterialUsed || 'Albañilería Confinada (Clase C)'}
                  </div>
                  <div className="text-[11px] text-gray-500">
                    Depreciación Ross-Heidecke calculada conforme a edad aparente y estándar antisísmico.
                  </div>
                </div>
              </div>

              {/* Card 2: AI Executive CMA Narrative */}
              <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm space-y-4 text-xs">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                  <Sparkles className="w-4 h-4 text-[#D02126]" />
                  <h3 className="font-extrabold text-sm text-[#0F1115]">
                    Informe Pericial Comparativo (CMA) — Redacción Ejecutiva IA
                  </h3>
                </div>

                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200/80 text-gray-700 whitespace-pre-line leading-relaxed font-sans text-xs">
                  {valuationResult.executiveReportCMA}
                </div>

                {/* Methodology Breakdown */}
                <div className="space-y-1.5 pt-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                    Factores Cuantitativos de Homogeneización:
                  </span>
                  <div className="space-y-1">
                    {valuationResult.methodologyNotes.map((note, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-gray-600 text-[11px]">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{note}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card 3: Comparable Comps (Testigos) */}
              <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm space-y-4 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <h3 className="font-extrabold text-sm text-[#0F1115]">
                    Testigos de Mercado Directos en {valuationResult.communeFormatted}
                  </h3>
                  <span className="text-[10px] text-gray-400">3 propiedades testigo</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {valuationResult.comparableComps.map((comp, idx) => (
                    <div key={idx} className="p-3 bg-gray-50 rounded-2xl border border-gray-200/80 space-y-2">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="font-bold text-[#D02126]">{comp.status}</span>
                        <span className="text-gray-400">{comp.distanceMeters}m</span>
                      </div>
                      <div className="font-extrabold text-xs text-[#0F1115] truncate">{comp.title}</div>
                      <div className="text-[11px] text-gray-500">{comp.address}</div>
                      <div className="pt-1 border-t border-gray-200 flex justify-between items-center text-xs">
                        <span className="font-extrabold text-[#0F1115]">{comp.priceUF.toLocaleString('es-CL')} UF</span>
                        <span className="text-gray-500 text-[10px]">{comp.ufM2} UF/m²</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-dashed border-gray-300 p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#D02126] flex items-center justify-center mx-auto">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-[#0F1115]">
                Esperando Parámetros de Propiedad
              </h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Ingresa la comuna, m² útiles y amenidades en el formulario lateral y presiona <strong>"Ejecutar Tasación AVM"</strong> para desplegar el informe pericial.
              </p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
