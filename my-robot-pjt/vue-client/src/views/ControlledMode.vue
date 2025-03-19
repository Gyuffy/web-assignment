<script setup>
import HomeNav from "@/components/HomeNav.vue";
import AddMain from "@/components/AddMain.vue";

</script>

<template>
  <div class="root">
    <header>
      <h1>추가 하기</h1>
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

header {
  border: 1px solid black;
}

.main-container {
  display: flex;
}

nav {
  border: 1px solid black;
}

main {
  /* border: 1px solid black; */
  margin-left: 5px;
}
</style>
