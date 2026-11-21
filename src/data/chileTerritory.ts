/**
 * Catastro territorial de Chile (División Político-Administrativa vigente).
 * 16 regiones · 56 provincias · 346 comunas.
 *
 * Además incluye sectores/localidades conocidos por comuna para sugerencias de
 * dirección en el formulario de tasación. Las comunas sin sectores curados usan
 * sectores genéricos (Centro, Sector Urbano, Sector Rural).
 */

export interface ChileProvince {
  id: string;
  name: string;
  communes: string[];
}

export interface ChileRegionTerritory {
  id: string;
  name: string;
  shortName: string;
  provinces: ChileProvince[];
}

export const normalizeTerritoryName = (value: string): string =>
  (value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

export const CHILE_TERRITORY: ChileRegionTerritory[] = [
  {
    id: 'arica',
    name: 'Región de Arica y Parinacota (XV)',
    shortName: 'Arica y Parinacota',
    provinces: [
      { id: 'arica', name: 'Arica', communes: ['Arica', 'Camarones'] },
      { id: 'parinacota', name: 'Parinacota', communes: ['Putre', 'General Lagos'] }
    ]
  },
  {
    id: 'tarapaca',
    name: 'Región de Tarapacá (I)',
    shortName: 'Tarapacá',
    provinces: [
      { id: 'iquique', name: 'Iquique', communes: ['Iquique', 'Alto Hospicio'] },
      { id: 'tamarugal', name: 'Tamarugal', communes: ['Pozo Almonte', 'Camiña', 'Colchane', 'Huara', 'Pica'] }
    ]
  },
  {
    id: 'antofagasta',
    name: 'Región de Antofagasta (II)',
    shortName: 'Antofagasta',
    provinces: [
      { id: 'antofagasta', name: 'Antofagasta', communes: ['Antofagasta', 'Mejillones', 'Sierra Gorda', 'Taltal'] },
      { id: 'el_loa', name: 'El Loa', communes: ['Calama', 'Ollagüe', 'San Pedro de Atacama'] },
      { id: 'tocopilla', name: 'Tocopilla', communes: ['Tocopilla', 'María Elena'] }
    ]
  },
  {
    id: 'atacama',
    name: 'Región de Atacama (III)',
    shortName: 'Atacama',
    provinces: [
      { id: 'copiapo', name: 'Copiapó', communes: ['Copiapó', 'Caldera', 'Tierra Amarilla'] },
      { id: 'chanaral', name: 'Chañaral', communes: ['Chañaral', 'Diego de Almagro'] },
      { id: 'huasco', name: 'Huasco', communes: ['Vallenar', 'Alto del Carmen', 'Freirina', 'Huasco'] }
    ]
  },
  {
    id: 'coquimbo',
    name: 'Región de Coquimbo (IV)',
    shortName: 'Coquimbo',
    provinces: [
      { id: 'elqui', name: 'Elqui', communes: ['La Serena', 'Coquimbo', 'Andacollo', 'La Higuera', 'Paihuano', 'Vicuña'] },
      { id: 'choapa', name: 'Choapa', communes: ['Illapel', 'Canela', 'Los Vilos', 'Salamanca'] },
      { id: 'limari', name: 'Limarí', communes: ['Ovalle', 'Combarbalá', 'Monte Patria', 'Punitaqui', 'Río Hurtado'] }
    ]
  },
  {
    id: 'valparaiso',
    name: 'Región de Valparaíso (V)',
    shortName: 'Valparaíso',
    provinces: [
      { id: 'marga_marga', name: 'Marga Marga', communes: ['Villa Alemana', 'Quilpué', 'Limache', 'Olmué'] },
      { id: 'valparaiso', name: 'Valparaíso', communes: ['Valparaíso', 'Viña del Mar', 'Concón', 'Casablanca', 'Quintero', 'Puchuncaví', 'Juan Fernández'] },
      { id: 'quillota', name: 'Quillota', communes: ['Quillota', 'La Calera', 'Hijuelas', 'La Cruz', 'Nogales'] },
      { id: 'san_antonio', name: 'San Antonio', communes: ['San Antonio', 'Algarrobo', 'Cartagena', 'El Quisco', 'El Tabo', 'Santo Domingo'] },
      { id: 'petorca', name: 'Petorca', communes: ['La Ligua', 'Cabildo', 'Papudo', 'Petorca', 'Zapallar'] },
      { id: 'los_andes', name: 'Los Andes', communes: ['Los Andes', 'Calle Larga', 'Rinconada', 'San Esteban'] },
      { id: 'san_felipe', name: 'San Felipe de Aconcagua', communes: ['San Felipe', 'Catemu', 'Llay-Llay', 'Panquehue', 'Putaendo', 'Santa María'] },
      { id: 'isla_de_pascua', name: 'Isla de Pascua', communes: ['Isla de Pascua'] }
    ]
  },
  {
    id: 'metropolitana',
    name: 'Región Metropolitana (RM)',
    shortName: 'Metropolitana',
    provinces: [
      {
        id: 'santiago',
        name: 'Santiago',
        communes: [
          'Santiago', 'Cerrillos', 'Cerro Navia', 'Conchalí', 'El Bosque', 'Estación Central', 'Huechuraba',
          'Independencia', 'La Cisterna', 'La Florida', 'La Granja', 'La Pintana', 'La Reina', 'Las Condes',
          'Lo Barnechea', 'Lo Espejo', 'Lo Prado', 'Macul', 'Maipú', 'Ñuñoa', 'Pedro Aguirre Cerda',
          'Peñalolén', 'Providencia', 'Pudahuel', 'Quilicura', 'Quinta Normal', 'Recoleta', 'Renca',
          'San Joaquín', 'San Miguel', 'San Ramón', 'Vitacura'
        ]
      },
      { id: 'cordillera', name: 'Cordillera', communes: ['Puente Alto', 'Pirque', 'San José de Maipo'] },
      { id: 'chacabuco', name: 'Chacabuco', communes: ['Colina', 'Lampa', 'Tiltil'] },
      { id: 'maipo', name: 'Maipo', communes: ['San Bernardo', 'Buin', 'Calera de Tango', 'Paine'] },
      { id: 'melipilla', name: 'Melipilla', communes: ['Melipilla', 'Alhué', 'Curacaví', 'María Pinto', 'San Pedro'] },
      { id: 'talagante', name: 'Talagante', communes: ['Talagante', 'El Monte', 'Isla de Maipo', 'Padre Hurtado', 'Peñaflor'] }
    ]
  },
  {
    id: 'ohiggins',
    name: "Región de O'Higgins (VI)",
    shortName: "O'Higgins",
    provinces: [
      {
        id: 'cachapoal',
        name: 'Cachapoal',
        communes: [
          'Rancagua', 'Codegua', 'Coinco', 'Coltauco', 'Doñihue', 'Graneros', 'Las Cabras', 'Machalí', 'Malloa',
          'Mostazal', 'Olivar', 'Peumo', 'Pichidegua', 'Quinta de Tilcoco', 'Rengo', 'Requínoa', 'San Vicente'
        ]
      },
      { id: 'cardenal_caro', name: 'Cardenal Caro', communes: ['Pichilemu', 'La Estrella', 'Litueche', 'Marchigüe', 'Navidad', 'Paredones'] },
      {
        id: 'colchagua',
        name: 'Colchagua',
        communes: ['San Fernando', 'Chépica', 'Chimbarongo', 'Lolol', 'Nancagua', 'Palmilla', 'Peralillo', 'Placilla', 'Pumanque', 'Santa Cruz']
      }
    ]
  },
  {
    id: 'maule',
    name: 'Región del Maule (VII)',
    shortName: 'Maule',
    provinces: [
      {
        id: 'talca',
        name: 'Talca',
        communes: ['Talca', 'Constitución', 'Curepto', 'Empedrado', 'Maule', 'Pelarco', 'Pencahue', 'Río Claro', 'San Clemente', 'San Rafael']
      },
      { id: 'curico', name: 'Curicó', communes: ['Curicó', 'Hualañé', 'Licantén', 'Molina', 'Rauco', 'Romeral', 'Sagrada Familia', 'Teno', 'Vichuquén'] },
      { id: 'linares', name: 'Linares', communes: ['Linares', 'Colbún', 'Longaví', 'Parral', 'Retiro', 'San Javier', 'Villa Alegre', 'Yerbas Buenas'] },
      { id: 'cauquenes', name: 'Cauquenes', communes: ['Cauquenes', 'Chanco', 'Pelluhue'] }
    ]
  },
  {
    id: 'nuble',
    name: 'Región de Ñuble (XVI)',
    shortName: 'Ñuble',
    provinces: [
      { id: 'diguillin', name: 'Diguillín', communes: ['Chillán', 'Chillán Viejo', 'Bulnes', 'El Carmen', 'Pemuco', 'Pinto', 'Quillón', 'San Ignacio', 'Yungay'] },
      { id: 'itata', name: 'Itata', communes: ['Quirihue', 'Cobquecura', 'Coelemu', 'Ninhue', 'Portezuelo', 'Ránquil', 'Treguaco'] },
      { id: 'punilla', name: 'Punilla', communes: ['San Carlos', 'Coihueco', 'Ñiquén', 'San Fabián', 'San Nicolás'] }
    ]
  },
  {
    id: 'biobio',
    name: 'Región del Biobío (VIII)',
    shortName: 'Biobío',
    provinces: [
      {
        id: 'concepcion',
        name: 'Concepción',
        communes: [
          'Concepción', 'San Pedro de la Paz', 'Chiguayante', 'Talcahuano', 'Hualpén', 'Coronel', 'Lota',
          'Penco', 'Tomé', 'Hualqui', 'Florida', 'Santa Juana'
        ]
      },
      {
        id: 'biobio',
        name: 'Biobío',
        communes: [
          'Los Ángeles', 'Antuco', 'Cabrero', 'Laja', 'Mulchén', 'Nacimiento', 'Negrete', 'Quilaco', 'Quilleco',
          'San Rosendo', 'Santa Bárbara', 'Tucapel', 'Yumbel', 'Alto Biobío'
        ]
      },
      { id: 'arauco', name: 'Arauco', communes: ['Lebu', 'Arauco', 'Cañete', 'Contulmo', 'Curanilahue', 'Los Álamos', 'Tirúa'] }
    ]
  },
  {
    id: 'araucania',
    name: 'Región de La Araucanía (IX)',
    shortName: 'La Araucanía',
    provinces: [
      {
        id: 'cautin',
        name: 'Cautín',
        communes: [
          'Temuco', 'Padre Las Casas', 'Carahue', 'Cholchol', 'Cunco', 'Curarrehue', 'Freire', 'Galvarino', 'Gorbea',
          'Lautaro', 'Loncoche', 'Melipeuco', 'Nueva Imperial', 'Perquenco', 'Pitrufquén', 'Pucón', 'Saavedra',
          'Teodoro Schmidt', 'Toltén', 'Vilcún', 'Villarrica'
        ]
      },
      {
        id: 'malleco',
        name: 'Malleco',
        communes: ['Angol', 'Collipulli', 'Curacautín', 'Ercilla', 'Lonquimay', 'Los Sauces', 'Lumaco', 'Purén', 'Renaico', 'Traiguén', 'Victoria']
      }
    ]
  },
  {
    id: 'los_rios',
    name: 'Región de Los Ríos (XIV)',
    shortName: 'Los Ríos',
    provinces: [
      { id: 'valdivia', name: 'Valdivia', communes: ['Valdivia', 'Corral', 'Lanco', 'Los Lagos', 'Máfil', 'Mariquina', 'Paillaco', 'Panguipulli'] },
      { id: 'ranco', name: 'Ranco', communes: ['La Unión', 'Futrono', 'Lago Ranco', 'Río Bueno'] }
    ]
  },
  {
    id: 'los_lagos',
    name: 'Región de Los Lagos (X)',
    shortName: 'Los Lagos',
    provinces: [
      {
        id: 'llanquihue',
        name: 'Llanquihue',
        communes: ['Puerto Montt', 'Puerto Varas', 'Frutillar', 'Llanquihue', 'Calbuco', 'Cochamó', 'Fresia', 'Los Muermos', 'Maullín']
      },
      { id: 'osorno', name: 'Osorno', communes: ['Osorno', 'Puerto Octay', 'Purranque', 'Puyehue', 'Río Negro', 'San Juan de la Costa', 'San Pablo'] },
      {
        id: 'chiloe',
        name: 'Chiloé',
        communes: ['Castro', 'Ancud', 'Chonchi', 'Curaco de Vélez', 'Dalcahue', 'Puqueldón', 'Queilén', 'Quellón', 'Quemchi', 'Quinchao']
      },
      { id: 'palena', name: 'Palena', communes: ['Chaitén', 'Futaleufú', 'Hualaihué', 'Palena'] }
    ]
  },
  {
    id: 'aysen',
    name: 'Región de Aysén (XI)',
    shortName: 'Aysén',
    provinces: [
      { id: 'coyhaique', name: 'Coyhaique', communes: ['Coyhaique', 'Lago Verde'] },
      { id: 'aysen', name: 'Aysén', communes: ['Aysén', 'Cisnes', 'Guaitecas'] },
      { id: 'general_carrera', name: 'General Carrera', communes: ['Chile Chico', 'Río Ibáñez'] },
      { id: 'capitan_prat', name: 'Capitán Prat', communes: ['Cochrane', "O'Higgins", 'Tortel'] }
    ]
  },
  {
    id: 'magallanes',
    name: 'Región de Magallanes (XII)',
    shortName: 'Magallanes',
    provinces: [
      { id: 'magallanes', name: 'Magallanes', communes: ['Punta Arenas', 'Laguna Blanca', 'Río Verde', 'San Gregorio'] },
      { id: 'ultima_esperanza', name: 'Última Esperanza', communes: ['Natales', 'Torres del Paine'] },
      { id: 'tierra_del_fuego', name: 'Tierra del Fuego', communes: ['Porvenir', 'Primavera', 'Timaukel'] },
      { id: 'antartica', name: 'Antártica Chilena', communes: ['Cabo de Hornos', 'Antártica'] }
    ]
  }
];

export interface CommuneLocation {
  commune: string;
  provinceId: string;
  provinceName: string;
  regionId: string;
  regionName: string;
}

const COMMUNE_INDEX: Record<string, CommuneLocation> = (() => {
  const index: Record<string, CommuneLocation> = {};
  for (const region of CHILE_TERRITORY) {
    for (const province of region.provinces) {
      for (const commune of province.communes) {
        index[normalizeTerritoryName(commune)] = {
          commune,
          provinceId: province.id,
          provinceName: province.name,
          regionId: region.id,
          regionName: region.name
        };
      }
    }
  }
  return index;
})();

/** Nombres antiguos o informales usados antes en la app → comuna oficial */
const LEGACY_COMMUNE_ALIASES: Record<string, string> = {
  'santiago centro': 'Santiago',
  'chicureo': 'Colina',
  'chicureo colina': 'Colina',
  'buin paine': 'Buin',
  'talagante penaflor': 'Talagante',
  'maitencillo': 'Puchuncaví',
  'til til': 'Tiltil',
  'llaillay': 'Llay-Llay',
  'puerto natales': 'Natales',
  'puerto aysen': 'Aysén',
  'san francisco de mostazal': 'Mostazal',
  'trehuaco': 'Treguaco'
};

/** Busca la ubicación oficial (provincia y región) de una comuna. Coincidencia exacta, sin aproximaciones. */
export function findCommuneLocation(commune: string): CommuneLocation | null {
  const norm = normalizeTerritoryName(commune);
  if (!norm) return null;
  if (COMMUNE_INDEX[norm]) return COMMUNE_INDEX[norm];
  const alias = LEGACY_COMMUNE_ALIASES[norm];
  if (alias) return COMMUNE_INDEX[normalizeTerritoryName(alias)] || null;
  return null;
}

export const TOTAL_COMMUNES = Object.keys(COMMUNE_INDEX).length;

/**
 * Sectores, barrios y localidades conocidos por comuna (clave normalizada).
 * Complementan las calles de REAL_STREETS_BY_COMMUNE en el motor de tasación.
 */
export const SECTORS_BY_COMMUNE: Record<string, string[]> = {
  // Arica y Parinacota
  'arica': ['Centro', 'Chinchorro', 'Valle de Azapa', 'Cerro La Cruz'],
  'putre': ['Centro', 'Parinacota'],
  // Tarapacá
  'iquique': ['Centro', 'Cavancha', 'Playa Brava', 'Huayquique', 'Bajo Molle'],
  'pozo almonte': ['Centro', 'La Tirana', 'Mamiña'],
  'pica': ['Centro', 'Matilla'],
  // Antofagasta
  'antofagasta': ['Centro', 'Sector Sur', 'Sector Norte', 'La Chimba', 'Caleta Coloso'],
  'calama': ['Centro', 'Sector Poniente', 'Chiu Chiu'],
  'san pedro de atacama': ['Centro', 'Toconao'],
  // Atacama
  'copiapo': ['Centro', 'Paipote', 'El Palomar'],
  'caldera': ['Centro', 'Bahía Inglesa'],
  'huasco': ['Centro', 'Huasco Bajo'],
  'diego de almagro': ['Centro', 'El Salvador'],
  // Coquimbo
  'la serena': ['Centro Histórico', 'Av. del Mar', 'Las Compañías', 'La Florida', 'San Joaquín'],
  'coquimbo': ['Centro', 'Peñuelas', 'La Herradura', 'Guayacán', 'Tierras Blancas', 'Sindempart'],
  'vicuna': ['Centro', 'Peralillo'],
  'paihuano': ['Paihuano', 'Pisco Elqui', 'Montegrande'],
  'los vilos': ['Centro', 'Pichidangui'],
  'la higuera': ['La Higuera', 'Punta de Choros', 'Caleta Hornos'],
  // Valparaíso
  'quintero': ['Centro', 'Loncura'],
  'puchuncavi': ['Centro', 'Maitencillo', 'Horcón', 'Ventanas'],
  'zapallar': ['Zapallar Centro', 'Cachagua', 'La Laguna'],
  'papudo': ['Centro', 'Pullally'],
  'la ligua': ['Centro', 'Pichicuy'],
  'casablanca': ['Centro', 'Lagunillas', 'Quintay'],
  'algarrobo': ['Centro', 'San Alfonso del Mar', 'Mirasol', 'El Canelo'],
  'el quisco': ['Centro', 'Punta de Tralca', 'Isla Negra'],
  'el tabo': ['Centro', 'Las Cruces'],
  'cartagena': ['Centro', 'San Sebastián'],
  'san antonio': ['Centro', 'Llolleo', 'Barrancas', 'Tejas Verdes'],
  'santo domingo': ['Centro', 'Rocas de Santo Domingo'],
  'la calera': ['Centro', 'Artificio'],
  'la cruz': ['Centro', 'Pocochay'],
  'hijuelas': ['Centro', 'Ocoa'],
  'nogales': ['Centro', 'El Melón'],
  'los andes': ['Centro', 'Portillo'],
  'san felipe': ['Centro', 'El Almendral'],
  'juan fernandez': ['San Juan Bautista (Isla Robinson Crusoe)'],
  'isla de pascua': ['Hanga Roa'],
  // Metropolitana
  'santiago': ['Barrio Lastarria', 'Barrio Brasil', 'Barrio Yungay', 'Parque Almagro', 'San Borja', 'Barrio República'],
  'providencia': ['Barrio Italia', 'Los Leones', 'Pedro de Valdivia Norte'],
  'recoleta': ['Patronato', 'Barrio Bellavista', 'La Vega'],
  'independencia': ['Av. Independencia', 'Hipódromo Chile'],
  'estacion central': ['Villa Portales', 'Alameda', 'Estación Central (EFE)'],
  'quinta normal': ['Parque Quinta Normal', 'Av. San Pablo'],
  'cerrillos': ['Ciudad Parque Bicentenario', 'Centro'],
  'pudahuel': ['Ciudad de los Valles', 'Pudahuel Norte', 'Pudahuel Sur', 'ENEA'],
  'quilicura': ['Centro', 'Valle Lo Campino'],
  'huechuraba': ['Ciudad Empresarial', 'Pedro Fontova', 'El Carmen de Huechuraba', 'La Pincoya'],
  'san miguel': ['Gran Avenida', 'Llano Subercaseaux', 'Barrio El Llano'],
  'maipu': ['Centro / Plaza de Maipú', 'Ciudad Satélite', 'Rinconada de Maipú', 'El Abrazo', 'Templo Votivo'],
  'la florida': ['Vicuña Mackenna', 'Walker Martínez', 'Rojas Magallanes', 'Lo Cañas'],
  'penalolen': ['Peñalolén Alto', 'Lo Hermida', 'Quebrada de Macul', 'La Faena'],
  'puente alto': ['Centro', 'Bajos de Mena', 'Las Vizcachas', 'Casas Viejas', 'El Peñón'],
  'lo barnechea': ['La Dehesa', 'Valle La Dehesa', 'El Arrayán', 'Los Trapenses', 'Farellones'],
  'la reina': ['Príncipe de Gales', 'Av. Larraín', 'Villa La Reina', 'Parque Mahuida'],
  'colina': ['Chicureo', 'Piedra Roja', 'Esquina Blanca', 'Centro'],
  'lampa': ['Centro', 'Batuco', 'Larapinta', 'Valle Grande'],
  'tiltil': ['Centro', 'Huertos Familiares', 'Caleu', 'Rungue'],
  'san bernardo': ['Centro', 'Nos', 'Lo Herrera'],
  'buin': ['Centro', 'Maipo', 'Linderos', 'Alto Jahuel'],
  'paine': ['Centro', 'Hospital', 'Huelquén', 'Champa'],
  'pirque': ['Centro', 'El Principal', 'Lo Arcaya'],
  'san jose de maipo': ['Centro', 'El Manzano', 'San Alfonso', 'Las Vertientes', 'Cajón del Maipo'],
  'talagante': ['Centro', 'Lonquén'],
  'penaflor': ['Centro', 'Malloco'],
  'melipilla': ['Centro', 'Pomaire'],
  // O'Higgins
  'rancagua': ['Centro', 'Sector Oriente', 'Sector Norte'],
  'machali': ['Centro', 'Coya'],
  'rengo': ['Centro', 'Rosario'],
  'las cabras': ['Centro', 'Lago Rapel'],
  'pichilemu': ['Centro', 'Punta de Lobos', 'Infiernillo', 'Cáhuil'],
  'navidad': ['Navidad', 'Matanzas', 'La Boca', 'Rapel'],
  // Maule
  'talca': ['Centro', 'Sector Oriente', 'Sector Poniente', 'Sector Norte'],
  'curico': ['Centro', 'Sector Oriente'],
  'constitucion': ['Centro', 'Putú'],
  'parral': ['Centro', 'Termas de Catillo', 'Bullileo'],
  'pelluhue': ['Pelluhue', 'Curanipe'],
  'vichuquen': ['Vichuquén', 'Lago Vichuquén', 'Llico'],
  'licanten': ['Centro', 'Iloca'],
  'san clemente': ['Centro', 'Vilches'],
  'molina': ['Centro', 'Radal Siete Tazas'],
  // Ñuble
  'chillan': ['Centro', 'Sector Oriente', 'Sector Norte'],
  'pinto': ['Centro', 'Termas de Chillán', 'Recinto'],
  'cobquecura': ['Centro', 'Buchupureo'],
  'quillon': ['Centro', 'Laguna Avendaño'],
  // Biobío
  'concepcion': ['Centro', 'Barrio Universitario', 'Lomas de San Andrés', 'Pedro de Valdivia', 'Collao'],
  'san pedro de la paz': ['Centro', 'Andalué', 'Huertos Familiares', 'Candelaria', 'Lomas Coloradas'],
  'talcahuano': ['Centro', 'Las Higueras', 'San Vicente'],
  'hualpen': ['Centro', 'Hualpencillo'],
  'penco': ['Centro', 'Lirquén'],
  'tome': ['Centro', 'Dichato'],
  'lota': ['Centro', 'Lota Alto'],
  'los angeles': ['Centro', 'Sector Oriente'],
  'arauco': ['Centro', 'Laraquete'],
  'alto biobio': ['Ralco'],
  // Araucanía
  'temuco': ['Centro', 'Av. Alemania', 'Pueblo Nuevo', 'Labranza', 'Fundo El Carmen'],
  'pucon': ['Centro', 'Caburgua'],
  'villarrica': ['Centro', 'Lican Ray'],
  'curacautin': ['Centro', 'Malalcahuello'],
  'saavedra': ['Puerto Saavedra'],
  'tolten': ['Centro', 'Queule'],
  // Los Ríos
  'valdivia': ['Centro', 'Isla Teja', 'Niebla', 'Las Ánimas', 'Collico'],
  'panguipulli': ['Centro', 'Coñaripe', 'Choshuenco', 'Liquiñe'],
  'mariquina': ['San José de la Mariquina', 'Mehuín'],
  // Los Lagos
  'puerto montt': ['Centro', 'Pelluco', 'Alerce', 'Chamiza'],
  'puerto varas': ['Centro', 'Costanera Lago Llanquihue', 'Ensenada', 'Nueva Braunau'],
  'frutillar': ['Frutillar Bajo', 'Frutillar Alto'],
  'osorno': ['Centro', 'Rahue', 'Ovejería'],
  'puerto octay': ['Centro', 'Las Cascadas'],
  'puyehue': ['Entre Lagos'],
  'castro': ['Centro', 'Nercón', 'Llau Llao'],
  'ancud': ['Centro', 'Pumillahue'],
  'dalcahue': ['Centro', 'Tenaún'],
  'cochamo': ['Cochamó', 'Río Puelo'],
  'hualaihue': ['Hornopirén'],
  // Aysén
  'aysen': ['Puerto Aysén', 'Puerto Chacabuco'],
  'cisnes': ['Puerto Cisnes', 'Puyuhuapi'],
  'rio ibanez': ['Puerto Ingeniero Ibáñez', 'Villa Cerro Castillo'],
  'chile chico': ['Centro', 'Puerto Guadal'],
  'tortel': ['Caleta Tortel'],
  'o higgins': ["Villa O'Higgins"],
  // Magallanes
  'punta arenas': ['Centro', 'Sector Norte', 'Sector Sur'],
  'natales': ['Puerto Natales'],
  'torres del paine': ['Cerro Castillo'],
  'timaukel': ['Cameron'],
  'cabo de hornos': ['Puerto Williams']
};

export const GENERIC_COMMUNE_SECTORS = ['Centro', 'Sector Urbano', 'Sector Rural / Parcelas'];

/** Sectores para una comuna: curados si existen, si no, genéricos. */
export function getSectorsForCommune(commune: string): string[] {
  const loc = findCommuneLocation(commune);
  const key = normalizeTerritoryName(loc ? loc.commune : commune);
  return SECTORS_BY_COMMUNE[key] || GENERIC_COMMUNE_SECTORS;
}
