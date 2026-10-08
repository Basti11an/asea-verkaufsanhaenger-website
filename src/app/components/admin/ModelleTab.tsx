import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Save, ImageIcon, Eye, EyeOff } from 'lucide-react';
import { useAdminData, AdminModel } from '../../context/AdminDataContext';
import { ImageUploadField } from '../ImageUploadField';
import { useLanguage } from '../../context/LanguageContext';
import { STATIC_DETAILS } from '../pages/ModelsPage';

export function ModelleTab() {
  const { models, setModels } = useAdminData();
  const { t } = useLanguage();

  // Local per-card draft state — changes only propagate to context (and public site) on save
  const [drafts, setDrafts] = useState<Record<number, Partial<AdminModel>>>({});

  const getDraft = (model: AdminModel): AdminModel => {
    const details = STATIC_DETAILS[model.id];
    return {
      ...model,
      shortDescription: model.shortDescription ?? t(details.shortDescriptionKey),
      images: model.images?.length ? model.images : details.images,
      features: model.features?.length ? model.features : details.featureKeys.map((key) => t(key)),
      specs: model.specs?.length
        ? model.specs
        : details.specs.map((spec) => ({ label: t(spec.labelKey), value: spec.value })),
      price: model.price ?? t(details.priceKey),
      baseEquipment: model.baseEquipment?.length ? model.baseEquipment : details.baseEquipmentKeys.map((key) => t(key)),
      construction: model.construction?.length ? model.construction : details.constructionKeys.map((key) => t(key)),
      ...(drafts[model.id] ?? {}),
    };
  };

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

  const updateImage = (id: number, index: number, url: string) => {
    const model = models.find((item) => item.id === id);
    if (!model) return;
    const draft = getDraft(model);
    const images = [...(draft.images ?? [])];
    images[index] = url;
    handleChange(id, 'images', images);
    if (index === 0) handleChange(id, 'imageUrl', url);
  };

  const parseLines = (value: string) => value.split('\n').map((line) => line.trim()).filter(Boolean);
  const parseSpecs = (value: string) => parseLines(value).map((line) => {
    const separator = line.indexOf(':');
    return separator === -1
      ? { label: line, value: '' }
      : { label: line.slice(0, separator).trim(), value: line.slice(separator + 1).trim() };
  });

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between mb-5">
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
              className={`bg-white rounded-xl border shadow-sm overflow-hidden flex min-w-0 flex-col transition-all duration-200 ${
                isDirty ? 'border-amber-300 shadow-amber-100' : 'border-gray-200'
              } ${!draft.active ? 'opacity-60' : ''}`}
            >
              {/* Image Preview */}
              <div className="relative h-44 bg-gray-100 overflow-hidden">
                {(draft.images?.[0] ?? draft.imageUrl) ? (
                  <img
                    src={draft.images?.[0] ?? draft.imageUrl}
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
                    Kurzbeschreibung
                  </label>
                  <Textarea
                    value={draft.shortDescription ?? ''}
                    onChange={(e) => handleChange(model.id, 'shortDescription', e.target.value)}
                    className="text-sm border-gray-200 focus:border-[#b08a57] min-h-[70px] resize-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    Preis / Preistext
                  </label>
                  <Input
                    value={draft.price ?? ''}
                    onChange={(e) => handleChange(model.id, 'price', e.target.value)}
                    className="h-8 text-sm border-gray-200 focus:border-[#b08a57]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    Ausstattung (eine Zeile pro Punkt)
                  </label>
                  <Textarea
                    value={(draft.features ?? []).join('\n')}
                    onChange={(e) => handleChange(model.id, 'features', parseLines(e.target.value))}
                    className="text-sm border-gray-200 focus:border-[#b08a57] min-h-[80px] resize-y"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    Technische Daten (Format: Bezeichnung: Wert)
                  </label>
                  <Textarea
                    value={(draft.specs ?? []).map((spec) => `${spec.label}: ${spec.value}`).join('\n')}
                    onChange={(e) => handleChange(model.id, 'specs', parseSpecs(e.target.value))}
                    className="text-sm border-gray-200 focus:border-[#b08a57] min-h-[100px] resize-y"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    Grundausstattung (eine Zeile pro Punkt)
                  </label>
                  <Textarea
                    value={(draft.baseEquipment ?? []).join('\n')}
                    onChange={(e) => handleChange(model.id, 'baseEquipment', parseLines(e.target.value))}
                    className="text-sm border-gray-200 focus:border-[#b08a57] min-h-[70px] resize-y"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    Konstruktion (eine Zeile pro Punkt)
                  </label>
                  <Textarea
                    value={(draft.construction ?? []).join('\n')}
                    onChange={(e) => handleChange(model.id, 'construction', parseLines(e.target.value))}
                    className="text-sm border-gray-200 focus:border-[#b08a57] min-h-[70px] resize-y"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Modellfotos
                  </label>
                  <div className="space-y-2">
                    {Array.from({ length: 4 }, (_, index) => (
                      <ImageUploadField
                        key={index}
                        label={`Bild ${index + 1}`}
                        value={draft.images?.[index] ?? ''}
                        onChange={(url) => updateImage(model.id, index, url)}
                        folder="models"
                        compact
                        showPreview={false}
                        previewAlt={`${draft.name} Bild ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>

                <Button
                  onClick={() => handleSave(model.id)}
                  size="sm"
                  className={`mt-auto h-8 w-full text-xs transition-all duration-200 ${
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
