// app/api/payments.js
import apiClient from './client';

export const getPayments = () => apiClient.get('/payments');