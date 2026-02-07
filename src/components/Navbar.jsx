import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, LogOut, Menu, X, Settings, MessageSquare, Home, Info, PlusCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useChat } from '../context/ChatContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { unreadTotal } = useChat();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'How it Works', path: '/how-it-works', icon: Info },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      role="navigation"
      aria-label="Main navigation"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm border-b' : 'bg-white border-b border-transparent'
        }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-10">
            <Link to="/" className="flex items-center gap-2 group" aria-label="ChrisHub - Go to homepage">
              <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center text-white font-bold group-hover:scale-105 transition-transform duration-200" aria-hidden>
                C
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                ChrisHub
              </span>
            </Link>

            <ul className="hidden md:flex items-center space-x-1 list-none m-0 p-0" role="menubar">
              {navLinks.map((link) => (
                <li key={link.name} role="none">
                  <Link
                    to={link.path}
                    role="menuitem"
                    aria-current={isActive(link.path) ? 'page' : undefined}
                    className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 hover:transition-colors ${isActive(link.path)
                      ? 'text-black bg-slate-50'
                      : 'text-slate-600 hover:text-black hover:bg-slate-50'
                      }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <link.icon size={16} className={isActive(link.path) ? 'text-black' : 'text-slate-500'} />
                      <span>{link.name}</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="hidden md:flex items-center gap-4">


                <Link
                  to="/messages"
                  className="p-2 text-slate-500 hover:text-[#000000] transition-colors relative"
                  title="Chat"
                >
                  <MessageSquare size={20} />
                  {unreadTotal > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                      {unreadTotal > 9 ? '9+' : unreadTotal}
                    </span>
                  )}
                </Link>

                <Link
                  to="/profile"
                  className="p-2 text-slate-500 hover:text-[#000000] transition-colors"
                  title="Profile"
                >
                  <User size={20} />
                </Link>

                <button
                  onClick={logout}
                  className="p-2 text-slate-500 hover:text-red-500 transition-colors"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-bold text-slate-700 hover:text-[#000000] transition-colors uppercase tracking-wide"
                >
                  Sign in
                </Link>
              </div>
            )}

            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              {menuOpen ? <X size={24} aria-hidden /> : <Menu size={24} aria-hidden />}
            </button>
          </div>
        </div>

        {/* Mobile menu - enhanced for accessibility */}
        <div
          id="mobile-menu"
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out border-t border-slate-100 ${menuOpen ? 'max-h-[32rem] opacity-100 py-4' : 'max-h-0 opacity-0 border-t-transparent'
            }`}
          role="navigation"
          aria-label="Mobile navigation"
        >
          <ul className="space-y-1 list-none m-0 p-0">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.path}
                  onClick={() => setMenuOpen(false)}
                  aria-current={isActive(link.path) ? 'page' : undefined}
                  className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200 ${isActive(link.path)
                    ? 'text-black bg-slate-50'
                    : 'text-slate-600 hover:bg-slate-50'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <link.icon size={18} className={isActive(link.path) ? 'text-black' : 'text-slate-500'} />
                    <span>{link.name}</span>
                  </div>
                </Link>
              </li>
            ))}

            <li className="my-2 border-t border-slate-100" role="separator"></li>

            {user ? (
              <>
                <li>
                  <Link
                    to="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-lg font-medium transition-colors duration-200"
                  >
                    Profile
                  </Link>
                </li>
                <li>
                  <Link
                    to="/messages"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-lg font-medium transition-colors duration-200 flex items-center justify-between"
                  >
                    <span>Chat</span>
                    {unreadTotal > 0 && (
                      <span className="px-2 py-0.5 bg-red-500 text-white text-[10px] font-black rounded-full">
                        {unreadTotal}
                      </span>
                    )}
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={logout}
                    className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors duration-200"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li className="pt-2">
                <div className="grid grid-cols-2 gap-3 px-4" role="group" aria-label="Account actions">
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="px-4 py-3 text-center text-sm font-medium text-white bg-[#000000] rounded-xl hover:bg-[#1a1a1a] shadow-lg shadow-slate-100 transition-colors duration-200 uppercase tracking-widest block w-full"
                  >
                    Sign in
                  </Link>
                </div>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
