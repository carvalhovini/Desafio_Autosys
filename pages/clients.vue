<template>
  <div class="dashboard-container">
    <!-- Sidebar component -->
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

    <!-- Main content area -->
    <main class="main-content">
      <!-- Header for the main content -->
      <header class="main-header">
        <h1>Clientes</h1>
        <button class="add-button" @click="showAddModal = true">Adicionar</button>
      </header>
      <section class="content">
        <!-- Search bar for filtering clients -->
        <div class="search-bar">
          <input type="text" placeholder="Digite um nome" v-model="searchQuery" />
          <button class="filter-button">Filtro</button>
        </div>
        
        <!-- Table displaying clients -->
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
            <tr v-else v-for="client in clients" :key="client.id">
              <td>{{ client.id }}</td>
              <td>{{ client.name }}</td>
              <td>{{ client.phoneNumber }}</td>
              <td>{{ client.email }}</td>
              <td>
                <button @click="showEditModal(client)" class="edit-button">Editar</button>
                <button @click="showDetailsModal(client)" class="details-button">Ver Detalhes</button>
                <button @click="deleteClient(client.id)" class="delete-button">Excluir</button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Pagination controls -->
        <div class="pagination">
          <span>{{ clients.length }} resultados • registros por página </span>
          <div class="pagination-buttons">
            <button @click="prevPage" :disabled="!paginationLinks.prev">Anterior</button>
            <button @click="nextPage" :disabled="!paginationLinks.next">Próxima</button>
          </div>
        </div>
      </section>
    </main>

    <!-- Modal for adding a new client -->
    <div v-if="showAddModal" class="modal-overlay">
      <div class="modal">
        <h3>Cadastrar Cliente</h3>
        <form @submit.prevent="addClient">
          <div class="form-group">
            <label>Nome:</label>
            <input type="text" v-model="newClient.name" required />
          </div>
          <div class="form-group">
            <label>Telefone:</label>
            <input type="text" v-model="newClient.phoneNumber" required />
          </div>
          <div class="form-group">
            <label>Email:</label>
            <input type="email" v-model="newClient.email" required />
          </div>
          <div class="form-group">
            <label>CPF:</label>
            <input type="text" v-model="newClient.personalIdentificationNumber" />
          </div>
          <div class="form-group">
            <label>Data de Nascimento:</label>
            <input type="date" v-model="newClient.birthday" />
          </div>
          <div class="form-group">
            <label>RG e Expedidor:</label>
            <input type="text" v-model="newClient.nationalIdentityCard" />
            <input type="text" v-model="newClient.nationalIdentityCardExpeditor" placeholder="Expedidor" />
          </div>
          <div class="form-group">
            <label>Estado Civil:</label>
            <input type="text" v-model="newClient.maritalStatus" />
          </div>
          <div class="form-group">
            <label>Nacionalidade:</label>
            <input type="text" v-model="newClient.nationality" />
          </div>
          <div class="form-group">
            <label>Profissão:</label>
            <input type="text" v-model="newClient.profession" />
          </div>
          <div class="form-group">
            <label>CEP:</label>
            <input type="text" v-model="newClient.zipCode" />
          </div>
          <div class="form-group">
            <label>Endereço:</label>
            <input type="text" v-model="newClient.address" />
          </div>
          <div class="form-group">
            <label>Número:</label>
            <input type="text" v-model="newClient.addressNumber" />
          </div>
          <div class="form-group">
            <label>Complemento:</label>
            <input type="text" v-model="newClient.addressComplement" />
          </div>
          <div class="form-group">
            <label>Bairro:</label>
            <input type="text" v-model="newClient.addressNeighborhood" />
          </div>
          <div class="form-group">
            <label>Cidade:</label>
            <input type="text" v-model="newClient.addressCity" />
          </div>
          <div class="form-group">
            <label>UF:</label>
            <input type="text" v-model="newClient.addressState" />
          </div>
          <div class="form-group">
            <label>Origem:</label>
            <select v-model="newClient.origin_id">
              <option value="1">Mercado Livre</option>
              <option value="2">Google</option>
              <option value="3">Indicação</option>
              <option value="4">Outros</option>
            </select>
          </div>
          <div class="form-group">
            <label>Observações:</label>
            <textarea v-model="newClient.observations"></textarea>
          </div>
          <button type="submit" class="save-button">Salvar</button>
          <button @click="showAddModal = false" class="cancel-button">Cancelar</button>
        </form>
      </div>
    </div>

    <!-- Modal for editing a client -->
    <div v-if="showEditModalFlag" class="modal-overlay">
      <div class="modal">
        <h3>Editar Cliente</h3>
        <form @submit.prevent="updateClient">
          <div class="form-group">
            <label>Nome:</label>
            <input type="text" v-model="selectedClient.name" required />
          </div>
          <div class="form-group">
            <label>Telefone:</label>
            <input type="text" v-model="selectedClient.phoneNumber" required />
          </div>
          <div class="form-group">
            <label>Email:</label>
            <input type="email" v-model="selectedClient.email" required />
          </div>
          <div class="form-group">
            <label>CPF:</label>
            <input type="text" v-model="selectedClient.personalIdentificationNumber" />
          </div>
          <div class="form-group">
            <label>Data de Nascimento:</label>
            <input type="date" v-model="selectedClient.birthday" />
          </div>
          <div class="form-group">
            <label>RG e Expedidor:</label>
            <input type="text" v-model="selectedClient.nationalIdentityCard" />
            <input type="text" v-model="selectedClient.nationalIdentityCardExpeditor" placeholder="Expedidor" />
          </div>
          <div class="form-group">
            <label>Estado Civil:</label>
            <input type="text" v-model="selectedClient.maritalStatus" />
          </div>
          <div class="form-group">
            <label>Nacionalidade:</label>
            <input type="text" v-model="selectedClient.nationality" />
          </div>
          <div class="form-group">
            <label>Profissão:</label>
            <input type="text" v-model="selectedClient.profession" />
          </div>
          <div class="form-group">
            <label>CEP:</label>
            <input type="text" v-model="selectedClient.zipCode" />
          </div>
          <div class="form-group">
            <label>Endereço:</label>
            <input type="text" v-model="selectedClient.address" />
          </div>
          <div class="form-group">
            <label>Número:</label>
            <input type="text" v-model="selectedClient.addressNumber" />
          </div>
          <div class="form-group">
            <label>Complemento:</label>
            <input type="text" v-model="selectedClient.addressComplement" />
          </div>
          <div class="form-group">
            <label>Bairro:</label>
            <input type="text" v-model="selectedClient.addressNeighborhood" />
          </div>
          <div class="form-group">
            <label>Cidade:</label>
            <input type="text" v-model="selectedClient.addressCity" />
          </div>
          <div class="form-group">
            <label>UF:</label>
            <input type="text" v-model="selectedClient.addressState" />
          </div>
          <div class="form-group">
            <label>Origem:</label>
            <select v-model="selectedClient.origin_id">
              <option value="1">Mercado Livre</option>
              <option value="2">Google</option>
              <option value="3">Indicação</option>
              <option value="4">Outros</option>
            </select>
          </div>
          <div class="form-group">
            <label>Observações:</label>
            <textarea v-model="selectedClient.observations"></textarea>
          </div>
          <button type="submit" class="save-button">Salvar</button>
          <button type="button" @click="showEditModalFlag = false" class="cancel-button">Cancelar</button>
        </form>
      </div>
    </div>

    <!-- Modal for viewing client details -->
    <div v-if="showDetailsModalFlag" class="modal-overlay">
      <div class="modal">
        <h3>Detalhes do Cliente</h3>
        <p><strong>ID:</strong> {{ selectedClient.id }}</p>
        <p><strong>Nome:</strong> {{ selectedClient.name }}</p>
        <p><strong>Telefone:</strong> {{ selectedClient.phoneNumber }}</p>
        <p><strong>Email:</strong> {{ selectedClient.email }}</p>
        <p><strong>CPF:</strong> {{ selectedClient.personalIdentificationNumber }}</p>
        <p><strong>Data de Nascimento:</strong> {{ selectedClient.birthday }}</p>
        <p><strong>RG e Expedidor:</strong> {{ selectedClient.nationalIdentityCard }} - {{ selectedClient.nationalIdentityCardExpeditor }}</p>
        <p><strong>Estado Civil:</strong> {{ selectedClient.maritalStatus }}</p>
        <p><strong>Nacionalidade:</strong> {{ selectedClient.nationality }}</p>
        <p><strong>Profissão:</strong> {{ selectedClient.profession }}</p>
        <p><strong>CEP:</strong> {{ selectedClient.zipCode }}</p>
        <p><strong>Endereço:</strong> {{ selectedClient.address }}</p>
        <p><strong>Número:</strong> {{ selectedClient.addressNumber }}</p>
        <p><strong>Complemento:</strong> {{ selectedClient.addressComplement }}</p>
        <p><strong>Bairro:</strong> {{ selectedClient.addressNeighborhood }}</p>
        <p><strong>Cidade:</strong> {{ selectedClient.addressCity }}</p>
        <p><strong>UF:</strong> {{ selectedClient.addressState }}</p>
        <p><strong>Origem:</strong> {{ selectedClient.origin_id }}</p>
        <p><strong>Observações:</strong> {{ selectedClient.observations }}</p>
        <button type="button" @click="showDetailsModalFlag = false" class="cancel-button">Fechar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

