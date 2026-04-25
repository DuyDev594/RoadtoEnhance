<template>
  <div class="mt-6">

    <!-- SCORE -->
    <h3 class="text-xl font-bold">
      Score: {{ result.score }} ({{ result.level }})
    </h3>

    <!-- FEEDBACK -->
    <p class="text-gray-700 mt-2">
      {{ result.feedback }}
    </p>

    <!-- GLOBAL ISSUES -->
    <div v-if="result.globalIssues?.length" class="mt-4">
      <h4 class="font-semibold text-red-500">Issues</h4>
      <ul class="list-disc ml-5 text-sm">
        <li v-for="(issue, i) in result.globalIssues" :key="i">
          {{ issue }}
        </li>
      </ul>
    </div>

    <!-- CORRECTIONS -->
    <div v-if="result.errors?.length" class="mt-4">
      <h4 class="font-semibold">Corrections</h4>
      <ul class="list-disc ml-5 text-sm">
        <li v-for="(e, i) in result.errors" :key="i">
          <font-awesome-icon icon="xmark" class="text-red-500 mr-2" />
          {{ e.original }} → <font-awesome-icon icon="check" class="text-green-500 mr-2" /> {{ e.suggestion }}
        </li>
      </ul>
    </div>

    <!-- HIGHLIGHT -->
    <div
      class="mt-4 p-4 border rounded bg-white"
      v-html="highlightedText"
    ></div>

  </div>
</template>

<script setup>
defineProps({
  result: Object,
  highlightedText: String
});
</script>