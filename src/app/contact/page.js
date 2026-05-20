'use client';
import { useState } from 'react';
import { useToast } from '@/context/ToastContext';
import { useTranslation } from '@/context/LanguageContext';
import styles from './contact.module.css';

export default function ContactPage() {
  const toast = useToast();
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const INFO = [
    { icon: '📍', title: t('contact.visitUs'), lines: ['123 Fashion Street, Gulshan-2', 'Dhaka 1212, Bangladesh'] },
    { icon: '📞', title: t('contact.callUs'), lines: ['+880 1700-000000', '+880 1800-000000'] },
    { icon: '✉️', title: t('contact.emailUs'), lines: ['support@shadowzone.com', 'hello@shadowzone.com'] },
    { icon: '🕐', title: t('contact.businessHours'), lines: ['Sat - Thu: 10AM - 8PM', 'Friday: Closed'] },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error(t('contact.fillRequired'));
      return;
    }
    setLoading(true);
    // Simulate send
    await new Promise(r => setTimeout(r, 1500));
    toast.success(t('contact.messageSentSuccess'));
    setForm({ name: '', email: '', subject: '', message: '' });
    setLoading(false);
  };

  const update = (key) => (e) => setForm(prev => ({ ...prev, [key]: e.target.value }));

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroGlow} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <span className={styles.eyebrow}>{t('contact.getInTouch')}</span>
          <h1 className="heading-display heading-1">
            {t('contact.heroTitle').split('Hear From You')[0]}<span className="text-gradient">Hear From You</span>
          </h1>
          <p className={styles.heroDesc}>
            {t('contact.heroDesc')}
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className={styles.infoSection}>
        <div className="container">
          <div className={styles.infoGrid}>
            {INFO.map((item, i) => (
              <div key={i} className={styles.infoCard}>
                <span className={styles.infoIcon}>{item.icon}</span>
                <h3 className={styles.infoTitle}>{item.title}</h3>
                {item.lines.map((line, j) => (
                  <p key={j} className={styles.infoLine}>{line}</p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form + Map */}
      <section className="section">
        <div className="container">
          <div className={styles.formGrid}>
            {/* Contact Form */}
            <div className={styles.formCard}>
              <h2 className="heading-display heading-3 mb-2">{t('contact.sendAMessage')}</h2>
              <p className="text-muted text-sm mb-6">{t('contact.formDesc')}</p>
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formRow}>
                  <div className="input-group">
                    <label>{t('contact.fullName')} *</label>
                    <input className="input" placeholder="John Doe" value={form.name} onChange={update('name')} required />
                  </div>
                  <div className="input-group">
                    <label>{t('contact.email')} *</label>
                    <input className="input" type="email" placeholder="your@email.com" value={form.email} onChange={update('email')} required />
                  </div>
                </div>
                <div className="input-group">
                  <label>{t('contact.subject')}</label>
                  <input className="input" placeholder="How can we help?" value={form.subject} onChange={update('subject')} />
                </div>
                <div className="input-group">
                  <label>{t('contact.message')} *</label>
                  <textarea className="input" rows={5} placeholder="Tell us more..." value={form.message} onChange={update('message')} required />
                </div>
                <button type="submit" className="btn btn-primary btn-lg w-full" disabled={loading}>
                  {loading ? <span className="spinner" /> : (
                    <>
                      {t('contact.sendMessage')}
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m22 2-7 20-4-9-9-4z"/><path d="m22 2-10 10"/></svg>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Map Placeholder */}
            <div className={styles.mapCard}>
              <div className={styles.mapInner}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.6404!2d90.4152!3d23.7808!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDQ2JzUxLjAiTiA5MMKwMjQnNTQuNyJF!5e0!3m2!1sen!2sbd!4v1"
                  width="100%"
                  height="100%"
                  style={{ border: 0, borderRadius: 'var(--radius-lg)', minHeight: 400 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Shadow Zone Location"
                />
              </div>
              <div className={styles.mapOverlay}>
                <div className={styles.mapBadge}>
                  <span>📍</span>
                  <div>
                    <p className="font-semibold text-sm">{t('contact.shadowZoneHQ')}</p>
                    <p className="text-xs text-muted">Gulshan-2, Dhaka</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container" style={{ maxWidth: 800 }}>
          <div className={styles.sectionHeader}>
            <h2 className="heading-display heading-2">{t('contact.faq').split('Asked')[0]}<span className="text-gradient">Asked</span></h2>
          </div>
          {[
            { q: 'What are your delivery timelines?', a: 'We deliver within Dhaka in 1-2 business days, and outside Dhaka in 3-5 business days.' },
            { q: 'Do you offer cash on delivery?', a: 'Yes! We accept Cash on Delivery (COD), bKash, and card payments for your convenience.' },
            { q: 'What is your return policy?', a: 'We offer a 7-day easy return policy. If the product doesn\'t fit or has defects, we\'ll arrange a easy pickup.' },
            { q: 'Can I track my order?', a: 'Absolutely! Once your order is shipped, you\'ll receive tracking details via email and your dashboard.' },
          ].map((faq, i) => (
            <details key={i} className={styles.faqItem}>
              <summary className={styles.faqQuestion}>
                {faq.q}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.faqChevron}><path d="m6 9 6 6 6-6"/></svg>
              </summary>
              <p className={styles.faqAnswer}>{faq.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
