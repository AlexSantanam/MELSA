import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  X, 
  Sparkles, 
  MessageSquare, 
  PhoneCall, 
  TrendingUp, 
  ShieldCheck, 
  Building2,
  RefreshCw
} from 'lucide-react';
import { askMelsaAI, ChatMessage } from '../services/aiAdvisorService';

export const AIAssistantWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string }>>([
    {
      sender: 'bot',
      text: '¡Hola! Soy Melsa Copilot IA. ¿Buscas evaluar la plusvalía de una zona, calcular tu dividendo seguro o conocer opciones de inversión de alta rentabilidad?'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickQuestions = [
    '¿Qué rentabilidad esperar en Las Condes?',
    '¿Cómo funciona el pie en cuotas?',
    '¿Qué comunas tienen mayor plusvalía?',
    '¿Qué requisitos pide el banco?'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isLoading) return;

    const userMsg = { sender: 'user' as const, text };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsLoading(true);

    try {
      const history: ChatMessage[] = messages.slice(-4).map((m) => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text
      }));

      const reply = await askMelsaAI(text, history);
      setMessages((prev) => [...prev, { sender: 'bot', text: reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev, 
        { 
          sender: 'bot', 
          text: 'Ocurrió un error al procesar la respuesta. Puedes contactar directamente a nuestros ejecutivos en WhatsApp (+56 9 9989 9421).' 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const officialWhatsApp = "56999899421";

  return (
    <>
      {/* Floating Toggle Button (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        
        {/* Subtle tooltip when closed */}
        {!isOpen && (
          <div 
            onClick={() => setIsOpen(true)}
            className="hidden sm:flex items-center gap-2 bg-[#0F1115] text-white px-3.5 py-2 rounded-full border border-[#D02126]/40 shadow-xl cursor-pointer hover:border-[#D02126] transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D02126] animate-pulse" />
            <span className="text-xs font-semibold">Consultor Financiero IA</span>
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 border-2 cursor-pointer ${
            isOpen 
              ? 'bg-[#0F1115] text-white border-white/20 hover:border-white' 
              : 'bg-[#D02126] text-white border-white/30 hover:scale-105 hover:bg-[#B81B1F] shadow-[#D02126]/40'
          }`}
          aria-label="Abrir Asistente IA"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Bot className="w-7 h-7" />}
        </button>
      </div>

      {/* Chat Window Modal */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 w-[94vw] sm:w-[410px] h-[550px] max-h-[82vh] bg-[#0F1115] border border-white/15 rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden text-white backdrop-blur-xl animate-in fade-in slide-in-from-bottom-6 duration-200">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-[#171A21] to-[#0F1115] p-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#D02126]/20 border border-[#D02126]/50 flex items-center justify-center text-[#D02126]">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-white">Melsa Copilot IA</h3>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Groq Engine
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 font-light">Asesor Cuantitativo & Inversiones</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Prompts Bar */}
          <div className="p-2.5 bg-[#14171E] border-b border-white/5 overflow-x-auto flex gap-2 no-scrollbar">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                disabled={isLoading}
                className="whitespace-nowrap px-2.5 py-1 rounded-full text-[11px] bg-white/5 hover:bg-[#D02126]/20 hover:text-red-200 text-gray-300 border border-white/10 transition-colors cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed whitespace-pre-wrap ${
                    msg.sender === 'user'
                      ? 'bg-[#D02126] text-white rounded-br-xs shadow-md'
                      : 'bg-[#1A1E26] text-gray-200 border border-white/10 rounded-bl-xs'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-[#1A1E26] text-gray-300 border border-white/10 rounded-2xl p-3.5 rounded-bl-xs flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 text-[#D02126] animate-spin" />
                  <span className="text-xs text-gray-400">Analizando mercado con Groq IA...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* WhatsApp Direct Action Bar */}
          <div className="px-4 py-2 bg-[#12141A] border-t border-white/5 flex items-center justify-between text-[11px] text-gray-400">
            <span>¿Prefieres hablar con un asesor humano?</span>
            <a
              href={`https://wa.me/${officialWhatsApp}?text=${encodeURIComponent(
                'Hola equipo Melsa, estuve consultando con Melsa Copilot IA en su web y me gustaría continuar la asesoría con un ejecutivo.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#25D366] hover:underline font-semibold flex items-center gap-1"
            >
              WhatsApp Oficial
            </a>
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-[#171A21] border-t border-white/10 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Pregunta sobre plusvalía, créditos o arriendos..."
              className="flex-1 bg-[#0F1115] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:ring-1 focus:ring-[#D02126] outline-none"
            />
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="p-2.5 bg-[#D02126] hover:bg-[#B81B1F] disabled:opacity-50 text-white rounded-xl transition-all cursor-pointer shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </>
  );
};
