import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  FileText,
  MapPin,
  MessageSquare,
  Phone,
  ShieldCheck,
  User,
} from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { PageContainer } from '../components/layout/AppShell';
import { Badge, Button, Card, CardBody, CardHeader, EmptyState, Skeleton, Tabs } from '../components/ui';
import { setMeta, setJsonLd } from '../lib/seo';

const tabItems = [
  { value: 'description', label: 'Description' },
  { value: 'reviews', label: 'Reviews' },
  { value: 'about', label: 'About Provider' },
];

export default function ServiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { startConversation } = useChat();
  const [isStartingChat, setIsStartingChat] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  const { data: service, isLoading, isError } = useQuery({
    queryKey: ['service', id],
    queryFn: async () => {
      const response = await api.get(`/services/${id}`);
      return response.data;
    },
  });

  const isOwnService = user && service?.user_id === user.id;

  useEffect(() => {
    if (!service) return;

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
  }, [service]);

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

  if (isLoading) {
    return (
      <PageContainer className="space-y-5 py-8">
        <Skeleton className="h-6 w-40" />
        <div className="grid gap-6 lg:grid-cols-[1.8fr,1fr]">
          <Skeleton className="aspect-[16/9] w-full rounded-[var(--radius-card)]" />
          <Skeleton className="h-96 w-full rounded-[var(--radius-card)]" />
        </div>
      </PageContainer>
    );
  }

  if (isError || !service) {
    return (
      <PageContainer className="py-10">
        <EmptyState
          icon={FileText}
          title="Service not found"
          description="This listing is unavailable or has been removed."
          actionLabel="Return home"
          onAction={() => navigate('/')}
        />
      </PageContainer>
    );
  }

  const priceValue = Number(service.price);
  const displayPrice = Number.isFinite(priceValue) && priceValue > 0 ? `₦${priceValue.toLocaleString()}` : 'Contact for price';

  return (
    <PageContainer className="space-y-6 py-8">
      <div className="flex items-center gap-3 text-sm">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1 text-[var(--color-muted)] hover:text-[var(--color-primary)]"
        >
          <ArrowLeft size={14} />
          Back
        </button>
        <span className="text-slate-400">/</span>
        <span className="line-clamp-1 text-[var(--color-muted)]">{service.title}</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.8fr,1fr]">
        <section className="space-y-5">
          <Card className="overflow-hidden">
            <div className="relative aspect-[16/9] bg-slate-100">
              {service.image ? (
                <img src={service.image} alt={service.title} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-slate-500">No image available</div>
              )}
              {service.category ? (
                <Badge variant="featured" className="absolute left-4 top-4">
                  {service.category.name}
                </Badge>
              ) : null}
            </div>
          </Card>

          <Card>
            <CardHeader className="space-y-3">
              <h1 className="text-2xl font-extrabold md:text-3xl">{service.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--color-muted)]">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin size={14} />
                  {service.location || service.user?.location || 'Remote service'}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <User size={14} />
                  {service.user?.name || 'Provider'}
                </span>
              </div>
            </CardHeader>

            <CardBody className="space-y-4">
              <Tabs tabs={tabItems} value={activeTab} onChange={setActiveTab} />

              {activeTab === 'description' ? (
                <div id="panel-description" role="tabpanel" aria-labelledby="tab-description" className="space-y-3">
                  <h2 className="text-base font-bold text-[var(--color-text)]">Service Details</h2>
                  <p className="whitespace-pre-wrap text-sm leading-7 text-[var(--color-muted)]">{service.description}</p>
                </div>
              ) : null}

              {activeTab === 'reviews' ? (
                <div id="panel-reviews" role="tabpanel" aria-labelledby="tab-reviews">
                  <EmptyState
                    title="No reviews yet"
                    description="This provider has not received public reviews for this listing yet."
                    className="p-8"
                  />
                </div>
              ) : null}

              {activeTab === 'about' ? (
                <div id="panel-about" role="tabpanel" aria-labelledby="tab-about" className="space-y-3">
                  <h2 className="text-base font-bold text-[var(--color-text)]">About the provider</h2>
                  <p className="text-sm leading-7 text-[var(--color-muted)]">
                    {service.user?.name || 'This provider'} offers services in {service.location || 'your region'}.
                    Check their profile for portfolio and additional listings.
                  </p>
                  <Link
                    to={`/providers/${service.user?.id}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)]"
                  >
                    View provider profile
                  </Link>
                </div>
              ) : null}
            </CardBody>
          </Card>
        </section>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:h-fit">
          <Card>
            <CardBody className="space-y-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Price</p>
                <p className="mt-1 text-3xl font-extrabold text-[var(--color-text)]">{displayPrice}</p>
              </div>

              {isOwnService ? (
                <Link to="/dashboard">
                  <Button className="w-full">Manage in dashboard</Button>
                </Link>
              ) : (
                <div className="space-y-2">
                  <Button className="w-full" onClick={handleStartChat} loading={isStartingChat}>
                    <MessageSquare size={16} />
                    Message provider
                  </Button>
                  <Button variant="secondary" className="w-full" onClick={() => setShowPhone((prev) => !prev)}>
                    <Phone size={16} />
                    {showPhone ? service.user?.phone || 'Phone unavailable' : 'Show phone'}
                  </Button>
                </div>
              )}

              <div className="rounded-[12px] border border-[var(--color-border)] bg-slate-50 p-3">
                <h3 className="mb-2 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-text)]">
                  <ShieldCheck size={14} />
                  Safety tips
                </h3>
                <ul className="space-y-1 text-xs text-[var(--color-muted)]">
                  <li>Meet in secure public spaces when possible.</li>
                  <li>Discuss deliverables clearly before payment.</li>
                  <li>Keep communication within platform chat.</li>
                </ul>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                  {service.user?.avatar ? (
                    <img src={service.user.avatar} alt={service.user.name} className="h-full w-full rounded-full object-cover" />
                  ) : (
                    <User size={20} />
                  )}
                </div>
                <div>
                  <p className="text-sm font-bold text-[var(--color-text)]">{service.user?.name || 'Provider'}</p>
                  <p className="text-xs text-[var(--color-muted)]">Profile available</p>
                </div>
              </div>
              <Link to={`/providers/${service.user?.id}`}>
                <Button variant="secondary" className="w-full">
                  View provider profile
                </Button>
              </Link>
            </CardBody>
          </Card>
        </aside>
      </div>
    </PageContainer>
  );
}

