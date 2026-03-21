<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
    <router-view />
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useThemeStore } from "./stores/themeStore";

const theme = useThemeStore();

onMounted(() => {
  theme.applyTheme();
});
</script>