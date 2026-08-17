import React, { useState } from 'react';
import { MessageCircle, X, ChevronRight, Send } from 'lucide-react';

export const WhatsAppWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const whatsappNumber = '56973888336'; // Melsa Official WhatsApp

  const quickOptions = [
    {
      title: 'Información de Proyectos en Preventa',
      text: 'Hola Melsa, quiero información sobre proyectos residenciales en preventa.'
    },
    {
      title: 'Quiero Vender / Valorar mi Propiedad',
      text: 'Hola Melsa, me gustaría solicitar una valoración estratégica de mi propiedad.'
    },
    {
      title: 'Agendar Llamada con Asesor',
      text: 'Hola Melsa, deseo agendar una llamada con un asesor ejecutivo.'
    }
  ];

  const handleOpenWhatsApp = (customText: string) => {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(customText)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed bottom-6 left-6 z-40 flex flex-col items-start">
      
      {/* Expanded Quick Options Menu */}
      {isOpen && (
        <div className="mb-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          
          {/* Header */}
          <div className="bg-[#25D366] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-sm font-semibold leading-tight">MELSA WhatsApp</h4>
                <p className="text-[11px] text-white/80">Gestión Inmobiliaria • En línea</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Prompt options */}
          <div className="p-3 bg-gray-50 space-y-2 text-xs">
            <p className="text-gray-500 font-medium px-1 mb-2">
              ¿En qué podemos ayudarte hoy?
            </p>

            {quickOptions.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleOpenWhatsApp(opt.text)}
                className="w-full text-left p-2.5 bg-white hover:bg-[#FAF8F5] border border-gray-200 hover:border-[#25D366] rounded-xl transition-all flex items-center justify-between group shadow-2xs"
              >
                <span className="font-semibold text-[#0F2042] group-hover:text-[#25D366] pr-2">
                  {opt.title}
                </span>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
              </button>
            ))}
          </div>

          {/* Direct Start Footer */}
          <div className="p-3 bg-white border-t border-gray-100 text-center">
            <button
              onClick={() => handleOpenWhatsApp('Hola Melsa, deseo atención personalizada.')}
              className="w-full py-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Abrir chat directo</span>
            </button>
          </div>

        </div>
      )}

      {/* Floating Bottom Left WhatsApp Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-2xl hover:scale-110 transition-all duration-300 focus:outline-none border-2 border-white"
        aria-label="Contactar por WhatsApp"
      >
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse" />
        <MessageCircle className="w-7 h-7" />
        <span className="sr-only">WhatsApp Melsa</span>
      </button>

    </div>
  );
};
