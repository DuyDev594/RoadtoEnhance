<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center transition-colors bg-black/50 backdrop-blur-sm">
    <div
      class="grid w-full max-w-5xl grid-cols-1 overflow-hidden transition-all bg-white shadow-2xl md:grid-cols-2 rounded-xl dark:bg-gray-800"
    >
      <div class="relative p-10 space-y-8 bg-gradient-to-br from-blue-700 to-blue-500">
        <button
          type="button"
          @click="close"
          class="absolute text-2xl transition top-5 right-5 text-white/70 hover:text-white"
        >
          ✕
        </button>

        <div class="text-center">
          <h2 class="text-4xl font-extrabold tracking-tight text-white">
            Welcome Back
          </h2>
          <p class="mt-2 font-medium text-blue-100">
            Sign in to <span class="text-white underline decoration-yellow-400">RoadtoEnhance</span>
          </p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <div class="relative group">
            <input
              v-model="form.email"
              @input="validateEmail"
              id="email"
              type="text" 
              required
              placeholder="Email"
              class="w-full h-10 text-white placeholder-transparent transition-all bg-transparent border-b-2 border-blue-200 peer focus:outline-none focus:border-white"
            />
            <label
              for="email"
              class="absolute left-0 -top-3.5 text-blue-200 text-sm transition-all
                    peer-placeholder-shown:text-base
                    peer-placeholder-shown:text-blue-100
                    peer-placeholder-shown:top-2
                    peer-focus:-top-3.5
                    peer-focus:text-white
                    peer-focus:text-sm"
            >
              Email Address
            </label>

            <Transition name="fade">
              <div v-if="emailSuggestion" 
                   @click="applySuggestion"
                   class="absolute z-10 w-full p-3 mt-2 text-sm text-blue-800 bg-white border-l-4 border-yellow-400 rounded-md shadow-xl cursor-pointer animate-pulse">
                Did you mean: <span class="font-bold underline">{{ emailSuggestion }}</span>?
              </div>
            </Transition>
            
            <p v-if="emailHint" class="text-[11px] text-yellow-200 mt-1 italic font-light">
              {{ emailHint }}
            </p>
          </div>

          <div class="relative">
            <input
              v-model="form.password"
              id="password"
              type="password"
              required
              placeholder="Password"
              class="w-full h-10 text-white placeholder-transparent bg-transparent border-b-2 border-blue-200 peer focus:outline-none focus:border-white"
            />
            <label
              for="password"
              class="absolute left-0 -top-3.5 text-blue-200 text-sm transition-all
                    peer-placeholder-shown:text-base
                    peer-placeholder-shown:text-blue-100
                    peer-placeholder-shown:top-2
                    peer-focus:-top-3.5
                    peer-focus:text-white
                    peer-focus:text-sm"
            >
              Password
            </label>
          </div>

          <div class="flex items-center justify-between text-sm">
            <label class="flex items-center text-blue-100 cursor-pointer">
              <input
                v-model="remember"
                type="checkbox"
                class="w-4 h-4 text-blue-600 bg-blue-800 border-blue-300 rounded focus:ring-0"
              />
              <span class="ml-2">Remember me</span>
            </label>

            <!-- <RouterLink
              to="/auth/forgot-password"
              class="text-blue-200 transition hover:text-white hover:underline"
            >
              Forgot password?
            </RouterLink> -->
          </div>

          <Transition name="fade">
            <p v-if="error" class="p-3 text-sm text-center text-red-100 border rounded-md bg-red-500/20 border-red-500/50">
              {{ error }}
            </p>
          </Transition>

          <button
            type="submit"
            :disabled="loading"
            class="w-full py-3 font-bold tracking-wider text-blue-700 uppercase transition-all transform bg-white rounded-md shadow-lg hover:bg-blue-50 disabled:bg-blue-200 active:scale-95"
          >
            <span v-if="loading" class="flex items-center justify-center">
              <svg class="w-5 h-5 mr-3 text-blue-700 animate-spin" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
            <span v-else>Sign In</span>
          </button>
        </form>

        <div class="pt-4 text-center text-blue-100">
          Don’t have an account?
          <RouterLink
            to="/auth/register"
            class="ml-1 font-bold text-white hover:underline"
          >
            Sign up now
          </RouterLink>
        </div>
      </div>

      <div class="flex-col items-center justify-center hidden p-10 transition-colors bg-white md:flex dark:bg-gray-900">
        <img
          src="/R2E.png"
          alt="RoadtoEnhance Logo"
          class="object-contain mb-6 w-80 drop-shadow-xl"
        />
        <p class="px-10 text-sm italic text-center text-gray-400">
          "The road to excellence is always under construction."
        </p>
      </div>
    </div>

    <Transition name="modal">
      <div v-if="showPlacementModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60]">
        <div class="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-xl p-8 w-[400px] shadow-2xl">
          <div class="mb-4 text-center text-blue-600 dark:text-blue-400">
            <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
            </svg>
          </div>
          <h3 class="mb-4 text-2xl font-bold text-center">Placement Test</h3>
          <p class="mb-8 leading-relaxed text-center text-gray-600 dark:text-gray-300">
            Welcome to RoadtoEnhance! Would you like to take a quick English test to determine your level?
          </p>
          <div class="flex flex-col gap-3">
            <button @click="goToPlacementTest" class="w-full py-3 font-bold text-white transition bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700">
              Yes, Take Test Now
            </button>
            <button @click="skipPlacement" class="w-full py-3 text-gray-500 transition border border-gray-300 rounded-lg dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import api from "../../api/api.js";
