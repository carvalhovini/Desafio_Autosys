<template>
  <div class="dashboard-container">
    <aside class="sidebar">
      <div class="sidebar-header">
        <img src="/IMG/Logo.svg" alt="Ecosys Auto Logo" class="logo" />
      </div>
      <nav class="sidebar-nav">
        <ul>
          <li><NuxtLink to="/">Início</NuxtLink></li>
          <li><NuxtLink to="/clients">Clientes</NuxtLink></li>
          <li><NuxtLink to="/vendors">Fornecedores</NuxtLink></li>
          <li><NuxtLink to="/journey">Jornada do Cliente</NuxtLink></li>
          <li><NuxtLink to="/stock">Estoque</NuxtLink></li>
          <li><NuxtLink to="/finance">Financeiro</NuxtLink></li>
          <li><NuxtLink to="/settings">Configurações</NuxtLink></li>
        </ul>
      </nav>
      <div class="sidebar-footer">
        <button @click="logout" class="logout-button">Sair</button>
      </div>
    </aside>
    <main class="main-content">
      <header class="main-header">
        <h1>Fornecedores</h1>
        <button class="add-button" @click="showAddModal = true">Adicionar</button>
      </header>
      <section class="content">
        <div class="search-bar">
          <input type="text" placeholder="Digite um nome" v-model="searchQuery" @input="searchClients" />
          <button class="filter-button" @click="searchClients">Filtro</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Nome</th>
              <th>Telefone</th>
              <th>Email</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="5">Carregando...</td>
            </tr>
            <tr v-else-if="error">
              <td colspan="5">{{ error }}</td>
            </tr>
            <tr v-else v-for="vendor in filteredVendors" :key="vendor.id">
              <td>{{ vendor.id }}</td>
              <td>{{ vendor.name }}</td>
              <td>{{ vendor.phoneNumber }}</td>
              <td>{{ vendor.email }}</td>
              <td>
                <button @click="showEditModal(vendor)" class="edit-button">Editar</button>
                <button @click="showDetailsModal(vendor)" class="details-button">Ver Detalhes</button>
                <button @click="deleteClient(vendor.id)" class="delete-button">Excluir</button>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="pagination">
          <span>{{ filteredVendors.length }} resultados • registros por página 
          </span>
          <div class="pagination-buttons">
            <button @click="prevPage" :disabled="!paginationLinks.prev">Anterior</button>
            <button @click="nextPage" :disabled="!paginationLinks.next">Próxima</button>
          </div>
        </div>
      </section>
    </main>
    
    <!-- Modal para adicionar cliente -->
    <div v-if="showAddModal" class="modal-overlay">
      <div class="modal">
        <h3>Cadastrar Cliente</h3>
        <form @submit.prevent="addClient">
          <div class="form-group" v-for="(label, key) in addFormFields" :key="key">
            <label :for="key">{{ label }}:</label>
            <input v-if="key !== 'observations' && key !== 'origin_id'" :id="key" :type="getInputType(key)" v-model="newClient[key]" required />
            <textarea v-if="key === 'observations'" :id="key" v-model="newClient[key]"></textarea>
            <select v-if="key === 'origin_id'" :id="key" v-model="newClient[key]">
              <option value="1">Mercado Livre</option>
              <option value="2">Google</option>
              <option value="3">Indicação</option>
              <option value="4">Outros</option>
            </select>
          </div>
          <div class="modal-buttons">
            <button type="submit" class="save-button">Salvar</button>
            <button @click="showAddModal = false" class="cancel-button">Cancelar</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal para editar cliente -->
    <div v-if="showEditModalFlag" class="modal-overlay">
      <div class="modal">
        <h3>Editar Cliente</h3>
        <form @submit.prevent="updateClient">
          <div class="form-group" v-for="(label, key) in addFormFields" :key="key">
            <label :for="key">{{ label }}:</label>
            <input v-if="key !== 'observations' && key !== 'origin_id'" :id="key" :type="getInputType(key)" v-model="selectedClient[key]" required />
            <textarea v-if="key === 'observations'" :id="key" v-model="selectedClient[key]"></textarea>
            <select v-if="key === 'origin_id'" :id="key" v-model="selectedClient[key]">
              <option value="1">Mercado Livre</option>
              <option value="2">Google</option>
              <option value="3">Indicação</option>
              <option value="4">Outros</option>
            </select>
          </div>
          <div class="modal-buttons">
            <button type="submit" class="save-button">Salvar</button>
            <button @click="showEditModalFlag = false" class="cancel-button">Cancelar</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal para visualizar detalhes do cliente -->
    <div v-if="showDetailsModalFlag" class="modal-overlay">
      <div class="modal">
        <h3>Detalhes do Cliente</h3>
        <p v-for="(label, key) in addFormFields" :key="key"><strong>{{ label }}:</strong> {{ selectedClient[key] }}</p>
        <button @click="showDetailsModalFlag = false" class="cancel-button">Fechar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const router = useRouter();
