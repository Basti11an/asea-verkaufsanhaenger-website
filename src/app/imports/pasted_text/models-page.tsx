Erstelle eine Modelle-Seite für ein Verkaufsanhänger-Unternehmen mit folgenden Funktionen:

HAUPTFUNKTIONEN
Modellübersicht: Grid-Layout mit 6 Anhänger-Modellen, Bildern, Preisen und Details
3D-Konfigurator: Interaktiver 3D-Trailer mit konfigurierbarer Farbe, Ausstattung und animierten Türen/Luken
View-Switcher: Umschalten zwischen "Alle Modelle" und "Gestalte deinen Anhänger"
Detail-Dialog: Modal mit vollständiger Modellbeschreibung, Features und technischen Daten
FARBSCHEMA
Primärfarbe: #B7D3E9 (hellblau)
Sekundärfarbe: #2E3C45 (dunkelgrau)
Hintergrund: #F5F7FA (hellgrau)
Akzent: #1C1F2B (fast schwarz)
STRUKTUR (3 DATEIEN)
1. /components/pages/ModelsPage.tsx
import { useState } from 'react';
import { ArrowRight, Check, Sparkles, Package, Phone } from 'lucide-react';
import { Button } from '../ui/button';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { motion } from 'motion/react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { TrailerConfigurator } from '../configurator/TrailerConfigurator';

interface Model {
  id: string;
  name: string;
  category: string;
  image: string;
  description: string;
  shortDescription: string;
  features: string[];
  specs: {
    label: string;
    value: string;
  }[];
  price: string;
}

interface ModelsPageProps {
  onNavigate: (page: string) => void;
}

