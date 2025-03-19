<script setup></script>

<template>
  <div class="aside-root">
    <div class="btn-container">
      <button>Initialize</button>
      <br />
      <button @click="toggleRunning">{{ isRunning ? "STOP" : "START" }}</button>
    </div>
    <br />z
    <div class="radio-cont">
      <input type="radio" name="serial" />115200 <input type="radio" name="serial" />38400
    </div>
  </div>
</template>

<style scoped>
.aside-root {
  border: 1px solid black;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100px;
  height: 70vh;
}

.aside-root > .btn-container > button {
  width: 80px;
  height: 30px;
  background-color: black;
  color: white;
  margin-top: 5px;
}

.aside-root > .btn-container > button:hover {
  cursor: pointer;
  background-color: gray;
}
</style>
