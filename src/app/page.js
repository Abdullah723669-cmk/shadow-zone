'use client';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import ProductCard from '@/components/ProductCard';
import styles from './page.module.css';

const Logo3D = dynamic(() => import('@/components/Logo3D'), { ssr: false });

const CATEGORIES = [
  { name: 'Mens', label: "Men's", icon: '👔', desc: 'Shirts, Pants, Jackets & more' },
  { name: 'Ladies', label: 'Ladies', icon: '👗', desc: 'Dresses, Tops, Kurtis & more' },
  { name: 'Kids', label: 'Kids', icon: '🧸', desc: 'T-Shirts, Frocks, Sets & more' },
];

const FEATURES = [
  { icon: '🚚', title: 'Free Shipping', desc: 'On orders above ৳2,000' },
  { icon: '🔄', title: 'Easy Returns', desc: '7-day return policy' },
  { icon: '🛡️', title: 'Secure Payment', desc: '100% secure checkout' },
  { icon: '💎', title: 'Premium Quality', desc: 'Handpicked fabrics' },
];

export default function HomePage() {
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
              New Collection 2026
            </div>
            <h1 className={`heading-display heading-1 ${styles.heroTitle}`}>
              Elevate Your <br />
              <span className="text-gradient">Style Game</span>
            </h1>
            <p className={styles.heroDesc}>
              Discover premium readymade fashion for the entire family.
              From sharp menswear to elegant ladies&apos; wear and adorable kids&apos; collections.
            </p>
            <div className={styles.heroActions}>
              <Link href="/shop" className="btn btn-primary btn-lg">
                Shop Now
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
              <Link href="/shop?featured=true" className="btn btn-secondary btn-lg">
                Featured Picks
              </Link>
            </div>
            <div className={styles.heroStats}>
              <div className={styles.stat}>
                <span className={styles.statNum}>60+</span>
                <span className={styles.statLabel}>Products</span>
              </div>
              <div className={styles.statDivider} />
              <div className={styles.stat}>
                <span className={styles.statNum}>3</span>
                <span className={styles.statLabel}>Categories</span>
              </div>
              <div className={styles.statDivider} />
              <div className={styles.stat}>
                <span className={styles.statNum}>15</span>
                <span className={styles.statLabel}>Sub-Categories</span>
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
            <h2 className="heading-display heading-2">Shop by <span className="text-gradient">Category</span></h2>
            <p className="text-secondary">Browse our curated collections</p>
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
              <h2 className="heading-display heading-2">Featured <span className="text-gradient">Products</span></h2>
              <p className="text-secondary mt-2">Our top picks for you</p>
            </div>
            <Link href="/shop?featured=true" className="btn btn-secondary btn-sm">
              View All
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
            <h2 className="heading-display heading-2">Ready to upgrade your wardrobe?</h2>
            <p className="text-secondary mt-2">Join Shadow Zone and discover fashion that fits your lifestyle.</p>
            <div className="flex gap-4 mt-6" style={{ justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/auth/signup" className="btn btn-primary btn-lg">
                Create Account
              </Link>
              <Link href="/shop" className="btn btn-secondary btn-lg">
                Browse Collection
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
              <h2 className="heading-display heading-2">New <span className="text-gradient">Arrivals</span></h2>
              <p className="text-secondary mt-2">Fresh additions to our collection</p>
            </div>
            <Link href="/shop?sort=created_at&order=desc" className="btn btn-secondary btn-sm">
              View All
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
