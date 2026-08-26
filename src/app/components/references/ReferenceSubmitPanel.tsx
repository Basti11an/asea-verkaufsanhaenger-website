import { useState, type FormEvent } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { useAdminData } from '../../context/AdminDataContext';
import { useLanguage, type TranslationKey } from '../../context/LanguageContext';

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
  beschreibung: '',
  bildUrl: '',
  kontaktEmail: '',
  kontaktTelefon: '',
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

  const panelTitle = title ?? t(titleKey);
  const panelDescription = description ?? t(descriptionKey);
  const panelButtonLabel = buttonLabel ?? t(buttonLabelKey);

  const handleFieldChange = (field: keyof typeof form, value: string | number) => {
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
        <motion.form
          onSubmit={handleSubmit}
          className="border-t border-[#dfd9cf] p-6 md:p-8"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#55524c] mb-1.5">{t('reference_submit_customer')}</label>
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
              <label className="block text-sm font-medium text-[#55524c] mb-1.5">{t('reference_submit_location')}</label>
              <input
                value={form.ort}
                onChange={(event) => handleFieldChange('ort', event.target.value)}
                required
                maxLength={120}
                className="w-full rounded-lg border border-[#dfd9cf] px-3 py-2.5 text-sm focus:outline-none focus:border-[#b08a57]"
                placeholder={t('reference_submit_location_placeholder')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#55524c] mb-1.5">{t('reference_submit_model')}</label>
              <select
                value={form.modell}
                onChange={(event) => handleFieldChange('modell', event.target.value)}
                className="w-full rounded-lg border border-[#dfd9cf] px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-[#b08a57]"
              >
                {MODEL_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {t(option.labelKey)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#55524c] mb-1.5">{t('reference_submit_year')}</label>
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
              <label className="block text-sm font-medium text-[#55524c] mb-1.5">{t('reference_submit_email')}</label>
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
              <label className="block text-sm font-medium text-[#55524c] mb-1.5">{t('reference_submit_phone')}</label>
              <input
                value={form.kontaktTelefon}
                onChange={(event) => handleFieldChange('kontaktTelefon', event.target.value)}
                maxLength={60}
                className="w-full rounded-lg border border-[#dfd9cf] px-3 py-2.5 text-sm focus:outline-none focus:border-[#b08a57]"
                placeholder="+43 ..."
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#55524c] mb-1.5">{t('reference_submit_image')}</label>
              <input
                type="url"
                value={form.bildUrl}
                onChange={(event) => handleFieldChange('bildUrl', event.target.value)}
                maxLength={600}
                className="w-full rounded-lg border border-[#dfd9cf] px-3 py-2.5 text-sm focus:outline-none focus:border-[#b08a57]"
                placeholder="https://..."
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#55524c] mb-1.5">{t('reference_submit_description')}</label>
              <textarea
                value={form.beschreibung}
                onChange={(event) => handleFieldChange('beschreibung', event.target.value)}
                required
                maxLength={1600}
                rows={4}
                className="w-full rounded-lg border border-[#dfd9cf] px-3 py-2.5 text-sm focus:outline-none focus:border-[#b08a57] resize-none"
                placeholder={t('reference_submit_description_placeholder')}
              />
            </div>
          </div>

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

          {message && (
            <div className={`mt-4 rounded-lg px-4 py-3 text-sm ${
              state === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message}
            </div>
          )}

          <Button
            type="submit"
            disabled={state === 'sending'}
            className="mt-5 w-full sm:w-auto bg-[#2f2f2d] hover:bg-[#1c1c1a] text-white px-8"
          >
            {state === 'sending' ? t('reference_submit_sending') : t('reference_submit_button')}
          </Button>
        </motion.form>
      )}
    </div>
  );
}
