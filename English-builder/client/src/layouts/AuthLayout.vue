<template>
    <div class="min-h-screen flex flex-col  transition-colors">
        <!-- NAVBAR -->
    <!-- NAVBAR -->
    <Navbar v-if="!route.meta.hideLayout" />

    <!-- MAIN -->
    <main class="p-6 text-gray-900 dark:text-gray-100 flex-1">
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