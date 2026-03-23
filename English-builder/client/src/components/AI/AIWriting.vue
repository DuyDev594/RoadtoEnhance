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
      class="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
    >
      Submit
    </button>

    <p class="text-sm text-gray-500">
        Remaining: {{ 2 - (user?.aiWriting?.dailyCount || 0) }} / 2
    </p>
    
    <AIResult
        v-if="result"
        :result="result"
        :highlightedText="highlightedText"
    />

  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "@/api/api";
import EditorBlock from "@/components/EditorBlock.vue";
import { highlightErrors } from "@/utils/highlight";
import AIResult from "@/components/AI/AIResult.vue";

const topic = ref("");
const result = ref(null);
const highlightedText = ref("");

const editorRef = ref(null);

// GET topic
onMounted(async () => {
  try {
    const res = await api.get("/writing/topic");
    topic.value = res.data.topic;

  } catch (err) {
    const msg = err.response?.data?.message || "Load topic failed";

    console.error("LOAD TOPIC ERROR:", msg);

    topic.value = msg; 
  }
});

// SUBMIT
const submitEssay = async () => {
  const content = await editorRef.value.saveContent();

  const text = content.blocks
    .map(b => b.data.text || "")
    .join(" ");

  const res = await api.post("/writing/submit", {
    essay: text
  });

  result.value = res.data;

  // highlight
  highlightedText.value = highlightErrors(
    text,
    res.data.errors || []
  );
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
}</style>