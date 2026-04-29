import apiClient from './client';

export const getOrders = () => apiClient.get('/orders');

export const createOrder = (order) => apiClient.post('/orders', order);