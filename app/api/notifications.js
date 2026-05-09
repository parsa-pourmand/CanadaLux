// app/api/notifications.js
import apiClient from './client';

export const getNotifications = () => apiClient.get('/notifications');

export const markNotificationRead = (id) =>
  apiClient.patch(`/notifications/${id}/read`);