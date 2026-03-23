<template>
  <nav 
  :class="[
    'sticky top-0 z-50 flex items-center gap-4 px-6 py-4 transition-colors duration-300',
    blur ? 'opacity-40 pointer-events-none' : '',
    'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 shadow'
  ]">
    <!-- Logo (Reload page) -->
    <a  
      href="javascript:void(0)"
      @click.prevent="reloadCurrentPage"
      class="flex items-center gap-2 mr-4 transition-transform hover:scale-105"
    >
      <img
        :src="logoSrc"
        alt="RoadtoEnhance Logo"
        class="h-8 md:h-10 lg:h-12 w-auto object-contain"
        key="logo"
      />
    </a>

    <!-- Navigation Links -->

    <RouterLink
      to="/app/lessons"
      class="px-3 py-2 rounded
            text-gray-700 dark:text-gray-200
            hover:bg-blue-600 hover:text-white
            transition"
    >
      Lessons
    </RouterLink>

    <RouterLink
      to="/app/flashcards"
      
      class="px-3 py-2 rounded
            text-gray-700 dark:text-gray-200
            hover:bg-blue-600 hover:text-white
            transition"
    >
      Flashcards
    </RouterLink>

    <RouterLink
     
      to="/app/ai-writing"
      class="px-3 py-2 rounded
            text-gray-700 dark:text-gray-200
            hover:bg-blue-600 hover:text-white
            transition"
    >
      AI Writing
    </RouterLink>
    

    <button      @click="goToPlacementTest"
      
      class="px-3 py-2 rounded
            text-gray-700 dark:text-gray-200
            hover:bg-blue-600 hover:text-white
            transition"
      
    >
      Placement Test
    </button>

    <!-- Right -->
    <div class="ml-auto relative flex items-center gap-4">
      <button
        @click="theme.toggleTheme"
        class="
          w-9 h-9 flex items-center justify-center
          rounded-full
          hover:bg-gray-200 dark:hover:bg-gray-700
          transition-all duration-300
        "
        title="Toggle background"
      >
        <font-awesome-icon
          :icon="theme.isDark ? 'moon' : 'circle'"
          class="text-orange-400 dark:text-yellow-400 text-lg"
        />
      </button>
      <!-- Guest -->
      <RouterLink
        v-if="!isAuth"
        to="/auth/login"
        class="px-4 py-2 bg-blue-600 text-white rounded
              transition-all duration-300 hover:scale-105 hover:bg-blue-700"
      >
        Login
      </RouterLink>

      <!-- User -->
      <div v-else class="relative group">
        <!-- Avatar -->
        <img
          :src="avatarUrl"
          class="w-9 h-9 rounded-full cursor-pointer border
                transition-transform duration-300 group-hover:scale-110"
        />

        <!-- Dropdown -->
        <div
          class="
            hidden group-hover:block absolute right-0 top-full mt-2
            w-40
            bg-white dark:bg-gray-800
            text-gray-800 dark:text-gray-100
            shadow rounded z-50
            transition-colors 
            before:content-[''] 
            before:absolute 
            before:w-full 
            before:h-2 
            before:-top-2 
            before:left-0
          "
        >
          <RouterLink
            to="/app/profile"
            class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Profile
          </RouterLink>

          <button
            @click="logout"
            class="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>


<script setup>
import { computed } from "vue";
import { useAuthStore } from "../stores/authStore.js";
import { useRouter } from "vue-router";
import { useThemeStore } from "../stores/themeStore.js";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { useRoute } from "vue-router";
const route = useRoute();

const router = useRouter();
const auth = useAuthStore();
const theme = useThemeStore();
defineProps({
  blur: Boolean
});
const isAuth = computed(() => auth.isAuthenticated && auth.user);

const avatarUrl = computed(() =>
  "https://ui-avatars.com/api/?size=64&name=" +
  encodeURIComponent(
    auth.user?.username ||
    auth.user?.email ||
    "User"
  )
);

const logoSrc = computed(() =>
  theme.isDark ? "/logowhite.png" : "/logo.png"
);

const reloadCurrentPage = () => {
  window.location.reload();
};

const logout = () => {
  auth.logout();
  router.push("/");
};

const goToPlacementTest = () => {
  if (route.path === "/app/placement-test") {
    // 👉 đang ở page → force reload logic
    window.location.reload();
  } else {
    router.push("/app/placement-test");
  }
};

</script>



<style scoped>
.nav-link {
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.nav-link:hover {
  background-color: #3487FF;
  color: white;
}</style>
