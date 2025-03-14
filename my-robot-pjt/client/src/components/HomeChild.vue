<script setup>
import axios from "axios";
import { ref } from "vue";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;
const todos = ref();

async function getTodos() {
  try {
    const response = await axios.get(`${SERVER_URL}/todos`);
    todos.value = response.data;
    // console.log(response.data);
  } catch (error) {
    console.error(error);
  }
}

getTodos();
</script>

<template>
  <h2>메인 홈 화면</h2>
</template>

<style scoped></style>
