'use client';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useTranslation } from '@/context/LanguageContext';
import dynamic from 'next/dynamic';
import styles from './Navbar.module.css';

const Logo3D = dynamic(() => import('./Logo3D'), { ssr: false });

export default function Navbar() {
  const { user, logout } = useAuth();
  const { totalItems, setIsOpen } = useCart();
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <nav className={`container ${styles.nav}`}>
        <Link href="/" className={styles.logoLink}>
          <div className={styles.logo3dWrap}>
            <Suspense fallback={null}>
              <Logo3D size="small" />
            </Suspense>
          </div>
          <span className={styles.logoText}>Shadow Zone</span>
        </Link>

        <div className={`${styles.links} ${mobileOpen ? styles.linksOpen : ''}`}>
          <Link href="/" className={styles.link} onClick={() => setMobileOpen(false)}>{t('navbar.home')}</Link>
          <Link href="/shop" className={styles.link} onClick={() => setMobileOpen(false)}>{t('navbar.shop')}</Link>
          <Link href="/shop?category=Mens" className={styles.link} onClick={() => setMobileOpen(false)}>{t('shop.mens')}</Link>
          <Link href="/shop?category=Ladies" className={styles.link} onClick={() => setMobileOpen(false)}>{t('shop.ladies')}</Link>
          <Link href="/shop?category=Kids" className={styles.link} onClick={() => setMobileOpen(false)}>{t('shop.kids')}</Link>
          <Link href="/blog" className={styles.link} onClick={() => setMobileOpen(false)}>{t('navbar.blog')}</Link>
          <Link href="/about" className={styles.link} onClick={() => setMobileOpen(false)}>{t('navbar.about')}</Link>
        </div>
 
        <div className={styles.actions}>
          {/* Search */}
          <Link href="/shop" className={`btn-icon ${styles.actionBtn}`} title={t('common.search')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
          </Link>
 
          {/* Cart */}
          <button className={`btn-icon ${styles.actionBtn}`} onClick={() => setIsOpen(true)} title={t('navbar.cart')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            {totalItems > 0 && <span className={styles.cartBadge}>{totalItems}</span>}
          </button>
 
          {/* Auth */}
          {user ? (
            <div className={styles.userMenu}>
              <button
                className={`btn-icon ${styles.actionBtn}`}
                onClick={() => setDropdownOpen(!dropdownOpen)}
                title={t('navbar.profile')}
              >
                <div className={styles.avatar}>
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </div>
              </button>
              {dropdownOpen && (
                <>
                  <div className={styles.dropdownOverlay} onClick={() => setDropdownOpen(false)} />
                  <div className={styles.dropdown}>
                    <div className={styles.dropdownHeader}>
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-xs text-muted">{user.email}</p>
                    </div>
                    <div className={styles.dropdownDivider} />
                    <Link href="/dashboard" className={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
                      {t('navbar.dashboard')}
                    </Link>
                    {user.role === 'admin' && (
                      <Link href="/admin" className={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
                        {t('navbar.admin')}
                      </Link>
                    )}
                    <Link href="/dashboard/orders" className={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14"/><path d="m7.5 4.27 9 5.15"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" x2="12" y1="22" y2="12"/></svg>
                      {t('navbar.myOrders')}
                    </Link>
                    <div className={styles.dropdownDivider} />
                    <button className={styles.dropdownItem} onClick={() => { logout(); setDropdownOpen(false); }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
                      {t('common.logout')}
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link href="/auth/login" className="btn btn-primary btn-sm">
              {t('common.login')}
            </Link>
          )}

          {/* Mobile toggle */}
          <button className={styles.mobileToggle} onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      {mobileOpen && <div className={styles.mobileOverlay} onClick={() => setMobileOpen(false)} />}
    </header>
  );
}
