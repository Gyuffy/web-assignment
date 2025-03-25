<script setup>
import { ref } from "vue";
import { initSocket, sendMessage } from "@/socket";
import axios from "axios";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;
const SERVER_URL = import.meta.env.VITE_SERVER_URL;
initSocket(SOCKET_URL);

const power = ref("on");
const speed = ref(30);
const cur_dir = ref(0);
const language = ref("eng");
const neck_angle = ref(90);
const temp_result = ref("0");

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

const loadLog = async () => {
  const res = await axios.get(`${SERVER_URL}/api/v1/command-logs/last/get`);
  console.log("불러온 데이터:", res.data);
  power.value = res.data.power;
  speed.value = Number(res.data.speed);
  cur_dir.value = Number(res.data.cur_dir);
  temp_result.value = Number(res.data.temp_result);
  neck_angle.value = Number(res.data.neck_angle);
};

const saveLog = async () => {
  const payload = {
    power: power.value,
    speed: speed.value,
    cur_dir: cur_dir.value,
    temp_result: temp_result.value,
    neck_angle: neck_angle.value,
  };
  await axios.post(`${SERVER_URL}/api/v1/command-logs`, payload);
  alert("✅ 로그가 저장되었습니다!");
};
</script>

<template>
  <div class="fancy-container">
    <div class="card">
      <h2>🤖 로봇 설정 패널</h2>

      <div class="form-group">
        <label>Power:</label>
        <select v-model="power">
          <option value="on">on</option>
          <option value="off">off</option>
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

      <div class="button-group">
        <button class="fancy-btn" @click="loadLog">📥 Log 불러오기</button>
        <button class="fancy-btn" @click="saveLog">💾 Log 저장하기</button>
      </div>
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

.button-group {
  display: flex;
  gap: 10px;
  margin-top: 20px;
  justify-content: space-between;
}

.fancy-btn {
  flex: 1;
  padding: 10px 16px;
  font-size: 15px;
  font-weight: 600;
  background: linear-gradient(to right, #64b5f6, #1976d2);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(25, 118, 210, 0.2);
}

.fancy-btn:hover {
  background: linear-gradient(to right, #1976d2, #0d47a1);
  transform: translateY(-2px);
  box-shadow: 0 6px 14px rgba(13, 71, 161, 0.3);
}
</style>
