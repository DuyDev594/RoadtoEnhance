<template>
  <div class="bg-white dark:bg-gray-800 p-5 rounded-xl shadow">
    <div
      v-for="(seg, index) in segments"
      :key="seg._id"
      @click="$emit('select', index)"
      class="p-3 mb-3 border rounded cursor-pointer hover:bg-blue-50"
    >
      <p class="text-sm font-medium">
        {{ display(seg, index) }}
      </p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  segments: Array,
  activeIndex: Number,
  completedSegments: Array
});

function display(seg, index) {
  if (props.completedSegments.includes(index)) {
    return seg.transcript;
  }

  return seg.transcript
    .split(" ")
    .map(w => "*".repeat(w.length))
    .join(" ");
}
</script>