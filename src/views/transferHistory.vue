<template>
    <div class="extrato-transferencias">
        <h2>Extrato de Transferências</h2>

        <form @submit.prevent="applyFilters" class="filters">
            <div class="form-group">
                <label for="destinationAccount"> Conta de Destino: </label>
                <input type="text" v-model="filters.destinationAccount" id="destinationAccount" />
            </div>

            <div class="form-group">
                <label for="scheduleDate"> Data de Agendamento: </label>
                <input type="date" v-model="filters.scheduleDate" id="scheduleDate" />
            </div>

            <div class="form-group">
                <label for="transferDate"> Data da Transferência: </label>
                <input type="date" v-model="filters.transferDate" id="transferDate" />
            </div>
            <button type="submit">Filtrar</button>
        </form>

        <table v-if="transfers.length > 0">
            <thead>
                <tr>
                    <th>Origem</th>
                    <th>Destino</th>
                    <th>Valor</th>
                    <th>Taxa</th>
                    <th>Data da Transferência</th>
                    <th>Data de Agendamento</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="transfer in transfers" :key="transfer.transferId">
                    <td>{{ transfer.sourceAccount }}</td>
                    <td>{{ transfer.destinationAccount }}</td>
                    <td>{{ formatCurrency(transfer.amount) }}</td>
                    <td>{{ formatCurrency(transfer.fee) }}</td>
                    <td>{{ formatDate(transfer.transferDate) }}</td>
                    <td>{{ formatDate(transfer.scheduleDate) }}</td>
                </tr>
            </tbody>
        </table>

        <p v-else>Nenhuma transferência encontrada.</p>

        <div class="pagination" v-if="totalPages > 1">
            <button @click="previousPage" :disabled="page === 0">Anterior</button>
            <span>Página {{ page + 1 }} de {{ totalPages }}</span>
            <button @click="nextPage" :disabled="page >= totalPages - 1">Próxima</button>
        </div>
    </div>
</template>

<script lang="ts">
import { apiService } from '../services/apiService';

export default {
    data() {
        return {
            transfers: [] as Array<any>,
            page: 0,
            size: 10,
            totalPages: 0,
            filters: {
                destinationAccount: null,
                scheduleDate: null,
                transferDate: null
            }
        };
    },
    created() {
        this.fetchTransfers();
    },
    methods: {
        fetchTransfers() {
            if (!this.filters.destinationAccount) {
                this.filters.destinationAccount = null;
            }

            const params: any = {
                page: this.page,
                size: this.size,
                ...this.filters
            };

            apiService.get('/transfers', { params })
                .then((response: any) => {
                    this.transfers = response.data.content;
                    this.totalPages = response.data.totalPages;
                })
                .catch(error => {
                    console.error("Erro ao buscar extrato:", error);
                });
        },
        applyFilters() {
            this.page = 0;
            this.fetchTransfers();
        },
        formatCurrency(value: number) {
            return value.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
            });
        },
        formatDate(dateStr: string): string {
            const [year, month, day] = dateStr.split('-');
            return `${day}/${month}/${year}`;
        },
        nextPage() {
            if (this.page < this.totalPages - 1) {
                this.page++;
                this.fetchTransfers();
            }
        },
        previousPage() {
            if (this.page > 0) {
                this.page--;
                this.fetchTransfers();
            }
        }
    }
};
</script>

<style scoped>
.filters {
    margin-bottom: 1rem;
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    align-items: center;
}

.form-group {
    margin-bottom: 1rem;
}

label {
    display: block;
    font-weight: bold;
}

input[type="text"],
input[type="number"],
input[type="date"] {
    width: 100%;
    padding: 0.5rem;
    margin-top: 0.25rem;
    border: 1px solid #ccc;
    border-radius: 4px;
}

input.error {
    border: 1px solid red;
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

.error {
    color: red;
    font-weight: bold;
}

.success {
    color: green;
    font-weight: bold;
}

.error-message {
    color: red;
    font-size: 0.85rem;
    margin-top: 0.25rem;
}

.pagination {
    margin-top: 1rem;
    display: flex;
    justify-content: center;
    gap: 1rem;
    align-items: center;
}
</style>
