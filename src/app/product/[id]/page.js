'use client';
import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import ProductCard from '@/components/ProductCard';
import styles from './product.module.css';

export default function ProductPage({ params }) {
  const { id } = use(params);
  const [product, setProduct] = useState(null);
  const [stock, setStock] = useState([]);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const toast = useToast();

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        if (data.product) {
          setProduct(data.product);
          setStock(data.stock || []);
          setRelated(data.related || []);
          if (data.stock?.length > 0) {
            setSelectedSize(data.stock[0].size || '');
          }
        }
      } catch (err) {
        console.error('Failed to load product:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, quantity, selectedSize);
    toast.success(`${product.name} added to bag!`);
  };

  const discount = product?.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  if (loading) {
    return (
      <div className="page-loader">
        <div className="spinner spinner-lg" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="empty-state" style={{ paddingTop: 120 }}>
        <h2>Product Not Found</h2>
        <p className="mt-2 text-muted">The product you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/shop" className="btn btn-primary mt-4">Back to Shop</Link>
      </div>
    );
  }

  const sizes = [...new Set(stock.map(s => s.size).filter(Boolean))];
  const totalStock = stock.length > 0 ? stock.reduce((acc, curr) => acc + curr.quantity, 0) : (product.stock_quantity !== undefined ? product.stock_quantity : 1);

  return (
    <div className={styles.page}>
      <div className="container">
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb}>
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/shop">Shop</Link>
          <span>/</span>
          <Link href={`/shop?category=${product.category}`}>{product.category}</Link>
          <span>/</span>
          <span className={styles.current}>{product.name}</span>
        </nav>

        <div className={styles.grid}>
          {/* Image */}
          <div className={styles.imageSection}>
            <div className={styles.imageWrap}>
              <img src={product.image_url} alt={product.name} className={styles.image} />
              {discount > 0 && <span className={styles.badge}>-{discount}%</span>}
            </div>
          </div>

          {/* Info */}
          <div className={styles.info}>
            <span className={styles.category}>{product.category} / {product.sub_category}</span>
            <h1 className={styles.name}>{product.name}</h1>

            {product.rating > 0 && (
              <div className={styles.rating}>
                <div className="stars" style={{ fontSize: '1.1rem' }}>
                  {[...Array(5)].map((_, i) => (
                    <span key={i} style={{ opacity: i < Math.round(product.rating) ? 1 : 0.3 }}>★</span>
                  ))}
                </div>
                <span className="text-sm text-muted">({product.reviews_count} reviews)</span>
              </div>
            )}

            <div className={styles.priceBlock}>
              <span className={styles.price}>৳{parseFloat(product.price).toLocaleString()}</span>
              {product.original_price && (
                <span className={styles.originalPrice}>৳{parseFloat(product.original_price).toLocaleString()}</span>
              )}
              {discount > 0 && (
                <span className="badge badge-error">{discount}% OFF</span>
              )}
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              {totalStock === 0 ? (
                <span className="badge badge-error">Out of Stock</span>
              ) : totalStock < 10 ? (
                <span className="badge badge-warning" style={{ backgroundColor: '#f59e0b', color: '#fff' }}>Low Stock ({totalStock} left)</span>
              ) : (
                <span className="badge badge-success">In Stock</span>
              )}
            </div>

            {product.description && (
              <p className={styles.desc}>{product.description}</p>
            )}

            {/* Size Selection */}
            {sizes.length > 0 && (
              <div className={styles.optionGroup}>
                <label>Size</label>
                <div className={styles.sizeGrid}>
                  {sizes.map(size => {
                    const stkItem = stock.find(s => s.size === size);
                    const inStock = stkItem && stkItem.quantity > 0;
                    return (
                      <button
                        key={size}
                        className={`${styles.sizeBtn} ${selectedSize === size ? styles.sizeBtnActive : ''} ${!inStock ? styles.sizeBtnOos : ''}`}
                        onClick={() => inStock && setSelectedSize(size)}
                        disabled={!inStock}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className={styles.optionGroup}>
              <label>Quantity</label>
              <div className="qty-control" style={{ width: 'fit-content' }}>
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} disabled={totalStock === 0}>−</button>
                <span>{totalStock === 0 ? 0 : quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} disabled={totalStock === 0}>+</button>
              </div>
            </div>

            {/* Add to Cart */}
            <div className={styles.actions}>
              <button 
                className="btn btn-primary btn-lg flex-1" 
                onClick={handleAddToCart}
                disabled={totalStock === 0}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
                {totalStock === 0 ? 'Out of Stock' : `Add to Bag — ৳${(parseFloat(product.price) * quantity).toLocaleString()}`}
              </button>
            </div>

            {/* Product Details */}
            <div className={styles.details}>
              {product.color && (
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Color</span>
                  <span>{product.color}</span>
                </div>
              )}
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Category</span>
                <span>{product.category}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Type</span>
                <span>{product.sub_category}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section className={styles.related}>
            <h2 className="heading-display heading-3">You May Also Like</h2>
            <div className="grid grid-4 mt-6">
              {related.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
