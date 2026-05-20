'use client';
import Link from 'next/link';
import { useTranslation } from '@/context/LanguageContext';
import styles from './not-found.module.css';

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className="heading-display heading-1">{t('errors.404')}</h1>
        <p className="heading-display heading-3" style={{ marginBottom: '1rem' }}>{t('errors.pageNotFound')}</p>
        <p className="text-muted" style={{ marginBottom: '2rem' }}>{t('errors.pageNotFoundDesc')}</p>
        <Link href="/" className="btn btn-primary">
          {t('errors.goToHome')}
        </Link>
      </div>
    </div>
  );
}
