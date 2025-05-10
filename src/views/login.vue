<template>
    <div class="login-container">
        <div class="login-box">
            <h1>Login</h1>
            <form @submit.prevent="login">
                <div class="input-group">
                    <label for="username">E-mail</label>
                    <input type="email" id="username" v-model="email" placeholder="Informe seu e-mail." required />
                </div>
                <div class="input-group">
                    <label for="password">Senha</label>
                    <input type="password" id="password" v-model="password" placeholder="Informe sua senha;"
                        required />
                </div>
                <button type="submit" class="login-btn">Login</button>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import { showSuccess, showNotice } from '../services/notificationService';
import StorageService from '../services/localStorageService';
import { AuthResponse } from '../models/auth/auth.response';
import { AxiosResponse } from 'axios';
import { apiService } from '../services/apiService';
import router from '../router';

const email = ref('');
const password = ref('');

const login = () => {

    apiService.post<AuthResponse>('/auth', {
        email: email.value,
        password: password.value
    })
        .then((response: AxiosResponse<AuthResponse>) => {
            StorageService.set('auth-data', response.data);
            showSuccess("Seja Bem-Vindo!", "Seu login foi realizado com sucesso.")

            router.push('/transfer');
        }).catch(() => {
            showNotice("Credenciais inválidas!", "Usuário e/ou senha incorreta.");
        });
};
</script>

<style scoped>
/* Login container */
.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100vw;
    padding: 20px;
    background-color: var(--background-color);
}

.login-box {
    background: white;
    border-radius: 8px;
    padding: 30px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
    text-align: center;
}

h1 {
    margin-bottom: 20px;
    font-size: 2rem;
    color: var(--text-color);
}

.input-group {
    margin-bottom: 15px;
    text-align: left;
}

.input-group label {
    font-size: 0.9rem;
    color: var(--label-color, #555);
}

.input-group input {
    width: 100%;
    padding: 10px;
    margin-top: 5px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
}

.input-group input:focus {
    border-color: var(--primary-color, #4caf50);
    outline: none;
}

.login-btn {
    width: 100%;
    padding: 12px;
    background-color: var(--primary-color, #4caf50);
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1.1rem;
    cursor: pointer;
}

.login-btn:hover {
    background-color: var(--primary-color-dark, #45a049);
}

.footer-text {
    margin-top: 20px;
    font-size: 0.9rem;
    color: var(--footer-text-color, #555);
}

.footer-text a {
    color: var(--primary-color, #4caf50);
    text-decoration: none;
}

.footer-text a:hover {
    text-decoration: underline;
}

@media (max-width: 480px) {
    .login-box {
        padding: 20px;
    }

    h1 {
        font-size: 1.5rem;
    }

    .input-group input {
        font-size: 0.9rem;
    }

    .login-btn {
        font-size: 1rem;
    }
}
</style>
