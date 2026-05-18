'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UploadButton } from "@/utils/uploadthing";
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import styles from './admin.module.css';

const statusColors = {
  pending: 'badge-warning', processing: 'badge-info',
  shipped: 'badge-primary', delivered: 'badge-success', cancelled: 'badge-error',
};

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const toast = useToast();
  const router = useRouter();
  const [tab, setTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [orderFilter, setOrderFilter] = useState('all');
  const [showProductModal, setShowProductModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '', description: '', price: '', original_price: '',
    category: 'Mens', sub_category: '', size: '', color: '', image_url: '', featured: false,
  });

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchStats();
      fetchOrders();
      fetchProducts();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      setStats(data.stats);
      setRecentOrders(data.recentOrders || []);
    } catch (err) { console.error(err); }
  };

  const fetchOrders = async () => {
    try {
      const params = orderFilter !== 'all' ? `?status=${orderFilter}` : '';
      const res = await fetch(`/api/admin/orders${params}`);
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/admin/products');
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    if (user?.role === 'admin' && tab === 'orders') fetchOrders();
  }, [orderFilter]);

  const updateOrderStatus = async (orderId, status) => {
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: orderId, status }),
      });
      if (!res.ok) throw new Error('Failed');
      toast.success(`Order #${orderId} → ${status}`);
      fetchOrders();
      fetchStats();
    } catch (err) {
      toast.error('Failed to update order');
    }
  };

  const openProductModal = (product = null) => {
    if (product) {
      setEditProduct(product);
      setProductForm({
        name: product.name, description: product.description || '',
        price: product.price, original_price: product.original_price || '',
        category: product.category, sub_category: product.sub_category,
        size: product.size || '', color: product.color || '',
        image_url: product.image_url || '', featured: product.featured || false,
      });
    } else {
      setEditProduct(null);
      setProductForm({
        name: '', description: '', price: '', original_price: '',
        category: 'Mens', sub_category: '', size: '', color: '', image_url: '', featured: false,
      });
    }
    setShowProductModal(true);
  };

  const handleProductSave = async () => {
    try {
      const method = editProduct ? 'PUT' : 'POST';
      const body = editProduct ? { id: editProduct.id, ...productForm } : productForm;
      const res = await fetch('/api/admin/products', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Failed');
      toast.success(editProduct ? 'Product updated!' : 'Product created!');
      setShowProductModal(false);
      fetchProducts();
      fetchStats();
    } catch (err) {
      toast.error('Failed to save product');
    }
  };

  const deleteProduct = async (id) => {
    if (!confirm('Are you sure?')) return;
    try {
      const res = await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed');
      toast.success('Product deleted');
      fetchProducts();
      fetchStats();
    } catch (err) {
      toast.error('Failed to delete product');
    }
  };



  if (authLoading || !user || user.role !== 'admin') {
    return <div className="page-loader"><div className="spinner spinner-lg" /></div>;
  }

  const TABS = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'orders', label: 'Orders', icon: '📦' },
    { id: 'products', label: 'Products', icon: '🏷️' },
  ];

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <div>
            <h1 className="heading-display heading-2">Admin <span className="text-gradient">Panel</span></h1>
            <p className="text-secondary mt-2">Manage your store</p>
          </div>
          <div className="flex gap-2">
            <Link href="/dashboard/stock" className="btn btn-primary btn-sm">📦 Manage Stock</Link>
            <Link href="/dashboard" className="btn btn-secondary btn-sm">← Back to Dashboard</Link>
          </div>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          {TABS.map(t => (
            <button
              key={t.id}
              className={`${styles.tab} ${tab === t.id ? styles.tabActive : ''}`}
              onClick={() => setTab(t.id)}
            >
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {tab === 'dashboard' && stats && (
          <div className="animate-fade-in">
            <div className={styles.statsGrid}>
              {[
                { label: 'Total Products', value: stats.totalProducts, icon: '🏷️', color: '#9333ea' },
                { label: 'Total Orders', value: stats.totalOrders, icon: '📦', color: '#3b82f6' },
                { label: 'Total Customers', value: stats.totalCustomers, icon: '👥', color: '#22c55e' },
                { label: 'Revenue', value: `৳${stats.totalRevenue?.toLocaleString()}`, icon: '💰', color: '#f59e0b' },
                { label: 'Pending Orders', value: stats.pendingOrders, icon: '⏳', color: '#ef4444' },
              ].map((s, i) => (
                <div key={i} className={styles.statCard}>
                  <div className={styles.statCardIcon} style={{ background: `${s.color}20`, color: s.color }}>{s.icon}</div>
                  <div>
                    <p className={styles.statCardValue}>{s.value}</p>
                    <p className={styles.statCardLabel}>{s.label}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.dashGrid}>
              {/* Orders by Status */}
              <div className="card p-6">
                <h3 className="heading-display heading-3 mb-4">Orders by Status</h3>
                <div className="flex flex-col gap-3">
                  {Object.entries(stats.statusCounts || {}).map(([status, count]) => (
                    <div key={status} className="flex items-center justify-between">
                      <span className={`badge ${statusColors[status]}`}>{status}</span>
                      <span className="font-bold">{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Products by Category */}
              <div className="card p-6">
                <h3 className="heading-display heading-3 mb-4">Products by Category</h3>
                <div className="flex flex-col gap-3">
                  {Object.entries(stats.categoryCounts || {}).map(([cat, count]) => (
                    <div key={cat} className="flex items-center justify-between">
                      <span className="font-medium">{cat}</span>
                      <div className={styles.barWrap}>
                        <div className={styles.bar} style={{ width: `${(count / (stats.totalProducts || 1)) * 100}%` }} />
                        <span className="text-sm font-bold">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="card p-6 mt-6">
              <h3 className="heading-display heading-3 mb-4">Recent Orders</h3>
              <div className="table-wrapper">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Order</th><th>Customer</th><th>Amount</th><th>Status</th><th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map(o => (
                      <tr key={o.id}>
                        <td className="font-semibold">#{o.id}</td>
                        <td>{o.users?.name || 'N/A'}</td>
                        <td className="price">৳{parseFloat(o.total_amount).toLocaleString()}</td>
                        <td><span className={`badge ${statusColors[o.status]}`}>{o.status}</span></td>
                        <td className="text-muted text-sm">{new Date(o.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {tab === 'orders' && (
          <div className="animate-fade-in">
            <div className="flex gap-2 mb-6 flex-wrap">
              {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
                <button key={s} className={`btn btn-sm ${orderFilter === s ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setOrderFilter(s)}>
                  {s === 'all' ? 'All' : s}
                </button>
              ))}
            </div>
            {loading ? (
              <div className="page-loader" style={{ minHeight: 300 }}><div className="spinner spinner-lg" /></div>
            ) : (
              <div className="flex flex-col gap-4">
                {orders.map(order => (
                  <div key={order.id} className="card p-6">
                    <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                      <div>
                        <p className="font-bold">Order #{order.id}</p>
                        <p className="text-sm text-muted">by {order.users?.name || 'N/A'} ({order.users?.email})</p>
                        <p className="text-xs text-muted">{new Date(order.created_at).toLocaleString()}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="price">৳{parseFloat(order.total_amount).toLocaleString()}</span>
                        <select
                          className="input"
                          value={order.status}
                          onChange={e => updateOrderStatus(order.id, e.target.value)}
                          style={{ width: 'auto', padding: '8px 32px 8px 12px', fontSize: '0.8rem' }}
                        >
                          {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    {order.order_items && (
                      <div className="flex flex-col gap-2">
                        {order.order_items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-3" style={{ padding: '6px 0', borderTop: idx > 0 ? '1px solid var(--border-color)' : 'none' }}>
                            {item.products?.image_url && (
                              <img src={item.products.image_url} alt="" style={{ width: 36, height: 45, objectFit: 'cover', borderRadius: 4 }} />
                            )}
                            <span className="flex-1 text-sm">{item.products?.name}</span>
                            <span className="text-sm text-muted">×{item.quantity}</span>
                            <span className="text-sm price">৳{parseFloat(item.price).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {order.shipping_address && (
                      <p className="text-xs text-muted mt-3" style={{ padding: 10, background: 'var(--bg-glass)', borderRadius: 'var(--radius-sm)' }}>
                        📍 {order.shipping_address}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Products Tab */}
        {tab === 'products' && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <p className="text-secondary">{products.length} products</p>
              <button className="btn btn-primary btn-sm" onClick={() => openProductModal()}>
                + Add Product
              </button>
            </div>
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Product</th><th>Category</th><th>Price</th><th>Featured</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          {p.image_url && <img src={p.image_url} alt="" style={{ width: 40, height: 50, objectFit: 'cover', borderRadius: 4 }} />}
                          <div>
                            <p className="font-medium text-sm">{p.name}</p>
                            <p className="text-xs text-muted">{p.sub_category}</p>
                          </div>
                        </div>
                      </td>
                      <td><span className="badge badge-primary">{p.category}</span></td>
                      <td className="price">৳{parseFloat(p.price).toLocaleString()}</td>
                      <td>{p.featured ? '⭐' : '—'}</td>
                      <td>
                        <div className="flex gap-2">
                          <button className="btn btn-secondary btn-sm" onClick={() => openProductModal(p)}>Edit</button>
                          <button className="btn btn-danger btn-sm" onClick={() => deleteProduct(p.id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Product Modal */}
        {showProductModal && (
          <div className="modal-overlay" onClick={() => setShowProductModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 560 }}>
              <h2 className="heading-display heading-3 mb-4">{editProduct ? 'Edit Product' : 'Add Product'}</h2>
              <div className="flex flex-col gap-4">
                <div className="input-group">
                  <label>Name *</label>
                  <input className="input" value={productForm.name} onChange={e => setProductForm(f => ({ ...f, name: e.target.value }))} />
                </div>
                <div className="input-group">
                  <label>Description</label>
                  <textarea className="input" rows={2} value={productForm.description} onChange={e => setProductForm(f => ({ ...f, description: e.target.value }))} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="input-group">
                    <label>Price *</label>
                    <input className="input" type="number" value={productForm.price} onChange={e => setProductForm(f => ({ ...f, price: e.target.value }))} />
                  </div>
                  <div className="input-group">
                    <label>Original Price</label>
                    <input className="input" type="number" value={productForm.original_price} onChange={e => setProductForm(f => ({ ...f, original_price: e.target.value }))} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="input-group">
                    <label>Category *</label>
                    <select className="input" value={productForm.category} onChange={e => setProductForm(f => ({ ...f, category: e.target.value }))}>
                      <option value="Mens">Mens</option>
                      <option value="Ladies">Ladies</option>
                      <option value="Kids">Kids</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Sub-Category *</label>
                    <input className="input" value={productForm.sub_category} onChange={e => setProductForm(f => ({ ...f, sub_category: e.target.value }))} />
                  </div>
                </div>
                <div className="input-group">
                  <label>Image URL / Upload</label>
                  <div className="flex gap-2">
                    <input className="input" value={productForm.image_url} onChange={e => setProductForm(f => ({ ...f, image_url: e.target.value }))} placeholder="https://..." style={{ flex: 1 }} />
                    <div style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', height: '100%' }}>
                      <UploadButton
                        endpoint="imageUploader"
                        onClientUploadComplete={(res) => {
                          console.log("Upload Completed", res);
                          if (res && res.length > 0) {
                            setProductForm(f => ({ ...f, image_url: res[0].url }));
                            toast.success('Image uploaded successfully');
                          }
                        }}
                        onUploadError={(error) => {
                          toast.error(`Error uploading image: ${error.message}`);
                        }}
                        appearance={{
                          button: "btn btn-secondary",
                          allowedContent: "hidden"
                        }}
                        content={{
                          button({ ready }) {
                            if (ready) return <div>Upload Image</div>;
                            return "Loading...";
                          },
                          allowedContent({ ready, fileTypes, isUploading }) {
                            return "";
                          }
                        }}
                      />
                    </div>
                  </div>
                  {productForm.image_url && (
                    <img src={productForm.image_url} alt="Preview" style={{ marginTop: 8, width: 80, height: 80, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--border-color)' }} />
                  )}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="input-group">
                    <label>Size</label>
                    <input className="input" value={productForm.size} onChange={e => setProductForm(f => ({ ...f, size: e.target.value }))} />
                  </div>
                  <div className="input-group">
                    <label>Color</label>
                    <input className="input" value={productForm.color} onChange={e => setProductForm(f => ({ ...f, color: e.target.value }))} />
                  </div>
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.9rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={productForm.featured} onChange={e => setProductForm(f => ({ ...f, featured: e.target.checked }))} style={{ accentColor: 'var(--primary-500)' }} />
                  Featured Product
                </label>
                <div className="flex gap-3 mt-2">
                  <button className="btn btn-primary flex-1" onClick={handleProductSave}>{editProduct ? 'Update' : 'Create'}</button>
                  <button className="btn btn-secondary flex-1" onClick={() => setShowProductModal(false)}>Cancel</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
