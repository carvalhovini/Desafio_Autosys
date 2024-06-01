<template>
    <div>
      <h1>Oportunidades</h1>
      <NuxtLink to="/opportunities/new">Adicionar Oportunidade</NuxtLink>
      <ul>
        <li v-for="opportunity in opportunities" :key="opportunity.id">
          <div>{{ opportunity.name }} - {{ opportunity.email }}</div>
          <NuxtLink :to="`/opportunities/${opportunity.id}/edit`">Editar</NuxtLink>
          <button @click="deleteOpportunity(opportunity.id)">Excluir</button>
        </li>
      </ul>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useStore } from 'vuex';
  
  const store = useStore();
  const opportunities = ref([]);
  
  onMounted(async () => {
    await store.dispatch('fetchOpportunities');
    opportunities.value = store.state.opportunities;
  });
  
  const deleteOpportunity = async (id) => {
    await store.dispatch('deleteOpportunity', id);
  };
  </script>
  
  <style scoped>
  ul {
    list-style-type: none;
    padding: 0;
  }
  
  li {
    border: 1px solid #ccc;
    padding: 10px;
    margin-bottom: 10px;
  }
  
  button {
    background-color: transparent;
    border: none;
    cursor: pointer;
    color: #FF0000;
  }
  </style>
  