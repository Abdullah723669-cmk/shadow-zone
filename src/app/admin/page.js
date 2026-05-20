'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UploadButton } from "@/utils/uploadthing";
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useTranslation } from '@/context/LanguageContext';
import styles from './admin.module.css';

const statusColors = {
  pending: 'badge-warning', processing: 'badge-info',
  shipped: 'badge-primary', delivered: 'badge-success', cancelled: 'badge-error',
};

export default function AdminPage() {
  const { t, language } = useTranslation();
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

  const getCategoryLabel = (cat) => {
    if (!cat) return '';
    const key = cat.toLowerCase();
    if (key === 'mens' || key === 'men') return t('shop.mens');
    if (key === 'ladies' || key === 'women' || key === 'lady') return t('shop.ladies');
    if (key === 'kids' || key === 'kid') return t('shop.kids');
    return cat;
  };

  const englishNumberToWords = (num) => {
    if (num === 0) return 'Zero Taka Only';
    
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 
                   'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    
    const convertLessThanThousand = (n) => {
      if (n === 0) return '';
      let str = '';
      if (n >= 100) {
        str += ones[Math.floor(n / 100)] + ' Hundred ';
        n %= 100;
      }
      if (n >= 20) {
        str += tens[Math.floor(n / 10)] + ' ';
        n %= 10;
      }
      if (n > 0) {
        str += ones[n] + ' ';
      }
      return str.trim();
    };

    let result = '';
    let temp = num;
    
    const crore = Math.floor(temp / 10000000);
    temp %= 10000000;
    
    const lakh = Math.floor(temp / 100000);
    temp %= 100000;
    
    const thousand = Math.floor(temp / 1000);
    temp %= 1000;
    
    if (crore > 0) {
      result += convertLessThanThousand(crore) + ' Crore ';
    }
    if (lakh > 0) {
      result += convertLessThanThousand(lakh) + ' Lakh ';
    }
    if (thousand > 0) {
      result += convertLessThanThousand(thousand) + ' Thousand ';
    }
    if (temp > 0) {
      result += convertLessThanThousand(temp);
    }
    
    return result.trim() + ' Taka Only';
  };

  const bengaliNumberToWords = (num) => {
    if (num === 0) return 'শূন্য টাকা মাত্র';
    
    const ones = ['', 'এক', 'দুই', 'তিন', 'চার', 'পাঁচ', 'ছয়', 'সাত', 'আট', 'নয়', 'দশ', 
                   'এগারো', 'বারো', 'তেরো', 'চৌদ্দ', 'পনেরো', 'ষোলো', 'সতেরো', 'আঠারো', 'উনিশ',
                   'বিশ', 'একুশ', 'বাইশ', 'তেইশ', 'চব্বিশ', 'পঁচিশ', 'ছাব্বিশ', 'সাতাশ', 'আঠাশ', 'ঊনত্রিশ',
                   'ত্রিশ', 'একত্রিশ', 'বত্রিশ', 'তেত্রিশ', 'চৌত্রিশ', 'পঁয়ত্রিশ', 'ছত্রিশ', 'সাঁইত্রিশ', 'আটত্রিশ', 'ঊনচল্লিশ',
                   'চল্লিশ', 'একচল্লিশ', 'বিয়াল্লিশ', 'তেতাল্লিশ', 'চৌয়াল্লিশ', 'পঁয়তাল্লিশ', 'ছেচল্লিশ', 'সাতচল্লিশ', 'আটচল্লিশ', 'ঊনপঞ্চাশ',
                   'পঞ্চাশ', 'একান্ন', 'বায়ান্ন', 'তিপ্পান্ন', 'চৌয়ান্ন', 'পঞ্চান্ন', 'ছাপ্পান্ন', 'সাতান্ন', 'আটান্ন', 'ঊনষাট',
                   'ষাট', 'একষট্টি', 'বাষট্টি', 'তেষট্টি', 'চৌষট্টি', 'পঁয়ষট্টি', 'ছেষট্টি', 'সাতষট্টি', 'আটষট্টি', 'ঊনসত্তর',
                   'সত্তর', 'একাত্তর', 'বাহাত্তর', 'তিয়াত্তর', 'চৌয়াত্তর', 'পঁচাত্তর', 'ছেয়াত্তর', 'সাতাত্তর', 'আটাত্তর', 'ঊনআশি',
                   'আশি', 'একাশি', 'বিরাশি', 'তিরাশি', 'চৌরাশি', 'পঁচাশি', 'ছেড়াশি', 'সাতাশি', 'আटाশি', 'ঊননব্বই',
                   'নব্বই', 'একানব্বই', 'বিরানব্বই', 'তিরানব্বই', 'চৌরানব্বই', 'পঁচানব্বই', 'ছেয়ানব্বই', 'সাতানব্বই', 'আটানব্বই', 'নিরানব্বই'];

    const convertLessThanHundred = (n) => {
      return ones[n] || '';
    };

    let temp = num;
    let result = '';

    const crore = Math.floor(temp / 10000000);
    temp %= 10000000;
    
    const lakh = Math.floor(temp / 100000);
    temp %= 100000;
    
    const thousand = Math.floor(temp / 1000);
    temp %= 1000;
    
    const hundred = Math.floor(temp / 100);
    temp %= 100;

    if (crore > 0) {
      result += (crore < 100 ? convertLessThanHundred(crore) : bengaliNumberToWords(crore).replace(' টাকা মাত্র', '')) + ' কোটি ';
    }
    if (lakh > 0) {
      result += convertLessThanHundred(lakh) + ' লাখ ';
    }
    if (thousand > 0) {
      result += convertLessThanHundred(thousand) + ' হাজার ';
    }
    if (hundred > 0) {
      result += convertLessThanHundred(hundred) + ' শত ';
    }
    if (temp > 0) {
      result += convertLessThanHundred(temp);
    }

    return result.trim() + ' টাকা মাত্র';
  };

  const handlePrintInvoice = (order) => {
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.width = '0px';
    iframe.style.height = '0px';
    iframe.style.border = 'none';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document;

    const addressLines = order.shipping_address ? order.shipping_address.split('\n') : [];
    const address = addressLines[0] || '';
    const phoneLine = addressLines.find(l => l.includes('Phone') || l.includes('ফোন') || l.toLowerCase().includes('phone')) || '';
    const noteLine = addressLines.find(l => l.includes('Note') || l.includes('নোট') || l.toLowerCase().includes('note')) || '';

    const phone = phoneLine.replace(/.*[:\s]/, '').trim() || order.users?.phone || '';
    const note = noteLine.replace(/.*[:\s]/, '').trim() || '';

    const dateStr = new Date(order.created_at).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const paymentLabel = order.payment_method === 'cod' 
      ? (language === 'bn' ? 'ক্যাশ অন ডেলিভারি (COD)' : 'Cash on Delivery (COD)')
      : (order.payment_method === 'card' 
         ? (language === 'bn' ? 'কার্ড পেমেন্ট' : 'Card Payment') 
         : order.payment_method);

    const itemsHtml = order.order_items.map((item, idx) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${idx + 1}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">
          <strong>${item.products?.name}</strong>
          ${item.products?.category ? `<div style="font-size: 0.8rem; color: #777;">${getCategoryLabel(item.products.category)}</div>` : ''}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">৳${parseFloat(item.price).toLocaleString()}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">৳${(parseFloat(item.price) * item.quantity).toLocaleString()}</td>
      </tr>
    `).join('');

    const subtotal = order.order_items.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
    const shippingCost = subtotal >= 2000 ? 0 : 100;
    const totalAmount = Math.round(parseFloat(order.total_amount));
    const inWordsText = language === 'bn' ? bengaliNumberToWords(totalAmount) : englishNumberToWords(totalAmount);

    const html = `
      <html>
        <head>
          <title>Invoice #${order.id}</title>
          <style>
            body {
              font-family: 'Inter', Arial, sans-serif;
              margin: 0;
              padding: 30px;
              color: #333;
              background: #fff;
            }
            .invoice-box {
              max-width: 800px;
              margin: auto;
              border: 1px solid #eee;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
              padding: 30px;
              border-radius: 8px;
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              border-bottom: 2px solid #5a20cb;
              padding-bottom: 20px;
              margin-bottom: 20px;
            }
            .logo {
              font-size: 1.8rem;
              font-weight: 800;
              color: #1a1a1a;
              letter-spacing: -0.5px;
            }
            .logo span {
              color: #5a20cb;
            }
            .title {
              font-size: 1.5rem;
              font-weight: 700;
              text-transform: uppercase;
              color: #5a20cb;
              text-align: right;
            }
            .details {
              display: flex;
              justify-content: space-between;
              margin-bottom: 30px;
              font-size: 0.9rem;
              line-height: 1.6;
            }
            .details-col {
              flex: 1;
            }
            .details-col:last-child {
              text-align: right;
            }
            .section-title {
              font-size: 0.8rem;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              color: #777;
              margin-bottom: 8px;
              font-weight: 600;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 30px;
              font-size: 0.95rem;
            }
            th {
              background: #f7f7f7;
              padding: 12px 10px;
              font-weight: 600;
              text-align: left;
              border-bottom: 2px solid #ddd;
            }
            .in-words {
              margin-top: 10px;
              margin-bottom: 20px;
              padding: 10px 15px;
              background-color: #fcfaff;
              border: 1px solid #efe8fc;
              border-radius: 6px;
              font-size: 0.9rem;
            }
            .totals-wrap {
              display: flex;
              justify-content: flex-end;
              margin-bottom: 30px;
            }
            .totals-table {
              width: 40%;
              border-collapse: collapse;
            }
            .totals-table td {
              padding: 8px 10px;
              border: none;
            }
            .totals-table tr:last-child td {
              font-size: 1.1rem;
              font-weight: 800;
              color: #5a20cb;
              border-top: 2px double #ddd;
            }
            .policy-box {
              margin-top: 40px;
              padding: 15px;
              background: #fffdf7;
              border: 1px solid #fcf6e8;
              border-left: 4px solid #f59e0b;
              border-radius: 6px;
              font-size: 0.85rem;
              line-height: 1.5;
            }
            .footer {
              margin-top: 40px;
              border-top: 1px solid #eee;
              padding-top: 20px;
              text-align: center;
              font-size: 0.8rem;
              color: #777;
              line-height: 1.5;
            }
            @media print {
              body { padding: 0; }
              .invoice-box {
                border: none;
                box-shadow: none;
                padding: 0;
              }
            }
          </style>
        </head>
        <body>
          <div class="invoice-box">
            <div class="header">
              <div class="logo">SHADOW <span>ZONE</span></div>
              <div class="title">${language === 'bn' ? 'চালান / ইনভয়েস' : 'INVOICE'}</div>
            </div>
            
            <div class="details">
              <div class="details-col">
                <div class="section-title">${language === 'bn' ? 'কোম্পানি' : 'FROM'}</div>
                <strong>Shadow Zone</strong><br/>
                Dhaka, Bangladesh<br/>
                Email: support@shadowzone.com<br/>
                Web: shadowzone.com
              </div>
              <div class="details-col" style="padding-left: 20px;">
                <div class="section-title">${language === 'bn' ? 'গ্রাহক' : 'TO'}</div>
                <strong>${order.users?.name || 'Customer'}</strong><br/>
                ${address}<br/>
                ${phone ? `${language === 'bn' ? 'ফোন' : 'Phone'}: ${phone}<br/>` : ''}
                Email: ${order.users?.email || 'N/A'}
              </div>
              <div class="details-col">
                <div class="section-title">${language === 'bn' ? 'ইনভয়েস তথ্য' : 'INVOICE INFO'}</div>
                <strong>${language === 'bn' ? 'অর্ডার নম্বর' : 'Order ID'}:</strong> #${order.id}<br/>
                <strong>${language === 'bn' ? 'তারিখ' : 'Date'}:</strong> ${dateStr}<br/>
                <strong>${language === 'bn' ? 'পেমেন্ট পদ্ধতি' : 'Payment'}:</strong> ${paymentLabel}
              </div>
            </div>

            ${note ? `
            <div style="margin-bottom: 20px; padding: 12px; background: #fafafa; border-left: 3px solid #5a20cb; font-size: 0.85rem; border-radius: 4px;">
              <strong>${language === 'bn' ? 'অর্ডার নোট' : 'Order Note'}:</strong> ${note}
            </div>
            ` : ''}

            <table style="width: 100%;">
              <thead>
                <tr>
                  <th style="width: 5%;">#</th>
                  <th style="width: 50%;">${language === 'bn' ? 'পণ্য' : 'Product'}</th>
                  <th style="width: 15%; text-align: center;">${language === 'bn' ? 'মূল্য' : 'Price'}</th>
                  <th style="width: 10%; text-align: center;">${language === 'bn' ? 'পরিমাণ' : 'Qty'}</th>
                  <th style="width: 20%; text-align: right;">${language === 'bn' ? 'মোট' : 'Total'}</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <div class="totals-wrap">
              <table class="totals-table">
                <tr>
                  <td>${language === 'bn' ? 'উপমোট' : 'Subtotal'}:</td>
                  <td style="text-align: right;">৳${subtotal.toLocaleString()}</td>
                </tr>
                <tr>
                  <td>${language === 'bn' ? 'ডেলিভারি চার্জ' : 'Shipping'}:</td>
                  <td style="text-align: right;">${shippingCost === 0 ? (language === 'bn' ? 'ফ্রি' : 'Free') : `৳${shippingCost}`}</td>
                </tr>
                <tr>
                  <td>${language === 'bn' ? 'সর্বমোট' : 'Total'}:</td>
                  <td style="text-align: right; font-weight: bold;">৳${totalAmount.toLocaleString()}</td>
                </tr>
              </table>
            </div>

            <div class="in-words" style="text-align: right; border: none; background: none; padding: 0; margin-top: -15px; margin-bottom: 35px; font-size: 0.95rem;">
              <strong>${t('admin.inWords') || (language === 'bn' ? 'কথায়:' : 'In Words:')}</strong> <span style="font-style: italic; color: #5a20cb; font-weight: 600;">${inWordsText}</span>
            </div>

            <div class="policy-box">
              <strong>${t('admin.returnPolicyLabel') || (language === 'bn' ? 'ফেরত নীতি:' : 'Return Policy:')}</strong>
              <div>${t('admin.returnPolicyText') || (language === 'bn' ? 'মূল প্যাকেজিং ও অক্ষত অবস্থায় পণ্য ৭ দিনের মধ্যে ফেরত দেওয়া যাবে।' : 'Items can be returned within 7 days in their original packaging and pristine condition.')}</div>
            </div>

            <div class="footer">
              <p>${language === 'bn' ? 'আমাদের সাথে কেনাকাটা করার জন্য আপনাকে ধন্যবাদ!' : 'Thank you for shopping with us!'}</p>
              <p style="font-size: 0.75rem; color: #aaa;">${language === 'bn' ? 'এটি একটি কম্পিউটার জেনারেটেড চালান এবং কোন স্বাক্ষরের প্রয়োজন নেই।' : 'This is a computer-generated invoice and requires no signature.'}</p>
            </div>
          </div>

          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() {
                window.frameElement.parentNode.removeChild(window.frameElement);
              }, 1000);
            }
          </script>
        </body>
      </html>
    `;

    doc.open();
    doc.write(html);
    doc.close();
  };

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
      toast.success(`${t('admin.order')} #${orderId} → ${getStatusLabel(status)}`);
      fetchOrders();
      fetchStats();
    } catch (err) {
      toast.error(t('admin.failedToUpdateOrder'));
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
      toast.success(editProduct ? t('admin.productUpdated') : t('admin.productCreated'));
      setShowProductModal(false);
      fetchProducts();
      fetchStats();
    } catch (err) {
      toast.error(t('admin.failedToSaveProduct'));
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm(t('admin.confirmDelete'))) return;
    try {
      const res = await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed');
      toast.success(t('admin.productDeleted'));
      fetchProducts();
      fetchStats();
    } catch (err) {
      toast.error(t('admin.failedToDeleteProduct'));
    }
  };

  if (authLoading || !user || user.role !== 'admin') {
    return <div className="page-loader"><div className="spinner spinner-lg" /></div>;
  }

  const TABS = [
    { id: 'dashboard', label: t('admin.dashboard'), icon: '📊' },
    { id: 'orders', label: t('admin.orders'), icon: '📦' },
    { id: 'products', label: t('admin.products'), icon: '🏷️' },
  ];

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <div>
            <h1 className="heading-display heading-2">
              {t('admin.title').split(' ')[0]} <span className="text-gradient">{t('admin.title').split(' ').slice(1).join(' ')}</span>
            </h1>
            <p className="text-secondary mt-2">{t('admin.manageStore')}</p>
          </div>
          <div className="flex gap-2">
            <Link href="/dashboard/stock" className="btn btn-primary btn-sm">📦 {t('admin.manageStock')}</Link>
            <Link href="/dashboard" className="btn btn-secondary btn-sm">← {t('admin.backToDashboard')}</Link>
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
                { label: t('admin.totalProducts'), value: stats.totalProducts, icon: '🏷️', color: '#9333ea' },
                { label: t('admin.totalOrders'), value: stats.totalOrders, icon: '📦', color: '#3b82f6' },
                { label: t('admin.totalCustomers'), value: stats.totalCustomers, icon: '👥', color: '#22c55e' },
                { label: t('admin.revenue'), value: `৳${stats.totalRevenue?.toLocaleString()}`, icon: '💰', color: '#f59e0b' },
                { label: t('admin.pendingOrders'), value: stats.pendingOrders, icon: '⏳', color: '#ef4444' },
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
                <h3 className="heading-display heading-3 mb-4">{t('admin.ordersByStatus')}</h3>
                <div className="flex flex-col gap-3">
                  {Object.entries(stats.statusCounts || {}).map(([status, count]) => (
                    <div key={status} className="flex items-center justify-between">
                      <span className={`badge ${statusColors[status]}`}>{getStatusLabel(status)}</span>
                      <span className="font-bold">{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Products by Category */}
              <div className="card p-6">
                <h3 className="heading-display heading-3 mb-4">{t('admin.productsByCategory')}</h3>
                <div className="flex flex-col gap-3">
                  {Object.entries(stats.categoryCounts || {}).map(([cat, count]) => (
                    <div key={cat} className="flex items-center justify-between">
                      <span className="font-medium">{getCategoryLabel(cat)}</span>
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
              <h3 className="heading-display heading-3 mb-4">{t('admin.recentOrders')}</h3>
              <div className="table-wrapper">
                <table className="table">
                  <thead>
                    <tr>
                      <th>{t('admin.order')}</th>
                      <th>{t('admin.customer')}</th>
                      <th>{t('admin.amount')}</th>
                      <th>{t('common.status')}</th>
                      <th>{t('common.date')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map(o => (
                      <tr key={o.id}>
                        <td className="font-semibold">#{o.id}</td>
                        <td>{o.users?.name || 'N/A'}</td>
                        <td className="price">৳{parseFloat(o.total_amount).toLocaleString()}</td>
                        <td><span className={`badge ${statusColors[o.status]}`}>{getStatusLabel(o.status)}</span></td>
                        <td className="text-muted text-sm">
                          {new Date(o.created_at).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
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
                  {s === 'all' ? t('common.all') : getStatusLabel(s)}
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
                        <p className="font-bold">{t('admin.order')} #{order.id}</p>
                        <p className="text-sm text-muted">by {order.users?.name || 'N/A'} ({order.users?.email})</p>
                        <p className="text-xs text-muted">
                          {new Date(order.created_at).toLocaleString(language === 'bn' ? 'bn-BD' : 'en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="price">৳{parseFloat(order.total_amount).toLocaleString()}</span>
                        {order.status === 'delivered' && (
                          <button
                            onClick={() => handlePrintInvoice(order)}
                            className="btn btn-primary btn-sm"
                            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', fontSize: '0.8rem' }}
                            title={t('admin.printInvoice')}
                          >
                            🖨️ {t('admin.printInvoice')}
                          </button>
                        )}
                        <select
                          className="input"
                          value={order.status}
                          onChange={e => updateOrderStatus(order.id, e.target.value)}
                          style={{ width: 'auto', padding: '8px 32px 8px 12px', fontSize: '0.8rem' }}
                        >
                          {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
                            <option key={s} value={s}>{getStatusLabel(s)}</option>
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
              <p className="text-secondary">{products.length} {t('admin.products')}</p>
              <button className="btn btn-primary btn-sm" onClick={() => openProductModal()}>
                {t('admin.addProduct')}
              </button>
            </div>
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>{t('admin.products')}</th>
                    <th>{t('common.category')}</th>
                    <th>{t('common.price')}</th>
                    <th>{t('admin.featuredProduct')}</th>
                    <th>{t('common.actions')}</th>
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
                      <td><span className="badge badge-primary">{getCategoryLabel(p.category)}</span></td>
                      <td className="price">৳{parseFloat(p.price).toLocaleString()}</td>
                      <td>{p.featured ? '⭐' : '—'}</td>
                      <td>
                        <div className="flex gap-2">
                          <button className="btn btn-secondary btn-sm" onClick={() => openProductModal(p)}>{t('common.edit')}</button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDeleteProduct(p.id)}>{t('common.delete')}</button>
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
              <h2 className="heading-display heading-3 mb-4">{editProduct ? t('admin.editProduct') : t('admin.addProduct')}</h2>
              <div className="flex flex-col gap-4">
                <div className="input-group">
                  <label>{t('admin.productName')} *</label>
                  <input className="input" value={productForm.name} onChange={e => setProductForm(f => ({ ...f, name: e.target.value }))} />
                </div>
                <div className="input-group">
                  <label>{t('admin.description')}</label>
                  <textarea className="input" rows={2} value={productForm.description} onChange={e => setProductForm(f => ({ ...f, description: e.target.value }))} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="input-group">
                    <label>{t('admin.productPrice')} *</label>
                    <input className="input" type="number" value={productForm.price} onChange={e => setProductForm(f => ({ ...f, price: e.target.value }))} />
                  </div>
                  <div className="input-group">
                    <label>{t('admin.originalPrice')}</label>
                    <input className="input" type="number" value={productForm.original_price} onChange={e => setProductForm(f => ({ ...f, original_price: e.target.value }))} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="input-group">
                    <label>{t('common.category')} *</label>
                    <select className="input" value={productForm.category} onChange={e => setProductForm(f => ({ ...f, category: e.target.value }))}>
                      <option value="Mens">{t('shop.mens')}</option>
                      <option value="Ladies">{t('shop.ladies')}</option>
                      <option value="Kids">{t('shop.kids')}</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <label>{t('admin.subCategory')} *</label>
                    <input className="input" value={productForm.sub_category} onChange={e => setProductForm(f => ({ ...f, sub_category: e.target.value }))} />
                  </div>
                </div>
                <div className="input-group">
                  <label>{t('admin.imageUrl')} / {t('admin.upload')}</label>
                  <div className="flex gap-2">
                    <input className="input" value={productForm.image_url} onChange={e => setProductForm(f => ({ ...f, image_url: e.target.value }))} placeholder="https://..." style={{ flex: 1 }} />
                    <div style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', height: '100%' }}>
                      <UploadButton
                        endpoint="imageUploader"
                        onClientUploadComplete={(res) => {
                          console.log("Upload Completed", res);
                          if (res && res.length > 0) {
                            setProductForm(f => ({ ...f, image_url: res[0].url }));
                            toast.success(t('admin.imageUploaded'));
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
                            if (ready) return <div>{t('admin.uploadImage')}</div>;
                            return t('admin.loading');
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
                    <label>{t('common.size')}</label>
                    <input className="input" value={productForm.size} onChange={e => setProductForm(f => ({ ...f, size: e.target.value }))} />
                  </div>
                  <div className="input-group">
                    <label>{t('common.color')}</label>
                    <input className="input" value={productForm.color} onChange={e => setProductForm(f => ({ ...f, color: e.target.value }))} />
                  </div>
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.9rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={productForm.featured} onChange={e => setProductForm(f => ({ ...f, featured: e.target.checked }))} style={{ accentColor: 'var(--primary-500)' }} />
                  {t('admin.featuredProduct')}
                </label>
                <div className="flex gap-3 mt-2">
                  <button className="btn btn-primary flex-1" onClick={handleProductSave}>{editProduct ? t('common.update') : t('admin.create')}</button>
                  <button className="btn btn-secondary flex-1" onClick={() => setShowProductModal(false)}>{t('common.cancel')}</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
