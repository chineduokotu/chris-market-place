import { Search, MessageCircle, CreditCard, Star, FileText, CheckCircle, Wallet, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HowItWorks() {
  return (
    <div className="bg-slate-50 min-h-screen pb-20 pt-16">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
            How <span className="text-blue-600">ServiceHub</span> Works
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed mb-10">
            Whether you need a job done or want to offer your skills, ServiceHub makes it secure and simple to connect and collaborate.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/services" className="px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95">
              Find Services
            </Link>
            <Link to="/register" className="px-8 py-4 bg-white text-slate-700 font-bold rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all active:scale-95">
              Became a Provider
            </Link>
          </div>
        </div>
      </div>

      {/* For Seekers Section */}
      <div className="bg-white py-24 mb-16 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-bold tracking-widest uppercase text-sm bg-blue-50 px-4 py-2 rounded-full">For Clients</span>
            <h2 className="text-3xl font-bold text-slate-900 mt-6 md:text-4xl">Get work done efficiently</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
             {/* Connector Line (Desktop) */}
             <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-blue-100 via-blue-200 to-blue-100 -z-10"></div>

            <div className="relative text-center group">
              <div className="w-24 h-24 bg-white border-2 border-blue-100 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-blue-100/50 group-hover:-translate-y-2 transition-transform duration-300">
                <Search size={40} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">1. Find a Service</h3>
              <p className="text-slate-500 leading-relaxed">
                Browse through categories or search for specific skills. View profiles, ratings, and portfolios to find the right match.
              </p>
            </div>

            <div className="relative text-center group">
              <div className="w-24 h-24 bg-white border-2 border-blue-100 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-blue-100/50 group-hover:-translate-y-2 transition-transform duration-300">
                <MessageCircle size={40} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">2. Discuss & Agree</h3>
              <p className="text-slate-500 leading-relaxed">
                Chat directly with providers to discuss your project requirements and agree on a price.
              </p>
            </div>

            <div className="relative text-center group">
              <div className="w-24 h-24 bg-white border-2 border-blue-100 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-blue-100/50 group-hover:-translate-y-2 transition-transform duration-300">
                <CheckCircle size={40} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">3. Complete Project</h3>
              <p className="text-slate-500 leading-relaxed">
                Receive your deliverables, approve the work, and leave a review. Safe and secure.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* For Providers Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center mb-16">
          <span className="text-emerald-600 font-bold tracking-widest uppercase text-sm bg-emerald-50 px-4 py-2 rounded-full">For Providers</span>
          <h2 className="text-3xl font-bold text-slate-900 mt-6 md:text-4xl">Monetize your skills</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: FileText,
              title: "Create Profile",
              desc: "Set up your professional profile and list your services.",
              color: "emerald"
            },
            {
              icon: MessageCircle,
              title: "Receive Requests",
              desc: "Get inquiries from potential clients directly in your inbox.",
              color: "emerald"
            },
            {
              icon: Star,
              title: "Deliver Great Work",
              desc: "Complete jobs to build your reputation and get 5-star reviews.",
              color: "emerald"
            },
            {
              icon: Wallet,
              title: "Grow Business",
              desc: "Expand your client base and increase your earnings.",
              color: "emerald"
            }
          ].map((item, i) => (
            <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-100 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300 hover:-translate-y-1">
              <div className={`w-14 h-14 bg-${item.color}-50 rounded-2xl flex items-center justify-center mb-6 text-${item.color}-600`}>
                <item.icon size={28} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">{item.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Trust & Safety */}
      <div className="bg-slate-900 text-white rounded-[3rem] mx-4 sm:mx-8 p-8 md:p-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
           <ShieldCheck size={64} className="text-blue-400 mx-auto mb-8" />
           <h2 className="text-3xl md:text-4xl font-bold mb-6">Your safety is our priority</h2>
           <p className="text-slate-400 text-lg leading-relaxed mb-10">
             We have implemented robust measures to ensure a secure environment for all users. From verified profiles to secure communication channels, we've got you covered.
           </p>
           <Link to="/register" className="inline-block px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-500 transition-colors">
             Join Community Today
           </Link>
        </div>
      </div>
    </div>
  );
}
