import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Plus, Pencil, Trash2, Check, X, ImageIcon } from 'lucide-react';
import { useAdminData, AdminReference } from '../../context/AdminDataContext';

const MODELLE = ['Verkaufsanhänger', 'Kühlanhänger', 'Messe- und Präsentationsanhänger'];

export function ReferenzenTab() {
  const {
    references: refs,
    referencesLoading,
    referencesError,
    createReference,
    updateReference,
    deleteReference,
  } = useAdminData();

  const [editState, setEditState] = useState<Record<number, Partial<AdminReference>>>({});
  const [deleteTarget, setDeleteTarget] = useState<AdminReference | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const publishedRefs = refs.filter((ref) => ref.status !== 'pending').sort((a, b) => b.id - a.id);

  const startEdit = (ref: AdminReference) => {
    setEditState((prev) => ({ ...prev, [ref.id]: { ...ref } }));
  };

  const cancelEdit = (id: number) => {
    setEditState((prev) => { const n = { ...prev }; delete n[id]; return n; });
  };

  const saveEdit = async (id: number) => {
    setSavingId(id);

    try {
      await updateReference(id, editState[id]);
      cancelEdit(id);
      toast.success('Gespeichert - Änderungen sind jetzt live', { duration: 2000 });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Speichern fehlgeschlagen';
      toast.error(message);
    } finally {
      setSavingId(null);
    }
  };

  const handleEditChange = (id: number, field: keyof AdminReference, value: any) => {
    setEditState((prev) => ({ ...prev, [id]: { ...(prev[id] ?? {}), [field]: value } }));
  };

  const handleToggleSichtbar = async (id: number, val: boolean) => {
    setSavingId(id);

    try {
      await updateReference(id, { sichtbar: val });
      toast.success(val ? 'Sichtbar' : 'Ausgeblendet', { duration: 1500 });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Änderung fehlgeschlagen';
      toast.error(message);
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (ref: AdminReference) => {
    setSavingId(ref.id);

    try {
      await deleteReference(ref.id);
      setDeleteTarget(null);
      toast.success(`"${ref.kundenname}" gelöscht`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Löschen fehlgeschlagen';
      toast.error(message);
    } finally {
      setSavingId(null);
    }
  };

  const handleAdd = async () => {
    setIsCreating(true);

    try {
      const newRef = await createReference({
        kundenname: '',
        ort: '',
        modell: 'Verkaufsanhänger',
        jahr: new Date().getFullYear(),
        beschreibung: '',
        bildUrl: '',
        sichtbar: true,
        status: 'approved',
        kontaktEmail: '',
        kontaktTelefon: '',
      });
      setEditState((prev) => ({ ...prev, [newRef.id]: { ...newRef } }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Referenz konnte nicht angelegt werden';
      toast.error(message);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-[#2f2f2d]">
          Kundenreferenzen
          <span className="ml-2 text-sm font-normal text-gray-400">({publishedRefs.length} Einträge)</span>
        </h2>
        <Button
          size="sm"
          onClick={handleAdd}
          disabled={isCreating}
          className="bg-[#77756f] hover:bg-[#2f2f2d] text-white h-8 text-xs"
        >
          <Plus size={14} className="mr-1.5" />
          {isCreating ? 'Wird angelegt...' : 'Neue Referenz hinzufügen'}
        </Button>
      </div>

      {referencesLoading && (
        <div className="mb-4 rounded-lg border border-[#b08a57]/20 bg-[#b08a57]/10 px-4 py-3 text-sm text-[#2f2f2d]">
          Referenzen werden aus Supabase geladen...
        </div>
      )}

      {referencesError && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Supabase-Hinweis: {referencesError}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/80">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Kunde</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-24">Ort</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-44">Modell</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-16">Jahr</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Beschreibung</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-14">Bild</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-16">Sichtbar</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-24">Aktionen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {publishedRefs.map((ref) => {
                const isEditing = ref.id in editState;
                const draft = editState[ref.id] ?? {};
                return (
                  <tr key={ref.id} className={`hover:bg-gray-50/50 transition-colors ${isEditing ? 'bg-blue-50/40' : ''}`}>
                    <td className="px-4 py-2.5">
                      {isEditing ? (
                        <Input
                          value={draft.kundenname ?? ref.kundenname}
                          onChange={(e) => handleEditChange(ref.id, 'kundenname', e.target.value)}
                          className="h-7 text-xs border-[#b08a57] w-36"
                          placeholder="Kundenname"
                          autoFocus
                        />
                      ) : (
                        <span className="font-medium text-[#2f2f2d]">{ref.kundenname}</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5">
                      {isEditing ? (
                        <Input
                          value={draft.ort ?? ref.ort}
                          onChange={(e) => handleEditChange(ref.id, 'ort', e.target.value)}
                          className="h-7 text-xs border-[#b08a57] w-24"
                          placeholder="Ort"
                        />
                      ) : (
                        <span className="text-gray-500 text-xs">{ref.ort}</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5">
                      {isEditing ? (
                        <select
                          value={draft.modell ?? ref.modell}
                          onChange={(e) => handleEditChange(ref.id, 'modell', e.target.value)}
                          className="h-7 text-xs border border-[#b08a57] rounded-md px-1.5 bg-white w-44"
                        >
                          {MODELLE.map((m) => <option key={m} value={m}>{m}</option>)}
                        </select>
                      ) : (
                        <span className="text-xs text-gray-600">{ref.modell}</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5">
                      {isEditing ? (
                        <Input
                          type="number"
                          value={draft.jahr ?? ref.jahr}
                          onChange={(e) => handleEditChange(ref.id, 'jahr', Number(e.target.value))}
                          className="h-7 text-xs border-[#b08a57] w-16"
                        />
                      ) : (
                        <span className="text-gray-500 text-xs">{ref.jahr}</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5">
                      {isEditing ? (
                        <Input
                          value={draft.beschreibung ?? ref.beschreibung}
                          onChange={(e) => handleEditChange(ref.id, 'beschreibung', e.target.value)}
                          className="h-7 text-xs border-[#b08a57] w-full"
                          placeholder="Kurzbeschreibung"
                        />
                      ) : (
                        <span className="text-xs text-gray-500 line-clamp-1">{ref.beschreibung}</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5">
                      {isEditing ? (
                        <Input
                          value={draft.bildUrl ?? ref.bildUrl}
                          onChange={(e) => handleEditChange(ref.id, 'bildUrl', e.target.value)}
                          className="h-7 text-xs border-[#b08a57] w-28 font-mono"
                          placeholder="https://..."
                        />
                      ) : ref.bildUrl ? (
                        <button
                          onClick={() => setPreviewImage(ref.bildUrl)}
                          className="w-8 h-8 rounded overflow-hidden border border-gray-200 hover:border-[#b08a57] transition-colors"
                        >
                          <img src={ref.bildUrl} alt="" className="w-full h-full object-cover" />
                        </button>
                      ) : (
                        <span className="text-gray-300"><ImageIcon size={16} /></span>
                      )}
                    </td>
                    <td className="px-4 py-2.5">
                      <Switch
                        checked={ref.sichtbar}
                        onCheckedChange={(val) => handleToggleSichtbar(ref.id, val)}
                        disabled={isEditing || savingId === ref.id}
                      />
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-1">
                        {isEditing ? (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => saveEdit(ref.id)}
                              disabled={savingId === ref.id}
                              className="h-7 w-7 p-0 hover:bg-emerald-50 hover:text-emerald-600"
                              title="Speichern"
                            >
                              <Check size={14} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => cancelEdit(ref.id)}
                              className="h-7 w-7 p-0 hover:bg-gray-100 text-gray-400"
                              title="Abbrechen"
                            >
                              <X size={14} />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => startEdit(ref)}
                              className="h-7 w-7 p-0 hover:bg-[#b08a57]/20"
                              title="Bearbeiten"
                            >
                              <Pencil size={13} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteTarget(ref)}
                              disabled={savingId === ref.id}
                              className="h-7 w-7 p-0 hover:bg-red-50 hover:text-red-500"
                              title="Löschen"
                            >
                              <Trash2 size={13} />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Image Preview Dialog */}
      <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Bildvorschau</DialogTitle>
          </DialogHeader>
          {previewImage && (
            <img src={previewImage} alt="Vorschau" className="w-full rounded-lg" />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Referenz löschen?</DialogTitle>
            <DialogDescription>
              <strong>„{deleteTarget?.kundenname}"</strong> wird unwiderruflich gelöscht.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => setDeleteTarget(null)}>Abbrechen</Button>
            <Button
              size="sm"
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={deleteTarget ? savingId === deleteTarget.id : false}
              onClick={() => handleDelete(deleteTarget!)}
            >
              Löschen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
