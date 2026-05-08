import apiClient from './client';

export const getAdminItems = () => apiClient.get('/items');

export const updateAdminItem = (id, data) =>
  apiClient.patch(`/items/${id}`, data);