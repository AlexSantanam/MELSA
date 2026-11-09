import { RealEstateProject, Property, TeamAgent, Testimonial } from '../types';

export const FEATURED_PROJECTS: RealEstateProject[] = [
  {
    id: 'melsa-tower-las-condes',
    name: 'MELSA Living Tower',
    subtitle: 'Departamentos de Alto Estandar & Vistas Panorámicas',
    location: 'Av. El Golf, Las Condes',
    city: 'Santiago',
    type: 'Apartamento',
    status: 'Preventa / Pozo',
    priceFromUSD: 185000,
    priceFromUF: 4800,
    deliveryDate: 'Q4 2026',
    bedrooms: '1 a 3 dormitorios',
    surfaceM2: '58 - 145 m²',
    mainImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1200',
    galleryImages: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1200'
    ],
    description: 'Edificio residencial de arquitectura vanguardista en la zona financiera y residencial más exclusiva. Diseñado con terminaciones importadas, domótica integral y amplias terrazas independientes.',
    amenities: [
      'Rooftop Infinity Pool',
      'Gimnasio High-Tech',
      'Coworking Lounge',
      'Seguridad 24/7 & Concierge',
      'Cargadores de Autos Eléctricos',
      'Cava de Vinos Privada'
    ],
    highlights: [
      'Plusvalía proyectada de 14% anual',
      'Cero comisión de corretaje en compra en blanco',
      'Financiamiento flexible de pie en 24 cuotas'
    ],
    featured: true
  },
  {
    id: 'melsa-sanctuary-villas',
    name: 'Sanctuary Ocean Villas',
    subtitle: 'Villas Privadas Frente al Mar',
    location: 'Zapallar Norte, Costa Central',
    city: 'Valparaíso',
    type: 'Villa',
    status: 'Entrega Inmediata',
    priceFromUSD: 520000,
    priceFromUF: 13500,
    deliveryDate: 'Inmediata',
    bedrooms: '3 a 5 dormitorios',
    surfaceM2: '240 - 450 m²',
    mainImage: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=80&w=1200',
    galleryImages: [
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=1200'
    ],
    description: 'Residencias exclusivas de baja densidad integradas armónicamente con el entorno natural del litoral. Diseñadas para disfrutar la privacidad, privacidad total y vistas sobre el océano.',
    amenities: [
      'Piscina temperada privada',
      'Acceso privado a la playa',
      'Spa & Sauna seco',
      'Huerto orgánico comunitario',
      'Helipuerto habilitado'
    ],
    highlights: [
      'Proyecto totalmente vendido al 85%',
      'Últimas 2 unidades disponibles con llave en mano',
      'Gestión de renta vacacional opcional gestionada por Melsa'
    ],
    featured: true
  },
  {
    id: 'melsa-corporate-hub',
    name: 'MELSA Corporate Hub',
    subtitle: 'Oficinas Smart & Locales Comerciales Premium',
    location: 'Barrio El Bioparque',
    city: 'Santiago',
    type: 'Oficinas',
    status: 'Inversión',
    priceFromUSD: 140000,
    priceFromUF: 3600,
    deliveryDate: 'Q2 2027',
    bedrooms: 'Oficinas Modulares',
    surfaceM2: '42 - 320 m²',
    mainImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200',
    galleryImages: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200'
    ],
    description: 'Hub empresarial sustentable con certificación LEED Gold. Espacios de trabajo inteligentes diseñados para empresas en expansión e inversionistas que buscan renta comercial garantizada.',
    amenities: [
      'Directorio Inteligente',
      'Auditorio para 120 personas',
      'Plaza Gastronómica en Planta Baja',
      'Paneles Solares & Eficiencia Energética'
    ],
    highlights: [
      'Retorno anual estimado del 7.8% neto',
      'Contratos de arrendamiento corporativo a largo plazo',
      'Exención tributaria de primera transferencia'
    ],
    featured: true
  },
  {
    id: 'melsa-loft-park',
    name: 'MELSA Park Lofts',
    subtitle: 'Unidades Tipo Studio & 1D para Inversionistas',
    location: 'Providencia Parque',
    city: 'Santiago',
    type: 'Apartamento',
    status: 'Preventa / Pozo',
    priceFromUSD: 110000,
    priceFromUF: 2900,
    deliveryDate: 'Q1 2027',
    bedrooms: 'Studio & 1 dorm',
    surfaceM2: '36 - 62 m²',
    mainImage: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=1200',
    galleryImages: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=1200'
    ],
    description: 'Diseñado específicamente para optimizar el retorno de alquileres urbanos y temporales (Airbnb Friendly). Ubicación estratégica a pasos de estaciones de metro y universidades.',
    amenities: [
      'Lockers Inteligentes de Paquetería',
      'Pet Wash Station',
      'Quincho Gourmet En la Azotea',
      'Lavandería App-based'
    ],
    highlights: [
      'Apertura para administración llave en mano',
      'Demanda de arrendatarios garantizada por zona estratégica'
    ],
    featured: false
  }
];

