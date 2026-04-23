import api from './client';

function toSearchParams(params = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return;
    }

    searchParams.set(key, String(value));
  });

  const query = searchParams.toString();
  return query ? `?${query}` : '';
}

export const adminApi = {
  getDashboard: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },
  listUsers: async (params) => {
    const response = await api.get(`/admin/users${toSearchParams(params)}`);
    return response.data;
  },
  getUser: async (id) => {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
  },
  updateUserStatus: async (id, payload) => {
    const response = await api.patch(`/admin/users/${id}/status`, payload);
    return response.data;
  },
  updateUserAdminAccess: async (id, payload) => {
    const response = await api.patch(`/admin/users/${id}/admin-access`, payload);
    return response.data;
  },
  listServices: async (params) => {
    const response = await api.get(`/admin/services${toSearchParams(params)}`);
    return response.data;
  },
  getService: async (id) => {
    const response = await api.get(`/admin/services/${id}`);
    return response.data;
  },
  updateServiceStatus: async (id, payload) => {
    const response = await api.patch(`/admin/services/${id}/status`, payload);
    return response.data;
  },
  deleteService: async (id, payload) => {
    const response = await api.delete(`/admin/services/${id}`, { data: payload });
    return response.data;
  },
  listCategories: async (params) => {
    const response = await api.get(`/admin/categories${toSearchParams(params)}`);
    return response.data;
  },
  createCategory: async (payload) => {
    const response = await api.post('/admin/categories', payload);
    return response.data;
  },
  updateCategory: async (id, payload) => {
    const response = await api.patch(`/admin/categories/${id}`, payload);
    return response.data;
  },
  deleteCategory: async (id, payload) => {
    const response = await api.delete(`/admin/categories/${id}`, { data: payload });
    return response.data;
  },
  listBookings: async (params) => {
    const response = await api.get(`/admin/bookings${toSearchParams(params)}`);
    return response.data;
  },
  getBooking: async (id) => {
    const response = await api.get(`/admin/bookings/${id}`);
    return response.data;
  },
  updateBookingNote: async (id, payload) => {
    const response = await api.patch(`/admin/bookings/${id}/admin-note`, payload);
    return response.data;
  },
  listReviews: async (params) => {
    const response = await api.get(`/admin/reviews${toSearchParams(params)}`);
    return response.data;
  },
  getReview: async (id) => {
    const response = await api.get(`/admin/reviews/${id}`);
    return response.data;
  },
  updateReviewStatus: async (id, payload) => {
    const response = await api.patch(`/admin/reviews/${id}/status`, payload);
    return response.data;
  },
  listAuditLogs: async (params) => {
    const response = await api.get(`/admin/audit-logs${toSearchParams(params)}`);
    return response.data;
  },
};
