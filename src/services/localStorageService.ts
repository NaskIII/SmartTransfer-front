const StorageService = {
    set(key: string, value: any): void {
        try {
            const jsonData = JSON.stringify(value);
            localStorage.setItem(key, jsonData);
        } catch (e) {
            console.error(`Erro ao salvar no localStorage com a chave "${key}"`, e);
        }
    },

    get<T = any>(key: string): T | null {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) as T : null;
        } catch (e) {
            console.error(`Erro ao ler do localStorage com a chave "${key}"`, e);
            return null;
        }
    },

    remove(key: string): void {
        localStorage.removeItem(key);
    },

    clear(): void {
        localStorage.clear();
    }
};

export default StorageService;
