<script setup>
import { ref } from "vue";
const todos = ref([
  {
    id: 1,
    title: "밥먹기",
    isComplete: false,
  },
  {
    id: 2,
    title: "영화보기",
    isComplete: false,
  },
  {
    id: 3,
    title: "차마시기",
    isComplete: true,
  },
]);
</script>

<template>
  <ul>
    <template v-for="todo in todos" :key="todo.id">
      <li v-if="!todo.isComplete">{{ todo.title }}</li>
    </template>
  </ul>
</template>

<style scoped></style>
