import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  Image as ImageIcon, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Plus, 
  ExternalLink 
} from 'lucide-react';
import { uploadMultiplePropertyImages, UploadResult } from '../services/storageService';

interface PropertyPhotoUploaderProps {
  images: string[];
  onChange: (newImages: string[]) => void;
  maxFiles?: number;
  label?: string;
  folder?: string;
}

export const PropertyPhotoUploader: React.FC<PropertyPhotoUploaderProps> = ({
  images = [],
  onChange,
  maxFiles = 8,
  label = 'Fotografías de la Vivienda / Propiedad',
  folder = 'viviendas'
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const remainingSlots = maxFiles - images.length;
    if (remainingSlots <= 0) {
      setUploadNotice(`Has alcanzado el límite máximo de ${maxFiles} fotografías.`);
      setTimeout(() => setUploadNotice(null), 3500);
      return;
    }

    const selectedFiles = Array.from(files).slice(0, remainingSlots);
    setIsUploading(true);

    try {
      const results: UploadResult[] = await uploadMultiplePropertyImages(selectedFiles, folder);
      const successfulUrls = results.filter(r => r.url).map(r => r.url);

      const updated = [...images, ...successfulUrls];
      onChange(updated);

      const allInSupabase = results.every(r => r.isStoredInSupabase);
      if (allInSupabase) {
        setUploadNotice(`✓ ${successfulUrls.length} imagen(es) subidas y almacenadas en Supabase Storage.`);
      } else {
        setUploadNotice(`✓ ${successfulUrls.length} imagen(es) listas para publicar.`);
      }
      setTimeout(() => setUploadNotice(null), 4000);
    } catch (err: any) {
      setUploadNotice('Error al procesar las imágenes.');
      setTimeout(() => setUploadNotice(null), 4000);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const updated = images.filter((_, idx) => idx !== indexToRemove);
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
          {label} ({images.length}/{maxFiles})
        </label>
        <span className="text-[10px] text-gray-400">
          JPG, PNG o WEBP (máx. 10MB por foto)
        </span>
      </div>

      {/* Drag & Drop / Click Zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
        className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer ${
          isUploading
            ? 'border-[#D02126] bg-red-50/50'
            : 'border-gray-300 hover:border-[#D02126] hover:bg-red-50/20 bg-gray-50/60'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/jpg"
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-2">
          {isUploading ? (
            <div className="flex flex-col items-center py-2 text-[#D02126]">
              <Loader2 className="w-8 h-8 animate-spin mb-1" />
              <span className="text-xs font-bold">Subiendo a Supabase Storage...</span>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#D02126] flex items-center justify-center shadow-xs">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div className="text-xs">
                <span className="font-bold text-[#D02126] hover:underline">
                  Haz clic para seleccionar fotos
                </span>{' '}
                o arrástralas aquí desde tu equipo
              </div>
              <p className="text-[11px] text-gray-400">
                Se guardan de forma segura y optimizada en tu nube de Supabase
              </p>
            </>
          )}
        </div>
      </div>

      {/* Notice Message */}
      {uploadNotice && (
        <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{uploadNotice}</span>
        </div>
      )}

      {/* Thumbnail Gallery Preview */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {images.map((imgUrl, idx) => (
            <div
              key={idx}
              className="relative group rounded-xl overflow-hidden border border-gray-200 bg-gray-100 aspect-4/3 shadow-xs"
            >
              <img
                src={imgUrl}
                alt={`Foto vivienda ${idx + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />

              {/* Tag Principal for 1st Photo */}
              {idx === 0 && (
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-[#D02126] text-white text-[9px] font-bold uppercase tracking-wider shadow-xs">
                  Portada
                </span>
              )}

              {/* Remove Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveImage(idx);
                }}
                className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-black/70 hover:bg-[#D02126] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-sm"
                title="Eliminar foto"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}

          {/* Slot to add more if under limit */}
          {images.length < maxFiles && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-xl border-2 border-dashed border-gray-200 hover:border-[#D02126] hover:bg-red-50/20 aspect-4/3 flex flex-col items-center justify-center text-gray-400 hover:text-[#D02126] transition-all cursor-pointer"
            >
              <Plus className="w-6 h-6 mb-1" />
              <span className="text-[10px] font-semibold">Añadir otra</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
