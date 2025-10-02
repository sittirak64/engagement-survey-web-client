import axios from 'axios';
import { getStorage } from '../mixins/AppStorage.js';

axios.defaults.baseURL = `${import.meta.env.VITE_BACKEND_API}`;
axios.defaults.timeout = 10000;

axios.interceptors.request.use((config) => {
  const token = getStorage('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers['Access-Control-Allow-Origin'] = '*';
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default axios;
