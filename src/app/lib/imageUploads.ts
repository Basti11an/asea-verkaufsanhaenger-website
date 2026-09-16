import { isSupabaseConfigured, supabase } from './supabase';

export type ImageUploadFolder = 'references' | 'models';

export const ASEA_UPLOADS_BUCKET = 'asea-uploads';
export const MAX_IMAGE_UPLOAD_SIZE = 5 * 1024 * 1024;
export const ACCEPTED_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
export const ACCEPTED_IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'gif'];

const EXTENSION_BY_MIME_TYPE: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

function getSafeFileExtension(file: File) {
  const fromType = EXTENSION_BY_MIME_TYPE[file.type];
  if (fromType) return fromType;

  const fromName = file.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '');
  return fromName && ACCEPTED_IMAGE_EXTENSIONS.includes(fromName) ? fromName : 'jpg';
}

function createUploadPath(file: File, folder: ImageUploadFolder) {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const randomPart =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  return `${folder}/${year}-${month}/${randomPart}.${getSafeFileExtension(file)}`;
}

export function validateImageFile(file: File) {
  const extension = file.name.split('.').pop()?.toLowerCase() ?? '';
  const hasAcceptedMimeType = ACCEPTED_IMAGE_MIME_TYPES.includes(file.type);
  const hasAcceptedExtension = ACCEPTED_IMAGE_EXTENSIONS.includes(extension);
  const hasUnknownMimeType = !file.type;

  if (!hasAcceptedMimeType && !(hasUnknownMimeType && hasAcceptedExtension)) {
    throw new Error('Bitte wählen Sie ein Bild im Format JPG, PNG, WebP oder GIF aus.');
  }

  if (file.size > MAX_IMAGE_UPLOAD_SIZE) {
    throw new Error('Das Bild ist zu groß. Bitte wählen Sie ein Bild mit maximal 5 MB aus.');
  }
}

export async function uploadImageFile(file: File, folder: ImageUploadFolder) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Bild-Upload ist erst möglich, wenn Supabase korrekt verbunden ist.');
  }

  validateImageFile(file);

  const path = createUploadPath(file, folder);
  const { error } = await supabase.storage
    .from(ASEA_UPLOADS_BUCKET)
    .upload(path, file, {
      cacheControl: '31536000',
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    throw new Error(
      `Bild konnte nicht hochgeladen werden. Bitte prüfen Sie den Supabase Storage-Bucket "${ASEA_UPLOADS_BUCKET}".`,
    );
  }

  const { data } = supabase.storage.from(ASEA_UPLOADS_BUCKET).getPublicUrl(path);

  if (!data.publicUrl) {
    throw new Error('Bild wurde hochgeladen, aber es konnte keine öffentliche Bildadresse erzeugt werden.');
  }

  return data.publicUrl;
}
