<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Flashcard Management</h1>

    <div class="flex gap-4 mb-6">
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


const activeClass = "bg-blue-500 text-white";
const inactiveClass = "bg-gray-200";
</script>