// Router and store instances
const router = useRouter();
const store = useStore();

// Reactive references for state management
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

// Modal flags
const showAddModal = ref(false);
const showEditModalFlag = ref(false);
const showDetailsModalFlag = ref(false);
const selectedClient = ref({});

// New client object
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

// Computed property for paginated clients
const paginatedClients = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return clients.value.filter(client => 
    client.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  ).slice(start, end);
});

// Computed property for total pages
const totalPages = computed(() => Math.ceil(clients.value.length / itemsPerPage.value));

// Function to fetch clients from API
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
    clients.value = data.data;
    paginationLinks.value = data.links;
    currentPage.value = data.meta.current_page;
  } catch (err) {
    error.value = 'Erro ao carregar clientes.';
  } finally {
    loading.value = false;
  }
};

// Function for previous page navigation
const prevPage = () => {
  if (paginationLinks.value.prev) {
    fetchClients(paginationLinks.value.prev);
  }
};

// Function for next page navigation
const nextPage = () => {
  if (paginationLinks.value.next) {
    fetchClients(paginationLinks.value.next);
  }
};

// Function to handle logout
const logout = () => {
  store.dispatch('logout');
  router.push('/login');
};

// Function to handle client search
const searchClients = () => {
  currentPage.value = 1; // Reset to the first page on a new search
  fetchClients();
};

// Function to add a new client
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
    error.value = err.message || 'Erro ao adicionar cliente.';
    console.error('Detalhes do erro:', err);
  }
};

// Function to reset input fields
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

// Function to show the edit client modal
const showEditModal = (client) => {
  selectedClient.value = { ...client };
  showEditModalFlag.value = true;
};

// Function to show the client details modal
const showDetailsModal = async (client) => {
  try {
    await store.dispatch('fetchClientDetails', client.id);
    selectedClient.value = store.state.clientDetails;
    showDetailsModalFlag.value = true;
  } catch (err) {
    error.value = 'Erro ao buscar detalhes do cliente.';
  }
};

// Function to update client details
const updateClient = async () => {
  try {
    await store.dispatch('editClient', { id: selectedClient.value.id, client: selectedClient.value });
    showEditModalFlag.value = false;
    fetchClients();
  } catch (err) {
    error.value = 'Erro ao atualizar cliente.';
  }
};

// Function to delete a client
const deleteClient = async (id) => {
  try {
    await store.dispatch('deleteClient', id);
    fetchClients();
  } catch (err) {
    error.value = 'Erro ao excluir cliente.';
  }
};

// Fetch clients when the component is mounted
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
