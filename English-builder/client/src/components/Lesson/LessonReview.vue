<template>
  <div class="bg-white p-2 md:p-4 rounded-2xl">
    <div v-if="questions && questions.length > 0">
      
      <div v-if="score === null">
        <div
          v-for="(q, index) in questions"
          :key="index"
          class="mb-8 p-6 bg-slate-50 rounded-2xl border border-slate-100 transition-all hover:border-blue-200"
        >
          <div class="flex items-start gap-4">
            <span class="flex-none w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
              {{ index + 1 }}
            </span>
            <div class="flex-1">
              <p class="font-bold text-slate-800 text-lg mb-4 leading-relaxed">
                {{ q.question }}
              </p>

              <div v-if="q.type === 'multiple_choice'" class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label
                  v-for="(opt, i) in q.options"
                  :key="i"
                  :class="[
                    'flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all',
                    answers[index] === opt ? 'border-blue-500 bg-blue-50' : 'border-white bg-white hover:border-slate-200'
                  ]"
                >
                  <input
                    type="radio"
                    :name="'q'+index"
                    :value="opt"
                    v-model="answers[index]"
                    class="hidden"
                  />
                  <span :class="['w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center', answers[index] === opt ? 'border-blue-500' : 'border-slate-300']">
                    <span v-if="answers[index] === opt" class="w-2.5 h-2.5 bg-blue-500 rounded-full"></span>
                  </span>
                  <span class="font-medium text-slate-700">{{ opt }}</span>
                </label>
              </div>

              <div v-if="q.type === 'fill_blank'">
                <input
                  type="text"
                  v-model="answers[index]"
                  placeholder="Type your answer here..."
                  class="w-full px-5 py-4 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium"
                />
              </div>
            </div>
          </div>
        </div>

        <button
          @click="submitResult"
          class="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/30 transition-all transform hover:-translate-y-1"
        >
          Submit Assessment
        </button>
      </div>

      <div v-else class="text-center py-10 animate-fade-in">
        <div :class="['inline-block p-8 rounded-full mb-6', score >= 80 ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600']">
          <span class="text-5xl font-black">{{ score }}%</span>
        </div>
        <h3 class="text-2xl font-bold text-slate-800 mb-2">
          {{ score >= 80 ? 'Excellent Performance!' : 'Keep Practicing!' }}
        </h3>
        <p class="text-slate-500 mb-8">
          {{ score >= 80 ? 'You have successfully mastered this lesson.' : 'You need at least 80% to pass this lesson.' }}
        </p>
        <button 
          @click="score = null; answers = []" 
          class="px-8 py-3 border-2 border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all"
        >
          Try Again
        </button>
      </div>

    </div>

    <div v-else class="flex flex-col items-center justify-center py-20 text-slate-400">
      <svg class="w-16 h-16 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <p class="text-lg font-medium">No assessment questions found.</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

// FIX: Change 'review' to 'questions' to match the parent's prop
const props = defineProps({
  questions: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(["completed"]);

const answers = ref([]);
const score = ref(null);

function submitResult() {
  if (props.questions.length === 0) return;

  let correctCount = 0;

  props.questions.forEach((q, i) => {
    // Basic normalization for Fill Blank (trimming space and case insensitive)
    const userAnswer = (answers.value[i] || "").toString().trim().toLowerCase();
    const correctAnswer = (q.answer || "").toString().trim().toLowerCase();
    
    if (userAnswer === correctAnswer) {
      correctCount++;
    }
  });

  score.value = Math.round((correctCount / props.questions.length) * 100);
  emit("completed", score.value);
}
</script>