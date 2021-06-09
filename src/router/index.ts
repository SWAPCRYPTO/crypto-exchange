import { createRouter, createWebHistory } from '@ionic/vue-router'
import { RouteRecordRaw } from 'vue-router'
import WelcomeScreen from '@/views/authentication/WelcomeScreen.vue'
import Tabs from '../views/Tabs.vue'
import AuthGuard from './authGuard'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        component: WelcomeScreen,
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
            {
                path: 'asset/:symbol',
                component: () => import('@/views/AssetPage.vue'),
            },
            {
                path: 'asset/:symbol/history',
                component: () => import('@/views/AssetHistory.vue'),
            },
        ],
    },
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
})

export default router
