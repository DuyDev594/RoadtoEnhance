<template>
  <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">

    <div v-if="parsedHtml">
      <h3 class="text-lg font-semibold mb-4">
        Grammar Explanation
      </h3>

      <div
        class="prose max-w-none dark:prose-invert"
        v-html="parsedHtml"
      ></div>
    </div>

    <div v-else class="text-gray-500">
      No grammar explanation available.
    </div>

  </div>
</template>

<script setup>
import { computed } from "vue"
import editorjsHTML from "editorjs-html"

const props = defineProps({
  grammar: {
    type: Object,
    default: null
  }
})

const parser = editorjsHTML()

const parsedHtml = computed(() => {

  if (!props.grammar?.explanation) return ""

  try {

    const html = parser.parse(props.grammar.explanation)

    return html

  } catch (err) {

    console.error("EditorJS parse error:", err)
    return ""

  }

})
</script>