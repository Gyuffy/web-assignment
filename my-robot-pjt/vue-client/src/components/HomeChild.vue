<script setup>
import { ref, onMounted } from "vue";
import { marked } from "marked";

const markdownContent = ref("");

// 마크다운 파일 불러오기
async function loadMarkdown() {
  try {
    const response = await fetch("/markdowns/README.md");
    const text = await response.text();
    markdownContent.value = marked(text); // 마크다운을 HTML로 변환
  } catch (error) {
    console.error("Markdown 파일을 불러오지 못했습니다:", error);
  }
}

onMounted(() => {
  loadMarkdown();
});
</script>

<template>
  <div class="markdown-container">
    <div v-html="markdownContent"></div>
  </div>
</template>

<style scoped>
.markdown-container {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.markdown-container h1 {
  color: #2a5298;
}

.markdown-container p {
  font-size: 18px;
  line-height: 1.6;
}
</style>
