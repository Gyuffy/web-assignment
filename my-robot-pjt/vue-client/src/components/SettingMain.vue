<script setup>
import { ref } from "vue";
import { initSocket, sendMessage } from "@/socket";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;
initSocket(SOCKET_URL);

const power = ref("on");
const speed = ref(30);
const cur_dir = ref(0);
const language = ref("eng");
const neck_angle = ref(90);

function applySettings() {
  const message = {
    power: power.value,
    speed: speed.value,
    cur_dir: cur_dir.value,
    language: language.value,
    neck_angle: neck_angle.value,
    client_message: "true",
  };

  sendMessage(message);
  console.log("✅ 설정 전송됨:", message);
}
</script>

<template>
  <div class="fancy-container">
    <div class="card">
      <h2>🤖 로봇 설정 패널</h2>

      <div class="form-group">
        <label>Power:</label>
        <select v-model="power">
          <option value="on">On</option>
          <option value="off">Off</option>
        </select>
      </div>

      <div class="form-group">
        <label>Speed:</label>
        <input type="range" min="0" max="100" v-model="speed" />
        <span>{{ speed }}</span>
      </div>

      <div class="form-group">
        <label>Direction:</label>
        <input type="number" min="-100" max="100" v-model="cur_dir" />
      </div>

      <div class="form-group">
        <label>Language:</label>
        <select v-model="language">
          <option value="eng">ENG</option>
          <option value="kor">KOR</option>
        </select>
      </div>

      <div class="form-group">
        <label>Neck Angle:</label>
        <input type="number" min="0" max="180" v-model="neck_angle" />
      </div>

      <button class="apply-btn" @click="applySettings">🚀 설정 적용</button>
    </div>
  </div>
</template>

<style scoped>
.fancy-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px 20px;
  /* background: linear-gradient(to bottom right, #e0f7fa, #fce4ec); */
  width: 60vw;
  min-height: 50vh;
}

.card {
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 20px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
}

.card h2 {
  margin-bottom: 30px;
  text-align: center;
  font-size: 24px;
  color: #333;
}

.form-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.form-group label {
  flex: 1;
  font-weight: 600;
  color: #444;
}

.form-group input[type="number"],
.form-group select {
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.form-group input[type="range"] {
  flex: 1;
  margin-right: 10px;
}

.form-group span {
  width: 40px;
  text-align: right;
  font-weight: bold;
  color: #00796b;
}

.apply-btn {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  background: linear-gradient(to right, #4db6ac, #00897b);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.3s;
}

.apply-btn:hover {
  background: linear-gradient(to right, #00897b, #00695c);
}
</style>
