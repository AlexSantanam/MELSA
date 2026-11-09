import { supabase, isSupabaseConfigured } from '../lib/supabase';

export const PROPERTY_BUCKET = 'propiedades';

export interface UploadResult {
  url: string;
  fileName: string;
  size: number;
  isStoredInSupabase: boolean;
  error?: string;
}

/**
 * Convierte un archivo File a Data URL (base64) como respaldo seguro
 * en caso de que el bucket de Supabase aún no esté creado o falle la red.
 */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Sube una imagen de propiedad a Supabase Storage con fallback automático a Base64.
 * @param file Objeto File seleccionado por el usuario
 * @param folder Subcarpeta opcional (ej. 'viviendas', 'obras', 'arriendos')
 */
export async function uploadPropertyImage(
  file: File,
  folder: string = 'viviendas'
): Promise<UploadResult> {
  // Limpieza y generación de nombre único
  const timestamp = Date.now();
  const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_').toLowerCase();
  const filePath = `${folder}/${timestamp}_${cleanName}`;

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.storage
        .from(PROPERTY_BUCKET)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (!error && data) {
        const { data: publicData } = supabase.storage
          .from(PROPERTY_BUCKET)
          .getPublicUrl(filePath);

        return {
          url: publicData.publicUrl,
          fileName: cleanName,
          size: file.size,
          isStoredInSupabase: true
        };
      } else {
        console.warn('Aviso de Supabase Storage (usando fallback local):', error?.message);
      }
    } catch (err: any) {
      console.warn('Error al subir a Supabase Storage:', err?.message);
    }
  }

  // Fallback seguro: generar Data URL en base64 para que la vista previa y guardado nunca fallen
  try {
    const base64Url = await fileToBase64(file);
    return {
      url: base64Url,
      fileName: cleanName,
      size: file.size,
      isStoredInSupabase: false,
      error: 'Guardado localmente. Asegúrate de tener creado el bucket "propiedades" en Supabase Storage.'
    };
  } catch (err: any) {
    return {
      url: '',
      fileName: cleanName,
      size: file.size,
      isStoredInSupabase: false,
      error: 'No se pudo procesar la imagen.'
    };
  }
}

/**
 * Sube múltiples imágenes en paralelo
 */
export async function uploadMultiplePropertyImages(
  files: File[],
  folder: string = 'viviendas'
): Promise<UploadResult[]> {
  const promises = files.map((file) => uploadPropertyImage(file, folder));
  return Promise.all(promises);
}

/**
 * Elimina una imagen de Supabase Storage mediante su URL
 */
export async function deletePropertyImage(fileUrl: string): Promise<boolean> {
  if (!isSupabaseConfigured() || !fileUrl.includes(PROPERTY_BUCKET)) {
    return false;
  }

  try {
    const parts = fileUrl.split(`${PROPERTY_BUCKET}/`);
    if (parts.length < 2) return false;
    const filePath = decodeURIComponent(parts[1]);

    const { error } = await supabase.storage
      .from(PROPERTY_BUCKET)
      .remove([filePath]);

    return !error;
  } catch (err) {
    console.error('Error al eliminar imagen de Supabase:', err);
    return false;
  }
}
