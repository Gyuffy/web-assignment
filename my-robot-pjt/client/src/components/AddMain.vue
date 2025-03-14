<script setup>
import { ref } from "vue";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;
const todo = ref("");

const addTodo = async () => {
  if (!todo.value || todo.value.trim() === "") {
    alert("할 일을 입력하세요");
    todo.value = "";
    return;
  }
  try {
    const response = await fetch(`${SERVER_URL}/todos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: todo.value,
        is_complete: false, // 할 일 추가 시 기본값 false
      }),
    });

    todo.value = "";
  } catch (error) {
    alert(error.message);
  }
};
</script>

<template>
  <p>할일 입력</p>
  <input type="text" v-model="todo" />
  <button @click="addTodo">추가</button>
</template>
<style scoped></style>
