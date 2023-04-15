import axios, { AxiosInstance } from 'axios';
import { API_KEY, BASE_URL } from '../settings/config';

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY
  },
});

api.interceptors.request.use(
  config => {
    config.headers['Authorization'] = 'Bearer ' + localStorage.getItem('token');
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  response => {
    console.log(response);
    return response;
  },
  error => {
    if (error.response.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;