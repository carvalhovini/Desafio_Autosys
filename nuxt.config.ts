import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      axiosBaseURL: 'https://bcar.back.stage.ecosysauto.com.br/api/v1'
    }
  },
  css: [
    '~/assets/styles/main.scss'
  ],
  modules: ['@pinia/nuxt'],
  plugins: ['~/plugins/axios.js', '~/plugins/vuex.js'],
  build: {
    transpile: ['vuex']
  }
});