export const TEAM_MEMBERS: TeamAgent[] = [
  {
    id: 'jeniffer-mella',
    name: 'Jeniffer Mella',
    role: 'Directora de Proyectos y Estrategia Comercial',
    specialty: 'Proyectos en Preventa & Propiedades Residenciales Premium',
    experienceYears: 12,
phone: '+56 9 9989 9421',
    email: 'jeniffer.mella@melsainmobiliaria.com',
    photoUrl: '/asset/Jeniffer Mella.jpeg',
    bio: 'Experta en interiorismo estratégico, negociación de alto impacto y gestión personalizada. Se enfoca en entender las metas de vida de sus clientes para encontrar la propiedad perfecta.',
    activeListings: 24
  },
  {
    id: 'alexis-santana',
    name: 'Alexis Santana',
    role: 'Agente Inmobiliario & Asesor Senior',
    specialty: 'Inversiones Inmobiliarias & Desarrollo de Flujo Comercial',
    experienceYears: 14,
    phone: '+56 9 7388 8336',
    email: 'alexis.santana@melsainmobiliaria.com',
photoUrl: '/asset/Alexis Santana.jpg',
    bio: 'Especialista en estructuración financiera e inversión patrimonial. Ha liderado la comercialización de más de 45 proyectos residenciales y corporativos en los mejores sectores.',
    activeListings: 28
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    clientName: 'Roberto & Camila Harrington',
    clientRole: 'Inversionistas Residenciales',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    comment: 'Excelente atención y acompañamiento durante todo el proceso. Nos guiaron paso a paso en la compra de nuestro departamento en pozo y la más alta rentabilidad proyectada.',
    rating: 5,
    propertyType: 'Departamento MELSA Living',
    year: '2025'
  },
  {
    id: 't2',
    clientName: 'Dr. Fernando Benítez',
    clientRole: 'Propietario en Zapallar',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    comment: 'Encontramos el proyecto ideal gracias a su asesoría estratégica. La transparencia en los números y el trato cercano de Valeria marcaron la diferencia.',
    rating: 5,
    propertyType: 'Villa Oceanfront',
    year: '2024'
  },
  {
    id: 't3',
    clientName: 'Dra. María Elena Castro',
    clientRole: 'Directora Corporativa',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200',
    comment: 'Melsa gestionó la venta de nuestra propiedad previa y la adquisición de nuestra nueva oficina corporativa con absoluta rapidez, elegancia y profesionalismo.',
    rating: 5,
    propertyType: 'Oficina Corporate Hub',
    year: '2025'
  }
];

export const WHY_CHOOSE_US = [
  {
    id: 'asesoria',
    title: 'Asesoría personalizada',
    description: 'Analizamos tus necesidades familiares o metas de inversión para ofrecerte soluciones a la medida con atención ejecutiva dedicada.',
    iconName: 'UserCheck'
  },
  {
    id: 'cartera',
    title: 'Amplia cartera de propiedades',
    description: 'Acceso prioritario a desarrollos exclusivos en preventa en pozo, proyectos listos para habitar y propiedades de alto valor.',
    iconName: 'Building2'
  },
  {
    id: 'gestion',
    title: 'Gestión integral de compra y venta',
    description: 'Nos encargamos de todo el flujo legal, estudio de títulos, evaluación crediticia y trámites notariales de principio a fin.',
    iconName: 'ShieldCheck'
  },
  {
    id: 'confianza',
    title: 'Transparencia y confianza',
    description: 'Información clara, proyecciones reales de rentabilidad y procesos auditables respaldados por años de trayectoria transparente.',
    iconName: 'Award'
  }
];

export const STATS = [
  { value: '+15', label: 'Años de Experiencia' },
  { value: '+$180M', label: 'USD en Transacciones' },
  { value: '99.4%', label: 'Clientes Satisfechos' },
  { value: '+60', label: 'Proyectos Gestionados' }
];

