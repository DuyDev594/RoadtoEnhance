<template>
    <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow space-y-6">

        <textarea
            v-model="input"
            @input="check"
            class="w-full border rounded p-3"
            rows="3"
            placeholder="Type what you hear..."
        />

        <!-- MASKED TRANSCRIPT BOX -->
        <div class="p-4 bg-gray-100 rounded text-lg font-medium flex flex-wrap gap-2">

            <span
                v-for="(word, i) in words"
                :key="i"
                class="px-2 py-1 rounded transition"
                :class="{
                'bg-gray-300 text-gray-500': wordStates[i]?.status === 'hidden',
                'bg-green-200 text-green-800': wordStates[i]?.status === 'correct',
                'bg-red-200 text-red-700': wordStates[i]?.status === 'wrong',
                'bg-yellow-200 text-yellow-800': wordStates[i]?.status === 'hint'
                }"
            >
                {{
                wordStates[i]?.status === 'hidden' ||
                wordStates[i]?.status === 'wrong'
                    ? '*'.repeat(word.length)
                    : word
                }}
            </span>

        </div>

        <div class="flex gap-3">
            <!-- <button @click="$emit('replay')">Replay</button> -->
            <button @click="reveal">Reveal Word</button>
            <button v-if="completed" @click="$emit('next')">Next →</button>
        </div>

        </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";

const props = defineProps({
  segment: Object
});

const emit = defineEmits(["completed", "replay", "next"]);

const input = ref("");
const wordStates = ref([]);
const completed = ref(false);

const words = computed(() =>
  props.segment?.transcript
    ? props.segment.transcript.split(" ")
    : []
);

watch(
  () => props.segment,
  () => {
    input.value = "";
    wordStates.value = words.value.map(() => ({
      status: "hidden"
    }));
    completed.value = false;
  },
  { immediate: true }
);

function normalize(text) {
  return text.toLowerCase().replace(/[.,!?]/g, "");
}

function check() {
  const userWords = normalize(input.value)
    .split(" ")
    .filter(Boolean);

  words.value.forEach((word, i) => {
    if (!userWords[i]) {
      wordStates.value[i].status = "hidden";
      return;
    }

    if (normalize(userWords[i]) === normalize(word)) {
      wordStates.value[i].status = "correct";
    } else {
      wordStates.value[i].status = "wrong";
    }
  });

  completed.value = wordStates.value.every(
    w => w.status === "correct" || w.status === "hint"
  );

  if (completed.value) {
    emit("completed");
  }
}

function reveal() {
  const nextIndex = wordStates.value.findIndex(
    w => w.status === "hidden" || w.status === "wrong"
  );

  if (nextIndex !== -1) {
    wordStates.value[nextIndex].status = "hint";
  }
}
</script>