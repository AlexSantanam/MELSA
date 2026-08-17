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
