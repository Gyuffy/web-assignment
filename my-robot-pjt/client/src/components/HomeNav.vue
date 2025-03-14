<script setup></script>

<template>
  <ul>
    <li>
      <span class="material-symbols-outlined"> home </span>
      <RouterLink to="/">Home</RouterLink>
    </li>
    <li>
      <span class="material-symbols-outlined"> rotate_auto </span>
      <RouterLink to="/intelligent">지능모드</RouterLink>
    </li>
    <li>
      <span class="material-symbols-outlined"> stadia_controller </span>
      <RouterLink to="/controlled">조종모드</RouterLink>
    </li>
  </ul>
</template>

<style scoped>
ul {
  height: 70vh;
  width: 150px;
  padding: 0;
}

ul > li {
  list-style: none;
  margin-bottom: 10px;
  border-radius: 5px;
  display: flex;
  align-items: center;
}

ul > li:hover {
  cursor: pointer;
  color: white;
  background-color: gray;
}
</style>
