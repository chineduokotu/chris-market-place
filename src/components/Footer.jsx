import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Footer() {
  const { user } = useAuth();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--color-border)] bg-white">
      <div className="container-app py-12">
        <div className="grid gap-10 md:grid-cols-3">
          <div className="space-y-4">
            <Link to="/" className="inline-flex items-center gap-2.5" aria-label="SabiLink homepage">
              <img src="/logo.svg" alt="" className="h-9 w-9 object-contain" />
              <span className="text-lg font-extrabold text-[var(--color-text)]">SabiLink</span>
            </Link>
            <p className="max-w-sm text-sm text-[var(--color-muted)]">
              A service marketplace designed for speed, trust, and clear communication from first search to final
              delivery.
            </p>
          </div>

          <nav aria-label="Footer links">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-[var(--color-text)]">Explore</h2>
            <ul className="space-y-3 text-sm text-[var(--color-muted)]">
              <li>
                <Link className="hover:text-[var(--color-primary)]" to="/">
                  Browse Services
                </Link>
              </li>
              <li>
                <Link className="hover:text-[var(--color-primary)]" to="/how-it-works">
                  How It Works
                </Link>
              </li>
              {!user ? (
                <>
                  <li>
                    <Link className="hover:text-[var(--color-primary)]" to="/register">
                      Become a Provider
                    </Link>
                  </li>
                  <li>
                    <Link className="hover:text-[var(--color-primary)]" to="/login">
                      Sign In
                    </Link>
                  </li>
                </>
              ) : null}
            </ul>
          </nav>

          <div>
            <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-[var(--color-text)]">Contact</h2>
            <div className="space-y-3 text-sm text-[var(--color-muted)]">
              <p className="flex items-center gap-2">
                <MapPin size={15} className="text-[var(--color-primary)]" />
                Iriri, Benin City
              </p>
              <p className="flex items-center gap-2">
                <Phone size={15} className="text-[var(--color-primary)]" />
                <a href="tel:+2349079039660" className="hover:text-[var(--color-primary)]">
                  +2349079039660
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Mail size={15} className="text-[var(--color-primary)]" />
                <a href="mailto:comagtech2@gmail.com" className="hover:text-[var(--color-primary)]">
                  comagtech2@gmail.com
                </a>
              </p>
            </div>
          </div>
        </div>

        <p className="mt-10 border-t border-[var(--color-border)] pt-5 text-sm text-slate-500">
          © {year} SabiLink. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
