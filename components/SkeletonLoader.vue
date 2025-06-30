<template>
  <div class="skeleton-loader">
    <div class="skeleton-row" v-for="n in 3" :key="n">
      <div class="skeleton-avatar"></div>
      <div class="skeleton-lines">
        <div class="skeleton-line w-32"></div>
        <div class="skeleton-line w-24"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No logic needed for static skeleton
</script>

<style scoped>
.skeleton-loader {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem 0;
}
.skeleton-row {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.skeleton-avatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: linear-gradient(90deg, #e0e0e0 25%, #f5f5f5 50%, #e0e0e0 75%);
  animation: skeleton-loading 1.2s infinite linear;
}
.skeleton-lines {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.skeleton-line {
  height: 0.75rem;
  border-radius: 0.375rem;
  background: linear-gradient(90deg, #e0e0e0 25%, #f5f5f5 50%, #e0e0e0 75%);
  animation: skeleton-loading 1.2s infinite linear;
}
.skeleton-line.w-32 { width: 8rem; }
.skeleton-line.w-24 { width: 6rem; }

@keyframes skeleton-loading {
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
}
</style>
