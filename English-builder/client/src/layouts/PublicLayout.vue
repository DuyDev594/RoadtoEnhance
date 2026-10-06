<template>
    <div class="min-h-screen flex flex-col transition-colors relative overflow-x-hidden bg-slate-100/70 dark:bg-gray-900">

        <!-- Overlay -->
        <div
          v-if="isAuthPage"
          class="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        />

        <Navbar :blur="isAuthPage" />

        <main class="flex-1 w-full text-gray-900 dark:text-gray-100">
          <router-view />
        </main>

        <Footer />
    </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import Navbar from "../components/Navbar.vue";
import Footer from "../components/Footer.vue";

const route = useRoute();

const isAuthPage = computed(() =>
    route.path.startsWith("/auth/")
);
</script>