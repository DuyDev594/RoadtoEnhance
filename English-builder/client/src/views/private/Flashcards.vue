<template>

  <div class="p-6">

    <!-- ===== TOPIC LIST ===== -->
    <div v-if="!selectedTopic">
      <h1 class="text-2xl font-bold mb-6 text-center">Flashcard Topics</h1>
      
      <div
        @click="startReview"
        class="bg-blue-600 text-white p-6 rounded-xl shadow cursor-pointer hover:scale-105 transition"
      >
        <h2 class="text-lg font-semibold mb-2">
          Review Learned Words
        </h2>

        <p class="text-base opacity-80">
          Practice vocabulary you already learned
        </p>
      </div>
<br>
      <div class="grid md:grid-cols-3 gap-6">
        <div
          v-for="topic in topics"
          :key="topic._id"
          @click="selectTopic(topic)"
          class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow cursor-pointer hover:scale-105 transition"
        >
          <h2 class="text-lg font-semibold mb-2">
            {{ topic.name }}
            </h2>

            <div class="text-base mt-2">

              <span v-if="topic.completed" class="text-green-500">
                <font-awesome-icon icon="check" class="mr-1" />
                Completed
              </span>

              <span v-else-if="topic.learnedCount > 0 || topic.reviewCount > 0" class="text-yellow-500">
                <font-awesome-icon icon="clock" class="mr-1" />
                In Progress
              </span>

              <span v-else class="text-gray-400">
                Not Started
              </span>

          </div>

          <p class="text-base text-gray-500 mt-2">
            {{ topic.description }}
          </p>
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
import { getTopics, getAdvancedVocabularies, getReviewVocabularies } from "@/api/flashcardUser"
import FlashcardSession from "@/components/Flashcard/FlashcardSession.vue"

const topics = ref([])
const selectedTopic = ref(null)

const reviewMode = ref(false)

const startReview = () => {
  selectedTopic.value = {
    _id: "review",
    name: "Review"
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
    console.log("TOPICS DATA:", res.data)
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