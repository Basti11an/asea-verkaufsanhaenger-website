import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react';
import { useAdminData, AdminEquipment } from '../../context/AdminDataContext';

let nextId = 100;

const KATEGORIEN = ['Kühlung', 'Küche', 'Getränke', 'Elektrik', 'Außen', 'Einrichtung', 'Sonstiges'];

function KategorieBadge({ kategorie }: { kategorie: string }) {
  const colors: Record<string, string> = {
    Kühlung: 'bg-blue-100 text-blue-700',
    Küche: 'bg-orange-100 text-orange-700',
    Getränke: 'bg-cyan-100 text-cyan-700',
    Elektrik: 'bg-yellow-100 text-yellow-700',
    Außen: 'bg-green-100 text-green-700',
    Einrichtung: 'bg-purple-100 text-purple-700',
  };
  return (
    <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full font-medium ${colors[kategorie] || 'bg-gray-100 text-gray-600'}`}>
      {kategorie}
    </span>
  );
}

export function AusstattungTab() {
  // All reads/writes go directly through context → public site updates instantly
  const { equipment: items, setEquipment: setItems } = useAdminData();

  // Local draft state only for the currently-editing rows (not yet committed)
  const [editState, setEditState] = useState<Record<number, Partial<AdminEquipment>>>({});
  const [deleteTarget, setDeleteTarget] = useState<AdminEquipment | null>(null);

  const startEdit = (item: AdminEquipment) => {
    setEditState((prev) => ({ ...prev, [item.id]: { ...item } }));
  };

  const cancelEdit = (id: number) => {
    setEditState((prev) => { const n = { ...prev }; delete n[id]; return n; });
  };

  const saveEdit = (id: number) => {
    // Commit draft to context → immediately reflects on EquipmentPage
    setItems((prev) => prev.map((item) => item.id === id ? { ...item, ...editState[id] } : item));
    cancelEdit(id);
    toast.success('Gespeichert ✓ — Änderungen sind jetzt live', { duration: 2000 });
  };

  const handleEditChange = (id: number, field: keyof AdminEquipment, value: any) => {
    setEditState((prev) => ({ ...prev, [id]: { ...(prev[id] ?? {}), [field]: value } }));
  };

  const handleToggleAktiv = (id: number, val: boolean) => {
    // Toggle writes directly to context — public page reflects immediately
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, aktiv: val } : i));
    toast.success(val ? 'Aktiviert ✓' : 'Deaktiviert ✓', { duration: 1500 });
  };

  const handleDelete = (item: AdminEquipment) => {
    setItems((prev) => prev.filter((i) => i.id !== item.id));
    setDeleteTarget(null);
    toast.success(`„${item.name}" gelöscht`);
  };

  const handleAdd = () => {
    const id = nextId++;
    const newItem: AdminEquipment = {
      id,
      name: '',
      beschreibung: '',
      preis: 0,
      kategorie: 'Sonstiges',
      aktiv: true,
    };
    // Add to context immediately so it exists in shared state
    setItems((prev) => [newItem, ...prev]);
    // Open edit mode for new row
    setEditState((prev) => ({ ...prev, [id]: { ...newItem } }));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-[#2f2f2d]">
          Ausstattungsoptionen
          <span className="ml-2 text-sm font-normal text-gray-400">({items.length} Einträge)</span>
        </h2>
        <Button
          size="sm"
          onClick={handleAdd}
          className="bg-[#77756f] hover:bg-[#2f2f2d] text-white h-8 text-xs"
        >
          <Plus size={14} className="mr-1.5" />
          Neuen Eintrag hinzufügen
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/80">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Beschreibung</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-24">Preis (€)</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-28">Kategorie</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-16">Aktiv</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-24">Aktionen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {items.map((item) => {
                const isEditing = item.id in editState;
                const draft = editState[item.id] ?? {};
                return (
                  <tr key={item.id} className={`hover:bg-gray-50/50 transition-colors ${isEditing ? 'bg-blue-50/40' : ''}`}>
                    <td className="px-4 py-2.5">
                      {isEditing ? (
                        <Input
                          value={draft.name ?? item.name}
                          onChange={(e) => handleEditChange(item.id, 'name', e.target.value)}
                          className="h-7 text-xs border-[#b08a57] w-36"
                          placeholder="Name"
                          autoFocus
                        />
                      ) : (
                        <span className="font-medium text-[#2f2f2d]">{item.name}</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5">
                      {isEditing ? (
                        <Input
                          value={draft.beschreibung ?? item.beschreibung}
                          onChange={(e) => handleEditChange(item.id, 'beschreibung', e.target.value)}
                          className="h-7 text-xs border-[#b08a57] w-full"
                          placeholder="Beschreibung"
                        />
                      ) : (
                        <span className="text-gray-500 text-xs">{item.beschreibung}</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5">
                      {isEditing ? (
                        <Input
                          type="number"
                          value={draft.preis ?? item.preis}
                          onChange={(e) => handleEditChange(item.id, 'preis', Number(e.target.value))}
                          className="h-7 text-xs border-[#b08a57] w-20"
                        />
                      ) : (
                        <span className="font-medium text-[#77756f]">€ {item.preis.toLocaleString('de-AT')}</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5">
                      {isEditing ? (
                        <select
                          value={draft.kategorie ?? item.kategorie}
                          onChange={(e) => handleEditChange(item.id, 'kategorie', e.target.value)}
                          className="h-7 text-xs border border-[#b08a57] rounded-md px-2 bg-white"
                        >
                          {KATEGORIEN.map((k) => (
                            <option key={k} value={k}>{k}</option>
                          ))}
                        </select>
                      ) : (
                        <KategorieBadge kategorie={item.kategorie} />
                      )}
                    </td>
                    <td className="px-4 py-2.5">
                      <Switch
                        checked={item.aktiv}
                        onCheckedChange={(val) => handleToggleAktiv(item.id, val)}
                        disabled={isEditing}
                      />
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-1">
                        {isEditing ? (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => saveEdit(item.id)}
                              className="h-7 w-7 p-0 hover:bg-emerald-50 hover:text-emerald-600"
                              title="Speichern"
                            >
                              <Check size={14} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => cancelEdit(item.id)}
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
                              onClick={() => startEdit(item)}
                              className="h-7 w-7 p-0 hover:bg-[#b08a57]/20"
                              title="Bearbeiten"
                            >
                              <Pencil size={13} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteTarget(item)}
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

      {/* Delete Confirm Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Eintrag löschen?</DialogTitle>
            <DialogDescription>
              <strong>„{deleteTarget?.name}"</strong> wird unwiderruflich gelöscht.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => setDeleteTarget(null)}>Abbrechen</Button>
            <Button
              size="sm"
              className="bg-red-600 hover:bg-red-700 text-white"
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
