'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

export default function StockManagement() {
  const { user } = useAuth();
  const toast = useToast();
  const [stockList, setStockList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editedStock, setEditedStock] = useState({});

  useEffect(() => {
    async function loadStock() {
      try {
        const res = await fetch('/api/stock');
        const data = await res.json();
        if (data.stock) setStockList(data.stock);
      } catch (err) {
        console.error('Failed to load stock', err);
      } finally {
        setLoading(false);
      }
    }
    if (user?.role === 'admin') {
      loadStock();
    }
  }, [user]);

  if (user?.role !== 'admin') {
    return <div className="card p-6">Access Denied</div>;
  }

  const handleQuantityChange = (id, newQuantity) => {
    setEditedStock(prev => ({
      ...prev,
      [id]: parseInt(newQuantity) || 0
    }));
  };

  const handleSave = async () => {
    const stockItemsToUpdate = Object.entries(editedStock).map(([id, quantity]) => ({
      id: parseInt(id),
      quantity
    }));

    if (stockItemsToUpdate.length === 0) return;

    setSaving(true);
    try {
      const res = await fetch('/api/stock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stockItems: stockItemsToUpdate }),
      });
      if (!res.ok) throw new Error('Failed to update stock');
      
      toast.success('Stock updated successfully');
      setEditedStock({});
      
      // Update local state
      setStockList(prev => prev.map(item => {
        if (editedStock[item.id] !== undefined) {
          return { ...item, quantity: editedStock[item.id] };
        }
        return item;
      }));
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="page-loader"><div className="spinner spinner-lg" /></div>;

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="heading-display heading-3">Stock Management</h1>
        <button 
          className="btn btn-primary" 
          onClick={handleSave} 
          disabled={saving || Object.keys(editedStock).length === 0}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="table" style={{ width: '100%', minWidth: '800px' }}>
          <thead>
            <tr>
              <th className="text-left py-4 border-b">Product</th>
              <th className="text-left py-4 border-b">Size</th>
              <th className="text-left py-4 border-b">Current Stock</th>
              <th className="text-left py-4 border-b">Status</th>
              <th className="text-left py-4 border-b" style={{ width: '150px' }}>Edit Quantity</th>
            </tr>
          </thead>
          <tbody>
            {stockList.map(item => {
              const displayQuantity = editedStock[item.id] !== undefined ? editedStock[item.id] : item.quantity;
              
              let statusBadge;
              if (displayQuantity === 0) {
                statusBadge = <span className="badge badge-error">Out of Stock</span>;
              } else if (displayQuantity < 10) {
                statusBadge = <span className="badge badge-warning" style={{ backgroundColor: '#f59e0b', color: '#fff' }}>Low Stock</span>;
              } else {
                statusBadge = <span className="badge badge-success">Available</span>;
              }

              return (
                <tr key={item.id} className="border-b" style={{ borderColor: 'var(--border)' }}>
                  <td className="py-4">
                    <div className="flex items-center gap-4">
                      {item.products?.image_url && (
                        <img src={item.products.image_url} alt="img" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }} />
                      )}
                      <div>
                        <div className="font-medium">{item.products?.name}</div>
                        <div className="text-xs text-muted">{item.products?.category}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">{item.size || 'N/A'}</td>
                  <td className="py-4">{item.quantity}</td>
                  <td className="py-4">{statusBadge}</td>
                  <td className="py-4">
                    <input 
                      type="number" 
                      className="input" 
                      value={displayQuantity}
                      onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                      min="0"
                      style={{ width: '100px', padding: '0.4rem 0.75rem' }}
                    />
                  </td>
                </tr>
              );
            })}
            
            {stockList.length === 0 && (
              <tr>
                <td colSpan="5" className="py-8 text-center text-muted">
                  No stock records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
