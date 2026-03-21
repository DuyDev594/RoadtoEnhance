<template>
    <div class="min-h-screen px-6 py-10 bg-gray-100 dark:bg-gray-900">
        <!-- Header -->
        <div class="mb-10 text-center">
        <h1 class="text-3xl font-bold text-gray-800 dark:text-white">
            Your Learning Topics
        </h1>
        <p class="mt-2 text-gray-600 dark:text-gray-300">
            Topics are selected based on your current level
        </p>
        </div>
        <div
            v-if="auth.user && !auth.user.level"
            class="mt-10 text-center"
        >
            <div class="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg max-w-md mx-auto">
                <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                    You need to take the Placement Test
                </h2>
                <p class="text-gray-600 dark:text-gray-300 mb-6">
                    We need to determine your English level before showing lessons.
                </p>
                <button
                    @click="goToPlacement"
                    class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    Take Placement Test
                </button>
            </div>
        </div>

        <!-- Loading -->
        <div v-if="lessonStore.loading" class="text-center text-gray-500">
        Loading topics...
        </div>

        <!-- Error -->
        <div v-if="lessonStore.error" class="text-center text-red-500 font-medium">
        {{ lessonStore.error }}
        </div>

        <!-- Topics -->
        <div
            v-if="auth.user?.level && !lessonStore.loading && lessonStore.topics.length"
            class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
        <TopicCard
            v-for="topic in lessonStore.topics"
            :key="topic._id"
            :topic="topic"
            @select="goToTopic"
        />
        </div>

        <!-- Empty -->
        <div
        v-if="!lessonStore.loading && lessonStore.topics.length === 0"
        class="text-center text-gray-500"
        >
        No topics available for your level yet.
        </div>
    </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useLessonStore } from "@/stores/lessonStore";
import { useAuthStore } from "@/stores/authStore";


import TopicCard from "@/components/lesson/TopicCard.vue";

const lessonStore = useLessonStore();
const router = useRouter();
const auth= useAuthStore();


onMounted(() => {
    if (auth.user?.level) {
        lessonStore.fetchTopics();
    }
});

const goToTopic = (topicId) => {
    router.push(`/app/lessons/${topicId}`);
};

const goToPlacement = () => {
    router.push("/app/placement-test");
};
</script>