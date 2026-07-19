import { useState } from 'react';
import { ArrowLeft, Check, Sparkles, Phone } from 'lucide-react';
import { Button } from '../ui/button';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { motion } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext';

interface Model {
  id: string;
  name: string;
  category: string;
  image: string;
  images?: string[];
  description: string;
  shortDescription: string;
  features: string[];
  specs: { label: string; value: string }[];
  price: string;
  baseEquipment: string[];
  construction: string[];
}

interface ModelDetailPageProps {
  model: Model;
  onNavigate: (page: string, data?: any) => void;
}

export function ModelDetailPage({ model, onNavigate }: ModelDetailPageProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { t } = useLanguage();

  const images = model.images || [model.image, model.image, model.image, model.image];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f7f3] to-white">
      {/* Breadcrumb / Back Navigation */}
      <div className="glass border-b border-[#b08a57]/20 sticky top-[92px] z-40 backdrop-blur-xl">
        <div className="container mx-auto px-6 md:px-8 lg:px-12 xl:px-24 py-4">
          <button
            onClick={() => onNavigate('models')}
            className="flex items-center gap-2 text-[#77756f] hover:text-[#2f2f2d] transition-colors duration-300 group"
          >
            <ArrowLeft className="group-hover:-translate-x-1 transition-transform" size={20} />
            <span className="font-medium">{t('detail_back')}</span>
          </button>
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-8 lg:px-12 xl:px-24 py-12">
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Left Column - Images */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="glass rounded-3xl overflow-hidden shadow-2xl border border-[#b08a57]/20 mb-6">
              <div className="relative aspect-[4/3] bg-[#f8f7f3]">
                <ImageWithFallback
                  src={images[selectedImageIndex]}
                  alt={`${model.name} - ${selectedImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 sm:gap-4">
              {images.map((img, index) => (
                <motion.button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`glass rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                    selectedImageIndex === index
                      ? 'border-[#b08a57] shadow-lg scale-105'
                      : 'border-transparent hover:border-[#b08a57]/50'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="aspect-[4/3] bg-[#f8f7f3]">
                    <ImageWithFallback
                      src={img}
                      alt={`${model.name} - ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Right Column - Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-8">
              <h1 className="text-4xl lg:text-5xl text-[#2f2f2d] mb-3 font-bold">{model.name}</h1>
              <p className="text-xl text-[#77756f] mb-6">{model.shortDescription}</p>
              <div className="gradient-primary inline-block px-8 py-4 rounded-2xl shadow-xl border border-[#b08a57]/30">
                <div className="text-sm font-semibold text-[#77756f] mb-1 uppercase tracking-wider">{t('detail_price_from')}</div>
                <div className="text-3xl text-[#2f2f2d] font-bold">{model.price}</div>
              </div>
            </div>

            {/* Technical Details */}
            <div className="glass rounded-2xl p-6 mb-6 border border-[#b08a57]/20">
              <h3 className="text-xl text-[#2f2f2d] font-bold mb-4">{t('detail_technical_title')}</h3>
              <div className="space-y-3">
                {model.specs.map((spec, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-2 border-b border-[#b08a57]/20 last:border-0"
                  >
                    <span className="text-[#77756f] font-medium">{spec.label}</span>
                    <span className="text-[#2f2f2d] font-bold">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button
                size="lg"
                onClick={() => onNavigate('contact', { model: model.name })}
                className="flex-1 gradient-secondary text-white hover:shadow-xl hover:scale-105 transition-all duration-300 text-lg py-6"
              >
                <Phone className="mr-2" size={20} />
                {t('detail_enquire')}
              </Button>
              {model.category === 'sales' && (
                <Button
                  size="lg"
                  onClick={() => onNavigate('configurator')}
                  className="flex-1 gradient-primary text-[#2f2f2d] hover:shadow-xl hover:scale-105 transition-all duration-300 text-lg py-6 border-2 border-[#b08a57]"
                >
                  <Sparkles className="mr-2" size={20} />
                  {t('detail_configure')}
                </Button>
              )}
            </div>

            {/* Delivery Time */}
            <div className="glass rounded-xl p-4 border border-[#b08a57]/20 bg-[#b08a57]/5">
              <p className="text-sm text-[#77756f]">
                <span className="font-bold">{t('detail_delivery_label')}</span> {t('detail_delivery_weeks')}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Description Section */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="glass rounded-3xl p-8 md:p-12 border border-[#b08a57]/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center">
                <Sparkles className="text-[#2f2f2d]" size={24} />
              </div>
              <h2 className="text-3xl text-[#2f2f2d] font-bold">{t('detail_description_title')}</h2>
            </div>
            <p className="text-[#77756f] leading-relaxed text-lg">{model.description}</p>
          </div>
        </motion.div>

        {/* Base Equipment & Construction */}
        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="glass rounded-3xl p-8 border border-[#b08a57]/20 h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
                  <Check className="text-[#2f2f2d]" size={20} />
                </div>
                <h3 className="text-2xl text-[#2f2f2d] font-bold">{t('detail_base_equip_title')}</h3>
              </div>
              <div className="space-y-3">
                {model.baseEquipment.map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
                  >
                    <div className="w-6 h-6 gradient-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="text-[#2f2f2d]" size={14} />
                    </div>
                    <span className="text-[#77756f]">{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="glass rounded-3xl p-8 border border-[#b08a57]/20 h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
                  <Check className="text-[#2f2f2d]" size={20} />
                </div>
                <h3 className="text-2xl text-[#2f2f2d] font-bold">{t('detail_construction_title')}</h3>
              </div>
              <div className="space-y-3">
                {model.construction.map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                  >
                    <div className="w-6 h-6 gradient-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="text-[#2f2f2d]" size={14} />
                    </div>
                    <span className="text-[#77756f]">{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="mt-16 bg-[#c8a96e] p-8 md:p-12 rounded-3xl shadow-2xl relative overflow-hidden border border-[#9a7445]/25"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#d8bf8c] via-[#c8a96e] to-[#b08a57]" />
          <div className="relative z-10 text-center">
            <h3 className="text-3xl md:text-4xl text-[#1c1c1a] mb-4 font-bold">{t('detail_cta_title')}</h3>
            <p className="text-[#2f2f2d] text-lg mb-8 max-w-2xl mx-auto">
              {model.category === 'sales'
                ? t('detail_cta_desc_sales')
                : t('detail_cta_desc_other')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => onNavigate('contact', { model: model.name })}
                className="bg-[#1c1c1a] text-white hover:bg-[#2f2f2d] hover:shadow-xl hover:scale-105 transition-all duration-300 text-lg px-10 py-6 border border-[#1c1c1a]"
              >
                <Phone className="mr-2" size={22} />
                {t('detail_contact_btn')}
              </Button>
              {model.category === 'sales' && (
                <Button
                  size="lg"
                  onClick={() => onNavigate('configurator')}
                  className="bg-white text-[#1c1c1a] hover:bg-[#f8f7f3] hover:shadow-xl hover:scale-105 transition-all duration-300 text-lg px-10 py-6 border border-white"
                >
                  <Sparkles className="mr-2" size={22} />
                  {t('detail_configure_now')}
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
