<script setup>
import { ref, onMounted, watch, nextTick } from "vue";
import Chart from "chart.js/auto";
import { initSocket } from "@/socket"; // ✅ 추가

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;
const robotStatus = ref({ speed: 0, date_time: "", cur_dir: 0 });
const chartRef = ref(null);
const dirChartRef = ref(null);
let chartInstance = null;
let dirChartInstance = null;

function connectSocket() {
  const socket = initSocket(SOCKET_URL); // ✅ 전역 소켓 초기화 및 재사용

  socket.onopen = () => console.log("WebSocket Connected");
  socket.onmessage = async (event) => {
    const text = await event.data.text();
    const data = JSON.parse(text);
    robotStatus.value.speed = Number(data.speed);
    robotStatus.value.cur_dir = Number(data.cur_dir);
    robotStatus.value.date_time = data.date_time || new Date().toLocaleTimeString();
  };
  socket.onerror = (event) => console.error("WebSocket error:", event);
  // socket.onclose는 전역 연결 유지 위해 제거
}

// 차트 생성
function createChart() {
  chartInstance = new Chart(chartRef.value.getContext("2d"), {
    type: "line",
    data: {
      labels: [],
      datasets: [{
        label: "Speed",
        data: [],
        borderColor: "#4bc0c0",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
        tension: 0.4,
      }],
    },
    options: { responsive: true },
  });

  dirChartInstance = new Chart(dirChartRef.value.getContext("2d"), {
    type: "line",
    data: {
      labels: [],
      datasets: [{
        label: "Direction",
        data: [],
        borderColor: "#ff6384",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: true,
        tension: 0.4,
      }],
    },
    options: { responsive: true },
  });
}

// 차트 리셋
function resetGraph() {
  if (chartInstance && dirChartInstance) {
    chartInstance.destroy();
    dirChartInstance.destroy();

    nextTick(() => {
      createChart();
      console.log("📊 그래프가 완전히 초기화되었습니다.");
    });
  }
}

onMounted(() => {
  nextTick(() => {
    if (chartRef.value && dirChartRef.value) {
      createChart();
      connectSocket();
      window.addEventListener("resetGraph", resetGraph);
    }
  });
});

// 차트 데이터 갱신
watch(() => robotStatus.value.speed, () => {
  if (chartInstance) {
    const time = robotStatus.value.date_time;
    chartInstance.data.labels.push(time);
    chartInstance.data.datasets[0].data.push(robotStatus.value.speed);

    if (chartInstance.data.labels.length > 10) {
      chartInstance.data.labels.shift();
      chartInstance.data.datasets[0].data.shift();
    }

    chartInstance.update();
  }
});

watch(() => robotStatus.value.cur_dir, () => {
  if (dirChartInstance) {
    const time = robotStatus.value.date_time;
    dirChartInstance.data.labels.push(time);
    dirChartInstance.data.datasets[0].data.push(robotStatus.value.cur_dir);

    if (dirChartInstance.data.labels.length > 10) {
      dirChartInstance.data.labels.shift();
      dirChartInstance.data.datasets[0].data.shift();
    }

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
.chart-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 20px;
  padding: 20px;
}

.chart-wrapper {
  height: 300px;
  width: 500px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 15px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}
</style>
