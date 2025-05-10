<template>
    <div class="user-list">
        <h2>Lista de Usuários</h2>

        <form @submit.prevent="searchUsers" class="filter-form">
            <div class="form-group">
                <label for="name">Nome:</label>
                <input type="text" v-model="filters.name" id="name" />
            </div>

            <div class="form-group">
                <label for="lastName">Sobrenome:</label>
                <input type="text" v-model="filters.lastName" id="lastName" />
            </div>

            <div class="form-group">
                <label for="email">Email:</label>
                <input type="email" v-model="filters.email" id="email" />
            </div>

            <div class="form-group">
                <label for="status">Status:</label>
                <select v-model="filters.status" id="status">
                    <option value="">Todos</option>
                    <option value="ACTIVE">Ativo</option>
                    <option value="INACTIVE">Inativo</option>
                </select>
            </div>

            <button type="submit">Filtrar</button>
        </form>

        <table class="user-table">
            <thead>
                <tr>
                    <th>Nome</th>
                    <th>Sobrenome</th>
                    <th>Email</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="user in users" :key="user.userId">
                    <td>{{ user.firstName }}</td>
                    <td>{{ user.lastName }}</td>
                    <td>{{ user.email }}</td>
                    <td>{{ user.status }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { apiService } from '../services/apiService';
import { UserBasicResponse } from '../models/user/userBasic.response';

export default defineComponent({
    data() {
        return {
            users: [] as UserBasicResponse[],
            filters: {
                name: '',
                lastName: '',
                email: '',
                profile: '',
                status: ''
            }
        };
    },
    mounted() {
        this.searchUsers();
    },
    methods: {
        async searchUsers() {
            try {
                const params = new URLSearchParams();
                Object.entries(this.filters).forEach(([key, value]) => {
                    if (value) params.append(key, value);
                });

                apiService.get('/users', {
                    params
                }).then((response: any) => {
                    this.users = response.data.content;
                });
            } catch (error) {
                console.error('Erro ao buscar usuários:', error);
            }
        }
    }
});
</script>

<style scoped>
.user-list {
    padding: 20px;
}

.filter-form {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    margin-bottom: 20px;
    align-items: center;
    justify-content: center;
}

.form-group {
    display: flex;
    flex-direction: column;
}

button {
    width: 110px;
    height: 40px;
    padding: 0.75rem;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
}

button:hover {
    background-color: #45a049;
}

.user-table {
    width: 100%;
    border-collapse: collapse;
}

.user-table th,
.user-table td {
    border: 1px solid #ccc;
    padding: 10px;
    text-align: left;
}
</style>
