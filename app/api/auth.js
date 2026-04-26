import apiClient from './client';

export const login = (email, password) =>
  apiClient.post('/auth', { email, password });

export const register = (data) =>
  apiClient.post('/users', data);