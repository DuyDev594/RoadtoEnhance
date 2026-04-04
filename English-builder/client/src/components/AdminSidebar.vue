<template>
  <aside class="w-64 h-screen sticky top-0 bg-gray-900 text-white flex flex-col justify-between shadow-xl">
    <div class="p-5 space-y-6">
      <div class="flex flex-col items-center py-4 border-b border-gray-800">
        <img :src="avatarUrl" class="w-16 h-16 rounded-full border-2 border-blue-500 mb-2 shadow-lg" />
        <p class="font-semibold text-gray-100">{{ auth.user?.username || "Admin" }}</p>
        <span class="text-xs px-2 py-1 bg-blue-900/50 text-blue-300 rounded-full mt-1">Administrator</span>
      </div>

      <nav class="space-y-2">
        <RouterLink 
          v-for="item in menuItems" 
          :key="item.path"
          :to="item.path" 
          class="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-gray-400 hover:bg-gray-800 hover:text-white"
          active-class="bg-blue-600 !text-white shadow-md shadow-blue-900/20"
        >
          <font-awesome-icon :icon="item.icon" class="w-5" />
          <span class="font-medium">{{ item.name }}</span>
        </RouterLink>
      </nav>
    </div>

    <div class="p-5 border-t border-gray-800 bg-gray-900/50">
      <button
        @click="logout"
        class="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-lg bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-600 hover:text-white transition-all duration-200 font-semibold"
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

const auth = useAuthStore();
const router = useRouter();


const menuItems = [
  { name: 'Manage Users', path: '/admin/users', icon: 'users' },
  { name: 'Manage Placement Tests', path: '/admin/test', icon: 'spell-check' },
  { name: 'Manage Lessons', path: '/admin/lessons', icon: 'list' },
  { name: 'Manage Topics', path: '/admin/topics', icon: 'book' },
  { name: 'Manage Flashcards', path: '/admin/flashcards', icon: 'brain' },
//   { name: 'Manage Videos', path: '/admin/videos', icon: 'video' },
];

const avatarUrl = computed(() =>
  `https://ui-avatars.com/api/?size=128&background=2563eb&color=fff&name=${encodeURIComponent(auth.user?.username || "Admin")}`
);

const logout = () => {
  if (window.confirm("Are you sure you want to log out?")) {
    auth.logout();
    router.push("/");
  }
};
</script>