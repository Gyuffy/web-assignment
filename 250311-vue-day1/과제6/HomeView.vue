<script setup>
import { ref } from "vue";

const MY_PASSWORD = "1234";
const password = ref();

const members = ref([
  {
    id: 1,
    name: "이정민",
    position: "정보부장",
  },
  {
    id: 2,
    name: "강필규",
    position: "인사과장",
  },
  {
    id: 3,
    name: "여설하",
    position: "경호팀장",
  },
]);
</script>

<template>
  <template v-if="password !== MY_PASSWORD">
    <p>암호를 입력하세요</p>
    <input type="password" v-model="password" />
  </template>
  <ul v-if="password === MY_PASSWORD">
    <template v-for="member in members" :key="member.id">
      <li>
        이름: {{ member.name }} <br />
        직책: {{ member.position }}
      </li>
    </template>
  </ul>
</template>

<style scoped></style>
