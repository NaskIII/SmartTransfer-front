<template>
    <div class="agendar-transferencia">
        <h2>Agendar Transferência</h2>
        <form @submit.prevent="agendarTransferencia">

            <div class="form-group">
                <label for="contaDestino">Conta de Destino:</label>
                <input type="text" v-model="destinationAccount" id="destinationAccount" required
                    :class="{ 'input-error': !isContaDestinoValida }" />
                <p v-if="!isContaDestinoValida" class="error-message">
                    Conta de Destino inválida! Deve conter 10 dígitos numéricos.
                </p>
            </div>

            <div class="form-group">
                <label for="valor">Valor da Transferência:</label>
                <input type="number" v-model="amount" id="amount" required min="0" @blur="formatAmount" />
            </div>

            <div class="form-group">
                <label for="dataTransferencia">Data da Transferência:</label>
                <input type="date" v-model="transferDate" id="transferDate" required />
            </div>

            <div class="form-group">
                <label for="taxa">Taxa Aplicada:</label>
                <input type="text" v-model="tax" id="tax" readonly />
            </div>

            <button type="submit">Agendar Transferência</button>
        </form>

        <p v-if="alertMessage" :class="alertType">{{ alertMessage }}</p>
    </div>
</template>

<script lang="ts">
import { AxiosError, AxiosResponse } from 'axios';
import CreateTransferRequest from '../models/transfers/createTransfers.request';
import { apiService } from '../services/apiService'
import { showSuccess } from '../services/notificationService';

export default {
    data() {
        return {
            destinationAccount: '',
            amount: 0,
            transferDate: new Date().toISOString().split('T')[0],
            tax: 'R$: 0,00',
            alertMessage: '',
            alertType: '',
            isContaDestinoValida: true,
        };
    },
    watch: {
        destinationAccount(newVal) {
            this.validarContaDestino(newVal);

            if (this.isContaDestinoValida) {
                this.taxSimulation(this.transferDate, this.amount);
            }
        },
        transferDate(newVal) {
            this.taxSimulation(newVal, this.amount);
        },
        amount(newVal) {
            this.taxSimulation(this.transferDate, newVal)
        }
    },
    methods: {
        validarContaDestino(conta: '') {
            const regex = /^\d{10}$/;
            this.isContaDestinoValida = regex.test(conta);
        },

        taxSimulation(transferDate: Date | string, amount: number) {

            const transfer: CreateTransferRequest = {
                transferDate: transferDate,
                amount: amount,
                destinationAccount: this.destinationAccount
            };

            apiService.post<number>('/transfers/tax-simulation', transfer)
                .then((response: AxiosResponse<number>) => {
                    this.alertMessage = '';
                    this.alertType = '';
                    this.tax = `R$: ${response.data.toFixed(2)}`;
                })
                .catch((error: AxiosError<string>) => {
                    this.alertMessage = error.response?.data ?? '';
                    this.alertType = 'error';
                    this.tax = 'R$: 0,00';
                })
        },

        formatDateToBR(dateStr: string): string {
            const [year, month, day] = dateStr.split('-');
            return `${day}/${month}/${year}`;
        },

        agendarTransferencia() {
            if (!this.isContaDestinoValida) {
                this.alertMessage = 'Erro: A conta de destino deve conter 10 dígitos numéricos!';
                this.alertType = 'error';
                return;
            }

            if (this.tax === 'R$: 0,00') {
                this.alertMessage = 'Erro: Não há taxa aplicável para esta data!';
                this.alertType = 'error';
                return;
            }

            const transfer: CreateTransferRequest = {
                transferDate: this.transferDate,
                amount: this.amount,
                destinationAccount: this.destinationAccount
            };

            apiService
                .post('/transfers', transfer)
                .then(() => {
                    showSuccess("Sucesso!", `Sua transferência para o dia ${this.formatDateToBR(this.transferDate)} no valor de R$: ${this.amount.toFixed(2)} foi agendada.`)
                })
                .catch((error) => {
                    console.error(error);
                    this.alertMessage = 'Erro ao agendar a transferência. Tente novamente!';
                    this.alertType = 'error';
                });
        },

        formatAmount() {
            this.amount = parseFloat(this.amount.toFixed(2));
        }
    },
};
</script>

<style scoped>
.agendar-transferencia {
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
    width: 100%;
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
</style>
