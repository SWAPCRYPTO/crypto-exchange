import { createRouter, createWebHistory } from '@ionic/vue-router'
import { RouteRecordRaw } from 'vue-router'
import Tabs from '../views/Tabs.vue'
import AuthGuard from './authGuard'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        redirect: '/authentication',
    },
    {
        path: '/authentication',
        component: () => import('@/views/authentication/Authentication.vue'),
    },
    {
        path: '/tabs/',
        component: Tabs,
        beforeEnter: AuthGuard,
        children: [
            {
                path: '',
                redirect: '/tabs/dashboard',
            },
            {
                path: 'dashboard',
                component: () => import('@/views/Dashboard.vue'),
            },
            {
                path: 'portfolio',
                component: () => import('@/views/Portfolio.vue'),
            },
            {
                path: 'prices',
                component: () => import('@/views/Prices.vue'),
            },
            {
                path: 'settings',
                component: () => import('@/views/Settings.vue'),
            },
        ],
    },
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
})

export default router
