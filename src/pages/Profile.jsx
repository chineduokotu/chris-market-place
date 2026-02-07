import { useState, useMemo, useRef } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import BookingCard from '../components/BookingCard';
import {
  User, Phone, MessageSquare, Save, CheckCircle, AlertCircle, Loader2,
  Settings, Briefcase, Plus, X, LayoutDashboard, Calendar, PlusCircle,
  ImagePlus, Wallet, TrendingUp, Star, MapPin, ArrowRight,
  Shield, CheckCircle2, ChevronRight, Share2, LogOut, Heart, Camera
} from 'lucide-react';

export default function Profile() {
  const { user, logout, updateUser } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('services'); // 'services', 'requests', 'feedback', 'performance'

  // Dashboard states
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [serviceForm, setServiceForm] = useState({
    category_id: '',
    title: '',
    description: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const profileImageInputRef = useRef(null);
  const [profileImagePreview, setProfileImagePreview] = useState(user?.profile_photo || null);

  // Settings states
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    whatsapp_number: user?.whatsapp_number || '',
  });

  const isProvider = user?.current_role === 'provider';

  // --- Queries ---
  const { data: userProfile, isLoading: profileLoading } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const response = await api.get('/user');
      return response.data;
    },
    onSuccess: (data) => {
      setFormData({
        name: data.name || '',
        phone: data.phone || '',
        whatsapp_number: data.whatsapp_number || '',
      });
    },
    enabled: !!user,
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await api.get('/categories');
      return response.data;
    },
    enabled: !!user,
  });

  const { data: bookings, isLoading: bookingsLoading } = useQuery({
    queryKey: [isProvider ? 'my-jobs' : 'my-requests'],
    queryFn: async () => {
      const endpoint = isProvider ? '/my-jobs' : '/my-requests';
      const response = await api.get(endpoint);
      return response.data;
    },
    enabled: !!user,
  });

  const { data: myServices, isLoading: servicesLoading } = useQuery({
    queryKey: ['my-services'],
    queryFn: async () => {
      const response = await api.get('/my-services');
      return response.data;
    },
    enabled: isProvider && !!user,
  });

  // --- Mutations ---
  const profileMutation = useMutation({
    mutationFn: async (data) => {
      // Use FormData if data contains a file
      if (data instanceof FormData) {
        // Laravel PATCH with files often requires POST + _method
        data.append('_method', 'PATCH');
        return api.post('/user', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      return api.patch('/user', data);
    },
    onSuccess: (response) => {
      const updatedUser = response.data.user || response.data;
      updateUser(updatedUser);
      queryClient.invalidateQueries(['user-profile']);
    },
  });

  const statusMutation = useMutation({
    mutationFn: async ({ bookingId, status }) => {
      return api.patch(`/bookings/${bookingId}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries([isProvider ? 'my-jobs' : 'my-requests']);
    },
  });

  const serviceMutation = useMutation({
    mutationFn: async (data) => {
      return api.post('/services', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['my-services']);
      setShowServiceForm(false);
      setEditingService(null);
      setServiceForm({ category_id: '', title: '', description: '' });
      setImageFile(null);
      setImagePreview(null);
    },
  });

  const updateServiceMutation = useMutation({
    mutationFn: async ({ serviceId, data }) => {
      return api.put(`/services/${serviceId}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['my-services']);
      setShowServiceForm(false);
      setEditingService(null);
      setServiceForm({ category_id: '', title: '', description: '' });
      setImageFile(null);
      setImagePreview(null);
    },
  });

  const deleteServiceMutation = useMutation({
    mutationFn: async (serviceId) => {
      return api.delete(`/services/${serviceId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['my-services']);
    },
  });

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfileImagePreview(reader.result);
      reader.readAsDataURL(file);

      // Immediately upload
      const formDataObj = new FormData();
      formDataObj.append('profile_photo', file);
      profileMutation.mutate(formDataObj);
    }
  };

  // --- Handlers ---
  const handleProfileSubmit = (e) => {
    e.preventDefault();
    profileMutation.mutate(formData);
  };

  const handleDeleteService = (serviceId) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      deleteServiceMutation.mutate(serviceId);
    }
  };

  const handleStatusChange = (bookingId, status) => {
    statusMutation.mutate({ bookingId, status });
  };

  const handleCreateService = (e) => {
    e.preventDefault();
    const formDataObj = new FormData();
    formDataObj.append('category_id', serviceForm.category_id);
    formDataObj.append('title', serviceForm.title);
    formDataObj.append('description', serviceForm.description);
    if (imageFile) formDataObj.append('image', imageFile);

    if (editingService) {
      updateServiceMutation.mutate({ serviceId: editingService.id, data: formDataObj });
    } else {
      serviceMutation.mutate(formDataObj);
    }
  };

  const handleEditService = (service) => {
    setEditingService(service);
    setServiceForm({
      category_id: service.category_id,
      title: service.title,
      description: service.description,
    });
    setImageFile(null);
    setImagePreview(service.image || null);
    setShowServiceForm(true);
  };

  const handleCancelEdit = () => {
    setShowServiceForm(false);
    setEditingService(null);
    setServiceForm({ category_id: '', title: '', description: '' });
    setImageFile(null);
    setImagePreview(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // --- Memoized Stats ---
  const bookingStats = useMemo(() => {
    const all = bookings || [];
    const pending = all.filter((b) => b.status === 'pending').length;
    const accepted = all.filter((b) => b.status === 'accepted').length;
    const completed = all.filter((b) => b.status === 'completed').length;
    return { total: all.length, pending, accepted, completed };
  }, [bookings]);

  if (!user) return <Navigate to="/login" />;
  if (profileLoading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <Loader2 className="animate-spin text-[#000000]" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f4f4f4] pb-20 pt-8 mt-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-[280px_1fr] gap-8 items-start">

          {/* Left Sidebar - Jiji Style Profile Hub */}
          <aside className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 text-center relative group">
              <button
                onClick={() => setActiveTab('settings')}
                className="absolute top-4 right-4 p-2 text-slate-500 hover:text-[#000000] transition-colors"
                title="Settings"
              >
                <Settings size={20} />
              </button>

              <div
                className="w-24 h-24 bg-slate-100 rounded-full mx-auto mb-4 flex items-center justify-center text-slate-300 relative overflow-hidden group/avatar cursor-pointer"
                onClick={() => profileImageInputRef.current?.click()}
              >
                {profileImagePreview || user.profile_photo ? (
                  <img
                    src={profileImagePreview || user.profile_photo}
                    className="w-full h-full object-cover"
                    alt={user.name}
                  />
                ) : (
                  <User size={48} />
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center">
                  {profileMutation.isPending ? (
                    <Loader2 size={24} className="text-white animate-spin" />
                  ) : (
                    <ImagePlus size={24} className="text-white" />
                  )}
                </div>
                <input
                  ref={profileImageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImageChange}
                  className="hidden"
                />
              </div>

              <h2 className="text-xl font-bold text-slate-900 leading-tight mb-1">{user.name}</h2>
              <p className="text-slate-500 text-sm font-medium">{user.phone || 'No phone number'}</p>
            </div>

            {/* Jiji Advice Card */}
            <div className="bg-[#ff9c33] rounded-2xl p-4 text-white shadow-sm overflow-hidden relative">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded">Advice</span>
                <span className="text-[10px] opacity-70">hide 2</span>
              </div>
              <ul className="space-y-3">
                <li className="flex gap-2 text-xs font-bold items-start group">
                  <div className="w-1.5 h-1.5 rounded-full bg-white shrink-0 mt-1"></div>
                  <span className="flex-1">Get 15x more clients with TOPs!</span>
                  <X size={12} className="opacity-50 hover:opacity-100 cursor-pointer" />
                </li>
                <li className="flex gap-2 text-xs font-bold items-start group">
                  <div className="w-1.5 h-1.5 rounded-full bg-white shrink-0 mt-1"></div>
                  <span className="flex-1">Learn how to create an effective ad</span>
                  <X size={12} className="opacity-50 hover:opacity-100 cursor-pointer" />
                </li>
              </ul>
            </div>

            {/* Navigation Menu */}
            <nav className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-2">
              {[
                { id: 'services', label: 'My Services', icon: Briefcase, count: myServices?.length },
                { id: 'requests', label: 'My Requests', icon: TrendingUp, count: bookingStats.pending > 0 ? bookingStats.pending : null },
                { id: 'feedback', label: 'Feedback', icon: Star },
                { id: 'performance', label: 'Performance', icon: LayoutDashboard },
                { id: 'pro_service', label: 'Pro Service', icon: Wallet },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 group mb-1 ${activeTab === item.id ? 'bg-[#000000]/5 text-[#000000]' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={18} className={activeTab === item.id ? 'text-[#000000]' : 'text-slate-500 grouplaceholder:text-slate-500'} />
                    <span className="text-sm font-bold">{item.label}</span>
                    {item.count && (
                      <span className={`ml-1 text-[10px] font-black bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full ${activeTab === item.id ? 'bg-[#000000] text-white' : ''}`}>
                        {item.count}
                      </span>
                    )}
                  </div>
                  <ChevronRight size={16} className={`opacity-0 ${activeTab === item.id ? 'opacity-100' : 'group-hover:opacity-40'} transition-opacity`} />
                </button>
              ))}

              <div className="border-t border-slate-50 my-2 mx-2"></div>

              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-red-500 hover:bg-red-50 transition-all font-bold text-sm"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </nav>
          </aside>

          {/* Right Content Area */}
          <main className="min-w-0">
            {activeTab === 'services' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">My Services</h1>
                  <button
                    onClick={() => setShowServiceForm(true)}
                    className="flex items-center gap-2 px-6 py-2.5 bg-[#000000] text-white font-bold rounded-xl hover:bg-[#1a1a1a] transition-all shadow-lg shadow-slate-100 active:scale-95 uppercase tracking-wider text-xs"
                  >
                    <Plus size={18} />
                    <span>Add New Service</span>
                  </button>
                </div>

                <div className="flex gap-6 border-b border-slate-200 pb-0 mb-6">
                  <button className="px-4 py-3 border-b-2 border-[#000000] text-[#000000] font-bold text-sm flex items-center gap-2">
                    <CheckCircle2 size={16} />
                    <span>{myServices?.length || 0} Active</span>
                  </button>
                </div>

                {/* Feature Discount Banner */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex items-center justify-between group cursor-pointer hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-500">
                      <TrendingUp size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900">Feature discounts</h4>
                      <p className="text-xs text-slate-500 font-medium">for your ads</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[#000000] text-xs font-bold">
                    <span>Learn more</span>
                    <ChevronRight size={14} />
                  </div>
                </div>

                <div className="space-y-4">
                  {servicesLoading ? (
                    <div className="animate-pulse space-y-4">
                      {[1, 2].map(i => <div key={i} className="h-40 bg-white rounded-2xl border border-slate-200"></div>)}
                    </div>
                  ) : (!myServices || myServices.length === 0) ? (
                    <div className="bg-white rounded-[2.5rem] border border-dashed border-slate-200 p-20 text-center">
                      <Briefcase className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                      <h3 className="text-lg font-bold text-slate-900">No ads yet</h3>
                      <p className="text-slate-500 text-sm max-w-xs mx-auto mb-8">Start offering your services today to find clients.</p>
                      <button
                        onClick={() => setShowServiceForm(true)}
                        className="px-8 py-3 bg-[#000000] text-white font-bold rounded-xl shadow-lg shadow-emerald-200 uppercase tracking-wider text-xs"
                      >
                        Publish your first service
                      </button>
                    </div>
                  ) : (
                    myServices?.map((service) => (
                      <div key={service.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col sm:flex-row p-4 gap-6 group hover:border-[#000000]/20 transition-all">
                        <div className="w-full sm:w-48 h-48 sm:h-32 bg-slate-50 rounded-xl overflow-hidden shrink-0 relative">
                          {service.image ? (
                            <img src={service.image} className="w-full h-full object-cover" alt={service.title} />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-200">
                              <ImagePlus size={32} />
                            </div>
                          )}
                          <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-black px-1.5 py-0.5 rounded flex items-center gap-1">
                            <Camera size={10} />
                            <span>1</span>
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{service.category?.name || 'Service'}</p>
                              <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#000000] transition-colors line-clamp-1">{service.title}</h3>
                            </div>
                            <div className="bg-slate-50 text-[#000000] text-[10px] font-black px-2 py-1 rounded-full border border-black/10 uppercase">
                              Active
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-4 text-[10px] font-black text-slate-500 uppercase tracking-tighter mt-4">
                            <div className="flex items-center gap-1">
                              <TrendingUp size={12} className="text-black" />
                              <span>0 impressions</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <User size={12} className="text-black" />
                              <span>0 visitors</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone size={12} className="text-orange-500" />
                              <span>0 phone views</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageSquare size={12} className="text-[#000000]" />
                              <span>0 chats</span>
                            </div>
                          </div>

                          <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <button onClick={() => handleEditService(service)} className="text-[#000000] text-xs font-black uppercase tracking-wider hover:opacity-80">Edit</button>
                              <button className="text-[#000000] text-xs font-black uppercase tracking-wider hover:opacity-80">Renew</button>
                              <button
                                onClick={() => handleDeleteService(service.id)}
                                className="text-red-500 text-xs font-black uppercase tracking-wider hover:opacity-80"
                              >Close</button>
                            </div>
                            <button className="px-4 py-1.5 border border-orange-400 text-orange-500 text-[10px] font-black uppercase rounded-lg hover:bg-orange-50 transition-colors">
                              Top Ad
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === 'requests' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
                    {isProvider ? 'Incoming Workspace' : 'My Requests Pipeline'}
                  </h1>
                  <p className="text-slate-500 text-sm font-medium">Manage your active service requests and jobs</p>
                </div>

                {bookingsLoading ? (
                  <div className="animate-pulse space-y-4">
                    {[1, 2].map(i => <div key={i} className="h-32 bg-white rounded-2xl border border-slate-200"></div>)}
                  </div>
                ) : (!bookings || bookings.length === 0) ? (
                  <div className="bg-white rounded-[2.5rem] border border-dashed border-slate-200 p-20 text-center">
                    <Calendar className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-900">No requests yet</h3>
                    <p className="text-slate-500 text-sm max-w-xs mx-auto">Your booking requests will appear here.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings?.map((booking) => (
                      <BookingCard
                        key={booking.id}
                        booking={booking}
                        isProvider={isProvider}
                        onStatusChange={handleStatusChange}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Profile Settings</h1>
                    <p className="text-slate-500 text-sm font-medium">Update your public profile and contact info</p>
                  </div>
                  {profileMutation.isSuccess && (
                    <div className="bg-slate-50 text-[#000000] text-xs font-black px-4 py-2 rounded-xl flex items-center gap-2 animate-bounce">
                      <CheckCircle2 size={16} />
                      Saved!
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-10">
                  <form onSubmit={handleProfileSubmit} className="space-y-8">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-500">Full Name</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-slate-900 focus:bg-white focus:border-[#000000] transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-500">Email Address (Read-only)</label>
                        <input
                          type="email"
                          value={user.email}
                          disabled
                          className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-slate-500 cursor-not-allowed"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-500">Phone Number</label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+234..."
                          className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-slate-900 focus:bg-white focus:border-[#000000] transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-500">WhatsApp Number</label>
                        <input
                          type="tel"
                          value={formData.whatsapp_number}
                          onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
                          placeholder="234..."
                          className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-slate-900 focus:bg-white focus:border-[#000000] transition-all"
                        />
                      </div>
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={profileMutation.isPending}
                        className="px-10 py-4 bg-[#000000] text-white font-black rounded-2xl shadow-lg shadow-emerald-200 uppercase tracking-widest text-xs active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50"
                      >
                        {profileMutation.isPending ? <Loader2 className="animate-spin" size={20} /> : <Save size={18} />}
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Feedback, Performance, Pro Service placeholders */}
            {['feedback', 'performance', 'pro_service'].includes(activeTab) && (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-32 text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-3xl mx-auto mb-6 flex items-center justify-center text-slate-200">
                  <TrendingUp size={40} />
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-2 capitalize tracking-tight">{activeTab.replace('_', ' ')}</h2>
                <p className="text-slate-500 font-medium max-w-xs mx-auto">This feature is coming soon to your professional marketplace.</p>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Jiji Style Service Modal */}
      {showServiceForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-5 duration-300">
            <div className="px-8 py-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">{editingService ? 'Update your service' : 'Add new service'}</h2>
              <button
                onClick={handleCancelEdit}
                className="p-2 hover:bg-white rounded-full text-slate-500 hover:text-slate-900 transition-colors"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateService} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Service Title</label>
                  <input
                    type="text"
                    value={serviceForm.title}
                    onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-slate-900 focus:bg-white focus:border-[#000000] transition-all"
                    placeholder="e.g. Website Design"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Category</label>
                  <select
                    value={serviceForm.category_id}
                    onChange={(e) => setServiceForm({ ...serviceForm, category_id: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-slate-900 focus:bg-white focus:border-[#000000] transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Select Category</option>
                    {categories?.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Full Description</label>
                <textarea
                  value={serviceForm.description}
                  onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                  required
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-slate-900 focus:bg-white focus:border-[#000000] transition-all resize-none"
                  placeholder="Describe your service in detail..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Service Images</label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-40 border-2 border-dashed border-slate-200 rounded-[1.5rem] flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-slate-50 transition-all group overflow-hidden relative"
                >
                  {imagePreview ? (
                    <div className="absolute inset-0">
                      <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Camera size={24} className="text-white" />
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300">
                        <ImagePlus size={24} />
                      </div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Click to upload images</p>
                    </>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={serviceMutation.isPending || updateServiceMutation.isPending}
                  className="w-full py-4 bg-[#000000] text-white font-black rounded-2xl shadow-xl shadow-slate-100 uppercase tracking-widest text-xs active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                  {(serviceMutation.isPending || updateServiceMutation.isPending) ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <CheckCircle2 size={18} />
                  )}
                  {editingService ? 'Update Service' : 'Post your service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Icons for use within return code blocks as components
function Search(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.size || 24}
      height={props.size || 24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
