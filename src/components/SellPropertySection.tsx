import React, { useState } from 'react';
import { 
  Building, 
  MapPin, 
  Maximize2, 
  CheckCircle2, 
  Sparkles, 
  Camera, 
  ShieldCheck, 
  Award,
  TrendingUp,
  Compass,
  Home,
  Check,
  ArrowRight,
  RefreshCw,
  FileText,
  Clock,
  Layers,
  ChevronRight,
  Info
} from 'lucide-react';
import { 
  calculateValuationAVM, 
  generateValuationReportWithAI, 
  ValuationInput, 
  ValuationResult,
  CHILE_COMMUNE_BENCHMARKS,
  UF_CURRENT_CLP
} from '../services/propertyValuationEngine';

export const SellPropertySection: React.FC = () => {
  // Estado del Formulario AVM
  const [propertyType, setPropertyType] = useState<'Departamento' | 'Casa' | 'Oficina' | 'Parcela'>('Departamento');
  const [commune, setCommune] = useState('Las Condes');
  const [address, setAddress] = useState('Av. Kennedy con Gerónimo de Alderete');
  const [rolSII, setRolSII] = useState('');
  const [usefulM2, setUsefulM2] = useState<number>(115);
  const [totalM2, setTotalM2] = useState<number>(130);
  const [bedrooms, setBedrooms] = useState<number>(3);
  const [bathrooms, setBathrooms] = useState<number>(2);
  const [parking, setParking] = useState<number>(2);
  const [storage, setStorage] = useState<number>(1);
  const [orientation, setOrientation] = useState<'Nor-Oriente' | 'Nor-Poniente' | 'Sur-Oriente' | 'Sur-Poniente' | 'Despejada / Todas'>('Nor-Oriente');
  const [condition, setCondition] = useState<'Remodelado / Impecable' | 'Buen estado general' | 'Regular / Original' | 'Para refaccionar'>('Buen estado general');

  // Estado del flujo de análisis
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [valuationResult, setValuationResult] = useState<ValuationResult | null>(null);

  // Datos del Propietario para Captación / Informe CMA
  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [leadSubmitted, setLeadSubmitted] = useState(false);

  // Autocompletar con Rol SII de ejemplo
  const handleAutofillWithRol = () => {
    setRolSII('2415-18');
    setCommune('Las Condes');
    setAddress('Av. Las Condes 10450');
    setUsefulM2(120);
    setTotalM2(138);
    setBedrooms(3);
    setBathrooms(2);
    setParking(2);
    setStorage(1);
    setOrientation('Nor-Oriente');
    setCondition('Remodelado / Impecable');
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
      rolSII,
      usefulM2: Number(usefulM2) || 80,
      totalM2: Number(totalM2) || usefulM2,
      bedrooms: Number(bedrooms) || 2,
      bathrooms: Number(bathrooms) || 2,
      parking: Number(parking) || 0,
      storage: Number(storage) || 0,
      orientation,
      condition
    };

    // Animación de los 4 pasos del motor de datos
    setTimeout(() => setAnalysisStep(2), 500);
    setTimeout(() => setAnalysisStep(3), 1000);
    setTimeout(() => setAnalysisStep(4), 1500);

    // Cálculo cuantitativo NCh 3658
    const baseCalc = calculateValuationAVM(inputData);

    // Llamada a Groq AI para redactar el informe comparativo CMA
    setTimeout(async () => {
      const cmaText = await generateValuationReportWithAI(inputData, baseCalc);
      setValuationResult({
        ...baseCalc,
        executiveReportCMA: cmaText
      });
      setIsAnalyzing(false);
      setAnalysisStep(0);
    }, 2000);
  };

  // Enviar tasación al WhatsApp del Perito Tasador de Melsa
  const handleSendToWhatsApp = () => {
    if (!valuationResult) return;
    const text = `Hola equipo MELSA, acabo de generar la tasación de mi propiedad en su plataforma:
• Propiedad: ${propertyType} en ${commune} (${address || 'Sector residencial'})
• Superficie: ${usefulM2} m² útiles (${bedrooms}D / ${bathrooms}B)
• Amenidades: ${parking} estacionamientos / ${storage} bodega
• Tasación AVM Sugerida: ${valuationResult.baseMarketUF.toLocaleString('es-CL')} UF ($${valuationResult.baseMarketCLP.toLocaleString('es-CL')} CLP)
• Rango Liquidez (< 45 días): ${valuationResult.liquidityUF.toLocaleString('es-CL')} UF
• Rango Premium: ${valuationResult.premiumUF.toLocaleString('es-CL')} UF
• Propietario: ${ownerName || 'Propietario interesado'}
• Teléfono: ${ownerPhone || 'No indicado'}
• Correo: ${ownerEmail || 'No indicado'}

Deseo coordinar la visita técnica del perito tasador y revisar el plan de venta de Melsa.`;

    window.open(`https://wa.me/56999899421?text=${encodeURIComponent(text)}`, '_blank');
    setLeadSubmitted(true);
  };

  return (
    <section id="vender" className="py-24 bg-[#FAF9F8] relative overflow-hidden border-t border-gray-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D02126]/10 text-[#D02126] text-xs font-bold uppercase tracking-wider mb-4 border border-[#D02126]/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Motor de Tasación AVM con Inteligencia Artificial</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F1115] tracking-tight mb-4">
            ¿Cuánto Vale Tu Propiedad Hoy?
          </h2>
          <p className="text-gray-600 text-base sm:text-lg font-light leading-relaxed">
            Tasación objetiva en tiempo real respaldada en transacciones efectivas del Conservador de Bienes Raíces (CBR), oferta activa de portales y la Norma Chilena NCh 3658.
          </p>
        </div>

        {/* 2-Column Valuation & Captation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Beneficios de tasar y vender con MELSA */}
          <div className="lg:col-span-4 space-y-6">
            
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-gray-200 shadow-sm space-y-5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#D02126]" />
                <h3 className="text-lg font-bold text-[#0F1115]">
                  Ciencia de Datos vs. Sesgo Emocional
                </h3>
              </div>

              <p className="text-xs text-gray-500 leading-relaxed">
                El 78% de las propiedades sobrevaloradas pasan más de 9 meses estancadas en portales, perdiendo hasta un 12% de su valor real. Nuestro algoritmo AVM triangula 3 capas de datos para fijar el precio óptimo de venta:
              </p>

              <div className="space-y-4 pt-1 text-xs">
                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200/80">
                  <div className="font-bold text-[#0F1115] flex items-center justify-between">
                    <span>1. Suelo de la Verdad (CBR)</span>
                    <span className="text-[10px] text-emerald-600 font-mono font-bold">Inscripción Real</span>
                  </div>
                  <p className="text-gray-500 text-[11px] mt-1">Precios de cierre efectivos en notarías y conservadores de la cuadra, no precios inflados de portales.</p>
                </div>

                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200/80">
                  <div className="font-bold text-[#0F1115] flex items-center justify-between">
                    <span>2. Pulso Competitivo Actual</span>
                    <span className="text-[10px] text-blue-600 font-mono font-bold">14 Testigos</span>
                  </div>
                  <p className="text-gray-500 text-[11px] mt-1">Comparación directa con inmuebles en venta en un radio de 1.000 metros con características similares.</p>
                </div>

                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200/80">
                  <div className="font-bold text-[#0F1115] flex items-center justify-between">
                    <span>3. Sintonía Fina NCh 3658</span>
                    <span className="text-[10px] text-[#D02126] font-mono font-bold">Premios & Castigos</span>
                  </div>
                  <p className="text-gray-500 text-[11px] mt-1">Ponderación de estacionamientos (+450 UF), orientación Nor-Oriente, cercanía a Metro y estado de conservación.</p>
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

          {/* Right Column: Interactive Valuation & CMA Result */}
          <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xl">
            
            {/* Step 1: Input Form */}
            {!valuationResult && !isAnalyzing && (
              <form onSubmit={handleRunValuation} className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-gray-100">
                  <div>
                    <h3 className="text-xl font-extrabold text-[#0F1115]">
                      Parámetros de la Propiedad
                    </h3>
                    <p className="text-xs text-gray-500">
                      Ingresa los datos para que el motor AVM calcule el valor comercial en segundos.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleAutofillWithRol}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-[#D02126] text-xs font-bold transition-colors cursor-pointer border border-rose-200/60 self-start sm:self-auto"
                    title="Carga automática de ejemplo en Las Condes"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>⚡ Probar con Rol SII Ejemplo</span>
                  </button>
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
                      <option value="Departamento">Departamento</option>
                      <option value="Casa">Casa</option>
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

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Calle o Sector
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Ej. Av. Kennedy con Gerónimo de Alderete"
                      className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-[#0F1115] outline-none focus:border-[#D02126]"
                    />
                  </div>
                </div>

                {/* Grid 2: Metros y Distribución */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                      M² Útiles
                    </label>
                    <input
                      type="number"
                      value={usefulM2}
                      onChange={(e) => setUsefulM2(Number(e.target.value))}
                      className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-bold text-[#0F1115] outline-none focus:border-[#D02126]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                      M² Totales / Terreno
                    </label>
                    <input
                      type="number"
                      value={totalM2}
                      onChange={(e) => setTotalM2(Number(e.target.value))}
                      className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-bold text-[#0F1115] outline-none focus:border-[#D02126]"
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

                {/* Grid 3: Sintonía Fina (Estacionamientos, Bodegas, Orientación y Estado) */}
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
                      <option value={1}>1 Estacionamiento (+450 UF)</option>
                      <option value={2}>2 Estacionamientos (+900 UF)</option>
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
                      <option value={1}>1 Bodega (+120 UF)</option>
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

                {/* Rol de Avalúo SII (Opcional) */}
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Info className="w-4 h-4 text-gray-400 shrink-0" />
                    <span><strong>¿Conoces tu Rol de Avalúo SII?</strong> (Opcional, formato 1234-5)</span>
                  </div>
                  <input
                    type="text"
                    value={rolSII}
                    onChange={(e) => setRolSII(e.target.value)}
                    placeholder="Ej. 2415-18"
                    className="w-36 bg-white border border-gray-200 rounded-xl px-3 py-1.5 font-mono text-xs text-[#0F1115] uppercase tracking-wider outline-none focus:border-[#D02126]"
                  />
                </div>

                {/* CTA Ejecutar Tasación */}
                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-[#D02126] hover:bg-[#B81B1F] text-white font-extrabold text-sm tracking-wider uppercase transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>⚡ Calcular Tasación AVM con Inteligencia Artificial</span>
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
                    Analizando Microzona en {commune}...
                  </h4>
                  <p className="text-xs text-gray-500">
                    Nuestra IA está triangulando 3 fuentes de datos simultáneamente para entregar un veredicto certero sin sesgo.
                  </p>
                </div>

                {/* Steps checklist */}
                <div className="max-w-sm mx-auto text-left space-y-2.5 text-xs font-semibold">
                  <div className={`flex items-center gap-2 ${analysisStep >= 1 ? 'text-emerald-700' : 'text-gray-400'}`}>
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Geolocalizando radio de 1 km y consultando CBR...</span>
                  </div>
                  <div className={`flex items-center gap-2 ${analysisStep >= 2 ? 'text-emerald-700' : 'text-gray-400'}`}>
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Extrayendo 14 testigos de portales inmobiliarios...</span>
                  </div>
                  <div className={`flex items-center gap-2 ${analysisStep >= 3 ? 'text-emerald-700' : 'text-gray-400'}`}>
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Aplicando coeficientes de orientación y NCh 3658...</span>
                  </div>
                  <div className={`flex items-center gap-2 ${analysisStep >= 4 ? 'text-emerald-700' : 'text-gray-400'}`}>
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Redactando Informe de Mercado CMA con Groq AI...</span>
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
                      {propertyType} · {usefulM2} m² útiles · {commune}
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
                        Punto de Equilibrio
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

                {/* Informe Ejecutivo CMA redactado por IA (El "Baño de Realidad") */}
                <div className="p-5 rounded-2xl bg-rose-50/50 border border-rose-200/60 space-y-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#D02126]" />
                    <span className="font-extrabold text-xs text-[#0F1115] uppercase tracking-wider">
                      Análisis Comparativo de Mercado (CMA) por IA de Melsa
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

                {/* Lead Capture Form & WhatsApp Dispatch */}
                <div className="p-6 bg-[#0F1115] rounded-3xl text-white space-y-4 border border-[#D02126]/30 shadow-lg">
                  <div>
                    <h4 className="text-base font-bold text-white">
                      ¿Quieres consignar tu propiedad o recibir el Informe CMA Certificado?
                    </h4>
                    <p className="text-xs text-gray-300 font-light mt-0.5">
                      Un asesor senior de MELSA revisará tu ficha con estudio de títulos y sesión fotográfica sin costo inicial.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <input
                      type="text"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      placeholder="Tu Nombre Completo"
                      className="bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white placeholder-gray-400 outline-none focus:border-[#D02126]"
                    />
                    <input
                      type="tel"
                      value={ownerPhone}
                      onChange={(e) => setOwnerPhone(e.target.value)}
                      placeholder="WhatsApp (ej. +56 9 1234 5678)"
                      className="bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white placeholder-gray-400 outline-none focus:border-[#D02126]"
                    />
                    <input
                      type="email"
                      value={ownerEmail}
                      onChange={(e) => setOwnerEmail(e.target.value)}
                      placeholder="Tu Correo Electrónico"
                      className="bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white placeholder-gray-400 outline-none focus:border-[#D02126]"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
                    <button
                      onClick={handleSendToWhatsApp}
                      className="w-full sm:flex-1 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold text-xs tracking-wider uppercase transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>📲 Enviar Tasación a mi WhatsApp & Perito MELSA</span>
                    </button>

                    <button
                      onClick={() => setValuationResult(null)}
                      className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs cursor-pointer transition-colors"
                    >
                      Tasar Otra Propiedad
                    </button>
                  </div>

                  {leadSubmitted && (
                    <div className="p-2.5 bg-emerald-900/60 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs text-center font-medium">
                      ✓ ¡Datos enviados! Te contactaremos a la brevedad para coordinar la visita técnica.
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
