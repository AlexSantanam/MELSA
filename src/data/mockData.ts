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
