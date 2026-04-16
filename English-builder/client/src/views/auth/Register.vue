<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div
      class="grid w-full max-w-5xl grid-cols-1 overflow-hidden transition-all bg-white shadow-2xl md:grid-cols-2 rounded-xl dark:bg-gray-800"
    >
      <div class="relative p-10 space-y-8 bg-gradient-to-r from-blue-700 to-blue-500">
        <div class="text-center">
          <h2 class="text-4xl font-extrabold text-white">Create Account</h2>
          <p class="mt-2 text-blue-100">Join us and start learning</p>
        </div>

        <form @submit.prevent="register" class="space-y-6" novalidate>
          <div class="relative">
            <input
              v-model="form.username"
              id="username"
              type="text"
              required
              placeholder="User name"
              class="w-full h-10 text-white placeholder-transparent transition-all bg-transparent border-b-2 border-blue-200 peer focus:outline-none focus:border-white"
            />
            <label for="username" class="absolute left-0 -top-3.5 text-blue-200 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-blue-100 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-white peer-focus:text-sm">
              User name
            </label>
            <p v-if="errors.username" class="mt-1 text-xs text-red-200">
              {{ errors.username }}
            </p>
          </div>

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
            <label for="email" class="absolute left-0 -top-3.5 text-blue-200 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-blue-100 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-white peer-focus:text-sm">
              Email address
            </label>

            <div v-if="emailSuggestion" 
                 @click="applySuggestion"
                 class="absolute z-10 w-full p-3 mt-2 text-sm text-blue-800 bg-white border-l-4 border-yellow-400 rounded-md shadow-xl cursor-pointer animate-pulse">
              Did you mean: <span class="font-bold underline">{{ emailSuggestion }}</span>?
            </div>

            <p v-if="errors.email" class="mt-1 text-xs text-red-200">
              {{ errors.email }}
            </p>

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
            <label for="password" class="absolute left-0 -top-3.5 text-blue-200 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-blue-100 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-white peer-focus:text-sm">
              Password
            </label>

            <p v-if="errors.password" class="mt-1 text-xs text-red-200">
              {{ errors.password }}
            </p>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full py-2 font-bold text-blue-700 transition-all transform bg-white rounded-md shadow-lg hover:bg-blue-50 active:scale-95"
          >
            <span v-if="loading" class="text-blue-700">Processing...</span>
            <span v-else>Sign Up</span>
          </button>

          <button
            type="button"
            @click="close"
            class="absolute text-2xl transition top-5 right-5 text-white/70 hover:text-white"
          >
            ✕
          </button>

          <div v-if="errors.general" class="p-2 text-xs text-center text-red-100 border rounded bg-red-500/20 border-red-500/50">
            {{ errors.general }}
          </div>
        </form>

        <div class="text-center text-blue-100">
          Already have an account?
          <router-link
            to="/auth/login"
            class="font-semibold text-white hover:underline"
          >
            Sign in
          </router-link>
        </div>
      </div>

      <div class="flex-col items-center justify-center hidden p-10 transition-colors md:flex bg-gray-50 dark:bg-gray-900">
        <img
          src="/R2E.png"
          alt="RoadtoEnhance Logo"
          class="object-contain mb-4 w-80"
        />
        <p class="text-xs italic text-gray-400">Build your future with RoadtoEnhance</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import api from "../../api/api.js";
import { useRouter } from "vue-router";

const router = useRouter();
const error = ref("");
const loading = ref(false);

const form = reactive({
  username: "",
  email: "",
  password: "",
});

const errors = reactive({
  username: "",
  email: "",
  password: "", 
  general: ""
});

// --- SMART EMAIL LOGIC ---
const emailSuggestion = ref("");
const emailHint = ref("");

const validateEmail = () => {
  const val = form.email.toLowerCase();
  emailSuggestion.value = "";
  emailHint.value = "";

  if (!val) return;

  // Check for missing '@'
  if (!val.includes('@')) {
    if (val.length > 4) {
      emailSuggestion.value = val + "@gmail.com";
      emailHint.value = "Missing '@' symbol in your email.";
    }
  } 
  // Check for missing dot after '@'
  else if (val.includes('@') && !val.split('@')[1].includes('.')) {
    emailHint.value = "Email needs a domain (e.g., .com)";
    if (val.endsWith("gmail")) {
        emailSuggestion.value = val + ".com";
    }
  }
};

const applySuggestion = () => {
  form.email = emailSuggestion.value;
  emailSuggestion.value = "";
  emailHint.value = "";
};

const close = () => {
  router.push("/");
};

// --- REGISTER LOGIC ---
const register = async () => {
  errors.username = "";
  errors.email = "";
  errors.password = "";
  errors.general = "";
  
  // Final Manual Check (Since we used 'novalidate')
  if (!form.username) errors.username = "Username is required";
  if (!form.email) errors.email = "Email is required";
  if (!form.password) errors.password = "Password is required";

  if (errors.username || errors.email || errors.password) return;


  // Regex check for email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(form.email)) {
    errors.email = "Please provide a valid email address.";
    return;
  }

  loading.value = true;
  try {
    await api.post("/auth/register", form);
    router.push("/auth/login");
  } catch (err) {
    // Explicit English error message
    const msg = err.response?.data?.message;

    
    if (msg === "Username already exists") {
      errors.username = msg;
    } 
    else if (msg === "Email already exists") {
      errors.email = msg;
    } 
    else {
      errors.general = msg || "Registration failed";
    }
  } finally {
    loading.value = false;
  }
};
</script>