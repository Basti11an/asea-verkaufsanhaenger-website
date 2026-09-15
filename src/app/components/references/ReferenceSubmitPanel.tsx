import { useState, type FormEvent } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';
import { useAdminData } from '../../context/AdminDataContext';
import { useLanguage, type TranslationKey } from '../../context/LanguageContext';
import { ReviewForm } from '../reviews/ReviewForm';
import { ImageUploadField } from '../ImageUploadField';

interface ReferenceSubmitPanelProps {
  className?: string;
  title?: string;
  description?: string;
  buttonLabel?: string;
  titleKey?: TranslationKey;
  descriptionKey?: TranslationKey;
  buttonLabelKey?: TranslationKey;
  initiallyOpen?: boolean;
}

const INITIAL_FORM = {
  kundenname: '',
  ort: '',
  modell: 'Verkaufsanhänger',
  jahr: new Date().getFullYear(),
  rating: 0,
  beschreibung: '',
  bildUrl: '',
  kontaktEmail: '',
  kontaktTelefon: '',
  publicConsent: false,
};

const MODEL_OPTIONS: { value: string; labelKey: TranslationKey }[] = [
  { value: 'Verkaufsanhänger', labelKey: 'reference_model_sales' },
  { value: 'Kühlanhänger', labelKey: 'reference_model_cooling' },
  { value: 'Messe- und Präsentationsanhänger', labelKey: 'reference_model_exhibition' },
];

