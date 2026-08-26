import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import {
  Archive,
  CalendarDays,
  Check,
  CheckCircle2,
  ImageIcon,
  Inbox,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Trash2,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { AdminReference, ContactRequest, useAdminData } from '../../context/AdminDataContext';

function formatDateTime(value: string) {
  if (!value) return 'Kein Datum';

  try {
    return new Intl.DateTimeFormat('de-AT', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function getContactStatusLabel(request: ContactRequest) {
  if (request.status === 'answered') return 'Beantwortet';
  if (request.status === 'open') return 'Für später';
  return request.isRead ? 'Gelesen' : 'Neu';
}

function getContactStatusClass(request: ContactRequest) {
  if (request.status === 'answered') return 'bg-emerald-50 text-emerald-700 border-emerald-100';
  if (request.status === 'open') return 'bg-amber-50 text-amber-700 border-amber-100';
  if (!request.isRead) return 'bg-[#b08a57]/15 text-[#9a7445] border-[#b08a57]/20';
  return 'bg-gray-100 text-gray-600 border-gray-200';
}

function createMailReplyHref(request: ContactRequest) {
  const recipient = request.email.trim().replace(/[\r\n?]/g, '');
  const subject = request.subject.trim().toLowerCase().startsWith('re:')
    ? request.subject.trim()
    : `Re: ${request.subject.trim()}`;
  const body = [
    `Hallo ${request.name.trim()},`,
    '',
    'vielen Dank für Ihre Anfrage.',
    '',
    '',
    'Freundliche Grüße',
    'ASEA Team',
    '',
    '--- Ursprüngliche Anfrage ---',
    `Name: ${request.name}`,
    `E-Mail: ${request.email}`,
    `Telefon: ${request.phone || 'Nicht angegeben'}`,
    `Eingang: ${formatDateTime(request.createdAt)}`,
    '',
    request.message,
  ].join('\n');

  return `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function EingaengeTab() {
  const {
    references,
    referencesLoading,
    referencesError,
    contactRequests,
    contactRequestsLoading,
    contactRequestsError,
    reloadContactRequests,
    updateContactRequest,
    updateReference,
    deleteReference,
  } = useAdminData();

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminReference | null>(null);
  const [selectedContactId, setSelectedContactId] = useState<number | null>(null);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [savingContactId, setSavingContactId] = useState<number | null>(null);

  useEffect(() => {
    void reloadContactRequests();
  }, [reloadContactRequests]);

  const pendingRefs = references
    .filter((reference) => reference.status === 'pending')
    .sort((a, b) => b.id - a.id);

  const sortedContactRequests = useMemo(() => {
    const statusWeight: Record<ContactRequest['status'], number> = {
      new: 0,
      open: 1,
      answered: 2,
    };

    return [...contactRequests].sort((a, b) => {
      const unreadDifference = Number(a.isRead) - Number(b.isRead);
      if (unreadDifference !== 0) return unreadDifference;

      const statusDifference = statusWeight[a.status] - statusWeight[b.status];
      if (statusDifference !== 0) return statusDifference;

      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [contactRequests]);

  const selectedContact = selectedContactId
    ? contactRequests.find((request) => request.id === selectedContactId) ?? null
    : null;

  const openContactCount = contactRequests.filter((request) => request.status !== 'answered').length;
  const unreadContactCount = contactRequests.filter((request) => !request.isRead).length;
  const totalOpenCount = pendingRefs.length + openContactCount;

  const openContactDetails = async (request: ContactRequest) => {
    setSelectedContactId(request.id);

    if (request.isRead) return;

    try {
      await updateContactRequest(request.id, { isRead: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Eingang konnte nicht als gelesen markiert werden';
      toast.error(message);
    }
  };

  const updateContactStatus = async (request: ContactRequest, status: ContactRequest['status']) => {
    setSavingContactId(request.id);

    try {
      await updateContactRequest(request.id, {
        status,
        isRead: true,
      });
      toast.success(status === 'answered' ? 'Anfrage als beantwortet markiert' : 'Anfrage für später aufgehoben');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Status konnte nicht geändert werden';
      toast.error(message);
    } finally {
      setSavingContactId(null);
    }
  };

  const approveReference = async (reference: AdminReference) => {
    setSavingId(reference.id);

    try {
      await updateReference(reference.id, {
        status: 'approved',
        sichtbar: reference.publicConsent !== false,
      });
      toast.success(
        reference.publicConsent === false
          ? `"${reference.kundenname}" wurde intern geprüft und bleibt nicht öffentlich`
          : `"${reference.kundenname}" ist jetzt online`,
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Freigabe fehlgeschlagen';
      toast.error(message);
    } finally {
      setSavingId(null);
    }
  };

  const removeReference = async (reference: AdminReference) => {
    setSavingId(reference.id);

    try {
      await deleteReference(reference.id);
      setDeleteTarget(null);
      toast.success('Eingang wurde gelöscht');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Löschen fehlgeschlagen';
      toast.error(message);
    } finally {
      setSavingId(null);
    }
  };

  const renderContactMobileCard = (request: ContactRequest) => (
    <button
      key={request.id}
      type="button"
      onClick={() => openContactDetails(request)}
      className={`w-full text-left bg-white rounded-xl border shadow-sm p-4 transition-colors ${
        request.isRead ? 'border-gray-200 hover:border-[#b08a57]/40' : 'border-[#b08a57]/35 ring-1 ring-[#b08a57]/10'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className={`text-sm ${request.isRead ? 'font-medium' : 'font-bold'} text-[#2f2f2d] break-words`}>
            {request.name}
          </p>
          <p className="text-xs text-[#77756f] break-all">{request.email}</p>
        </div>
        <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] ${getContactStatusClass(request)}`}>
          {getContactStatusLabel(request)}
        </span>
      </div>
      <p className="mt-3 text-sm text-[#2f2f2d] break-words">{request.subject}</p>
      <p className="mt-2 text-xs text-[#77756f]">{formatDateTime(request.createdAt)}</p>
    </button>
  );

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-[#2f2f2d] flex items-center gap-2">
            <Inbox size={18} className="text-[#b08a57]" />
            Eingänge
            <span className="text-sm font-normal text-gray-400">({totalOpenCount} offen)</span>
          </h2>
          <p className="text-sm text-[#77756f]">
            Kontaktanfragen und neue Kundenreferenzen werden hier gesammelt.
          </p>
        </div>
      </div>

      {(referencesLoading || contactRequestsLoading) && (
        <div className="mb-4 rounded-lg border border-[#b08a57]/20 bg-[#b08a57]/10 px-4 py-3 text-sm text-[#2f2f2d]">
          Eingänge werden aus Supabase geladen...
        </div>
      )}

      {referencesError && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Supabase-Hinweis Referenzen: {referencesError}
        </div>
      )}

      {contactRequestsError && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Supabase-Hinweis Kontaktanfragen: {contactRequestsError}
        </div>
      )}

      <section className="mb-8">
        <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 className="text-base font-semibold text-[#2f2f2d] flex items-center gap-2">
              <MessageSquare size={17} className="text-[#b08a57]" />
              Kontaktanfragen
              <span className="text-sm font-normal text-gray-400">({contactRequests.length})</span>
            </h3>
            {unreadContactCount > 0 && (
              <p className="text-xs text-[#9a7445]">{unreadContactCount} neu oder ungelesen</p>
            )}
          </div>
        </div>

        {sortedContactRequests.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center">
            <MessageSquare size={32} className="mx-auto mb-3 text-[#b08a57]/60" />
            <h4 className="text-[#2f2f2d] font-semibold mb-1">Keine Kontaktanfragen</h4>
            <p className="text-sm text-[#77756f]">Neue Kontaktformular-Anfragen erscheinen automatisch hier.</p>
          </div>
        ) : (
          <>
            <div className="hidden lg:block bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/80">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Betreff</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">E-Mail</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-44">Eingang</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-28">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {sortedContactRequests.map((request) => (
                      <tr
                        key={request.id}
                        onClick={() => openContactDetails(request)}
                        className={`cursor-pointer transition-colors hover:bg-[#f8f7f3] ${
                          request.isRead ? '' : 'bg-[#b08a57]/5'
                        }`}
                      >
                        <td className="px-4 py-3">
                          <span className={`${request.isRead ? 'font-medium' : 'font-bold'} text-[#2f2f2d]`}>
                            {request.name}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[#55524c] max-w-xs">
                          <span className="line-clamp-1">{request.subject}</span>
                        </td>
                        <td className="px-4 py-3 text-[#77756f] break-all">{request.email}</td>
                        <td className="px-4 py-3 text-[#77756f] text-xs">{formatDateTime(request.createdAt)}</td>
                        <td className="px-4 py-3">
                          <span className={`rounded-full border px-2.5 py-1 text-[11px] ${getContactStatusClass(request)}`}>
                            {getContactStatusLabel(request)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="lg:hidden space-y-3">
              {sortedContactRequests.map(renderContactMobileCard)}
            </div>
          </>
        )}
      </section>

      <section>
        <div className="mb-3">
          <h3 className="text-base font-semibold text-[#2f2f2d] flex items-center gap-2">
            <Inbox size={17} className="text-[#b08a57]" />
            Eingereichte Kundenreferenzen
            <span className="text-sm font-normal text-gray-400">({pendingRefs.length} offen)</span>
          </h3>
          <p className="text-xs text-[#77756f]">Diese Einträge werden erst nach deiner Freigabe öffentlich angezeigt.</p>
        </div>

        {pendingRefs.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center">
            <Inbox size={32} className="mx-auto mb-3 text-[#b08a57]/60" />
            <h4 className="text-[#2f2f2d] font-semibold mb-1">Keine offenen Referenzen</h4>
            <p className="text-sm text-[#77756f]">Neue Kundeneinreichungen erscheinen automatisch hier.</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-5">
            {pendingRefs.map((reference) => (
              <div key={reference.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="grid sm:grid-cols-[180px_1fr]">
                  <div className="h-44 sm:h-full bg-[#f8f7f3]">
                    {reference.bildUrl ? (
                      <button
                        type="button"
                        onClick={() => setPreviewImage(reference.bildUrl)}
                        className="w-full h-full block group overflow-hidden"
                      >
                        <img
                          src={reference.bildUrl}
                          alt={reference.kundenname}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </button>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon size={42} className="text-[#b08a57]/50" />
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <h4 className="font-semibold text-[#2f2f2d]">{reference.kundenname || 'Ohne Kundenname'}</h4>
                        <p className="text-xs text-[#77756f]">{reference.modell}</p>
                      </div>
                      <span className="text-[11px] uppercase tracking-wide bg-[#b08a57]/15 text-[#9a7445] rounded-full px-2.5 py-1">
                        Neu
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-[#77756f] mb-3">
                      <span className="inline-flex items-center gap-1">
                        <MapPin size={12} className="text-[#b08a57]" />
                        {reference.ort || 'Kein Ort'}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <CalendarDays size={12} className="text-[#b08a57]" />
                        {reference.jahr}
                      </span>
                      {reference.rating ? (
                        <span className="inline-flex items-center gap-1 text-[#9a7445]">
                          {'★'.repeat(reference.rating)}
                        </span>
                      ) : null}
                      {reference.kontaktEmail && (
                        <span className="inline-flex max-w-full items-center gap-1 break-all">
                          <Mail size={12} className="text-[#b08a57]" />
                          {reference.kontaktEmail}
                        </span>
                      )}
                      {reference.kontaktTelefon && (
                        <span className="inline-flex max-w-full items-center gap-1 break-all">
                          <Phone size={12} className="text-[#b08a57]" />
                          {reference.kontaktTelefon}
                        </span>
                      )}
                    </div>

                    <div className={`mb-3 rounded-md border px-3 py-2 text-xs ${
                      reference.publicConsent === false
                        ? 'border-amber-200 bg-amber-50 text-amber-800'
                        : 'border-emerald-100 bg-emerald-50 text-emerald-700'
                    }`}>
                      {reference.publicConsent === false
                        ? 'Keine Zustimmung zur öffentlichen Anzeige. Der Eintrag bleibt nach Prüfung intern.'
                        : 'Zustimmung zur öffentlichen Anzeige liegt vor. Veröffentlichung erst nach Freigabe.'}
                    </div>

                    <p className="text-sm text-[#55524c] leading-relaxed mb-4">
                      {reference.beschreibung || 'Keine Beschreibung angegeben.'}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        size="sm"
                        onClick={() => approveReference(reference)}
                        disabled={savingId === reference.id}
                        className="w-full sm:w-auto bg-emerald-700 hover:bg-emerald-800 text-white"
                      >
                        <Check size={14} className="mr-1.5" />
                        {reference.publicConsent === false ? 'Intern prüfen' : 'Freigeben'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setDeleteTarget(reference)}
                        disabled={savingId === reference.id}
                        className="w-full sm:w-auto border-red-200 text-red-700 hover:bg-red-50"
                      >
                        <Trash2 size={14} className="mr-1.5" />
                        Löschen
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <Dialog open={!!selectedContact} onOpenChange={(open) => !open && setSelectedContactId(null)}>
        <DialogContent className="w-[calc(100vw-2rem)] max-w-2xl max-h-[calc(100vh-2rem)] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Kontaktanfrage</DialogTitle>
          </DialogHeader>

          {selectedContact && (
            <div className="space-y-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-[#2f2f2d] break-words">{selectedContact.subject}</h3>
                  <p className="mt-1 text-sm text-[#77756f]">{formatDateTime(selectedContact.createdAt)}</p>
                </div>
                <span className={`self-start rounded-full border px-3 py-1 text-xs ${getContactStatusClass(selectedContact)}`}>
                  {getContactStatusLabel(selectedContact)}
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-gray-200 bg-[#f8f7f3] p-4">
                  <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">Name</p>
                  <p className="text-sm font-medium text-[#2f2f2d] break-words">{selectedContact.name}</p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-[#f8f7f3] p-4">
                  <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">E-Mail</p>
                  <a className="text-sm font-medium text-[#9a7445] break-all" href={`mailto:${selectedContact.email}`}>
                    {selectedContact.email}
                  </a>
                </div>
                <div className="rounded-xl border border-gray-200 bg-[#f8f7f3] p-4">
                  <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">Telefon</p>
                  {selectedContact.phone ? (
                    <a className="text-sm font-medium text-[#9a7445] break-words" href={`tel:${selectedContact.phone}`}>
                      {selectedContact.phone}
                    </a>
                  ) : (
                    <p className="text-sm text-[#77756f]">Nicht angegeben</p>
                  )}
                </div>
                <div className="rounded-xl border border-gray-200 bg-[#f8f7f3] p-4">
                  <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">Quelle</p>
                  <p className="text-sm font-medium text-[#2f2f2d]">
                    {selectedContact.source === 'configurator' ? 'Konfigurator' : 'Kontaktformular'}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <p className="text-xs uppercase tracking-wide text-gray-400 mb-2">Nachricht</p>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-[#2f2f2d] break-words">
                  {selectedContact.message}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <Button
                  type="button"
                  variant="outline"
                  disabled={savingContactId === selectedContact.id}
                  onClick={() => updateContactStatus(selectedContact, 'open')}
                  className="border-[#b08a57]/40 text-[#2f2f2d]"
                >
                  <Archive size={16} className="mr-2" />
                  Für später aufheben
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-[#b08a57]/40 text-[#2f2f2d]"
                >
                  <a href={createMailReplyHref(selectedContact)}>
                    <Mail size={16} className="mr-2" />
                    Per Mail antworten
                  </a>
                </Button>
                <Button
                  type="button"
                  disabled={savingContactId === selectedContact.id}
                  onClick={() => updateContactStatus(selectedContact, 'answered')}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white"
                >
                  <CheckCircle2 size={16} className="mr-2" />
                  Über E-Mail beantwortet
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
        <DialogContent className="w-[calc(100vw-2rem)] max-w-lg">
          <DialogHeader>
            <DialogTitle>Bildvorschau</DialogTitle>
          </DialogHeader>
          {previewImage && <img src={previewImage} alt="Vorschau" className="w-full rounded-lg" />}
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent className="w-[calc(100vw-2rem)] max-w-sm">
          <DialogHeader>
            <DialogTitle>Eingang löschen?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-[#77756f]">
            Diese Einreichung wird gelöscht und nicht veröffentlicht.
          </p>
          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => setDeleteTarget(null)}>Abbrechen</Button>
            <Button
              size="sm"
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={deleteTarget ? savingId === deleteTarget.id : false}
              onClick={() => deleteTarget && removeReference(deleteTarget)}
            >
              Löschen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
