<template>
    <div class="min-h-screen flex flex-col transition-colors relative">

        <!-- Overlay -->
        <div
        v-if="isAuthPage"
        class="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        />

        <Navbar :blur="isAuthPage" />

        <main class="p-6 text-gray-900 dark:text-gray-100 flex-1">
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