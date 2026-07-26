import {
  Zap,
  Droplet,
  Wind,
  Thermometer,
  Lock,
  Lightbulb,
  Speaker,
  Sparkles,
  UtensilsCrossed,
  Coffee,
  Refrigerator,
  Flame,
  Shield,
  Wrench,
  Paintbrush,
  Package,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useAdminData } from '../../context/AdminDataContext';
import { useLanguage, type TranslationKey } from '../../context/LanguageContext';
import { useTouchFriendlyMotion } from '../../lib/useTouchFriendlyMotion';

interface EquipmentPageProps {
  onNavigate: (page: string, data?: any) => void;
}

const EQUIPMENT_CATEGORY_LABELS: Record<string, TranslationKey> = {
  Kühlung: 'equip_category_cooling',
  Küche: 'equip_category_kitchen',
  Getränke: 'equip_category_drinks',
  Elektrik: 'equip_category_electric',
  Außen: 'equip_category_outside',
  Einrichtung: 'equip_category_furnishing',
};

const EQUIPMENT_OPTION_LABELS: Record<string, { nameKey: TranslationKey; descKey: TranslationKey }> = {
  Kühlvitrine: { nameKey: 'equip_option_showcase_name', descKey: 'equip_option_showcase_desc' },
  Fritteuse: { nameKey: 'equip_option_fryer_name', descKey: 'equip_option_fryer_desc' },
  Warmhaltebehälter: { nameKey: 'equip_option_warmer_name', descKey: 'equip_option_warmer_desc' },
  Zapfanlage: { nameKey: 'equip_option_tap_name', descKey: 'equip_option_tap_desc' },
  'LED-Beleuchtung': { nameKey: 'equip_option_led_name', descKey: 'equip_option_led_desc' },
  Markise: { nameKey: 'equip_option_awning_name', descKey: 'equip_option_awning_desc' },
  Edelstahltheke: { nameKey: 'equip_option_counter_name', descKey: 'equip_option_counter_desc' },
  Kassenlade: { nameKey: 'equip_option_cash_name', descKey: 'equip_option_cash_desc' },
};

