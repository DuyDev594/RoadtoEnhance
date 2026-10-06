<template>

  <div class="w-full">

    <!-- ===== TOPIC LIST ===== -->
    <div v-if="!selectedTopic">
      <!-- Standardized Centered Header -->
      <div class="text-center mb-8 sm:mb-12">
        <h1 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Flashcard Topics
        </h1>
        <p class="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-2 max-w-2xl mx-auto">
          Choose a topic to practice or review your learned vocabulary
        </p>

        <!-- Review Learned Words Action Button -->
        <div class="mt-5 flex justify-center">
          <button
            @click="startReview"
            class="inline-flex items-center gap-2.5 px-5 py-3 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold text-sm rounded-xl shadow-md shadow-blue-500/20 transition-all duration-200 cursor-pointer"
            title="Review learned words"
          >
            <font-awesome-icon icon="repeat" class="text-base" />
            <span>Review Learned Words</span>
          </button>
        </div>
      </div>

      <!-- Grid of topics: 1 col on mobile, 2 on sm, 3 on lg, 4 on xl -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          v-for="topic in topics"
          :key="topic._id"
          @click="selectTopic(topic)"
          class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/80 cursor-pointer hover:-translate-y-1 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
        >
          <div>
            <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-2">
              {{ topic.name }}
            </h2>

            <p class="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 mb-4 leading-relaxed">
              {{ topic.description }}
            </p>
          </div>

          <div class="text-sm font-medium pt-3 border-t border-gray-100 dark:border-gray-700/50 flex items-center justify-between">
            <span class="text-xs text-gray-400 dark:text-gray-500">Status:</span>

            <span v-if="topic.completed" class="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full text-xs font-semibold">
              <font-awesome-icon icon="check" />
              Completed
            </span>

            <span v-else-if="topic.learnedCount > 0 || topic.reviewCount > 0" class="inline-flex items-center gap-1.5 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-full text-xs font-semibold">
              <font-awesome-icon icon="clock" />
              In Progress
            </span>

            <span v-else class="inline-flex items-center gap-1.5 text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700/50 px-2.5 py-1 rounded-full text-xs font-medium">
              Not Started
            </span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- ===== SESSION ===== -->
    <FlashcardSession
      v-else
      :topic="selectedTopic"
      @exit="selectedTopic = null"
      @completed="handleCompleted"
    />

  </div>
  
</template>

<script setup>
import { ref, onMounted } from "vue"
import { getTopics, getReviewVocabularies } from "@/api/flashcardUser"
import FlashcardSession from "@/components/Flashcard/FlashcardSession.vue"
import { useToast } from "vue-toastification"

const topics = ref([])
const selectedTopic = ref(null)
const toast = useToast()
const reviewMessage = ref("")

const startReview = async () => {
  try {
    const res = await getReviewVocabularies()

    if (!res.data || res.data.length === 0) {
      toast.warning("There are no vocabulary words we have learned to review. Please complete some lessons first!")
      return
    }

    reviewMessage.value = ""
    selectedTopic.value = {
      _id: "review",
      name: "Review"
    }

  } catch (err) {
    console.error("REVIEW ERROR:", err)
    toast.error("An error occurred while loading review data.")
  }
}

const selectTopic = (topic) => {
  selectedTopic.value = topic
}

const checkAutoReview = async () => {
  try {
    const res = await getReviewVocabularies()

    if (res.data && res.data.length > 0) {
      startReview()
      return true
    }

    return false
  } catch (err) {
    console.error("AUTO REVIEW ERROR:", err)
    return false
  }
}

const loadTopics = async () => {
  try {
    const res = await getTopics()
    topics.value = res.data
  } catch (err) {
    console.error("TOPIC ERROR:", err.response?.data || err.message)
  }
}

const handleCompleted = async () => {
  await loadTopics()       
  selectedTopic.value = null   
}

onMounted(async () => {
  const hasReview = await checkAutoReview()
  if (!hasReview) {
    await loadTopics()
  }
})
</script>