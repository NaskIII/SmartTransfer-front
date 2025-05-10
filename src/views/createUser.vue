<template>
    <div class="create-user">
        <h2>Criar Novo Usuário</h2>
        <form @submit.prevent="createUser">

            <!-- Primeiro nome -->
            <div class="form-group">
                <label for="firstName">Nome:</label>
                <input v-model="user.firstName" id="firstName" />
                <p v-if="!user.firstName" class="error">Nome é obrigatório.</p>
            </div>

            <!-- Sobrenome -->
            <div class="form-group">
                <label for="lastName">Sobrenome:</label>
                <input v-model="user.lastName" id="lastName" />
                <p v-if="!user.lastName" class="error">Sobrenome é obrigatório.</p>
            </div>

            <!-- Email -->
            <div class="form-group">
                <label for="email">E-mail:</label>
                <input v-model="user.email" id="email" />
                <p v-if="!isEmailValid" class="error">E-mail inválido.</p>
            </div>

            <!-- Conta -->
            <div class="form-group">
                <label for="sourceAccount">Conta de Origem:</label>
                <input v-model="user.sourceAccount" id="sourceAccount" />
                <p v-if="!isSourceAccountValid" class="error">A conta deve ter 10 caracteres alfanuméricos.</p>
            </div>

            <!-- Senha -->
            <div class="form-group">
                <label for="password">Senha:</label>
                <input type="password" v-model="user.password" id="password" />
                <p v-if="!isPasswordValid" class="error">Senha deve ter entre 8 e 32 caracteres.</p>
            </div>

            <!-- Confirmar senha -->
            <div class="form-group">
                <label for="confirmPassword">Confirmar Senha:</label>
                <input type="password" v-model="user.confirmPassword" id="confirmPassword" />
                <p v-if="user.password !== user.confirmPassword" class="error">Senhas não coincidem.</p>
            </div>

            <!-- Perfil -->
            <div class="form-group">
                <label for="profile">Perfil:</label>
                <select v-model="user.profile" id="profile">
                    <option :value="ProfileType.ADMINISTRATOR">Administrador</option>
                    <option :value="ProfileType.COMMON">Comum</option>
                </select>
                <p v-if="!isProfileValid" class="error">Perfil inválido.</p>
            </div>

            <button type="submit" :disabled="isFormInvalid">Criar Usuário</button>
        </form>
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive, computed } from 'vue';
import { ProfileType } from '../models/user/profile.response';
import CreateUserRequest from '../models/user/createUser.request';
import { AxiosResponse, AxiosError } from 'axios';
import { apiService } from '../services/apiService';
import { showError, showSuccess } from '../services/notificationService';

export default defineComponent({
    setup() {
        const user = reactive({
            firstName: '',
            lastName: '',
            email: '',
            sourceAccount: '',
            password: '',
            confirmPassword: '',
            profile: ProfileType.COMMON,
        });

        const isEmailValid = computed(() =>
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)
        );

        const isSourceAccountValid = computed(() =>
            /^[A-Za-z0-9]{10}$/.test(user.sourceAccount)
        );

        const isPasswordValid = computed(() =>
            user.password.length >= 8 && user.password.length <= 32
        );

        const isProfileValid = computed(() =>
            user.profile === ProfileType.ADMINISTRATOR || user.profile === ProfileType.COMMON
        );

        const isFormInvalid = computed(() =>
            !user.firstName ||
            !user.lastName ||
            !isEmailValid.value ||
            !isSourceAccountValid.value ||
            !isPasswordValid.value ||
            user.password !== user.confirmPassword ||
            !isProfileValid.value
        );

        return {
            user,
            ProfileType,
            isEmailValid,
            isSourceAccountValid,
            isPasswordValid,
            isProfileValid,
            isFormInvalid,
        };
    },

    methods: {
        createUser() {

            const newUser: CreateUserRequest = {
                firstName: this.user.firstName,
                lastName: this.user.lastName,
                email: this.user.email,
                sourceAccount: this.user.sourceAccount,
                password: this.user.password,
                confirmPassword: this.user.confirmPassword,
                profile: this.user.profile,
            };

            apiService
                .post('/users', newUser)
                .then((response: AxiosResponse) => {
                    showSuccess('Sucesso!', `O susuário (a) ${newUser.firstName} foi criando com sucesso.`);
                    this.resetForm();
                })
                .catch((error: AxiosError<string>) => {
                    showError('Erro.', 'Houve um erro na criação do usuário.');
                });
        },

        resetForm() {
            this.user = {
                firstName: '',
                lastName: '',
                email: '',
                sourceAccount: '',
                password: '',
                confirmPassword: '',
                profile: ProfileType.COMMON,
            };
        }
    }
});
</script>

<style scoped>
.create-user {
    max-width: 500px;
    margin: 0 auto;
    padding: 2rem;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h2 {
    text-align: center;
}

.form-group {
    margin-bottom: 1rem;
}

label {
    display: block;
    font-weight: bold;
}

input[type="text"],
input[type="email"],
input[type="password"],
select {
    width: 100%;
    padding: 0.5rem;
    margin-top: 0.25rem;
    border: 1px solid #ccc;
    border-radius: 4px;
}

button {
    width: 100%;
    padding: 0.75rem;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
}

button:disabled {
    background-color: #ddd;
    cursor: not-allowed;
}

button:hover:not(:disabled) {
    background-color: #45a049;
}

.error {
    color: red;
    font-size: 0.85rem;
    margin-top: 0.25rem;
}

.success {
    color: green;
    font-weight: bold;
}
</style>
