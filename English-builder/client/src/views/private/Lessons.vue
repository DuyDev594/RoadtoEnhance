<template>
    <div class="w-full">
        <!-- Header -->
        <div class="mb-8 sm:mb-10 text-center">
          <h1 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Your Learning Topics
          </h1>
          <p class="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-2 max-w-xl mx-auto">
              Topics are selected based on your current level
          </p>
        </div>
        <div
            v-if="auth.user && !auth.user.level"
            class="mt-10 text-center"
        >
            <div class="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg max-w-md mx-auto">
                <h2 class="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                    You need to take the Placement Test
                </h2>
                <p class="text-base text-gray-600 dark:text-gray-400 mb-6">
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
        <div v-if="lessonStore.loading" class="text-center text-base text-gray-500">
        Loading topics...
        </div>

        <!-- Error -->
        <div v-if="lessonStore.error" class="text-center text-base font-medium text-red-500">
        {{ lessonStore.error }}
        </div>

        <!-- Topics -->
        <!-- CURRENT LEVEL -->
        <div v-if="lessonStore.currentTopics.length">
            <h2 class="text-xl sm:text-2xl font-bold mb-4 text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                <span class="w-2.5 h-6 bg-emerald-500 rounded-full"></span>
                Current Level: {{ lessonStore.currentLevel }}
            </h2>

            <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                <TopicCard
                    v-for="topic in lessonStore.currentTopics"
                    :key="topic._id"
                    :topic="topic"
                    @select="goToTopic"
                />
            </div>
        </div>

        <!-- NEXT LEVEL -->
        <div v-if="lessonStore.nextTopics.length" class="mt-12">
            <h2 class="text-xl sm:text-2xl font-bold mb-4 text-gray-500 dark:text-gray-400 flex items-center gap-2">
                <span class="w-2.5 h-6 bg-gray-400 rounded-full"></span>
                Next Level: {{ lessonStore.nextLevel }}
            </h2>

            <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                <TopicCard
                    v-for="topic in lessonStore.nextTopics"
                    :key="topic._id"
                    :topic="topic"
                    :locked="!lessonStore.unlockNextLevel"
                    @select="goToTopic"
                />
            </div>
        </div>

        <!-- Empty -->
        <div
            v-if="
            !lessonStore.loading &&
            lessonStore.currentTopics.length === 0 &&
            lessonStore.nextTopics.length === 0
            "
            class="text-center text-base text-gray-500"
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


import TopicCard from "@/components/Lesson/TopicCard.vue";

const lessonStore = useLessonStore();
const router = useRouter();
const auth= useAuthStore();


onMounted(() => {
    if (auth.user?.level) {
        lessonStore.fetchTopicsForUser();
    }
});

const goToTopic = (topicId) => {
    const topic = [...lessonStore.currentTopics, ...lessonStore.nextTopics]
        .find(t => t._id === topicId);

    if (
        topic.level === lessonStore.nextLevel &&
        !lessonStore.unlockNextLevel
    ) {
        alert("You need to complete current level first!");
        return;
    }

    router.push(`/app/lessons/${topicId}`);
};

const goToPlacement = () => {
    router.push("/app/placement-test");
};
</script>