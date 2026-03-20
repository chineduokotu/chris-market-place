import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, Info, LayoutDashboard, LogOut, MessageSquare, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import Button from './ui/Button';

const baseNavLinks = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'How It Works', path: '/how-it-works', icon: Info },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { unreadTotal } = useChat();
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = user
    ? [...baseNavLinks, { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard }]
    : baseNavLinks;

  const isActive = (path) => location.pathname === path;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-200 ${
        scrolled
          ? 'border-[var(--color-border)] bg-white/95 shadow-[0_8px_24px_rgba(37,99,235,0.16)] backdrop-blur'
          : 'border-transparent bg-white/80 backdrop-blur'
      }`}
    >
      <div className="container-app">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-7">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] border border-[var(--color-border)] text-[var(--color-muted)] hover:bg-slate-100 hover:text-[var(--color-text)]"
              aria-label="Go back"
            >
              <ArrowLeft size={18} />
            </button>

            <Link to="/" className="flex items-center gap-2.5" aria-label="ChrisHub homepage">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-[10px] text-sm font-extrabold text-[var(--color-text)]"
                style={{ background: 'var(--color-primary-gradient)' }}
                aria-hidden
              >
                C
              </div>
              <span className="text-lg font-extrabold text-[var(--color-text)]">ChrisHub</span>
            </Link>

            <nav aria-label="Primary navigation" className="hidden items-center gap-1 md:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`inline-flex items-center gap-2 rounded-[10px] px-3 py-2 text-sm font-semibold transition-colors ${
                    isActive(link.path)
                      ? 'bg-[var(--color-primary-soft)] text-[var(--color-primary)]'
                      : 'text-[var(--color-muted)] hover:bg-slate-100 hover:text-[var(--color-text)]'
                  }`}
                  aria-current={isActive(link.path) ? 'page' : undefined}
                >
                  <link.icon size={15} aria-hidden />
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="hidden items-center gap-2 md:flex">
            {user ? (
              <>
                <Link
                  to="/messages"
                  className="relative inline-flex h-10 w-10 items-center justify-center rounded-[10px] text-[var(--color-muted)] hover:bg-slate-100 hover:text-[var(--color-text)]"
                  aria-label="Open messages"
                >
                  <MessageSquare size={18} />
                  {unreadTotal > 0 ? (
                    <span className="absolute right-1 top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--color-primary)] px-1 text-[10px] font-bold text-[var(--color-text)]">
                      {unreadTotal > 9 ? '9+' : unreadTotal}
                    </span>
                  ) : null}
                </Link>
                <Link
                  to="/profile"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] text-[var(--color-muted)] hover:bg-slate-100 hover:text-[var(--color-text)]"
                  aria-label="Open profile"
                >
                  <User size={18} />
                </Link>
                <Button variant="ghost" size="sm" onClick={logout} aria-label="Log out">
                  <LogOut size={16} />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="secondary" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Join as Provider</Button>
                </Link>
              </>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}


