'use client';
import { useState } from 'react';
import styles from './policy.module.css';

const POLICIES = [
  {
    id: 'privacy',
    title: 'Privacy Policy',
    icon: '🔒',
    updated: 'May 1, 2025',
    sections: [
      { heading: 'Information We Collect', content: 'We collect personal information you provide during account registration, purchases, and customer support interactions. This includes your name, email address, phone number, shipping address, and payment details. We also automatically collect technical data such as your IP address, browser type, device information, and browsing behavior through cookies and similar technologies.' },
      { heading: 'How We Use Your Data', content: 'Your personal data is used to process and fulfill orders, communicate order updates, provide customer support, personalize your shopping experience, send promotional offers (with your consent), prevent fraud, and improve our platform. We analyze aggregated, anonymized data to understand trends and improve our services.' },
      { heading: 'Data Sharing', content: 'We do not sell your personal data to third parties. We share your information only with trusted service providers who assist us in operating our platform (e.g., payment processors, shipping partners, analytics services). All third-party partners are bound by strict confidentiality agreements.' },
      { heading: 'Data Security', content: 'We employ industry-standard security measures including SSL encryption, secure payment gateways, hashed passwords (bcrypt), and regular security audits. Your payment information is processed securely through our payment partners and is never stored on our servers.' },
      { heading: 'Your Rights', content: 'You have the right to access, update, correct, or delete your personal data at any time through your account dashboard. You may opt out of marketing communications via the unsubscribe link in any email. For data deletion requests, contact us at privacy@shadowzone.com.' },
      { heading: 'Cookies', content: 'We use essential cookies for site functionality and authentication, plus optional analytics cookies to improve your experience. You can manage cookie preferences through your browser settings. Essential cookies cannot be disabled as they are necessary for the site to function properly.' },
    ],
  },
  {
    id: 'terms',
    title: 'Terms of Service',
    icon: '📜',
    updated: 'May 1, 2025',
    sections: [
      { heading: 'Acceptance of Terms', content: 'By accessing or using Shadow Zone\'s website and services, you agree to be bound by these Terms of Service. If you do not agree, please do not use our platform. We reserve the right to modify these terms at any time, and continued use constitutes acceptance of updated terms.' },
      { heading: 'Account Responsibilities', content: 'You are responsible for maintaining the confidentiality of your account credentials. You must provide accurate and complete information during registration. You agree not to share your account, use another person\'s account, or create multiple accounts. Any activity under your account is your responsibility.' },
      { heading: 'Product Information', content: 'We strive to display accurate product descriptions, images, and prices. However, slight color variations may occur due to screen differences. We reserve the right to correct any errors in pricing or descriptions. If a product is mispriced, we will notify you and offer the option to cancel or proceed at the correct price.' },
      { heading: 'Order & Payment', content: 'All orders are subject to availability and confirmation. We accept Cash on Delivery (COD), bKash, and card payments. Prices are listed in Bangladeshi Taka (৳). We reserve the right to refuse or cancel any order for reasons including suspected fraud, inventory issues, or pricing errors.' },
      { heading: 'Intellectual Property', content: 'All content on Shadow Zone — including logos, text, images, graphics, and software — is the intellectual property of Shadow Zone and is protected by copyright and trademark laws. You may not reproduce, distribute, or use any content without our prior written consent.' },
      { heading: 'Limitation of Liability', content: 'Shadow Zone shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of our platform. Our total liability for any claim shall not exceed the amount paid by you for the specific product or service in question.' },
    ],
  },
  {
    id: 'returns',
    title: 'Return & Refund Policy',
    icon: '🔄',
    updated: 'May 1, 2025',
    sections: [
      { heading: 'Return Window', content: 'You may return any product within 7 days of delivery. The item must be unworn, unwashed, in its original packaging, and with all tags attached. Items that show signs of use, alteration, or damage caused by the customer are not eligible for return.' },
      { heading: 'Return Process', content: 'To initiate a return, log into your account dashboard and navigate to your order history. Select the item you wish to return and choose a reason. Our team will review your request within 24 hours and provide return instructions. For within Dhaka, we offer free pickup service.' },
      { heading: 'Refund Policy', content: 'Once we receive and inspect the returned item, refunds are processed within 3-5 business days. Refunds are issued to the original payment method. For COD orders, refunds are sent via bKash or bank transfer. Shipping fees are non-refundable unless the return is due to our error.' },
      { heading: 'Exchange', content: 'We offer one-time free exchange for size or color within the 7-day window. Exchanges are subject to availability. If the desired size or color is unavailable, you may opt for a refund or choose an alternative product of equal value.' },
      { heading: 'Non-Returnable Items', content: 'The following items are non-returnable: innerwear, socks, swimwear, customized/personalized items, and items purchased during final sale promotions. Gift cards are also non-refundable and non-transferable.' },
      { heading: 'Damaged or Defective Items', content: 'If you receive a damaged or defective item, please contact us within 48 hours of delivery with photographic evidence. We will arrange a free replacement or full refund at no additional cost to you.' },
    ],
  },
  {
    id: 'shipping',
    title: 'Shipping Policy',
    icon: '🚚',
    updated: 'May 1, 2025',
    sections: [
      { heading: 'Delivery Areas', content: 'We currently deliver across all 64 districts of Bangladesh. International shipping is planned for late 2025. Orders are processed from our Dhaka warehouse and dispatched within 1-2 business days of confirmation.' },
      { heading: 'Shipping Rates', content: 'Orders above ৳2,000 qualify for free standard shipping. For orders below ৳2,000, a flat delivery fee of ৳100 applies. Express delivery (same-day within Dhaka) is available at ৳200 for eligible orders placed before 12 PM.' },
      { heading: 'Delivery Timelines', content: 'Inside Dhaka: 1-2 business days. Outside Dhaka (major cities): 2-3 business days. Remote areas: 3-5 business days. Timelines may vary during peak seasons (Eid, Puja), natural disasters, or unforeseen circumstances.' },
      { heading: 'Order Tracking', content: 'Once your order is shipped, you will receive tracking details via email and SMS. You can also track your order in real-time from your account dashboard under "My Orders." Our support team is available to assist with any delivery queries.' },
      { heading: 'Failed Delivery', content: 'If a delivery attempt fails due to an incorrect address or unavailability, our courier partner will attempt delivery up to 2 additional times. After 3 failed attempts, the order will be returned to our warehouse and a re-delivery fee may apply.' },
    ],
  },
];

