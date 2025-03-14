<script setup>
import axios from "axios";
import { ref } from "vue";
import HomeNav from "@/components/HomeNav.vue";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

const SERVER_URL = import.meta.env.VITE_SERVER_URL;
const robotDatas = ref();

async function getDatas() {
  try {
    const response = await axios.get(`${SERVER_URL}/command-logs`);
    robotDatas.value = response.data;
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
}

getDatas();
</script>

<template>
  <div class="root">
    <header>
      <h1>지능모드 Intelligent Mode</h1>
    </header>
    <div class="main-container">
      <nav>
        <HomeNav />
      </nav>
      <main>
        <canvas ref="velocityChart" style="height: 40vh; width: 20vw" />
      </main>
    </div>
  </div>
</template>

<style scoped>
.root {
  width: 95vw;
  height: 95vh;
}

header {
  border: 1px solid black;
}

.main-container {
  display: flex;
}

nav {
  border: 1px solid black;
}

main {
  /* border: 1px solid black; */
  margin-left: 5px;
}

main > ul {
  display: flex;
}
</style>
