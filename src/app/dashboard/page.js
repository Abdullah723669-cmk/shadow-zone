'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useTranslation } from '@/context/LanguageContext';
import styles from './dashboard.module.css';

export default function DashboardPage() {
  const { t, language } = useTranslation();
  const { user, loading: authLoading, updateProfile } = useAuth();
  const toast = useToast();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', address: '' });

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
    if (!authLoading && !user) router.push('/auth/login?redirect=/dashboard');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      setForm({ name: user.name || '', phone: user.phone || '', address: user.address || '' });
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await updateProfile(form);
      toast.success(t('dashboard.profileUpdated'));
      setEditing(false);
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (authLoading || !user) {
    return <div className="page-loader"><div className="spinner spinner-lg" /></div>;
  }

  const recentOrders = orders.slice(0, 5);
  const statusColors = {
    pending: 'badge-warning',
    processing: 'badge-info',
    shipped: 'badge-primary',
    delivered: 'badge-success',
    cancelled: 'badge-error',
  };

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <div>
            <h1 className="heading-display heading-2">
              {t('dashboard.welcome')}, <span className="text-gradient">{user.name}</span>
            </h1>
            <p className="text-secondary mt-2">{t('dashboard.manageAccount')}</p>
          </div>
          {user.role === 'admin' && (
            <Link href="/admin" className="btn btn-accent btn-sm">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
              {t('admin.title')}
            </Link>
          )}
        </div>

        <div className={styles.grid}>
          {/* Profile Card */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="heading-display heading-3">{t('dashboard.profile')}</h2>
              <button className="btn btn-secondary btn-sm" onClick={() => setEditing(!editing)}>
                {editing ? t('dashboard.cancel') : t('common.edit')}
              </button>
            </div>
            <div className="flex flex-col gap-4">
              <div className="input-group">
                <label>{t('common.name')}</label>
                {editing ? (
                  <input className="input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                ) : (
                  <p className="font-medium">{user.name}</p>
                )}
              </div>
              <div className="input-group">
                <label>{t('common.email')}</label>
                <p className="font-medium">{user.email}</p>
              </div>
              <div className="input-group">
                <label>{t('common.phone')}</label>
                {editing ? (
                  <input className="input" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                ) : (
                  <p className="font-medium">{user.phone || t('dashboard.notSet')}</p>
                )}
              </div>
              <div className="input-group">
                <label>{t('common.address')}</label>
                {editing ? (
                  <textarea className="input" rows={3} value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
                ) : (
                  <p className="font-medium">{user.address || t('dashboard.notSet')}</p>
                )}
              </div>
              {editing && (
                <button className="btn btn-primary" onClick={handleSave}>{t('dashboard.saveChanges')}</button>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex flex-col gap-6">
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <span className={styles.statIcon}>📦</span>
                <div>
                  <p className={styles.statNum}>{orders.length}</p>
                  <p className={styles.statLabel}>{t('dashboard.totalOrders')}</p>
                </div>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statIcon}>⏳</span>
                <div>
                  <p className={styles.statNum}>{orders.filter(o => o.status === 'pending').length}</p>
                  <p className={styles.statLabel}>{t('dashboard.pending')}</p>
                </div>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statIcon}>✅</span>
                <div>
                  <p className={styles.statNum}>{orders.filter(o => o.status === 'delivered').length}</p>
                  <p className={styles.statLabel}>{t('dashboard.delivered')}</p>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="heading-display heading-3">{t('dashboard.recentOrders')}</h2>
                <Link href="/dashboard/orders" className="btn btn-secondary btn-sm">{t('common.viewAll')}</Link>
              </div>
              {loading ? (
                <div className="page-loader" style={{ minHeight: 200 }}><div className="spinner" /></div>
              ) : recentOrders.length === 0 ? (
                <div className="empty-state" style={{ padding: 40 }}>
                  <p>{t('dashboard.noOrders')}</p>
                  <Link href="/shop" className="btn btn-primary btn-sm mt-4">{t('dashboard.startShopping')}</Link>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {recentOrders.map(order => (
                    <div key={order.id} className={styles.orderRow}>
                      <div>
                        <p className="font-semibold text-sm">Order #{order.id}</p>
                        <p className="text-xs text-muted">
                          {new Date(order.created_at).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric', 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="price text-sm">৳{parseFloat(order.total_amount).toLocaleString()}</span>
                        <span className={`badge ${statusColors[order.status] || 'badge-info'}`}>{getStatusLabel(order.status)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
