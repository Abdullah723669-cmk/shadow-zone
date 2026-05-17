import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { ToastProvider } from '@/context/ToastContext';
import Navbar from '@/components/Navbar';
import CartDrawer from '@/components/CartDrawer';
import Footer from '@/components/Footer';
import Chatbot from '@/components/Chatbot';

export const metadata = {
  title: 'Shadow Zone — Premium Readymade Garments',
  description: 'Discover premium readymade fashion for Men, Ladies & Kids. Shadow Zone brings you quality garments with style, comfort, and elegance at your doorstep.',
  keywords: 'shadow zone, readymade garments, fashion, men clothing, ladies clothing, kids clothing, online shopping',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <AuthProvider>
          <CartProvider>
            <ToastProvider>
              <Navbar />
              <CartDrawer />
              <main style={{ minHeight: '100vh', paddingTop: '72px' }}>
                {children}
              </main>
              <Footer />
              <Chatbot />
            </ToastProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