export const THIRD_PARTY_LISTINGS: import('../types').ThirdPartyListing[] = [
  {
    id: 'mkt-1',
    title: 'Depto Vista Despejada Parque Araucano',
    code: 'EXT-1042',
    type: 'Departamento',
    operation: 'Venta',
    location: 'Presidente Riesco, Las Condes',
    city: 'Santiago',
    priceUF: 7200,
    priceCLP: 275000000,
    bedrooms: 2,
    bathrooms: 2,
    areaM2: 85,
    parking: 1,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=1000',
    publisherType: 'Corredor Independiente',
    publisherName: 'Rodrigo Fernández Propiedades',
    publisherPhone: '+56987654321',
    daysRemaining: 39,
    isAiVerified: true,
    featured: true,
    capRateProyectado: 5.6
  },
  {
    id: 'mkt-2',
    title: 'Townhouse Familiar en Condominio Privado',
    code: 'EXT-2088',
    type: 'Townhouse',
    operation: 'Venta',
    location: 'Los Trapenses, Lo Barnechea',
    city: 'Santiago',
    priceUF: 13900,
    priceCLP: 530000000,
    bedrooms: 4,
    bathrooms: 4,
    areaM2: 220,
    parking: 2,
    image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=1000',
    publisherType: 'Dueño Directo',
    publisherName: 'Camila Valenzuela (Dueña Directa)',
    publisherPhone: '+56976543210',
    daysRemaining: 42,
    isAiVerified: true,
    featured: true,
    capRateProyectado: 4.8
  },
  {
    id: 'mkt-3',
    title: 'Departamento Amoblado Ideal Inversionista',
    code: 'EXT-3015',
    type: 'Departamento',
    operation: 'Arriendo',
    location: 'Metro Manuel Montt, Providencia',
    city: 'Santiago',
    priceUF: 23,
    priceCLP: 890000,
    bedrooms: 1,
    bathrooms: 1,
    areaM2: 52,
    parking: 1,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1000',
    publisherType: 'Corredor Independiente',
    publisherName: 'Andes Realty Group',
    publisherPhone: '+56965432109',
    daysRemaining: 34,
    isAiVerified: true,
    featured: false,
    capRateProyectado: 6.4
  },
  {
    id: 'mkt-4',
    title: 'Parcela de Agrado Urbanizada con Vista Lago',
    code: 'EXT-4091',
    type: 'Terreno',
    operation: 'Venta',
    location: 'Camino a Ensenada Km 12',
    city: 'Puerto Varas',
    priceUF: 3400,
    priceCLP: 130000000,
    bedrooms: 0,
    bathrooms: 0,
    areaM2: 5000,
    parking: 0,
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1000',
    publisherType: 'Corredor Independiente',
    publisherName: 'Sur Austral Gestión',
    publisherPhone: '+56954321098',
    daysRemaining: 44,
    isAiVerified: true,
    featured: true,
    capRateProyectado: 7.2
  },
  {
    id: 'mkt-5',
    title: 'Depto Borde Costero Vista Panorámica',
    code: 'EXT-5110',
    type: 'Departamento',
    operation: 'Venta',
    location: 'Costa de Montemar, Concón',
    city: 'Valparaíso',
    priceUF: 5800,
    priceCLP: 221000000,
    bedrooms: 2,
    bathrooms: 2,
    areaM2: 78,
    parking: 1,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1000',
    publisherType: 'Dueño Directo',
    publisherName: 'Mauricio Soto (Sin Comisión)',
    publisherPhone: '+56943210987',
    daysRemaining: 28,
    isAiVerified: false,
    featured: false,
    capRateProyectado: 6.9
  },
  {
    id: 'mkt-6',
    title: 'Oficina Habilitada Planta Libre',
    code: 'EXT-6022',
    type: 'Oficina',
    operation: 'Arriendo',
    location: 'Nueva Las Condes, Las Condes',
    city: 'Santiago',
    priceUF: 48,
    priceCLP: 1850000,
    bedrooms: 0,
    bathrooms: 2,
    areaM2: 110,
    parking: 2,
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000',
    publisherType: 'Corredor Independiente',
    publisherName: 'Prime Corporate Brokers',
    publisherPhone: '+56932109876',
    daysRemaining: 31,
    isAiVerified: true,
    featured: false,
    capRateProyectado: 6.1
  },
  {
    id: 'mkt-7',
    title: 'Depto Panorámico Andalué con Vista a Laguna',
    code: 'EXT-7033',
    type: 'Departamento',
    operation: 'Venta',
    location: 'Andalué, San Pedro de la Paz',
    city: 'Biobío',
    priceUF: 6100,
    priceCLP: 232000000,
    bedrooms: 3,
    bathrooms: 2,
    areaM2: 98,
    parking: 2,
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1000',
    publisherType: 'Corredor Independiente',
    publisherName: 'Bío Bío Propiedades & Gestión',
    publisherPhone: '+56981122334',
    daysRemaining: 40,
    isAiVerified: true,
    featured: true,
    capRateProyectado: 6.7
  },
  {
    id: 'mkt-8',
    title: 'Casa Mediterránea en San Joaquín Oriente',
    code: 'EXT-8045',
    type: 'Casa',
    operation: 'Venta',
    location: 'San Joaquín, La Serena',
    city: 'Coquimbo',
    priceUF: 7800,
    priceCLP: 297000000,
    bedrooms: 4,
    bathrooms: 3,
    areaM2: 175,
    parking: 2,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1000',
    publisherType: 'Dueño Directo',
    publisherName: 'Gonzalo Araya (Sin Comisión)',
    publisherPhone: '+56972233445',
    daysRemaining: 37,
    isAiVerified: true,
    featured: false,
    capRateProyectado: 5.9
  },
  {
    id: 'mkt-9',
    title: 'Penthouse Exclusivo en Jardines del Sur',
    code: 'EXT-9011',
    type: 'Departamento',
    operation: 'Venta',
    location: 'Av. Croacia, Jardines del Sur',
    city: 'Antofagasta',
    priceUF: 9400,
    priceCLP: 358000000,
    bedrooms: 3,
    bathrooms: 3,
    areaM2: 135,
    parking: 2,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1000',
    publisherType: 'Corredor Independiente',
    publisherName: 'Norte Minero Real Estate',
    publisherPhone: '+56963344556',
    daysRemaining: 43,
    isAiVerified: true,
    featured: true,
    capRateProyectado: 7.1
  },
  {
    id: 'mkt-10',
    title: 'Casa Familiar en Portal de la Frontera',
    code: 'EXT-1002',
    type: 'Casa',
    operation: 'Venta',
    location: 'Portal de la Frontera, Temuco',
    city: 'La Araucanía',
    priceUF: 8200,
    priceCLP: 312000000,
    bedrooms: 4,
    bathrooms: 3,
    areaM2: 190,
    parking: 2,
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=80&w=1000',
    publisherType: 'Corredor Independiente',
    publisherName: 'Frontera Sur Corretajes',
    publisherPhone: '+56954455667',
    daysRemaining: 36,
    isAiVerified: true,
    featured: false,
    capRateProyectado: 6.3
  }
];

