import { Search, MessageCircle, CreditCard, Star, FileText, CheckCircle, Wallet, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function HowItWorks() {
  const { user } = useAuth();
  return (
    <div className="bg-slate-50 min-h-screen pb-24 pt-16">
      {/* Hero Section */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight tracking-tight">
            How <span className="text-black">ChrisHub</span> Works
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed mb-10">
            Whether you need a job done or want to offer your skills, ChrisHub makes it secure and simple to connect and collaborate.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/services" className="px-8 py-4 bg-black text-white font-bold rounded-2xl hover:bg-[#1a1a1a] shadow-lg shadow-slate-200/50 transition-all duration-200 active:scale-[0.98]">
              Find Services
            </Link>
            <Link to="/register" className="px-8 py-4 bg-white text-slate-700 font-bold rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all duration-200 active:scale-[0.98]">
              Become a Provider
            </Link>
          </div>
        </div>
      </header>

      {/* For Seekers Section */}
      <section className="bg-white py-24 mb-16 border-y border-slate-100" aria-labelledby="for-clients-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block text-black font-bold tracking-widest uppercase text-sm bg-slate-100 px-4 py-2 rounded-full mb-4">For Clients</span>
            <h2 id="for-clients-heading" className="text-3xl font-bold text-slate-900 mt-2 md:text-4xl tracking-tight">Get work done efficiently</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connector Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-blue-100 via-blue-200 to-blue-100 -z-10"></div>

            <div className="relative text-center group">
              <div className="w-24 h-24 bg-white border-2 border-black/10 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-slate-100 group-hover:-translate-y-2 transition-transform duration-300">
                <Search size={40} className="text-black" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">1. Find a Service</h3>
              <p className="text-slate-600 leading-relaxed">
                Browse through categories or search for specific skills. View profiles, ratings, and portfolios to find the right match.
              </p>
            </div>

            <div className="relative text-center group">
              <div className="w-24 h-24 bg-white border-2 border-black/10 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-slate-100 group-hover:-translate-y-2 transition-transform duration-300">
                <MessageCircle size={40} className="text-black" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">2. Discuss & Agree</h3>
              <p className="text-slate-600 leading-relaxed">
                Chat directly with providers to discuss your project requirements and agree on a price.
              </p>
            </div>

            <div className="relative text-center group">
              <div className="w-24 h-24 bg-white border-2 border-black/10 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-slate-100 group-hover:-translate-y-2 transition-transform duration-300">
                <CheckCircle size={40} className="text-black" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">3. Complete Project</h3>
              <p className="text-slate-600 leading-relaxed">
                Receive your deliverables, approve the work, and leave a review. Safe and secure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* For Providers Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24" aria-labelledby="for-providers-heading">
        <div className="text-center mb-16">
          <span className="inline-block text-black font-bold tracking-widest uppercase text-sm bg-slate-100 px-4 py-2 rounded-full mb-4">For Providers</span>
          <h2 id="for-providers-heading" className="text-3xl font-bold text-slate-900 mt-2 md:text-4xl tracking-tight">Monetize your skills</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: FileText, title: "Create Profile", desc: "Set up your professional profile and list your services." },
            { icon: MessageCircle, title: "Receive Requests", desc: "Get inquiries from potential clients directly in your inbox." },
            { icon: Star, title: "Deliver Great Work", desc: "Complete jobs to build your reputation and get 5-star reviews." },
            { icon: Wallet, title: "Grow Business", desc: "Expand your client base and increase your earnings." },
          ].map((item, i) => (
            <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-100 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-6 text-black">
                <item.icon size={28} aria-hidden />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">{item.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust & Safety */}
      {!user && (
        <section className="bg-slate-900 text-white rounded-[2rem] sm:rounded-[3rem] mx-4 sm:mx-8 p-8 md:p-16 relative overflow-hidden" aria-labelledby="safety-heading">
          <div className="absolute top-0 right-0 w-96 h-96 bg-black/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3"></div>

          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <ShieldCheck size={64} className="text-white mx-auto mb-8" aria-hidden />
            <h2 id="safety-heading" className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">Your safety is our priority</h2>
            <p className="text-slate-300 text-lg leading-relaxed mb-10">
              We have implemented robust measures to ensure a secure environment for all users. From verified profiles to secure communication channels, we've got you covered.
            </p>
            <Link to="/register" className="inline-block px-8 py-4 bg-white text-black font-bold rounded-2xl hover:bg-slate-50 transition-colors duration-200 active:scale-[0.98]">
              Join Community Today
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
