<template>
  <div class="max-w-5xl mx-auto p-6">
    <div class="mb-8 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <router-link to="/app/lessons" class="p-2 hover:bg-gray-100 rounded-full transition">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </router-link>
        <h1 class="text-4xl font-bold text-slate-800 tracking-tight">Curriculum Content</h1>
      </div>
    </div>

    <div v-if="lessonStore.loading" class="flex flex-col items-center justify-center py-24">
      <div class="animate-spin rounded-full h-10 w-10 border-4 border-blue-500/20 border-t-blue-500"></div>
      <p class="mt-4 text-base text-slate-400 font-medium">Fetching lessons...</p>
    </div>

    <div v-else-if="lessonStore.lessons.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div 
        v-for="lesson in sortedLessons" 
        :key="lesson._id"
        @click="handleLessonClick(lesson)"
        :class="[
          'relative p-5 rounded-2xl border-2 transition-all duration-300 flex items-center justify-between overflow-hidden',
          authStore.isLocked(lesson, lessonStore.lessons) 
            ? 'bg-slate-50 border-slate-100 cursor-not-allowed grayscale' 
            : 'bg-white border-white shadow-sm hover:border-blue-400 hover:shadow-xl cursor-pointer'
        ]"
      >
        <div v-if="authStore.isCompleted(lesson._id)" class="absolute top-0 right-0">
          <div class="bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-tighter">
            Completed
          </div>
        </div>

        <div class="flex items-center gap-4">
          <div :class="[
            'w-12 h-12 rounded-xl flex items-center justify-center transition-colors font-bold text-lg',
            authStore.isLocked(lesson, lessonStore.lessons) 
              ? 'bg-slate-200 text-slate-400' 
              : 'bg-blue-50 text-blue-600'
          ]">

            <svg 
              v-if="authStore.isLocked(lesson, lessonStore.lessons)" 
              class="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
              />
            </svg>

            <!-- Hiển thị số thứ tự lesson -->
            <span v-else>
              {{ lesson.order }}
            </span>

          </div>

          <div>
            <h3 :class="[
              'text-lg font-bold transition-colors',
              authStore.isLocked(lesson, lessonStore.lessons) 
                ? 'text-slate-400' 
                : 'text-slate-800'
            ]">
              {{ lesson.title }}
            </h3>

            <p class="text-sm font-medium uppercase tracking-widest text-slate-400">
              Order #{{ lesson.order }} • {{ lesson.type }}
            </p>
          </div>
        </div>
        
        <div class="transition-transform group-hover:translate-x-1">
          <svg v-if="authStore.isCompleted(lesson._id)" class="w-6 h-6 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
      <font-awesome-icon icon="circle-info" class="text-4xl mb-4 text-gray-600 dark:text-gray-400 " />
      <p class="text-slate-400 font-medium italic text-base">No lessons available in this module yet.</p>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useLessonStore } from "@/stores/lessonStore";
import { useAuthStore } from "@/stores/authStore";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

const route = useRoute();
const router = useRouter();
const lessonStore = useLessonStore();
const authStore = useAuthStore();

const topicId = route.params.topicId;

// Ensure lessons are always displayed in order
const sortedLessons = computed(() => {
  return [...lessonStore.lessons].sort((a, b) => a.order - b.order);
});

const loadData = async () => {
  if (topicId) await lessonStore.fetchLessonsByTopic(topicId);
};

onMounted(loadData);

watch(() => route.params.topicId, (newId) => {
  if (newId) lessonStore.fetchLessonsByTopic(newId);
}, { immediate: true });

const handleLessonClick = (lesson) => {
  // Pass cả lesson hiện tại và danh sách tất cả lessons vào getter
  const locked = authStore.isLocked(lesson, lessonStore.lessons);
  
  if (locked) {
    alert("This lesson is locked. Please pass the previous assessment first!");
    return;
  }
  router.push(`/app/lesson/${lesson._id}`);
};
</script>