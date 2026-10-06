<template>
  <div class="w-full">

    <!-- Standardized Centered Header -->
    <div class="text-center mb-8 sm:mb-12">
      <h1 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
        AI Writing Practice
      </h1>
      <p class="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-2 max-w-2xl mx-auto">
        Practice your writing with AI, get instant feedback, corrections, and level-based scores
      </p>
    </div>

    <!-- Dashboard Grid Layout -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
      
      <!-- Main Practice Action Card -->
      <div class="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/80 flex flex-col justify-between hover:shadow-md transition-all">
        <div>
          <div class="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center text-2xl mb-5">
            <font-awesome-icon icon="pen-to-square" />
          </div>
          <h2 class="text-xl font-bold mb-3 text-gray-900 dark:text-white">
            Interactive Essay Practice
          </h2>
          <p class="text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed mb-6">
            Compose essays on various topics tailored to your English level and receive real-time AI feedback.
          </p>
        </div>
        <button
          @click="router.push('/app/ai-writing/practice')"
          class="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold text-sm rounded-xl shadow-md shadow-blue-500/20 transition-all duration-200 cursor-pointer"
        >
          <span>Start Practice</span>
        </button>
      </div>

      <!-- Features Card -->
      <div class="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-2xl shadow-md text-white flex flex-col justify-between">
        <div>
          <div class="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-2xl mb-5">
            <font-awesome-icon icon="lightbulb" class="text-yellow-300" />
          </div>
          <h2 class="text-xl font-bold mb-3">
            Instant AI Evaluation
          </h2>
          <ul class="text-blue-100 text-sm sm:text-base space-y-3 mb-6">
            <li class="flex items-center gap-2.5">
              <font-awesome-icon icon="check" class="text-green-300" /> Grammar & Vocabulary Analysis
            </li>
            <li class="flex items-center gap-2.5">
              <font-awesome-icon icon="check" class="text-green-300" /> Detailed Scoring by CEFR Levels
            </li>
            <li class="flex items-center gap-2.5">
              <font-awesome-icon icon="check" class="text-green-300" /> Sentence Improvement Suggestions
            </li>
          </ul>
        </div>
        <div class="text-xs text-blue-200 font-medium">
          Powered by Advanced AI Language Models
        </div>
      </div>

    </div>

  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
const router = useRouter();
</script>