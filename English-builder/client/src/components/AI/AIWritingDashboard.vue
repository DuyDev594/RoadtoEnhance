<template>
  <div class="p-6 max-w-4xl mx-auto">

    <h1 class="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">
      AI Writing Practice
    </h1>

    <!-- START CARD -->
    <div class=" p-6 rounded-xl shadow  ">
      <h2 class="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
        Practice your writing with AI
      </h2>

      <p class="text-gray-600 mb-4 text-sm dark:text-gray-300">
        Get instant feedback, corrections, and score based on your level.
      </p>

      <button
        @click="router.push('/app/ai-writing/practice')"
        class="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Start Writing
      </button>
    </div>

  </div>
</template>
<script setup>
import { ref } from "vue";
import {useRouter} from "vue-router";
const router = useRouter();

</script>