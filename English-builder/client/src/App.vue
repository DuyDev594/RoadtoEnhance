<template>
  <div class="min-h-screen bg-slate-100/70 dark:bg-gray-900 text-slate-800 dark:text-gray-100 transition-colors duration-300">
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