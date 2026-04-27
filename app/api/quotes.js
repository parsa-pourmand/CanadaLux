import apiClient from './client';

export const getQuotes = () => apiClient.get('/quotes');

export const createQuote = (quote) => apiClient.post('/quotes', quote);

export const getQuote = (id) => apiClient.get(`/quotes/${id}`);