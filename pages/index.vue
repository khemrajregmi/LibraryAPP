<template>
  <div class="layout">
    <AppHeader />
    <main class="body">
      <p>Welcome to the Library App!</p>
    </main>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import AppHeader from '~/components/AppHeader.vue';
import AppFooter from '~/components/AppFooter.vue';
</script>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.body {
  flex: 1;
  padding: 2rem;
  background: #f9f9f9;
}
}
</style>
