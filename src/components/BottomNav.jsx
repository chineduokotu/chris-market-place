import { Link, useLocation } from 'react-router-dom';
import { Home, Info, LayoutDashboard, MessageSquare, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';

export default function BottomNav() {
  const { user } = useAuth();
  const { unreadTotal } = useChat();
  const location = useLocation();

  if (!user) return null;

  const hiddenPaths = ['/login', '/register'];
  const shouldShow = !hiddenPaths.some((path) => location.pathname.startsWith(path));

  if (!shouldShow) return null;

  const items = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'How', path: '/how-it-works', icon: Info },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Messages', path: '/messages', icon: MessageSquare, badge: unreadTotal },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--color-border)] bg-white/95 px-2 py-1 backdrop-blur md:hidden"
      aria-label="Mobile navigation"
    >
      <div className="container-app px-0">
        <div className="flex items-center justify-between">
          {items.map((item) => {
            const active = item.path === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative flex min-w-0 flex-1 flex-col items-center gap-1 rounded-[10px] px-1 py-2 text-[11px] font-semibold ${
                  active ? 'text-[var(--color-primary)]' : 'text-[var(--color-muted)]'
                }`}
              >
                <item.icon size={18} />
                <span>{item.name}</span>
                {item.badge > 0 ? (
                  <span className="absolute right-5 top-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--color-primary)] px-1 text-[10px] font-bold text-[var(--color-text)]">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}


