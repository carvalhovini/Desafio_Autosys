<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-content">
        <div class="login-form">
          <img src="/IMG/Logo.svg" alt="Ecosys Auto Logo" class="logo" />
          <form @submit.prevent="login">
            <div class="form-group">
              <label for="email">Email:</label>
              <input type="email" id="email" v-model="email" required />
            </div>
            <div class="form-group">
              <label for="password">Senha:</label>
              <input type="password" id="password" v-model="password" required />
            </div>
            <div class="form-group remember-me">
              <div class="remember-me-left">
                <input type="checkbox" id="remember" />
                <label for="remember">Lembrar</label>
              </div>
              <a href="#" class="forgot-password">Esqueci a senha</a>
            </div>
            <button type="submit">Entrar</button>
          </form>
          <p v-if="error" class="error-message">{{ error }}</p>
        </div>
        <div class="login-image">
          <img src="/IMG/img1.png" alt="Imagem de fundo" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const router = useRouter();
const store = useStore();
const email = ref('');
const password = ref('');
const error = ref('');

const login = async () => {
  error.value = ''; // Limpa o erro antes de tentar autenticar
  console.log('Tentando autenticar com:', email.value, password.value);
  try {
    const response = await axios.post('https://back.stage.ecosysauto.com.br/oauth/token', {
      username: email.value,
      password: password.value,
      client_id: '2',
      client_secret: '9WpPNhnbRPaVK3KwXJaRa8K0yPKPkeFuZK8aGhRQ',
      grant_type: 'password'
    });
    console.log('Resposta da autenticação:', response.data);
    store.dispatch('login', response.data.access_token);
    router.push('/dashboard'); // Redireciona para a página do dashboard
  } catch (err) {
    console.error('Erro ao autenticar:', err.response ? err.response.data : err.message);
    if (err.response) {
      console.error('Dados da resposta:', err.response.data);
      console.error('Status da resposta:', err.response.status);
      console.error('Cabeçalhos da resposta:', err.response.headers);
    }
    error.value = 'Falha ao autenticar. Verifique suas credenciais.';
  }
};
</script>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f8ff; /* Fundo azul claro */
}

.login-container {
  display: flex;
  background-color: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  width: 90%;
  max-width: 1000px;
  overflow: hidden;
}

.login-content {
  display: flex;
  flex-direction: row;
  width: 100%;
}

.login-form {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center; /* Centraliza os itens horizontalmente */
  width: 100%;
  max-width: 400px;
}

.logo {
  margin-top: 20px;
  width: 150px;
  height: auto;
  margin-bottom: 100px;
}

.form-group {
  margin-bottom: 15px;
  width: 100%;
  display: flex;
  flex-direction: column; /* Coloca o label acima do input */
}

.form-group input {
  width: 100%; /* Use a largura completa dentro do contêiner */
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin: 5px 0; /* Adiciona margem entre o label e o input */
}

label {
  font-size: 17px; /* Ajuste o tamanho da fonte */
  color: #333; /* Cor do texto */
}

.remember-me {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 15px;
}

.remember-me-left {
  display: flex;
  align-items: center;
}

.remember-me input[type="checkbox"] {
  margin-right: 5px; /* Ajuste a margem para que o checkbox fique próximo ao texto */
}

.remember-me label {
  font-size: 14px; /* Ajuste o tamanho da fonte */
  font-weight: 500; /* Torna a fonte mais fina */
  color: #333; /* Cor do texto */
}

button {
  width: 100%; /* Use a largura completa dentro do contêiner */
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 10px;
}

button:hover {
  background-color: #0056b3;
}

.forgot-password {
  color: #007bff;
  text-decoration: none;
  font-size: 14px; /* Ajuste o tamanho da fonte */
  font-weight: 500; /* Torna a fonte mais fina */
}

.forgot-password:hover {
  text-decoration: underline;
}

.error-message {
  color: red;
  margin-top: 10px;
}

.login-image {
  display: none; /* Esconde a imagem em telas pequenas */
}

.login-image img {
  height: 100%;
  object-fit: cover;
}

* {
  font-family: 'Roboto', sans-serif;
}

@media (min-width: 768px) {
  .login-image {
    display: block; /* Mostra a imagem em telas maiores */
    width: 50%; /* Ajusta a largura da imagem */
  }
}

@media (max-width: 767px) {
  .logo {
    margin-bottom: 50px; /* Ajusta a margem inferior do logotipo em dispositivos móveis */
  }
}
</style>
