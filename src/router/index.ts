import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import StorageService from '../services/localStorageService';
import { AuthResponse } from '../models/auth/auth.response';

import Login from '../views/login.vue';
import appLayout from '../layouts/appLayout.vue';
import transfer from '../views/transfer.vue';
import transferHistory from '../views/transferHistory.vue';
import createUser from '../views/createUser.vue';
import listUsers from '../views/listUsers.vue';

const routes: Array<RouteRecordRaw> = [
    { path: '/login', component: Login },
    {
        path: '/',
        component: appLayout,
        meta: { requiresAuth: true },
        children: [
            {
                path: '/list-users',
                component: listUsers,
                meta: { requiresAuth: true }
            },
            {
                path: '/create-user',
                component: createUser,
                meta: { requiresAuth: true }
            },
            {
                path: '/transfer',
                component: transfer,
                meta: { requiresAuth: true }
            },
            {
                path: '/transfer-history',
                component: transferHistory,
                meta: { requiresAuth: true }
            }
        ]
    }

];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to, _, next) => {
    const authData = StorageService.get<AuthResponse>('auth-data');
    if (to.meta.requiresAuth && !authData?.token) {
        next('/login');
    } else {
        next();
    }
});

export default router;