export default function PolicyPage() {
  const [activePolicy, setActivePolicy] = useState('privacy');
  const current = POLICIES.find(p => p.id === activePolicy);

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroGlow} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <span className={styles.eyebrow}>Legal & Policies</span>
          <h1 className="heading-display heading-1">
            Our <span className="text-gradient">Policies</span>
          </h1>
          <p className={styles.heroDesc}>
            Transparency is at the core of everything we do. Read our policies to understand how we protect your data and serve you.
          </p>
        </div>
      </section>

      {/* Policy Content */}
      <section className="section">
        <div className="container">
          <div className={styles.layout}>
            {/* Sidebar Navigation */}
            <nav className={styles.sidebar}>
              {POLICIES.map(p => (
                <button
                  key={p.id}
                  className={`${styles.navItem} ${activePolicy === p.id ? styles.navItemActive : ''}`}
                  onClick={() => setActivePolicy(p.id)}
                >
                  <span className={styles.navIcon}>{p.icon}</span>
                  <div>
                    <p className={styles.navTitle}>{p.title}</p>
                    <p className={styles.navDate}>Updated {p.updated}</p>
                  </div>
                </button>
              ))}
            </nav>

            {/* Content */}
            <div className={styles.content}>
              <div className={styles.contentHeader}>
                <span className={styles.contentIcon}>{current.icon}</span>
                <div>
                  <h2 className="heading-display heading-2">{current.title}</h2>
                  <p className="text-sm text-muted mt-1">Last updated: {current.updated}</p>
                </div>
              </div>

              <div className={styles.sections}>
                {current.sections.map((section, i) => (
                  <div key={i} className={styles.section}>
                    <h3 className={styles.sectionTitle}>
                      <span className={styles.sectionNum}>{String(i + 1).padStart(2, '0')}</span>
                      {section.heading}
                    </h3>
                    <p className={styles.sectionContent}>{section.content}</p>
                  </div>
                ))}
              </div>

              {/* Contact CTA */}
              <div className={styles.cta}>
                <div className={styles.ctaInner}>
                  <p className="font-semibold">Have questions about our policies?</p>
                  <p className="text-sm text-muted mt-1">Our support team is happy to help.</p>
                  <a href="/contact" className="btn btn-primary btn-sm mt-4">Contact Support</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
