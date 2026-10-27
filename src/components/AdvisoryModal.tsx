import React, { useState, useEffect } from 'react';
import { X, Calendar, User, Phone, Mail, Send, CheckCircle2 } from 'lucide-react';
import { TEAM_MEMBERS } from '../data/mockData';

interface AdvisoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedAgentId?: string;
  preselectedProjectId?: string;
}

export const AdvisoryModal: React.FC<AdvisoryModalProps> = ({
  isOpen,
  onClose,
  preselectedAgentId,
  preselectedProjectId
}) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [interestType, setInterestType] = useState('Comprar');
  const [selectedAgent, setSelectedAgent] = useState(preselectedAgentId || '');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('11:30 AM');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (preselectedAgentId) setSelectedAgent(preselectedAgentId);
    if (preselectedProjectId) {
      setMessage(`Interesado en proyecto con ID: ${preselectedProjectId}`);
    }
  }, [preselectedAgentId, preselectedProjectId]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-[#0F1115] text-white p-6 relative flex items-center justify-between border-b border-[#D02126]/30">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs text-red-300 font-semibold uppercase tracking-wider mb-1">
              <Calendar className="w-3.5 h-3.5 text-[#D02126]" />
              <span>Atención Personalizada Melsa</span>
            </div>
            <h3 className="text-2xl font-serif font-normal">Agenda una asesoría</h3>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          {isSubmitted ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#D02126]/10 text-[#D02126] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10 text-[#D02126]" />
              </div>
              <h4 className="text-2xl font-serif text-[#0F1115] font-semibold">
                ¡Solicitud Registrada con Éxito!
              </h4>
              <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
                Gracias <strong>{fullName}</strong>. Un asesor de <strong>Melsa, Gestión Inmobiliaria</strong> te contactará a la brevedad para confirmar los detalles de tu reunión.
              </p>
              <div className="pt-4">
                <button
                  onClick={handleReset}
                  className="px-8 py-3 rounded-full bg-[#D02126] text-white text-sm font-semibold hover:bg-[#B81B1F] transition-colors shadow-md"
                >
                  Entendido, volver
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Nombre Completo *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Ej. Constanza Silva"
                      className="w-full pl-9 pr-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D02126] focus:bg-white focus:outline-none"
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
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+56 9 1234 5678"
                      className="w-full pl-9 pr-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D02126] focus:bg-white focus:outline-none"
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="correo@ejemplo.com"
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D02126] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Objetivo Principal
                  </label>
                  <select
                    value={interestType}
                    onChange={(e) => setInterestType(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D02126] focus:bg-white focus:outline-none"
                  >
                    <option value="Comprar">Comprar para Vivir</option>
                    <option value="Invertir">Inversión y Renta</option>
                    <option value="Vender">Vender mi Propiedad</option>
                    <option value="Arrendar">Arrendar Propiedad</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Asesor Preferido (Opcional)
                  </label>
                  <select
                    value={selectedAgent}
                    onChange={(e) => setSelectedAgent(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D02126] focus:bg-white focus:outline-none"
                  >
                    <option value="">Cualquier asesor disponible</option>
                    {TEAM_MEMBERS.map((ag) => (
                      <option key={ag.id} value={ag.id}>
                        {ag.name} ({ag.role})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Fecha Sugerida
                  </label>
                  <input
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D02126] focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Horario Preferido
                  </label>
                  <select
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D02126] focus:bg-white focus:outline-none"
                  >
                    <option value="09:30 AM">09:30 AM</option>
                    <option value="11:30 AM">11:30 AM</option>
                    <option value="03:00 PM">03:00 PM</option>
                    <option value="05:30 PM">05:30 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Comentario o consulta específica
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Detalla tu requerimiento o rango de presupuesto aproximado..."
                  className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D02126] focus:bg-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl bg-[#D02126] hover:bg-[#B81B1F] text-white font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-md"
              >
                <Send className="w-4 h-4 text-white" />
                <span>Confirmar y Enviar Solicitud</span>
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
