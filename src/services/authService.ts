import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { AuthUser } from '../types';
import { MOCK_AUTH_USERS } from '../data/mockData';

const SESSION_KEY = 'melsa_active_auth_user';

export function getStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveStoredUser(user: AuthUser | null): void {
  if (user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
}

export async function loginUser(
  email: string, 
  password?: string,
  targetRole?: 'admin' | 'provider'
): Promise<{ user: AuthUser | null; error?: string }> {
  const cleanEmail = email.trim().toLowerCase();
  const cleanPassword = (password || '').trim();

  // 1. Try Supabase Auth first if configured
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPassword
      });

      if (!error && data.user) {
        const detectedRole = data.user.user_metadata?.role || 
          (cleanEmail.includes('admin') || cleanEmail.includes('melsa.cl') ? 'admin' : 'provider');
        
        const loggedUser: AuthUser = {
          id: data.user.id,
          name: data.user.user_metadata?.full_name || cleanEmail.split('@')[0],
          email: data.user.email || cleanEmail,
          role: detectedRole,
          providerId: data.user.user_metadata?.providerId || 'prov-3',
          category: data.user.user_metadata?.category || (cleanEmail.includes('gasfiter') ? 'Gasfitería' : cleanEmail.includes('electro') ? 'Electricidad' : 'Remodelación & Pintura'),
          companyName: data.user.user_metadata?.company_name || data.user.user_metadata?.full_name || cleanEmail.split('@')[0]
        };

        saveStoredUser(loggedUser);
        return { user: loggedUser };
      }
    } catch (err: any) {
      console.warn('Supabase Auth error, intentando validación local:', err);
    }
  }

  // 2. Local Master Accounts & Fallback Validation
  // A. Admin Portal (Equipo Melsa)
  if (targetRole === 'admin' || cleanEmail.includes('admin') || cleanEmail.endsWith('@melsa.cl')) {
    const validAdminPass = ['melsa2026', 'admin123', 'admin', '123456'];
    if (cleanPassword && !validAdminPass.includes(cleanPassword)) {
      return { 
        user: null, 
        error: 'Contraseña incorrecta para el Equipo Melsa. (Clave por defecto: melsa2026)' 
      };
    }

    const adminUser: AuthUser = {
      ...MOCK_AUTH_USERS[0],
      email: cleanEmail || MOCK_AUTH_USERS[0].email
    };
    saveStoredUser(adminUser);
    return { user: adminUser };
  }

  // B. Colaboradores / Prestadores
  const validProviderPass = ['colaborador123', '123456', 'melsa2026'];
  if (cleanPassword && !validProviderPass.includes(cleanPassword)) {
    return { 
      user: null, 
      error: 'Contraseña incorrecta para Colaboradores. (Clave por defecto: colaborador123)' 
    };
  }

  const providerUser: AuthUser = cleanEmail.includes('morales') 
    ? MOCK_AUTH_USERS[2] 
    : {
        ...MOCK_AUTH_USERS[1],
        email: cleanEmail || MOCK_AUTH_USERS[1].email
      };

  saveStoredUser(providerUser);
  return { user: providerUser };
}

export async function logoutUser(): Promise<void> {
  saveStoredUser(null);
  if (isSupabaseConfigured()) {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Error al cerrar sesión en Supabase:', err);
    }
  }
}

export async function registerNewUser(
  email: string, 
  password: string, 
  fullName: string,
  accountType: 'provider' | 'admin' | 'broker',
  category?: string
): Promise<{ user?: AuthUser; success: boolean; error?: string }> {
  const cleanEmail = email.trim().toLowerCase();
  
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            full_name: fullName,
            role: accountType,
            category: category || 'Servicios del Hogar'
          }
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      const newUser: AuthUser = {
        id: data.user?.id || 'usr-' + Date.now(),
        name: fullName,
        email: cleanEmail,
        role: accountType === 'admin' ? 'admin' : 'provider',
        providerId: 'prov-' + Date.now(),
        category: category || 'Remodelación & Pintura',
        companyName: fullName
      };

      saveStoredUser(newUser);
      return { success: true, user: newUser };
    } catch (err: any) {
      return { success: false, error: err.message || 'Error al conectar con Supabase' };
    }
  }

  // Fallback local registration
  const newUser: AuthUser = {
    id: 'local-' + Date.now(),
    name: fullName,
    email: cleanEmail,
    role: accountType === 'admin' ? 'admin' : 'provider',
    providerId: 'prov-' + Date.now(),
    category: category || 'Remodelación & Pintura',
    companyName: fullName
  };

  saveStoredUser(newUser);
  return { success: true, user: newUser };
}

export const registerProviderUser = (email: string, password: string, fullName: string, category?: string) => 
  registerNewUser(email, password, fullName, 'provider', category);

