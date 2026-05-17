'use client';
import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import styles from './shop.module.css';

const SUB_CATEGORIES = {
  Mens: ['T-Shirts', 'Shirts', 'Pants', 'Jackets', 'Polos'],
  Ladies: ['Dresses', 'Tops', 'Kurtis', 'Skirts', 'Blouses'],
  Kids: ['T-Shirts', 'Frocks', 'Shorts', 'Jackets', 'Sets'],
};

function ShopContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    sub_category: searchParams.get('sub_category') || '',
    search: searchParams.get('search') || '',
    sort: searchParams.get('sort') || 'created_at',
    order: searchParams.get('order') || 'desc',
    featured: searchParams.get('featured') || '',
  });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.category) params.set('category', filters.category);
      if (filters.sub_category) params.set('sub_category', filters.sub_category);
      if (filters.search) params.set('search', filters.search);
      if (filters.sort) params.set('sort', filters.sort);
      if (filters.order) params.set('order', filters.order);
      if (filters.featured) params.set('featured', filters.featured);
      params.set('limit', '50');

      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      setProducts(data.products || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      category: searchParams.get('category') || '',
      sub_category: searchParams.get('sub_category') || '',
      featured: searchParams.get('featured') || '',
    }));
  }, [searchParams]);

  const updateFilter = (key, value) => {
    setFilters(prev => {
      const next = { ...prev, [key]: value };
      if (key === 'category') next.sub_category = '';
      return next;
    });
  };

  return (
    <div className={styles.page}>
      <div className="container">
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h1 className="heading-display heading-2">
              {filters.category || 'All'} <span className="text-gradient">Collection</span>
            </h1>
            <p className="text-secondary mt-2">{total} products found</p>
          </div>
        </div>

        <div className={styles.layout}>
          {/* Sidebar */}
          <aside className={styles.sidebar}>
            {/* Search */}
            <div className={styles.filterGroup}>
              <label>Search</label>
              <div className={styles.searchBox}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
                </svg>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={filters.search}
                  onChange={e => updateFilter('search', e.target.value)}
                  className="input"
                />
              </div>
            </div>

            {/* Category */}
            <div className={styles.filterGroup}>
              <label>Category</label>
              <div className={styles.filterChips}>
                <button
                  className={`${styles.chip} ${!filters.category ? styles.chipActive : ''}`}
                  onClick={() => updateFilter('category', '')}
                >All</button>
                {Object.keys(SUB_CATEGORIES).map(cat => (
                  <button
                    key={cat}
                    className={`${styles.chip} ${filters.category === cat ? styles.chipActive : ''}`}
                    onClick={() => updateFilter('category', cat)}
                  >{cat}</button>
                ))}
              </div>
            </div>

            {/* Sub-category */}
            {filters.category && SUB_CATEGORIES[filters.category] && (
              <div className={styles.filterGroup}>
                <label>Sub-Category</label>
                <div className={styles.filterChips}>
                  <button
                    className={`${styles.chip} ${!filters.sub_category ? styles.chipActive : ''}`}
                    onClick={() => updateFilter('sub_category', '')}
                  >All</button>
                  {SUB_CATEGORIES[filters.category].map(sub => (
                    <button
                      key={sub}
                      className={`${styles.chip} ${filters.sub_category === sub ? styles.chipActive : ''}`}
                      onClick={() => updateFilter('sub_category', sub)}
                    >{sub}</button>
                  ))}
                </div>
              </div>
            )}

            {/* Sort */}
            <div className={styles.filterGroup}>
              <label>Sort By</label>
              <select
                className="input"
                value={`${filters.sort}-${filters.order}`}
                onChange={e => {
                  const [sort, order] = e.target.value.split('-');
                  setFilters(prev => ({ ...prev, sort, order }));
                }}
              >
                <option value="created_at-desc">Newest First</option>
                <option value="created_at-asc">Oldest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A-Z</option>
                <option value="rating-desc">Top Rated</option>
              </select>
            </div>

            {/* Featured Toggle */}
            <div className={styles.filterGroup}>
              <label className={styles.checkLabel}>
                <input
                  type="checkbox"
                  checked={filters.featured === 'true'}
                  onChange={e => updateFilter('featured', e.target.checked ? 'true' : '')}
                />
                <span>Featured Only</span>
              </label>
            </div>
          </aside>

          {/* Products */}
          <div className={styles.products}>
            {loading ? (
              <div className="grid grid-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                    <div className="skeleton" style={{ aspectRatio: '3/4' }} />
                    <div style={{ padding: 16 }}>
                      <div className="skeleton" style={{ height: 12, width: '40%', marginBottom: 8 }} />
                      <div className="skeleton" style={{ height: 16, width: '80%', marginBottom: 8 }} />
                      <div className="skeleton" style={{ height: 14, width: '30%' }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="empty-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
                </svg>
                <h3>No products found</h3>
                <p>Try adjusting your filters</p>
              </div>
            ) : (
              <div className="grid grid-3">
                {products.map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="page-loader"><div className="spinner spinner-lg" /></div>}>
      <ShopContent />
    </Suspense>
  );
}
