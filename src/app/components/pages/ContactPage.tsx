import { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { useLanguage } from '../../context/LanguageContext';
import { ReferenceSubmitPanel } from '../references/ReferenceSubmitPanel';

export function ContactPage({ prefillData }: { prefillData?: any }) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: prefillData?.subject || '',
    message: prefillData?.message || '',
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const formElement = document.getElementById('contact-form');
    if (formElement) {
      setTimeout(() => {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-[#f8f7f3] py-16 md:py-20">
        <div className="container mx-auto px-6 md:px-8 lg:px-12 xl:px-24">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl lg:text-6xl mb-4 md:mb-6 text-[#2f2f2d]">{t('contact_hero_title')}</h1>
            <p className="text-base md:text-xl text-[#77756f] leading-relaxed">{t('contact_hero_desc')}</p>
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section id="contact-form" className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-6 md:px-8 lg:px-12 xl:px-24">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <div className="mb-8">
                <h2 className="text-3xl lg:text-4xl text-[#2f2f2d] mb-4">{t('contact_form_title')}</h2>
                <p className="text-[#77756f] leading-relaxed">{t('contact_form_subtitle')}</p>
              </div>

              {submitted ? (
                <div className="bg-[#f3efe8] border border-[#b08a57]/30 rounded-xl p-8 text-center">
                  <CheckCircle2 className="text-[#b08a57] mx-auto mb-4" size={48} />
                  <h3 className="text-2xl text-[#2f2f2d] mb-2">{t('contact_success_title')}</h3>
                  <p className="text-[#77756f]">{t('contact_success_desc')}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="name">{t('contact_name_label')}</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={t('contact_name_placeholder')}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">{t('contact_email_label')}</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder={t('contact_email_placeholder')}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">
                      {t('contact_phone_label')}{' '}
                      <span className="text-[#77756f]/55 text-sm font-normal">(optional)</span>
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder={t('contact_phone_placeholder')}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="subject">{t('contact_subject_label')}</Label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder={t('contact_subject_placeholder')}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">{t('contact_message_label')}</Label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      placeholder={t('contact_message_placeholder')}
                      className="mt-2 min-h-[150px]"
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full gradient-primary text-white hover:shadow-xl hover:scale-105 transition-all duration-300"
                  >
                    <Send className="mr-2" size={20} />
                    {t('contact_send_btn')}
                  </Button>

                  <p className="text-sm text-[#77756f] text-center">{t('contact_privacy_note')}</p>
                </form>
              )}
            </div>

            {/* Map & Additional Info */}
            <div>
              <div className="mb-6">
                <h2 className="text-3xl lg:text-4xl text-[#2f2f2d] mb-4">{t('contact_map_title')}</h2>
                <p className="text-[#77756f] leading-relaxed">{t('contact_map_desc')}</p>
              </div>

              <div className="rounded-xl overflow-hidden shadow-md h-80 mb-6">
                <iframe
                  src="https://maps.google.com/maps?q=Lahrndorf+34,+A-4240+Waldburg,+%C3%96sterreich&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Standort Verkaufsanhänger ASEA"
                />
              </div>

              <div className="bg-[#f3efe8] p-6 rounded-xl">
                <h3 className="text-xl text-[#2f2f2d] mb-4">{t('contact_directions_title')}</h3>
                <div className="space-y-3 text-[#77756f]">
                  <p>
                    <strong>{t('contact_directions_address_label')}</strong><br />
                    Lahrndorf 34, A-4240 Waldburg
                  </p>
                  <p>
                    <strong>{t('contact_directions_car_label')}</strong><br />
                    {t('contact_directions_car_text')}
                  </p>
                  <p>
                    <strong>{t('contact_directions_parking_label')}</strong><br />
                    {t('contact_directions_parking_text')}
                  </p>
                  <p>
                    <strong>{t('contact_directions_note_label')}</strong><br />
                    {t('contact_directions_note_text')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information Cards */}
      <section className="py-12 md:py-16 bg-[#f8f7f3]">
        <div className="container mx-auto px-6 md:px-8 lg:px-12 xl:px-24">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-[#f3efe8] rounded-lg flex items-center justify-center mb-4">
                <MapPin className="text-[#b08a57]" size={24} />
              </div>
              <h3 className="text-lg text-[#2f2f2d] mb-2">{t('contact_addr_card_title')}</h3>
              <p className="text-[#77756f]">Lahrndorf 34<br />A-4240 Waldburg<br />Österreich</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-[#f3efe8] rounded-lg flex items-center justify-center mb-4">
                <Phone className="text-[#b08a57]" size={24} />
              </div>
              <h3 className="text-lg text-[#2f2f2d] mb-2">{t('contact_phone_card_title')}</h3>
              <a href="tel:+436644105007" className="text-[#77756f] hover:text-[#b08a57] transition-colors">
                +43 664 410 5 007
              </a>
              <p className="text-[#77756f]/70 text-sm mt-1">{t('contact_hours_mofr')}</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-[#f3efe8] rounded-lg flex items-center justify-center mb-4">
                <Mail className="text-[#b08a57]" size={24} />
              </div>
              <h3 className="text-lg text-[#2f2f2d] mb-2">{t('contact_email_card_title')}</h3>
              <a href="mailto:office@verkaufsanhaenger-asea.at" className="text-[#77756f] hover:text-[#b08a57] transition-colors break-all">
                office@verkaufsanhaenger-asea.at
              </a>
              <p className="text-[#77756f]/70 text-sm mt-1">{t('contact_hours_response')}</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-[#f3efe8] rounded-lg flex items-center justify-center mb-4">
                <Clock className="text-[#b08a57]" size={24} />
              </div>
              <h3 className="text-lg text-[#2f2f2d] mb-2">{t('contact_hours_card_title')}</h3>
              <div className="text-[#77756f] text-sm space-y-1">
                <p>{t('contact_hours_mofr')}</p>
                <p>{t('contact_hours_sat')}</p>
                <p>{t('contact_hours_sun')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-6 md:px-8 lg:px-12 xl:px-24">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl md:text-3xl lg:text-4xl text-[#2f2f2d] mb-3 md:mb-4">{t('contact_faq_title')}</h2>
              <p className="text-base md:text-xl text-[#77756f]">{t('contact_faq_subtitle')}</p>
            </div>

            <div className="space-y-6">
              {([
                ['contact_faq1_q', 'contact_faq1_a'],
                ['contact_faq2_q', 'contact_faq2_a'],
                ['contact_faq3_q', 'contact_faq3_a'],
                ['contact_faq4_q', 'contact_faq4_a'],
                ['contact_faq5_q', 'contact_faq5_a'],
              ] as const).map(([qKey, aKey]) => (
                <div key={qKey} className="bg-[#f8f7f3] p-6 rounded-xl shadow-sm">
                  <h3 className="text-xl text-[#2f2f2d] mb-2">{t(qKey)}</h3>
                  <p className="text-[#77756f]">{t(aKey)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 gradient-primary text-white">
        <div className="container mx-auto px-6 md:px-8 lg:px-12 xl:px-24">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl lg:text-4xl mb-4 md:mb-6 font-bold">{t('contact_cta_title')}</h2>
            <p className="text-base md:text-xl text-white/85 mb-6 md:mb-8 leading-relaxed">{t('contact_cta_desc')}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-[#b08a57] hover:bg-white/90 hover:shadow-xl hover:scale-105 transition-all duration-300 font-semibold">
                <Phone className="mr-2" size={20} />
                +43 664 410 5 007
              </Button>
              <Button size="lg" className="border-2 border-white text-white hover:bg-white/20 hover:scale-105 transition-all duration-300 font-semibold">
                <Mail className="mr-2" size={20} />
                {t('contact_cta_email')}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Submission */}
      <section className="py-16 md:py-20 bg-[#f8f7f3]">
        <div className="container mx-auto px-6 md:px-8 lg:px-12 xl:px-24">
          <ReferenceSubmitPanel
            description="Haben Sie bereits mit ASEA gearbeitet? Reichen Sie Ihre Erfahrung hier ein. Nach der Prüfung im Admin-Bereich wird sie veröffentlicht."
            buttonLabel="Bewertung schreiben"
          />
        </div>
      </section>
    </div>
  );
}
