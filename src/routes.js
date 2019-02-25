import Vue from 'vue';
import VueRouter from 'vue-router';

import Home from './components/Home.vue';
import Workspace from './components/workspace/Workspace.vue';

Vue.use(VueRouter);

export const routes = [
    {
        path: '/',
        name: 'home',
        component: Home
    },
    {
        path: '/workspace',
        name: 'workspace',
        component: Workspace
    }
];

export const router = new VueRouter({
    mode: 'history',
    routes
})

export default router;