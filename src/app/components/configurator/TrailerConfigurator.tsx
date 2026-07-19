import { useState } from 'react';
import { TrailerScene } from './TrailerScene';
import { Settings, DoorOpen, DoorClosed, Palette, Coffee, Snowflake, Droplets, Info, Flame, Utensils, Wind, Zap, Droplet, LayoutGrid, ChevronDown, ChevronUp } from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';

interface TrailerConfiguratorProps {
  onNavigate?: (page: string, data?: any) => void;
}

// Counter Setup Definitions
type CounterSetup = 'full' | 'basic' | 'compact';

interface SetupConfig {
  id: CounterSetup;
  name: string;
  description: string;
  counters: string[]; // Which counter positions are available
  price: number;
}

const counterSetups: SetupConfig[] = [
  {
    id: 'full',
    name: 'Vollausstattung',
    description: 'Front-Theke + Mitte & Hinten + Wandregale',
    counters: ['front', 'middle', 'back', 'wall'],
    price: 2500
  },
  {
    id: 'basic',
    name: 'Standard',
    description: 'Front-Theke + 1 Wandregal',
    counters: ['front', 'wall'],
    price: 1200
  },
  {
    id: 'compact',
    name: 'Kompakt',
    description: 'Nur Front-Theke',
    counters: ['front'],
    price: 800
  }
];

// Color options with prices
interface ColorOption {
  id: string;
  hex: string;
  name: string;
  price: number;
}

const exteriorColors: ColorOption[] = [
  { id: 'white', hex: '#ffffff', name: 'Weiß', price: 0 },
  { id: 'blue', hex: '#b08a57', name: 'Hellblau', price: 200 },
  { id: 'gray', hex: '#8e9aaf', name: 'Grau', price: 150 },
  { id: 'red', hex: '#c1666b', name: 'Rot', price: 250 },
];

const floorColors: ColorOption[] = [
  { id: 'gray', hex: '#6b7280', name: 'Grau', price: 0 },
  { id: 'darkgray', hex: '#374151', name: 'Dunkelgrau', price: 100 },
  { id: 'beige', hex: '#d4c5b9', name: 'Beige', price: 150 },
  { id: 'blue', hex: '#4a5c6a', name: 'Schieferblau', price: 200 },
];

const counterColors: ColorOption[] = [
  { id: 'wood', hex: '#8b5a2b', name: 'Holz', price: 0 },
  { id: 'white', hex: '#f5f5f5', name: 'Weiß', price: 150 },
  { id: 'gray', hex: '#9ca3af', name: 'Grau', price: 100 },
  { id: 'darkwood', hex: '#5c3d2e', name: 'Dunkles Holz', price: 200 },
];

const doorColors: ColorOption[] = [
  { id: 'white', hex: '#ffffff', name: 'Weiß', price: 0 },
  { id: 'gray', hex: '#9ca3af', name: 'Grau', price: 100 },
  { id: 'blue', hex: '#b08a57', name: 'Hellblau', price: 150 },
  { id: 'anthracite', hex: '#4b5563', name: 'Anthrazit', price: 200 },
];

// Equipment categories
type Category = 'Kochen & Zubereiten' | 'Kühlung' | 'Wasser & Reinigung';

interface EquipmentItem {
  id: string;
  name: string;
  price: number;
  category: Category;
  icon: any;
  requires: string; // Which counter position is needed
}