export const HOME_SERVICE_PROVIDERS: import('../types').HomeServiceProvider[] = [
  {
    id: 'prov-1',
    name: 'Eduardo Morales V.',
    companyOrTradeName: 'Gasfitería & Calefacción Oriente SpA',
    category: 'Gasfitería',
    coverageZones: ['Las Condes', 'Vitacura', 'Lo Barnechea', 'Providencia'],
    rating: 4.95,
    reviewCount: 64,
    completedJobsCount: 180,
    phone: '+56991234567',
    avatarUrl: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&q=80&w=300',
    badges: ['Certificación SEC Vigente', 'Antecedentes Limpios 2026', 'Emite Boleta/Factura'],
    experienceYears: 14,
    description: 'Especialista en detección acústica de fugas no visibles, mantención integral de calefonts y calderas de condensación multimarca. Atención de urgencias residenciales.',
    planType: 'Empresa',
    featured: true
  },
  {
    id: 'prov-2',
    name: 'Cristóbal Navarrete P.',
    companyOrTradeName: 'ElectroHogar SEC Ingeniería',
    category: 'Electricidad',
    coverageZones: ['Santiago Oriente', 'Ñuñoa', 'La Reina', 'Chicureo'],
    rating: 4.92,
    reviewCount: 52,
    completedJobsCount: 140,
    phone: '+56982345678',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
    badges: ['Instalador SEC Clase A', 'Antecedentes Verificados', 'Factura Exenta/Afecta'],
    experienceYears: 11,
    description: 'Regularización de empalmes y trámites TE1 ante la SEC. Montaje de tableros con protectores diferenciales de alta inmunidad, iluminación LED domótica y cargadores de vehículos eléctricos.',
    planType: 'Independiente',
    featured: true
  },
  {
    id: 'prov-3',
    name: 'Constructora & Diseño Alerce',
    companyOrTradeName: 'Alerce Remodelaciones & Acabados',
    category: 'Remodelación & Pintura',
    coverageZones: ['Las Condes', 'Vitacura', 'Concón', 'Puerto Varas'],
    rating: 4.88,
    reviewCount: 41,
    completedJobsCount: 85,
    phone: '+56973456789',
    email: 'contacto@alercediseno.cl',
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300',
    badges: ['Constitución SpA Auditada', 'Garantía 1 Año por Contrato', 'Factura Electrónica SII'],
    experienceYears: 16,
    description: 'Remodelación integral de cocinas abiertas, modernización de baños principales, pintura termoplástica de alta durabilidad e instalación de pisos SPC hidrófugos.',
    planType: 'Empresa',
    featured: true,
    projectsGallery: [
      {
        id: 'proj-1',
        title: 'Remodelación Integral Cocina Isla & Cubierta Silestone',
        description: 'Proyecto llave en mano en San Damián, Las Condes. Muebles termoformados y campana extractora oculta.',
        imageAfter: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&q=80&w=800',
        completionDate: 'Febrero 2026'
      },
      {
        id: 'proj-2',
        title: 'Modernización de Baño Principal Suite & Grifería Empotrada',
        description: 'Cambio de tina por plato de ducha italiano en porcelanato rectificado en El Golf.',
        imageAfter: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800',
        completionDate: 'Enero 2026'
      }
    ]
  },
  {
    id: 'prov-4',
    name: 'Martín Sepúlveda B.',
    companyOrTradeName: 'ClimaSur Split Inverter',
    category: 'Climatización',
    coverageZones: ['Providencia', 'Las Condes', 'Viña del Mar', 'Concón'],
    rating: 4.97,
    reviewCount: 38,
    completedJobsCount: 95,
    phone: '+56964567890',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300',
    badges: ['Técnico Frigorista Certificado', 'Antecedentes Verificados', 'Boleta Electrónica'],
    experienceYears: 9,
    description: 'Instalación y mantención de aires acondicionados Inverter frío/calor silenciosos para departamentos y casas. Cero daño a fachadas normadas.',
    planType: 'Independiente',
    featured: false
  },
  {
    id: 'prov-5',
    name: 'Patagonia Jardines & Riego',
    companyOrTradeName: 'Paisajismo Verde Sustentable',
    category: 'Jardinería',
    coverageZones: ['Lo Barnechea', 'Chicureo', 'Puerto Varas', 'Frutillar'],
    rating: 4.90,
    reviewCount: 29,
    completedJobsCount: 72,
    phone: '+56955678901',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
    badges: ['Especialistas en Riego Tecnificado', 'Empresa Registrada SII', 'Garantía Vegetal'],
    experienceYears: 12,
    description: 'Diseño paisajístico de bajo consumo hídrico, instalación de césped en palmeta, poda de altura certificada y automatización de riego por goteo con sensores de humedad.',
    planType: 'Empresa',
    featured: false
  },
  {
    id: 'prov-6',
    name: 'Cerrajería de Precisión Los Leones',
    companyOrTradeName: 'Seguridad Residencial 24/7',
    category: 'Cerrajería',
    coverageZones: ['Santiago Centro', 'Providencia', 'Las Condes', 'Vitacura'],
    rating: 4.94,
    reviewCount: 47,
    completedJobsCount: 210,
    phone: '+56946789012',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    badges: ['Técnico Acreditado', 'Antecedentes Limpios', 'Atención 24/7'],
    experienceYears: 10,
    description: 'Aperturas de emergencia sin romper puertas, instalación de cerraduras digitales biométricas (Yale, Samsung), cilindros multipunto antibumping y control de accesos.',
    planType: 'Independiente',
    featured: false
  },
  {
    id: 'prov-7',
    name: 'Ingeniería & Clima Bío Bío SpA',
    companyOrTradeName: 'Climatización & Termosolar Concepción',
    category: 'Climatización',
    coverageZones: ['Concepción', 'San Pedro de la Paz', 'Talcahuano', 'Chiguayante'],
    rating: 4.96,
    reviewCount: 35,
    completedJobsCount: 88,
    phone: '+56933445566',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=300',
    badges: ['Ingenieros Certificados SEC', 'Factura Electrónica SII', 'Garantía 2 Años'],
    experienceYears: 13,
    description: 'Instalación y mantención de sistemas de bombas de calor, aire acondicionado inverter y calefacción central para viviendas y edificios corporativos en el Gran Concepción.',
    planType: 'Empresa',
    featured: true
  },
  {
    id: 'prov-8',
    name: 'Sebastián Pastén R.',
    companyOrTradeName: 'Gasfitería Técnica & Calefones Elqui',
    category: 'Gasfitería',
    coverageZones: ['La Serena', 'Coquimbo', 'Peñuelas', 'San Joaquín'],
    rating: 4.91,
    reviewCount: 44,
    completedJobsCount: 130,
    phone: '+56922334455',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=300',
    badges: ['Instalador SEC Clase 2', 'Antecedentes Auditados', 'Atención Urgencias'],
    experienceYears: 15,
    description: 'Detección de fugas de agua y gas con termografía y ultrasonido en La Serena y Coquimbo. Reparación certificada de calefón ionizado y tiro forzado.',
    planType: 'Independiente',
    featured: false
  },
  {
    id: 'prov-9',
    name: 'Constructora del Norte & Remodelaciones',
    companyOrTradeName: 'Obras & Acabados Mineros SpA',
    category: 'Remodelación & Pintura',
    coverageZones: ['Antofagasta', 'Calama', 'Mejillones'],
    rating: 4.89,
    reviewCount: 28,
    completedJobsCount: 65,
    phone: '+56911223344',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=300',
    badges: ['Constitución SpA Vigente', 'Norma ISO Obras', 'Factura Exenta/Afecta'],
    experienceYears: 14,
    description: 'Especialistas en remodelación de departamentos frente al mar, impermeabilización de terrazas contra la brisa marina y pinturas anticorrosivas de alto tráfico en Antofagasta.',
    planType: 'Empresa',
    featured: true
  }
];

