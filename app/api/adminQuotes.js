import apiClient from './client';

export const getAdminQuotes = () =>
  apiClient.get('/quotes/admin/all');

export const respondToQuote = (id, retailerResponse) =>
  apiClient.patch(`/quotes/admin/${id}/respond`, {
    retailerResponse,
  });