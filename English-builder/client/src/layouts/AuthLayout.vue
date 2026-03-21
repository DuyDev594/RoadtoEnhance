<template>
    <div class="min-h-screen flex flex-col  transition-colors">
        <Navbar />

        <main class="p-6 text-gray-900 dark:text-gray-100 flex-1">
        <router-view />
        </main>

        <Footer />
    </div>
</template>

<script setup>
import Navbar from "../components/Navbar.vue";
import Footer from "../components/Footer.vue";
</script>