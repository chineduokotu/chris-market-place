import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { DollarSign, User, Tag, ArrowLeft, Star, Shield, Clock, CheckCircle2, MessageSquare } from 'lucide-react';

export default function ServiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [notes, setNotes] = useState('');
  const [showBookingForm, setShowBookingForm] = useState(false);

  const { data: service, isLoading } = useQuery({
    queryKey: ['service', id],
    queryFn: async () => {
      const response = await api.get(`/services/${id}`);
      return response.data;
    },
  });

  const bookingMutation = useMutation({
    mutationFn: async () => {
      return api.post('/bookings', { service_id: id, notes });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['my-requests']);
      navigate('/dashboard');
    },
  });

  const handleBook = (e) => {
    e.preventDefault();
    bookingMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-slate-200 border-t-blue-600"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h3 className="text-xl font-bold text-slate-900">Service not found</h3>
        <button onClick={() => navigate('/services')} className="mt-4 text-blue-600 font-bold">Return to services</button>
      </div>
    );
  }

  const isOwnService = user && service.user_id === user.id;
  const canBook = user && user.current_role === 'seeker' && !isOwnService;

  return (
    <div className="bg-slate-50/50 min-h-screen pb-20 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="group inline-flex items-center text-sm font-bold text-slate-500 hover:text-blue-600 mb-8 transition-colors"
        >
          <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Exploratiom
        </button>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/50">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                <div>
                  {service.category && (
                    <span className="text-[10px] uppercase tracking-widest font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-4 inline-block">
                      {service.category.name}
                    </span>
                  )}
                  <h1 className="text-4xl font-extrabold text-slate-900 leading-tight">
                    {service.title}
                  </h1>
                </div>
                <div className="text-left md:text-right shrink-0">
                  <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Price</div>
                  <div className="text-xl font-black text-blue-600">
                    Discuss in Chat
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6 py-6 border-y border-slate-50 mb-8">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                      <User size={20} />
                   </div>
                   <div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mb-1">Provider</div>
                      <div className="text-sm font-bold text-slate-900">{service.user?.name}</div>
                   </div>
                </div>
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                      <Star size={20} fill="currentColor" />
                   </div>
                   <div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mb-1">Rating</div>
                      <div className="text-sm font-bold text-slate-900">4.9 (120 reviews)</div>
                   </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                   About this service
                </h2>
                <p className="text-slate-600 leading-relaxed whitespace-pre-wrap text-lg">
                   {service.description}
                </p>
              </div>

              <div className="mt-12 grid sm:grid-cols-2 gap-4">
                 {[
                   { title: "Unlimited Revisions", icon: CheckCircle2 },
                   { title: "24/7 Support", icon: MessageSquare },
                   { title: "Fast Delivery", icon: Clock },
                   { title: "Secure Payment", icon: Shield }
                 ].map((item, idx) => (
                   <div key={idx} className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100/50">
                      <item.icon className="text-blue-600" size={18} />
                      <span className="text-sm font-bold text-slate-700">{item.title}</span>
                   </div>
                 ))}
              </div>
            </div>
          </div>

          {/* Sidebar / Booking */}
          <div className="space-y-6">
            <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50 sticky top-24">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Booking Details</h3>
              
              {!user ? (
                <div className="p-6 bg-slate-50 rounded-2xl text-center border border-dashed border-slate-200">
                  <p className="text-sm text-slate-500 mb-4">You need to be logged in to book this service.</p>
                  <Link to="/login" className="block w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all">
                    Sign in to book
                  </Link>
                </div>
              ) : isOwnService ? (
                <div className="p-6 bg-blue-50 rounded-2xl text-center border border-blue-100">
                  <p className="text-sm text-blue-700 font-bold">This is your service</p>
                  <Link to="/dashboard" className="mt-2 text-xs text-blue-600 hover:underline inline-block">Manage in dashboard</Link>
                </div>
              ) : user.current_role !== 'seeker' ? (
                <div className="p-6 bg-amber-50 rounded-2xl text-center border border-amber-100">
                  <p className="text-sm text-amber-700 font-bold">Seeking services?</p>
                  <p className="text-xs text-amber-600 mt-1">Please switch to "Seeker" role to book.</p>
                </div>
              ) : !showBookingForm ? (
                <div className="space-y-4">
                   <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 mb-4">
                      <div className="text-sm font-medium text-slate-700 text-center">
                         Final price will be discussed and agreed upon in chat.
                      </div>
                   </div>
                   <button
                    onClick={() => setShowBookingForm(true)}
                    className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-200 active:scale-[0.98] transition-all"
                  >
                    Select & Continue
                  </button>
                </div>
              ) : (
                <form onSubmit={handleBook} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3">
                      Order Notes
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 focus:bg-white transition-all outline-none resize-none text-sm"
                      placeholder="Add any special requirements or notes for the provider..."
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowBookingForm(false)}
                      className="flex-1 py-3 text-sm font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-all"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={bookingMutation.isPending}
                      className="flex-[2] py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-200 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center"
                    >
                      {bookingMutation.isPending ? 'Processing...' : 'Confirm Order'}
                    </button>
                  </div>
                  {bookingMutation.isError && (
                    <p className="text-red-600 text-[11px] font-bold bg-red-50 p-3 rounded-lg border border-red-100 animate-shake">
                      {bookingMutation.error.response?.data?.message || 'Failed to book service'}
                    </p>
                  )}
                </form>
              )}
            </div>

            <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl"></div>
                <h4 className="text-base font-bold mb-2">Need help?</h4>
                <p className="text-xs text-slate-400 mb-6">Our support team is available 24/7 to assist you.</p>
                <button className="text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors">Contact Support →</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
