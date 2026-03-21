<template>
  <div class="mt-6 flex flex-col items-center">

    <!-- BACK BUTTON -->
    <button @click="$emit('exit')" class="self-start mb-4 text-blue-500">
      ← Back to topics
    </button>

    <!-- HARD NOTICE -->
    <div
      v-if="showHardNotice"
      class="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
    >
      <div class="bg-white p-10 rounded-xl text-center shadow-xl">
        <h2 class="text-3xl font-bold text-yellow-600 mb-4">
          Next words will be more difficult!
        </h2>
        <button
          @click="closeHardNotice"
          class="mt-4 bg-blue-600 text-white px-6 py-2 rounded"
        >
          Continue
        </button>
      </div>
    </div>

    <!-- COMPLETED -->
    <div
      v-if="showCompleted"
      class="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
    >
      <div class="bg-white p-10 rounded-xl text-center shadow-xl">
        <h2 class="text-3xl font-bold text-green-600 mb-4">
          You have completed this topic!
        </h2>
        <button
          @click="finishSession"
          class="mt-4 bg-green-600 text-white px-6 py-2 rounded"
        >
          Back to Topics
        </button>
      </div>
    </div>

    <!-- LOADING -->
    <div v-if="loading" class="py-10">Loading...</div>

    <!-- CARD -->
    <div v-else-if="currentCard" class="w-[420px]">

      <div class="card-container">
        <div class="card" :class="{ flipped }">

          <!-- FRONT -->
          <div class="card-face card-front">

            <img 
              v-if="currentCard.imageUrl"
              :src="currentCard.imageUrl"
              class="h-40 object-contain mb-4 mx-auto "
            />

            <p class="mb-3 text-gray-700 text-center">
              {{ currentCard.definition }}
            </p>

            <p
              v-if="maskedExample"
              class="italic text-sm text-gray-500 text-center mb-4"
            >
              {{ maskedExample }}
            </p>

            <div class="text-xl tracking-widest mb-4">
              {{ "*".repeat(currentCard.word.length) }}
            </div>

            <button
              @click="generateHint"
              class="mb-2 text-sm text-purple-600 underline"
            >
              Hint
            </button>

            <div v-if="hintWord" class="mb-4 text-lg text-purple-600">
              {{ hintWord }}
            </div>

            <input
              v-model="userAnswer"
              class="border rounded p-2 w-full mb-3 text-center"
              placeholder="Enter English word..."
              @keyup.enter="checkAnswer"
            />
            <div v-if="answerResult === 'correct'" class="text-green-600 font-semibold text-center mb-3">
              ✔ Correct
            </div>

            <div v-if="answerResult === 'incorrect'" class="text-red-600 font-semibold text-center mb-3">
              ✖ Incorrect
            </div>
            
            <div class="flex gap-2">
              <button
                @click="dontKnow"
                class="flex-1 bg-red-500 text-white py-2 rounded"
              >
                Don't Know
              </button>

              <button
                @click="checkAnswer"
                class="flex-1 bg-blue-500 text-white py-2 rounded"
              >
                Check Answer
              </button>
            </div>

          </div>

          <!-- BACK -->
          <div class="card-face card-back">

            <img
              v-if="currentCard.imageUrl"
              :src="currentCard.imageUrl"
              class="h-40 object-contain mb-4 mx-auto"
            />

            <h2 class="text-2xl font-bold mb-2">
              {{ currentCard.word }}
            </h2>

            <!-- PRONUNCIATION -->
            <div class="text-sm text-gray-500 mb-2">

              <div v-if="currentCard.pronunciation?.us?.ipa">
                US: {{ currentCard.pronunciation.us.ipa }}
                <button @click="speak('en-US')" class="ml-2">🔊</button>
              </div>

              <div v-if="currentCard.pronunciation?.uk?.ipa">
                UK: {{ currentCard.pronunciation.uk.ipa }}
                <button @click="speak('en-GB')" class="ml-2">🔊</button>
              </div>

            </div>

            <p class="mb-3 text-center">
              {{ currentCard.definition }}
            </p>

            <p
              v-if="currentCard.example"
              class="italic text-sm text-gray-500 text-center"
            >
              {{ currentCard.example }}
            </p>

            <button
              @click="nextCard"
              class="mt-4 bg-green-500 text-white px-4 py-2 rounded"
            >
              Next
            </button>

          </div>

        </div>
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import {
  getFitVocabularies,
  getAdvancedVocabularies,
  markVocabularyLearned,
  getReviewVocabularies
} from "@/api/flashcardUser"

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const props = defineProps({ topic: Object })
const emit = defineEmits(["exit", "completed"])

