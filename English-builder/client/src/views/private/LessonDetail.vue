<template>
  <div class="max-w-[1800px] mx-auto p-4 lg:p-6 font-sans bg-slate-50/50 min-h-screen" v-if="lesson">
    
    <div class="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
      <div class="flex items-center gap-4">
        <button
          @click="goBack"
          class="p-2 bg-white rounded-full shadow-sm border border-slate-200 hover:text-blue-600 transition"
          title="Back"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div>
          <div class="flex items-center gap-2 mb-0.5">
            <span class="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded uppercase tracking-wider">
              {{ lesson.type }}
            </span>
            <h1 class="text-xl font-black text-slate-800 tracking-tight">{{ lesson.title }}</h1>
          </div>
          <p class="text-slate-500 text-xs font-medium">
            {{ lesson.topicId?.title || 'General English' }} • Unit {{ lesson.order || 1 }}
          </p>
        </div>
      </div>
      
      <div v-if="isCompleted" class="flex items-center text-emerald-600 font-bold bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100 text-sm">
        <span class="mr-2">✓</span> Course Completed
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      
      <div class="lg:col-span-4 sticky top-6">
        <div class="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div class="bg-black aspect-video relative group">
            <LessonPlayer 
              v-if="lesson.video?.videoId"
              :video-id="lesson.video.videoId" 
              :segments="lesson.segments" 
              :active-index="currentSegIdx"
              :segment="lesson.segments[currentSegIdx]"
              :trigger="triggerPlay"  
              @segment-end="onSegmentEnd"
            />
            <div v-else class="w-full h-full flex items-center justify-center text-slate-500 text-sm italic">
              No Video Content Available
            </div>
          </div>
          <div class="p-5 bg-gradient-to-br from-slate-50 to-white">
             <h4 class="text-slate-700 font-bold text-sm mb-2 flex items-center gap-2">
               <span class="text-blue-500">ℹ️</span> Lesson Guide
             </h4>
             <p class="text-slate-500 text-xs leading-relaxed">
               Watch the video and complete the dictation in the center panel. Use keyboard shortcuts for faster navigation.
             </p>
          </div>
        </div>
      </div>

      <div class="lg:col-span-5 space-y-6">
        <div class="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col min-h-[600px]">
          <div class="flex p-2 bg-slate-100/50 rounded-t-[2rem] border-b border-slate-100">
            <button @click="activeTab = 'study'" 
              :class="[
                'flex-1 flex items-center justify-center py-3 rounded-2xl font-bold text-sm transition-all',
                activeTab === 'study' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:bg-white/50'
              ]">
              <span class="mr-2">🎧</span> Practice Lab
            </button>
            <button @click="activeTab = 'review'" 
              :class="[
                'flex-1 flex items-center justify-center py-3 rounded-2xl font-bold text-sm transition-all',
                activeTab === 'review' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:bg-white/50'
              ]">
              <span class="mr-2">📝</span> Final Exam
            </button>
          </div>

          <div class="p-6 md:p-8 flex-1">
            <Transition mode="out-in" name="fade">
              <div :key="activeTab">
                
                <div v-if="activeTab === 'study'">
                  <div v-if="lesson.type === 'grammar'">
                    <LessonGrammar :grammar="lesson.grammar" />
                  </div>

                  <div v-else class="space-y-6">
                    <div class="flex items-center justify-between border-b border-slate-50 pb-4">
                      <h3 class="font-black text-lg text-slate-800 tracking-tight">Active Dictation</h3>
                      <div class="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full">
                        <span class="flex h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                        <span class="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                          Seg {{ currentSegIdx + 1 }} / {{ lesson.segments?.length }}
                        </span>
                      </div>
                    </div>

                    <div v-if="lesson.segments?.length > 0">
                      <LessonDictation 
                        :segment="lesson.segments[currentSegIdx]"
                        :trigger="triggerPlay"
                        @completed="onDictationDone"
                        @next="nextSeg"
                        @start="startSegment"
                      />
                    </div>
                  </div>
                </div>

                <div v-else>
                  <div class="mb-6">
                    <h3 class="font-black text-lg text-slate-800 tracking-tight">Mastery Check</h3>
                    <p class="text-slate-400 text-xs mt-1">Complete this assessment to unlock the next lesson.</p>
                  </div>
                  <LessonReview 
                    v-if="lesson.review"
                    :questions="lesson.review.questions" 
                    @completed="onReviewFinished" 
                  />
                </div>

              </div>
            </Transition>
          </div>
        </div>
      </div>

      <div class="lg:col-span-3 sticky top-6">
        <div class="flex items-center justify-between mb-4 px-2">
          <h3 class="font-black text-slate-700 uppercase text-[10px] tracking-[0.2em]">Playlist Progress</h3>
          <span class="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
            {{ completedSegs.length }}/{{ lesson.segments?.length }} Done
          </span>
        </div>
        
        <div class="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden p-2 space-y-1 max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
          <div 
            v-for="(seg, idx) in lesson.segments" :key="idx"
            @click="playSegment(idx)"
            :class="[
              'group p-3 rounded-2xl cursor-pointer transition-all flex items-center gap-3 border-2', 
              currentSegIdx === idx 
                ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
                : 'bg-white border-transparent hover:bg-slate-50 text-slate-600'
            ]"
          >
            <div :class="[
              'w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black transition-colors',
              currentSegIdx === idx ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'
            ]">
              {{ idx + 1 }}
            </div>
            
            <div class="flex-1 min-w-0">
              <p class="text-xs font-bold truncate">Segment {{ idx + 1 }}</p>
              <p :class="['text-[9px] font-medium mt-0.5', currentSegIdx === idx ? 'text-blue-100' : 'text-slate-400']">
                Duration: {{ Math.round(seg.end - seg.start) }}s
              </p>
            </div>
            
            <div v-if="completedSegs.includes(idx)" class="flex-none">
              <div class="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shadow-sm">
                <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-4 p-5 bg-amber-50 rounded-[1.5rem] border border-amber-100 shadow-sm">
          <h4 class="text-amber-800 font-bold text-xs flex items-center gap-2 mb-2">
              <span>💡</span> Tip
          </h4>
          <p class="text-amber-700/80 text-[11px] leading-relaxed">
            Listen to the video multiple times before typing.
          </p>
        </div>
      </div>

    </div>
  </div>

  <div v-else class="min-h-screen flex flex-col items-center justify-center bg-white">
      <div class="relative w-12 h-12">
        <div class="absolute inset-0 rounded-full border-4 border-slate-100"></div>
        <div class="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
      </div>
      <p class="mt-4 font-bold text-slate-400 animate-pulse tracking-widest text-[10px] uppercase">Initializing Lab...</p>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}
