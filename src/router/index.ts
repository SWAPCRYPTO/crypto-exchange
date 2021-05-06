import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import Tabs from "../views/Tabs.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/tabs/dashboard",
  },
  {
    path: "/tabs/",
    component: Tabs,
    children: [
      {
        path: "",
        redirect: "/tabs/dashboard",
      },
      {
        path: "dashboard",
        component: () => import("@/views/Dashboard.vue"),
      },
      {
        path: "portfolio",
        component: () => import("@/views/Portfolio.vue"),
      },
      {
        path: "prices",
        component: () => import("@/views/Prices.vue"),
      },
      {
        path: "settings",
        component: () => import("@/views/Settings.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
