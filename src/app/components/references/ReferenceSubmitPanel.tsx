import { useState, type FormEvent } from 'react';
import { ChevronDown, ImageIcon, Send } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { useAdminData } from '../../context/AdminDataContext';

interface ReferenceSubmitPanelProps {
  className?: string;
  title?: string;
  description?: string;
  buttonLabel?: string;
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

export function ReferenceSubmitPanel({
  className = '',
  title = 'Eigene Erfahrung einreichen',
  description = 'Teilen Sie Ihre Erfahrung mit ASEA. Nach einer kurzen Prüfung wird Ihre Bewertung veröffentlicht.',
  buttonLabel = 'Erfahrung einreichen',
}: ReferenceSubmitPanelProps) {
  const { submitReference } = useAdminData();
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);
  const [state, setState] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleFieldChange = (field: keyof typeof form, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setState('idle');
    setMessage('');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setState('sending');
    setMessage('');

    try {
      await submitReference(form);
      setForm({ ...INITIAL_FORM, jahr: new Date().getFullYear() });
      setState('success');
      setMessage('Vielen Dank. Ihre Erfahrung wurde eingereicht und wird nach Prüfung veröffentlicht.');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Die Erfahrung konnte nicht eingereicht werden.';
      setState('error');
      setMessage(errorMessage);
    }
  };

  return (
    <div className={`bg-white rounded-2xl border border-[#b08a57]/20 shadow-xl overflow-hidden ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="w-full p-5 md:p-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-left hover:bg-[#f8f7f3] transition-colors"
      >
        <span className="flex items-start gap-4">
          <span className="w-11 h-11 rounded-xl bg-[#b08a57] text-white flex items-center justify-center shrink-0">
            <ImageIcon size={22} />
          </span>
          <span>
            <span className="block text-xl md:text-2xl font-bold text-[#2f2f2d]">{title}</span>
            <span className="block text-sm md:text-base text-[#77756f] mt-1 max-w-2xl">{description}</span>
          </span>
        </span>
        <span className="inline-flex items-center justify-center gap-2 bg-[#2f2f2d] text-white rounded-lg px-4 py-2.5 text-sm font-medium shrink-0">
          {buttonLabel}
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
              <label className="block text-sm font-medium text-[#55524c] mb-1.5">Kundenname</label>
              <input
                value={form.kundenname}
                onChange={(event) => handleFieldChange('kundenname', event.target.value)}
                required
                className="w-full rounded-lg border border-[#dfd9cf] px-3 py-2.5 text-sm focus:outline-none focus:border-[#b08a57]"
                placeholder="z.B. Café Moser"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#55524c] mb-1.5">Ort</label>
              <input
                value={form.ort}
                onChange={(event) => handleFieldChange('ort', event.target.value)}
                required
                className="w-full rounded-lg border border-[#dfd9cf] px-3 py-2.5 text-sm focus:outline-none focus:border-[#b08a57]"
                placeholder="z.B. Salzburg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#55524c] mb-1.5">Modell</label>
              <select
                value={form.modell}
                onChange={(event) => handleFieldChange('modell', event.target.value)}
                className="w-full rounded-lg border border-[#dfd9cf] px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-[#b08a57]"
              >
                <option>Verkaufsanhänger</option>
                <option>Kühlanhänger</option>
                <option>Messe- und Präsentationsanhänger</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#55524c] mb-1.5">Jahr</label>
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
              <label className="block text-sm font-medium text-[#55524c] mb-1.5">E-Mail für Rückfragen</label>
              <input
                type="email"
                value={form.kontaktEmail}
                onChange={(event) => handleFieldChange('kontaktEmail', event.target.value)}
                required
                className="w-full rounded-lg border border-[#dfd9cf] px-3 py-2.5 text-sm focus:outline-none focus:border-[#b08a57]"
                placeholder="name@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#55524c] mb-1.5">Telefon optional</label>
              <input
                value={form.kontaktTelefon}
                onChange={(event) => handleFieldChange('kontaktTelefon', event.target.value)}
                className="w-full rounded-lg border border-[#dfd9cf] px-3 py-2.5 text-sm focus:outline-none focus:border-[#b08a57]"
                placeholder="+43 ..."
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#55524c] mb-1.5">Bild-Link optional</label>
              <input
                type="url"
                value={form.bildUrl}
                onChange={(event) => handleFieldChange('bildUrl', event.target.value)}
                className="w-full rounded-lg border border-[#dfd9cf] px-3 py-2.5 text-sm focus:outline-none focus:border-[#b08a57]"
                placeholder="https://..."
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#55524c] mb-1.5">Beschreibung</label>
              <textarea
                value={form.beschreibung}
                onChange={(event) => handleFieldChange('beschreibung', event.target.value)}
                required
                rows={4}
                className="w-full rounded-lg border border-[#dfd9cf] px-3 py-2.5 text-sm focus:outline-none focus:border-[#b08a57] resize-none"
                placeholder="Erzählen Sie kurz, wie Sie Ihren Anhänger einsetzen."
              />
            </div>
          </div>

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
            <Send size={16} className="mr-2" />
            {state === 'sending' ? 'Wird gesendet...' : 'Erfahrung einreichen'}
          </Button>
        </motion.form>
      )}
    </div>
  );
}
