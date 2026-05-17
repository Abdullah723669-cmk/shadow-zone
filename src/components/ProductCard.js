'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import styles from './ProductCard.module.css';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const toast = useToast();
  const [isHovered, setIsHovered] = useState(false);

  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  const totalStock = product.stock ? product.stock.reduce((acc, curr) => acc + curr.quantity, 0) : (product.stock_quantity !== undefined ? product.stock_quantity : 1);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (totalStock === 0) return;
    addItem(product);
    toast.success(`${product.name} added to bag`);
  };

  return (
    <Link
      href={`/product/${product.id}`}
      className={styles.card}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={styles.imageWrap}>
        <img src={product.image_url} alt={product.name} className={styles.image} loading="lazy" />
        <div className={`${styles.overlay} ${isHovered ? styles.overlayVisible : ''}`}>
          <button 
            className={`btn btn-primary btn-sm ${styles.addBtn}`} 
            onClick={handleAddToCart}
            disabled={totalStock === 0}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            {totalStock === 0 ? 'Out of Stock' : 'Add to Bag'}
          </button>
        </div>
        {discount > 0 && (
          <span className={styles.discountBadge}>-{discount}%</span>
        )}
        {product.featured && (
          <span className={styles.featuredBadge}>★ Featured</span>
        )}
      </div>
      <div className={styles.info}>
        <div className="flex items-center justify-between">
          <p className={styles.category}>{product.sub_category || product.category}</p>
          {totalStock === 0 ? (
            <span className="badge badge-error" style={{ fontSize: '0.7rem' }}>Out of Stock</span>
          ) : totalStock < 10 ? (
            <span className="badge badge-warning" style={{ fontSize: '0.7rem', backgroundColor: '#f59e0b', color: '#fff' }}>Low Stock</span>
          ) : (
            <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>Available</span>
          )}
        </div>
        <h3 className={styles.name}>{product.name}</h3>
        <div className={styles.priceRow}>
          <span className="price">৳{parseFloat(product.price).toLocaleString()}</span>
          {product.original_price && (
            <span className="price-original">৳{parseFloat(product.original_price).toLocaleString()}</span>
          )}
        </div>
        {product.rating > 0 && (
          <div className={styles.rating}>
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <span key={i} style={{ opacity: i < Math.round(product.rating) ? 1 : 0.3 }}>★</span>
              ))}
            </div>
            <span className="text-xs text-muted">({product.reviews_count})</span>
          </div>
        )}
      </div>
    </Link>
  );
}
