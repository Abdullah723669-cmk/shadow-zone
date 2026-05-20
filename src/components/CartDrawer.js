'use client';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/context/LanguageContext';
import styles from './CartDrawer.module.css';

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, totalItems, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const { t } = useTranslation();
  const router = useRouter();

  const handleCheckout = () => {
    setIsOpen(false);
    if (!user) {
      router.push('/auth/login?redirect=/checkout');
    } else {
      router.push('/checkout');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className={styles.overlay} onClick={() => setIsOpen(false)} />
      <div className={styles.drawer}>
        <div className={styles.header}>
          <h3>{t('cart.title')} ({totalItems})</h3>
          <button onClick={() => setIsOpen(false)} className={styles.closeBtn}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
            </svg>
          </button>
        </div>

        <div className={styles.body}>
          {items.length === 0 ? (
            <div className={styles.empty}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ opacity: 0.3 }}>
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              <p>{t('cart.empty')}</p>
              <button className="btn btn-secondary btn-sm mt-4" onClick={() => { setIsOpen(false); router.push('/shop'); }}>
                {t('cart.continueShopping')}
              </button>
            </div>
          ) : (
            items.map(item => (
              <div key={`${item.id}-${item.size}`} className={styles.item}>
                <div className={styles.itemImg}>
                  <img src={item.image_url} alt={item.name} />
                </div>
                <div className={styles.itemInfo}>
                  <p className={styles.itemName}>{item.name}</p>
                  {item.size && <p className="text-xs text-muted">{t('common.size')}: {item.size}</p>}
                  <p className="price" style={{ fontSize: '0.9rem' }}>৳{item.price.toLocaleString()}</p>
                  <div className={styles.itemActions}>
                    <div className="qty-control">
                      <button onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}>−</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}>+</button>
                    </div>
                    <button className={styles.removeBtn} onClick={() => removeItem(item.id, item.size)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.subtotal}>
              <span>{t('cart.subtotal')}</span>
              <span className="price" style={{ fontSize: '1.1rem' }}>৳{totalPrice.toLocaleString()}</span>
            </div>
            <button className="btn btn-primary w-full" onClick={handleCheckout}>
              {t('checkout.completeOrder')}
            </button>
            <button className="btn btn-secondary w-full btn-sm" onClick={clearCart}>
              {t('common.cancel')}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
