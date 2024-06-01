import axios from 'axios';
import { createStore } from 'vuex';

const BASE_URL = 'https://bcar.back.stage.ecosysauto.com.br/api/v1/client';

const store = createStore({
  state: {
    token: (typeof window !== 'undefined' && localStorage.getItem('token')) || '',
    clients: [],
    clientDetails: null,
    userDetails: null
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token;
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
      }
    },
    CLEAR_TOKEN(state) {
      state.token = '';
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
    },
    SET_CLIENTS(state, clients) {
      state.clients = clients;
    },
    SET_CLIENT_DETAILS(state, clientDetails) {
      state.clientDetails = clientDetails;
    },
    SET_USER_DETAILS(state, userDetails) {
      state.userDetails = userDetails;
    }
  },
  actions: {
    async fetchClients({ commit, state }) {
      try {
        const response = await axios.get(BASE_URL, {
          headers: { Authorization: `Bearer ${state.token}` }
        });
        commit('SET_CLIENTS', response.data.data);
      } catch (error) {
        console.error('Erro ao buscar clientes:', error);
        throw error; // Propaga o erro para o chamador da action
      }
    },
    async fetchClientDetails({ commit, state }, id) {
      try {
        const response = await axios.get(`${BASE_URL}/${id}`, {
          headers: { Authorization: `Bearer ${state.token}` }
        });
        commit('SET_CLIENT_DETAILS', response.data.data);
      } catch (error) {
        console.error('Erro ao buscar detalhes do cliente:', error);
        throw error;
      }
    },
    async fetchUserDetails({ commit, state }) {
      try {
        const response = await axios.get(`${BASE_URL}/user`, {
          headers: { Authorization: `Bearer ${state.token}` }
        });
        commit('SET_USER_DETAILS', response.data.data);
      } catch (error) {
        console.error('Erro ao buscar detalhes do usuário:', error);
        throw error;
      }
    },
    async addClient({ dispatch, state }, client) {
      try {
        console.log('Payload enviado:', client); // Adicione este log para depuração
        await axios.post(BASE_URL, client, {
          headers: { Authorization: `Bearer ${state.token}` }
        });
        dispatch('fetchClients');
      } catch (error) {
        console.error('Erro ao adicionar cliente:', error);
        if (error.response && error.response.data) {
          console.error('Detalhes do erro:', error.response.data);
        }
        throw error;
      }
    },
    async editClient({ dispatch, state }, { id, client }) {
      try {
        await axios.put(`${BASE_URL}/${id}`, client, {
          headers: { Authorization: `Bearer ${state.token}` }
        });
        dispatch('fetchClients');
      } catch (error) {
        console.error('Erro ao editar cliente:', error);
        throw error;
      }
    },
    async deleteClient({ dispatch, state }, id) {
      try {
        await axios.delete(`${BASE_URL}/${id}`, {
          headers: { Authorization: `Bearer ${state.token}` }
        });
        dispatch('fetchClients');
      } catch (error) {
        console.error('Erro ao excluir cliente:', error);
        throw error;
      }
    }
  }
});

export default store;
