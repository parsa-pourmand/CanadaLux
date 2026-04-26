import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://10.0.0.68:3000/api',
  timeout: 10000,
});

export const setAuthToken = (token) => {
  if (token) {
    apiClient.defaults.headers.common['x-auth-token'] = token;
  } else {
    delete apiClient.defaults.headers.common['x-auth-token'];
  }
};

export default apiClient;