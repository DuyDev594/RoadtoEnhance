<template>
    <div class="min-h-screen flex flex-col  transition-colors">
        <!-- NAVBAR -->
    <!-- NAVBAR -->
    <Navbar v-if="!route.meta.hideLayout" />

    <!-- MAIN -->
    <main class="flex-1 px-6 py-8 text-gray-900 dark:text-gray-100">
      <router-view />
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