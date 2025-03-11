<script setup>
import { ref } from "vue";

const height = ref(100);
const width = ref(100);
const tmpHeight = ref(100);
const tmpWidth = ref(100);

function handleClick() {
  height.value = tmpHeight.value;
  width.value = tmpWidth.value;
}
</script>

<template>
  높이<input type="number" v-model="tmpHeight" /> 너비<input type="number" v-model="tmpWidth" />
  <button @click="handleClick">설정</button>
  <div
    :style="{
      border: '1px solid black',
      height: height + 'px',
      width: width + 'px',
    }"
  ></div>
</template>

<style scoped></style>
