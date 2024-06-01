import { createRouter, createWebHistory } from 'vue-router';
import AddClient from '~/pages/AddClient.vue';
import ClientDetails from '~/pages/ClientDetails.vue';
import Clients from '~/pages/Clients.vue';
import Dashboard from '~/pages/Dashboard.vue';
import DashboardMobile from '~/pages/DashboardMobile.vue'; // Adicione esta linha
import EditClient from '~/pages/EditClient.vue';
import Login from '~/pages/Login.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'login', component: Login },
  { path: '/dashboard', name: 'dashboard', component: Dashboard },
  { path: '/dashboard-mobile', name: 'dashboard-mobile', component: DashboardMobile },  // Adicione esta linha
  { path: '/clients', name: 'clients', component: Clients },
  { path: '/clients/add', name: 'add-client', component: AddClient },
  { path: '/clients/:id', name: 'client-details', component: ClientDetails },
  { path: '/clients/:id/edit', name: 'edit-client', component: EditClient }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
