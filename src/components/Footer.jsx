import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, UserPlus, LogIn, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Footer() {
  const { user } = useAuth();
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="bg-slate-900 text-slate-300 pt-20 pb-10 border-t border-slate-800"
      role="contentinfo"
      aria-label="Site footer"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16 mb-16">
          {/* Brand section */}
          <div className="space-y-6 lg:max-w-xs">
            <Link to="/" className="inline-flex items-center gap-2 group" aria-label="ChrisHub - Go to homepage">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-900 font-bold group-hover:scale-105 transition-transform duration-200" aria-hidden>
                C
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                ChrisHub
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-300">
              The leading marketplace for professional services. Connecting skilled experts with clients across the globe.
            </p>
          </div>

          {/* Explore links */}
          <nav aria-label="Explore links">
            <h4 className="text-white font-semibold mb-6 text-base">Explore</h4>
            <ul className="space-y-4 text-sm list-none m-0 p-0">
              {!user && (
                <>
                  <li>
                    <Link to="/register" className="hover:text-white transition-all duration-200 py-1 flex items-center gap-2 group/link">
                      <UserPlus size={14} className="text-slate-400 group-hover/link:text-white" />
                      <span>Become a Provider</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/login" className="hover:text-white transition-all duration-200 py-1 flex items-center gap-2 group/link">
                      <LogIn size={14} className="text-slate-400 group-hover/link:text-white" />
                      <span>Client Log In</span>
                    </Link>
                  </li>
                </>
              )}
              <li>
                <Link to="/how-it-works" className="hover:text-white transition-all duration-200 py-1 flex items-center gap-2 group/link">
                  <Info size={14} className="text-slate-400 group-hover/link:text-white" />
                  <span>How it Works</span>
                </Link>
              </li>
            </ul>
          </nav>

          {/* Contact */}
          <div className="space-y-5" aria-label="Contact information">
            <h4 className="text-white font-semibold mb-6 text-base">Contact Us</h4>
            <address className="not-italic space-y-4">
              <div className="flex items-start gap-3 text-sm">
                <MapPin size={18} className="text-slate-300 shrink-0 mt-0.5" aria-hidden />
                <span>123 Business Plaza, Tech District<br />Lexington, KY 40507</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone size={18} className="text-slate-300 shrink-0" aria-hidden />
                <a href="tel:+18005550123" className="hover:text-white transition-colors duration-200">+1 (800) 555-0123</a>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail size={18} className="text-slate-300 shrink-0" aria-hidden />
                <a href="mailto:support@chrishub.com" className="hover:text-white transition-colors duration-200 break-all">support@chrishub.com</a>
              </div>
            </address>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-slate-400">
          <p>© {currentYear} ChrisHub Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
