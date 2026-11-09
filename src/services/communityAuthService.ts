export interface CommunityUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin_edificio' | 'comite' | 'conserje' | 'residente';
  communityId: string;
  communityName: string;
  communityCommune: string;
  unitsCount: number;
  unitNumber?: string;
  createdAt: string;
}

const STORAGE_KEY = 'melsa_community_auth_user';

export const DEMO_COMMUNITY_USERS: Record<string, CommunityUser> = {
  admin: {
    id: 'user-comm-admin-1',
    name: 'Alexis Santana Morales',
    email: 'admin@parquealmagro.cl',
    phone: '+56 9 9989 9421',
    role: 'admin_edificio',
    communityId: 'comm-1',
    communityName: 'Edificio Parque Almagro 1450',
    communityCommune: 'Las Condes, RM',
    unitsCount: 48,
    createdAt: '2026-11-01'
  },
  conserje: {
    id: 'user-comm-conserje-1',
    name: 'Jorge Morales Castillo (Mayordomo)',
    email: 'conserje@parquealmagro.cl',
    phone: '+56 9 8877 6655',
    role: 'conserje',
    communityId: 'comm-1',
    communityName: 'Edificio Parque Almagro 1450',
    communityCommune: 'Las Condes, RM',
    unitsCount: 48,
    createdAt: '2026-11-01'
  },
  residente: {
    id: 'user-comm-residente-1',
    name: 'Carolina Morales P. (Copropietaria)',
    email: 'residente@parquealmagro.cl',
    phone: '+56 9 8234 5678',
    role: 'residente',
    communityId: 'comm-1',
    communityName: 'Edificio Parque Almagro 1450',
    communityCommune: 'Las Condes, RM',
    unitsCount: 48,
    unitNumber: '102',
    createdAt: '2026-11-01'
  }
};

export function getStoredCommunityUser(): CommunityUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading community user:', e);
    return null;
  }
}

export function saveStoredCommunityUser(user: CommunityUser | null): void {
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch (e) {
    console.error('Error saving community user:', e);
  }
}

export function registerCommunityAccount(data: {
  communityName: string;
  commune: string;
  unitsCount: number;
  adminName: string;
  email: string;
  phone: string;
}): CommunityUser {
  const newUser: CommunityUser = {
    id: 'user-comm-' + Date.now(),
    name: data.adminName,
    email: data.email.toLowerCase().trim(),
    phone: data.phone.trim(),
    role: 'admin_edificio',
    communityId: 'comm-' + Date.now(),
    communityName: data.communityName.trim(),
    communityCommune: data.commune.trim(),
    unitsCount: data.unitsCount || 40,
    createdAt: new Date().toISOString()
  };

  saveStoredCommunityUser(newUser);
  return newUser;
}
