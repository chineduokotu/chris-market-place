import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { Briefcase, ArrowRight, Shield, Star, Users, CheckCircle } from 'lucide-react';

export default function Home() {
  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await api.get('/categories');
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-slate-200 border-t-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden border-b border-slate-50">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-50/50 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-50/50 rounded-full blur-3xl opacity-50"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-6">
              <span className="flex h-2 w-2 rounded-full bg-blue-600"></span>
              The World's Work Marketplace
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-tight mb-6">
              Find the perfect <span className="text-blue-600">professional</span> for any task.
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed mb-10 max-w-2xl">
              Connect with thousands of vetted experts, manage projects seamlessly, and get things done faster with ServiceHub.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/services"
                className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95"
              >
                Find Talent
                <ArrowRight className="ml-2" size={20} />
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center px-8 py-4 bg-white text-slate-900 font-bold rounded-xl border border-slate-200 hover:bg-slate-50 transition-all active:scale-95"
              >
                Become a Provider
              </Link>
            </div>

            <div className="mt-12 flex items-center gap-8 border-t border-slate-100 pt-8">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                  </div>
                ))}
              </div>
              <p className="text-sm text-slate-500 font-medium">
                <span className="text-slate-900 font-bold">10k+</span> professionals already joined
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-12 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-between items-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
             <div className="text-xl font-black text-slate-400">MICROSOFT</div>
             <div className="text-xl font-black text-slate-400">AIRBNB</div>
             <div className="text-xl font-black text-slate-400">STRIPE</div>
             <div className="text-xl font-black text-slate-400">DISNEY</div>
             <div className="text-xl font-black text-slate-400">NETFLIX</div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Browse by Category</h2>
              <p className="text-slate-500 mt-2">Discover services tailored to your specific needs.</p>
            </div>
            <Link to="/services" className="text-blue-600 font-semibold flex items-center gap-1 hover:gap-2 transition-all">
              View all services <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories?.map((category) => (
              <Link
                key={category.id}
                to={`/services?category=${category.id}`}
                className="group p-8 rounded-2xl bg-white border border-slate-100 hover:border-blue-100 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 flex flex-col items-start"
              >
                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors duration-300">
                  <Briefcase className="text-blue-600 group-hover:text-white transition-colors duration-300" size={28} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{category.name}</h3>
                <p className="text-slate-500 mt-2 text-sm">
                  {category.services_count} active services
                </p>
                <div className="mt-6 flex items-center text-xs font-bold text-slate-400 group-hover:text-blue-600 uppercase tracking-widest gap-2">
                  Explore <ArrowRight size={14} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-slate-900 text-white rounded-[3rem] mx-4 sm:mx-6 lg:mx-8 mb-24 overflow-hidden relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-full opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500 via-transparent to-transparent"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl font-bold leading-tight mb-8">
                The best way to get <br />
                <span className="text-blue-400">your work done.</span>
              </h2>
              <div className="space-y-6">
                {[
                  { title: "Safe & Secure", desc: "All transactions are protected by our secure payment system.", icon: Shield },
                  { title: "Quality Guarantee", desc: "Check reviews and work history to find the perfect match.", icon: Star },
                  { title: "24/7 Support", desc: "Our dedicated support team is here to help you anytime.", icon: CheckCircle }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center shrink-0">
                      <item.icon className="text-blue-400" size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">{item.title}</h4>
                      <p className="text-slate-400 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-blue-600 rounded-3xl rotate-3 absolute inset-0 opacity-20"></div>
              <div className="aspect-square bg-white/5 backdrop-blur-3xl rounded-3xl relative z-10 p-8 flex items-center justify-center border border-white/10">
                <div className="text-center">
                  <div className="text-6xl font-black mb-4">98%</div>
                  <div className="text-slate-400 font-medium">Customer satisfaction rate</div>
                  <div className="mt-12 flex justify-center">
                    <Link to="/register" className="px-8 py-4 bg-white text-slate-900 font-bold rounded-xl active:scale-95 transition-all">
                      Get Started Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
