<script setup>
import { ref, onMounted, watch } from "vue";
import Chart from "chart.js/auto";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

const robotStatus = ref({ speed: 0, date_time: "" });
const chartRef = ref(null);
const dirChartRef = ref(null);
let chartInstance = null;
let dirChartInstance = null;
let socket = null;
let intervalId = null;
const isRunning = ref(false); // STOP 버튼을 누르면 false로 변경

// WebSocket 연결 설정
function connectSocket() {
  socket = new WebSocket(SOCKET_URL);

  socket.onopen = () => {
    console.log("Connected to the server");
  };

  socket.onmessage = async (event) => {
    const text = await event.data.text();
    const data = JSON.parse(text);

    data.speed = Number(data.speed);
    data.date_time = data.date_time || new Date().toLocaleTimeString();

    robotStatus.value = data;
  };

  socket.onclose = () => {
    console.log("Disconnected from the server");
  };

  socket.onerror = (event) => {
    console.error("WebSocket error:", event);
  };
}

// 차트 생성
function createChart() {
  const ctx = chartRef.value.getContext("2d");
  return new Chart(ctx, {
    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          label: "Robot Speed",
          data: [],
          borderColor: `rgb(75, 192, 192)`,
          tension: 0.1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });
}

function createDirChart() {
  const ctx = dirChartRef.value.getContext("2d");
  return new Chart(ctx, {
    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          label: "Robot Dir",
          data: [],
          borderColor: `rgb(139, 0, 0)`,
          tension: 0.1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });
}

// 차트 업데이트
function updateChart() {
  if (!chartInstance) return;

  const speed = robotStatus.value.speed;
  const time = robotStatus.value.date_time;

  if (chartInstance.data.labels.length > 10) {
    chartInstance.data.labels.shift();
    chartInstance.data.datasets[0].data.shift();
  }

  chartInstance.data.labels.push(time);
  chartInstance.data.datasets[0].data.push(speed);
  chartInstance.update();
}

// cur_dir 차트 업데이트
function updateDirChart() {
  if (!dirChartInstance) return;

  const curDir = robotStatus.value.cur_dir;
  const time = robotStatus.value.date_time;

  if (dirChartInstance.data.labels.length > 10) {
    dirChartInstance.data.labels.shift();
    dirChartInstance.data.datasets[0].data.shift();
  }

  dirChartInstance.data.labels.push(time);
  dirChartInstance.data.datasets[0].data.push(curDir);
  dirChartInstance.update();
}

// STOP 버튼 기능
function toggleRunning() {
  if (isRunning.value) {
    // STOP 상태로 변경
    isRunning.value = false;
    clearInterval(intervalId); // 랜덤 전송 중지

    const message = JSON.stringify({
      speed: 0,
      cur_dir: 0,
      power: "off",
    });

    socket.send(message);
  } else {
    // START 상태로 변경
    isRunning.value = true;
    const message = JSON.stringify({
      speed: 0,
      cur_dir: 0,
      power: "on",
    });

    socket.send(message);
  }
}

onMounted(() => {
  if (chartRef.value) {
    chartInstance = createChart();
  }
  if (dirChartRef.value) {
    dirChartInstance = createDirChart();
  }
  connectSocket();
});

watch(
  () => robotStatus.value.speed,
  () => {
    if (chartInstance) {
      updateChart();
    }
  }
);

watch(
  () => robotStatus.value.cur_dir,
  () => {
    if (dirChartInstance) {
      updateDirChart();
    }
  }
);
</script>

<template>
  <div class="main-container">
    <div class="cam-container">
      <div class="cam1">cam1</div>
      <div class="cam2">cam2</div>
    </div>
    <div class="binary-container">
      <div class="binary1">binary1</div>
      <div class="binary2">binary2</div>
    </div>
    <div class="chart-wrapper">
      <canvas ref="chartRef"></canvas>
      <canvas ref="dirChartRef"></canvas>
    </div>
  </div>
</template>

<style scoped>
.main-container {
  display: flex;
  flex-wrap: wrap;
}

.cam-container > div {
  border: 1px solid black;
  height: 300px;
  width: 300px;
}

.binary-container > div {
  border: 1px solid black;
  height: 300px;
  width: 300px;
}

aside > .btn-container > button {
  width: 80px;
  height: 30px;
  background-color: black;
  color: white;
  margin-top: 5px;
}

aside > .btn-container > button:hover {
  cursor: pointer;
  background-color: gray;
}

.chart-wrapper {
  height: 300px;
  width: 300px;
}
</style>
