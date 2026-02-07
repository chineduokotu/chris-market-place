import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { User, ArrowLeft, Star, Shield, Clock, CheckCircle2, MessageSquare, ArrowUpRight, Calendar, FileText, Phone, MapPin, Share2, Flag } from 'lucide-react';
import { setMeta, setJsonLd } from '../lib/seo';

export default function ServiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { startConversation } = useChat();
  const [isStartingChat, setIsStartingChat] = useState(false);
  const [showPhone, setShowPhone] = useState(false);

  const { data: service, isLoading } = useQuery({
    queryKey: ['service', id],
    queryFn: async () => {
      const response = await api.get(`/services/${id}`);
      return response.data;
    },
  });

  const handleStartChat = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/services/${id}` } });
      return;
    }

    if (user.id === service.user_id) {
      navigate('/dashboard');
      return;
    }

    setIsStartingChat(true);
    try {
      await startConversation(service.user_id);
      navigate('/messages');
    } catch (error) {
      console.error('Failed to start chat:', error);
    } finally {
      setIsStartingChat(false);
    }
  };

  const isOwnService = user && service?.user_id === user.id;

  useEffect(() => {
    if (service) {
      setMeta({
        title: `${service.title} | ChrisHub`,
        description: service.description?.slice(0, 140) || 'Explore service details and request a booking.',
        url: window.location.href,
        image: service.image || undefined,
      });

      const absoluteUrl = window.location.href;
      const priceValue = Number(service.price);
      const hasPrice = Number.isFinite(priceValue) && priceValue > 0;

      setJsonLd('service', {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: service.title,
        description: service.description,
        serviceType: service.category?.name || 'Professional Service',
        url: absoluteUrl,
        image: service.image || undefined,
        provider: {
          '@type': service.user?.name ? 'Person' : 'Organization',
          name: service.user?.name || 'Service Provider',
        },
        areaServed: service.location || 'Local',
        offers: {
          '@type': 'Offer',
          price: hasPrice ? priceValue : undefined,
          priceCurrency: 'NGN',
          availability: 'https://schema.org/InStock',
          url: absoluteUrl,
        },
      });
    }
  }, [service]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-slate-200 border-t-black"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h3 className="text-xl font-bold text-slate-900">Service not found</h3>
        <button onClick={() => navigate('/')} className="mt-4 text-black font-bold hover:underline">Return to home</button>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-20 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8 font-medium">
          <Link to="/" className="hover:text-black transition-colors">Home</Link>
          <span>/</span>
          <span className="text-slate-900 line-clamp-1">{service.title}</span>
        </nav>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery (Placeholder for now, using main image) */}
            <div className="rounded-2xl overflow-hidden bg-white border border-slate-100 aspect-video relative group">
              {service.image ? (
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-100">
                  <FileText size={48} className="text-slate-300" />
                </div>
              )}
              <div className="absolute top-4 left-4">
                {service.category && (
                  <span className="text-[10px] uppercase tracking-widest font-black text-white bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-sm">
                    {service.category.name}
                  </span>
                )}
              </div>
            </div>

            <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-slate-100 shadow-sm">
              <div className="flex items-start justify-between gap-6 mb-8">
                <h1 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">
                  {service.title}
                </h1>
                <div className="flex gap-2 shrink-0">
                  <button className="p-2.5 rounded-full bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                    <Share2 size={20} />
                  </button>
                  <button className="p-2.5 rounded-full bg-slate-50 text-slate-400 hover:text-black hover:bg-slate-200 transition-colors">
                    <Flag size={20} />
                  </button>
                </div>
              </div>

              {/* Location & Time */}
              <div className="flex flex-wrap gap-6 text-sm text-slate-500 mb-8 pb-8 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-slate-400" />
                  <span>{service.location || service.user?.location || 'Remote Service'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={18} className="text-slate-400" />
                  <span>Posted recently</span>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-4">Description</h2>
                <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap">
                  {service.description}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xl shadow-slate-200/50 sticky top-24">
              <div className="mb-6">
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Price</p>
                <div className="text-3xl font-black text-slate-900">
                  {Number(service.price) > 0 ? `₦${Number(service.price).toLocaleString()}` : "Contact for Price"}
                </div>
              </div>

              <div className="space-y-3">
                {isOwnService ? (
                  <div className="p-4 bg-slate-50 rounded-xl text-center border border-slate-200">
                    <p className="text-sm font-bold text-slate-900">This is your service</p>
                    <Link to="/dashboard" className="text-xs text-slate-500 hover:text-black hover:underline mt-1 block">Manage in Dashboard</Link>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={handleStartChat}
                      disabled={isStartingChat}
                      className="w-full py-4 bg-[#000000] text-white font-bold rounded-xl hover:bg-[#1a1a1a] shadow-lg shadow-slate-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isStartingChat ? (
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <MessageSquare size={20} />
                      )}
                      <span>Chat with Provider</span>
                    </button>

                    <button
                      onClick={() => setShowPhone(!showPhone)}
                      className="w-full py-4 bg-white text-slate-900 border-2 border-slate-200 font-bold rounded-xl hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                      <Phone size={20} className={showPhone ? "text-green-600" : "text-slate-400"} />
                      <span>{showPhone ? (service.user?.phone || "+234 *** *** ****") : "Show Contact"}</span>
                    </button>
                  </>
                )}
              </div>

              {/* Safety Tips */}
              <div className="mt-8 pt-6 border-t border-slate-100">
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-4 flex items-center gap-2">
                  <Shield size={14} /> Safety Tips
                </h4>
                <ul className="space-y-3 text-xs text-slate-500 font-medium">
                  <li className="flex gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 shrink-0" />
                    Don't pay in advance, including for delivery.
                  </li>
                  <li className="flex gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 shrink-0" />
                    Meet at a safe, public place.
                  </li>
                  <li className="flex gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 shrink-0" />
                    Inspect the service/item before paying.
                  </li>
                </ul>
              </div>
            </div>

            {/* Provider Profile Summary */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                  {service.user?.avatar ? (
                    <img src={service.user.avatar} alt={service.user.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <User size={28} />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{service.user?.name || "Provider"}</h3>
                  <div className="text-xs text-slate-500 font-medium">Joined recently</div>
                </div>
              </div>
              <Link to={`/providers/${service.user?.id}`} className="block w-full py-2.5 text-center text-sm font-bold text-slate-600 hover:text-black bg-slate-50 hover:bg-slate-100 rounded-xl transition-all">
                View Full Profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
