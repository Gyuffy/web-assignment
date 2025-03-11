<script setup>
import { ref } from "vue";
const message = ref("hi");
</script>

<template>
  <p>{{ message }}</p>
  <button @click="message = 'bye'">bye</button>
</template>

<style scoped></style>
