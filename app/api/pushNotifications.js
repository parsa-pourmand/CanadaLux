// app/api/pushNotifications.js
import apiClient from './client';

export const savePushToken = (token) =>
  apiClient.post('/users/me/push-token', { token });