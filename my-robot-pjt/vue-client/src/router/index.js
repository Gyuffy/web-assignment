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
      path: "/intelligent",
      name: "intelligent",
      component: () => import("@/views/IntelligentMode.vue"),
    },
    {
      path: "/controlled",
      name: "controlled",
      component: () => import("@/views/ControlledMode.vue"),
    },
  ],
});

export default router;
