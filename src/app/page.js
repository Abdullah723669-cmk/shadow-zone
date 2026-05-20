'use client';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useTranslation } from '@/context/LanguageContext';
import ProductCard from '@/components/ProductCard';
import styles from './page.module.css';

const Logo3D = dynamic(() => import('@/components/Logo3D'), { ssr: false });

export default function HomePage() {
  const { t, language } = useTranslation();
  
  const CATEGORIES = [
    { name: 'Mens', label: t('shop.mens'), icon: '👔', desc: t('home.mensDesc') },
    { name: 'Ladies', label: t('shop.ladies'), icon: '👗', desc: t('home.ladiesDesc') },
    { name: 'Kids', label: t('shop.kids'), icon: '🧸', desc: t('home.kidsDesc') },
  ];

  const FEATURES = [
    { icon: '🚚', title: t('home.freeShipping'), desc: t('home.freeShippingDesc') },
    { icon: '🔄', title: t('home.easyReturns'), desc: t('home.easyReturnsDesc') },
    { icon: '🛡️', title: t('home.securePayment'), desc: t('home.securePaymentDesc') },
    { icon: '💎', title: t('home.premiumQuality'), desc: t('home.premiumQualityDesc') },
  ];

  const [featured, setFeatured] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [featRes, newRes] = await Promise.all([
          fetch('/api/products?featured=true&limit=8'),
          fetch('/api/products?sort=created_at&order=desc&limit=8'),
        ]);
        const featData = await featRes.json();
        const newData = await newRes.json();
        setFeatured(featData.products || []);
        setNewArrivals(newData.products || []);
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBg}>
          <div className={styles.heroGlow1} />
          <div className={styles.heroGlow2} />
          <div className={styles.heroGrid} />
        </div>
        <div className={`container ${styles.heroContent}`}>
          <div className={styles.heroLeft}>
            <div className={styles.heroBadge}>
              <span className={styles.heroBadgeDot} />
              {t('home.newCollection')}
            </div>
            <h1 className={`heading-display heading-1 ${styles.heroTitle}`}>
              {t('home.elevateYour')} <br />
              <span className="text-gradient">{t('home.style')}</span>
            </h1>
            <p className={styles.heroDesc}>
              {t('home.heroDescription')}
            </p>
            <div className={styles.heroActions}>
              <Link href="/shop" className="btn btn-primary btn-lg">
                {t('home.shopNow')}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
              <Link href="/shop?featured=true" className="btn btn-secondary btn-lg">
                {t('home.featured')}
              </Link>
            </div>
            <div className={styles.heroStats}>
              <div className={styles.stat}>
                <span className={styles.statNum}>{language === 'bn' ? '৬০+' : '60+'}</span>
                <span className={styles.statLabel}>{t('home.products')}</span>
              </div>
              <div className={styles.statDivider} />
              <div className={styles.stat}>
                <span className={styles.statNum}>{language === 'bn' ? '৩' : '3'}</span>
                <span className={styles.statLabel}>{t('home.categories')}</span>
              </div>
              <div className={styles.statDivider} />
              <div className={styles.stat}>
                <span className={styles.statNum}>{language === 'bn' ? '১৫' : '15'}</span>
                <span className={styles.statLabel}>{t('home.subCategories')}</span>
              </div>
            </div>
          </div>
          <div className={styles.heroRight}>
            <Suspense fallback={<div className={styles.logoPlaceholder} />}>
              <Logo3D size="hero" />
            </Suspense>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className={styles.features}>
        <div className="container">
          <div className={styles.featuresGrid}>
            {FEATURES.map((f, i) => (
              <div key={i} className={styles.featureItem}>
                <span className={styles.featureIcon}>{f.icon}</span>
                <div>
                  <p className={styles.featureTitle}>{f.title}</p>
                  <p className={styles.featureDesc}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section">
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className="heading-display heading-2">
              {t('home.shopByCategory').split(' ').slice(0, -2).join(' ')} <span className="text-gradient">{t('home.shopByCategory').split(' ').slice(-2).join(' ')}</span>
            </h2>
            <p className="text-secondary">{t('home.browseCollections')}</p>
          </div>
          <div className={styles.catGrid}>
            {CATEGORIES.map((cat) => (
              <Link href={`/shop?category=${cat.name}`} key={cat.name} className={styles.catCard}>
                <div className={styles.catGlow} />
                <span className={styles.catIcon}>{cat.icon}</span>
                <h3 className={styles.catName}>{cat.label}</h3>
                <p className={styles.catDesc}>{cat.desc}</p>
                <span className={styles.catArrow}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                     <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <div>
              <h2 className="heading-display heading-2">
                {t('home.featuredProducts').split(' ')[0]} <span className="text-gradient">{t('home.featuredProducts').split(' ').slice(1).join(' ')}</span>
              </h2>
              <p className="text-secondary mt-2">{t('home.topPicks')}</p>
            </div>
            <Link href="/shop?featured=true" className="btn btn-secondary btn-sm">
              {t('common.viewAll')}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
            </Link>
          </div>
          {loading ? (
            <div className="grid grid-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className={styles.skelCard}>
                  <div className={`skeleton ${styles.skelImg}`} />
                  <div style={{ padding: 16 }}>
                    <div className="skeleton" style={{ height: 12, width: '40%', marginBottom: 8 }} />
                    <div className="skeleton" style={{ height: 16, width: '80%', marginBottom: 8 }} />
                    <div className="skeleton" style={{ height: 14, width: '30%' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-4">
              {featured.slice(0, 8).map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Banner */}
      <section className={styles.cta}>
        <div className="container">
          <div className={styles.ctaInner}>
            <div className={styles.ctaGlow} />
            <h2 className="heading-display heading-2">{t('home.readyToUpgrade')}</h2>
            <p className="text-secondary mt-2">{t('home.ctaDesc')}</p>
            <div className="flex gap-4 mt-6" style={{ justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/auth/signup" className="btn btn-primary btn-lg">
                {t('common.signup')}
              </Link>
              <Link href="/shop" className="btn btn-secondary btn-lg">
                {t('home.browseCollection')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="section">
        <div className="container">
          <div className={styles.sectionHeader}>
            <div>
              <h2 className="heading-display heading-2">
                {t('home.newArrivals').split(' ')[0]} <span className="text-gradient">{t('home.newArrivals').split(' ').slice(1).join(' ')}</span>
              </h2>
              <p className="text-secondary mt-2">{t('home.newAdditions')}</p>
            </div>
            <Link href="/shop?sort=created_at&order=desc" className="btn btn-secondary btn-sm">
              {t('common.viewAll')}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
            </Link>
          </div>
          {!loading && (
            <div className="grid grid-4">
              {newArrivals.slice(0, 8).map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
