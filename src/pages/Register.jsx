import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import GoogleIcon from '../components/icons/GoogleIcon';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Auto-confirm password for UX simplicity
      await register(name, email, password, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-8 bg-slate-50/50">
      <div className="max-w-[400px] w-full">
        <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/60 border border-slate-100">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Create Account</h1>
            <p className="text-slate-500 mt-1 text-sm font-medium">Join our marketplace of skilled professionals.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate aria-label="Create account form">
            {error && (
              <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs font-bold flex gap-2 items-center animate-shake">
                <AlertCircle size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-4">
              <div className="relative group">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-black focus:ring-4 focus:ring-black/5 transition-all outline-none font-medium text-sm placeholder:text-slate-400 group-hover:bg-slate-100/50"
                  placeholder="Full Name"
                />
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-black transition-colors" size={16} />
              </div>

              <div className="relative group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-black focus:ring-4 focus:ring-black/5 transition-all outline-none font-medium text-sm placeholder:text-slate-400 group-hover:bg-slate-100/50"
                  placeholder="Email Address"
                />
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-black transition-colors" size={16} />
              </div>

              <div className="relative group">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-black focus:ring-4 focus:ring-black/5 transition-all outline-none font-medium text-sm placeholder:text-slate-400 group-hover:bg-slate-100/50"
                  placeholder="Password (min. 8 chars)"
                />
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-black transition-colors" size={16} />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-black text-white font-bold rounded-xl hover:bg-[#1a1a1a] disabled:opacity-70 transition-all shadow-lg shadow-slate-200 active:scale-[0.98] flex items-center justify-center gap-2 text-sm mt-2"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-black text-slate-400">
                <span className="bg-white px-2">Or continue with</span>
              </div>
            </div>

            <button
              type="button"
              className="w-full py-3.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-sm"
            >
              <GoogleIcon size={18} />
              <span>Google</span>
            </button>

            <p className="text-center text-xs font-medium text-slate-500 pt-2">
              Already have an account?{' '}
              <Link to="/login" className="text-black font-bold hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
