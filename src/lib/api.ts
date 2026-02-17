import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3333', // O endereço do seu Backend Fastify
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('rathole_token');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});