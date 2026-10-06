<template>
    <div class="min-h-screen flex flex-col transition-colors bg-slate-100/70 dark:bg-gray-900">
      <!-- NAVBAR -->
      <Navbar v-if="!route.meta.hideLayout" />

      <!-- MAIN -->
      <main class="flex-1 w-full text-gray-900 dark:text-gray-100">
        <div v-if="route.meta.hideLayout" class="w-full">
          <router-view />
        </div>
        <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full">
          <router-view />
        </div>
      </main>

      <!-- FOOTER -->
      <Footer v-if="!route.meta.hideLayout" />
    </div>
</template>

<script setup>
import Navbar from "../components/Navbar.vue";
import Footer from "../components/Footer.vue";
import { useRoute } from "vue-router";
const route = useRoute();
</script>