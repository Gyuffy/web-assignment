<script setup>
import HomeNav from "@/components/HomeNav.vue";
import AddMain from "@/components/SettingMain.vue";
import HomeHeader from "@/components/HomeHeader.vue";
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
        <AddMain />
      </main>
    </div>
  </div>
</template>

<style scoped>
.root {
  width: 95vw;
  height: 95vh;
}

.main-container {
  display: flex;
}

main {
  /* border: 1px solid black; */
  margin-left: 5px;
}
</style>
