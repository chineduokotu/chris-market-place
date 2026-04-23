import { LayoutDashboard, LogOut, NotebookText, PackageSearch, PanelsTopLeft, Shield, SquareStack, Tags, Users } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';
import ScrollToTop from '../../components/ScrollToTop';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/cn';

const adminLinks = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/services', label: 'Services', icon: PackageSearch },
  { to: '/admin/categories', label: 'Categories', icon: Tags },
  { to: '/admin/bookings', label: 'Bookings', icon: PanelsTopLeft },
  { to: '/admin/reviews', label: 'Reviews', icon: Shield },
  { to: '/admin/audit-logs', label: 'Audit Logs', icon: NotebookText },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#fef3c7_0%,#fff8eb_16%,#eef4ff_46%,#edf2ff_100%)] text-slate-900">
      <ScrollToTop />
      <div className="mx-auto grid min-h-screen max-w-[1600px] gap-6 px-4 py-4 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-6">
        <aside className="rounded-none border border-slate-800/10 bg-[linear-gradient(180deg,#111827_0%,#1f2937_100%)] p-5 text-white shadow-[0_30px_80px_rgba(15,23,42,0.3)]">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-none bg-white p-2 shadow-[0_16px_30px_rgba(255,255,255,0.1)]">
              <img src="/logo.svg" alt="" className="h-full w-full object-contain" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.28em] !text-amber-200/90">Admin Panel</p>
              <h1 className="text-xl font-black tracking-tight !text-white">SabiLink Control</h1>
            </div>
          </div>

          <div className="mb-8 rounded-none border border-white/10 bg-white/6 p-4">
            <p className="text-xs font-black uppercase tracking-[0.22em] !text-white/50">Signed in as</p>
            <p className="mt-2 text-base font-bold !text-white">{user?.name}</p>
            <p className="mt-1 text-sm !text-white/70">{user?.email}</p>
          </div>

          <nav className="grid gap-2" aria-label="Admin navigation">
            {adminLinks.map((link) => {
              const Icon = link.icon;

              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-none px-4 py-3 text-sm font-semibold transition-all duration-200',
                      isActive
                        ? 'bg-white !text-slate-900 shadow-[0_14px_30px_rgba(255,255,255,0.14)]'
                        : '!text-white/80 hover:bg-white/10 !hover:text-white',
                    )
                  }
                >
                  <Icon size={18} />
                  {link.label}
                </NavLink>
              );
            })}
          </nav>

          <div className="mt-8 grid gap-3">
            <NavLink
              to="/"
              className="rounded-none border border-white/20 px-4 py-3 text-sm font-semibold !text-white/80 transition hover:bg-white/10 !hover:text-white"
            >
              Back to marketplace
            </NavLink>
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center justify-center gap-2 rounded-none bg-amber-400 px-4 py-3 text-sm font-black text-slate-950 transition hover:bg-amber-300"
            >
              <LogOut size={16} />
              Sign out
            </button>
          </div>
        </aside>

        <section className="min-w-0">
          <header className="mb-6 rounded-none border border-white/60 bg-white/85 p-5 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.26em] text-slate-500">Operations workspace</p>
                <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Admin control surface</h2>
                <p className="mt-2 max-w-2xl text-sm text-slate-500">
                  Moderate marketplace activity, keep records tidy, and review sensitive changes without touching the public experience.
                </p>
              </div>
            </div>
          </header>

          <Outlet />
        </section>
      </div>
    </div>
  );
}