export const MOCK_APPLICATIONS: import('../types').ProviderApplication[] = [
  {
    id: 'APP-101',
    applicantType: 'Particular',
    fullNameOrCompanyName: 'Juan Carlos Pino Sepúlveda',
    rut: '14.821.439-5',
    contactEmail: 'jcpino.gasfiter@gmail.com',
    contactPhone: '+56 9 8812 3456',
    category: 'Gasfitería',
    zones: ['Las Condes', 'Providencia', 'Ñuñoa'],
    appliedDate: '24 Oct 2026',
    status: 'Pendiente',
    documents: [
      { name: 'Cédula de Identidad (Ambos Lados)', type: 'PDF / Imagen', status: 'Cargado' },
      { name: 'Certificado de Antecedentes Fines Especiales (Vigente)', type: 'PDF', status: 'Cargado' },
      { name: 'Licencia SEC Instalador de Gas Clase 3', type: 'PDF', status: 'Cargado' },
      { name: 'Iniciación de Actividades Boleta Honorarios (SII)', type: 'PDF', status: 'Cargado' }
    ],
    notes: 'Solicitante independiente con 8 años de experiencia en mantención de calefonts y gasfitería general.'
  },
  {
    id: 'APP-102',
    applicantType: 'Empresa',
    fullNameOrCompanyName: 'Servicios Integrales Los Andes SpA',
    rut: '76.994.210-3',
    contactEmail: 'operaciones@losandesspa.cl',
    contactPhone: '+56 9 7723 9988',
    category: 'Remodelación & Pintura',
    zones: ['Vitacura', 'Lo Barnechea', 'Concón'],
    appliedDate: '23 Oct 2026',
    status: 'Pendiente',
    documents: [
      { name: 'E-RUT & Escritura Constitución de Sociedad', type: 'PDF', status: 'Cargado' },
      { name: 'Carpeta Tributaria Electrónica SII (Últimos 12 meses)', type: 'PDF', status: 'Cargado' },
      { name: 'Certificado de Vigencia de Poderes Registro Empresas', type: 'PDF', status: 'Cargado' },
      { name: 'Póliza de Responsabilidad Civil Obras Menores', type: 'PDF', status: 'Cargado' }
    ],
    notes: 'Empresa contratista de 12 operarios especializada en remodelaciones de cocinas y baños.'
  },
  {
    id: 'APP-103',
    applicantType: 'Particular',
    fullNameOrCompanyName: 'Héctor Valenzuela Tagle',
    rut: '12.441.902-8',
    contactEmail: 'hvalenzuela.sec@gmail.com',
    contactPhone: '+56 9 6611 2233',
    category: 'Electricidad',
    zones: ['Santiago Oriente', 'Chicureo'],
    appliedDate: '20 Oct 2026',
    status: 'Aprobado',
    documents: [
      { name: 'Cédula de Identidad', type: 'PDF', status: 'Auditado' },
      { name: 'Certificado de Antecedentes', type: 'PDF', status: 'Auditado' },
      { name: 'Carnet Instalador SEC Clase A', type: 'PDF', status: 'Auditado' }
    ],
    notes: 'Aprobado y publicado en la Red de Confianza Melsa.'
  }
];

