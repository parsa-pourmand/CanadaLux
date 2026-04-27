import apiClient from './client';

export const getMe = () => apiClient.get('/users/me');