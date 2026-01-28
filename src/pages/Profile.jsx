import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import { User, Phone, MessageSquare, Save, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    whatsapp_number: user?.whatsapp_number || '',
  });

  const { data: userProfile, isLoading } = useQuery({
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
  });

  const updateMutation = useMutation({
    mutationFn: async (data) => {
      return api.patch('/user', data);
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries(['user-profile']);
      // Also update the auth context user
      queryClient.invalidateQueries(['current-user']);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const whatsappLink = formData.whatsapp_number 
    ? `https://wa.me/${formData.whatsapp_number.replace(/[^0-9]/g, '')}`
    : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 pt-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-600 rounded-lg text-white">
              <User size={20} />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Profile Settings</h1>
          </div>
          <p className="text-slate-500">Manage your account information and contact details</p>
        </div>

        {/* Success Message */}
        {updateMutation.isSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-100 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <CheckCircle size={20} className="text-green-600" />
            <p className="text-sm font-bold text-green-700">Profile updated successfully!</p>
          </div>
        )}

        {/* Error Message */}
        {updateMutation.isError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3">
            <AlertCircle size={20} className="text-red-600" />
            <p className="text-sm font-bold text-red-700">
              {updateMutation.error.response?.data?.message || 'Failed to update profile'}
            </p>
          </div>
        )}

        {/* Profile Form */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 focus:bg-white transition-all outline-none"
                placeholder="Your full name"
              />
            </div>

            {/* Email (Read-only) */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={userProfile?.email || ''}
                disabled
                className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-2xl text-slate-500 cursor-not-allowed"
              />
              <p className="mt-1 text-xs text-slate-400">Email cannot be changed</p>
            </div>

            {/* Divider */}
            <div className="border-t border-slate-100 my-8"></div>

            {/* Contact Information Header */}
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-1">Contact Information</h2>
              <p className="text-sm text-slate-500">
                {user?.current_role === 'provider' 
                  ? 'These details will be shared with seekers after you accept their booking requests.'
                  : 'Update your contact details for better communication.'}
              </p>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-slate-400" />
                  Phone Number
                </div>
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 focus:bg-white transition-all outline-none"
                placeholder="+1 (555) 123-4567"
              />
              <p className="mt-1 text-xs text-slate-400">
                Include country code for international numbers
              </p>
            </div>

            {/* WhatsApp Number */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                <div className="flex items-center gap-2">
                  <MessageSquare size={14} className="text-slate-400" />
                  WhatsApp Number
                </div>
              </label>
              <input
                type="tel"
                value={formData.whatsapp_number}
                onChange={(e) => handleChange('whatsapp_number', e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 focus:bg-white transition-all outline-none"
                placeholder="1234567890"
              />
              <p className="mt-1 text-xs text-slate-400">
                Numbers only, without spaces or special characters
              </p>
              
              {/* WhatsApp Preview */}
              {whatsappLink && (
                <div className="mt-3 p-3 bg-green-50 border border-green-100 rounded-xl">
                  <p className="text-xs text-green-700 font-bold mb-1">Preview:</p>
                  <a 
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-green-600 hover:underline break-all"
                  >
                    {whatsappLink}
                  </a>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="w-full md:w-auto px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-200 active:scale-[0.98] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {updateMutation.isPending ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Role Information */}
        <div className="mt-6 p-6 bg-blue-50 border border-blue-100 rounded-2xl">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-600 rounded-lg text-white shrink-0">
              <User size={16} />
            </div>
            <div>
              <h3 className="font-bold text-blue-900 text-sm mb-1">Current Role</h3>
              <p className="text-sm text-blue-700">
                You are currently in <span className="font-bold uppercase">{user?.current_role}</span> mode.
                {user?.current_role === 'provider' && (
                  <span className="block mt-1">
                    Your contact information will only be visible to seekers after you accept their booking requests.
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
