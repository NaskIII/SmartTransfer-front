<template>
    <div class="layout">
        <!-- Sidebar -->
        <aside class="sidebar" :class="{ open: isSidebarOpen }" ref="sidebarRef">
            <div class="sidebar-header">Smart Transfer</div>

            <nav class="sidebar-menu">
                <router-link to="/transfer" class="menu-item" active-class="active">Transferências</router-link>
                <router-link to="/transfer-history" class="menu-item" active-class="active">Histórico de
                    Transferências</router-link>
                <router-link to="/list-users" class="menu-item" active-class="active"
                    v-if="renderRBAC(profileType.ADMINISTRATOR)">Listar Usuários</router-link>
                <router-link to="/create-user" class="menu-item" active-class="active"
                    v-if="renderRBAC(profileType.ADMINISTRATOR)">Criar Usuário</router-link>
            </nav>

            <button class="logout-button" @click="logout">Sair</button>
        </aside>

        <div v-if="isSidebarOpen" class="overlay" @click="closeSidebar"></div>

        <div class="main-wrapper">
            <header class="header">
                <button class="menu-toggle" @click="toggleSidebar">☰</button>
            </header>

            <main class="main-content">
                <router-view />
            </main>
        </div>
    </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import StorageService from '../services/localStorageService'
import { ProfileType } from '../models/user/profile.response'
import { AuthResponse } from '../models/auth/auth.response'

export default {
    data() {
        const router = useRouter()
        const isSidebarOpen = ref(false)

        const toggleSidebar = () => {
            isSidebarOpen.value = !isSidebarOpen.value
        }

        const closeSidebar = () => {
            isSidebarOpen.value = false
        }

        const logout = () => {
            StorageService.clear()
            router.push('/login')
        }

        const profileType = ProfileType;

        return {
            isSidebarOpen,
            toggleSidebar,
            closeSidebar,
            logout,
            profileType
        }
    },

    methods: {
        renderRBAC(profile: ProfileType) {
            const authData: AuthResponse | null = StorageService.get('auth-data');
            if (!authData) {
                this.logout()
            }

            return profile === authData?.profile
        }
    }
}


</script>

<style scoped>
.layout {
    display: flex;
    height: 100vh;
    background-color: #f9f9f9;
    font-family: 'Segoe UI', sans-serif;
    position: relative;
}

.sidebar {
    width: 240px;
    background-color: #ffffff;
    display: flex;
    flex-direction: column;
    padding: 1rem;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
    transition: transform 0.3s ease;
    z-index: 30;
}

.sidebar-header {
    font-size: 1.5rem;
    font-weight: bold;
    color: #333;
    margin-bottom: 2rem;
}

.sidebar-menu {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.menu-item {
    text-decoration: none;
    color: #555;
    font-weight: 500;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    transition: background 0.2s;
}

.menu-item:hover {
    background-color: #f0f0f0;
}

.menu-item.active {
    background-color: #e0e7ff;
    color: #1d4ed8;
}

.logout-button {
    margin-top: auto;
    background-color: #f44336;
    color: white;
    border: none;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 500;
    transition: background-color 0.2s;
}

.logout-button:hover {
    background-color: #d32f2f;
}

.main-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    width: 100%;
}

.header {
    height: 70px;
    display: flex;
    align-items: center;
    padding: 1rem;
    background-color: #ffffff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    z-index: 10;
}

.menu-toggle {
    font-size: 1.5rem;
    background: none;
    border: none;
    margin-right: 1rem;
    cursor: pointer;
    display: none;
    color: black;
}

.app-title {
    font-size: 1.2rem;
    font-weight: bold;
    color: #333;
}

.main-content {
    flex: 1;
    padding: 2rem;
    overflow-y: auto;
}

@media (max-width: 768px) {
    .sidebar {
        position: fixed;
        left: 0;
        top: 0;
        bottom: 0;
        transform: translateX(-100%);
        z-index: 30;
    }

    .sidebar.open {
        transform: translateX(0);
    }

    .menu-toggle {
        display: block;
    }

    .overlay {
        position: fixed;
        inset: 0;
        background-color: rgba(0, 0, 0, 0.4);
        z-index: 20;
    }
}
</style>
