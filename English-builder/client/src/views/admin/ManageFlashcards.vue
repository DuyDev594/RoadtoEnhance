<template>
  <div class="p-6 space-y-6">
    <h1 class="text-4xl font-bold">Flashcard Management</h1>

    <div class="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
      <button
        class="px-4 py-2 rounded"
        :class="tab === 'topics' ? activeClass : inactiveClass"
        @click="tab = 'topics'"
      >
        Topics
      </button>

      <button
        class="px-4 py-2 rounded"
        :class="tab === 'vocab' ? activeClass : inactiveClass"
        @click="tab = 'vocab'"
      >
        Vocabulary
      </button>
    </div>

    <TopicManager v-if="tab === 'topics'" />
    <VocabularyManager v-if="tab === 'vocab'" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import TopicManager from "@/components/Flashcard/FlashcardTopic.vue";
import VocabularyManager from "@/components/Flashcard/Vocabulary.vue";

const tab = ref("topics");
const errord = ref({});

const activeClass = "bg-blue-500 text-white";
const inactiveClass = "bg-gray-200";
</script>