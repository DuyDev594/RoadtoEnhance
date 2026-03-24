<template>
  <div class="p-6 max-w-3xl mx-auto">

    <!-- TOPIC -->
    <div class="mb-4">
      <h2 class="text-lg font-bold">Topic</h2>
      <p class="bg-gray-100 p-3 rounded">{{ topic }}</p>
    </div>

    <!-- EDITOR -->
    <EditorBlock ref="editorRef" />

    <!-- BUTTON -->
    <button
      @click="submitEssay"
      :disabled="loading || remaining <= 0"
      class="mt-4 bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
    >
      {{ loading ? "Submitting..." : "Submit" }}
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
import { ref, onMounted } from "vue";
import EditorBlock from "@/components/EditorBlock.vue";
import AIResult from "@/components/AI/AIResult.vue";
import { highlightErrors } from "@/utils/highlight";

// ✅ dùng API mới
import { getTopic, submitEssay as submitEssayApi } from "@/api/aiWriting";

// STATE
const remaining = ref(2);
const topic = ref("");
const result = ref(null);
const highlightedText = ref("");
const loading = ref(false);

const editorRef = ref(null);

// =======================
// LOAD TOPIC
// =======================
const loadTopic = async () => {
  try {
    const res = await getTopic();

    topic.value = res.data.topic;
    remaining.value = 2 - (res.data.aiWriting?.dailyCount || 0);

  } catch (err) {
    const msg = err.response?.data?.message || "Load topic failed";

    console.error("❌ LOAD TOPIC ERROR:", msg);
    topic.value = msg;
  }
};

onMounted(loadTopic);

// =======================
// SUBMIT ESSAY
// =======================
const submitEssay = async () => {
  if (loading.value) return;

  try {
    loading.value = true;

    const content = await editorRef.value.saveContent();

    const text = content.blocks
      .map(b => b.data.text || "")
      .join(" ");

    if (!text.trim()) {
      alert("Essay is empty!");
      return;
    }

    const res = await submitEssayApi(text);

    // RESULT
    result.value = res.data;

    // 🔥 HIGHLIGHT LỖI
    highlightedText.value = highlightErrors(
      text,
      res.data.errors || []
    );

    // UPDATE REMAINING
    remaining.value = 2 - (res.data.aiWriting?.dailyCount || 0);

  } catch (err) {
    console.error("❌ SUBMIT ERROR:", err.response?.data || err.message);
  } finally {
    loading.value = false;
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