export const MOCK_AUTH_USERS: import('../types').AuthUser[] = [
  {
    id: 'usr-admin',
    name: 'Administración Melsa',
    email: 'admin@melsainmobiliaria.com',
    role: 'admin'
  },
  {
    id: 'usr-agencia-demo',
    name: 'Andes Propiedades SpA',
    email: 'contacto@andespropiedades.cl',
    role: 'agency',
    companyName: 'Andes Propiedades SpA',
    agencyPlan: 'intermedio'
  },
  {
    id: 'usr-alerce',
    name: 'Alerce Remodelaciones (Constructora)',
    email: 'contacto@alercediseno.cl',
    role: 'provider',
    providerId: 'prov-3'
  },
  {
    id: 'usr-morales',
    name: 'Eduardo Morales (Gasfitería)',
    email: 'contacto@moralesgasfiter.cl',
    role: 'provider',
    providerId: 'prov-1'
  }
];

export const AGENCY_SAAS_PLANS: import('../types').AgencySaaSPlan[] = [
  {
    id: 'gratis',
    name: 'Gratis Inicial',
    priceCLP: 0,
    priceFormatted: '$0',
    billingPeriod: '/ mes para siempre',
    propertiesLimit: 'Hasta 3 contratos de arriendo',
    description: 'Ideal para corredores independientes que inician su cartera y buscan ordenar sus primeras propiedades.',
    features: [
      'Gestión de hasta 3 arriendos activos',
      'Ficha digital de propietarios y arrendatarios',
      'Registro básico de cuotas y fechas de vencimiento',
      'Pipeline de hasta 5 propiedades en venta',
      'Soporte comunitario por correo'
    ],
    ctaText: 'Comenzar Gratis'
  },
  {
    id: 'basico',
    name: 'Plan Básico',
    priceCLP: 9900,
    priceFormatted: '$9.900',
    billingPeriod: '/ mes (facturación mensual)',
    badge: 'Inicio Profesional',
    propertiesLimit: 'Hasta 15 contratos de arriendo',
    description: 'Para corredores y pequeñas agencias que necesitan automatizar reajustes y emitir liquidaciones impecables.',
    features: [
      'Gestión de hasta 15 arriendos activos',
      'Cálculo automático de reajuste por IPC (INE) y UF',
      'Generador de Liquidaciones a Propietarios en PDF',
      'Recordatorios automáticos de cobro por Email',
      'Pipeline de hasta 15 propiedades en venta',
      'Descarga de cartolas en formato Excel / CSV'
    ],
    ctaText: 'Elegir Plan Básico'
  },
  {
    id: 'intermedio',
    name: 'Plan Crecimiento',
    priceCLP: 19900,
    priceFormatted: '$19.900',
    billingPeriod: '/ mes (facturación mensual)',
    popular: true,
    badge: 'Más Elegido',
    propertiesLimit: 'Hasta 50 contratos de arriendo',
    description: 'La suite completa para agencias en expansión con cobranza por WhatsApp y red técnica de post-venta.',
    features: [
      'Gestión de hasta 50 arriendos activos',
      'Recordatorios y links de pago automáticos por WhatsApp',
      'Botón de pago online para arrendatarios (Khipu / Webpay)',
      'Helpdesk de Reparaciones conectado a la Red Sello Melsa',
      'Deducción automática de mantenciones en la liquidación',
      'CRM de Ventas avanzado con cálculo de comisiones',
      'Hasta 2 usuarios agentes para tu equipo'
    ],
    ctaText: 'Comenzar con Crecimiento'
  },
  {
    id: 'pro',
    name: 'Pro Empresa',
    priceCLP: 39900,
    priceFormatted: '$39.900',
    billingPeriod: '/ mes (facturación mensual)',
    badge: 'Control Total',
    propertiesLimit: 'Propiedades y contratos ilimitados',
    description: 'Solución empresarial sin límites para agencias consolidadas: multi-agente, marca blanca y firma legal.',
    features: [
      'Arriendos y propiedades en venta ILIMITADAS',
      'Multi-agente ilimitado con roles y permisos de equipo',
      'Marca Blanca: Tu logo y colores en contratos y PDFs',
      'Módulo de Firma Electrónica Simple para contratos',
      'Conciliación bancaria automatizada con match de RUT',
      'Melsa Copilot IA para tasaciones y contratos rápidos',
      'Asignación prioritaria en red técnica Sello Melsa',
      'Soporte VIP telefónico y WhatsApp exclusivo'
    ],
    ctaText: 'Activar Pro Empresa'
  }
];

