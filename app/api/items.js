import apiClient from './client';

export const getItems = () => apiClient.get('/items');