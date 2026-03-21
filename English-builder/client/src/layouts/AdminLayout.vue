<template>
    <div class="min-h-screen flex bg-gray-100 dark:bg-gray-900 transition-colors">
        <!-- Sidebar -->
        <AdminSidebar />

        <!-- Main content -->
        <div class="flex-1 p-6">
        <router-view />
        </div>
    </div>
</template>

<script setup>
import AdminSidebar from "../components/AdminSidebar.vue";
</script>