const equipmentItems: EquipmentItem[] = [
  // Front Counter Equipment
  { id: 'coffee', name: 'Profi Kaffeemaschine', price: 2500, category: 'Kochen & Zubereiten', icon: Coffee, requires: 'front' },
  { id: 'vitrine', name: 'Kühlvitrine (Theke)', price: 1400, category: 'Kühlung', icon: Snowflake, requires: 'front' },
  
  // Middle Counter Equipment
  { id: 'grill', name: 'Gas-Grillplatte', price: 1200, category: 'Kochen & Zubereiten', icon: Flame, requires: 'middle' },
  { id: 'fryer', name: 'Doppel-Fritteuse', price: 850, category: 'Kochen & Zubereiten', icon: Utensils, requires: 'middle' },
  
  // Back Counter Equipment
  { id: 'microwave', name: 'Mikrowelle', price: 350, category: 'Kochen & Zubereiten', icon: Zap, requires: 'back' },
  { id: 'icecream', name: 'Eismaschine', price: 1800, category: 'Kühlung', icon: Snowflake, requires: 'back' },
  
  // Wall Equipment
  { id: 'fridge', name: 'Getränkekühlschrank', price: 800, category: 'Kühlung', icon: Wind, requires: 'wall' },
  { id: 'freezer', name: 'Gefriertruhe', price: 950, category: 'Kühlung', icon: Snowflake, requires: 'wall' },
  { id: 'sink', name: 'Waschbecken-Set', price: 450, category: 'Wasser & Reinigung', icon: Droplets, requires: 'wall' },
  { id: 'hotwater', name: 'Heißwasser-Boiler', price: 400, category: 'Kochen & Zubereiten', icon: Droplet, requires: 'wall' },
  { id: 'watertank', name: 'Frischwasser-Tank (100L)', price: 320, category: 'Wasser & Reinigung', icon: Droplets, requires: 'wall' },
];

// Equipment conflicts (items that can't be selected together because they occupy the same space)
const conflicts: Record<string, string[]> = {
  'coffee': ['vitrine'],
  'vitrine': ['coffee'],
  'grill': ['fryer'],
  'fryer': ['grill'],
  'microwave': ['icecream'],
  'icecream': ['microwave'],
  'sink': ['hotwater', 'watertank'],
  'hotwater': ['sink'],
  'watertank': ['sink', 'fridge'],
  'fridge': ['watertank', 'freezer'],
  'freezer': ['fridge'],
};

