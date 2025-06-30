<template>
  <div class="space-y-4">
    <ContentLoader
      v-for="i in 10"
      :key="i"
      :height="60"
      :width="'100%'"
      class="rounded-lg shadow-md border border-gray-300 bg-white"
      background-color="#e5e7eb"
      foreground-color="#444"
    >
      <!-- Checkbox -->
      <rect x="10" y="20" rx="3" ry="3" width="30" height="20" />

      <!-- ID -->
      <rect x="50" y="20" rx="3" ry="3" width="80" height="20" />

      <!-- Book Name + Avatar -->
      <circle cx="150" cy="30" r="16" />
      <rect x="180" y="18" rx="3" ry="3" width="200" height="12" />
      <rect x="180" y="34" rx="3" ry="3" width="150" height="10" />

      <!-- Author -->
      <rect x="350" y="20" rx="3" ry="3" width="300" height="16" />

      <!-- Genre -->
      <rect x="670" y="20" rx="12" ry="12" width="150" height="20" />

      <!-- Published Year -->
      <rect x="830" y="20" rx="3" ry="3" width="120" height="16" />

      <!-- Ratings -->
      <rect x="970" y="20" rx="12" ry="12" width="160" height="20" />
      <rect x="1140" y="20" rx="12" ry="12" width="150" height="20" />

      <!-- Actions -->
      <rect x="1300" y="20" rx="3" ry="3" width="50" height="24" />
    </ContentLoader>
  </div>
</template>

<script setup>
import { ContentLoader } from 'vue-content-loader'
</script>
