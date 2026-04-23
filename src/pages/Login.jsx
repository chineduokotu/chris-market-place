import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import GoogleIcon from '../components/icons/GoogleIcon';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const loggedInUser = await login(email, password);
      const destination = location.state?.from || (loggedInUser?.is_admin ? '/admin' : '/dashboard');
      navigate(destination);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-8 bg-slate-50/50">
      <div className="max-w-[400px] w-full">
        <div className="bg-white p-10 rounded-none shadow-2xl shadow-slate-200/60 border border-slate-100">
          <div className="mb-0 text-center">
            <Link to="/" className="inline-flex mb-8">
              <img src="/logo.svg" alt="SabiLink Logo" className="h-14 w-14 object-contain" />
            </Link>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Welcome back</h1>
            <p className="text-slate-500 mt-2 text-sm font-medium">Please enter your details to sign in.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 mt-10" noValidate aria-label="Sign in form">
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-none text-xs font-bold flex gap-3 items-center animate-shake">
                <AlertCircle size={18} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-5">
              <div className="relative group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-none focus:bg-white focus:border-[var(--color-primary)] focus:ring-0 transition-all outline-none font-bold text-sm placeholder:text-slate-400 group-hover:bg-slate-100/50"
                  placeholder="Email address"
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[var(--color-text)] transition-colors" size={18} />
              </div>

              <div className="relative group">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-none focus:bg-white focus:border-[var(--color-primary)] focus:ring-0 transition-all outline-none font-bold text-sm placeholder:text-slate-400 group-hover:bg-slate-100/50"
                  placeholder="Password"
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[var(--color-text)] transition-colors" size={18} />
              </div>
            </div>

            <div className="flex justify-end">
              <a href="#" className="text-xs font-black text-slate-400 hover:text-black transition-colors uppercase tracking-widest">Forgot password?</a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4.5 bg-[var(--color-primary)] text-white font-black rounded-none hover:bg-[var(--color-primary-strong)] disabled:opacity-70 transition-all shadow-lg active:scale-[0.99] flex items-center justify-center gap-3 text-sm uppercase tracking-widest"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <>
                  <span>Sign in</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-[0.25em] font-black text-slate-300">
                <span className="bg-white px-4">Direct Access</span>
              </div>
            </div>

            <button
              type="button"
              className="w-full py-4 bg-white border border-slate-200 text-slate-700 font-black rounded-none hover:bg-slate-50 transition-all active:scale-[0.99] flex items-center justify-center gap-3 text-xs uppercase tracking-widest"
            >
              <GoogleIcon size={18} />
              <span>Continue with Google</span>
            </button>

            <p className="text-center text-xs font-bold text-slate-400 pt-6">
              NEW TO SABILINK?{' '}
              <Link to="/register" className="text-[#0a2e5c] font-black hover:underline underline-offset-4">
                CREATE ACCOUNT
              </Link>
            </p>
          </form>

        </div>
      </div>
    </div>
  );
}
