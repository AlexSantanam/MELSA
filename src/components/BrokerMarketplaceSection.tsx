import React, { useState } from 'react';
import { 
  Building2, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  DollarSign, 
  ShieldCheck, 
  Zap, 
  Upload, 
  FileText, 
  CreditCard, 
  BadgeCheck, 
  Copy, 
  Phone, 
  Clock,
  Layers,
  HelpCircle,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { optimizeListingWithAI } from '../services/aiAdvisorService';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export const BrokerMarketplaceSection: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<'standard' | 'featured'>('standard');
  const [activeStep, setActiveStep] = useState<number>(1);

  // Form Fields
  const [operationType, setOperationType] = useState<'Venta' | 'Arriendo'>('Venta');
  const [propertyType, setPropertyType] = useState<string>('Departamento');
  const [locationCity, setLocationCity] = useState<string>('Las Condes, Santiago');
  const [priceValue, setPriceValue] = useState<string>('6.500 UF');
  const [bedrooms, setBedrooms] = useState<string>('2');
  const [bathrooms, setBathrooms] = useState<string>('2');
  const [surfaceM2, setSurfaceM2] = useState<string>('75 m²');

  // Contact Info
  const [publisherName, setPublisherName] = useState<string>('');
  const [publisherPhone, setPublisherPhone] = useState<string>('+56 9 ');
  const [publisherEmail, setPublisherEmail] = useState<string>('');
  const [isBroker, setIsBroker] = useState<boolean>(true);

  // AI Description Generator
  const [rawNotes, setRawNotes] = useState<string>(
    'Depto piso 7 con vista despejada a la cordillera. 2 dormitorios, 2 baños completos, cocina integrada, terraza amplia, 1 estacionamiento y 1 bodega. Gastos comunes $130.000 aprox. Edificio con piscina, quincho y seguridad 24/7.'
  );
  const [optimizedDescription, setOptimizedDescription] = useState<string>('');
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);

  // Payment Checkout
  const [paymentMethod, setPaymentMethod] = useState<'webpay' | 'transfer'>('webpay');
  const [isPaymentSuccess, setIsPaymentSuccess] = useState<boolean>(false);
  const [orderNumber, setOrderNumber] = useState<string>('');

  const officialWhatsApp = "56999899421";
  const planPrice = selectedPlan === 'standard' ? 10000 : 24900;
  const planDays = selectedPlan === 'standard' ? 45 : 60;

  const handleOptimizeWithAI = async () => {
    if (!rawNotes.trim()) return;
    setIsOptimizing(true);
    try {
      const generated = await optimizeListingWithAI(rawNotes, {
        type: propertyType,
        location: locationCity,
        price: priceValue,
        operation: operationType,
      });
      setOptimizedDescription(generated);
    } catch (err) {
      console.error(err);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleProcessPayment = () => {
    const randomOrder = 'MLS-' + Math.floor(100000 + Math.random() * 900000);
    setOrderNumber(randomOrder);
    setIsPaymentSuccess(true);

    if (isSupabaseConfigured()) {
      const numericPrice = parseFloat(priceValue.replace(/[^0-9]/g, '')) || 0;
      supabase.from('marketplace_listings').insert([{
        title: `${propertyType} en ${operationType} - ${locationCity}`,
        price_clp: numericPrice,
        price_uf: null,
        property_type: propertyType,
        operation_type: operationType,
        region: selectedRegion,
        commune: locationCity,
        bedrooms: parseInt(bedrooms) || 0,
        bathrooms: parseInt(bathrooms) || 0,
        surface_m2: parseFloat(surfaceM2) || 0,
        description: optimizedDescription || rawDescription || 'Propiedad publicada en Melsa Open Market',
        images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200'],
        seller_name: publisherName || 'Corredor Directo',
        seller_phone: publisherPhone || '+56999899421',
        payment_status: 'paid'
      }]).then(({ error }) => {
        if (error) console.warn('Supabase marketplace sync notice:', error.message);
      });
    }
  };

  return (
    <section id="publicar" className="py-24 bg-white text-[#0F1115] relative border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D02126]/10 text-[#D02126] text-xs font-semibold uppercase tracking-wider mb-4 border border-[#D02126]/20">
            <Building2 className="w-3.5 h-3.5 text-[#D02126]" />
            <span>Melsa Open Marketplace · Vitrina para Corredores & Propietarios</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif text-[#0F1115] font-normal tracking-tight mb-5">
            Publica tu Propiedad con Pago Único de $10.000 CLP
          </h2>
          <p className="text-gray-600 text-sm sm:text-base font-light leading-relaxed">
            Sin cobros abusivos en UF ni suscripciones mensuales obligatorias. Publica tu casa o departamento en la red inmobiliaria de Melsa con redacción SEO anti-duplicado potenciada por IA.
          </p>
        </div>

        {/* Pricing Comparison Table (Melsa vs Traditional Portals) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 items-stretch">
          
          {/* Card 1: Portales Tradicionales */}
          <div className="p-7 rounded-3xl bg-gray-50 border border-gray-200 text-gray-500 flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-2">
                Portales Tradicionales
              </span>
              <h3 className="text-xl font-bold text-gray-700 mb-2">Planes en UF / Mensuales</h3>
              <div className="text-2xl font-serif font-bold text-gray-800 mb-4">
                ~1.5 a 4.0 UF <span className="text-xs font-normal text-gray-500">/mes ($60k - $150k CLP)</span>
              </div>
              <ul className="space-y-2.5 text-xs text-gray-600">
                <li className="flex items-center gap-2 text-red-500">
                  ✕ Suscripciones con cobro recurrente obligatorio
                </li>
                <li className="flex items-center gap-2 text-red-500">
                  ✕ Penalización por texto duplicado de Google
                </li>
                <li className="flex items-center gap-2 text-red-500">
                  ✕ Sin asistencia de inteligencia artificial
                </li>
                <li className="flex items-center gap-2 text-gray-500">
                  • Intermediación compleja en los leads
                </li>
              </ul>
            </div>
            <div className="mt-6 text-[11px] text-gray-400 text-center border-t border-gray-200 pt-3">
              Costoso para corredores individuales o dueños directos
            </div>
          </div>

          {/* Card 2: Plan Base Melsa ($10.000) */}
          <div 
            onClick={() => setSelectedPlan('standard')}
            className={`p-7 rounded-3xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
              selectedPlan === 'standard'
                ? 'bg-white border-[#D02126] shadow-xl ring-2 ring-[#D02126]/20'
                : 'bg-white border-gray-200 hover:border-gray-300'
            }`}
          >
            {selectedPlan === 'standard' && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[11px] font-bold bg-[#D02126] text-white uppercase tracking-wider shadow-sm">
                Seleccionado
              </span>
            )}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#D02126]">
                  Vitrina Melsa Estándar
                </span>
                <span className="text-[10px] bg-red-50 text-[#D02126] font-bold px-2 py-0.5 rounded-full">
                  Pago Único
                </span>
              </div>
              <h3 className="text-2xl font-serif font-bold text-[#0F1115] mb-2">Publicación Individual</h3>
              <div className="text-3xl font-serif font-bold text-[#0F1115] mb-4">
                $10.000 <span className="text-xs font-sans font-normal text-gray-500">CLP (45 días activos)</span>
              </div>
              <ul className="space-y-3 text-xs text-gray-700">
                <li className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#D02126]" />
                  <span>Ficha completa con hasta 15 fotografías</span>
                </li>
                <li className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#D02126]" />
                  <span>Contacto directo a tu WhatsApp y Teléfono</span>
                </li>
                <li className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#D02126]" />
                  <span>Reescritura SEO con IA Groq (0% texto duplicado)</span>
                </li>
                <li className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#D02126]" />
                  <span>Indexación en Google & Buscadores</span>
                </li>
                <li className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#D02126]" />
                  <span>0% comisiones sobre tu venta o arriendo</span>
                </li>
              </ul>
            </div>
            <button
              type="button"
              className={`w-full mt-6 py-3 rounded-xl font-semibold text-xs transition-all ${
                selectedPlan === 'standard'
                  ? 'bg-[#D02126] text-white shadow-md'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              Elegir Plan $10.000 CLP
            </button>
          </div>

          {/* Card 3: Plan Destacado Pro Melsa ($24.900) */}
          <div 
            onClick={() => setSelectedPlan('featured')}
            className={`p-7 rounded-3xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
              selectedPlan === 'featured'
                ? 'bg-gradient-to-b from-[#0F1115] to-[#171A21] text-white border-[#D02126] shadow-2xl ring-2 ring-[#D02126]/30'
                : 'bg-white border-gray-200 hover:border-gray-300'
            }`}
          >
            <span className="absolute -top-3 right-6 px-3 py-0.5 rounded-full text-[10px] font-bold bg-[#D02126] text-white uppercase tracking-wider shadow-sm flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Máxima Visibilidad
            </span>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className={`text-xs font-semibold uppercase tracking-wider ${selectedPlan === 'featured' ? 'text-red-400' : 'text-[#D02126]'}`}>
                  Vitrina Destacada Pro
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${selectedPlan === 'featured' ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-700'}`}>
                  60 Días
                </span>
              </div>
              <h3 className={`text-2xl font-serif font-bold mb-2 ${selectedPlan === 'featured' ? 'text-white' : 'text-[#0F1115]'}`}>
                Publicación + Sello IA
              </h3>
              <div className={`text-3xl font-serif font-bold mb-4 ${selectedPlan === 'featured' ? 'text-white' : 'text-[#0F1115]'}`}>
                $24.900 <span className={`text-xs font-sans font-normal ${selectedPlan === 'featured' ? 'text-gray-400' : 'text-gray-500'}`}>CLP (pago único)</span>
              </div>
              <ul className={`space-y-3 text-xs ${selectedPlan === 'featured' ? 'text-gray-300' : 'text-gray-700'}`}>
                <li className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#D02126]" />
                  <span>Todo lo del Plan Estándar incluido</span>
                </li>
                <li className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#D02126]" />
                  <span>Aparición prioritaria en Carrusel de Portada</span>
                </li>
                <li className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#D02126]" />
                  <span>Badge de &quot;Propiedad Verificada con IA Melsa&quot;</span>
                </li>
                <li className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#D02126]" />
                  <span>Reporte Viability Index de plusvalía y arriendo</span>
                </li>
                <li className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#D02126]" />
                  <span>Difusión en historias y newsletter de Melsa</span>
                </li>
              </ul>
            </div>
            <button
              type="button"
              className={`w-full mt-6 py-3 rounded-xl font-semibold text-xs transition-all ${
                selectedPlan === 'featured'
                  ? 'bg-[#D02126] text-white shadow-lg shadow-[#D02126]/40'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              Elegir Plan Destacado $24.900 CLP
            </button>
          </div>

        </div>

        {/* =================================================================== */}
        {/* INTERACTIVE PUBLICATION & CHECKOUT WIZARD                           */}
        {/* =================================================================== */}
        <div className="bg-[#FAF9F8] rounded-3xl border border-gray-200 p-6 sm:p-10 shadow-xl">
          
          {/* Stepper Tabs */}
          <div className="flex items-center justify-between border-b border-gray-200 pb-5 mb-8 overflow-x-auto gap-4">
            <button
              onClick={() => setActiveStep(1)}
              className={`flex items-center gap-2 text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                activeStep === 1 ? 'text-[#D02126]' : 'text-gray-400 hover:text-gray-700'
              }`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                activeStep === 1 ? 'bg-[#D02126] text-white' : 'bg-gray-200 text-gray-600'
              }`}>1</span>
              <span>1. Datos del Inmueble</span>
            </button>

            <span className="text-gray-300">/</span>

            <button
              onClick={() => setActiveStep(2)}
              className={`flex items-center gap-2 text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                activeStep === 2 ? 'text-[#D02126]' : 'text-gray-400 hover:text-gray-700'
              }`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                activeStep === 2 ? 'bg-[#D02126] text-white' : 'bg-gray-200 text-gray-600'
              }`}>2</span>
              <span>2. Redacción IA (Groq)</span>
            </button>

            <span className="text-gray-300">/</span>

            <button
              onClick={() => setActiveStep(3)}
              className={`flex items-center gap-2 text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                activeStep === 3 ? 'text-[#D02126]' : 'text-gray-400 hover:text-gray-700'
              }`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                activeStep === 3 ? 'bg-[#D02126] text-white' : 'bg-gray-200 text-gray-600'
              }`}>3</span>
              <span>3. Contacto & Fotos</span>
            </button>

            <span className="text-gray-300">/</span>

            <button
              onClick={() => setActiveStep(4)}
              className={`flex items-center gap-2 text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                activeStep === 4 ? 'text-[#D02126]' : 'text-gray-400 hover:text-gray-700'
              }`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                activeStep === 4 ? 'bg-[#D02126] text-white' : 'bg-gray-200 text-gray-600'
              }`}>4</span>
              <span>4. Pasarela de Pago</span>
            </button>
          </div>

          {/* STEP 1: PROPERTY DETAILS */}
          {activeStep === 1 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                    Tipo de Operación
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Venta', 'Arriendo'].map((op) => (
                      <button
                        key={op}
                        type="button"
                        onClick={() => setOperationType(op as any)}
                        className={`py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                          operationType === op
                            ? 'bg-[#D02126] text-white border-[#D02126]'
                            : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {op}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                    Tipo de Propiedad
                  </label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-[#0F1115] font-semibold focus:ring-2 focus:ring-[#D02126] outline-none"
                  >
                    <option value="Departamento">Departamento</option>
                    <option value="Casa">Casa</option>
                    <option value="Townhouse">Townhouse</option>
                    <option value="Parcela / Terreno">Parcela / Terreno</option>
                    <option value="Oficina / Local">Oficina / Local</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                    Ubicación / Comuna
                  </label>
                  <input
                    type="text"
                    value={locationCity}
                    onChange={(e) => setLocationCity(e.target.value)}
                    placeholder="Ej. Las Condes, Santiago"
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-[#0F1115] focus:ring-2 focus:ring-[#D02126] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                    Precio Publicado (UF o CLP)
                  </label>
                  <input
                    type="text"
                    value={priceValue}
                    onChange={(e) => setPriceValue(e.target.value)}
                    placeholder="Ej. 6.500 UF o $240.000.000"
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-[#0F1115] font-bold focus:ring-2 focus:ring-[#D02126] outline-none"
                  />
                </div>

              </div>

              {/* Specs Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                    Dormitorios
                  </label>
                  <input
                    type="text"
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                    placeholder="Ej. 2 o 3 + Servicio"
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-[#0F1115] focus:ring-2 focus:ring-[#D02126] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                    Baños
                  </label>
                  <input
                    type="text"
                    value={bathrooms}
                    onChange={(e) => setBathrooms(e.target.value)}
                    placeholder="Ej. 2 baños completos"
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-[#0F1115] focus:ring-2 focus:ring-[#D02126] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                    Superficie Total Útil (m²)
                  </label>
                  <input
                    type="text"
                    value={surfaceM2}
                    onChange={(e) => setSurfaceM2(e.target.value)}
                    placeholder="Ej. 75 m² útiles + 8 terraza"
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-[#0F1115] focus:ring-2 focus:ring-[#D02126] outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setActiveStep(2)}
                  className="px-6 py-3 rounded-xl bg-[#D02126] hover:bg-[#B81B1F] text-white font-semibold text-xs flex items-center gap-2 shadow-md cursor-pointer transition-all"
                >
                  <span>Continuar a Redacción IA</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: GROQ AI POWERED REWRITING */}
          {activeStep === 2 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900 leading-relaxed">
                  <strong>Protección Anti-Duplicidad de Google:</strong> Si ya tienes el texto publicado en Mercado Libre, PortalInmobiliario o Yapo, pégalo aquí abajo. Nuestro modelo de IA (Groq) lo reescribirá en segundos con redacción exclusiva de alta gama para que Google posicione tu aviso en primeros lugares sin penalizaciones.
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                {/* Input Draft */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Pega aquí tu borrador o texto actual
                    </label>
                    <button
                      type="button"
                      onClick={handleOptimizeWithAI}
                      disabled={isOptimizing || !rawNotes.trim()}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D02126] text-white text-[11px] font-semibold hover:bg-[#B81B1F] transition-all cursor-pointer shadow-sm disabled:opacity-50"
                    >
                      {isOptimizing ? (
                        <>
                          <RefreshCw className="w-3 h-3 animate-spin" />
                          <span>Reescribiendo con Groq...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3 h-3" />
                          <span>✨ Re-escribir con IA Groq</span>
                        </>
                      )}
                    </button>
                  </div>

                  <textarea
                    rows={8}
                    value={rawNotes}
                    onChange={(e) => setRawNotes(e.target.value)}
                    placeholder="Pega las características de la propiedad..."
                    className="w-full bg-white border border-gray-200 rounded-2xl p-4 text-xs text-[#0F1115] focus:ring-2 focus:ring-[#D02126] outline-none leading-relaxed"
                  />
                </div>

                {/* AI Output Preview */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                    Resultado Generado por IA Melsa (Vista Previa Ficha)
                  </label>

                  <div className="w-full bg-white border border-emerald-500/30 rounded-2xl p-4 text-xs text-gray-800 h-[216px] overflow-y-auto leading-relaxed shadow-inner">
                    {isOptimizing ? (
                      <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-2">
                        <RefreshCw className="w-6 h-6 text-[#D02126] animate-spin" />
                        <span>Generando copy inmobiliario con Groq...</span>
                      </div>
                    ) : optimizedDescription ? (
                      <div className="whitespace-pre-wrap">{optimizedDescription}</div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-gray-400 text-center px-4">
                        <Sparkles className="w-8 h-8 text-gray-300 mb-2" />
                        <span>Haz clic en &quot;Re-escribir con IA Groq&quot; para generar la ficha profesional optimizada para SEO.</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setActiveStep(1)}
                  className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 text-xs font-semibold hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  Volver al Paso 1
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStep(3)}
                  className="px-6 py-3 rounded-xl bg-[#D02126] hover:bg-[#B81B1F] text-white font-semibold text-xs flex items-center gap-2 shadow-md cursor-pointer transition-all"
                >
                  <span>Continuar a Contacto & Fotos</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: CONTACT & PHOTOS */}
          {activeStep === 3 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                    ¿Quién publica?
                  </label>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <button
                      type="button"
                      onClick={() => setIsBroker(true)}
                      className={`py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        isBroker ? 'bg-[#0F1115] text-white border-[#0F1115]' : 'bg-white border-gray-200 text-gray-700'
                      }`}
                    >
                      Corredor Inmobiliario
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsBroker(false)}
                      className={`py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        !isBroker ? 'bg-[#0F1115] text-white border-[#0F1115]' : 'bg-white border-gray-200 text-gray-700'
                      }`}
                    >
                      Propietario Directo
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Nombre Completo / Razón Social</label>
                      <input
                        type="text"
                        value={publisherName}
                        onChange={(e) => setPublisherName(e.target.value)}
                        placeholder="Ej. Rodrigo Fernández Propiedades"
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#0F1115] focus:ring-2 focus:ring-[#D02126] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">WhatsApp de Contacto Directo</label>
                      <input
                        type="tel"
                        value={publisherPhone}
                        onChange={(e) => setPublisherPhone(e.target.value)}
                        placeholder="+56 9 1234 5678"
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#0F1115] font-semibold focus:ring-2 focus:ring-[#D02126] outline-none"
                      />
                      <span className="text-[10px] text-gray-400 mt-0.5 block">Los clientes interesados harán clic y te hablarán directamente a este WhatsApp.</span>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Correo Electrónico</label>
                      <input
                        type="email"
                        value={publisherEmail}
                        onChange={(e) => setPublisherEmail(e.target.value)}
                        placeholder="contacto@tudominio.cl"
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#0F1115] focus:ring-2 focus:ring-[#D02126] outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Upload Photos Box */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                    Fotografías del Inmueble (Hasta 15 fotos)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center bg-white hover:bg-gray-50 transition-colors flex flex-col items-center justify-center space-y-3 cursor-pointer">
                    <div className="w-12 h-12 rounded-full bg-red-50 text-[#D02126] flex items-center justify-center">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-gray-700 block">Arrastra tus fotos aquí o haz clic para subir</span>
                      <span className="text-[11px] text-gray-400 font-light">Formatos JPG o PNG (resolución recomendada 1920x1080)</span>
                    </div>
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      ✓ Optimización automática de compresión WebP
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setActiveStep(2)}
                  className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 text-xs font-semibold hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  Volver al Paso 2
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStep(4)}
                  className="px-6 py-3 rounded-xl bg-[#D02126] hover:bg-[#B81B1F] text-white font-semibold text-xs flex items-center gap-2 shadow-md cursor-pointer transition-all"
                >
                  <span>Continuar a Pasarela de Pago</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

          {/* STEP 4: PAYMENT GATEWAY & CHECKOUT */}
          {activeStep === 4 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {!isPaymentSuccess ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Order Summary (5 cols) */}
                  <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-gray-200 space-y-4">
                    <span className="text-xs font-semibold text-[#D02126] uppercase tracking-wider block">
                      Resumen de tu Orden
                    </span>

                    <div className="border-b border-gray-100 pb-3">
                      <h4 className="text-base font-bold text-[#0F1115]">
                        {selectedPlan === 'standard' ? 'Vitrina Melsa Estándar (45 Días)' : 'Vitrina Destacada Pro + Sello IA (60 Días)'}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {propertyType} en {locationCity} ({operationType} por {priceValue})
                      </p>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between text-gray-600">
                        <span>Costo de publicación fija:</span>
                        <span className="font-semibold text-gray-900">${planPrice.toLocaleString('es-CL')} CLP</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Optimización SEO con IA Groq:</span>
                        <span className="text-emerald-600 font-semibold">GRATIS</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Vigencia en el portal:</span>
                        <span className="font-semibold text-gray-900">{planDays} Días Activos</span>
                      </div>
                      <div className="border-t border-gray-200 pt-3 flex justify-between items-baseline text-sm">
                        <span className="font-bold text-gray-800">Total a Pagar (Pago Único):</span>
                        <span className="text-xl font-serif font-bold text-[#D02126]">
                          ${planPrice.toLocaleString('es-CL')} CLP
                        </span>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-xl text-[11px] text-gray-500 space-y-1">
                      <div className="flex items-center gap-1.5 font-semibold text-gray-700">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Garantía de Cero Comisiones Melsa:</span>
                      </div>
                      <p>El 100% de la comisión de corretaje o valor de venta te pertenece a ti. Melsa no cobra porcentajes por cerrar el negocio.</p>
                    </div>
                  </div>

                  {/* Payment Methods (7 cols) */}
                  <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-gray-200 space-y-5">
                    
                    <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider block">
                      Selecciona tu Método de Pago Seguro
                    </span>

                    {/* Method Radio Options */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      
                      {/* Webpay Option */}
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('webpay')}
                        className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                          paymentMethod === 'webpay'
                            ? 'border-[#D02126] bg-red-50/30 ring-1 ring-[#D02126]'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <CreditCard className="w-5 h-5 text-[#D02126]" />
                          <span className="text-[10px] font-bold bg-[#D02126]/10 text-[#D02126] px-1.5 py-0.5 rounded">
                            Transbank Webpay
                          </span>
                        </div>
                        <span className="text-xs font-bold text-gray-800 block">Tarjetas de Débito & Crédito</span>
                        <span className="text-[11px] text-gray-500">Activación automática e inmediata</span>
                      </button>

                      {/* Transfer Option */}
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('transfer')}
                        className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                          paymentMethod === 'transfer'
                            ? 'border-[#D02126] bg-red-50/30 ring-1 ring-[#D02126]'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <Building2 className="w-5 h-5 text-gray-700" />
                          <span className="text-[10px] font-bold bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                            Transferencia Directa
                          </span>
                        </div>
                        <span className="text-xs font-bold text-gray-800 block">Transferencia Bancaria</span>
                        <span className="text-[11px] text-gray-500">Datos cuenta corriente Melsa SpA</span>
                      </button>

                    </div>

                    {/* Method Details */}
                    {paymentMethod === 'webpay' ? (
                      <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-xs space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-800">Pasarela Webpay Plus:</span>
                          <span className="text-gray-500">Redcompra, Visa, Mastercard, American Express</span>
                        </div>
                        <p className="text-[11px] text-gray-500 font-light">
                          Al hacer clic en pagar, serás redirigido al portal seguro de Transbank para procesar los ${planPrice.toLocaleString('es-CL')} CLP de manera encriptada.
                        </p>
                      </div>
                    ) : (
                      <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-xs space-y-2">
                        <span className="font-semibold text-gray-800 block">Datos de Transferencia Bancaria:</span>
                        <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-600">
                          <div><strong>Banco:</strong> Banco de Chile</div>
                          <div><strong>Tipo de Cuenta:</strong> Cuenta Corriente</div>
                          <div><strong>Razón Social:</strong> Melsa Inmobiliaria SpA</div>
                          <div><strong>RUT:</strong> 77.892.410-K</div>
                          <div className="col-span-2"><strong>Email para comprobante:</strong> pagos@melsainmobiliaria.com</div>
                        </div>
                      </div>
                    )}

                    {/* Final Pay Button */}
                    <button
                      type="button"
                      onClick={handleProcessPayment}
                      className="w-full py-4 rounded-xl bg-[#D02126] hover:bg-[#B81B1F] text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#D02126]/30 cursor-pointer"
                    >
                      <Zap className="w-4 h-4" />
                      <span>Completar Pago Único de ${planPrice.toLocaleString('es-CL')} CLP</span>
                    </button>

                    <div className="flex justify-between items-center pt-2">
                      <button
                        type="button"
                        onClick={() => setActiveStep(3)}
                        className="text-xs text-gray-500 hover:text-gray-800 underline cursor-pointer"
                      >
                        ← Editar datos de la propiedad
                      </button>
                      <span className="text-[11px] text-gray-400">Transacción Segura SSL 256-bit</span>
                    </div>

                  </div>

                </div>
              ) : (
                /* Payment Success View */
                <div className="bg-white p-8 sm:p-12 rounded-3xl border border-emerald-500/40 text-center max-w-2xl mx-auto space-y-6 shadow-2xl">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>

                  <div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 inline-block mb-3">
                      ¡Pago Recibido con Éxito!
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-serif text-[#0F1115]">
                      Tu Propiedad está Lista para ser Publicada
                    </h3>
                    <p className="text-xs text-gray-500 mt-2 font-mono">
                      Orden de Activación: <strong className="text-[#0F1115]">{orderNumber}</strong>
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-2xl text-xs text-gray-600 text-left space-y-2">
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-800">Inmueble:</span>
                      <span>{propertyType} en {locationCity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-800">Plan Seleccionado:</span>
                      <span className="text-[#D02126] font-bold">{selectedPlan === 'standard' ? 'Estándar 45 Días' : 'Destacado Pro 60 Días'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-800">Contacto Asignado:</span>
                      <span>{publisherName || 'Corredor'} ({publisherPhone})</span>
                    </div>
                  </div>

                  <a
                    href={`https://wa.me/${officialWhatsApp}?text=${encodeURIComponent(
                      `Hola equipo Melsa, acabo de completar el pago de $${planPrice.toLocaleString('es-CL')} CLP para publicar mi propiedad (Orden: ${orderNumber}). Inmueble: ${propertyType} en ${locationCity} (${priceValue}). Adjunto el comprobante para activación en el portal.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-4 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                  >
                    <span>Confirmar Activación Inmediata por WhatsApp</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      setIsPaymentSuccess(false);
                      setActiveStep(1);
                    }}
                    className="text-xs text-gray-400 hover:text-gray-700 underline block mx-auto cursor-pointer"
                  >
                    Publicar otra propiedad
                  </button>
                </div>
              )}

            </div>
          )}

        </div>

      </div>
    </section>
  );
};

