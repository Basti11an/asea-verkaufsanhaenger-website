import { useState } from 'react';
import { toast } from 'sonner';
import { CalendarDays, Check, ImageIcon, Inbox, MapPin, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { AdminReference, useAdminData } from '../../context/AdminDataContext';
import { getPrimaryReferenceImageUrl } from '../../lib/referenceImages';
import { StarRating } from '../reviews/StarRating';

export function EingaengeTab() {
  const { references, referencesLoading, referencesError, updateReference, deleteReference } = useAdminData();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminReference | null>(null);
  const [savingId, setSavingId] = useState<number | null>(null);
  const pendingRefs = references.filter((reference) => reference.status === 'pending').sort((a, b) => b.id - a.id);

  const approveReference = async (reference: AdminReference) => {
    setSavingId(reference.id);
    try { await updateReference(reference.id, { status: 'approved', sichtbar: reference.publicConsent !== false }); toast.success(reference.publicConsent === false ? 'Bewertung intern geprüft' : 'Bewertung ist jetzt online'); }
    catch (error) { toast.error(error instanceof Error ? error.message : 'Freigabe fehlgeschlagen'); }
    finally { setSavingId(null); }
  };
  const removeReference = async (reference: AdminReference) => {
    setSavingId(reference.id);
    try { await deleteReference(reference.id); setDeleteTarget(null); toast.success('Bewertung wurde gelöscht'); }
    catch (error) { toast.error(error instanceof Error ? error.message : 'Löschen fehlgeschlagen'); }
    finally { setSavingId(null); }
  };

  return <div className="p-4 md:p-6 max-w-7xl mx-auto">
    <div className="mb-6"><h2 className="text-lg font-semibold text-[#2f2f2d] flex items-center gap-2"><Inbox size={18} className="text-[#b08a57]" /> Eingänge <span className="text-sm font-normal text-gray-400">({pendingRefs.length} offen)</span></h2><p className="text-sm text-[#77756f]">Hier werden nur neue Kundenbewertungen zur Prüfung angezeigt.</p></div>
    {referencesLoading && <div className="mb-4 rounded-lg border border-[#b08a57]/20 bg-[#b08a57]/10 px-4 py-3 text-sm">Bewertungen werden geladen...</div>}
    {referencesError && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">Supabase-Hinweis: {referencesError}</div>}
    {pendingRefs.length === 0 ? <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center"><Inbox size={32} className="mx-auto mb-3 text-[#b08a57]/60" /><h4 className="text-[#2f2f2d] font-semibold mb-1">Keine offenen Bewertungen</h4><p className="text-sm text-[#77756f]">Neue Kundenbewertungen erscheinen automatisch hier.</p></div> : <div className="grid lg:grid-cols-2 gap-5">{pendingRefs.map((reference) => {
      const imageUrl = getPrimaryReferenceImageUrl(reference.bildUrl);
      return <div key={reference.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"><div className="grid sm:grid-cols-[180px_1fr]"><div className="h-44 sm:h-full bg-[#f8f7f3]">{imageUrl ? <button type="button" onClick={() => setPreviewImage(imageUrl)} className="w-full h-full block overflow-hidden"><img src={imageUrl} alt={reference.kundenname} className="w-full h-full object-cover" /></button> : <div className="w-full h-full flex items-center justify-center"><ImageIcon size={42} className="text-[#b08a57]/50" /></div>}</div><div className="p-5"><div className="flex items-start justify-between gap-3 mb-3"><div><h4 className="font-semibold text-[#2f2f2d]">{reference.kundenname || 'Ohne Kundenname'}</h4><p className="text-xs text-[#77756f]">{reference.modell}</p></div><span className="text-[11px] uppercase tracking-wide bg-[#b08a57]/15 text-[#9a7445] rounded-full px-2.5 py-1">Neu</span></div><div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-[#77756f] mb-3"><span className="inline-flex items-center gap-1"><MapPin size={12} className="text-[#b08a57]" />{reference.ort || 'Kein Ort'}</span><span className="inline-flex items-center gap-1"><CalendarDays size={12} className="text-[#b08a57]" />{reference.jahr}</span>{reference.rating ? <StarRating value={reference.rating} size="sm" /> : null}</div><div className="mb-3 rounded-md border px-3 py-2 text-xs border-emerald-100 bg-emerald-50 text-emerald-700">{reference.publicConsent === false ? 'Keine Zustimmung zur öffentlichen Anzeige. Bleibt intern.' : 'Zustimmung liegt vor. Veröffentlichung erst nach Freigabe.'}</div><p className="text-sm text-[#55524c] leading-relaxed mb-4">{reference.beschreibung || 'Keine Beschreibung angegeben.'}</p><div className="flex flex-col sm:flex-row gap-2"><Button size="sm" onClick={() => approveReference(reference)} disabled={savingId === reference.id} className="w-full sm:w-auto bg-emerald-700 hover:bg-emerald-800 text-white"><Check size={14} className="mr-1.5" />{reference.publicConsent === false ? 'Intern prüfen' : 'Freigeben'}</Button><Button size="sm" variant="outline" onClick={() => setDeleteTarget(reference)} disabled={savingId === reference.id} className="w-full sm:w-auto border-red-200 text-red-700 hover:bg-red-50"><Trash2 size={14} className="mr-1.5" />Löschen</Button></div></div></div></div>;
    })}</div>}
    <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}><DialogContent className="w-[calc(100vw-2rem)] max-w-lg"><DialogHeader><DialogTitle>Bildvorschau</DialogTitle></DialogHeader>{previewImage && <img src={previewImage} alt="Vorschau" className="w-full rounded-lg" />}</DialogContent></Dialog>
    <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}><DialogContent className="w-[calc(100vw-2rem)] max-w-sm"><DialogHeader><DialogTitle>Bewertung löschen?</DialogTitle><DialogDescription><strong>„{deleteTarget?.kundenname}"</strong> wird unwiderruflich gelöscht.</DialogDescription></DialogHeader><DialogFooter className="gap-2"><Button variant="outline" size="sm" onClick={() => setDeleteTarget(null)}>Abbrechen</Button><Button size="sm" className="bg-red-600 hover:bg-red-700 text-white" disabled={deleteTarget ? savingId === deleteTarget.id : false} onClick={() => deleteTarget && removeReference(deleteTarget)}>Löschen</Button></DialogFooter></DialogContent></Dialog>
  </div>;
}
