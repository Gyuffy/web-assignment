<script setup>
import { ref } from "vue";
const color = ref("black");

function handleClick() {
  color.value = "blue";
}
</script>

<template>
  <p :style="{ color: color }">글자</p>
  <button @click="handleClick">blue</button>
</template>

<style scoped></style>
