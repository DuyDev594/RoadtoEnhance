<template>
  <nav 
    :class="[
      'sticky top-0 z-50 transition-colors duration-300',
      blur ? 'opacity-40 pointer-events-none' : '',
      'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md text-gray-800 dark:text-gray-100 shadow-sm border-b border-gray-200/80 dark:border-gray-800'
    ]"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16 md:h-20">
        
        <!-- Left: Logo -->
        <a  
          href="javascript:void(0)"
          @click.prevent="reloadCurrentPage"
          class="flex items-center gap-2 transition-transform hover:scale-105 shrink-0"
        >
          <img
            :src="logoSrc"
            alt="RoadtoEnhance Logo"
            class="h-8 sm:h-10 lg:h-11 w-auto object-contain"
            key="logo"
          />
        </a>

        <!-- Desktop Navigation Links (md:flex) -->
        <div class="hidden md:flex items-center gap-1.5 lg:gap-2">
          <RouterLink
            to="/app/lessons"
            class="px-3.5 py-2 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200"
            active-class="!bg-blue-50 dark:!bg-blue-950/60 !text-blue-600 dark:!text-blue-400 !font-semibold border border-blue-100 dark:border-blue-800/50 shadow-xs"
          >
            Lessons
          </RouterLink>

          <RouterLink
            to="/app/flashcards"
            class="px-3.5 py-2 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200"
            active-class="!bg-blue-50 dark:!bg-blue-950/60 !text-blue-600 dark:!text-blue-400 !font-semibold border border-blue-100 dark:border-blue-800/50 shadow-xs"
          >
            Flashcards
          </RouterLink>

          <RouterLink
            to="/app/ai-writing"
            class="px-3.5 py-2 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200"
            active-class="!bg-blue-50 dark:!bg-blue-950/60 !text-blue-600 dark:!text-blue-400 !font-semibold border border-blue-100 dark:border-blue-800/50 shadow-xs"
          >
            AI Writing
          </RouterLink>
          
          <button
            @click="goToPlacementTest"
            :class="[
              'px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200',
              route.path === '/app/placement-test' 
                ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-semibold border border-blue-100 dark:border-blue-800/50 shadow-xs' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400'
            ]"
          >
            Placement Test
          </button>
        </div>

        <!-- Right Action Items -->
        <div class="flex items-center gap-3">
          <!-- Dark mode toggle button -->
          <button
            @click="theme.toggleTheme"
            class="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-all duration-300 shadow-xs active:scale-95"
            :title="theme.isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
          >
            <font-awesome-icon
              :icon="theme.isDark ? 'moon' : 'sun'"
              :class="theme.isDark ? 'text-indigo-400 text-lg' : 'text-amber-500 text-lg'"
            />
          </button>

          <!-- Desktop User Menu / Guest Login -->
          <div class="hidden md:block">
            <RouterLink
              v-if="!isAuth"
              to="/auth/login"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-blue-500/20 transition-all duration-300 hover:scale-105 active:scale-95 inline-block"
            >
              Login
            </RouterLink>

            <div v-else class="relative" ref="dropdownRef">
              <img
                :src="avatarUrl"
                @click="isDropdownOpen = !isDropdownOpen"
                class="w-9 h-9 rounded-full cursor-pointer border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all object-cover shadow-xs"
              />

              <div
                v-if="isDropdownOpen"
                class="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 shadow-xl rounded-2xl border border-gray-100 dark:border-gray-700/80 py-2 z-50 transition-all"
              >
                <div class="px-4 py-2 border-b border-gray-100 dark:border-gray-700/80 mb-1">
                  <p class="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                    {{ auth.user?.username || "User" }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {{ auth.user?.email }}
                  </p>
                </div>

                <RouterLink
                  to="/app/profile"
                  @click="isDropdownOpen = false"
                  class="block px-4 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700/60 transition-colors"
                >
                  Profile
                </RouterLink>

                <button
                  @click="logout"
                  class="w-full text-left px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>

          <!-- Mobile Hamburger Menu Button -->
          <button
            @click="isMobileMenuOpen = !isMobileMenuOpen"
            class="md:hidden p-2.5 rounded-xl text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            <font-awesome-icon :icon="isMobileMenuOpen ? 'xmark' : 'bars'" class="text-lg" />
          </button>
        </div>

      </div>
    </div>

    <!-- Mobile Drawer Menu -->
    <div
      v-if="isMobileMenuOpen"
      class="md:hidden border-t border-gray-200/80 dark:border-gray-800 bg-white/98 dark:bg-gray-900/98 backdrop-blur-md px-4 pt-3 pb-6 space-y-2 shadow-xl transition-all"
    >
      <RouterLink
        to="/app/lessons"
        @click="isMobileMenuOpen = false"
        class="block px-4 py-2.5 rounded-xl text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        active-class="!bg-blue-50 dark:!bg-blue-950/60 !text-blue-600 dark:!text-blue-400 !font-semibold border border-blue-100 dark:border-blue-800/50"
      >
        Lessons
      </RouterLink>

      <RouterLink
        to="/app/flashcards"
        @click="isMobileMenuOpen = false"
        class="block px-4 py-2.5 rounded-xl text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        active-class="!bg-blue-50 dark:!bg-blue-950/60 !text-blue-600 dark:!text-blue-400 !font-semibold border border-blue-100 dark:border-blue-800/50"
      >
        Flashcards
      </RouterLink>

      <RouterLink
        to="/app/ai-writing"
        @click="isMobileMenuOpen = false"
        class="block px-4 py-2.5 rounded-xl text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        active-class="!bg-blue-50 dark:!bg-blue-950/60 !text-blue-600 dark:!text-blue-400 !font-semibold border border-blue-100 dark:border-blue-800/50"
      >
        AI Writing
      </RouterLink>

      <button
        @click="() => { isMobileMenuOpen = false; goToPlacementTest(); }"
        :class="[
          'w-full text-left px-4 py-2.5 rounded-xl text-base font-medium transition-colors',
          route.path === '/app/placement-test' 
            ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-semibold border border-blue-100 dark:border-blue-800/50' 
            : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
        ]"
      >
        Placement Test
      </button>

      <div class="pt-3 border-t border-gray-200/80 dark:border-gray-800">
        <template v-if="!isAuth">
          <RouterLink
            to="/auth/login"
            @click="isMobileMenuOpen = false"
            class="block w-full text-center px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-xl shadow-md hover:bg-blue-700 transition-colors"
          >
            Login
          </RouterLink>
        </template>
        <template v-else>
          <div class="flex items-center gap-3 px-4 py-3 mb-2 bg-gray-50 dark:bg-gray-800/80 rounded-xl border border-gray-200/60 dark:border-gray-700/60">
            <img :src="avatarUrl" class="w-9 h-9 rounded-full border border-gray-300 dark:border-gray-600 object-cover" />
            <div class="truncate">
              <p class="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                {{ auth.user?.username || "User" }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
                {{ auth.user?.email }}
              </p>
            </div>
          </div>
          <RouterLink
            to="/app/profile"
            @click="isMobileMenuOpen = false"
            class="block px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Profile
          </RouterLink>
          <button
            @click="() => { isMobileMenuOpen = false; logout(); }"
            class="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40"
          >
            Logout
          </button>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed } from "vue";
import { useAuthStore } from "../stores/authStore.js";
import { useRouter, useRoute } from "vue-router";
import { useThemeStore } from "../stores/themeStore.js";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const theme = useThemeStore();

defineProps({
  blur: Boolean
});

const isMobileMenuOpen = ref(false);
const isDropdownOpen = ref(false);

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
  isDropdownOpen.value = false;
  auth.logout();
  router.push("/");
};

const goToPlacementTest = () => {
  if (route.path === "/app/placement-test") {
    window.location.reload();
  } else {
    router.push("/app/placement-test");
  }
};
</script>
