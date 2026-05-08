import apiClient from './client';

export const getAdminUsers = () => apiClient.get('/users/admin/all');

export const getAdminUser = (id) => apiClient.get(`/users/admin/${id}`);

export const updateUserDiscount = (id, discount) =>
  apiClient.patch(`/users/admin/${id}/discount`, { discount });

export const getAdminUserDetails = (id) =>
  apiClient.get(`/users/admin/${id}/details`);