<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

// 현재 경로에 따라 헤더 문구 동적으로 변경
const headerTitle = computed(() => {
  switch (route.path) {
    case "/":
      return "🤖 지능형 휴머노이드 UI";
    case "/dashboard":
      return "📊 대시보드";
    case "/settings":
      return "⚙️ 설정";
    default:
      return "🚀 로봇 시스템";
  }
});
</script>

<template>
  <header class="header-container">
    <h1 class="title">{{ headerTitle }}</h1>
  </header>
</template>

<style scoped>
.header-container {
  width: 100%;
  height: 80px;
  background: linear-gradient(135deg, #1e3c72, #2a5298, #6a11cb);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  top: 0;
  left: 0;
  z-index: 1000;
}

.title {
  font-size: 28px;
  font-weight: bold;
  color: white;
  text-transform: uppercase;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.7), 0 0 20px rgba(255, 255, 255, 0.5);
  letter-spacing: 2px;
  animation: fadeIn 1.2s ease-in-out;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .title {
    font-size: 22px;
    letter-spacing: 1px;
  }
}
</style>
