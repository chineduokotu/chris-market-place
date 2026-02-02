import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import BookingCard from '../components/BookingCard';
import { Plus, X, LayoutDashboard, Briefcase, Calendar, PlusCircle, AlertCircle, Loader2, ImagePlus } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
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

  // Determine provider status - use optional chaining to prevent errors
  const isProvider = user?.current_role === 'provider';

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await api.get('/categories');
      return response.data;
    },
    enabled: !!user, // Only run if user is available
  });

  const { data: bookings, isLoading: bookingsLoading } = useQuery({
    queryKey: [isProvider ? 'my-jobs' : 'my-requests'],
    queryFn: async () => {
      const endpoint = isProvider ? '/my-jobs' : '/my-requests';
      const response = await api.get(endpoint);
      return response.data;
    },
    enabled: !!user, // Only run if user is available
  });

  const { data: myServices, isLoading: servicesLoading } = useQuery({
    queryKey: ['my-services'],
    queryFn: async () => {
      const response = await api.get('/my-services');
      return response.data;
    },
    enabled: isProvider && !!user, // Only run if user is available and is provider
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

  // Move the authentication check AFTER all hooks
  if (!user) {
    return <Navigate to="/login" />;
  }

  const handleStatusChange = (bookingId, status) => {
    statusMutation.mutate({ bookingId, status });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    if (editingService?.image) {
      setImagePreview(editingService.image);
    } else {
      setImagePreview(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCreateService = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('category_id', serviceForm.category_id);
    formData.append('title', serviceForm.title);
    formData.append('description', serviceForm.description);
    if (imageFile) {
      formData.append('image', imageFile);
    }
    if (editingService) {
      updateServiceMutation.mutate({ serviceId: editingService.id, data: formData });
    } else {
      serviceMutation.mutate(formData);
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
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDeleteService = (serviceId) => {
    if (deleteServiceMutation.isPending) return;
    if (!window.confirm('Delete this service? This action cannot be undone.')) return;
    deleteServiceMutation.mutate(serviceId);
  };

  return (
    <div className="bg-slate-50/50 min-h-screen pb-20 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
               <div className="p-2 bg-blue-600 rounded-lg text-white">
                  <LayoutDashboard size={20} />
               </div>
               <h1 className="text-3xl font-bold text-slate-900 tracking-tight">User Dashboard</h1>
            </div>
            <p className="text-slate-500">
              Welcome back, <span className="font-bold text-slate-900">{user.name}</span>. You are currently in <span className="text-blue-600 font-bold uppercase tracking-wider text-xs px-2 py-0.5 bg-blue-50 rounded-full border border-blue-100">{user.current_role}</span> mode.
            </p>
          </div>
          
          {isProvider && (
            <button
              onClick={() => {
                if (showServiceForm) {
                  handleCancelEdit();
                } else {
                  setEditingService(null);
                  setServiceForm({ category_id: '', title: '', description: '' });
                  setImageFile(null);
                  setImagePreview(null);
                  setShowServiceForm(true);
                }
              }}
              className={`flex items-center gap-2 px-6 py-3 font-bold rounded-2xl shadow-lg transition-all active:scale-[0.98] ${
                showServiceForm 
                ? 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 shadow-slate-200/50' 
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200'
              }`}
            >
              {showServiceForm ? <X size={20} /> : <PlusCircle size={20} />}
              {showServiceForm ? 'Discard Changes' : 'Create New Service'}
            </button>
          )}
        </div>

        {isProvider && showServiceForm && (
          <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-10 mb-12 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex items-center gap-3 mb-8">
               <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold">
                  <Plus size={24} />
               </div>
               <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                 {editingService ? 'Update service' : 'List a new service'}
               </h2>
            </div>
            
            <form onSubmit={handleCreateService} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Service Title</label>
                  <input
                    type="text"
                    value={serviceForm.title}
                    onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 focus:bg-white transition-all outline-none"
                    placeholder="e.g. Professional Web Development"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Category</label>
                  <div className="relative">
                    <select
                      value={serviceForm.category_id}
                      onChange={(e) => setServiceForm({ ...serviceForm, category_id: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 focus:bg-white transition-all outline-none appearance-none font-medium"
                    >
                      <option value="">Select Category</option>
                      {categories?.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                       <Plus size={16} className="rotate-45" />
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Detailed Description</label>
                <textarea
                  value={serviceForm.description}
                  onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                  required
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 focus:bg-white transition-all outline-none resize-none"
                  placeholder="Describe what you offer in detail..."
                />
              </div>
              
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Service Image (Optional)</label>
                <div className="relative">
                  {imagePreview ? (
                  <div className="relative w-full h-48 rounded-2xl overflow-hidden border border-slate-200">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full h-48 border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all"
                    >
                      <div className="p-3 bg-slate-100 rounded-full">
                        <ImagePlus size={24} className="text-slate-400" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-slate-600">Click to upload an image</p>
                        <p className="text-xs text-slate-400">PNG, JPG, GIF up to 5MB</p>
                      </div>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
              </div>
              <div className="pt-4 flex items-center gap-4">
                 <button
                    type="submit"
                    disabled={serviceMutation.isPending}
                    className="px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-200 active:scale-[0.98] disabled:opacity-50 transition-all flex items-center gap-2"
                  >
                    {serviceMutation.isPending ? <Loader2 size={18} className="animate-spin" /> : <PlusCircle size={18} />}
                    {editingService ? 'Update Service' : 'Publish Service'}
                  </button>
                  {(serviceMutation.isError || updateServiceMutation.isError) && (
                    <div className="flex items-center gap-2 text-red-600 text-sm font-bold bg-red-50 px-4 py-3 rounded-xl border border-red-100">
                      <AlertCircle size={18} />
                      {serviceMutation.error?.response?.data?.message ||
                        updateServiceMutation.error?.response?.data?.message ||
                        'Failed to save service'}
                    </div>
                  )}
              </div>
            </form>
          </div>
        )}

        {isProvider && (
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
               <Briefcase size={20} className="text-slate-400" />
               <h2 className="text-xl font-bold text-slate-900 tracking-tight">My Active Services</h2>
            </div>
            
            {servicesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-40 bg-white rounded-3xl border border-slate-100 animate-pulse"></div>
                ))}
              </div>
            ) : myServices?.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
                <p className="text-slate-500 font-medium italic">You haven't listed any services yet.</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
                {myServices?.map((service) => (
                  <div key={service.id} className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors group">
                    {/* Service Image Thumbnail */}
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                      {service.image ? (
                        <img
                          src={service.image}
                          alt={service.title}
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                          <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    
                    {/* Service Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                        {service.title}
                      </h3>
                      <p className="text-sm text-green-600 font-medium">
                        {service.category?.name || 'Uncategorized'}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleEditService(service)}
                        className="px-3 py-1.5 text-xs font-semibold text-slate-600 border border-slate-200 rounded-full hover:bg-slate-50 hover:text-blue-600 hover:border-blue-200 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteService(service.id)}
                        disabled={deleteServiceMutation.isPending}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors ${
                          deleteServiceMutation.isPending
                            ? 'text-slate-400 border-slate-200 bg-slate-50 cursor-not-allowed'
                            : 'text-red-600 border-red-200 hover:bg-red-50'
                        }`}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div>
          <div className="flex items-center gap-3 mb-6">
             <Calendar size={20} className="text-slate-400" />
             <h2 className="text-xl font-bold text-slate-900 tracking-tight">
               {isProvider ? 'Incoming Workspace' : 'My Requests Pipeline'}
             </h2>
          </div>
          
          {bookingsLoading ? (
            <div className="space-y-4">
               {[1, 2, 3].map((i) => (
                  <div key={i} className="h-32 bg-white rounded-3xl border border-slate-100 animate-pulse"></div>
               ))}
            </div>
          ) : bookings?.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm border-dashed">
              <p className="text-slate-500 font-medium italic">
                {isProvider ? 'No incoming job requests at the moment.' : 'Your pipeline is currently empty.'}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
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
      </div>
    </div>
  );
}
