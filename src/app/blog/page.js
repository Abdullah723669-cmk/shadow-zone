'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/context/LanguageContext';
import styles from './blog.module.css';

const BLOG_POSTS = [
  {
    id: 'summer-trends-2025',
    title: '10 Summer Fashion Trends to Watch in 2025',
    excerpt: 'From breathable linens to vibrant pastels, here are the hottest trends this summer that will transform your wardrobe and keep you stylishly cool.',
    category: 'Trends',
    date: 'May 12, 2025',
    readTime: '5 min read',
    image: '🌞',
    featured: true,
  },
  {
    id: 'sustainable-fashion',
    title: 'Our Commitment to Sustainable Fashion',
    excerpt: 'Learn how Shadow Zone is reducing its carbon footprint through eco-friendly fabrics, ethical sourcing, and responsible manufacturing practices.',
    category: 'Sustainability',
    date: 'May 5, 2025',
    readTime: '4 min read',
    image: '🌱',
    featured: true,
  },
  {
    id: 'kids-collection-guide',
    title: 'The Ultimate Guide to Kids\' Fashion That Lasts',
    excerpt: 'Choosing durable, comfortable, and stylish clothing for your little ones doesn\'t have to be hard. Here\'s our expert guide to kids\' fashion.',
    category: 'Guide',
    date: 'Apr 28, 2025',
    readTime: '6 min read',
    image: '👶',
    featured: false,
  },
  {
    id: 'office-wear-essentials',
    title: '5 Must-Have Office Wear Essentials for Men',
    excerpt: 'Build a versatile work wardrobe with these timeless pieces that transition seamlessly from boardroom to after-work social events.',
    category: 'Men\'s Fashion',
    date: 'Apr 20, 2025',
    readTime: '4 min read',
    image: '👔',
    featured: false,
  },
  {
    id: 'kurti-styling-tips',
    title: 'How to Style a Kurti for Every Occasion',
    excerpt: 'From casual brunches to formal gatherings, discover the art of styling kurtis with the right accessories, footwear, and layers.',
    category: 'Women\'s Fashion',
    date: 'Apr 15, 2025',
    readTime: '5 min read',
    image: '👗',
    featured: false,
  },
  {
    id: 'fabric-care-101',
    title: 'Fabric Care 101: Making Your Clothes Last Longer',
    excerpt: 'Simple washing, drying, and storage tips that will keep your Shadow Zone garments looking brand new for years to come.',
    category: 'Tips',
    date: 'Apr 8, 2025',
    readTime: '3 min read',
    image: '🧵',
    featured: false,
  },
  {
    id: 'color-matching-guide',
    title: 'The Art of Color Matching: A Beginner\'s Guide',
    excerpt: 'Not sure what colors go together? This visual guide breaks down color theory into simple, actionable fashion advice for everyone.',
    category: 'Guide',
    date: 'Mar 30, 2025',
    readTime: '7 min read',
    image: '🎨',
    featured: false,
  },
  {
    id: 'monsoon-fashion',
    title: 'Monsoon-Proof Your Wardrobe This Season',
    excerpt: 'Rain doesn\'t have to ruin your style. Explore quick-dry fabrics, waterproof accessories, and smart layering techniques for the rainy season.',
    category: 'Seasonal',
    date: 'Mar 22, 2025',
    readTime: '4 min read',
    image: '🌧️',
    featured: false,
  },
];

export default function BlogPage() {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState('All');

  const CATEGORIES = [
    { value: 'All', label: t('shop.all') },
    { value: 'Trends', label: 'Trends' },
    { value: 'Sustainability', label: 'Sustainability' },
    { value: 'Guide', label: 'Guide' },
    { value: 'Men\'s Fashion', label: 'Men\'s Fashion' },
    { value: 'Women\'s Fashion', label: 'Women\'s Fashion' },
    { value: 'Tips', label: 'Tips' },
    { value: 'Seasonal', label: 'Seasonal' }
  ];

  const featured = BLOG_POSTS.filter(p => p.featured);
  const filtered = activeCategory === 'All'
    ? BLOG_POSTS.filter(p => !p.featured)
    : BLOG_POSTS.filter(p => p.category === activeCategory);

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroGlow} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <span className={styles.eyebrow}>Shadow Zone {t('blog.title')}</span>
          <h1 className="heading-display heading-1">
            Style Tips & <span className="text-gradient">Fashion Stories</span>
          </h1>
          <p className={styles.heroDesc}>
            {t('blog.heroTitle')}
          </p>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="section" style={{ paddingBottom: 0 }}>
        <div className="container">
          <div className={styles.featuredGrid}>
            {featured.map((post) => (
              <article key={post.id} className={styles.featuredCard}>
                <div className={styles.featuredImg}>{post.image}</div>
                <div className={styles.featuredContent}>
                  <div className={styles.postMeta}>
                    <span className="badge badge-primary">{post.category}</span>
                    <span className={styles.metaDot}>·</span>
                    <span>{post.date}</span>
                    <span className={styles.metaDot}>·</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h2 className={styles.featuredTitle}>{post.title}</h2>
                  <p className={styles.featuredExcerpt}>{post.excerpt}</p>
                  <Link href={`/blog/${post.id}`} className="btn btn-primary btn-sm" style={{ width: 'fit-content' }}>
                    {t('blog.readArticle')}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Category Filter + Posts */}
      <section className="section">
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className="heading-display heading-2">{t('blog.allArticles').split('Articles')[0]}<span className="text-gradient">Articles</span></h2>
          </div>

          {/* Category Tabs */}
          <div className={styles.catTabs}>
            {CATEGORIES.map(cat => (
              <button
                key={cat.value}
                className={`${styles.catTab} ${activeCategory === cat.value ? styles.catTabActive : ''}`}
                onClick={() => setActiveCategory(cat.value)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Post Grid */}
          <div className={styles.postGrid}>
            {filtered.map((post) => (
              <article key={post.id} className={styles.postCard}>
                <div className={styles.postImg}>{post.image}</div>
                <div className={styles.postContent}>
                  <div className={styles.postMeta}>
                    <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>{post.category}</span>
                    <span className={styles.metaDot}>·</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className={styles.postTitle}>{post.title}</h3>
                  <p className={styles.postExcerpt}>{post.excerpt}</p>
                  <div className={styles.postFooter}>
                    <span className="text-xs text-muted">{post.date}</span>
                    <Link href={`/blog/${post.id}`} className={styles.readMore}>
                      {t('blog.readMore')}
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="empty-state" style={{ padding: 60 }}>
              <h3>{t('blog.noArticlesInCategory')}</h3>
              <p className="mt-2 text-muted">{t('blog.checkBackSoon')}</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className={styles.newsletter}>
        <div className="container" style={{ maxWidth: 600, textAlign: 'center' }}>
          <h2 className="heading-display heading-2">{t('blog.stayInLoop').split('Loop')[0]}<span className="text-gradient">Loop</span></h2>
          <p className="text-secondary mt-2 mb-6">{t('blog.newsletterDesc')}</p>
          <form className={styles.nlForm} onSubmit={e => e.preventDefault()}>
            <input className="input" type="email" placeholder={t('blog.enterEmail')} style={{ flex: 1 }} />
            <button className="btn btn-primary">{t('blog.subscribe')}</button>
          </form>
        </div>
      </section>
    </div>
  );
}
