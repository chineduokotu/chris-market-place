import Navbar from '../Navbar';
import Footer from '../Footer';
import BottomNav from '../BottomNav';
import ScrollToTop from '../ScrollToTop';
import { cn } from '../../lib/cn';
import { useLocation } from 'react-router-dom';

export function PageContainer({ className, children }) {
  return <div className={cn('container-app', className)}>{children}</div>;
}

export default function AppShell({ children }) {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)]">
      <ScrollToTop />
      {!isHomePage ? <Navbar /> : null}
      <main className={cn('pb-20 md:pb-8', isHomePage ? 'min-h-screen pt-0' : 'min-h-[calc(100vh-264px)] pt-20')}>
        {children}
      </main>
      {!isHomePage ? <Footer /> : null}
      <BottomNav />
    </div>
  );
}