export function EquipmentPage({ onNavigate }: EquipmentPageProps) {
  const { equipment: adminEquipment } = useAdminData();
  const { t } = useLanguage();
  const touchFriendlyMotion = useTouchFriendlyMotion();
  const activeEquipment = adminEquipment.filter((e) => e.aktiv);
  const getCategoryLabel = (category: string) => {
    const labelKey = EQUIPMENT_CATEGORY_LABELS[category];
    return labelKey ? t(labelKey) : category;
  };

  const getEquipmentText = (item: { name: string; beschreibung: string }) => {
    const labelKeys = EQUIPMENT_OPTION_LABELS[item.name];
    return {
      name: labelKeys ? t(labelKeys.nameKey) : item.name,
      description: labelKeys ? t(labelKeys.descKey) : item.beschreibung,
    };
  };

  const KATEGORIE_COLORS: Record<string, string> = {
    Kühlung: 'bg-blue-100 text-blue-700 border-blue-200',
    Küche: 'bg-orange-100 text-orange-700 border-orange-200',
    Getränke: 'bg-cyan-100 text-cyan-700 border-cyan-200',
    Elektrik: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    Außen: 'bg-green-100 text-green-700 border-green-200',
    Einrichtung: 'bg-purple-100 text-purple-700 border-purple-200',
  };

  const equipmentCategories = [
    {
      titleKey: 'equip_cat_electric' as const,
      icon: Zap,
      items: [
        { icon: Lightbulb, nameKey: 'equip_led_name' as const, descKey: 'equip_led_desc' as const },
        { icon: Zap, nameKey: 'equip_power_name' as const, descKey: 'equip_power_desc' as const },
        { icon: Speaker, nameKey: 'equip_sound_name' as const, descKey: 'equip_sound_desc' as const },
        { icon: Sparkles, nameKey: 'equip_ext_light_name' as const, descKey: 'equip_ext_light_desc' as const },
      ],
    },
    {
      titleKey: 'equip_cat_water' as const,
      icon: Droplet,
      items: [
        { icon: Droplet, nameKey: 'equip_fresh_water_name' as const, descKey: 'equip_fresh_water_desc' as const },
        { icon: Droplet, nameKey: 'equip_waste_water_name' as const, descKey: 'equip_waste_water_desc' as const },
        { icon: Droplet, nameKey: 'equip_water_install_name' as const, descKey: 'equip_water_install_desc' as const },
        { icon: Droplet, nameKey: 'equip_sink_name' as const, descKey: 'equip_sink_desc' as const },
      ],
    },
    {
      titleKey: 'equip_cat_climate' as const,
      icon: Wind,
      items: [
        { icon: Wind, nameKey: 'equip_ventilation_name' as const, descKey: 'equip_ventilation_desc' as const },
        { icon: Thermometer, nameKey: 'equip_ac_name' as const, descKey: 'equip_ac_desc' as const },
        { icon: Wind, nameKey: 'equip_vent_windows_name' as const, descKey: 'equip_vent_windows_desc' as const },
        { icon: Thermometer, nameKey: 'equip_insulation_name' as const, descKey: 'equip_insulation_desc' as const },
      ],
    },
    {
      titleKey: 'equip_cat_kitchen' as const,
      icon: UtensilsCrossed,
      items: [
        { icon: Flame, nameKey: 'equip_cooking_name' as const, descKey: 'equip_cooking_desc' as const },
        { icon: Coffee, nameKey: 'equip_coffee_name' as const, descKey: 'equip_coffee_desc' as const },
        { icon: Refrigerator, nameKey: 'equip_fridge_name' as const, descKey: 'equip_fridge_desc' as const },
        { icon: UtensilsCrossed, nameKey: 'equip_work_surface_name' as const, descKey: 'equip_work_surface_desc' as const },
      ],
    },
    {
      titleKey: 'equip_cat_safety' as const,
      icon: Shield,
      items: [
        { icon: Shield, nameKey: 'equip_fire_ext_name' as const, descKey: 'equip_fire_ext_desc' as const },
        { icon: Lock, nameKey: 'equip_locks_name' as const, descKey: 'equip_locks_desc' as const },
        { icon: Shield, nameKey: 'equip_smoke_name' as const, descKey: 'equip_smoke_desc' as const },
        { icon: Lock, nameKey: 'equip_alarm_name' as const, descKey: 'equip_alarm_desc' as const },
      ],
    },
    {
      titleKey: 'equip_cat_design' as const,
      icon: Paintbrush,
      items: [
        { icon: Paintbrush, nameKey: 'equip_paint_name' as const, descKey: 'equip_paint_desc' as const },
        { icon: Sparkles, nameKey: 'equip_wrap_name' as const, descKey: 'equip_wrap_desc' as const },
        { icon: Package, nameKey: 'equip_cladding_name' as const, descKey: 'equip_cladding_desc' as const },
        { icon: Paintbrush, nameKey: 'equip_awning_name' as const, descKey: 'equip_awning_desc' as const },
      ],
    },
  ];

  const additionalServices = [
    { icon: Wrench, titleKey: 'equip_service1_title' as const, descKey: 'equip_service1_desc' as const },
    { icon: Shield, titleKey: 'equip_service2_title' as const, descKey: 'equip_service2_desc' as const },
    { icon: Package, titleKey: 'equip_service3_title' as const, descKey: 'equip_service3_desc' as const },
  ];

  const materials = [
    {
      titleKey: 'equip_mat_steel_title' as const,
      descKey: 'equip_mat_steel_desc' as const,
      features: ['equip_mat_steel_f1', 'equip_mat_steel_f2', 'equip_mat_steel_f3'] as const,
    },
    {
      titleKey: 'equip_mat_insul_title' as const,
      descKey: 'equip_mat_insul_desc' as const,
      features: ['equip_mat_insul_f1', 'equip_mat_insul_f2', 'equip_mat_insul_f3'] as const,
    },
    {
      titleKey: 'equip_mat_floor_title' as const,
      descKey: 'equip_mat_floor_desc' as const,
      features: ['equip_mat_floor_f1', 'equip_mat_floor_f2', 'equip_mat_floor_f3'] as const,
    },
    {
      titleKey: 'equip_mat_ext_title' as const,
      descKey: 'equip_mat_ext_desc' as const,
      features: ['equip_mat_ext_f1', 'equip_mat_ext_f2', 'equip_mat_ext_f3'] as const,
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative gradient-secondary text-white py-20 overflow-hidden">
        <div className="container mx-auto px-6 md:px-8 lg:px-12 xl:px-24 relative z-10">
          <motion.div
            className="max-w-3xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl lg:text-6xl mb-6">{t('equip_hero_title')}</h1>
            <p className="text-xl text-[#b08a57] leading-relaxed">{t('equip_hero_desc')}</p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-white" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0)' }} />
      </section>

      {/* Introduction */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 md:px-8 lg:px-12 xl:px-24">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-xl text-[#77756f] leading-relaxed">{t('equip_intro')}</p>
          </motion.div>
        </div>
      </section>

      {/* Context-Driven Equipment Options */}
      {activeEquipment.length > 0 && (
        <section className="py-16 bg-white border-t border-gray-100">
          <div className="container mx-auto px-6 md:px-8 lg:px-12 xl:px-24">
            <motion.div
              className="text-center mb-10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-3xl lg:text-4xl text-[#2f2f2d] mb-3">{t('equip_options_title')}</h2>
              <p className="text-[#77756f] max-w-xl mx-auto">{t('equip_options_subtitle')}</p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
              {activeEquipment.map((item, i) => {
                const translatedItem = getEquipmentText(item);

                return (
                  <motion.div
                    key={item.id}
                    className="glass rounded-2xl p-5 shadow-md hover:shadow-xl transition-all duration-400 flex flex-col gap-3 group"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.04 }}
                    whileHover={touchFriendlyMotion ? undefined : { y: -4 }}
                  >
                    <div className="flex items-start justify-end gap-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${KATEGORIE_COLORS[item.kategorie] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                        {getCategoryLabel(item.kategorie)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-[#2f2f2d] mb-1">{translatedItem.name}</h3>
                      <p className="text-[#77756f] text-sm leading-relaxed">{translatedItem.description}</p>
                    </div>
                    <div className="pt-2 border-t border-gray-100">
                      <span className="text-[#77756f] font-semibold">
                        € {item.preis.toLocaleString('de-AT')}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Equipment Categories */}
      <section className="py-20 gradient-accent relative overflow-hidden">
        <div className="container mx-auto px-6 md:px-8 lg:px-12 xl:px-24 relative z-10">
          <div className="space-y-20">
            {equipmentCategories.map((category, categoryIndex) => {
              return (
                <motion.div
                  key={categoryIndex}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  <div className="flex flex-col gap-2 mb-10 sm:flex-row sm:items-end sm:gap-5">
                    <span className="text-sm font-semibold text-[#b08a57]">
                      {String(categoryIndex + 1).padStart(2, '0')}
                    </span>
                    <h2 className="text-3xl lg:text-4xl text-[#2f2f2d]">{t(category.titleKey)}</h2>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {category.items.map((item, itemIndex) => (
                      <motion.div
                        key={itemIndex}
                        className="glass p-6 rounded-xl border border-[#dfd9cf] shadow-sm hover:shadow-lg transition-all duration-300"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: itemIndex * 0.04 }}
                        whileHover={touchFriendlyMotion ? undefined : { y: -4 }}
                      >
                        <h3 className="text-lg text-[#2f2f2d] mb-2">{t(item.nameKey)}</h3>
                        <p className="text-[#77756f] text-sm leading-relaxed">{t(item.descKey)}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 md:px-8 lg:px-12 xl:px-24">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl lg:text-4xl text-[#2f2f2d] mb-4">{t('equip_services_title')}</h2>
            <p className="text-xl text-[#77756f] max-w-2xl mx-auto">{t('equip_services_subtitle')}</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {additionalServices.map((service, index) => (
              <motion.div
                key={index}
                className="glass p-8 rounded-xl text-center border border-[#dfd9cf] hover:shadow-lg transition-all duration-300"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                whileHover={touchFriendlyMotion ? undefined : { y: -4 }}
              >
                <span className="block text-sm font-semibold text-[#b08a57] mb-4">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="text-xl text-[#2f2f2d] mb-3">{t(service.titleKey)}</h3>
                <p className="text-[#77756f] leading-relaxed">{t(service.descKey)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Material Info */}
      <section className="py-20 gradient-accent">
        <div className="container mx-auto px-6 md:px-8 lg:px-12 xl:px-24">
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl lg:text-4xl text-[#2f2f2d] mb-12 text-center">{t('equip_materials_title')}</h2>

            <div className="grid md:grid-cols-2 gap-8">
              {materials.map((item, index) => (
                <motion.div
                  key={index}
                  className="glass p-8 rounded-2xl hover:shadow-2xl transition-all duration-500"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={touchFriendlyMotion ? undefined : { y: -4 }}
                >
                  <h3 className="text-xl text-[#2f2f2d] mb-4">{t(item.titleKey)}</h3>
                  <p className="text-[#77756f] leading-relaxed mb-4">{t(item.descKey)}</p>
                  <ul className="space-y-2 text-[#77756f]">
                    {item.features.map((fKey) => (
                      <li key={fKey}>• {t(fKey)}</li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-primary relative overflow-hidden">
        <div className="container mx-auto px-6 md:px-8 lg:px-12 xl:px-24 relative z-10">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl lg:text-4xl mb-6 text-[#2f2f2d]">{t('equip_cta_title')}</h2>
            <p className="text-xl text-[#77756f] mb-8 leading-relaxed">{t('equip_cta_desc')}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                className="px-8 py-4 gradient-secondary text-white rounded-xl hover:shadow-2xl transition-all duration-300"
                onClick={() => onNavigate('contact')}
                whileHover={touchFriendlyMotion ? undefined : { scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
              >
                {t('equip_cta_btn1')}
              </motion.button>
              <motion.button
                className="px-8 py-4 glass-dark border border-[#77756f]/30 text-[#2f2f2d] rounded-xl hover:bg-white/20 transition-all duration-300"
                onClick={() => onNavigate('contact')}
                whileHover={touchFriendlyMotion ? undefined : { scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
              >
                {t('equip_cta_btn2')}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
