import { useCallback, useEffect, useId, useRef, useState, type ChangeEvent } from 'react';
import { ImageIcon, Loader2, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '../context/LanguageContext';
import {
  ACCEPTED_IMAGE_MIME_TYPES,
  uploadImageFile,
  validateImageFile,
  type ImageUploadFolder,
} from '../lib/imageUploads';

interface ImageUploadFieldProps {
  label: string;
  value?: string;
  onChange: (url: string) => void;
  folder: ImageUploadFolder;
  previewAlt?: string;
  className?: string;
  compact?: boolean;
  showPreview?: boolean;
  disabled?: boolean;
  onUploadStateChange?: (isUploading: boolean) => void;
}

export function ImageUploadField({
  label,
  value = '',
  onChange,
  folder,
  previewAlt = '',
  className = '',
  compact = false,
  showPreview = true,
  disabled = false,
  onUploadStateChange,
}: ImageUploadFieldProps) {
  const { t } = useLanguage();
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const isMountedRef = useRef(true);
  const isChoosingFileRef = useRef(false);
  const uploadStateChangeRef = useRef(onUploadStateChange);
  const previewUrlRef = useRef('');
  const filePickerScrollRef = useRef({ left: 0, top: 0 });
  const [isUploading, setIsUploading] = useState(false);
  const [isChoosingFile, setIsChoosingFile] = useState(false);
  const [error, setError] = useState('');
  const [localPreviewUrl, setLocalPreviewUrl] = useState('');
  const [previewFailed, setPreviewFailed] = useState(false);

  useEffect(() => {
    uploadStateChangeRef.current = onUploadStateChange;
  }, [onUploadStateChange]);

  const revokeLocalPreview = useCallback(() => {
    if (!previewUrlRef.current) return;

    try {
      if (typeof URL !== 'undefined' && typeof URL.revokeObjectURL === 'function') {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    } catch {
      // Some older browsers can fail here; the preview is already being discarded.
    }

    previewUrlRef.current = '';
  }, []);

  const clearLocalPreview = useCallback(() => {
    revokeLocalPreview();
    if (!isMountedRef.current) return;
    setLocalPreviewUrl('');
  }, [revokeLocalPreview]);

  const setUploading = useCallback((nextValue: boolean) => {
    if (!isMountedRef.current) return;
    setIsUploading(nextValue);
    uploadStateChangeRef.current?.(nextValue);
  }, []);

  const restoreScrollAfterFilePicker = useCallback(() => {
    if (typeof window === 'undefined') return;

    const { left, top } = filePickerScrollRef.current;
    const restore = () => {
      if (!isMountedRef.current) return;
      window.scrollTo({ left, top, behavior: 'auto' });
    };

    restore();
    window.requestAnimationFrame(() => window.requestAnimationFrame(restore));
    window.setTimeout(restore, 120);
  }, []);

  const finishChoosingFile = useCallback(() => {
    if (!isChoosingFileRef.current) return;
    isChoosingFileRef.current = false;
    setIsChoosingFile(false);
    restoreScrollAfterFilePicker();
  }, [restoreScrollAfterFilePicker]);

  const handleFilePickerOpen = () => {
    if (typeof window !== 'undefined') {
      filePickerScrollRef.current = { left: window.scrollX, top: window.scrollY };
    }
    isChoosingFileRef.current = true;
    setIsChoosingFile(true);
  };

  useEffect(() => {
    isMountedRef.current = true;

    const handlePageShow = () => {
      finishChoosingFile();
      if (!inputRef.current?.files?.length) {
        setUploading(false);
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        finishChoosingFile();
        if (!inputRef.current?.files?.length) {
          setUploading(false);
        }
      }
    };

    window.addEventListener('pageshow', handlePageShow);
    window.addEventListener('focus', handlePageShow);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      isMountedRef.current = false;
      revokeLocalPreview();
      window.removeEventListener('pageshow', handlePageShow);
      window.removeEventListener('focus', handlePageShow);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      uploadStateChangeRef.current?.(false);
    };
  }, [finishChoosingFile, revokeLocalPreview, setUploading]);

  useEffect(() => {
    setPreviewFailed(false);
  }, [value, localPreviewUrl]);

  const createLocalPreview = (file: File) => {
    clearLocalPreview();

    if (typeof URL === 'undefined' || typeof URL.createObjectURL !== 'function') {
      return;
    }

    try {
      const previewUrl = URL.createObjectURL(file);
      previewUrlRef.current = previewUrl;
      if (isMountedRef.current) {
        setLocalPreviewUrl(previewUrl);
      }
    } catch (previewError) {
      console.warn('Image preview could not be created:', previewError);
    }
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    finishChoosingFile();
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) {
      setUploading(false);
      return;
    }

    setError('');
    setPreviewFailed(false);
    clearLocalPreview();

    try {
      validateImageFile(file);
    } catch (validationError) {
      const message = validationError instanceof Error ? validationError.message : t('image_upload_error');
      setError(message);
      setUploading(false);
      toast.error(message);
      return;
    }

    createLocalPreview(file);
    setUploading(true);

    try {
      const uploadedUrl = await uploadImageFile(file, folder);
      if (!isMountedRef.current) return;
      onChange(uploadedUrl);
      clearLocalPreview();
      toast.success(t('image_upload_success'));
    } catch (uploadError) {
      if (!isMountedRef.current) return;
      const message = uploadError instanceof Error ? uploadError.message : t('image_upload_error');
      clearLocalPreview();
      setError(message);
      console.warn('Image upload failed:', {
        folder,
        fileType: file.type || 'unknown',
        fileSize: file.size,
        error: message,
      });
      toast.error(message);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    clearLocalPreview();
    setError('');
    setPreviewFailed(false);
    setUploading(false);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    onChange('');
  };

  const previewSrc = localPreviewUrl || value;
  const canShowImagePreview = Boolean(previewSrc) && !previewFailed;

  const input = (
    <input
      ref={inputRef}
      id={inputId}
      type="file"
      accept={ACCEPTED_IMAGE_MIME_TYPES.join(',')}
      onClick={handleFilePickerOpen}
      onChange={handleFileChange}
      disabled={disabled || isUploading}
      className="sr-only"
    />
  );

  if (compact) {
    return (
      <div className={className}>
        <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-gray-400">
          {label}
        </label>
        <div className="flex flex-wrap items-center gap-2">
          {input}
          <label
            htmlFor={inputId}
            className={`inline-flex h-8 cursor-pointer items-center justify-center rounded-md border border-[#b08a57]/35 bg-white px-3 text-xs font-medium text-[#2f2f2d] transition-colors hover:bg-[#f8f7f3] ${
              disabled || isUploading ? 'pointer-events-none opacity-60' : ''
            }`}
          >
            {isUploading ? <Loader2 size={13} className="mr-1.5 animate-spin" /> : <Upload size={13} className="mr-1.5" />}
            {isUploading && !isChoosingFile ? t('image_upload_uploading') : value ? t('image_upload_replace') : t('image_upload_choose')}
          </label>
          {value && (
            <button
              type="button"
              onClick={handleRemoveImage}
              disabled={disabled || isUploading}
              className="inline-flex h-8 items-center justify-center rounded-md border border-red-200 px-2.5 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-60"
            >
              <X size={13} className="mr-1" />
              {t('image_upload_remove')}
            </button>
          )}
        </div>
        {error && <p className="mt-1.5 text-xs text-red-700">{error}</p>}
      </div>
    );
  }

  return (
    <div className={className}>
      <label className="mb-1.5 block text-sm font-medium text-[#55524c]">{label}</label>
      <div className="rounded-lg border border-[#dfd9cf] bg-[#fbfaf7] p-3">
        {showPreview && (
          <div className="mb-3 h-36 overflow-hidden rounded-md border border-[#dfd9cf] bg-white">
            {canShowImagePreview ? (
              <img
                src={previewSrc}
                alt={previewAlt}
                className={`h-full w-full object-cover ${isUploading ? 'opacity-75' : ''}`}
                onError={() => setPreviewFailed(true)}
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-2 text-sm text-[#77756f]">
                <ImageIcon size={28} className="text-[#b08a57]/60" />
                {t('image_upload_empty')}
              </div>
            )}
          </div>
        )}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          {input}
          <label
            htmlFor={inputId}
            className={`inline-flex cursor-pointer items-center justify-center rounded-md bg-[#2f2f2d] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#1c1c1a] ${
              disabled || isUploading ? 'pointer-events-none opacity-60' : ''
            }`}
          >
            {isUploading ? <Loader2 size={16} className="mr-2 animate-spin" /> : <Upload size={16} className="mr-2" />}
            {isUploading && !isChoosingFile ? t('image_upload_uploading') : value ? t('image_upload_replace') : t('image_upload_choose')}
          </label>
          {value && (
            <button
              type="button"
              onClick={handleRemoveImage}
              disabled={disabled || isUploading}
              className="inline-flex items-center justify-center rounded-md border border-red-200 px-4 py-2.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-50 disabled:opacity-60"
            >
              <X size={16} className="mr-2" />
              {t('image_upload_remove')}
            </button>
          )}
        </div>
        <p className="mt-2 text-xs text-[#77756f]">{t('image_upload_hint')}</p>
        {error && <p className="mt-2 text-sm text-red-700">{error}</p>}
      </div>
    </div>
  );
}
