/**
 * Base de comparables de mercado geolocalizados, usada para el ajuste por zona
 * cuando el usuario pone el pin en el mapa.
 *
 * Cada registro es una propiedad real publicada (precio de oferta, no de cierre).
 * Las coordenadas son las del sector informado en el aviso (OpenStreetMap), no la
 * dirección exacta. Para agregar comunas, sumar registros con la misma estructura.
 */

export interface MarketComparable {
  commune: string;
  sector: string;
  lat: number;
  lng: number;
  /** Precio publicado en UF */
  priceUF: number;
  /** m² construidos (0 si es solo terreno) */
  usefulM2: number;
  /** m² de terreno; undefined si el aviso no lo informa */
  landM2?: number;
  source: string;
  date: string; // AAAA-MM
}

const PI = 'Portal Inmobiliario';
const NOV26 = '2026-11';

// Coordenadas de sector (OpenStreetMap / Nominatim)
const S = {
  parralCentro: { lat: -36.1414, lng: -71.8222 },
  villaSanPedro: { lat: -36.1296, lng: -71.8117 },
  elAjial: { lat: -36.1273, lng: -71.8127 },
  catillo: { lat: -36.2864, lng: -71.6523 },
  machicura: { lat: -36.249, lng: -71.6243 },
  digua: { lat: -36.2447, lng: -71.548 },
  embalseDigua: { lat: -36.2777, lng: -71.5183 },
  remulcao: { lat: -36.2529, lng: -71.6911 },
  talquita: { lat: -36.2348, lng: -71.8086 },
  villaBaviera: { lat: -36.3868, lng: -71.5896 }
};

const c = (sector: keyof typeof S, label: string, priceUF: number, usefulM2: number, landM2?: number): MarketComparable => ({
  commune: 'Parral',
  sector: label,
  ...S[sector],
  priceUF,
  usefulM2,
  landM2,
  source: PI,
  date: NOV26
});

// UF de referencia para convertir avisos en pesos: $41.295
export const MARKET_COMPARABLES: MarketComparable[] = [
  // --- Parral urbano (los avisos no informan el terreno) ---
  c('villaSanPedro', 'Villa San Pedro IV', 2543, 85),
  c('parralCentro', 'Centro (O\'Higgins esq. Alameda)', 4843, 180),
  c('parralCentro', 'Centro (Pablo Neruda, 1 cuadra arteria)', 6296, 154),
  c('parralCentro', 'Centro (Pablo Neruda, cerca Plaza de Armas)', 9202, 250),

  // --- Parcelas con casa ---
  c('machicura', 'Lomas de Machicura', 1768, 170, 5000),
  c('machicura', 'Lomas de Machicura', 1350, 95, 5000),
  c('catillo', 'Catillo (Fundo Buen Recuerdo, 2 casas nuevas)', 1816, 70, 5000),
  c('digua', 'Digua', 2419, 137, 5250),
  c('elAjial', 'El Ajial', 6659, 360, 6500),

  // --- Parcelas sin construir ---
  c('catillo', 'Catillo (Porvenir Oriente)', 654, 0, 5000),
  c('catillo', 'Condominio Cumbres de Catillo', 484, 0, 5000),
  c('catillo', 'Lomas de Catillo', 775, 0, 5000),
  c('catillo', 'Catillo orilla río Cato', 3596, 0, 70000),
  c('machicura', 'Machicura', 436, 0, 5000),
  c('machicura', 'Machicura', 509, 0, 7000),
  c('machicura', 'Machicura', 1816, 0, 30000),
  c('embalseDigua', 'Embalse Digua', 726, 0, 5000),
  c('remulcao', 'Remulcao Hijuela 3', 1622, 0, 11000),
  c('talquita', 'Talquita', 1066, 0, 10000),
  c('villaBaviera', 'Cercano a Villa Baviera', 944, 0, 23938),
  c('villaBaviera', 'Cercano a Villa Baviera', 363, 0, 5000),
  c('villaBaviera', 'Camino Villa Baviera - Catillo', 2076, 0, 5000)
];

/** Distancia en km entre dos coordenadas (fórmula de Haversine) */
export function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
