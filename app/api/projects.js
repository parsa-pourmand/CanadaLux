import apiClient from './client';

export const getProjects = () => apiClient.get('/projects');

export const createProject = (project) => apiClient.post('/projects', project);