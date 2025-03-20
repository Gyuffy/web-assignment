<script setup>
import { ref } from "vue";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;
const isRunning = ref(false);
const socket = new WebSocket(SOCKET_URL);

// WebSocket 이벤트 처리
socket.onopen = () => {
  console.log("Connected to the server");
};

socket.onmessage = async (event) => {
  console.log("Message from server:", await event.data.text());
};

socket.onclose = () => {
  console.log("Disconnected from the server");
};

socket.onerror = (event) => {
  console.error("WebSocket error:", event);
};

// 버튼 클릭 시 power 상태 변경 및 서버 전송
function togglePower() {
  isRunning.value = !isRunning.value;

  const message = JSON.stringify({
    power: isRunning.value ? "on" : "off",
    cur_dir: "0",
    speed: "0",
  });

  socket.send(message);
  console.log("Sent:", message);
}

// 그래프 초기화 기능 (DashboardMain.vue에서 처리)
function initializeGraph() {
  const event = new CustomEvent("resetGraph");
  window.dispatchEvent(event);
  console.log("📊 그래프가 초기화되었습니다.");
}
</script>

<template>
  <div class="aside-container">
    <button class="fancy-button" :class="{ active: isRunning }" @click="togglePower">
      <span class="text">{{ isRunning ? "STOP" : "START" }}</span>
      <span class="glow"></span>
    </button>
    <button class="fancy-button secondary" @click="initializeGraph">
      <span class="text">Initialize</span>
      <span class="glow"></span>
    </button>
  </div>
</template>

<style scoped>
.aside-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  gap: 10px;
}

/* Fancy 버튼 스타일 */
.fancy-button {
  position: relative;
  width: 120px;
  height: 50px;
  font-size: 18px;
  font-weight: bold;
  text-transform: uppercase;
  color: white;
  background: linear-gradient(135deg, #ff4d4d, #ff9900);
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(255, 77, 77, 0.3);
}

.fancy-button:hover {
  box-shadow: 0 6px 20px rgba(255, 77, 77, 0.5);
  transform: scale(1.05);
}

/* 버튼이 active (STOP) 상태일 때 */
.fancy-button.active {
  background: linear-gradient(135deg, #0084ff, #00d2ff);
  box-shadow: 0 4px 15px rgba(0, 132, 255, 0.3);
}

.fancy-button.active:hover {
  box-shadow: 0 6px 20px rgba(0, 132, 255, 0.5);
}

/* 🔥 Initialize 버튼 스타일 */
.fancy-button.secondary {
  background: linear-gradient(135deg, #4caf50, #8bc34a);
}

.fancy-button.secondary:hover {
  box-shadow: 0 6px 20px rgba(76, 175, 80, 0.5);
}

/* Glow 효과 */
.fancy-button .glow {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  border-radius: 30px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
}

.fancy-button:hover .glow {
  opacity: 1;
}

/* 버튼 안의 텍스트 */
.fancy-button .text {
  position: relative;
  z-index: 1;
}
</style>
