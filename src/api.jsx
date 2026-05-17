import axios from 'axios';

const api = axios.create({
  baseURL: 'https://laksana-be-production.up.railway.app/api',
});

export default api;