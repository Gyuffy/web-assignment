<script setup>
import { ref } from "vue";

const number = ref("0");

function handleClick(newNumber) {
  number.value = newNumber;
}
</script>

<template>
  <p>{{ number }}</p>
  <button @click="handleClick('3')">3</button>
  <button @click="handleClick('6')">6</button>
  <button @click="handleClick('9')">9</button>
</template>

<style scoped></style>
