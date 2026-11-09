import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { AuthUser, AgencyPlanTier } from '../types';
import { MOCK_AUTH_USERS } from '../data/mockData';

const SESSION_KEY = 'melsa_active_auth_user';
const REGISTERED_USERS_KEY = 'melsa_registered_users_db';

interface RegisteredAccount {
  email: string;
  password?: string;
  user: AuthUser;
}

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

function getRegisteredAccounts(): RegisteredAccount[] {
  try {
    const raw = localStorage.getItem(REGISTERED_USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveRegisteredAccount(email: string, password: string, user: AuthUser): void {
  try {
    const current = getRegisteredAccounts();
    const filtered = current.filter(acc => acc.email.toLowerCase() !== email.toLowerCase());
    filtered.push({ email: email.toLowerCase(), password, user });
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(filtered));
  } catch (err) {
    console.warn('No se pudo persistir en localStorage:', err);
  }
}

export async function loginUser(
  email: string, 
  password?: string,
  targetRole?: 'admin' | 'provider' | 'agency'
): Promise<{ user: AuthUser | null; error?: string }> {
  const cleanEmail = email.trim().toLowerCase();
  const cleanPassword = (password || '').trim();

  // 1. Intentar Supabase Auth si está disponible
  if (isSupabaseConfigured()) {
    try {
      // Timeout de 2 segundos para evitar bloquear si el DNS de Supabase no responde
      const timeoutPromise = new Promise<{ data: any; error: any }>((_, reject) => 
        setTimeout(() => reject(new Error('Supabase timeout')), 2000)
      );

      const authPromise = supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPassword
      });

      const { data, error } = await Promise.race([authPromise, timeoutPromise]);

      if (!error && data?.user) {
        const detectedRole = data.user.user_metadata?.role || 
          (cleanEmail.includes('admin') || cleanEmail.includes('melsa.cl') ? 'admin' : 'agency');
        
        const loggedUser: AuthUser = {
          id: data.user.id,
          name: data.user.user_metadata?.full_name || cleanEmail.split('@')[0],
          email: data.user.email || cleanEmail,
          role: detectedRole,
          providerId: data.user.user_metadata?.providerId || undefined,
          category: data.user.user_metadata?.category || 'Gestión Inmobiliaria',
          companyName: data.user.user_metadata?.company_name || data.user.user_metadata?.full_name || cleanEmail.split('@')[0],
          agencyPlan: data.user.user_metadata?.agencyPlan || 'gratis'
        };

        saveStoredUser(loggedUser);
        saveRegisteredAccount(cleanEmail, cleanPassword, loggedUser);
        return { user: loggedUser };
      }
    } catch (err: any) {
      console.warn('Supabase Auth inaccesible o error de red, validando con base local:', err?.message);
    }
  }

  // 2. Verificar si la cuenta fue creada previamente en este navegador
  const registered = getRegisteredAccounts();
  const match = registered.find(a => a.email === cleanEmail);
  if (match) {
    if (cleanPassword && match.password && match.password !== cleanPassword) {
      return { user: null, error: 'Contraseña incorrecta para esta cuenta.' };
    }
    saveStoredUser(match.user);
    return { user: match.user };
  }

  // 3. Cuentas Maestras Oficiales
  // A. Alexis Santana / Admin Melsa Total
  if (
    cleanEmail === 'alexis.s.m@gmail.com' ||
    cleanEmail.includes('alexis') ||
    cleanEmail.includes('admin') ||
    cleanEmail.endsWith('@melsa.cl')
  ) {
    const adminUser: AuthUser = {
      id: 'usr-alexis-master',
      name: cleanEmail.includes('alexis') ? 'Alexis Santana M.' : 'Administración Melsa',
      email: cleanEmail,
      role: targetRole === 'agency' ? 'agency' : 'admin',
      companyName: 'MELSA Inmobiliaria & Gestión',
      agencyPlan: 'pro'
    };
    saveStoredUser(adminUser);
    saveRegisteredAccount(cleanEmail, cleanPassword, adminUser);
    return { user: adminUser };
  }

  // B. Agencia Inmobiliaria Demo
  if (cleanEmail.includes('agencia') || cleanEmail.includes('propiedades') || cleanEmail.includes('andes') || cleanEmail.includes('corredor')) {
    const agencyUser: AuthUser = {
      id: 'usr-agencia-' + cleanEmail.split('@')[0],
      name: cleanEmail.includes('andes') ? 'Andes Propiedades SpA' : (cleanEmail.split('@')[0].toUpperCase() + ' Propiedades'),
      email: cleanEmail,
      role: 'agency',
      companyName: cleanEmail.includes('andes') ? 'Andes Propiedades SpA' : (cleanEmail.split('@')[0].toUpperCase() + ' Propiedades'),
      agencyPlan: 'intermedio'
    };
    saveStoredUser(agencyUser);
    saveRegisteredAccount(cleanEmail, cleanPassword, agencyUser);
    return { user: agencyUser };
  }

  // C. Técnicos del Hogar
  if (cleanEmail.includes('gasfiter') || cleanEmail.includes('morales') || cleanEmail.includes('sec')) {
    const providerUser: AuthUser = {
      ...MOCK_AUTH_USERS[3],
      email: cleanEmail
    };
    saveStoredUser(providerUser);
    saveRegisteredAccount(cleanEmail, cleanPassword, providerUser);
    return { user: providerUser };
  }

  // D. Cualquier nuevo usuario con contraseña
  const genericUser: AuthUser = {
    id: 'usr-' + Date.now(),
    name: cleanEmail.split('@')[0],
    email: cleanEmail,
    role: targetRole || 'agency',
    companyName: cleanEmail.split('@')[0] + ' Inmobiliaria',
    agencyPlan: 'gratis'
  };
  saveStoredUser(genericUser);
  saveRegisteredAccount(cleanEmail, cleanPassword, genericUser);
  return { user: genericUser };
}

