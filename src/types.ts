export interface RealEstateProject {
  id: string;
  name: string;
  subtitle: string;
  location: string;
  city: string;
  type: 'Apartamento' | 'Penthouse' | 'Villa' | 'Oficinas';
  status: 'Preventa / Pozo' | 'Entrega Inmediata' | 'En Construcción' | 'Inversión';
  priceFromUSD: number;
  priceFromUF?: number;
  deliveryDate: string;
  bedrooms: string; // e.g. "1 a 3 dorms"
  surfaceM2: string; // e.g. "65 - 180 m²"
  mainImage: string;
  galleryImages: string[];
  description: string;
  amenities: string[];
  highlights: string[];
  featured?: boolean;
}

export interface Property {
  id: string;
  title: string;
  code: string;
  type: 'Casa' | 'Departamento' | 'Penthouse' | 'Terreno' | 'Oficina';
  operation: 'Venta' | 'Arriendo' | 'Inversión';
  location: string;
  priceUSD: number;
  bedrooms: number;
  bathrooms: number;
  areaM2: number;
  parking: number;
  image: string;
  agentId: string;
  featured?: boolean;
}

export interface TeamAgent {
  id: string;
  name: string;
  role: string;
  specialty: string;
  experienceYears: number;
  phone: string;
  email: string;
  photoUrl: string;
  bio: string;
  activeListings: number;
}

export interface Testimonial {
  id: string;
  clientName: string;
  clientRole: string;
  avatarUrl: string;
  comment: string;
  rating: number;
  propertyType: string;
  year: string;
}

export interface AdvisoryFormData {
  fullName: string;
  email: string;
  phone: string;
  interestType: 'Comprar' | 'Vender' | 'Invertir' | 'Arrendar' | 'Asesoría General';
  budgetRange: string;
  preferredAgentId?: string;
  selectedProjectId?: string;
  preferredDate?: string;
  message: string;
}

export interface ThirdPartyListing {
  id: string;
  title: string;
  code: string;
  type: 'Casa' | 'Departamento' | 'Townhouse' | 'Terreno' | 'Oficina';
  operation: 'Venta' | 'Arriendo';
  location: string;
  city: string;
  priceUF: number;
  priceCLP: number;
  bedrooms: number;
  bathrooms: number;
  areaM2: number;
  parking: number;
  image: string;
  publisherType: 'Corredor Independiente' | 'Dueño Directo' | 'Inmobiliaria Externa';
  publisherName: string;
  publisherPhone: string;
  daysRemaining: number;
  isAiVerified?: boolean;
  featured?: boolean;
  capRateProyectado?: number;
}

export interface ProviderProject {
  id: string;
  title: string;
  description: string;
  imageBefore?: string;
  imageAfter: string;
  completionDate: string;
}

export interface HomeServiceProvider {
  id: string;
  name: string;
  companyOrTradeName: string;
  category: 'Gasfitería' | 'Electricidad' | 'Remodelación & Pintura' | 'Climatización' | 'Jardinería' | 'Cerrajería';
  coverageZones: string[];
  rating: number;
  reviewCount: number;
  completedJobsCount: number;
  phone: string;
  email?: string;
  avatarUrl: string;
  badges: string[];
  experienceYears: number;
  description: string;
  planType: 'Independiente' | 'Empresa';
  featured?: boolean;
  projectsGallery?: ProviderProject[];
}

export interface ProviderApplication {
  id: string;
  applicantType: 'Particular' | 'Empresa';
  fullNameOrCompanyName: string;
  rut: string;
  contactEmail: string;
  contactPhone: string;
  category: string;
  zones: string[];
  appliedDate: string;
  status: 'Pendiente' | 'Aprobado' | 'Rechazado';
  documents: {
    name: string;
    type: string;
    status: 'Cargado' | 'Auditado' | 'Faltante';
    fileUrl?: string;
  }[];
  notes?: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'provider';
  providerId?: string;
  category?: string;
  companyName?: string;
}
