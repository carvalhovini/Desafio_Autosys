import axios from 'axios';
import { useStore } from 'vuex';

export default defineNuxtPlugin(nuxtApp => {
  const store = useStore();
  const apiClient = axios.create({
    baseURL: nuxtApp.$config.public.axiosBaseURL,
    timeout: 10000, // 10 segundos de timeout
  });

  apiClient.interceptors.request.use(config => {
    const token = store.state.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }, error => {
    return Promise.reject(error);
  });

  apiClient.interceptors.response.use(response => {
    return response;
  }, error => {
    if (error.code === 'ECONNABORTED') {
      console.error('Erro de timeout: A conexão foi abortada');
    } else {
      console.error('Erro de conexão:', error.message);
    }
    return Promise.reject(error);
  });

  nuxtApp.provide('apiClient', apiClient);
});
