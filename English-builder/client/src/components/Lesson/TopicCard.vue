<template>
    <div
        @click="!locked && handleClick()"
        :class="[
            'group bg-white dark:bg-gray-800 rounded-xl shadow-md transition p-6 border',
            locked
            ? 'opacity-50 cursor-not-allowed pointer-events-none'
            : 'cursor-pointer hover:shadow-xl hover:border-blue-500'
        ]"
    >
        <!-- Header -->
        <div class="flex justify-between items-center mb-3">
        <span
            class="text-xs font-semibold px-3 py-1 rounded-full
            bg-blue-100 text-blue-600
            dark:bg-blue-900 dark:text-blue-300"
        >
            Level {{ topic.level }}
        </span>
        </div>

        <!-- Title -->
        <h2
        class="text-xl font-semibold text-gray-800 dark:text-white
        group-hover:text-blue-600 transition"
        >
        {{ topic.title }}
        </h2>

        <!-- Description -->
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
        {{ topic.description || "No description available." }}
        </p>

       <p v-if="locked" class="text-red-500 text-sm mt-2">
        🔒 Locked - Complete current level first
        </p>

        <!-- Action -->
        <div class="mt-6">
        <span
            class="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
        >
            Start learning →
        </span>
        </div>
    </div>
</template>

<script setup>

const { topic, locked } = defineProps({
  topic: Object,
  locked: Boolean
})

const emit = defineEmits(['select'])

const handleClick = () => {
  if (locked) return
  emit('select', topic._id)
}
</script>