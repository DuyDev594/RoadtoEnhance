<template>
    <div class="min-h-screen flex bg-slate-50 dark:bg-gray-900 text-slate-800 dark:text-gray-100 transition-colors duration-300 relative">
        <!-- Mobile Sidebar Overlay Backdrop -->
        <div 
          v-if="isMobileSidebarOpen"
          @click="isMobileSidebarOpen = false"
          class="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-sm transition-opacity"
        />

        <!-- Sidebar (Drawer on mobile, sticky/fixed on desktop) -->
        <div :class="[
          'fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 md:translate-x-0 md:static md:z-auto',
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        ]">
          <AdminSidebar @closeMobile="isMobileSidebarOpen = false" />
        </div>

        <!-- Main content area -->
        <div class="flex-1 flex flex-col min-w-0 min-h-screen">
          <!-- Top bar for Mobile toggle -->
          <div class="md:hidden flex items-center justify-between p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white shadow-xs sticky top-0 z-30 transition-colors">
            <button
              @click="isMobileSidebarOpen = !isMobileSidebarOpen"
              class="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none transition-colors"
              aria-label="Toggle Sidebar Menu"
            >
              <font-awesome-icon icon="bars" class="text-lg" />
            </button>
            <span class="font-bold text-base bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              Admin Dashboard
            </span>
            <div class="w-8"></div>
          </div>

          <!-- Page Content -->
          <main class="flex-1 p-4 sm:p-6 overflow-x-auto">
            <router-view />
          </main>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import AdminSidebar from "../components/AdminSidebar.vue";

const isMobileSidebarOpen = ref(false);
</script>
