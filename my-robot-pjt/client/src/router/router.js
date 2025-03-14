import { createRouter, createWebHistory } from 'vue-router';
import HomeChild from "@/components/HomeChild.vue";
import HomeTodos from '@/views/IntelligentMode.vue';
import HomeAdd from '@/views/ControlledMode.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeChild, // 기본 페이지로 HomeChild 컴포넌트가 렌더링됩니다.
  },
  {
    path: "/todos",
    name: "todos",
    component: HomeTodos,
  },
  {
    path: "/add",
    name: "add",
    component: HomeAdd,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
