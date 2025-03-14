<script setup>
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <header>
    <!-- <nav>
      <ul>
        <li>
          <RouterLink to="/">Home</RouterLink>
        </li>
        <li>
          <RouterLink to="/todos">목록 보기</RouterLink>
        </li>
        <li>
          <RouterLink to="/add">추가 하기</RouterLink>
        </li>
      </ul>
    </nav> -->
  </header>

  <RouterView />
</template>

<style scoped>
</style>