export const MOCK_AGENCY_CONTRACTS: import('../types').AgencyRentalContract[] = [
  {
    id: 'cnt-101',
    propertyAddress: 'Av. Las Condes 10450, Depto 1402',
    commune: 'Las Condes, RM',
    tenantName: 'Sebastián Valenzuela R.',
    tenantRut: '17.842.119-3',
    tenantPhone: '+56 9 8451 2233',
    ownerName: 'Inmobiliaria & Rentas Los Alerces SpA',
    ownerRut: '76.890.140-5',
    ownerBank: 'Banco de Chile',
    ownerAccountNumber: 'Cta Cte 00-142-99014',
    rentAmountCLP: 820000,
    rentAmountUF: 21.6,
    readjustment: 'IPC Semestral',
    dueDay: 5,
    commissionPercent: 7.5,
    status: 'al_dia',
    lastPaymentDate: '04 Nov 2026',
    contractStart: '01 Mar 2026',
    contractEnd: '28 Feb 2027'
  },
  {
    id: 'cnt-102',
    propertyAddress: 'Av. Vitacura 4820, Depto 604',
    commune: 'Vitacura, RM',
    tenantName: 'Camila Larraín Echenique',
    tenantRut: '16.320.915-K',
    tenantPhone: '+56 9 9341 7788',
    ownerName: 'Gonzalo Matte Pérez',
    ownerRut: '11.450.823-2',
    ownerBank: 'Banco Santander',
    ownerAccountNumber: 'Cta Cte 0-000-88319-2',
    rentAmountCLP: 1150000,
    rentAmountUF: 30.2,
    readjustment: 'UF Diaria',
    dueDay: 5,
    commissionPercent: 8.0,
    status: 'por_vencer',
    lastPaymentDate: '05 Oct 2026',
    contractStart: '01 Ene 2026',
    contractEnd: '31 Dic 2026'
  },
  {
    id: 'cnt-103',
    propertyAddress: 'Av. El Bosque Norte 0240, Oficina 801',
    commune: 'Las Condes, RM',
    tenantName: 'Consultores Andinos Ltda.',
    tenantRut: '77.102.340-9',
    tenantPhone: '+56 2 2490 8800',
    ownerName: 'Inversiones El Roble S.A.',
    ownerRut: '96.551.200-1',
    ownerBank: 'BCI',
    ownerAccountNumber: 'Cta Cte 10-882910-4',
    rentAmountCLP: 1650000,
    rentAmountUF: 43.4,
    readjustment: 'IPC Anual',
    dueDay: 1,
    commissionPercent: 7.0,
    status: 'al_dia',
    lastPaymentDate: '01 Nov 2026',
    contractStart: '01 Ago 2025',
    contractEnd: '31 Jul 2027'
  },
  {
    id: 'cnt-104',
    propertyAddress: 'Monseñor Edwards 1290, Casa 4',
    commune: 'La Reina, RM',
    tenantName: 'Jorge Montecinos Alarcón',
    tenantRut: '15.119.450-4',
    tenantPhone: '+56 9 7712 3456',
    ownerName: 'Patricia Undurraga S.',
    ownerRut: '12.890.312-7',
    ownerBank: 'Banco Estado',
    ownerAccountNumber: 'Cta Cte 001-92831-0',
    rentAmountCLP: 950000,
    rentAmountUF: 25.0,
    readjustment: 'IPC Semestral',
    dueDay: 5,
    commissionPercent: 8.0,
    status: 'moroso',
    lastPaymentDate: '05 Sep 2026',
    contractStart: '01 Oct 2025',
    contractEnd: '30 Sep 2027'
  }
];