export function ReferenceSubmitPanel({
  className = '',
  title,
  description,
  buttonLabel,
  titleKey = 'reference_submit_title',
  descriptionKey = 'reference_submit_desc',
  buttonLabelKey = 'reference_submit_button',
  initiallyOpen = false,
}: ReferenceSubmitPanelProps) {
  const { submitReference } = useAdminData();
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(initiallyOpen);
  const [form, setForm] = useState(INITIAL_FORM);
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [imageUploading, setImageUploading] = useState(false);

  const panelTitle = title ?? t(titleKey);
  const panelDescription = description ?? t(descriptionKey);
  const panelButtonLabel = buttonLabel ?? t(buttonLabelKey);

  const handleFieldChange = (field: keyof typeof form, value: string | number | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setState('idle');
    setMessage('');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setState('sending');
    setMessage('');

    if (companyWebsite.trim()) {
      setForm({ ...INITIAL_FORM, jahr: new Date().getFullYear() });
      setState('success');
      setMessage(t('reference_submit_success'));
      return;
    }

    if (form.rating < 1 || form.rating > 5) {
      setState('error');
      setMessage(t('customer_review_rating_required'));
      return;
    }

    if (form.beschreibung.trim().length < 10) {
      setState('error');
      setMessage(t('customer_review_text_required'));
      return;
    }

    if (imageUploading) {
      setState('error');
      setMessage(t('image_upload_wait'));
      return;
    }

    try {
      await submitReference(form);
      setForm({ ...INITIAL_FORM, jahr: new Date().getFullYear() });
      setState('success');
      setMessage(t('reference_submit_success'));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : t('reference_submit_error');
      setState('error');
      setMessage(errorMessage);
    }
  };

  return (
    <div className={`bg-white rounded-xl border border-[#dfd9cf] shadow-sm overflow-hidden ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="w-full p-5 md:p-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-left hover:bg-[#f8f7f3] transition-colors"
      >
        <span>
          <span className="block text-xl md:text-2xl font-bold text-[#2f2f2d]">{panelTitle}</span>
          <span className="block text-sm md:text-base text-[#77756f] mt-1 max-w-2xl">{panelDescription}</span>
        </span>
        <span className="inline-flex items-center justify-center gap-2 bg-[#2f2f2d] text-white rounded-md px-4 py-2.5 text-sm font-medium shrink-0">
          {panelButtonLabel}
          <ChevronDown
            size={16}
            className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          />
        </span>
      </button>

      {isOpen && (
        <motion.div
          className="border-t border-[#dfd9cf] p-6 md:p-8"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          <ReviewForm
            onSubmit={handleSubmit}
            rating={form.rating}
            onRatingChange={(value) => handleFieldChange('rating', value)}
            description={form.beschreibung}
            onDescriptionChange={(value) => handleFieldChange('beschreibung', value)}
            location={form.ort}
            onLocationChange={(value) => handleFieldChange('ort', value)}
            publicConsent={form.publicConsent}
            onPublicConsentChange={(value) => handleFieldChange('publicConsent', value)}
            submitLabel={t('reference_submit_button')}
            sendingLabel={imageUploading ? t('image_upload_uploading') : t('reference_submit_sending')}
            isSending={state === 'sending' || imageUploading}
            validationMessage={state === 'error' ? message : ''}
            childrenBefore={(
              <div className="mb-6 grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#55524c]">{t('reference_submit_customer')}</label>
                  <input
                    value={form.kundenname}
                    onChange={(event) => handleFieldChange('kundenname', event.target.value)}
                    required
                    maxLength={120}
                    className="w-full rounded-lg border border-[#dfd9cf] px-3 py-2.5 text-sm focus:outline-none focus:border-[#b08a57]"
                    placeholder={t('reference_submit_customer_placeholder')}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#55524c]">{t('reference_submit_model')}</label>
                  <select
                    value={form.modell}
                    onChange={(event) => handleFieldChange('modell', event.target.value)}
                    className="w-full rounded-lg border border-[#dfd9cf] bg-white px-3 py-2.5 text-sm focus:outline-none focus:border-[#b08a57]"
                  >
                    {MODEL_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {t(option.labelKey)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#55524c]">{t('reference_submit_year')}</label>
                  <input
                    type="number"
                    min="1990"
                    max={new Date().getFullYear()}
                    value={form.jahr}
                    onChange={(event) => handleFieldChange('jahr', Number(event.target.value))}
                    required
                    className="w-full rounded-lg border border-[#dfd9cf] px-3 py-2.5 text-sm focus:outline-none focus:border-[#b08a57]"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#55524c]">{t('reference_submit_email')}</label>
                  <input
                    type="email"
                    value={form.kontaktEmail}
                    onChange={(event) => handleFieldChange('kontaktEmail', event.target.value)}
                    required
                    maxLength={160}
                    className="w-full rounded-lg border border-[#dfd9cf] px-3 py-2.5 text-sm focus:outline-none focus:border-[#b08a57]"
                    placeholder="name@example.com"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#55524c]">{t('reference_submit_phone')}</label>
                  <input
                    value={form.kontaktTelefon}
                    onChange={(event) => handleFieldChange('kontaktTelefon', event.target.value)}
                    maxLength={60}
                    className="w-full rounded-lg border border-[#dfd9cf] px-3 py-2.5 text-sm focus:outline-none focus:border-[#b08a57]"
                    placeholder="+43 ..."
                  />
                </div>
                <div>
                  <ImageUploadField
                    label={t('reference_submit_image')}
                    value={form.bildUrl}
                    onChange={(url) => handleFieldChange('bildUrl', url)}
                    folder="references"
                    previewAlt={form.kundenname}
                    onUploadStateChange={setImageUploading}
                  />
                </div>
              </div>
            )}
            childrenAfter={(
              <>
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="reference-company-website">Website</label>
                  <input
                    id="reference-company-website"
                    name="companyWebsite"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={companyWebsite}
                    onChange={(event) => setCompanyWebsite(event.target.value)}
                  />
                </div>

                <p className="mt-4 text-sm text-[#77756f]">
                  {t('reference_privacy_notice')}{' '}
                  <a href="/datenschutz" className="font-medium text-[#9a7445] underline underline-offset-4">
                    {t('footer_privacy')}
                  </a>
                </p>

                {state === 'success' && message && (
                  <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                    {message}
                  </div>
                )}
              </>
            )}
          />
        </motion.div>
      )}
    </div>
  );
}
