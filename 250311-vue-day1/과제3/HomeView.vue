<script setup>
import { ref } from "vue";

const btn1Text = ref("버튼1");
const btn2Text = ref("버튼2");

function handleClick() {
  btn2Text.value = "button2";
}
</script>

<template>
  <button @click="btn1Text = 'button1'">{{ btn1Text }}</button>
  <button @click="handleClick">{{ btn2Text }}</button>
</template>

<style scoped></style>
