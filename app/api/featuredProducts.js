import apiClient from './client';

export const getFeaturedProducts = () =>
  apiClient.get('/featured-products');

export const createFeaturedProduct = (data) =>
  apiClient.post('/featured-products', data);

export const deleteFeaturedProduct = (id) =>
  apiClient.delete(`/featured-products/${id}`);