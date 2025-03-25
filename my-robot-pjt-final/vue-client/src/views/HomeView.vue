<script setup>
import HomeChild from "@/components/HomeChild.vue";
import HomeHeader from "@/components/HomeHeader.vue";
import HomeNav from "@/components/HomeNav.vue";
</script>

<template>
  <div class="root">
    <header>
      <HomeHeader />
    </header>
    <div class="main-container">
      <nav>
        <HomeNav />
      </nav>
      <main>
        <HomeChild />
      </main>
    </div>
  </div>
</template>

<style scoped>
.root {
  width: 95vw;
  height: 95vh;
}

header {
}

.main-container {
  display: flex;
}

nav {
}

main {
  margin-left: 5px;
}
</style>
