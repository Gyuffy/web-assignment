<script setup>
import axios from "axios";
import { ref, onMounted, watch } from "vue";
import HomeNav from "@/components/HomeNav.vue";
import HomeAside from "@/components/HomeAside.vue";
import IntelligentMain from "@/components/IntelligentMain.vue";
import Chart from "chart.js/auto";

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
        <IntelligentMain />
      </main>
      <aside>
        <HomeAside />
      </aside>
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
  justify-content: space-between;
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

aside{
  height: 95vh;
}
</style>
