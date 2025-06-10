import axios from 'axios';
import authHeader from './auth-header';
const API_URL = 'http://localhost:5000/';

const instance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use(
  (config) => {
    const headers = authHeader();
    if (headers && headers.Authorization) {
      config.headers.Authorization = headers.Authorization;
    } else if (headers && headers['x-access-token']) { 
      config.headers['x-access-token'] = headers['x-access-token'];
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;