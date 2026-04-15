<template>
  <div class="p-6 max-w-3xl mx-auto">
    
    <!-- TOPIC -->
    <div class="mb-4">
      <h2 class="text-lg font-bold">Topic</h2>
      <p class="bg-gray-100 p-3 rounded">{{ topic }}</p>
    </div>

    <!-- EDITOR -->
    <EditorBlock ref="editorRef" @update:text="handleEditorChange" />

    <p class="text-sm text-gray-500 mt-2">
      Word Count: {{ wordCount }} / 350
    </p>

    <p v-if="wordCount > 0 && wordCount < 200" class="text-yellow-500">
      You need to write at least 200 words
    </p>

    <p v-if="wordCount > 350" class="text-red-500">
      You have exceeded 350 words
    </p>

    <!-- ERROR MESSAGE -->
    <p v-if="errorMessage" class="text-red-500 mt-2">
      {{ errorMessage }}
    </p>
    <!-- BUTTON -->
    <button
      @click="submitEssay"
      :disabled="loading || remaining <= 0 || wordCount < 200 || wordCount > 350"
      class="mt-4 bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
    >
      {{ loading ? "Submitting..." : "Submit" }}
    </button>
    <button
      v-if="result"
      @click="loadNextTopic"
      class="mt-4 bg-green-500 text-white px-4 py-2 rounded"
    >
      Start Next Essay
    </button>

    <!-- REMAINING -->
    <p class="text-sm text-gray-500 mt-2">
      Remaining: {{ remaining }} / 2
    </p>

    <!-- RESULT -->
    <AIResult
      v-if="result"
      :result="result"
      :highlightedText="highlightedText"
    />
    
  </div>
  
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import EditorBlock from "@/components/EditorBlock.vue";
import AIResult from "@/components/AI/AIResult.vue";
import { highlightErrors } from "@/utils/highlight";
import { getTopic, submitEssay as submitEssayApi, nextTopic } from "../../api/aiwriting";

// STATE
const remaining = ref(2);
const topic = ref("");
const result = ref(null);
const highlightedText = ref("");
const loading = ref(false);
const errorMessage = ref("");
const editorRef = ref(null);
const essayText = ref("");

const handleEditorChange = (text) => {
  essayText.value = text;
};
const wordCount = computed(() => {
  return essayText.value.trim().split(/\s+/).filter(Boolean).length;
});


const loadTopic = async () => {
  try {
    const res = await getTopic();

    topic.value = res.data.topic;
    remaining.value = 2 - (res.data.aiWriting?.dailyCount || 0);

  } catch (err) {
    const msg = err.response?.data?.message || "Load topic failed";
    errorMessage.value = msg;
  }
};

onMounted(loadTopic);

// =======================
// SUBMIT ESSAY
// =======================
const submitEssay = async () => {
  if (loading.value) return;

  errorMessage.value = "";

  try {
    loading.value = true;

    const content = await editorRef.value.saveContent();

    const text = content.blocks
      .map(b => b.data.text || "")
      .join(" ")
      .trim();

    essayText.value = text;

    // ===================
    // VALIDATE FRONTEND
    // ===================

    if (!text) {
      errorMessage.value = "Please enter your essay";
      return;
    }

    if (wordCount.value < 200) {
      errorMessage.value = "You need to write at least 200 words";
      return;
    }

    if (wordCount.value > 350) {
      errorMessage.value = "You have exceeded 350 words";
      return;
    }

    if (remaining.value <= 0) {
      errorMessage.value = "You have used all your free submissions for today";
      return;
    }

    // ===================
    // CALL API
    // ===================

    const res = await submitEssayApi(text);

    result.value = res.data;

    highlightedText.value = highlightErrors(
      text,
      res.data.errors || []
    );

    remaining.value = 2 - (res.data.aiWriting?.dailyCount || 0);

  } catch (err) {
    const data = err.response?.data;

    if (data?.errorCode === "DAILY_LIMIT") {
      errorMessage.value = "You have used all your free submissions for today";
    } else if (data?.errorCode === "WORD_LIMIT") {
      errorMessage.value = "The essay must be between 200 and 350 words";
    } else {
      errorMessage.value = "The system is busy, please try again later";
    }

    console.error("❌ SUBMIT ERROR:", data || err.message);

  } finally {
    loading.value = false;
  }
};

const loadNextTopic = async () => {
  try {
    const res = await nextTopic();

    topic.value = res.data.topic;
    remaining.value = 2 - (res.data.aiWriting?.dailyCount || 0);

    // reset UI
    result.value = null;
    highlightedText.value = "";
    essayText.value = "";

  } catch (err) {
    errorMessage.value =
      err.response?.data?.message || "Failed to load next topic";
  }
};
</script>

<style scoped>
mark {
  cursor: pointer;
  position: relative;
}

mark:hover::after {
  content: attr(title);
  position: absolute;
  bottom: -30px;
  left: 0;
  background: black;
  color: white;
  padding: 4px 8px;
  font-size: 12px;
  border-radius: 4px;
  white-space: nowrap;
}
</style>