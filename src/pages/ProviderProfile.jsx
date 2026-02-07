import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { MapPin, Star, ShieldCheck, Clock, CheckCircle2, ArrowRight, Briefcase } from 'lucide-react';
import api from '../api/client';
import ServiceCard from '../components/ServiceCard';
import { setMeta, setJsonLd } from '../lib/seo';
import { useEffect } from 'react';

export default function ProviderProfile() {
  const { id } = useParams();

  const { data: servicesData, isLoading } = useQuery({
    queryKey: ['provider-services', id],
    queryFn: async () => {
      const response = await api.get('/services', { params: { provider_id: id } });
      return response.data;
    },
  });


  const services = servicesData?.data || [];
  const provider = services[0]?.user;
  const providerName = provider?.name || 'Service Provider';
  const location = provider?.location || 'Local / Remote';
  const verificationLevel = provider?.verification_level || 'unverified';
  const verificationLabel =
    verificationLevel === 'verified' ? 'Verified Provider' : verificationLevel === 'basic' ? 'Basic Verified' : 'Unverified';

  useEffect(() => {
    setMeta({
      title: `${providerName} | Provider Profile`,
      description: `View ${providerName}'s services and availability on ChrisHub.`,
      url: window.location.href,
    });

    setJsonLd('provider', {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: providerName,
    });
  }, [providerName]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-slate-200 border-t-black"></div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      {/* Header */}
      <section className="relative bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row lg:items-end gap-6">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center text-2xl font-black">
                {providerName.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold uppercase tracking-wider mb-2">
                  <ShieldCheck size={14} />
                  {verificationLabel}
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold">{providerName}</h1>
                <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-slate-300">
                  <span className="flex items-center gap-2">
                    <MapPin size={14} />
                    {location}
                  </span>
                  <span className="flex items-center gap-2">
                    <Briefcase size={14} />
                    {services.length} services
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:ml-auto">
              <Link
                to={services[0] ? `/services/${services[0].id}` : '/services'}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-slate-100 transition-colors"
              >
                Request Service
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 grid lg:grid-cols-[2.1fr,0.9fr] gap-8">
        {/* Main */}
        <div className="space-y-10">
          <section className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-3">About {providerName}</h2>
            <p className="text-slate-600 leading-relaxed">
              Experienced service provider delivering reliable results, clear communication, and fast turnaround.
              This profile will include verified bio, certifications, and portfolio highlights.
            </p>
            <div className="mt-6 grid sm:grid-cols-3 gap-4">
              {[
                { label: 'Response time', value: 'Under 1 hour' },
                { label: 'Acceptance rate', value: '98%' },
                { label: 'Completed jobs', value: '250+' },
              ].map((item) => (
                <div key={item.label} className="rounded-xl bg-slate-50 border border-slate-100 p-4">
                  <div className="text-xs uppercase tracking-wider text-slate-400 font-bold">{item.label}</div>
                  <div className="text-lg font-bold text-slate-900 mt-1">{item.value}</div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900">Services offered</h2>
              <span className="text-sm text-slate-500">{services.length} listings</span>
            </div>
            {services.length === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-8 text-slate-500">
                No services listed yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {services.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            )}
          </section>

          <section className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Portfolio</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {services.slice(0, 6).map((service) => (
                <div key={service.id} className="aspect-square rounded-xl overflow-hidden bg-slate-100">
                  {service.image ? (
                    <img src={service.image} alt={service.title} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
                      No image
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sticky top-24">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Quick actions</h3>
            <Link
              to={services[0] ? `/services/${services[0].id}` : '/services'}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-black text-white font-bold rounded-xl hover:bg-[#1a1a1a] transition-colors"
            >
              Request Service
              <ArrowRight size={18} />
            </Link>
            <div className="mt-6 space-y-3 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-black" />
                Typically replies within 1 hour
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-slate-600" />
                {verificationLevel === 'verified' ? 'Identity verified' : 'Verification pending'}
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-slate-400" />
                {verificationLevel === 'verified' ? 'Skills verified' : 'Background check required'}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
