import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { ToastProvider } from '@/context/ToastContext';
import { LanguageProvider } from '@/context/LanguageContext';
import Navbar from '@/components/Navbar';
import CartDrawer from '@/components/CartDrawer';
import Footer from '@/components/Footer';
import Chatbot from '@/components/Chatbot';

export const metadata = {
  title: 'Shadow Zone — প্রিমিয়াম প্রস্তুত পোশাক',
  description: 'পুরুষ, মহিলা এবং শিশুদের জন্য প্রিমিয়াম প্রস্তুত ফ্যাশন আবিষ্কার করুন। Shadow Zone আপনার দোরগোড়ায় স্টাইল, আরাম এবং কমনীয়তা সহ মানসম্পন্ন পোশাক নিয়ে আসে।',
  keywords: 'shadow zone, প্রস্তুত পোশাক, ফ্যাশন, পুরুষ পোশাক, মহিলা পোশাক, শিশু পোশাক, অনলাইন শপিং',
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn">
      <body suppressHydrationWarning>
        <LanguageProvider>
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
        </LanguageProvider>
      </body>
    </html>
  );
}
