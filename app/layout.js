import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Unchi Awaaj Party - Building a Stronger Nation',
  description: 'Join the Unchi Awaaj Party. Learn about our mission, leadership, and upcoming events.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main style={{ minHeight: 'calc(100vh - 400px)' }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