</style>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useLessonStore } from "@/stores/lessonStore.js";
import { useAuthStore } from "@/stores/authStore.js";
import { useRouter } from "vue-router";


// --- IMPORTANT: IMPORT YOUR COMPONENTS HERE ---
import LessonPlayer from "@/components/Lesson/LessonPlayer.vue";
import LessonDictation from "@/components/Lesson/LessonDictation.vue";
import LessonGrammar from "@/components/Lesson/LessonGrammar.vue";
import LessonReview from "@/components/Lesson/LessonReview.vue";

const router = useRouter();
const route = useRoute();
const lessonStore = useLessonStore();
const authStore = useAuthStore();
const reviewScore = ref(null)


const startSegment = () => {
  triggerPlay.value++;
};
const activeTab = ref('study');
const currentSegIdx = ref(0);
const triggerPlay = ref(0);
const completedSegs = ref([]);

const lesson = computed(() => lessonStore.currentLesson);

const playSegment = (idx) => {

  currentSegIdx.value = idx

  triggerPlay.value++

}

const isCompleted = computed(() => {
  return authStore.user?.lessonProgress?.some(
    p => String(p.lessonId) === String(lesson.value?._id) &&
    p.status === "completed"
  );
});

onMounted(async () => {

  await lessonStore.fetchLessonDetail(route.params.id)

  if (lessonStore.currentProgress) {

    reviewScore.value = lessonStore.currentProgress.score

    if (lessonStore.currentProgress.completedSegments) {
        completedSegs.value = lessonStore.currentProgress.completedSegments
    }

    if (lessonStore.currentProgress?.status === "completed") {
        activeTab.value = "review"
    }

  }

})

const nextSeg = () => {
  if (currentSegIdx.value < lesson.value.segments.length - 1) {
    currentSegIdx.value++;
  }
};

const onDictationDone = async () => {

  if (!completedSegs.value.includes(currentSegIdx.value)) {

    completedSegs.value.push(currentSegIdx.value)

    await lessonStore.saveSegmentProgress(
      lesson.value._id,
      currentSegIdx.value
    )

  }

}

const onReviewFinished = async (score) => {

  const res = await lessonStore.updateLessonProgress(
    lesson.value._id,
    score
  )

  if (score >= 80) {

    alert("Awesome! You passed the lesson.")

    // 🔥 Force UI update
    activeTab.value = "review"

  } else {

    alert(`Score: ${score}%. You need 80% to pass.`)

  }

};

const goBack = () => {
  router.back();
};

const onSegmentEnd = () => {

}

const getTabClass = (isActive) => `flex-1 px-6 py-4 font-bold transition-all text-sm uppercase tracking-wider ${isActive ? 'text-blue-600 border-b-2 border-blue-600 bg-white' : 'text-slate-400 hover:text-slate-600'}`;
</script>