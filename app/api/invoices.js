import apiClient from './client';

export const getInvoices = () => apiClient.get('/invoices');

export const getInvoice = (id) => apiClient.get(`/invoices/${id}`);