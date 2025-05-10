// src/utils/notifications.ts
import { success, error, info, notice } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';

// Função para exibir uma notificação de sucesso
export const showSuccess = (title: string, text: string) => {
    success({
        title: title,
        text: text,
        delay: 2000,
        styling: 'brighttheme'
    });
};

// Função para exibir uma notificação de erro
export const showError = (title: string, text: string) => {
    error({
        title: title,
        text: text,
        delay: 3000,
        styling: 'brighttheme'
    });
};

// Função para exibir uma notificação de informação
export const showInfo = (title: string, text: string) => {
    info({
        title: title,
        text: text,
        delay: 4000,
        styling: 'brighttheme'
    });
};

// Função para exibir uma notificação padrão (geral)
export const showNotice = (title: string, text: string) => {
    notice({
        title: title,
        text: text,
        delay: 2000,
        styling: 'brighttheme'
    });
};
