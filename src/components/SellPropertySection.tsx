import React, { useState } from 'react';
import { 
  Building, 
  MapPin, 
  Maximize2, 
  DollarSign, 
  User, 
  Phone, 
  Mail, 
  Send, 
  CheckCircle2, 
  Sparkles, 
  Camera, 
  ShieldCheck, 
  Award 
} from 'lucide-react';

export const SellPropertySection: React.FC = () => {
  const [propertyType, setPropertyType] = useState('Departamento');
  const [location, setLocation] = useState('Las Condes');
  const [surfaceM2, setSurfaceM2] = useState('140');
  const [bedrooms, setBedrooms] = useState('3');
  const [estimatedPrice, setEstimatedPrice] = useState('280000');
  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const handleSendToWhatsApp = () => {
    const text = `Hola Melsa, deseo consignar mi propiedad para venta:\n• Tipo: ${propertyType}\n• Comuna: ${location}\n• Superficie: ${surfaceM2} m² (${bedrooms} dorms)\n• Expectativa: $${Number(estimatedPrice).toLocaleString('en-US')} USD\n• Nombre: ${ownerName}\n• Teléfono: ${ownerPhone}`;
    window.open(`https://wa.me/56999899421?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <section id="vender" className="py-24 bg-[#FAF9F8] relative overflow-hidden border-t border-gray-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D02126]/10 text-[#D02126] text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Para Propietarios Exclusivos</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#0F1115] font-normal tracking-tight mb-5">
            Consigna o Vende tu Propiedad con MELSA
          </h2>
          <p className="text-gray-600 text-base sm:text-lg font-light leading-relaxed">
            Te ayudamos a maximizar el valor de tu patrimonio con tasación respaldada en transacciones reales, producción audiovisual de alta gama y acceso a compradores solventes calificados.
          </p>
        </div>

        {/* 2-Column Valuation & Captation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Beneficios de vender con MELSA */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-white p-7 rounded-3xl border border-gray-200 shadow-sm space-y-5">
              <h3 className="text-xl font-serif text-[#0F1115] font-semibold">
                ¿Por qué confiar la venta de tu activo a Melsa?
              </h3>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#D02126]/10 flex items-center justify-center shrink-0 text-[#D02126]">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#0F1115]">Producción Audiovisual sin costo inicial</h4>
                    <p className="text-xs text-gray-500 font-light mt-0.5">Fotografía editorial, tomas aéreas con dron 4K y tour 3D interactivo para propiedades calificadas.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#D02126]/10 flex items-center justify-center shrink-0 text-[#D02126]">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#0F1115]">Pre-calificación rigurosa de visitas</h4>
                    <p className="text-xs text-gray-500 font-light mt-0.5">Solo agendamos visitas con personas que cuentan con pre-aprobación bancaria o fondos certificados.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#D02126]/10 flex items-center justify-center shrink-0 text-[#D02126]">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#0F1115]">Estudio de Títulos Preventivo</h4>
                    <p className="text-xs text-gray-500 font-light mt-0.5">Revisión jurídica previa de la propiedad para que la promesa y escritura se cierren en tiempo récord.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Phone Assistance Banner */}
            <div className="bg-[#0F1115] text-white p-6 rounded-3xl border border-[#D02126]/30 shadow-md flex items-center justify-between">
              <div>
                <span className="text-xs text-red-300 font-medium block">¿Prefieres atención telefónica directa?</span>
                <span className="text-sm font-semibold">+56 9 9989 9421</span>
              </div>
              <a
                href="tel:+56999899421"
                className="px-4 py-2 rounded-xl bg-[#D02126] hover:bg-[#B81B1F] text-xs font-semibold transition-colors"
              >
                Llamar ahora
              </a>
            </div>

          </div>

          {/* Right Column: Interactive Valuation & Consignment Calculator */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-gray-200 shadow-xl">
            {isSubmitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#D02126]/10 text-[#D02126] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h4 className="text-2xl font-serif text-[#0F1115] font-bold">
                  ¡Solicitud de Tasación Registrada!
                </h4>
                <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
                  Gracias <strong>{ownerName}</strong>. Un perito tasador y asesor senior de <strong>MELSA</strong> revisará los antecedentes de tu {propertyType.toLowerCase()} en {location} y te enviará un informe comparativo preliminar.
                </p>
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={handleSendToWhatsApp}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold transition-all shadow-md"
                  >
                    Enviar datos por WhatsApp directo
                  </button>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#0F1115] text-white text-xs font-semibold hover:bg-gray-800 transition-colors"
                  >
                    Ingresar otra propiedad
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h3 className="text-xl font-serif text-[#0F1115] font-semibold mb-1">
                    Calculadora de Tasación & Solicitud de Venta
                  </h3>
                  <p className="text-xs text-gray-500 font-light">
                    Ingresa los datos básicos para recibir un análisis comparativo de mercado sin costo.
                  </p>
                </div>

                {/* Step 1: Property Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-[#D02126]" />
                      Tipo de Inmueble
                    </label>
                    <select
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-semibold text-[#0F1115] focus:ring-2 focus:ring-[#D02126] focus:outline-none"
                    >
                      <option value="Departamento">Departamento / Penthouse</option>
                      <option value="Casa">Casa en Condominio / Villa</option>
                      <option value="Terreno">Terreno / Parcela / Paño</option>
                      <option value="Oficina">Oficina Comercial</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#D02126]" />
                      Comuna / Sector
                    </label>
                    <select
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-semibold text-[#0F1115] focus:ring-2 focus:ring-[#D02126] focus:outline-none"
                    >
                      <option value="Las Condes">Las Condes (El Golf / San Damián)</option>
                      <option value="Vitacura">Vitacura (Lo Curro / Santa María)</option>
                      <option value="Lo Barnechea">Lo Barnechea (La Dehesa)</option>
                      <option value="Providencia">Providencia</option>
                      <option value="Zapallar / Costa">Zapallar / Cachagua / Reñaca</option>
                      <option value="Otra Comuna">Otra Comuna</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <Maximize2 className="w-3.5 h-3.5 text-[#D02126]" />
                      Superficie (m²)
                    </label>
                    <input
                      type="number"
                      required
                      value={surfaceM2}
                      onChange={(e) => setSurfaceM2(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-semibold text-[#0F1115] focus:ring-2 focus:ring-[#D02126] focus:outline-none"
                      placeholder="Ej. 140"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                      Dormitorios
                    </label>
                    <select
                      value={bedrooms}
                      onChange={(e) => setBedrooms(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-semibold text-[#0F1115] focus:ring-2 focus:ring-[#D02126] focus:outline-none"
                    >
                      <option value="1">1 Dormitorio</option>
                      <option value="2">2 Dormitorios</option>
                      <option value="3">3 Dormitorios</option>
                      <option value="4+">4 o más Dormitorios</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-[#D02126]" />
                      Expectativa (USD)
                    </label>
                    <input
                      type="number"
                      step={5000}
                      value={estimatedPrice}
                      onChange={(e) => setEstimatedPrice(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-semibold text-[#0F1115] focus:ring-2 focus:ring-[#D02126] focus:outline-none"
                      placeholder="Ej. 280000"
                    />
                  </div>
                </div>

                {/* Step 2: Owner Contact */}
                <div className="pt-2 border-t border-gray-100 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                        Tu Nombre Completo *
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          required
                          value={ownerName}
                          onChange={(e) => setOwnerName(e.target.value)}
                          placeholder="Ej. Andrés Valenzuela"
                          className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D02126] focus:bg-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                        Teléfono / WhatsApp *
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                        <input
                          type="tel"
                          required
                          value={ownerPhone}
                          onChange={(e) => setOwnerPhone(e.target.value)}
                          placeholder="+56 9 1234 5678"
                          className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D02126] focus:bg-white focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                      Correo Electrónico *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        required
                        value={ownerEmail}
                        onChange={(e) => setOwnerEmail(e.target.value)}
                        placeholder="propietario@email.com"
                        className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D02126] focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  className="w-full py-4 px-6 rounded-xl bg-[#D02126] hover:bg-[#B81B1F] text-white font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-red-950/20"
                >
                  <Send className="w-4 h-4 text-white" />
                  <span>Solicitar Tasación Gratuita y Plan de Venta</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};