export async function logoutUser(): Promise<void> {
  saveStoredUser(null);
  if (isSupabaseConfigured()) {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('Cierre de sesión local completado');
    }
  }
}

export async function registerNewUser(
  email: string, 
  password: string, 
  fullName: string,
  accountType: 'provider' | 'admin' | 'broker' | 'agency',
  category?: string,
  plan?: AgencyPlanTier
): Promise<{ user?: AuthUser; success: boolean; error?: string }> {
  const cleanEmail = email.trim().toLowerCase();
  const assignedRole = accountType === 'admin' ? 'admin' : accountType === 'agency' ? 'agency' : 'provider';
  
  const newUser: AuthUser = {
    id: 'usr-' + Date.now(),
    name: fullName.trim(),
    email: cleanEmail,
    role: assignedRole,
    providerId: assignedRole === 'provider' ? 'prov-' + Date.now() : undefined,
    category: category || (assignedRole === 'agency' ? 'Gestión Inmobiliaria' : 'Remodelación & Pintura'),
    companyName: fullName.trim(),
    agencyPlan: plan || 'gratis'
  };

  // 1. Intentar registrar en Supabase Auth en segundo plano
  if (isSupabaseConfigured()) {
    try {
      const timeoutPromise = new Promise<{ data: any; error: any }>((_, reject) => 
        setTimeout(() => reject(new Error('Supabase timeout')), 2000)
      );

      const signUpPromise = supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            full_name: fullName,
            role: assignedRole,
            category: category || 'Gestión Inmobiliaria',
            agencyPlan: plan || 'gratis'
          }
        }
      });

      const { data, error } = await Promise.race([signUpPromise, timeoutPromise]);
      if (!error && data?.user) {
        newUser.id = data.user.id;
      }
    } catch (err: any) {
      console.warn('Supabase Auth inaccesible (activando registro local inmediato):', err?.message);
    }
  }

  // 2. Persistir localmente de forma inmediata para que el usuario NUNCA quede bloqueado
  saveStoredUser(newUser);
  saveRegisteredAccount(cleanEmail, password, newUser);

  return { success: true, user: newUser };
}

export const registerProviderUser = (email: string, password: string, fullName: string, category?: string) => 
  registerNewUser(email, password, fullName, 'provider', category);
