import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, X, Loader2, Sparkles, Building, ChevronRight } from 'lucide-react';
import { 
  searchChileanAddresses, 
  getSuggestedStreetsForCommune, 
  AddressSuggestion 
} from '../services/propertyValuationEngine';

interface AddressSearchAutocompleteProps {
  value: string;
  onChange: (address: string) => void;
  commune: string;
  placeholder?: string;
  className?: string;
  onSelectSuggestion?: (suggestion: AddressSuggestion) => void;
}

export const AddressSearchAutocomplete: React.FC<AddressSearchAutocompleteProps> = ({
  value,
  onChange,
  commune,
  placeholder = 'Ej. Av. Los Pinos 1420',
  className = '',
  onSelectSuggestion
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Calles y sugerencias instantáneas en tiempo real (0ms latencia)
  const suggestions = searchChileanAddresses(commune, value);
  const popularStreets = getSuggestedStreetsForCommune(commune);

  // Cerrar al hacer clic fuera del componente
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (item: AddressSuggestion) => {
    onChange(item.address);
    if (onSelectSuggestion) {
      onSelectSuggestion(item);
    }
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
        handleSelect(suggestions[highlightedIndex]);
      } else if (suggestions.length > 0) {
        handleSelect(suggestions[0]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* Campo de Entrada Principal */}
      <div className="relative flex items-center">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoComplete="off"
          className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl pl-9 pr-8 py-2.5 text-xs text-[#0F1115] font-semibold outline-none focus:border-[#D02126] focus:bg-white transition-all shadow-xs"
        />

        {/* Icono de Lupa / Pin */}
        <div className="absolute left-3 text-[#D02126] pointer-events-none flex items-center">
          <MapPin className="w-3.5 h-3.5" />
        </div>

        {/* Botón para Limpiar */}
        {value && (
          <button
            type="button"
            onClick={() => {
              onChange('');
              inputRef.current?.focus();
            }}
            className="absolute right-2.5 text-gray-400 hover:text-gray-600 p-0.5 rounded-full hover:bg-gray-100 transition-colors"
            title="Limpiar dirección"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Dropdown Flotante de Coincidencias */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-2xl shadow-2xl border border-gray-200/90 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-80 overflow-y-auto">
          {/* Header del Autocomplete */}
          <div className="px-3 py-2 bg-gray-50 border-b border-gray-100 flex items-center justify-between text-[10px] text-gray-500 font-bold">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#D02126]" />
              <span>Direcciones en {commune}</span>
            </span>
            <span>{suggestions.length} resultados</span>
          </div>

          {/* Lista de Sugerencias Filtradas */}
          {suggestions.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {suggestions.map((item, idx) => {
                const isSelected = idx === highlightedIndex;
                return (
                  <div
                    key={idx}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    onClick={() => handleSelect(item)}
                    className={`px-3.5 py-2.5 flex items-start gap-2.5 cursor-pointer transition-colors ${
                      isSelected ? 'bg-red-50/70 text-[#0F1115]' : 'hover:bg-gray-50 text-gray-800'
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${item.plusvaliaTag ? 'bg-[#D02126]/10 text-[#D02126]' : 'bg-gray-100 text-gray-500'}`}>
                      <MapPin className="w-3.5 h-3.5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-bold text-[#0F1115] truncate">
                          {item.address}
                        </span>
                        {item.plusvaliaTag && (
                          <span className="px-1.5 py-0.5 rounded-md text-[9px] font-extrabold bg-[#D02126] text-white shrink-0">
                            {item.plusvaliaTag}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 text-[10px] text-gray-500 mt-0.5">
                        <span>{item.commune}</span>
                        {item.landmark && (
                          <>
                            <span>•</span>
                            <span className="text-amber-700 font-medium truncate flex items-center gap-1">
                              <Sparkles className="w-2.5 h-2.5 text-amber-500 shrink-0" />
                              {item.landmark}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <ChevronRight className={`w-3.5 h-3.5 shrink-0 self-center text-gray-300 ${isSelected ? 'text-[#D02126] translate-x-0.5' : ''} transition-transform`} />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-4 text-center space-y-1">
              <p className="text-xs font-bold text-gray-700">Sin coincidencias exactas</p>
              <p className="text-[11px] text-gray-500">
                Puedes continuar con "{value}" o seleccionar una calle conocida:
              </p>
              <div className="flex flex-wrap gap-1.5 justify-center pt-2">
                {popularStreets.slice(0, 4).map((st, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSelect({ address: st, streetOnly: st, commune })}
                    className="text-[10px] px-2 py-1 rounded-lg bg-gray-100 hover:bg-red-50 hover:text-[#D02126] text-gray-700 font-medium transition-colors border border-gray-200"
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Footer de Calles Populares en la Comuna */}
          <div className="p-2 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400">
            <span>Usa ↑ ↓ para navegar, Enter para seleccionar</span>
            <span className="font-semibold text-gray-500">MELSA Geocoder CL</span>
          </div>
        </div>
      )}
    </div>
  );
};
