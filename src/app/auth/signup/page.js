'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import styles from '../auth.module.css';

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const toast = useToast();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await signup(form.name, form.email, form.password, form.phone);
      toast.success('Account created! Welcome to Shadow Zone.');
      router.push('/');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const update = (key) => (e) => setForm(prev => ({ ...prev, [key]: e.target.value }));

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.header}>
            <Link href="/" className={styles.logo}>Shadow Zone</Link>
            <h1>Create Account</h1>
            <p>Join the Shadow Zone family</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className="input-group">
              <label htmlFor="name">Full Name</label>
              <input id="name" type="text" className="input" placeholder="John Doe" value={form.name} onChange={update('name')} required />
            </div>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" className="input" placeholder="your@email.com" value={form.email} onChange={update('email')} required />
            </div>
            <div className="input-group">
              <label htmlFor="phone">Phone (optional)</label>
              <input id="phone" type="tel" className="input" placeholder="+880 1XXX XXXXXX" value={form.phone} onChange={update('phone')} />
            </div>
            <div className={styles.row}>
              <div className="input-group">
                <label htmlFor="password">Password</label>
                <input id="password" type="password" className="input" placeholder="Min 6 characters" value={form.password} onChange={update('password')} required />
              </div>
              <div className="input-group">
                <label htmlFor="confirmPassword">Confirm</label>
                <input id="confirmPassword" type="password" className="input" placeholder="Repeat password" value={form.confirmPassword} onChange={update('confirmPassword')} required />
              </div>
            </div>
            <button type="submit" className="btn btn-primary w-full" disabled={loading}>
              {loading ? <span className="spinner" /> : 'Create Account'}
            </button>
          </form>

          <p className={styles.switch}>
            Already have an account? <Link href="/auth/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
