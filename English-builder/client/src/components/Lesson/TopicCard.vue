<template>
    <div
        class="group bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition cursor-pointer p-6 border border-transparent hover:border-blue-500"
        @click="$emit('select', topic._id)"
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
defineProps({
    topic: {
        type: Object,
        required: true
    }
});
</script>