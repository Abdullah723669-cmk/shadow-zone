'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useTranslation } from '@/context/LanguageContext';
import styles from './checkout.module.css';

export default function CheckoutPage() {
  const { t } = useTranslation();
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const toast = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    address: user?.address || '',
    phone: user?.phone || '',
    payment_method: 'cod',
    note: '',
  });

  if (!user) {
    if (typeof window !== 'undefined') router.push('/auth/login?redirect=/checkout');
    return null;
  }

  if (items.length === 0) {
    return (
      <div className="empty-state" style={{ paddingTop: 120 }}>
        <h2>{t('cart.empty')}</h2>
        <p className="mt-2 text-muted">{t('checkout.addBeforeCheckout')}</p>
        <button className="btn btn-primary mt-4" onClick={() => router.push('/shop')}>{t('cart.continueShopping')}</button>
      </div>
    );
  }

  const shippingCost = totalPrice >= 2000 ? 0 : 100;
  const grandTotal = totalPrice + shippingCost;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.phone) {
      toast.error(t('checkout.enterPhone'));
      return;
    }
    if (!form.address) {
      toast.error(t('checkout.enterAddress'));
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          shipping_address: `${form.address}\n${t('checkout.phone')} ${form.phone}\n${t('checkout.note')} ${form.note}`,
          payment_method: form.payment_method,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      clearCart();
      toast.success(t('checkout.orderPlaced'));
      router.push('/dashboard/orders');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className="container">
        <h1 className="heading-display heading-2 mb-6">{t('checkout.title')}</h1>
        <form onSubmit={handleSubmit} className={styles.grid}>
          {/* Shipping */}
          <div className={styles.main}>
            <div className="card p-6">
              <h2 className="heading-display heading-3 mb-4">{t('checkout.shippingInfo')}</h2>
              <div className="flex flex-col gap-4">
                <div className="input-group">
                  <label>{t('common.name')}</label>
                  <input className="input" value={user.name} disabled />
                </div>
                <div className="input-group">
                  <label>{t('common.email')}</label>
                  <input className="input" value={user.email} disabled />
                </div>
                <div className="input-group">
                  <label>{t('checkout.mobileNumber')} *</label>
                  <input className="input" placeholder="+880 1XXX XXXXXX" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                </div>
                <div className="input-group">
                  <label>{t('checkout.address')} *</label>
                  <textarea className="input" rows={3} placeholder={t('checkout.fullDeliveryAddress')} value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
                </div>
                <div className="input-group">
                  <label>{t('checkout.orderNoteOptional')}</label>
                  <textarea className="input" rows={2} placeholder={t('checkout.specialInstructions')} value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} />
                </div>
              </div>
            </div>

            <div className="card p-6 mt-6">
              <h2 className="heading-display heading-3 mb-4">{t('checkout.paymentMethod')}</h2>
              <div className={styles.paymentOptions}>
                {[
                  { value: 'cod', label: t('checkout.cashOnDelivery'), icon: '💵' },
                  { value: 'bkash', label: t('checkout.bkash'), icon: '📱' },
                  { value: 'card', label: t('checkout.cardPayment'), icon: '💳' },
                ].map(opt => (
                  <label key={opt.value} className={`${styles.paymentOption} ${form.payment_method === opt.value ? styles.paymentActive : ''}`}>
                    <input type="radio" name="payment" value={opt.value} checked={form.payment_method === opt.value} onChange={e => setForm(f => ({ ...f, payment_method: e.target.value }))} />
                    <span className={styles.paymentIcon}>{opt.icon}</span>
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <aside className={styles.sidebar}>
            <div className="card p-6" style={{ position: 'sticky', top: 100 }}>
              <h2 className="heading-display heading-3 mb-4">{t('checkout.orderSummary')}</h2>
              <div className={styles.orderItems}>
                {items.map(item => (
                  <div key={`${item.id}-${item.size}`} className={styles.orderItem}>
                    <img src={item.image_url} alt={item.name} className={styles.orderImg} />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.name}</p>
                      {item.size && <p className="text-xs text-muted">{t('common.size')}: {item.size}</p>}
                      <p className="text-xs text-muted">{t('checkout.qty')} {item.quantity}</p>
                    </div>
                    <p className="price text-sm">৳{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>
              <div className="divider" />
              <div className={styles.summaryRow}>
                <span>{t('cart.subtotal')}</span>
                <span>৳{totalPrice.toLocaleString()}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>{t('cart.shipping')}</span>
                <span>{shippingCost === 0 ? <span style={{ color: 'var(--success)' }}>{t('common.free')}</span> : `৳${shippingCost}`}</span>
              </div>
              <div className="divider" />
              <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                <span>{t('cart.total')}</span>
                <span className="price" style={{ fontSize: '1.2rem' }}>৳{grandTotal.toLocaleString()}</span>
              </div>
              <button type="submit" className="btn btn-primary w-full btn-lg mt-4" disabled={loading}>
                {loading ? <span className="spinner" /> : `${t('checkout.placeOrder')} — ৳${grandTotal.toLocaleString()}`}
              </button>
              <p className="text-xs text-muted text-center mt-2">
                {shippingCost === 0 ? t('checkout.freeShippingEligible') : t('checkout.freeShippingThreshold')}
              </p>
            </div>
          </aside>
        </form>
      </div>
    </div>
  );
}
