import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { CalendarDays, CheckCircle2, Edit3, Mail, Plus, Search, ShieldCheck, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { type Customer, useAdminData } from '../../context/AdminDataContext';
import {
  REMINDER_LABELS,
  getCustomerStopReason,
  getNextReminder,
  hasAllowedFollowupPermission,
  normalizeEmail,
  type CustomerReviewSource,
  type CustomerReviewStatus,
  type FollowUpPermissionStatus,
  type MailStatus,
  type ReminderStage,
  type StopReason,
} from '../../lib/customerFollowup';
import type { CustomerInput, CustomerUpdateInput } from '../../lib/customersRepository';
import type { Lang } from '../../context/LanguageContext';

type CustomerFilter =
  | 'all'
  | 'reviewed'
  | 'not_reviewed'
  | 'follow_up_active'
  | 'follow_up_disabled'
  | 'opted_out'
  | 'missing_permission'
  | 'due_two_month'
  | 'due_six_month'
  | 'due_twelve_month';

interface CustomerFormState {
  name: string;
  email: string;
  purchaseDate: string;
  purchasedItem: string;
  notes: string;
  preferredLanguage: Lang;
  followUpEnabled: boolean;
  followUpPermissionStatus: FollowUpPermissionStatus;
  followUpPermissionSource: string;
  followUpPermissionTextVersion: string;
  followUpPermissionInformation: string;
  reviewStatus: CustomerReviewStatus;
  manualReviewSource: CustomerReviewSource;
}

const TODAY = new Date().toISOString().slice(0, 10);

const EMPTY_FORM: CustomerFormState = {
  name: '',
  email: '',
  purchaseDate: TODAY,
  purchasedItem: '',
  notes: '',
  preferredLanguage: 'de',
  followUpEnabled: true,
  followUpPermissionStatus: 'unknown',
  followUpPermissionSource: '',
  followUpPermissionTextVersion: 'kunden-followup-v1',
  followUpPermissionInformation:
    'Kunde wurde über Zweck, freiwillige Bewertung, Widerruf und Abmeldelink informiert.',
  reviewStatus: 'none',
  manualReviewSource: 'other',
};

const FILTERS: { id: CustomerFilter; label: string }[] = [
  { id: 'all', label: 'Alle' },
  { id: 'reviewed', label: 'Bewertung vorhanden' },
  { id: 'not_reviewed', label: 'Noch keine Bewertung' },
  { id: 'follow_up_active', label: 'Follow-up aktiv' },
  { id: 'follow_up_disabled', label: 'Follow-up deaktiviert' },
  { id: 'opted_out', label: 'Widersprochen' },
  { id: 'missing_permission', label: 'Berechtigung fehlt' },
  { id: 'due_two_month', label: '2-Monats-Mail fällig' },
  { id: 'due_six_month', label: '6-Monats-Mail fällig' },
  { id: 'due_twelve_month', label: '12-Monats-Mail fällig' },
];

const PERMISSION_OPTIONS: { value: FollowUpPermissionStatus; label: string; hint: string }[] = [
  {
    value: 'unknown',
    label: 'Unklar - keine Mails',
    hint: 'Sicherer Standard. Automatische Bewertungsmails bleiben blockiert.',
  },
  {
    value: 'consented',
    label: 'Einwilligung dokumentiert',
    hint: 'Nur verwenden, wenn eine bewusste Einwilligung vorliegt.',
  },
  {
    value: 'existing_customer_permitted',
    label: 'Bestandskunde zulässig dokumentiert',
    hint: 'Nur verwenden, wenn der Betreiber die Zulässigkeit geprüft und dokumentiert hat.',
  },
  {
    value: 'revoked',
    label: 'Widerrufen',
    hint: 'Kunde möchte keine weiteren Bewertungsanfragen erhalten.',
  },
  {
    value: 'blocked',
    label: 'Gesperrt',
    hint: 'Keine automatischen Mails, unabhängig vom Zeitplan.',
  },
];

const REVIEW_SOURCE_OPTIONS: { value: CustomerReviewSource; label: string }[] = [
  { value: 'asea_website', label: 'ASEA Website' },
  { value: 'google', label: 'Google' },
  { value: 'personal', label: 'Persönlich' },
  { value: 'phone', label: 'Telefonisch' },
  { value: 'other', label: 'Sonstige' },
];

function formatDate(value?: string | null) {
  if (!value) return 'Kein Datum';

  try {
    return new Intl.DateTimeFormat('de-AT').format(new Date(value));
  } catch {
    return value;
  }
}

function formatDateTime(value?: string | null) {
  if (!value) return 'Nicht gesendet';

  try {
    return new Intl.DateTimeFormat('de-AT', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function mailStatusLabel(status: MailStatus, sentAt?: string | null) {
  if (sentAt || status === 'sent') return `Gesendet: ${formatDate(sentAt)}`;
  if (status === 'processing') return 'In Bearbeitung';
  if (status === 'failed') return 'Fehlgeschlagen';
  if (status === 'skipped') return 'Übersprungen';
  return 'Noch nicht gesendet';
}

function stopReasonLabel(reason: StopReason | null) {
  if (!reason) return 'Aktiv';

  const labels: Record<StopReason, string> = {
    deleted: 'Gelöscht',
    opted_out: 'Kunde hat widersprochen',
    review_found: 'Bewertung automatisch gefunden',
    manual_review: 'Bewertung manuell bestätigt',
    follow_up_disabled: 'Manuell deaktiviert',
    permission_missing: 'Versandberechtigung fehlt',
    completed: '12-Monats-Mail erledigt',
  };

  return labels[reason];
}

function permissionLabel(status: FollowUpPermissionStatus) {
  return PERMISSION_OPTIONS.find((option) => option.value === status)?.label ?? status;
}

function reviewLabel(customer: Customer) {
  if (customer.reviewStatus === 'auto_matched' || customer.reviewFoundAt) {
    return `Vorhanden ✓${customer.reviewFoundAt ? ` seit ${formatDate(customer.reviewFoundAt)}` : ''}`;
  }

  if (customer.reviewStatus === 'manual_confirmed' || customer.manualReviewConfirmedAt) {
    const source = REVIEW_SOURCE_OPTIONS.find((option) => option.value === customer.manualReviewSource)?.label;
    return `Manuell bestätigt ✓${source ? ` (${source})` : ''}`;
  }

  return 'Noch keine Bewertung';
}

function getMailStatus(customer: Customer, stage: ReminderStage) {
  if (stage === 'two_month') {
    return mailStatusLabel(customer.twoMonthEmailStatus, customer.twoMonthEmailSentAt);
  }

  if (stage === 'six_month') {
    return mailStatusLabel(customer.sixMonthEmailStatus, customer.sixMonthEmailSentAt);
  }

  return mailStatusLabel(customer.twelveMonthEmailStatus, customer.twelveMonthEmailSentAt);
}

function toFormState(customer: Customer): CustomerFormState {
  return {
    name: customer.name,
    email: customer.email,
    purchaseDate: customer.purchaseDate,
    purchasedItem: customer.purchasedItem,
    notes: customer.notes,
    preferredLanguage: customer.preferredLanguage,
    followUpEnabled: customer.followUpEnabled,
    followUpPermissionStatus: customer.followUpPermissionStatus,
    followUpPermissionSource: customer.followUpPermissionSource,
    followUpPermissionTextVersion: customer.followUpPermissionTextVersion || 'kunden-followup-v1',
    followUpPermissionInformation:
      customer.followUpPermissionInformation || EMPTY_FORM.followUpPermissionInformation,
    reviewStatus: customer.reviewStatus,
    manualReviewSource: customer.manualReviewSource ?? 'other',
  };
}

function hasReview(customer: Customer) {
  return customer.reviewStatus !== 'none' || Boolean(customer.reviewFoundAt) || Boolean(customer.manualReviewConfirmedAt);
}

function isDueFilter(customer: Customer, stage: ReminderStage) {
  const nextReminder = getNextReminder(customer, TODAY);
  return Boolean(nextReminder && nextReminder.stage === stage && nextReminder.isDue);
}

function customerMatchesFilter(customer: Customer, filter: CustomerFilter) {
  const stopReason = getCustomerStopReason(customer);

  if (filter === 'all') return true;
  if (filter === 'reviewed') return hasReview(customer);
  if (filter === 'not_reviewed') return !hasReview(customer);
  if (filter === 'follow_up_active') return !stopReason;
  if (filter === 'follow_up_disabled') return stopReason === 'follow_up_disabled';
  if (filter === 'opted_out') return stopReason === 'opted_out';
  if (filter === 'missing_permission') return !hasAllowedFollowupPermission(customer.followUpPermissionStatus);
  if (filter === 'due_two_month') return isDueFilter(customer, 'two_month');
  if (filter === 'due_six_month') return isDueFilter(customer, 'six_month');
  if (filter === 'due_twelve_month') return isDueFilter(customer, 'twelve_month');
  return true;
}

function validateForm(form: CustomerFormState) {
  if (form.name.trim().length < 2) return 'Bitte einen Kundennamen eintragen.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) return 'Bitte eine gültige E-Mail-Adresse eintragen.';
  if (!form.purchaseDate || form.purchaseDate > TODAY) return 'Bitte ein sinnvolles Kaufdatum eintragen.';
  if (form.purchasedItem.trim().length < 2) return 'Bitte den gekauften Anhänger oder das Modell eintragen.';
  if (
    hasAllowedFollowupPermission(form.followUpPermissionStatus) &&
    (!form.followUpPermissionSource.trim() || !form.followUpPermissionTextVersion.trim())
  ) {
    return 'Bitte Quelle und Textversion der Versandberechtigung dokumentieren.';
  }

  return '';
}

function buildPayload(form: CustomerFormState, existing?: Customer | null): CustomerInput | CustomerUpdateInput {
  const permissionIsAllowed = hasAllowedFollowupPermission(form.followUpPermissionStatus);
  const permissionCapturedAt = permissionIsAllowed
    ? existing?.followUpPermissionCapturedAt ?? new Date().toISOString()
    : null;

  const payload: CustomerUpdateInput = {
    name: form.name,
    email: form.email,
    purchaseDate: form.purchaseDate,
    purchasedItem: form.purchasedItem,
    notes: form.notes,
    preferredLanguage: form.preferredLanguage,
    followUpEnabled: form.followUpEnabled,
    followUpPermissionStatus: form.followUpPermissionStatus,
    followUpPermissionCapturedAt: permissionCapturedAt,
    followUpPermissionSource: permissionIsAllowed ? form.followUpPermissionSource : '',
    followUpPermissionTextVersion: permissionIsAllowed ? form.followUpPermissionTextVersion : '',
    followUpPermissionInformation: permissionIsAllowed ? form.followUpPermissionInformation : '',
  };

  if (existing) {
    payload.reviewStatus = form.reviewStatus;
    payload.manualReviewSource = form.reviewStatus === 'manual_confirmed' ? form.manualReviewSource : null;
    payload.manualReviewConfirmedAt =
      form.reviewStatus === 'manual_confirmed'
        ? existing.manualReviewConfirmedAt ?? new Date().toISOString()
        : null;
  }

  return payload;
}

export function KundenTab() {
  const {
    customers,
    customersLoading,
    customersError,
    reloadCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
  } = useAdminData();

  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<CustomerFilter>('all');
  const [formOpen, setFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [form, setForm] = useState<CustomerFormState>(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [duplicateCustomer, setDuplicateCustomer] = useState<Customer | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Customer | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void reloadCustomers();
  }, [reloadCustomers]);

  const filteredCustomers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return customers
      .filter((customer) => {
        if (!normalizedQuery) return true;
        return [
          customer.name,
          customer.email,
          customer.purchasedItem,
        ].some((value) => value.toLowerCase().includes(normalizedQuery));
      })
      .filter((customer) => customerMatchesFilter(customer, filter));
  }, [customers, filter, query]);

  const openCreateDialog = () => {
    setEditingCustomer(null);
    setForm({ ...EMPTY_FORM, purchaseDate: TODAY });
    setFormError('');
    setDuplicateCustomer(null);
    setFormOpen(true);
  };

  const openEditDialog = (customer: Customer) => {
    setEditingCustomer(customer);
    setForm(toFormState(customer));
    setFormError('');
    setDuplicateCustomer(null);
    setFormOpen(true);
  };

  const handleFormChange = <K extends keyof CustomerFormState>(field: K, value: CustomerFormState[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFormError('');
    setDuplicateCustomer(null);
  };

  const handleSave = async () => {
    const validationMessage = validateForm(form);
    if (validationMessage) {
      setFormError(validationMessage);
      return;
    }

    const duplicate = customers.find(
      (customer) =>
        normalizeEmail(customer.email) === normalizeEmail(form.email) &&
        customer.id !== editingCustomer?.id,
    );

    if (duplicate) {
      setDuplicateCustomer(duplicate);
      setFormError('Zu dieser E-Mail gibt es bereits einen Kunden.');
      return;
    }

    setSaving(true);

    try {
      if (editingCustomer) {
        await updateCustomer(editingCustomer.id, buildPayload(form, editingCustomer));
        toast.success('Kunde wurde gespeichert');
      } else {
        await createCustomer(buildPayload(form) as CustomerInput);
        toast.success('Kunde wurde angelegt');
      }

      setFormOpen(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Kunde konnte nicht gespeichert werden';
      setFormError(message);
    } finally {
      setSaving(false);
    }
  };

  const confirmManualReview = async (customer: Customer) => {
    setSaving(true);

    try {
      await updateCustomer(customer.id, {
        reviewStatus: 'manual_confirmed',
        manualReviewSource: 'other',
        manualReviewConfirmedAt: customer.manualReviewConfirmedAt ?? new Date().toISOString(),
      });
      toast.success('Kunde als bewertet markiert');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Bewertung konnte nicht bestätigt werden';
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const toggleFollowup = async (customer: Customer) => {
    setSaving(true);

    try {
      await updateCustomer(customer.id, {
        followUpEnabled: !customer.followUpEnabled,
      });
      toast.success(customer.followUpEnabled ? 'Follow-up deaktiviert' : 'Follow-up aktiviert');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Follow-up konnte nicht geändert werden';
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const removeCustomer = async () => {
    if (!deleteTarget) return;

    setSaving(true);

    try {
      await deleteCustomer(deleteTarget.id);
      toast.success('Kunde wurde gelöscht');
      setDeleteTarget(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Kunde konnte nicht gelöscht werden';
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const renderNextAction = (customer: Customer) => {
    const stopReason = getCustomerStopReason(customer);
    if (stopReason) return stopReasonLabel(stopReason);

    const nextReminder = getNextReminder(customer, TODAY);
    if (!nextReminder) return 'Keine weitere Mail geplant';

    return `${REMINDER_LABELS[nextReminder.stage]} ${nextReminder.isDue ? 'fällig seit' : 'geplant für'} ${formatDate(nextReminder.dueDate)}`;
  };

  const renderStatusBadges = (customer: Customer) => {
    const stopReason = getCustomerStopReason(customer);
    const reviewText = reviewLabel(customer);

    return (
      <div className="flex flex-wrap gap-2">
        <span className={`rounded-full border px-2.5 py-1 text-xs ${
          hasReview(customer)
            ? 'border-emerald-100 bg-emerald-50 text-emerald-700'
            : 'border-gray-200 bg-gray-100 text-gray-600'
        }`}>
          {reviewText}
        </span>
        <span className={`rounded-full border px-2.5 py-1 text-xs ${
          stopReason
            ? 'border-amber-100 bg-amber-50 text-amber-700'
            : 'border-[#b08a57]/20 bg-[#b08a57]/10 text-[#9a7445]'
        }`}>
          Follow-up: {stopReasonLabel(stopReason)}
        </span>
      </div>
    );
  };

  const renderCustomerCard = (customer: Customer) => (
    <article key={customer.id} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-semibold text-[#2f2f2d] break-words">{customer.name}</h3>
          <p className="mt-1 text-sm text-[#77756f] break-all">{customer.email}</p>
        </div>
        <Button size="sm" variant="outline" onClick={() => openEditDialog(customer)} className="shrink-0">
          <Edit3 size={14} />
        </Button>
      </div>

      <div className="mt-4 grid gap-2 text-sm text-[#55524c]">
        <p><strong>Anhänger:</strong> {customer.purchasedItem}</p>
        <p><strong>Kaufdatum:</strong> {formatDate(customer.purchaseDate)}</p>
        <p><strong>Nächste Aktion:</strong> {renderNextAction(customer)}</p>
        <p><strong>Berechtigung:</strong> {permissionLabel(customer.followUpPermissionStatus)}</p>
      </div>

      <div className="mt-4">{renderStatusBadges(customer)}</div>

      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        <Button size="sm" variant="outline" onClick={() => toggleFollowup(customer)} disabled={saving}>
          {customer.followUpEnabled ? 'Stoppen' : 'Aktivieren'}
        </Button>
        <Button size="sm" variant="outline" onClick={() => confirmManualReview(customer)} disabled={saving || hasReview(customer)}>
          Bewertet
        </Button>
        <Button size="sm" variant="outline" onClick={() => setDeleteTarget(customer)} className="border-red-200 text-red-700 hover:bg-red-50">
          Löschen
        </Button>
      </div>
    </article>
  );

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[#2f2f2d] flex items-center gap-2">
            <ShieldCheck size={18} className="text-[#b08a57]" />
            Kunden
            <span className="text-sm font-normal text-gray-400">({customers.length})</span>
          </h2>
          <p className="mt-1 text-sm text-[#77756f] max-w-3xl">
            Käufer verwalten, Bewertungsstatus prüfen und automatische Follow-up-Mails nur bei dokumentierter Berechtigung erlauben.
          </p>
        </div>

        <Button onClick={openCreateDialog} className="bg-[#2f2f2d] hover:bg-[#1c1c1a] text-white">
          <Plus size={16} className="mr-2" />
          Kunde hinzufügen
        </Button>
      </div>

      {customersLoading && (
        <div className="mb-4 rounded-lg border border-[#b08a57]/20 bg-[#b08a57]/10 px-4 py-3 text-sm text-[#2f2f2d]">
          Kunden werden aus Supabase geladen...
        </div>
      )}

      {customersError && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Supabase-Hinweis Kunden: {customersError}
        </div>
      )}

      <div className="mb-5 grid gap-3 lg:grid-cols-[minmax(240px,360px)_1fr]">
        <label className="relative block">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#77756f]" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Name, E-Mail oder Produkt suchen"
            className="pl-9"
          />
        </label>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {FILTERS.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setFilter(option.id)}
              className={`shrink-0 rounded-full border px-3 py-2 text-xs font-medium transition-colors ${
                filter === option.id
                  ? 'border-[#b08a57] bg-[#b08a57]/15 text-[#2f2f2d]'
                  : 'border-gray-200 bg-white text-[#77756f] hover:border-[#b08a57]/40'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {filteredCustomers.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <Mail size={32} className="mx-auto mb-3 text-[#b08a57]/70" />
          <h3 className="font-semibold text-[#2f2f2d]">Keine passenden Kunden</h3>
          <p className="mt-1 text-sm text-[#77756f]">
            Lege nach einem tatsächlichen Verkauf einen Kunden an oder ändere Suche und Filter.
          </p>
        </div>
      ) : (
        <>
          <div className="hidden xl:block overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/80">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Kunde</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Kauf</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Bewertung / Follow-up</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Nächste Aktion</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Berechtigung</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Aktionen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="align-top hover:bg-[#f8f7f3]">
                      <td className="px-4 py-4">
                        <p className="font-semibold text-[#2f2f2d]">{customer.name}</p>
                        <p className="mt-1 text-xs text-[#77756f] break-all">{customer.email}</p>
                      </td>
                      <td className="px-4 py-4 text-[#55524c]">
                        <p>{customer.purchasedItem}</p>
                        <p className="mt-1 inline-flex items-center gap-1 text-xs text-[#77756f]">
                          <CalendarDays size={12} />
                          {formatDate(customer.purchaseDate)}
                        </p>
                      </td>
                      <td className="px-4 py-4">{renderStatusBadges(customer)}</td>
                      <td className="px-4 py-4 text-[#55524c] max-w-[230px]">{renderNextAction(customer)}</td>
                      <td className="px-4 py-4 text-[#55524c] max-w-[220px]">{permissionLabel(customer.followUpPermissionStatus)}</td>
                      <td className="px-4 py-4">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="outline" onClick={() => openEditDialog(customer)}>
                            <Edit3 size={14} />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => toggleFollowup(customer)} disabled={saving}>
                            {customer.followUpEnabled ? 'Stoppen' : 'Aktivieren'}
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => confirmManualReview(customer)} disabled={saving || hasReview(customer)}>
                            <CheckCircle2 size={14} />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setDeleteTarget(customer)} className="border-red-200 text-red-700 hover:bg-red-50">
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid gap-4 xl:hidden">
            {filteredCustomers.map(renderCustomerCard)}
          </div>
        </>
      )}

      <Dialog open={formOpen} onOpenChange={(open) => !open && setFormOpen(false)}>
        <DialogContent className="w-[calc(100vw-2rem)] max-w-3xl max-h-[calc(100vh-2rem)] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingCustomer ? 'Kunde bearbeiten' : 'Kunde hinzufügen'}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="customer-name">Name *</Label>
              <Input
                id="customer-name"
                value={form.name}
                onChange={(event) => handleFormChange('name', event.target.value)}
                maxLength={160}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="customer-email">E-Mail *</Label>
              <Input
                id="customer-email"
                type="email"
                value={form.email}
                onChange={(event) => handleFormChange('email', event.target.value)}
                maxLength={160}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="customer-purchase-date">Kaufdatum *</Label>
              <Input
                id="customer-purchase-date"
                type="date"
                max={TODAY}
                value={form.purchaseDate}
                onChange={(event) => handleFormChange('purchaseDate', event.target.value)}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="customer-item">Gekaufter Anhänger / Modell *</Label>
              <Input
                id="customer-item"
                value={form.purchasedItem}
                onChange={(event) => handleFormChange('purchasedItem', event.target.value)}
                maxLength={180}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="customer-language">E-Mail-Sprache</Label>
              <select
                id="customer-language"
                value={form.preferredLanguage}
                onChange={(event) => handleFormChange('preferredLanguage', event.target.value as Lang)}
                className="mt-2 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:border-[#b08a57]"
              >
                <option value="de">Deutsch</option>
                <option value="en">Englisch</option>
                <option value="sk">Slowakisch</option>
              </select>
            </div>
            <div>
              <Label htmlFor="customer-permission">Versandberechtigung *</Label>
              <select
                id="customer-permission"
                value={form.followUpPermissionStatus}
                onChange={(event) => handleFormChange('followUpPermissionStatus', event.target.value as FollowUpPermissionStatus)}
                className="mt-2 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:border-[#b08a57]"
              >
                {PERMISSION_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <p className="mt-1 text-xs text-[#77756f]">
                {PERMISSION_OPTIONS.find((option) => option.value === form.followUpPermissionStatus)?.hint}
              </p>
            </div>

            {hasAllowedFollowupPermission(form.followUpPermissionStatus) && (
              <>
                <div>
                  <Label htmlFor="customer-permission-source">Quelle der Berechtigung *</Label>
                  <Input
                    id="customer-permission-source"
                    value={form.followUpPermissionSource}
                    onChange={(event) => handleFormChange('followUpPermissionSource', event.target.value)}
                    maxLength={160}
                    className="mt-2"
                    placeholder="z. B. Kaufvertrag, separates Formular, E-Mail"
                  />
                </div>
                <div>
                  <Label htmlFor="customer-permission-version">Textversion *</Label>
                  <Input
                    id="customer-permission-version"
                    value={form.followUpPermissionTextVersion}
                    onChange={(event) => handleFormChange('followUpPermissionTextVersion', event.target.value)}
                    maxLength={80}
                    className="mt-2"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="customer-permission-info">Dokumentierte Information</Label>
                  <Textarea
                    id="customer-permission-info"
                    value={form.followUpPermissionInformation}
                    onChange={(event) => handleFormChange('followUpPermissionInformation', event.target.value)}
                    maxLength={1000}
                    className="mt-2 min-h-[80px]"
                  />
                </div>
              </>
            )}

            <label className="md:col-span-2 flex items-start gap-3 rounded-lg border border-[#dfd9cf] bg-[#f8f7f3] p-4">
              <input
                type="checkbox"
                checked={form.followUpEnabled}
                onChange={(event) => handleFormChange('followUpEnabled', event.target.checked)}
                className="mt-1 h-4 w-4 accent-[#9a7445]"
              />
              <span>
                <span className="block text-sm font-semibold text-[#2f2f2d]">Automatische Follow-up-Mails aktiv</span>
                <span className="block text-sm text-[#77756f]">
                  Es wird trotzdem nur gesendet, wenn keine Bewertung vorliegt, kein Widerspruch besteht und die Versandberechtigung erlaubt ist.
                </span>
              </span>
            </label>

            {editingCustomer && (
              <>
                <div>
                  <Label htmlFor="customer-review-status">Bewertungsstatus</Label>
                  <select
                    id="customer-review-status"
                    value={form.reviewStatus}
                    onChange={(event) => handleFormChange('reviewStatus', event.target.value as CustomerReviewStatus)}
                    className="mt-2 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:border-[#b08a57]"
                  >
                    <option value="none">Noch keine Bewertung</option>
                    <option value="manual_confirmed">Manuell als bewertet markieren</option>
                  </select>
                </div>
                {form.reviewStatus === 'manual_confirmed' && (
                  <div>
                    <Label htmlFor="customer-review-source">Quelle der Bewertung</Label>
                    <select
                      id="customer-review-source"
                      value={form.manualReviewSource}
                      onChange={(event) => handleFormChange('manualReviewSource', event.target.value as CustomerReviewSource)}
                      className="mt-2 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:border-[#b08a57]"
                    >
                      {REVIEW_SOURCE_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                )}
              </>
            )}

            <div className="md:col-span-2">
              <Label htmlFor="customer-notes">Interne Notiz</Label>
              <Textarea
                id="customer-notes"
                value={form.notes}
                onChange={(event) => handleFormChange('notes', event.target.value)}
                maxLength={3000}
                className="mt-2 min-h-[90px]"
              />
            </div>
          </div>

          {editingCustomer && (
            <div className="rounded-xl border border-gray-200 bg-white p-4 text-sm text-[#55524c]">
              <p className="font-semibold text-[#2f2f2d] mb-2">Reminder-Status</p>
              <div className="grid gap-2 md:grid-cols-3">
                {(['two_month', 'six_month', 'twelve_month'] as ReminderStage[]).map((stage) => (
                  <p key={stage}>
                    <span className="block text-xs uppercase tracking-wide text-gray-400">{REMINDER_LABELS[stage]}</span>
                    {getMailStatus(editingCustomer, stage)}
                  </p>
                ))}
              </div>
            </div>
          )}

          {formError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {formError}
              {duplicateCustomer && (
                <div className="mt-2 rounded-md bg-white/70 p-3 text-[#2f2f2d]">
                  <p className="font-semibold">{duplicateCustomer.name}</p>
                  <p className="text-xs break-all">{duplicateCustomer.email}</p>
                  <Button size="sm" variant="outline" className="mt-2" onClick={() => openEditDialog(duplicateCustomer)}>
                    Vorhandenen Kunden öffnen
                  </Button>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setFormOpen(false)}>Abbrechen</Button>
            <Button onClick={handleSave} disabled={saving} className="bg-[#2f2f2d] hover:bg-[#1c1c1a] text-white">
              {saving ? 'Wird gespeichert...' : 'Speichern'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent className="w-[calc(100vw-2rem)] max-w-sm">
          <DialogHeader>
            <DialogTitle>Kunde löschen?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-[#77756f]">
            Dieser Eintrag wird aus dem Bewertungs-/Follow-up-System entfernt. Gesetzliche Aufbewahrungspflichten außerhalb dieses Systems werden dadurch nicht beurteilt.
          </p>
          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => setDeleteTarget(null)}>Abbrechen</Button>
            <Button
              size="sm"
              disabled={saving}
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={removeCustomer}
            >
              Löschen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
