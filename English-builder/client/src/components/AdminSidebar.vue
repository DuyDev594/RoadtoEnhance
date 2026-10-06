<template>
  <aside class="w-64 h-screen sticky top-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800/80 text-gray-800 dark:text-gray-100 flex flex-col justify-between shadow-sm transition-colors duration-300 overflow-y-auto">
    <div class="p-5 space-y-6">
      <div class="flex flex-col items-center py-4 border-b border-gray-100 dark:border-gray-800 relative">
        <img :src="avatarUrl" class="w-16 h-16 rounded-full border-2 border-blue-500 mb-2 shadow-md object-cover" />
        <p class="font-semibold text-gray-900 dark:text-gray-100 text-base">{{ auth.user?.username || "Admin" }}</p>
        <span class="text-xs px-2.5 py-0.5 bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50 rounded-full mt-1 font-semibold">
          Administrator
        </span>
      </div>

      <nav class="space-y-1.5">
        <RouterLink 
          v-for="item in menuItems" 
          :key="item.path"
          :to="item.path"
          @click="$emit('closeMobile')"
          class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/80 hover:text-gray-900 dark:hover:text-white font-medium text-sm"
          active-class="!bg-blue-600 !text-white shadow-md shadow-blue-500/20 font-semibold"
        >
          <font-awesome-icon :icon="item.icon" class="w-5" />
          <span>{{ item.name }}</span>
        </RouterLink>
      </nav>
    </div>

    <div class="p-5 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
      <button
        @click="logout"
        class="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/40 hover:bg-red-600 hover:text-white hover:border-red-600 dark:hover:bg-red-600 dark:hover:text-white transition-all duration-200 font-semibold text-sm shadow-xs"
      >
        <font-awesome-icon icon="right-from-bracket" />
        <span>Logout</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/authStore.js";

const emit = defineEmits(["closeMobile"]);
const auth = useAuthStore();
const router = useRouter();

const menuItems = [
  { name: 'Manage Users', path: '/admin/users', icon: 'users' },
  { name: 'Manage Placement Tests', path: '/admin/test', icon: 'spell-check' },
  { name: 'Manage Lessons', path: '/admin/lessons', icon: 'list' },
  { name: 'Manage Topics', path: '/admin/topics', icon: 'book' },
  { name: 'Manage Flashcards', path: '/admin/flashcards', icon: 'brain' },
];

const avatarUrl = computed(() =>
  `https://ui-avatars.com/api/?size=128&background=2563eb&color=fff&name=${encodeURIComponent(auth.user?.username || "Admin")}`
);

const logout = () => {
  emit("closeMobile");
  if (window.confirm("Are you sure you want to log out?")) {
    auth.logout();
    router.push("/");
  }
};
</script>