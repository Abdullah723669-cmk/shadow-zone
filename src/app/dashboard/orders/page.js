'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/context/LanguageContext';
import styles from '../dashboard.module.css';

const statusColors = {
  pending: 'badge-warning', processing: 'badge-info',
  shipped: 'badge-primary', delivered: 'badge-success', cancelled: 'badge-error',
};

export default function OrdersPage() {
  const { t, language } = useTranslation();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending': return t('dashboard.pending');
      case 'processing': return t('dashboard.processing');
      case 'shipped': return t('dashboard.shipped');
      case 'delivered': return t('dashboard.delivered');
      case 'cancelled': return t('dashboard.cancelled');
      default: return status;
    }
  };

  useEffect(() => {
    if (!authLoading && !user) router.push('/auth/login?redirect=/dashboard/orders');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) fetchOrders();
  }, [user, filter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = filter ? `?status=${filter}` : '';
      const res = await fetch(`/api/orders${params}`);
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !user) return <div className="page-loader"><div className="spinner spinner-lg" /></div>;

  return (
    <div className={styles.page}>
      <div className="container">
        <h1 className="heading-display heading-2 mb-6">
          {t('dashboard.myOrders').split(' ')[0]} <span className="text-gradient">{t('dashboard.myOrders').split(' ').slice(1).join(' ')}</span>
        </h1>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {['', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
            <button
              key={s}
              className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter(s)}
            >
              {s ? getStatusLabel(s) : t('common.all')}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="page-loader" style={{ minHeight: 300 }}><div className="spinner spinner-lg" /></div>
        ) : orders.length === 0 ? (
          <div className="empty-state">
            <h3>{t('dashboard.noOrdersFound')}</h3>
            <p className="mt-2">{t('dashboard.tryChangingFilter')}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map(order => (
              <div key={order.id} className="card p-6">
                <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                  <div>
                    <p className="font-bold">{t('admin.order')} #{order.id}</p>
                    <p className="text-sm text-muted">
                      {new Date(order.created_at).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', {
                        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="price">৳{parseFloat(order.total_amount).toLocaleString()}</span>
                    <span className={`badge ${statusColors[order.status]}`}>{getStatusLabel(order.status)}</span>
                  </div>
                </div>
                {order.order_items && order.order_items.length > 0 && (
                  <div className="flex flex-col gap-2">
                    {order.order_items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3" style={{ padding: '8px 0', borderTop: idx > 0 ? '1px solid var(--border-color)' : 'none' }}>
                        {item.products?.image_url && (
                          <img src={item.products.image_url} alt="" style={{ width: 40, height: 50, objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                        )}
                        <div className="flex-1">
                          <p className="text-sm font-medium">{item.products?.name || `${t('admin.order')} #${item.product_id}`}</p>
                          {item.size && <p className="text-xs text-muted">{t('common.size')}: {item.size}</p>}
                        </div>
                        <p className="text-sm text-muted">×{item.quantity}</p>
                        <p className="text-sm price">৳{parseFloat(item.price).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                )}
                {order.shipping_address && (
                  <div className="mt-4" style={{ padding: '12px', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    <strong>{t('dashboard.shipping')}: </strong>{order.shipping_address}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
