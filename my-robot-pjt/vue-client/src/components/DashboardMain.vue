<script setup>
import { ref, onMounted, watch, nextTick } from "vue";
import Chart from "chart.js/auto";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;
const robotStatus = ref({ speed: 0, date_time: "", cur_dir: 0 });
const chartRef = ref(null);
const dirChartRef = ref(null);
let chartInstance = null;
let dirChartInstance = null;
let socket = null;

// WebSocket 연결 설정
function connectSocket() {
  socket = new WebSocket(SOCKET_URL);

  socket.onopen = () => console.log("WebSocket Connected");
  socket.onmessage = async (event) => {
    const text = await event.data.text();
    const data = JSON.parse(text);
    robotStatus.value.speed = Number(data.speed);
    robotStatus.value.cur_dir = Number(data.cur_dir);
    robotStatus.value.date_time = data.date_time || new Date().toLocaleTimeString();
  };
  socket.onclose = () => console.log("❌ WebSocket Disconnected");
  socket.onerror = (event) => console.error("WebSocket error:", event);
}

// 차트 생성
function createChart() {
  chartInstance = new Chart(chartRef.value.getContext("2d"), {
    type: "line",
    data: {
      labels: [],
      datasets: [{ label: "Speed", data: [], borderColor: "#4bc0c0" }],
    },
    options: { responsive: true },
  });

  dirChartInstance = new Chart(dirChartRef.value.getContext("2d"), {
    type: "line",
    data: {
      labels: [],
      datasets: [{ label: "Direction", data: [], borderColor: "#ff6384" }],
    },
    options: { responsive: true },
  });
}

// 차트 완전 초기화
function resetGraph() {
  if (chartInstance && dirChartInstance) {
    chartInstance.destroy(); // 기존 차트 제거
    dirChartInstance.destroy(); // 기존 차트 제거

    nextTick(() => {
      createChart(); // 차트 재생성
      console.log("📊 그래프가 완전히 초기화되었습니다.");
    });
  }
}

onMounted(() => {
  nextTick(() => {
    if (chartRef.value && dirChartRef.value) {
      createChart();
      connectSocket();
      window.addEventListener("resetGraph", resetGraph); // 이벤트 리스너 등록
    }
  });
});

// 데이터 업데이트
watch(() => robotStatus.value.speed, () => {
  if (chartInstance) {
    chartInstance.data.labels.push(robotStatus.value.date_time);
    chartInstance.data.datasets[0].data.push(robotStatus.value.speed);
    chartInstance.update();
  }
});

watch(() => robotStatus.value.cur_dir, () => {
  if (dirChartInstance) {
    dirChartInstance.data.labels.push(robotStatus.value.date_time);
    dirChartInstance.data.datasets[0].data.push(robotStatus.value.cur_dir);
    dirChartInstance.update();
  }
});
</script>

<template>
  <div class="chart-container">
    <div class="chart-wrapper">
      <canvas ref="chartRef"></canvas>
    </div>
    <div class="chart-wrapper">
      <canvas ref="dirChartRef"></canvas>
    </div>
  </div>
</template>

<style scoped>
/* 차트 컨테이너 스타일 */
.chart-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 20px;
  padding: 20px;
}

/* 차트 박스 스타일 */
.chart-wrapper {
  height: 300px;
  width: 500px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 15px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}
</style>