const store = useStore();

const clients = ref([]);
const loading = ref(false);
const error = ref('');
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(10);
const paginationLinks = ref({
  first: null,
  last: null,
  prev: null,
  next: null,
});

const showAddModal = ref(false);
const showEditModalFlag = ref(false);
const showDetailsModalFlag = ref(false);
const selectedClient = ref({});

const newClient = ref({
  name: '',
  phoneNumber: '',
  email: '',
  personalIdentificationNumber: '',
  birthday: '',
  nationalIdentityCard: '',
  nationalIdentityCardExpeditor: '',
  maritalStatus: '',
  nationality: '',
  profession: '',
  zipCode: '',
  address: '',
  addressNumber: '',
  addressComplement: '',
  addressNeighborhood: '',
  addressCity: '',
  addressState: '',
  origin_id: '',
  observations: ''
});

const filteredVendors = computed(() => {
  return clients.value.filter(client => client.is_vendor === 1 && client.name.toLowerCase().includes(searchQuery.value.toLowerCase()));
});

const totalPages = computed(() => Math.ceil(filteredVendors.value.length / itemsPerPage.value));

const fetchClients = async (url) => {
  loading.value = true;
  try {
    const response = await fetch(url || 'https://bcar.back.stage.ecosysauto.com.br/api/v1/client', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${store.state.token}`
      }
    });
    const data = await response.json();
    console.log('Dados recebidos:', data);  // Log para verificar os dados recebidos
    clients.value = data.data.filter(client => client.is_vendor === 1 && client.id);  // Filtro por fornecedor e ID
    console.log('Fornecedores filtrados:', clients.value);  // Log para verificar os fornecedores filtrados
    paginationLinks.value = data.links;
    currentPage.value = data.meta.current_page;
  } catch (err) {
    error.value = 'Erro ao carregar fornecedores.';
  } finally {
    loading.value = false;
  }
};

const prevPage = () => {
  if (paginationLinks.value.prev) {
    fetchClients(paginationLinks.value.prev);
  }
};

const nextPage = () => {
  if (paginationLinks.value.next) {
    fetchClients(paginationLinks.value.next);
  }
};

const logout = () => {
  store.dispatch('logout');
  router.push('/login');
};

const searchClients = () => {
  currentPage.value = 1; // Reset to the first page on a new search
  fetchClients();
};

const addClient = async () => {
  try {
    const response = await fetch('https://bcar.back.stage.ecosysauto.com.br/api/v1/client', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${store.state.token}`
      },
      body: JSON.stringify(newClient.value)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erro ao adicionar cliente:', errorData);
      throw new Error(`Erro ao adicionar cliente: ${errorData.message || 'Erro desconhecido'}`);
    }

    resetFields();
    showAddModal.value = false;
    fetchClients(); // Refresh the client list
  } catch (err) {
    error.value = err.message || 'Erro ao adicionar fornecedor.';
    console.error('Detalhes do erro:', err);
  }
};

const resetFields = () => {
  newClient.value = {
    name: '',
    phoneNumber: '',
    email: '',
    personalIdentificationNumber: '',
    birthday: '',
    nationalIdentityCard: '',
    nationalIdentityCardExpeditor: '',
    maritalStatus: '',
    nationality: '',
    profession: '',
    zipCode: '',
    address: '',
    addressNumber: '',
    addressComplement: '',
    addressNeighborhood: '',
    addressCity: '',
    addressState: '',
    origin_id: '',
    observations: ''
  };
};

const showEditModal = (client) => {
  selectedClient.value = { ...client };
  showEditModalFlag.value = true;
};

const showDetailsModal = async (client) => {
  try {
    await store.dispatch('fetchClientDetails', client.id);
    selectedClient.value = store.state.clientDetails;
    showDetailsModalFlag.value = true;
  } catch (err) {
    error.value = 'Erro ao buscar detalhes do fornecedor.';
  }
};

const updateClient = async () => {
  try {
    await store.dispatch('editClient', { id: selectedClient.value.id, client: selectedClient.value });
    showEditModalFlag.value = false;
    fetchClients();
  } catch (err) {
    error.value = 'Erro ao atualizar fornecedor.';
  }
};

const deleteClient = async (id) => {
  try {
    await store.dispatch('deleteClient', id);
    fetchClients();
  } catch (err) {
    error.value = 'Erro ao excluir fornecedor.';
  }
};

onMounted(() => {
  if (window.innerWidth < 768) {
    router.push('/dashboard-mobile');
  } else {
    fetchClients();
  }
});
</script>

<style scoped lang="scss">
@import "@/assets/styles/clientes.scss";
</style>