import { useAuthStore } from "../../stores/authStore.js";

const router = useRouter();
const auth = useAuthStore();

// --- STATE ---
const form = reactive({
  email: "",
  password: "",
});
const remember = ref(false);
const loading = ref(false);
const error = ref("");
const showPlacementModal = ref(false);

// --- SMART EMAIL VALIDATION ---
const emailSuggestion = ref("");
const emailHint = ref("");

const validateEmail = () => {
  const val = form.email.toLowerCase();
  emailSuggestion.value = "";
  emailHint.value = "";

  if (!val) return;

  // Case: Missing '@'
  if (!val.includes('@')) {
    if (val.length > 5) {
      emailSuggestion.value = val + "@gmail.com";
      emailHint.value = "You seem to be missing the '@' symbol.";
    }
  } 
  // Case: Has '@' but missing dot (e.g., user@gmail)
  else if (val.includes('@') && !val.split('@')[1].includes('.')) {
    emailHint.value = "Domain needs a dot (e.g., .com)";
    if (val.endsWith("gmail")) {
        emailSuggestion.value = val + ".com";
    }
  }
  // Case: Common typo (gmailcom instead of gmail.com)
  if (val.includes("gmailcom")) {
      emailSuggestion.value = val.replace("gmailcom", "gmail.com");
  }
};

const applySuggestion = () => {
  form.email = emailSuggestion.value;
  emailSuggestion.value = "";
  emailHint.value = "";
};

// --- LOGIC FUNCTIONS ---
const close = () => {
  router.push("/");
};

const handleLogin = async () => {
  error.value = "";
  
  // Final regex check before API call
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(form.email)) {
    error.value = "Invalid email format. Please check for '@' and '.'";
    return;
  }

  loading.value = true;

  try {
    const res = await api.post("/auth/login", {
      ...form,
      remember: remember.value,
    });

    await auth.login(res.data.token);

    // Role-based redirection
    if (auth.user.role === "admin") {
      router.push("/admin/users");
      return;
    }

    // Check for placement test for standard users
    if (!auth.user.hasTakenPlacementTest) {
      showPlacementModal.value = true;
    } else {
      router.push("/");
    }
  } catch (err) {
    error.value = err.response?.data?.message || "Login failed. Please check your credentials.";
  } finally {
    loading.value = false;
  }
};

const goToPlacementTest = () => {
  showPlacementModal.value = false;
  router.push("/app/placement-test");
};

const skipPlacement = () => {
  showPlacementModal.value = false;
  router.push("/"); 
};
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.modal-enter-active, .modal-leave-active {
  transition: all 0.3s ease-out;
}
.modal-enter-from, .modal-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>