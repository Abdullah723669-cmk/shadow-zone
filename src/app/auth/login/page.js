'use client';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useTranslation } from '@/context/LanguageContext';
import styles from '../auth.module.css';

function LoginForm() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const toast = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success(t('auth.welcomeBackToast'));
      router.push(redirect);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.header}>
            <Link href="/" className={styles.logo}>Shadow Zone</Link>
            <h1>{t('auth.login')}</h1>
            <p>{t('auth.loginDesc')}</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className="input-group">
              <label htmlFor="email">{t('common.email')}</label>
              <input
                id="email"
                type="email"
                className="input"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">{t('auth.password')}</label>
              <input
                id="password"
                type="password"
                className="input"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-full" disabled={loading}>
              {loading ? <span className="spinner" /> : t('auth.loginNow')}
            </button>
          </form>

          <p className={styles.switch}>
            {t('auth.dontHaveAccount')} <Link href="/auth/signup">{t('auth.signupNow')}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="page-loader"><div className="spinner spinner-lg" /></div>}>
      <LoginForm />
    </Suspense>
  );
}