const fitList = ref([])
const advancedList = ref([])
const activeList = ref([])
const answerResult = ref(null) 
const currentIndex = ref(0)
const flipped = ref(false)
const loading = ref(true)
const userAnswer = ref("")
const hintWord = ref("")
const reviewList= ref([])

const showHardNotice = ref(false)
const showingAdvanced = ref(false)
const showCompleted = ref(false)

const currentCard = computed(() =>
  activeList.value[currentIndex.value]
)

/* ============================= */
/* MASK EXAMPLE                  */
/* ============================= */



const maskedExample = computed(() => {

  if (!currentCard.value?.example) return ""

  const word = currentCard.value.word

  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

  const regex = new RegExp(`\\b${escapeRegex(word)}\\b`, "gi")

  return currentCard.value.example.replace(
    regex,
    "*".repeat(word.length)
  )

})

/* ============================= */
/* LOAD CARDS                    */
/* ============================= */

const loadCards = async () => {

  loading.value = true

  try {

    // ===== REVIEW MODE =====
    if (props.topic._id === "review") {

      const reviewRes = await getReviewVocabularies()

      reviewList.value = reviewRes.data || []

      activeList.value = reviewList.value

      loading.value = false

      return
    }

    // ===== NORMAL TOPIC =====
    const fitRes = await getFitVocabularies(props.topic._id)
    const advRes = await getAdvancedVocabularies(props.topic._id)

    fitList.value = fitRes.data || []
    advancedList.value = advRes.data || []

    activeList.value = fitList.value

  } catch (err) {

    console.error("FLASHCARD LOAD ERROR:", err)

  }

  loading.value = false
}
/* ============================= */
/* ANSWER HANDLING               */
/* ============================= */

const checkAnswer = async () => {
  if (!currentCard.value) return

  const isCorrect =
    userAnswer.value.trim().toLowerCase() ===
    currentCard.value.word.toLowerCase()

  if (!isCorrect) {
    answerResult.value = "incorrect"
    return
  }

  answerResult.value = "correct"

  if (props.topic._id !== "review") {
    await markVocabularyLearned({
      vocabularyId: currentCard.value._id,
      topicId: props.topic._id,
      status: "learned"
    })
  }

  setTimeout(() => {
    flipped.value = true
    answerResult.value = null
  }, 900)
}

const dontKnow = async () => {

  if (props.topic._id !== "review") {

  await markVocabularyLearned({
    vocabularyId: currentCard.value._id,
    topicId: props.topic._id,
    status: "review"
  })

}

  flipped.value = true
}

/* ============================= */
/* NEXT CARD                     */
/* ============================= */

const nextCard = () => {
  flipped.value = false
  userAnswer.value = ""
  hintWord.value = ""

  if (currentIndex.value < activeList.value.length - 1) {
    currentIndex.value++
    return
  }

  if (!showingAdvanced.value && advancedList.value.length > 0) {
    showHardNotice.value = true
    return
  }

  showCompleted.value = true
}

const closeHardNotice = () => {
  showHardNotice.value = false
  showingAdvanced.value = true
  activeList.value = advancedList.value
  currentIndex.value = 0
}

const finishSession = () => {
  emit("completed", props.topic._id)
  emit("exit")
}

/* ============================= */
/* SPEAK                         */
/* ============================= */

const speak = (lang) => {
  const utter = new SpeechSynthesisUtterance(currentCard.value.word)
  utter.lang = lang
  speechSynthesis.speak(utter)
}

/* ============================= */
/* RANDOM HINT                   */
/* ============================= */

const generateHint = () => {
  const word = currentCard.value.word
  const revealCount = Math.floor(word.length / 2)

  const indices = []
  while (indices.length < revealCount) {
    const rand = Math.floor(Math.random() * word.length)
    if (!indices.includes(rand)) indices.push(rand)
  }

  hintWord.value = word
    .split("")
    .map((char, i) => (indices.includes(i) ? char : "*"))
    .join("")
}

onMounted(loadCards)
</script>

<style scoped>
.card-container {
  perspective: 1000px;
}
.card {
  width: 100%;
  min-height: 500px;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s;
}
.card.flipped {
  transform: rotateY(180deg);
}
.card-face {
  position: absolute;
  width: 100%;
  backface-visibility: hidden;
  background: white;
  border-radius: 16px;
  padding: 24px;
  -webkit-backface-visibility: hidden;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
}
.card-back {
  transform: rotateY(180deg);
}
</style>