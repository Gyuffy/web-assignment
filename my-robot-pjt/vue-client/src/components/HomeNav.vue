<script setup>
import { ref, watch, onMounted, nextTick } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

// 메뉴 이름과 경로 매핑
const menuRoutes = {
  Home: "/",
  Dashboard: "/dashboard",
  Settings: "/settings",
};

// 현재 경로를 추적하여 `activeMenu` 업데이트
const activeMenu = ref(
  Object.keys(menuRoutes).find((key) => menuRoutes[key] === route.path) || "Home"
);

// 메뉴 클릭 시 `router.push()`를 사용하여 페이지 이동
const setActiveMenu = async (menu) => {
  activeMenu.value = menu;
  await nextTick(); // UI 즉시 반영
  router.push(menuRoutes[menu]); // path 기반으로 이동
};

// URL 변경 시 `activeMenu` 자동 업데이트
watch(route, (newRoute) => {
  const currentPath = newRoute.path;
  activeMenu.value =
    Object.keys(menuRoutes).find((key) => menuRoutes[key] === currentPath) || "Home";
});

onMounted(() => {
  activeMenu.value =
    Object.keys(menuRoutes).find((key) => menuRoutes[key] === route.path) || "Home";
});
</script>

<template>
  <nav class="nav-container">
    <ul>
      <li
        v-for="menu in Object.keys(menuRoutes)"
        :key="menu"
        :class="{ active: activeMenu === menu }"
        @click="setActiveMenu(menu)"
      >
        <span class="icon">
          <span v-if="menu === 'Home'" class="material-symbols-outlined"> home </span>
          <span v-if="menu === 'Dashboard'" class="material-symbols-outlined"> dashboard </span>
          <span v-if="menu === 'Settings'" class="material-symbols-outlined"> settings </span>
        </span>
        <span class="text">{{ menu }}</span>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
/* 네비게이션 전체 스타일 */
.nav-container {
  width: 250px;
  height: 100vh;
  background: linear-gradient(135deg, #1e3c72, #2a5298);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 30px;
}

/* 네비게이션 리스트 스타일 */
ul {
  list-style: none;
  padding: 0;
  width: 100%;
}

li {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 15px 20px;
  color: white;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  border-radius: 8px;
  margin: 10px;
  background: rgba(255, 255, 255, 0.1);
}

li:hover {
  transform: scale(1.1);
  background: rgba(255, 255, 255, 0.3);
}

/* 활성화된 메뉴 강조 */
li.active {
  background: rgba(255, 255, 255, 0.5);
  box-shadow: 0 5px 15px rgba(255, 255, 255, 0.2);
}

/* 아이콘 스타일 */
.icon {
  margin-right: 10px;
  font-size: 20px;
}

/* 폰트 스타일 */
.text {
  flex: 1;
}
</style>

<!-- FontAwesome 아이콘 사용 -->
<!-- <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"> -->