export function TrailerConfigurator({ onNavigate }: TrailerConfiguratorProps) {
  const [hatchOpen, setHatchOpen] = useState(false);
  const [doorsOpen, setDoorsOpen] = useState(false);
  const [exteriorColor, setExteriorColor] = useState('#ffffff');
  const [floorColor, setFloorColor] = useState('#6b7280');
  const [counterColor, setCounterColor] = useState('#8b5a2b');
  const [doorColor, setDoorColor] = useState('#ffffff');
  const [setup, setSetup] = useState<CounterSetup>('full');
  const [equipment, setEquipment] = useState<string[]>([]);
  const [zoom, setZoom] = useState(8);
  const [priceBreakdownOpen, setPriceBreakdownOpen] = useState(false);

  // Pull live equipment prices from AdminDataContext.
  // For each configurator item, try to find a matching context entry by name
  // (case-insensitive substring match in either direction). Fall back to the
  // hardcoded price if no match is found so nothing ever breaks.
  const { equipment: adminEquipment } = useAdminData();

  const getContextPrice = (itemName: string, fallback: number): number => {
    const match = adminEquipment.find(
      (ctx) =>
        ctx.name.toLowerCase().includes(itemName.toLowerCase()) ||
        itemName.toLowerCase().includes(ctx.name.toLowerCase())
    );
    return match ? match.preis : fallback;
  };

  // Derived array — same structure as equipmentItems but with live prices
  const effectiveEquipmentItems = equipmentItems.map((item) => ({
    ...item,
    price: getContextPrice(item.name, item.price),
  }));

  const currentSetup = counterSetups.find(s => s.id === setup)!;

  const toggleEquipment = (item: string) => {
    setEquipment(prev => {
      if (prev.includes(item)) {
        return prev.filter(i => i !== item);
      } else {
        const itemConflicts = conflicts[item] || [];
        const hasConflict = itemConflicts.some(conflictItem => prev.includes(conflictItem));
        if (hasConflict) {
          const newEquipment = prev.filter(i => !itemConflicts.includes(i));
          return [...newEquipment, item];
        } else {
          return [...prev, item];
        }
      }
    });
  };

  const changeSetup = (newSetup: CounterSetup) => {
    setSetup(newSetup);
    const newSetupConfig = counterSetups.find(s => s.id === newSetup)!;
    setEquipment(prev =>
      prev.filter(eqId => {
        const item = effectiveEquipmentItems.find(i => i.id === eqId);
        return item && newSetupConfig.counters.includes(item.requires);
      })
    );
  };

  const calculatePrice = () => {
    let base = 8500;
    base += currentSetup.price;
    effectiveEquipmentItems.forEach(item => {
      if (equipment.includes(item.id)) {
        base += item.price;
      }
    });
    base += exteriorColors.find(c => c.hex === exteriorColor)?.price || 0;
    base += floorColors.find(c => c.hex === floorColor)?.price || 0;
    base += counterColors.find(c => c.hex === counterColor)?.price || 0;
    base += doorColors.find(c => c.hex === doorColor)?.price || 0;
    return base;
  };

  const handleContact = () => {
    if (onNavigate) {
      const getColorName = (hex: string, colorArray: ColorOption[]) => {
        return colorArray.find(c => c.hex === hex)?.name || hex;
      };

      const selectedItemsText = effectiveEquipmentItems
        .filter(item => equipment.includes(item.id))
        .map(item => item.name)
        .join(', ');
      
      onNavigate('contact', {
        subject: 'Anfrage Konfigurator',
        message: `Hallo ASEA-Team,\n\nich interessiere mich für einen konfigurierten Verkaufsanhänger.\n\nMeine Konfiguration:\n- Setup: ${currentSetup.name}\n- Außenfarbe: ${getColorName(exteriorColor, exteriorColors)}\n- Bodenfarbe: ${getColorName(floorColor, floorColors)}\n- Thekenfarbe: ${getColorName(counterColor, counterColors)}\n- Türenfarbe: ${getColorName(doorColor, doorColors)}\n- Ausstattung: ${selectedItemsText || 'Keine zusätzliche Ausstattung'}\n\nGesamtpreis (Netto): ${calculatePrice().toLocaleString('de-AT')} €\n\nBitte senden Sie mir ein unverbindliches Angebot.`,
      });
    } else {
      alert(`Konfiguration:\nSetup: ${currentSetup.name}\nAußenfarbe: ${exteriorColor}\nBodenfarbe: ${floorColor}\nThekenfarbe: ${counterColor}\nTürenfarbe: ${doorColor}\nAusstattung: ${equipment.join(', ')}\nPreis: ${calculatePrice()} €`);
    }
  };

  // Filter equipment based on current setup — use effectiveEquipmentItems for live prices
  const availableEquipment = effectiveEquipmentItems.filter(item =>
    currentSetup.counters.includes(item.requires)
  );

  const categories = Array.from(new Set(availableEquipment.map(item => item.category)));

  return (
    <div className="w-full lg:h-full">
      <div className="flex flex-col lg:flex-row gap-6 lg:h-full">
        {/* 3D Scene Area */}
        <div className="h-[430px] sm:h-[520px] lg:h-auto lg:flex-1 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl overflow-hidden relative shadow-inner">
          <TrailerScene 
            hatchOpen={hatchOpen} 
            doorsOpen={doorsOpen}
            exteriorColor={exteriorColor}
            floorColor={floorColor}
            counterColor={counterColor}
            doorColor={doorColor}
            equipment={equipment}
            setup={setup}
            zoom={zoom}
            onToggleHatch={() => setHatchOpen(!hatchOpen)}
            onToggleDoors={() => setDoorsOpen(!doorsOpen)}
          />
          
          {/* Quick Controls */}
          <div className="absolute top-4 left-4 right-4 sm:top-6 sm:left-6 sm:right-auto bg-white/70 backdrop-blur-md px-4 py-2 rounded-full shadow-sm border border-white/40 flex items-center gap-2">
            <Info className="w-4 h-4 text-[#77756f]" />
            <span className="text-xs sm:text-sm font-medium text-[#77756f]">Klicken Sie auf Klappen/Türen zum Öffnen</span>
          </div>

          <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 flex flex-col items-center gap-3 bg-white/70 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/40">
            <div className="grid grid-cols-2 gap-3 sm:flex sm:gap-4 w-full sm:w-auto">
              <button 
                onClick={() => setHatchOpen(!hatchOpen)} 
                className={`px-3 sm:px-4 py-3 rounded-xl transition-all flex items-center justify-center gap-2 font-medium text-sm sm:text-base ${hatchOpen ? 'bg-[#77756f] text-white' : 'bg-white text-[#77756f] hover:bg-gray-50'}`}
              >
                {hatchOpen ? <DoorOpen className="w-5 h-5" /> : <DoorClosed className="w-5 h-5" />}
                Verkaufsklappe
              </button>
              <button 
                onClick={() => setDoorsOpen(!doorsOpen)} 
                className={`px-3 sm:px-4 py-3 rounded-xl transition-all flex items-center justify-center gap-2 font-medium text-sm sm:text-base ${doorsOpen ? 'bg-[#77756f] text-white' : 'bg-white text-[#77756f] hover:bg-gray-50'}`}
              >
                {doorsOpen ? <DoorOpen className="w-5 h-5" /> : <DoorClosed className="w-5 h-5" />}
                Hecktüren
              </button>
            </div>
            
            {/* Zoom Slider */}
            <div className="w-full px-2">
              <label className="flex items-center gap-3">
                <span className="text-sm font-medium text-[#77756f] whitespace-nowrap">Zoom:</span>
                <input 
                  type="range" 
                  min="4" 
                  max="12" 
                  step="0.5"
                  value={zoom} 
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#77756f]"
                />
                <span className="text-xs text-[#77756f] w-8 text-right">{zoom.toFixed(1)}</span>
              </label>
            </div>
          </div>
        </div>

        {/* Config Panel */}
        <div className="w-full lg:w-96 bg-white rounded-3xl shadow-xl border border-gray-100 flex flex-col overflow-hidden shrink-0 lg:flex-none lg:h-full">
          <div className="p-6 bg-[#77756f] text-white shrink-0">
            <h2 className="text-2xl font-bold">Konfigurator</h2>
            <p className="text-white/70 text-sm mt-1">Stellen Sie Ihren Anhänger zusammen</p>
          </div>
          
          <div className="p-6 flex-1 overflow-y-auto custom-scrollbar space-y-8">
            {/* Counter Setup Selection */}
            <div>
              <h3 className="text-sm uppercase tracking-wider text-gray-500 font-semibold mb-4 flex items-center gap-2">
                <LayoutGrid className="w-4 h-4" /> Innenausstattung Setup
              </h3>
              <div className="space-y-3">
                {counterSetups.map(setupConfig => (
                  <button
                    key={setupConfig.id}
                    onClick={() => changeSetup(setupConfig.id)}
                    className={`w-full p-4 rounded-2xl border-2 transition-all text-left ${
                      setup === setupConfig.id
                        ? 'border-[#b08a57] bg-[#b08a57]/10 shadow-md'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-bold text-[#2f2f2d]">{setupConfig.name}</h4>
                      <span className="text-sm font-semibold text-[#b08a57]">
                        +{setupConfig.price.toLocaleString('de-DE')} €
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{setupConfig.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div>
              <h3 className="text-sm uppercase tracking-wider text-gray-500 font-semibold mb-4 flex items-center gap-2">
                <Palette className="w-4 h-4" /> Außenfarbe
              </h3>
              <div className="flex gap-4">
                {exteriorColors.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setExteriorColor(c.hex)}
                    className={`w-12 h-12 rounded-full border-2 transition-all ${exteriorColor === c.hex ? 'border-[#77756f] scale-110 shadow-md' : 'border-gray-200 hover:scale-105'}`}
                    style={{ backgroundColor: c.hex }}
                    title={`Farbe: ${c.name}`}
                  />
                ))}
              </div>
            </div>

            {/* Floor Colors */}
            <div>
              <h3 className="text-sm uppercase tracking-wider text-gray-500 font-semibold mb-4 flex items-center gap-2">
                <Palette className="w-4 h-4" /> Bodenfarbe
              </h3>
              <div className="flex gap-4">
                {floorColors.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setFloorColor(c.hex)}
                    className={`w-12 h-12 rounded-full border-2 transition-all ${floorColor === c.hex ? 'border-[#77756f] scale-110 shadow-md' : 'border-gray-200 hover:scale-105'}`}
                    style={{ backgroundColor: c.hex }}
                    title={`Farbe: ${c.name}`}
                  />
                ))}
              </div>
            </div>

            {/* Counter Colors */}
            <div>
              <h3 className="text-sm uppercase tracking-wider text-gray-500 font-semibold mb-4 flex items-center gap-2">
                <Palette className="w-4 h-4" /> Thekenfarbe
              </h3>
              <div className="flex gap-4">
                {counterColors.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setCounterColor(c.hex)}
                    className={`w-12 h-12 rounded-full border-2 transition-all ${counterColor === c.hex ? 'border-[#77756f] scale-110 shadow-md' : 'border-gray-200 hover:scale-105'}`}
                    style={{ backgroundColor: c.hex }}
                    title={`Farbe: ${c.name}`}
                  />
                ))}
              </div>
            </div>

            {/* Door Colors */}
            <div>
              <h3 className="text-sm uppercase tracking-wider text-gray-500 font-semibold mb-4 flex items-center gap-2">
                <Palette className="w-4 h-4" /> Türenfarbe
              </h3>
              <div className="flex gap-4">
                {doorColors.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setDoorColor(c.hex)}
                    className={`w-12 h-12 rounded-full border-2 transition-all ${doorColor === c.hex ? 'border-[#77756f] scale-110 shadow-md' : 'border-gray-200 hover:scale-105'}`}
                    style={{ backgroundColor: c.hex }}
                    title={`Farbe: ${c.name}`}
                  />
                ))}
              </div>
            </div>

            {/* Equipment by Category */}
            {availableEquipment.length > 0 && (
              <div>
                <h3 className="text-sm uppercase tracking-wider text-gray-500 font-semibold mb-4 flex items-center gap-2">
                  <Settings className="w-4 h-4" /> Zusätzliche Ausstattung
                </h3>
                
                <div className="space-y-6">
                  {categories.map(category => {
                    const categoryItems = availableEquipment.filter(item => item.category === category);
                    if (categoryItems.length === 0) return null;
                    
                    return (
                      <div key={category}>
                        <h4 className="text-xs font-bold text-[#b08a57] uppercase mb-3 ml-1">{category}</h4>
                        <div className="space-y-3">
                          {categoryItems.map(item => {
                            const Icon = item.icon;
                            const isSelected = equipment.includes(item.id);
                            
                            return (
                              <label 
                                key={item.id}
                                className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${
                                  isSelected 
                                    ? 'border-[#b08a57] bg-[#b08a57]/10 shadow-sm' 
                                    : 'border-gray-100 hover:bg-gray-50 hover:border-gray-200'
                                }`}
                              >
                                <input 
                                  type="checkbox" 
                                  checked={isSelected} 
                                  onChange={() => toggleEquipment(item.id)} 
                                  className="w-5 h-5 text-[#77756f] rounded focus:ring-[#b08a57]" 
                                />
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                  isSelected ? 'bg-[#b08a57]/30' : 'bg-gray-100'
                                }`}>
                                  <Icon className="w-5 h-5 text-[#77756f]" />
                                </div>
                                <div className="flex-1">
                                  <span className="block font-semibold text-[#2f2f2d] text-sm">{item.name}</span>
                                  <span className="text-sm text-gray-500">+ {item.price.toLocaleString('de-DE')} €</span>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Price & Action */}
          <div className="p-6 bg-gray-50 border-t border-gray-100 shrink-0">
            <div className="mb-4">
              {/* Collapsible Price Breakdown */}
              <button
                onClick={() => setPriceBreakdownOpen(!priceBreakdownOpen)}
                className="w-full flex items-center justify-between mb-3 text-left hover:opacity-70 transition-opacity"
              >
                <span className="text-sm text-gray-500 font-medium">Preisaufschlüsselung</span>
                {priceBreakdownOpen ? (
                  <ChevronUp className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                )}
              </button>

              {priceBreakdownOpen && (
                <div className="text-sm text-gray-500 mb-3 space-y-1 bg-white p-3 rounded-xl border border-gray-200">
                  <div className="flex justify-between">
                    <span>Basis-Anhänger:</span>
                    <span className="font-medium">8.500 €</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{currentSetup.name}:</span>
                    <span className="font-medium">+{currentSetup.price.toLocaleString('de-DE')} €</span>
                  </div>
                  {equipment.length > 0 && (
                    <div className="flex justify-between">
                      <span>Ausstattung:</span>
                      <span className="font-medium">
                        +{effectiveEquipmentItems
                          .filter(i => equipment.includes(i.id))
                          .reduce((sum, i) => sum + i.price, 0)
                          .toLocaleString('de-DE')} €
                      </span>
                    </div>
                  )}
                  {(exteriorColors.find(c => c.hex === exteriorColor)?.price ?? 0) > 0 && (
                    <div className="flex justify-between">
                      <span>Außenfarbe:</span>
                      <span className="font-medium">
                        +{exteriorColors.find(c => c.hex === exteriorColor)?.price.toLocaleString('de-DE')} €
                      </span>
                    </div>
                  )}
                  {(floorColors.find(c => c.hex === floorColor)?.price ?? 0) > 0 && (
                    <div className="flex justify-between">
                      <span>Bodenfarbe:</span>
                      <span className="font-medium">
                        +{floorColors.find(c => c.hex === floorColor)?.price.toLocaleString('de-DE')} €
                      </span>
                    </div>
                  )}
                  {(counterColors.find(c => c.hex === counterColor)?.price ?? 0) > 0 && (
                    <div className="flex justify-between">
                      <span>Thekenfarbe:</span>
                      <span className="font-medium">
                        +{counterColors.find(c => c.hex === counterColor)?.price.toLocaleString('de-DE')} €
                      </span>
                    </div>
                  )}
                  {(doorColors.find(c => c.hex === doorColor)?.price ?? 0) > 0 && (
                    <div className="flex justify-between">
                      <span>Türenfarbe:</span>
                      <span className="font-medium">
                        +{doorColors.find(c => c.hex === doorColor)?.price.toLocaleString('de-DE')} €
                      </span>
                    </div>
                  )}
                </div>
              )}
              
              <div className="pt-3 border-t border-gray-200">
                <div className="text-[#6a7282] text-sm mb-1">Gesamtpreis (Netto)</div>
                <div className="text-[#2e3c45] text-3xl font-bold">{calculatePrice().toLocaleString('de-DE')} €</div>
              </div>
            </div>
            <button 
              onClick={handleContact} 
              className="w-full bg-[#b08a57] text-[#2f2f2d] font-bold py-4 rounded-xl hover:bg-[#a1c4e0] transition-colors shadow-sm"
            >
              Angebot anfordern
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
