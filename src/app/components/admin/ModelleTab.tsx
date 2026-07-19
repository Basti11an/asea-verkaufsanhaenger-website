import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Save, ImageIcon, Eye, EyeOff } from 'lucide-react';
import { useAdminData, AdminModel } from '../../context/AdminDataContext';

export function ModelleTab() {
  const { models, setModels } = useAdminData();

  // Local per-card draft state — changes only propagate to context (and public site) on save
  const [drafts, setDrafts] = useState<Record<number, Partial<AdminModel>>>({});

  const getDraft = (model: AdminModel): AdminModel => ({
    ...model,
    ...(drafts[model.id] ?? {}),
  });

  const handleChange = (id: number, field: keyof AdminModel, value: any) => {
    setDrafts((prev) => ({
      ...prev,
      [id]: { ...(prev[id] ?? {}), [field]: value },
    }));
  };

  const handleSave = (id: number) => {
    const draft = drafts[id];
    if (draft && Object.keys(draft).length > 0) {
      setModels((prev) => prev.map((m) => (m.id === id ? { ...m, ...draft } : m)));
      setDrafts((prev) => { const n = { ...prev }; delete n[id]; return n; });
    }
    toast.success('Gespeichert ✓ — Änderungen sind jetzt live', { duration: 2500 });
  };

  const hasDraft = (id: number) => !!drafts[id] && Object.keys(drafts[id]).length > 0;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-[#2f2f2d]">Anhänger-Modelle</h2>
        <p className="text-sm text-gray-400">Änderungen werden erst nach „Speichern" live</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {models.map((model) => {
          const draft = getDraft(model);
          const isDirty = hasDraft(model.id);

          return (
            <div
              key={model.id}
              className={`bg-white rounded-xl border shadow-sm overflow-hidden flex flex-col transition-all duration-200 ${
                isDirty ? 'border-amber-300 shadow-amber-100' : 'border-gray-200'
              } ${!draft.active ? 'opacity-60' : ''}`}
            >
              {/* Image Preview */}
              <div className="relative h-44 bg-gray-100 overflow-hidden">
                {draft.imageUrl ? (
                  <img
                    src={draft.imageUrl}
                    alt={draft.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-300">
                    <ImageIcon size={48} />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
                <div className="absolute top-2 right-2 bg-[#1e2a3a]/80 text-white text-[10px] px-2 py-0.5 rounded-full">
                  Modell {model.id}
                </div>
                {isDirty && (
                  <div className="absolute top-2 left-2 bg-amber-500 text-white text-[10px] px-2 py-0.5 rounded-full">
                    Ungespeichert
                  </div>
                )}
              </div>

              {/* Fields */}
              <div className="p-4 flex flex-col gap-3 flex-1">
                {/* Active toggle */}
                <div className="flex items-center justify-between py-1 px-3 bg-gray-50 rounded-lg">
                  <span className="text-xs font-medium text-gray-500 flex items-center gap-1.5">
                    {draft.active ? <Eye size={12} /> : <EyeOff size={12} />}
                    Auf Website sichtbar
                  </span>
                  <Switch
                    checked={draft.active}
                    onCheckedChange={(val) => handleChange(model.id, 'active', val)}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    Name
                  </label>
                  <Input
                    value={draft.name}
                    onChange={(e) => handleChange(model.id, 'name', e.target.value)}
                    className="h-8 text-sm border-gray-200 focus:border-[#b08a57]"
                  />
                </div>

                <div className="flex-1">
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    Beschreibung
                  </label>
                  <Textarea
                    value={draft.description}
                    onChange={(e) => handleChange(model.id, 'description', e.target.value)}
                    className="text-sm border-gray-200 focus:border-[#b08a57] min-h-[80px] resize-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    Bild-URL
                  </label>
                  <Input
                    value={draft.imageUrl}
                    onChange={(e) => handleChange(model.id, 'imageUrl', e.target.value)}
                    className="h-8 text-xs border-gray-200 focus:border-[#b08a57] font-mono"
                    placeholder="https://..."
                  />
                </div>

                <Button
                  onClick={() => handleSave(model.id)}
                  size="sm"
                  className={`mt-auto h-8 text-xs transition-all duration-200 ${
                    isDirty
                      ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-md'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  <Save size={13} className="mr-1.5" />
                  {isDirty ? 'Änderungen speichern *' : 'Gespeichert'}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
