"use client";

import { useEffect, useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslations } from 'next-intl';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { fetchContactRequested } from '@/store/slices/contactSlice';
import { getIconComponent } from '@/lib/iconMap';

export default function Contact() {
  const t = useTranslations('contact');
  const dispatch = useDispatch();
  const contact = useSelector((state: RootState) => state.contact.data);
  const loading = useSelector((state: RootState) => state.contact.loading);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    }, 3000);
  };

  // fetch on mount
  useEffect(() => {
    if (!contact && !loading) {
      dispatch(fetchContactRequested());
    }
  }, [contact, loading, dispatch]);

  const items = contact?.contactInfo || [];

  return (
    <section className="contact-section">
      <div className="container-7xl">
        {/* Section Header */}
        <div className="contact-header">
          <h2 className="contact-title">{t('title')}</h2>
          <p className="contact-subtitle">{t('subtitle')}</p>
        </div>

        <div className="contact-grid">
          {/* Contact Information */}
          <div>
            <h3 className="contact-info-title">{t('info.title')}</h3>
            
            <div className="space-y-6">
              {items.map((info) => {
                const labelKey = (info.titleKey || '').replace(/^contact\./, '');
                const IconComponent = getIconComponent(info.icon);
                return (
                  <div key={info.id} className="contact-info-item">
                    <div className={`contact-info-iconwrap ${info.bgColor}`}>
                      <IconComponent className={`w-6 h-6 ${info.color}`} />
                    </div>
                    <div>
                      <h4 className="contact-info-label">{t(labelKey as any)}</h4>
                      <p className="contact-info-text">
                        {info.value}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Map or Additional Info */}
            <div className="mt-12">
              <Card className="contact-card">
                <CardContent className="contact-card-content">
                  <h4 className="font-semibold text-gray-900 mb-3">{t('visit.title')}</h4>
                  <p className="text-gray-600 mb-4">{t('visit.description')}</p>
                  <Button className="bg-[#1F396D] hover:bg-[#29335C] text-white">{t('visit.cta')}</Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h3 className="contact-form-title">{t('formSection.title')}</h3>

            {isSubmitted ? (
              <Card className="contact-success-card">
                <CardContent className="contact-success-content">
                  <div className="contact-success-iconwrap">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h4 className="contact-success-title">{t('success.title')}</h4>
                  <p className="contact-success-desc">{t('success.description')}</p>
                </CardContent>
              </Card>
            ) : (
              <Card className="contact-form-card">
                <CardContent className="contact-form-content">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">{t('form.name')}</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="contact-input"
                          placeholder={t('form.placeholders.name')}
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">{t('form.email')}</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="contact-input"
                          placeholder={t('form.placeholders.email')}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">{t('form.phone')}</label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="contact-input"
                          placeholder={t('form.placeholders.phone')}
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">{t('form.subject')}</label>
                        <select
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          required
                          className="contact-input"
                        >
                          <option value="">{t('form.subjectOptions.placeholder')}</option>
                          <option value="general">{t('form.subjectOptions.general')}</option>
                          <option value="enrollment">{t('form.subjectOptions.enrollment')}</option>
                          <option value="trial">{t('form.subjectOptions.trial')}</option>
                          <option value="assessment">{t('form.subjectOptions.assessment')}</option>
                          <option value="pricing">{t('form.subjectOptions.pricing')}</option>
                          <option value="other">{t('form.subjectOptions.other')}</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">{t('form.message')}</label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={5}
                        className="contact-textarea"
                        placeholder={t('form.placeholders.message')}
                      />
                    </div>

                    <Button
                      type="submit"
                      className="contact-submit"
                    >
                      <Send className="w-5 h-5 mr-2" />
                      {t('form.submit')}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </section>
  );
} 