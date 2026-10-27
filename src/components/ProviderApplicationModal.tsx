import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  CheckCircle2, 
  ShieldCheck, 
  Building2, 
  User, 
  FileText, 
  ArrowRight, 
  AlertCircle,
  FileCheck2,
  Clock
} from 'lucide-react';
import { ProviderApplication } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface ProviderApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitApplication: (app: ProviderApplication) => void;
}

export const ProviderApplicationModal: React.FC<ProviderApplicationModalProps> = ({
  isOpen,
  onClose,
  onSubmitApplication
}) => {
  const [step, setStep] = useState<number>(1);
  const [applicantType, setApplicantType] = useState<'Particular' | 'Empresa'>('Particular');
  
  // Form fields
  const [fullName, setFullName] = useState('');
  const [rut, setRut] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+56 9 ');
  const [category, setCategory] = useState('Gasfitería');
  const [selectedZones, setSelectedZones] = useState<string[]>(['Las Condes', 'Vitacura']);
  const [yearsExperience, setYearsExperience] = useState('5');
  const [notes, setNotes] = useState('');

  // Uploaded docs state
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, boolean>>({});
  const [submittedAppId, setSubmittedAppId] = useState<string>('');

  if (!isOpen) return null;

  const zonesList = [
    'Región Metropolitana (Santiago)',
    'Valparaíso & Costa',
    'Biobío (Concepción / San Pedro)',
    'Coquimbo & La Serena',
    'Antofagasta / Calama',
    'Los Lagos (Puerto Montt / Varas)',
    'La Araucanía (Temuco / Pucón)',
    'O\'Higgins (Rancagua / Machalí)',
    'Maule (Talca / Curicó)',
    'Los Ríos (Valdivia)',
    'Zona Norte (Arica / Iquique)',
    'Zona Austral (Punta Arenas)',
    'Cobertura Nacional (Todo Chile)'
  ];

  const toggleZone = (z: string) => {
    setSelectedZones((prev) => 
      prev.includes(z) ? prev.filter(item => item !== z) : [...prev, z]
    );
  };

  const handleSimulateUpload = (docKey: string) => {
    setUploadedDocs((prev) => ({
      ...prev,
      [docKey]: !prev[docKey]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = 'APP-' + Math.floor(100 + Math.random() * 900);
    setSubmittedAppId(newId);

    const docsRequired = applicantType === 'Particular' 
      ? [
          { name: 'Cédula de Identidad por ambos lados', type: 'PDF / Foto' },
          { name: 'Certificado de Antecedentes para Fines Especiales (Registro Civil)', type: 'PDF' },
          { name: 'Iniciación de Actividades / Boleta Honorarios (SII)', type: 'PDF' },
          { name: 'Certificación técnica o Carnet SEC (si aplica)', type: 'PDF' }
        ]
      : [
          { name: 'E-RUT & Escritura Constitución de Sociedad SpA / Ltda', type: 'PDF' },
          { name: 'Carpeta Tributaria Electrónica SII (12 meses)', type: 'PDF' },
          { name: 'Certificado de Vigencia de Poderes Registro Empresas', type: 'PDF' },
          { name: 'Acreditaciones técnicas del equipo de trabajo', type: 'PDF' }
        ];

    const newApp: ProviderApplication = {
      id: newId,
      applicantType,
      fullNameOrCompanyName: fullName,
      rut,
      contactEmail: email,
      contactPhone: phone,
      category,
      zones: selectedZones,
      appliedDate: 'Hoy',
      status: 'Pendiente',
      documents: docsRequired.map(d => ({
        name: d.name,
        type: d.type,
        status: uploadedDocs[d.name] ? 'Cargado' : 'Faltante'
      })),
      notes: notes || `${yearsExperience} años de experiencia en el rubro.`
    };

    onSubmitApplication(newApp);

    if (isSupabaseConfigured()) {
      supabase.from('provider_applications').insert([{
        applicant_type: applicantType.toLowerCase(),
        name: fullName,
        rut,
        category,
        phone,
        email,
        region: selectedRegion,
        communes: selectedZones,
        experience_years: parseInt(yearsExperience) || 1,
        documents_urls: uploadedDocs,
        status: 'Pendiente',
        audit_notes: notes || `${yearsExperience} años de experiencia en el rubro.`
      }]).then(({ error }) => {
        if (error) console.warn('Supabase postulation sync notice:', error.message);
      });
    }

    setStep(3); // success view
  };

  const officialWhatsApp = "56999899421";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-gray-200 relative max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-800 p-1 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D02126]/10 text-[#D02126] text-xs font-semibold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Pre-Filtro de Admisión Melsa</span>
          </div>
          <h3 className="text-2xl font-serif font-bold text-[#0F1115]">
            Postulación a la Red de Confianza Hogar
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Para garantizar la seguridad de los clientes de Melsa, exigimos documentos tributarios y antecedentes penales vigentes antes de activar tu perfil público.
          </p>
        </div>

        {/* Stepper Progress */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6 text-xs font-semibold">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-[#D02126]' : 'text-gray-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step >= 1 ? 'bg-[#D02126] text-white' : 'bg-gray-200 text-gray-600'}`}>1</span>
            <span>Datos & Categoría</span>
          </div>
          <span className="text-gray-300">/</span>
          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-[#D02126]' : 'text-gray-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step >= 2 ? 'bg-[#D02126] text-white' : 'bg-gray-200 text-gray-600'}`}>2</span>
            <span>Documentos Obligatorios</span>
          </div>
          <span className="text-gray-300">/</span>
          <div className={`flex items-center gap-2 ${step === 3 ? 'text-[#D02126]' : 'text-gray-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step === 3 ? 'bg-[#D02126] text-white' : 'bg-gray-200 text-gray-600'}`}>3</span>
            <span>Auditoría Melsa</span>
          </div>
        </div>

        {/* STEP 1: APPLICANT TYPE & BASIC DATA */}
        {step === 1 && (
          <div className="space-y-4">
            
            {/* Type selector */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                Tipo de Postulante
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setApplicantType('Particular')}
                  className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                    applicantType === 'Particular'
                      ? 'border-[#D02126] bg-red-50/40 ring-1 ring-[#D02126]'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <User className="w-5 h-5 text-[#D02126]" />
                  <div>
                    <span className="text-xs font-bold text-gray-800 block">Particular / Técnico</span>
                    <span className="text-[11px] text-gray-500">Gasfiters, Electricistas, etc.</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setApplicantType('Empresa')}
                  className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                    applicantType === 'Empresa'
                      ? 'border-[#D02126] bg-red-50/40 ring-1 ring-[#D02126]'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <Building2 className="w-5 h-5 text-[#D02126]" />
                  <div>
                    <span className="text-xs font-bold text-gray-800 block">Empresa / Contratista</span>
                    <span className="text-[11px] text-gray-500">SpA, Ltda, Remodelaciones</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Name & RUT */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  {applicantType === 'Particular' ? 'Nombre Completo' : 'Razón Social / Empresa'}
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={applicantType === 'Particular' ? 'Ej. Rodrigo Morales V.' : 'Ej. Alerce Construcción SpA'}
                  className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#0F1115] focus:ring-1 focus:ring-[#D02126] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  RUT {applicantType === 'Particular' ? 'Personal' : 'Empresa'}
                </label>
                <input
                  type="text"
                  required
                  value={rut}
                  onChange={(e) => setRut(e.target.value)}
                  placeholder="Ej. 15.421.890-K"
                  className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#0F1115] focus:ring-1 focus:ring-[#D02126] outline-none"
                />
              </div>
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contacto@profesional.cl"
                  className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#0F1115] focus:ring-1 focus:ring-[#D02126] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">WhatsApp de Contacto Directo</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+56 9 1234 5678"
                  className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#0F1115] font-semibold focus:ring-1 focus:ring-[#D02126] outline-none"
                />
              </div>
            </div>

            {/* Category & Years */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Especialidad Principal</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#0F1115] font-semibold focus:ring-1 focus:ring-[#D02126] outline-none cursor-pointer"
                >
                  <option value="Gasfitería">Gasfitería & Calefón</option>
                  <option value="Electricidad">Electricidad SEC</option>
                  <option value="Remodelación & Pintura">Remodelación & Pintura</option>
                  <option value="Climatización">Climatización & Aire</option>
                  <option value="Jardinería">Jardinería & Riego</option>
                  <option value="Cerrajería">Cerrajería 24/7</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Años de Trayectoria</label>
                <input
                  type="number"
                  min="1"
                  max="40"
                  value={yearsExperience}
                  onChange={(e) => setYearsExperience(e.target.value)}
                  className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#0F1115] focus:ring-1 focus:ring-[#D02126] outline-none"
                />
              </div>
            </div>

            {/* Coverage Zones */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Comunas de Atención (Selecciona las que cubres):
              </label>
              <div className="flex flex-wrap gap-1.5">
                {zonesList.map((z) => (
                  <button
                    key={z}
                    type="button"
                    onClick={() => toggleZone(z)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                      selectedZones.includes(z)
                        ? 'bg-[#0F1115] text-white border-[#0F1115]'
                        : 'bg-[#FAF9F8] text-gray-600 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {selectedZones.includes(z) ? `✓ ${z}` : z}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                disabled={!fullName || !rut || !email}
                onClick={() => setStep(2)}
                className="px-6 py-3 rounded-xl bg-[#D02126] hover:bg-[#B81B1F] disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-2 shadow-md cursor-pointer transition-all"
              >
                <span>Continuar a Subida de Documentos</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

        {/* STEP 2: MANDATORY PRE-SET DOCUMENTS */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-2xl flex items-start gap-3 text-xs text-amber-900 leading-relaxed">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>
                <strong>Documentación Auditada:</strong> Adjunta los documentos en formato PDF o imagen legible. Nuestro equipo de auditoría Melsa cotejará los antecedentes con las bases públicas oficiales antes de publicar tu ficha.
              </span>
            </div>

            {applicantType === 'Particular' ? (
              /* Particular Documents */
              <div className="space-y-3">
                {[
                  { id: 'Cédula de Identidad por ambos lados', label: '1. Cédula de Identidad (Ambos Lados)', desc: 'Documento vigente para verificación de identidad.' },
                  { id: 'Certificado de Antecedentes para Fines Especiales (Registro Civil)', label: '2. Certificado de Antecedentes Fines Especiales', desc: 'Emitido por el Registro Civil (antigüedad menor a 60 días).' },
                  { id: 'Iniciación de Actividades / Boleta Honorarios (SII)', label: '3. Iniciación de Actividades en el SII', desc: 'Comprobante de emisión de boletas de honorarios.' },
                  { id: 'Certificación técnica o Carnet SEC (si aplica)', label: '4. Licencia Técnica SEC / Certificaciones', desc: 'Carnet SEC para gasfitería y electricidad (opcional para otros rubros).' }
                ].map((doc) => {
                  const isUploaded = uploadedDocs[doc.id];
                  return (
                    <div
                      key={doc.id}
                      className="p-3.5 rounded-2xl border border-gray-200 bg-[#FAF9F8] flex items-center justify-between gap-3"
                    >
                      <div className="flex items-start gap-3">
                        <FileText className={`w-5 h-5 shrink-0 mt-0.5 ${isUploaded ? 'text-emerald-600' : 'text-gray-400'}`} />
                        <div>
                          <span className="text-xs font-bold text-gray-800 block">{doc.label}</span>
                          <span className="text-[11px] text-gray-500 font-light">{doc.desc}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleSimulateUpload(doc.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                          isUploaded 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : 'bg-white border border-gray-300 text-gray-700 hover:border-[#D02126]'
                        }`}
                      >
                        {isUploaded ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Listo</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-3.5 h-3.5" />
                            <span>Cargar Archivo</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Empresa Documents */
              <div className="space-y-3">
                {[
                  { id: 'E-RUT & Escritura Constitución de Sociedad SpA / Ltda', label: '1. E-RUT & Escritura de Constitución de Sociedad', desc: 'Copia autorizada de constitución y publicación en Diario Oficial.' },
                  { id: 'Carpeta Tributaria Electrónica SII (12 meses)', label: '2. Carpeta Tributaria Electrónica SII para Terceros', desc: 'F29 y declaraciones de renta de los últimos 12 meses.' },
                  { id: 'Certificado de Vigencia de Poderes Registro Empresas', label: '3. Certificado de Vigencia de Poderes', desc: 'Emitido por Registro de Empresas y Sociedades (RES).' },
                  { id: 'Acreditaciones técnicas del equipo de trabajo', label: '4. Acreditaciones Técnicas o Póliza de Seguro', desc: 'Seguro de responsabilidad civil o certificaciones del personal técnico.' }
                ].map((doc) => {
                  const isUploaded = uploadedDocs[doc.id];
                  return (
                    <div
                      key={doc.id}
                      className="p-3.5 rounded-2xl border border-gray-200 bg-[#FAF9F8] flex items-center justify-between gap-3"
                    >
                      <div className="flex items-start gap-3">
                        <FileText className={`w-5 h-5 shrink-0 mt-0.5 ${isUploaded ? 'text-emerald-600' : 'text-gray-400'}`} />
                        <div>
                          <span className="text-xs font-bold text-gray-800 block">{doc.label}</span>
                          <span className="text-[11px] text-gray-500 font-light">{doc.desc}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleSimulateUpload(doc.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                          isUploaded 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : 'bg-white border border-gray-300 text-gray-700 hover:border-[#D02126]'
                        }`}
                      >
                        {isUploaded ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Listo</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-3.5 h-3.5" />
                            <span>Cargar Archivo</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Comentarios adicionales o descripción de experiencia (opcional)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Indica tus principales marcas trabajadas, garantías que ofreces, etc."
                className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl p-3 text-xs text-[#0F1115] focus:ring-1 focus:ring-[#D02126] outline-none"
              />
            </div>

            <div className="flex justify-between pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 text-xs font-semibold hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Volver al Paso 1
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="px-6 py-3 rounded-xl bg-[#D02126] hover:bg-[#B81B1F] text-white font-semibold text-xs flex items-center gap-2 shadow-md cursor-pointer transition-all"
              >
                <span>Enviar Postulación para Auditoría Melsa</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: CONFIRMATION & AUDIT DISPATCH */}
        {step === 3 && (
          <div className="text-center py-6 space-y-5 animate-in fade-in duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 inline-block mb-3">
                Estado: En Proceso de Auditoría
              </span>
              <h4 className="text-2xl font-serif text-[#0F1115]">
                ¡Postulación Ingresada con Éxito!
              </h4>
              <p className="text-xs text-gray-500 mt-2 font-mono">
                Código de Solicitud: <strong className="text-[#0F1115]">{submittedAppId}</strong>
              </p>
            </div>

            <div className="bg-[#FAF9F8] p-4 rounded-2xl text-xs text-gray-600 text-left space-y-2 border border-gray-200">
              <div className="flex justify-between">
                <span className="font-semibold text-gray-800">Postulante:</span>
                <span>{fullName} ({applicantType})</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-800">Especialidad:</span>
                <span>{category}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-800">Plazo de Revisión:</span>
                <span className="text-emerald-700 font-bold">24 a 48 hrs hábiles</span>
              </div>
            </div>

            <p className="text-xs text-gray-500 font-light max-w-md mx-auto">
              Nuestro equipo verificará los antecedentes y la vigencia tributaria. Una vez aprobado, recibirás tu clave de acceso para subir fotos de tus proyectos y activar tu perfil.
            </p>

            <div className="pt-2">
              <a
                href={`https://wa.me/${officialWhatsApp}?text=${encodeURIComponent(
                  `Hola equipo de auditoría Melsa, acabo de enviar mi postulación para la Red de Confianza Hogar (Solicitud: ${submittedAppId}). Mi nombre es ${fullName} (${category}). Adjunto comprobante para acelerar la revisión.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <span>Avisar al Equipo de Auditoría por WhatsApp</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="text-xs text-gray-400 hover:text-gray-700 underline block mx-auto cursor-pointer"
            >
              Cerrar ventana
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

