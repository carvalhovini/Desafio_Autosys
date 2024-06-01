<template>
  <div class="dashboard-container">
    <header class="main-header header-black">
      <div class="header-left">
        <img src="/IMG/Logo.svg" alt="Ecosys Auto Logo" class="logo" />
        <div class="user-info"></div>
      </div>
      <div class="header-right">
        <button class="menu-button" @click="toggleSidebar">Menu
          <i class="fas fa-bars"></i>
        </button>
      </div>
    </header>

    <aside class="sidebar" :class="{ open: sidebarOpen }">
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
      <h1>Clientes</h1>
      <div class="search-bar">
        <input type="text" placeholder="Digite um nome" v-model="searchQuery" />
      </div>
      <div class="client-list">
        <div v-if="loading" class="loading">Carregando...</div>
        <div v-else-if="error" class="error">{{ error }}</div>
        <div v-else v-for="client in paginatedClients" :key="client.id" class="client-item">
          <div class="client-info">
            <span>#{{ client.id }}</span>
            <span>Nome: {{ client.name }}</span>
            <span>Telefone: {{ client.phoneNumber }}</span>
            <span>Email: {{ client.email }}</span>
          </div>
          <div class="client-actions">
            <div class="dropdown">
              <button class="dropbtn">Ações</button>
              <div class="dropdown-content">
                <a href="#" @click="showDetailsModal(client)">Ver Detalhes</a>
                <a href="#" @click="showEditModal(client)">Editar</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="pagination">
        <button @click="prevPage" :disabled="!paginationLinks.prev" class="pagination-button">Anterior</button>
        <button @click="nextPage" :disabled="!paginationLinks.next" class="pagination-button">Próxima</button>
      </div>
      <button class="add-button" @click="showAddModal = true">Adicionar</button>
    </main>

    <!-- Modal para adicionar cliente -->
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
            <input type="text" v-model="newClient.personalIdentificationNumber" required />
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
            <select v-model="newClient.maritalStatus">
              <option value="solteiro">Solteiro</option>
              <option value="casado">Casado</option>
              <option value="divorciado">Divorciado</option>
              <option value="viúvo">Viúvo</option>
            </select>
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
            <input type="text" v-model="selectedClient.personalIdentificationNumber" required />
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
            <select v-model="selectedClient.maritalStatus">
              <option value="solteiro">Solteiro</option>
              <option value="casado">Casado</option>
              <option value="divorciado">Divorciado</option>
              <option value="viúvo">Viúvo</option>
            </select>
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
          <div class="modal-buttons">
            <button type="submit" class="save-button">Salvar</button>
            <button type="button" @click="showEditModalFlag = false" class="cancel-button">Cancelar</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal para visualizar detalhes do cliente -->
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

const sidebarOpen = ref(false);
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

const paginatedClients = computed(() => {
  return clients.value;
});

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
    alert(`Erro ao adicionar cliente: ${err.message}`);
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
    error.value = 'Erro ao buscar detalhes do cliente.';
  }
};

const updateClient = async () => {
  try {
    await store.dispatch('editClient', { id: selectedClient.value.id, client: selectedClient.value });
    showEditModalFlag.value = false;
    fetchClients();
  } catch (err) {
    error.value = 'Erro ao atualizar cliente.';
  }
};

const deleteClient = async (id) => {
  try {
    await store.dispatch('deleteClient', id);
    fetchClients();
  } catch (err) {
    error.value = 'Erro ao excluir cliente.';
  }
};

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};

onMounted(() => {
  fetchClients();
});
</script>

<style scoped>
* {
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
}

.dashboard-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.main-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem;
  background: #000;
  border-bottom: 1px solid #ccc;
  z-index: 1000;
  height: 80px;
}

.header-left {
  display: flex;
  align-items: center;
}

.logo {
  height: 40px;
}

.user-info {
  margin-left: 1rem;
}

.header-right .menu-button {
  background: none;
  border: none;
  font-size: 2rem;
  color: #fff;
  cursor: pointer;
  font-size: 20px;
}

.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 250px;
  height: 100%;
  background: #111;
  color: #fff;
  transform: translateX(-100%);
  transition: transform 0.3s ease;
}

.sidebar.open {
  transform: translateX(0);
}

.sidebar-nav {
  padding: 2rem 1rem;
  margin-top: 100px;
}

.sidebar-nav ul {
  list-style: none;
  padding: 0;
}

.sidebar-nav ul li {
  margin-bottom: 1rem;
}

.sidebar-nav ul li a {
  color: #fff;
  text-decoration: none;
}

.sidebar-footer {
  position: absolute;
  bottom: 1rem;
  left: 1rem;
}

.logout-button {
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
}

.main-content {
  margin-top: 4rem;
  padding: 1rem;
  overflow-y: auto;
}

.search-bar {
  display: flex;
  margin-bottom: 1rem;
}

.search-bar input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px 0 0 4px;
}

.filter-button {
  padding: 0.5rem;
  background: #007bff;
  border: none;
  color: #fff;
  cursor: pointer;
  border-radius: 0 4px 4px 0;
}

.button-white {
  background: #fff;
  color: #000;
}

.client-list {
  margin-bottom: 1rem;
}

.client-item {
  padding: 1rem;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
}

.client-info span {
  display: block;
}

.client-actions {
  display: flex;
  gap: 0.5rem;
}

.dropdown {
  position: relative;
  display: inline-block;
}

.dropbtn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f9f9f9;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
}

.dropdown-content a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}

.dropdown-content a:hover {
  background-color: #f1f1f1;
}

.dropdown:hover .dropdown-content {
  display: block;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
}

.pagination-button {
  padding: 0.5rem 1rem;
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  margin: 0 0.5rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.pagination-button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.add-button {
  position: relative;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  padding: 1rem 2rem;
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: #fff;
  padding: 2rem;
  border-radius: 4px;
  max-width: 80%;
  max-height: 80%;
  scrollbar-width: 20px;
  overflow: auto; /* Adiciona a rolagem quando necessário */
  scrollbar-width: thin;
}

.element.style {
    max-height: 500px;
}

.modal h3 {
  margin-top: 0;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.save-button {
  padding: 0.5rem 1rem;
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.cancel-button {
  padding: 0.5rem 1rem;
  background: #6c757d;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 0.5rem;
}
</style>
