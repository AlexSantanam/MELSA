import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  MapPin, 
  Search, 
  X, 
  Loader2, 
  Sparkles, 
  Building, 
  ChevronRight, 
  Navigation, 
  Map as MapIcon, 
  Compass, 
  Check 
} from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { 
  searchChileanAddresses, 
  getSuggestedStreetsForCommune, 
  getCommuneCenterCoord, 
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

// Custom vector red pin marker matching MELSA brand (100% reliable, zero 404 missing asset bugs)
const createCustomPinIcon = () => {
  return L.divIcon({
    className: 'custom-melsa-pin',
    html: `
      <div style="position: relative; width: 36px; height: 42px; transform: translate(-50%, -100%);">
        <svg viewBox="0 0 24 24" width="36" height="42" fill="#D02126" stroke="#ffffff" stroke-width="1.5" style="filter: drop-shadow(0 3px 6px rgba(208,33,38,0.4));">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
          <circle cx="12" cy="9" r="2.8" fill="#ffffff"/>
        </svg>
        <div style="position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); width: 12px; height: 4px; background: rgba(0,0,0,0.3); border-radius: 50%; filter: blur(1px);"></div>
      </div>
    `,
    iconSize: [36, 42],
    iconAnchor: [18, 42]
  });
};

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
  const [isLoadingOnline, setIsLoadingOnline] = useState(false);
  const [onlineSuggestions, setOnlineSuggestions] = useState<AddressSuggestion[]>([]);
  const [isLocatingGPS, setIsLocatingGPS] = useState(false);
  const [showMap, setShowMap] = useState(false);
  
  // Coordenadas activas del marcador (inician en el centro de la comuna)
  const defaultCoord = getCommuneCenterCoord(commune);
  const [coords, setCoords] = useState<{ lat: number; lng: number }>(defaultCoord);
  const [pinAddressNote, setPinAddressNote] = useState<string>('');

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerInstanceRef = useRef<L.Marker | null>(null);

  // Actualizar coordenadas cuando cambia la comuna
  useEffect(() => {
    const newCoord = getCommuneCenterCoord(commune);
    setCoords(newCoord);
    if (mapInstanceRef.current && markerInstanceRef.current) {
      mapInstanceRef.current.setView([newCoord.lat, newCoord.lng], 15);
      markerInstanceRef.current.setLatLng([newCoord.lat, newCoord.lng]);
    }
  }, [commune]);

  // Sugerencias locales instantáneas (0ms)
  const localSuggestions = searchChileanAddresses(commune, value);
  const popularStreets = getSuggestedStreetsForCommune(commune);

  // Consulta en segundo plano a OpenStreetMap / Nominatim (Chile) con debounce
  useEffect(() => {
    const cleanQuery = (value || '').trim();
    if (cleanQuery.length < 3) {
      setOnlineSuggestions([]);
      setIsLoadingOnline(false);
      return;
    }

    setIsLoadingOnline(true);
    const controller = new AbortController();
    const timeoutId = setTimeout(async () => {
      try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cleanQuery + ', ' + commune + ', Chile')}&addressdetails=1&limit=6&countrycodes=cl`;
        const res = await fetch(url, { signal: controller.signal });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const mapped: AddressSuggestion[] = data.map((item: any) => {
              const road = item.address?.road || item.address?.pedestrian || item.address?.suburb || cleanQuery;
              const houseNum = item.address?.house_number ? ` ${item.address.house_number}` : '';
              return {
                address: `${road}${houseNum}`.trim(),
                streetOnly: road,
                commune: item.address?.city || item.address?.town || commune,
                sector: item.display_name,
                lat: parseFloat(item.lat),
                lng: parseFloat(item.lon)
              };
            });
            setOnlineSuggestions(mapped);
          } else {
            setOnlineSuggestions([]);
          }
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.warn('Geocodificación online omitida:', err);
        }
      } finally {
        setIsLoadingOnline(false);
      }
    }, 280);

    return () => {
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, [value, commune]);

  // Lista combinada de sugerencias: Online primero si hay resultados reales, luego locales
  const combinedSuggestions: AddressSuggestion[] = (() => {
    const seen = new Set<string>();
    const list: AddressSuggestion[] = [];

    for (const item of onlineSuggestions) {
      const key = item.address.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        list.push(item);
      }
    }

    for (const item of localSuggestions) {
      const key = item.address.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        list.push(item);
      }
    }

    return list.slice(0, 8);
  })();

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Inicializar o sincronizar el mapa Leaflet interactivo
  useEffect(() => {
    if (!showMap || !mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [coords.lat, coords.lng],
        zoom: 16,
        zoomControl: true,
        attributionControl: false
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
      }).addTo(map);

      const marker = L.marker([coords.lat, coords.lng], {
        draggable: true,
        icon: createCustomPinIcon()
      }).addTo(map);

      // Evento al arrastrar el pin
      marker.on('dragend', () => {
        const pos = marker.getLatLng();
        handleMapPositionChange(pos.lat, pos.lng);
      });

      // Evento al hacer clic en cualquier parte del mapa
      map.on('click', (e: L.LeafletMouseEvent) => {
        marker.setLatLng(e.latlng);
        handleMapPositionChange(e.latlng.lat, e.latlng.lng);
      });

      mapInstanceRef.current = map;
      markerInstanceRef.current = marker;

      // Invalidate size para evitar cuadros grises de render inicial
      setTimeout(() => {
        map.invalidateSize();
      }, 200);
    } else {
      mapInstanceRef.current.setView([coords.lat, coords.lng], 16);
      markerInstanceRef.current?.setLatLng([coords.lat, coords.lng]);
    }

    return () => {
      // Dejar que el mapa viva mientras showMap sea true
    };
  }, [showMap, coords.lat, coords.lng]);

  // Manejo cuando el usuario mueve el pin en el mapa
  const handleMapPositionChange = async (lat: number, lng: number) => {
    setCoords({ lat, lng });
    setPinAddressNote(`Coordenadas: ${lat.toFixed(5)}, ${lng.toFixed(5)}`);

    // Reverse geocoding para obtener la calle exacta
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        const road = data.address?.road || data.address?.pedestrian || data.address?.suburb;
        const num = data.address?.house_number ? ` ${data.address.house_number}` : '';
        if (road) {
          const cleanStreet = `${road}${num}`.trim();
          onChange(cleanStreet);
          setPinAddressNote(cleanStreet);
        }
      }
    } catch (err) {
      console.warn('Reverse geocoding fallo:', err);
    }
  };

  const handleSelect = (item: AddressSuggestion) => {
    onChange(item.address);
    if (item.lat && item.lng) {
      setCoords({ lat: item.lat, lng: item.lng });
    }
    if (onSelectSuggestion) {
      onSelectSuggestion(item);
    }
    setShowMap(true);
    setIsOpen(false);
  };

  // Geolocalización instantánea por GPS del navegador
  const handleUseCurrentGPS = () => {
    if (!navigator.geolocation) {
      alert('Tu navegador no soporta geolocalización.');
      return;
    }

    setIsLocatingGPS(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords({ lat: latitude, lng: longitude });
        setShowMap(true);

        try {
          const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`;
          const res = await fetch(url);
          if (res.ok) {
            const data = await res.json();
            const road = data.address?.road || data.address?.pedestrian;
            const num = data.address?.house_number ? ` ${data.address.house_number}` : '';
            if (road) {
              onChange(`${road}${num}`.trim());
            } else {
              onChange(`GPS: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
            }
          }
        } catch {
          onChange(`GPS: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        } finally {
          setIsLocatingGPS(false);
        }
      },
      (err) => {
        console.warn('GPS denegado o no disponible:', err);
        setIsLocatingGPS(false);
        setShowMap(true);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
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
      setHighlightedIndex(prev => (prev < combinedSuggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev > 0 ? prev - 1 : combinedSuggestions.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < combinedSuggestions.length) {
        handleSelect(combinedSuggestions[highlightedIndex]);
      } else if (combinedSuggestions.length > 0) {
        handleSelect(combinedSuggestions[0]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className={`space-y-2 ${className}`} ref={containerRef}>
      
      {/* Barra Superior del Campo: Label + Botón GPS */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-gray-500 font-semibold">
            Autocompletado con calles reales de Chile
          </span>
        </div>

        <button
          type="button"
          onClick={handleUseCurrentGPS}
          disabled={isLocatingGPS}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-[#D02126] font-bold text-[11px] transition-all cursor-pointer border border-[#D02126]/20 disabled:opacity-50"
          title="Detectar ubicación automática mediante el GPS de tu dispositivo"
        >
          {isLocatingGPS ? (
            <>
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>Detectando GPS...</span>
            </>
          ) : (
            <>
              <Navigation className="w-3 h-3" />
              <span>Usar GPS Actual</span>
            </>
          )}
        </button>
      </div>

      {/* Input de Dirección con botón de Buscar */}
      <div className="relative flex items-center gap-2">
        <div className="relative flex-1 flex items-center">
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
            {isLoadingOnline ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <MapPin className="w-3.5 h-3.5" />
            )}
          </div>

          {/* Botón para Limpiar */}
          {value && (
            <button
              type="button"
              onClick={() => {
                onChange('');
                setOnlineSuggestions([]);
                inputRef.current?.focus();
              }}
              className="absolute right-2.5 text-gray-400 hover:text-gray-600 p-0.5 rounded-full hover:bg-gray-100 transition-colors"
              title="Limpiar dirección"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Botón Buscar / Abrir Mapa */}
        <button
          type="button"
          onClick={() => {
            setShowMap(true);
            setIsOpen(false);
          }}
          className="px-3.5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-xl border border-gray-200 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
        >
          <MapIcon className="w-3.5 h-3.5 text-[#D02126]" />
          <span>{showMap ? 'Ver Mapa' : 'Buscar / Pin'}</span>
        </button>
      </div>

      {/* Dropdown Flotante de Coincidencias */}
      {isOpen && (
        <div className="relative z-[100]">
          <div className="absolute left-0 right-0 top-1 bg-white rounded-2xl shadow-2xl border border-gray-200/90 overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-80 overflow-y-auto">
            
            {/* Header del Autocomplete */}
            <div className="px-3 py-2 bg-gray-50 border-b border-gray-100 flex items-center justify-between text-[10px] text-gray-500 font-bold">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#D02126]" />
                <span>Elige la dirección correcta:</span>
              </span>
              <span>{combinedSuggestions.length} resultados</span>
            </div>

            {/* Lista de Sugerencias Filtradas */}
            {combinedSuggestions.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {combinedSuggestions.map((item, idx) => {
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
                          <span className="truncate">{item.sector || `${item.commune}, Chile`}</span>
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
                <p className="text-xs font-bold text-gray-700">Sin coincidencias exactas escritas</p>
                <p className="text-[11px] text-gray-500">
                  Puedes continuar con "{value}" o posicionar el pin en el mapa:
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowMap(true);
                      setIsOpen(false);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#D02126] text-white text-xs font-bold shadow-sm hover:bg-[#b01b20] transition-colors"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Fijar Pin en el Mapa</span>
                  </button>
                </div>
              </div>
            )}

            {/* Opción rápida fija: Ajustar con Pin */}
            <div 
              onClick={() => {
                setShowMap(true);
                setIsOpen(false);
              }}
              className="p-2.5 bg-gray-50 hover:bg-rose-50 border-t border-gray-100 flex items-center justify-between text-xs text-[#D02126] font-bold cursor-pointer transition-colors"
            >
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>¿No encuentras la numeración? Ajustar con Pin en el Mapa</span>
              </span>
              <span className="text-[10px] text-gray-400 font-normal">Arrastra y confirma</span>
            </div>

          </div>
        </div>
      )}

      {/* Confirma la ubicación exacta: Mapa Leaflet Interactivo con Pin Arrastrable */}
      {showMap && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm space-y-2 p-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#D02126]" />
              <span className="font-extrabold text-[#0F1115]">Confirma la ubicación exacta</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-gray-400 font-mono">
                {pinAddressNote || `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`}
              </span>
              <button
                type="button"
                onClick={() => setShowMap(false)}
                className="text-[10px] text-gray-400 hover:text-gray-600 font-bold px-1.5 py-0.5 rounded hover:bg-gray-100"
              >
                Ocultar
              </button>
            </div>
          </div>

          {/* Contenedor del Mapa Leaflet */}
          <div className="relative w-full h-52 sm:h-60 rounded-xl overflow-hidden border border-gray-200">
            <div ref={mapContainerRef} className="w-full h-full z-0" />

            {/* Badge Flotante Inferior Izquierdo */}
            <div className="absolute bottom-2.5 left-2.5 z-[400] bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-lg shadow-md border border-gray-200 text-[10px] font-bold text-gray-700 flex items-center gap-1.5 pointer-events-none">
              <span className="w-2 h-2 rounded-full bg-[#D02126] animate-pulse" />
              <span>Arrastra el pin o haz clic para ajustar</span>
            </div>

            {/* Atribución Discreta */}
            <div className="absolute bottom-1 right-2 z-[400] text-[9px] text-gray-400 pointer-events-none bg-white/80 px-1 rounded">
              © OpenStreetMap
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