export function ModelsPage({ onNavigate }: ModelsPageProps) {
  const [activeView, setActiveView] = useState<'all' | 'configure'>('all');
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);

  const models: Model[] = [
    {
      id: '1',
      name: 'ASEA Compact 250',
      category: 'compact',
      image: 'https://images.unsplash.com/photo-1760561150700-b8af77e68edf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwdHJhaWxlciUyMGJ1c2luZXNzfGVufDF8fHx8MTc2Mjg2MzMxM3ww&ixlib=rb-4.1.0&q=80&w=1080',
      shortDescription: 'Perfekt für Märkte und kleinere Events',
      description: 'Der ASEA Compact 250 ist die ideale Lösung für mobile Händler, die Flexibilität und Wendigkeit benötigen. Mit kompakten Maßen und durchdachtem Design bietet dieser Anhänger alles, was Sie für einen erfolgreichen Verkaufsstart brauchen.',
      features: [
        'Kompakte Abmessungen für einfaches Manövrieren',
        'Vollständig isolierte Verkaufskabine',
        'Elektrische Ausstattung inklusive',
        'Große Verkaufsklappe mit Gasdruckfedern',
        'Stauraum für Waren und Zubehör',
        'Hochwertige Edelstahloberflächen',
      ],
      specs: [
        { label: 'Länge', value: '2,50 m' },
        { label: 'Breite', value: '1,80 m' },
        { label: 'Höhe', value: '2,30 m' },
        { label: 'Gewicht', value: '750 kg' },
        { label: 'Zul. Gesamtgewicht', value: '1.300 kg' },
      ],
      price: 'ab 12.900 €',
    },
    {
      id: '2',
      name: 'ASEA Street Pro',
      category: 'foodtruck',
      image: 'https://images.unsplash.com/photo-1629365628992-674c410064fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwdHJ1Y2slMjBtb2Rlcm58ZW58MXx8fHwxNzYyODYzMzEzfDA&ixlib=rb-4.1.0&q=80&w=1080',
      shortDescription: 'Vollausgestatteter Foodtruck für Profis',
      description: 'Der ASEA Street Pro ist die perfekte Wahl für ambitionierte Gastronomen. Mit professioneller Küchenausstattung und modernem Design überzeugt dieser Foodtruck auf ganzer Linie.',
      features: [
        'Vollständig ausgestattete Profiküche',
        'Edelstahl-Arbeitsplatten und -Schränke',
        'Integrierte Lüftungsanlage',
        'LED-Beleuchtung innen und außen',
        'Frisch- und Abwassertanks (je 100L)',
        'Modernes, ansprechendes Design',
      ],
      specs: [
        { label: 'Länge', value: '4,50 m' },
        { label: 'Breite', value: '2,20 m' },
        { label: 'Höhe', value: '2,60 m' },
        { label: 'Gewicht', value: '1.800 kg' },
        { label: 'Zul. Gesamtgewicht', value: '3.500 kg' },
      ],
      price: 'ab 34.900 €',
    },
    {
      id: '3',
      name: 'ASEA Mobile Kitchen',
      category: 'foodtruck',
      image: 'https://images.unsplash.com/photo-1751178181702-9e95b304057f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBraXRjaGVuJTIwdmVuZG9yfGVufDF8fHx8MTc2Mjg2MzMxM3ww&ixlib=rb-4.1.0&q=80&w=1080',
      shortDescription: 'Mobile Gastro-Küche mit maximaler Ausstattung',
      description: 'Die ASEA Mobile Kitchen bietet maximalen Platz und Ausstattung für gehobene gastronomische Ansprüche. Ideal für große Events, Festivals und anspruchsvolle Catering-Services.',
      features: [
        'Großzügige Arbeitsflächen',
        'Industrielle Gastrogeräte',
        'Getrennte Zubereitungsbereiche',
        'Klimaanlage für Arbeitskomfort',
        'Integrierter Kassbereich',
        'Hochwertige Außenverkleidung',
      ],
      specs: [
        { label: 'Länge', value: '6,00 m' },
        { label: 'Breite', value: '2,50 m' },
        { label: 'Höhe', value: '2,80 m' },
        { label: 'Gewicht', value: '2.500 kg' },
        { label: 'Zul. Gesamtgewicht', value: '5.000 kg' },
      ],
      price: 'ab 49.900 €',
    },
    {
      id: '4',
      name: 'ASEA Mini Cart',
      category: 'compact',
      image: 'https://images.unsplash.com/photo-1759507058797-3530560913f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJlZXQlMjBmb29kJTIwY2FydHxlbnwxfHx8fDE3NjI4NjMzMTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
      shortDescription: 'Kleinster Verkaufsanhänger für mobilen Handel',
      description: 'Der ASEA Mini Cart ist die perfekte Einstiegslösung für mobile Händler. Kompakt, wendig und mit allem Nötigsten ausgestattet für einen erfolgreichen Start.',
      features: [
        'Ultraleichte Bauweise',
        'Einfache Handhabung',
        'Schneller Auf- und Abbau',
        'Wettergeschützte Verkaufsfläche',
        'Integrierte Aufbewahrungsfächer',
        'Attraktives Preis-Leistungs-Verhältnis',
      ],
      specs: [
        { label: 'Länge', value: '2,00 m' },
        { label: 'Breite', value: '1,50 m' },
        { label: 'Höhe', value: '2,00 m' },
        { label: 'Gewicht', value: '450 kg' },
        { label: 'Zul. Gesamtgewicht', value: '750 kg' },
      ],
      price: 'ab 7.900 €',
    },
    {
      id: '5',
      name: 'ASEA Premium XL',
      category: 'premium',
      image: 'https://images.unsplash.com/photo-1629365628992-674c410064fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwdHJ1Y2slMjBtb2Rlcm58ZW58MXx8fHwxNzYyODYzMzEzfDA&ixlib=rb-4.1.0&q=80&w=1080',
      shortDescription: 'Luxus-Foodtruck mit Spitzenausstattung',
      description: 'Der ASEA Premium XL vereint modernste Technik mit exklusivem Design. Für Gastronomen, die keine Kompromisse eingehen möchten.',
      features: [
        'Premium-Materialien und Verarbeitung',
        'Vollautomatische Systeme',
        'Designer-Innenausstattung',
        'Smart-Home-Integration',
        'Außenbeleuchtung mit LED-Effekten',
        'Individuelles Branding möglich',
      ],
      specs: [
        { label: 'Länge', value: '7,00 m' },
        { label: 'Breite', value: '2,55 m' },
        { label: 'Höhe', value: '3,00 m' },
        { label: 'Gewicht', value: '3.200 kg' },
        { label: 'Zul. Gesamtgewicht', value: '6.000 kg' },
      ],
      price: 'ab 69.900 €',
    },
    {
      id: '6',
      name: 'ASEA Custom Build',
      category: 'custom',
      image: 'https://images.unsplash.com/photo-1760561150700-b8af77e68edf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwdHJhaWxlciUyMGJ1c2luZXNzfGVufDF8fHx8MTc2Mjg2MzMxM3ww&ixlib=rb-4.1.0&q=80&w=1080',
      shortDescription: '100% individuell nach Ihren Wünschen',
      description: 'Mit dem ASEA Custom Build realisieren wir Ihre ganz persönliche Vision. Von der ersten Skizze bis zur Fertigstellung begleiten wir Sie bei Ihrem individuellen Projekt.',
      features: [
        'Vollständig maßgeschneidert',
        'Freie Material- und Designwahl',
        'Individuelle Größe und Form',
        'Persönliche Beratung und Planung',
        'Unbegrenzte Gestaltungsmöglichkeiten',
        '3D-Visualisierung vor Baubeginn',
      ],
      specs: [
        { label: 'Länge', value: 'nach Wunsch' },
        { label: 'Breite', value: 'nach Wunsch' },
        { label: 'Höhe', value: 'nach Wunsch' },
        { label: 'Gewicht', value: 'nach Konzept' },
        { label: 'Ausstattung', value: 'individuell' },
      ],
      price: 'Preis auf Anfrage',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative gradient-secondary text-white py-20 overflow-hidden">
        <motion.div 
          className="absolute -top-40 -right-40 w-96 h-96 bg-[#B7D3E9]/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.3, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <div className="container mx-auto px-6 md:px-8 lg:px-12 xl:px-24 relative z-10">
          <motion.div 
            className="max-w-3xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl lg:text-6xl mb-6">
              Unsere Modelle
            </h1>
            <p className="text-xl text-[#B7D3E9] leading-relaxed">
              Von kompakten Verkaufsanhängern bis zu luxuriösen Foodtrucks – 
              entdecken Sie unsere vielfältige Modellpalette oder lassen Sie sich 
              Ihren individuellen Traum-Anhänger bauen.
            </p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-white" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0)' }} />
      </section>

      {/* View Switcher */}
      <section className="py-8 glass border-b border-[#B7D3E9]/20 sticky top-20 z-40 backdrop-blur-xl">
        <div className="container mx-auto px-6 md:px-8 lg:px-12 xl:px-24">
          <motion.div 
            className="flex flex-wrap gap-3 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.button
              onClick={() => setActiveView('all')}
              className={`px-8 py-3 rounded-full transition-all duration-300 text-lg ${
                activeView === 'all'
                  ? 'gradient-primary text-[#1C1F2B] shadow-lg scale-105'
                  : 'glass text-[#2E3C45] hover:bg-[#B7D3E9]/10 border border-[#B7D3E9]/30'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Alle Modelle
            </motion.button>
            <motion.button
              onClick={() => setActiveView('configure')}
              className={`px-8 py-3 rounded-full transition-all duration-300 text-lg ${
                activeView === 'configure'
                  ? 'gradient-primary text-[#1C1F2B] shadow-lg scale-105'
                  : 'glass text-[#2E3C45] hover:bg-[#B7D3E9]/10 border border-[#B7D3E9]/30'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Gestalte deinen Anhänger
            </motion.button>
          </motion.div>
        </div>
      </section>

      {activeView === 'all' ? (
        <>
          {/* Models Grid */}
          <section className="py-20 gradient-accent">
            <div className="container mx-auto px-6 md:px-8 lg:px-12 xl:px-24">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {models.map((model, index) => (
                  <motion.div
                    key={model.id}
                    className="group glass rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 relative"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ y: -10 }}
                  >
                    <div className="relative h-64 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1C1F2B]/70 to-transparent z-10" />
                      <ImageWithFallback
                        src={model.image}
                        alt={model.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <motion.div 
                        className="absolute top-4 right-4 gradient-primary text-[#1C1F2B] px-3 py-1 rounded-full text-sm z-20 shadow-lg"
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: index * 0.1 + 0.3 }}
                      >
                        {model.price}
                      </motion.div>
                    </div>
                    
                    <div className="p-6 bg-white/80 backdrop-blur-sm">
                      <h3 className="text-2xl text-[#1C1F2B] mb-2">{model.name}</h3>
                      <p className="text-[#2E3C45] mb-4">{model.shortDescription}</p>
                      
                      <div className="flex gap-2">
                        <Button
                          onClick={() => setSelectedModel(model)}
                          className="flex-1 gradient-secondary text-white hover:shadow-xl transition-all duration-300 group/btn"
                        >
                          Details ansehen
                          <ArrowRight className="ml-2 group-hover/btn:translate-x-1 transition-transform" size={16} />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="absolute inset-0 bg-gradient-to-br from-[#B7D3E9]/0 to-[#B7D3E9]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 bg-white relative overflow-hidden">
            <div className="absolute top-20 right-10 w-40 h-40 border-4 border-[#B7D3E9]/20 rounded-full" />
            <div className="absolute bottom-20 left-10 w-32 h-32 border-4 border-[#B7D3E9]/20 rounded-full" />
            
            <div className="container mx-auto px-6 md:px-8 lg:px-12 xl:px-24 relative z-10">
              <motion.div 
                className="max-w-3xl mx-auto text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-3xl lg:text-4xl text-[#1C1F2B] mb-6">
                  Nicht das Richtige gefunden?
                </h2>
                <p className="text-xl text-[#2E3C45] mb-8 leading-relaxed">
                  Kein Problem! Wir fertigen auch individuelle Verkaufsanhänger nach Ihren 
                  ganz persönlichen Wünschen und Anforderungen.
                </p>
                <Button 
                  size="lg" 
                  onClick={() => onNavigate('contact')}
                  className="gradient-secondary text-white hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  Individuelle Anfrage stellen
                </Button>
              </motion.div>
            </div>
          </section>
        </>
      ) : (
        /* Configure View */
        <section className="py-12 gradient-accent min-h-screen">
          <div className="container mx-auto px-6 md:px-8 lg:px-12 xl:px-24">
            <TrailerConfigurator />
          </div>
        </section>
      )}

      {/* Model Detail Dialog */}
      <Dialog open={selectedModel !== null} onOpenChange={() => setSelectedModel(null)}>
        <DialogContent className="max-w-6xl w-full max-h-[90vh] overflow-y-auto bg-gradient-to-br from-[#F5F7FA] to-white border-2 border-[#B7D3E9]/30 p-0 custom-scrollbar">
          {selectedModel && (
            <div className="relative p-8 md:p-12">
              {/* Decorative Background Elements */}
              <div className="absolute top-0 right-0 w-96 h-96 gradient-primary opacity-5 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-96 h-96 gradient-primary opacity-5 rounded-full blur-3xl pointer-events-none" />
              
              <DialogHeader className="relative z-10 mb-8">
                <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
                  <div className="flex-1">
                    <DialogTitle className="text-4xl lg:text-5xl text-[#1C1F2B] mb-3 font-bold tracking-tight">{selectedModel.name}</DialogTitle>
                    <DialogDescription className="text-xl text-[#2E3C45] font-medium">
                      {selectedModel.shortDescription}
                    </DialogDescription>
                  </div>
                  <motion.div 
                    className="gradient-primary px-6 py-4 rounded-2xl shadow-2xl"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="text-sm font-medium text-[#2E3C45] mb-1 tracking-wide">Preis</div>
                    <div className="text-3xl text-[#1C1F2B] font-bold">{selectedModel.price}</div>
                  </motion.div>
                </div>
              </DialogHeader>
              
              <div className="space-y-8 relative z-10">
                {/* Hero Image */}
                <motion.div 
                  className="rounded-3xl overflow-hidden relative group shadow-2xl"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#B7D3E9]/30 to-transparent z-10" />
                  <ImageWithFallback
                    src={selectedModel.image}
                    alt={selectedModel.name}
                    className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </motion.div>

                {/* Description */}
                <motion.div 
                  className="bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-[#B7D3E9]/20"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-12 h-12 gradient-primary rounded-2xl flex items-center justify-center shadow-lg">
                      <Check className="text-[#1C1F2B]" size={24} />
                    </div>
                    <h3 className="text-2xl text-[#1C1F2B] font-bold">Beschreibung</h3>
                  </div>
                  <p className="text-[#2E3C45] leading-relaxed text-lg">{selectedModel.description}</p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                  {/* Features */}
                  <motion.div 
                    className="bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-[#B7D3E9]/20 h-full"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 gradient-primary rounded-2xl flex items-center justify-center shadow-lg">
                        <Sparkles className="text-[#1C1F2B]" size={24} />
                      </div>
                      <h3 className="text-2xl text-[#1C1F2B] font-bold">Ausstattung</h3>
                    </div>
                    <div className="space-y-3">
                      {selectedModel.features.map((feature, index) => (
                        <motion.div 
                          key={index} 
                          className="flex items-start gap-3 p-3 rounded-2xl hover:bg-[#B7D3E9]/10 transition-colors duration-300"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: 0.3 + index * 0.05 }}
                        >
                          <div className="w-7 h-7 gradient-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md">
                            <Check className="text-[#1C1F2B]" size={16} />
                          </div>
                          <span className="text-[#2E3C45] leading-relaxed">{feature}</span>
                        </motion.div>
                      ))}\
                    </div>
                  </motion.div>

                  {/* Technical Specs */}
                  <motion.div 
                    className="bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-[#B7D3E9]/20 h-full"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 gradient-primary rounded-2xl flex items-center justify-center shadow-lg">
                        <Package className="text-[#1C1F2B]" size={24} />
                      </div>
                      <h3 className="text-2xl text-[#1C1F2B] font-bold">Technische Daten</h3>
                    </div>
                    <div className="space-y-4">
                      {selectedModel.specs.map((spec, index) => (
                        <motion.div 
                          key={index} 
                          className="flex justify-between items-center p-4 rounded-2xl bg-gradient-to-r from-[#B7D3E9]/10 to-transparent border-l-4 border-[#B7D3E9] shadow-sm"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.3 + index * 0.05 }}
                        >
                          <span className="text-[#2E3C45] font-medium">{spec.label}</span>
                          <span className="text-[#1C1F2B] text-lg font-bold">{spec.value}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>

                {/* CTA Section */}
                <motion.div 
                  className="gradient-primary p-8 rounded-3xl shadow-2xl relative overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                  <div className="relative z-10 text-center">
                    <h3 className="text-3xl text-[#1C1F2B] mb-3 font-bold">Interessiert an diesem Modell?</h3>
                    <p className="text-[#2E3C45] text-lg mb-6">Kontaktieren Sie uns für ein individuelles Angebot oder eine Besichtigung.</p>
                    <Button 
                      size="lg" 
                      onClick={() => {
                        setSelectedModel(null);
                        onNavigate('contact');
                      }}
                      className="gradient-secondary text-white hover:shadow-xl hover:scale-105 transition-all duration-300 text-lg px-8 py-6"
                    >
                      <Phone className="mr-2" size={20} />
                      Jetzt anfragen
                    </Button>
                  </div>
                </motion.div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
2. /components/configurator/TrailerConfigurator.tsx
Diese Datei ist zu lang für den Prompt. WICHTIG: Verwende den EXAKTEN Code aus der aktuellen Datei: /components/configurator/TrailerConfigurator.tsx

3. /components/configurator/TrailerScene.tsx
Diese Datei ist zu lang für den Prompt. WICHTIG: Verwende den EXAKTEN Code aus der aktuellen Datei: /components/configurator/TrailerScene.tsx

ERFORDERLICHE CSS-KLASSEN IN /styles/globals.css
Füge folgende Klassen hinzu:

.gradient-primary {
  background: linear-gradient(135deg, #B7D3E9 0%, #a1c4e0 100%);
}

.gradient-secondary {
  background: linear-gradient(135deg, #2E3C45 0%, #1C1F2B 100%);
}

.gradient-accent {
  background: linear-gradient(180deg, #F5F7FA 0%, #ffffff 100%);
}

.glass {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.custom-scrollbar::-webkit-scrollbar {
  width: 10px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #F5F7FA;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #B7D3E9;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #a1c4e0;
}
BENÖTIGTE ABHÄNGIGKEITEN
motion/react (für Animationen)
lucide-react (für Icons)
three (für 3D-Grafik)
three/examples/jsm/controls/OrbitControls (für Kamera-Steuerung)
INTEGRATION IN BESTEHENDES PROJEKT
Erstelle die 3 Komponenten-Dateien
Füge CSS-Klassen zu globals.css hinzu
Importiere <ModelsPage onNavigate={(page) => console.log(page)} /> wo benötigt
Die onNavigate-Funktion sollte zur entsprechenden Seite navigieren (z.B. 'contact')
ANPASSUNGEN FÜR EIGENES PROJEKT
Bilder: Ersetze Unsplash-URLs durch eigene Bilder
Modell-Daten: Passe die models-Array mit eigenen Produkten an
Navigation: Implementiere onNavigate-Funktion mit eigenem Router
Preise: Aktualisiere Preise im Konfigurator (calculatePrice-Funktion)