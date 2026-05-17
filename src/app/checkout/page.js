'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import styles from './checkout.module.css';

export default function CheckoutPage() {
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
        <h2>Your bag is empty</h2>
        <p className="mt-2 text-muted">Add some products before checking out.</p>
        <button className="btn btn-primary mt-4" onClick={() => router.push('/shop')}>Browse Products</button>
      </div>
    );
  }

  const shippingCost = totalPrice >= 2000 ? 0 : 100;
  const grandTotal = totalPrice + shippingCost;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.phone) {
      toast.error('Please enter a phone number');
      return;
    }
    if (!form.address) {
      toast.error('Please enter a shipping address');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          shipping_address: `${form.address}\nPhone: ${form.phone}\nNote: ${form.note}`,
          payment_method: form.payment_method,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      clearCart();
      toast.success('Order placed successfully!');
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
        <h1 className="heading-display heading-2 mb-6">Checkout</h1>
        <form onSubmit={handleSubmit} className={styles.grid}>
          {/* Shipping */}
          <div className={styles.main}>
            <div className="card p-6">
              <h2 className="heading-display heading-3 mb-4">Shipping Information</h2>
              <div className="flex flex-col gap-4">
                <div className="input-group">
                  <label>Full Name</label>
                  <input className="input" value={user.name} disabled />
                </div>
                <div className="input-group">
                  <label>Email</label>
                  <input className="input" value={user.email} disabled />
                </div>
                <div className="input-group">
                  <label>Phone Number *</label>
                  <input className="input" placeholder="+880 1XXX XXXXXX" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                </div>
                <div className="input-group">
                  <label>Shipping Address *</label>
                  <textarea className="input" rows={3} placeholder="Full delivery address..." value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
                </div>
                <div className="input-group">
                  <label>Order Note (optional)</label>
                  <textarea className="input" rows={2} placeholder="Any special instructions..." value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} />
                </div>
              </div>
            </div>

            <div className="card p-6 mt-6">
              <h2 className="heading-display heading-3 mb-4">Payment Method</h2>
              <div className={styles.paymentOptions}>
                {[
                  { value: 'cod', label: 'Cash on Delivery', icon: '💵' },
                  { value: 'bkash', label: 'bKash', icon: '📱' },
                  { value: 'card', label: 'Card Payment', icon: '💳' },
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
              <h2 className="heading-display heading-3 mb-4">Order Summary</h2>
              <div className={styles.orderItems}>
                {items.map(item => (
                  <div key={`${item.id}-${item.size}`} className={styles.orderItem}>
                    <img src={item.image_url} alt={item.name} className={styles.orderImg} />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.name}</p>
                      {item.size && <p className="text-xs text-muted">Size: {item.size}</p>}
                      <p className="text-xs text-muted">Qty: {item.quantity}</p>
                    </div>
                    <p className="price text-sm">৳{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>
              <div className="divider" />
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>৳{totalPrice.toLocaleString()}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Shipping</span>
                <span>{shippingCost === 0 ? <span style={{ color: 'var(--success)' }}>Free</span> : `৳${shippingCost}`}</span>
              </div>
              <div className="divider" />
              <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                <span>Total</span>
                <span className="price" style={{ fontSize: '1.2rem' }}>৳{grandTotal.toLocaleString()}</span>
              </div>
              <button type="submit" className="btn btn-primary w-full btn-lg mt-4" disabled={loading}>
                {loading ? <span className="spinner" /> : `Place Order — ৳${grandTotal.toLocaleString()}`}
              </button>
              <p className="text-xs text-muted text-center mt-2">
                {shippingCost === 0 ? '✓ You qualify for free shipping!' : `Free shipping on orders above ৳2,000`}
              </p>
            </div>
          </aside>
        </form>
      </div>
    </div>
  );
}
