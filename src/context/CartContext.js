'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('shadowzone_cart');
    if (saved) {
      try { setItems(JSON.parse(saved)); } catch { /* ignore */ }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('shadowzone_cart', JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((product, quantity = 1, size = '') => {
    setItems(prev => {
      const key = `${product.id}-${size}`;
      const existing = prev.find(item => `${item.id}-${item.size}` === key);
      if (existing) {
        return prev.map(item =>
          `${item.id}-${item.size}` === key
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, {
        id: product.id,
        name: product.name,
        price: parseFloat(product.price),
        original_price: product.original_price ? parseFloat(product.original_price) : null,
        image_url: product.image_url,
        size,
        quantity,
        category: product.category,
      }];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((id, size = '') => {
    setItems(prev => prev.filter(item => !(item.id === id && item.size === size)));
  }, []);

  const updateQuantity = useCallback((id, size, quantity) => {
    if (quantity <= 0) {
      removeItem(id, size);
      return;
    }
    setItems(prev =>
      prev.map(item =>
        item.id === id && item.size === size
          ? { ...item, quantity }
          : item
      )
    );
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
    setIsOpen(false);
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items, isOpen, setIsOpen,
      addItem, removeItem, updateQuantity, clearCart,
      totalItems, totalPrice,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
