<template>
  <div>
      <h4 class="mb-2 font-semibold text-blue-700">{{ title }}</h4>

      <div v-if="!questions || questions.length === 0" class="p-2 text-sm italic text-gray-400">
        Questions will appear here once you add them to the passage. Use the form on the right to create new questions.
      </div>

      <ul v-else class="space-y-2">
        <li v-for="(q, index) in questions" :key="q._id" class="p-3 bg-white border rounded shadow-sm hover:border-blue-300">
            <p class="font-medium text-gray-800">{{ index + 1 }}. {{ q.questionText }}</p>

            <ul class="mt-1 ml-5 text-sm list-disc">
              <li v-for="opt in q.options" :key="opt" :class="opt === q.correctAnswer ? 'text-green-600 font-bold' : 'text-gray-600'">
                  {{ opt }}
              </li>
            </ul>

            <div class="flex justify-between pt-2 mt-3 text-xs text-gray-500 border-t">
              <span>Level: <b class="text-blue-600">{{ q.level }}</b></span>
              <div class="flex gap-4">
                  <button class="text-blue-600 hover:underline" @click="$emit('edit', q)"
                  title="edit question"
                  >
                      <font-awesome-icon icon="pen-to-square" /> 
                  </button>
                  <button class="text-red-500 hover:underline" @click="$emit('delete', q._id, q.passageId)"
                  title="delete question"
                  >
                      <font-awesome-icon icon="trash" /> 
                  </button>
              </div>
            </div>
        </li>
      </ul>
  </div>
</template>

<script setup>
// Sửa: Thêm default value cho props
defineProps({
  title: String,
  questions: {
    type: Array,
    default: () => []
  }
});
defineEmits(["edit", "delete"]);
</script>