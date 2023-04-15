import axios, { AxiosInstance } from 'axios';
import {  BASE_URL, CYBERSOFT_TOKEN } from '../settings/config';
import { LocalStorage } from '../../common/enum/localstorage';
import { User } from '../../redux/user/user.model';

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use(
  config => {
    const useLogin: User = JSON.parse(localStorage.getItem(LocalStorage.UserLogin) || '{}');
    config.headers['Authorization'] = 'Bearer ' + useLogin?.accessToken;
    config.headers['TokenCybersoft']= CYBERSOFT_TOKEN;
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response.status === 401) {
      localStorage.clear()
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;