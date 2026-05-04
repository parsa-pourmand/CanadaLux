import apiClient from './client';

export const getMe = () => apiClient.get('/users/me');

export const updateProfile = (profile) =>
  apiClient.patch('/users/me/profile', profile);