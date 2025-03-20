import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("@/views/HomeView.vue"),
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: () => import("@/views/DashBoard.vue"),
    },
    {
      path: "/settings",
      name: "settings",
      component: () => import("@/views/ControlledMode.vue"),
    },
  ],
});

export default router;