export const MOCK_AGENCY_TICKETS: import('../types').AgencyMaintenanceTicket[] = [
  {
    id: 'tck-401',
    propertyAddress: 'Av. Las Condes 10450, Depto 1402',
    tenantName: 'Sebastián Valenzuela',
    category: 'Gasfitería',
    description: 'Filtración menor en flexible de lavaplatos bajo cubierta de cocina.',
    costEstimateCLP: 35000,
    status: 'completado_liquidado',
    assignedTechnician: 'Eduardo Morales (Sello Melsa)',
    createdAt: '28 Oct 2026'
  },
  {
    id: 'tck-402',
    propertyAddress: 'Av. Vitacura 4820, Depto 604',
    tenantName: 'Camila Larraín',
    category: 'Electricidad',
    description: 'Diferencial salta al conectar horno empotrado en circuito cocina.',
    costEstimateCLP: 45000,
    status: 'tecnico_asignado',
    assignedTechnician: 'Héctor Valenzuela (SEC A)',
    createdAt: '06 Nov 2026'
  }
];

export const MOCK_AGENCY_SALES: import('../types').AgencySalePipeline[] = [
  {
    id: 'sale-201',
    propertyTitle: 'Depto 3D/2B Frente a Parque Araucano',
    priceUF: 8450,
    stage: 'promesa',
    commissionEstCLP: 6420000,
    buyerCandidate: 'Dr. Felipe Errázuriz',
    agentName: 'María Ignacia Silva'
  },
  {
    id: 'sale-202',
    propertyTitle: 'Casa Mediterránea en Condominio Piedra Roja',
    priceUF: 13900,
    stage: 'visitas',
    commissionEstCLP: 10560000,
    buyerCandidate: 'Familia Von Appen',
    agentName: 'Alexis Santana'
  },
  {
    id: 'sale-203',
    propertyTitle: 'Penthouse Dúplex con Quincho en El Golf',
    priceUF: 21500,
    stage: 'escritura',
    commissionEstCLP: 16340000,
    buyerCandidate: 'Inversiones San Cristóbal SpA',
    agentName: 'Alexis Santana'
  }
];
