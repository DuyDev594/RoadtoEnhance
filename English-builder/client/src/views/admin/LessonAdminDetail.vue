<template>
  <div class="p-6 max-w-5xl mx-auto space-y-6" v-if="lesson">
    <div class="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Lesson Format</h1>
        <p class="text-sm text-gray-500 uppercase font-semibold">Type: {{ lesson.type }}</p>
      </div>
      <button class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition" @click="saveAll">
        Save Lesson
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="card p-5 bg-white rounded-xl shadow">
        <h2 class="font-bold mb-4 border-b pb-2">Lesson Information</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Title</label>
            <input v-model="lesson.title" class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Order of this lesson</label>
            <input type="number" v-model.number="lesson.order" class="w-full border rounded-lg px-3 py-2" />
          </div>
        </div>
      </div>

      <div class="card p-5 bg-white rounded-xl shadow">
        <h2 class="font-bold mb-4 border-b pb-2">Video (YouTube)</h2>
        <div>
          <label class="block text-sm font-medium mb-1">Copy link YouTube or ID</label>
          <input v-model="videoInput" placeholder="https://www.youtube.com/watch?v=..." class="w-full border rounded-lg px-3 py-2 border-blue-300 focus:border-blue-500" />
          <p class="text-xs text-gray-400 mt-2 italic">The system ID is obtained from the YouTube link: {{ lesson.video.videoId }}</p>
        </div>
      </div>
    </div>

    <div v-if="lesson.type === 'video'" class="card p-5 bg-white rounded-xl shadow space-y-4">
      <div class="flex justify-between items-center">
        <h2 class="font-bold">Segment Lists </h2>
        <button @click="addSegment" class="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-md hover:bg-green-200">
          Add Segment
        </button>
      </div>
      <div v-for="(seg, idx) in segments" :key="idx" class="border rounded-lg p-4 bg-gray-50 space-y-3 relative">
        <button @click="removeSegment(idx)" class="absolute top-2 right-2 text-red-500 hover:text-red-700">✕</button>
        <textarea v-model="seg.transcript" placeholder="Nội dung lời thoại..." class="w-full border rounded p-2 text-sm" rows="2"></textarea>
        <div class="flex gap-4">
          <input type="number" v-model.number="seg.start" placeholder="Bắt đầu (s)" class="w-24 border rounded px-2 py-1 text-sm" />
          <input type="number" v-model.number="seg.end" placeholder="Kết thúc (s)" class="w-24 border rounded px-2 py-1 text-sm" />
        </div>
      </div>
    </div>

    <div v-if="lesson.type === 'grammar'" class="card p-5 bg-white rounded-xl shadow space-y-4">
      <h2 class="font-bold">Grammar Content</h2>

      <EditorBlock
        ref="editorRef"
        :modelValue="grammarContent"
      />
    </div>

    <div class="card p-5 bg-white rounded-xl shadow space-y-4">
      <div class="flex justify-between items-center border-b pb-2">
        <h2 class="font-bold">Reviews the lesson content </h2>
        <button @click="addQuestion" class="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-md"> 
          Add Question
        </button>
      </div>
      <div v-for="(q, idx) in reviewQuestions" :key="idx" class="p-4 border-l-4 border-blue-400 bg-blue-50/30 rounded space-y-2">
        <div class="flex gap-2">
          <select v-model="q.type" class="border rounded px-2 py-1 text-sm">
            <option value="multiple_choice">Multiple Choice</option>
            <option value="fill_blank">Fill Blank</option>
          </select>
          <input v-model="q.question" placeholder="Question Content" class="flex-1 border rounded px-3 py-1 text-sm" />
        </div>
        <textarea v-if="q.type === 'multiple_choice'" v-model="q.optionsText" placeholder="Multiple Choices (One sentence per line)" class="w-full border rounded p-2 text-sm" rows="2"></textarea>
        <input v-model="q.answer" placeholder="Correct Answer" class="w-full border rounded px-3 py-1 text-sm bg-green-50" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import * as adminAPI from "@/api/lessonAdmin";
import EditorBlock from "../../components/EditorBlock.vue";

const route = useRoute();
const lesson = ref(null);
const videoInput = ref("");
const segments = ref([]);
const grammarContent = ref("");
const reviewQuestions = ref([]);
const editorRef = ref(null);

// Watcher an toàn: Chỉ chạy khi có giá trị và lesson đã load
watch(videoInput, (val) => {
  if (!val || !lesson.value) return;
  
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = val.match(regExp);
  
  if (match && match[7].length === 11) {
    lesson.value.video.videoId = match[7];
  } else {
    lesson.value.video.videoId = val;
  }
});

onMounted(async () => {
  try {
    const res = await adminAPI.getLessonById(route.params.id);
    lesson.value = res.data;
    videoInput.value = res.data.video?.videoId || "";
    segments.value = res.data.segments || [];
    grammarContent.value = res.data.grammar?.explanation || null;
    reviewQuestions.value = res.data.review?.questions?.map(q => ({
      ...q,
      optionsText: q.options?.join("\n") || ""
    })) || [];
  } catch (err) {
    console.error("Error Loading lesson:", err);
  }
});

const saveAll = async () => {
  try {
    const lessonId = route.params.id;

    // 1. Cập nhật Info (Chạy đầu tiên)
    await adminAPI.updateLesson(lessonId, { 
      title: lesson.value.title, 
      order: lesson.value.order 
    });

    // 2. Cập nhật Video (Gửi object có key videoId)
    await adminAPI.updateVideo(lessonId, { 
      videoId: lesson.value.video.videoId || "" 
    });

    // 3. Cập nhật nội dung theo Type
    if (lesson.value.type === 'video') {
      if (segments.value.length > 0) {
        for (const seg of segments.value) {
          const segData = {
            transcript: seg.transcript,
            start: Number(seg.start),
            end: Number(seg.end),
            order: Number(seg.order)
          };
          if (seg.isNew) {
            await adminAPI.createSegment(lessonId, segData);
          } else {
            await adminAPI.updateSegment(lessonId, seg._id, segData);
          }
        }
      }
    } else {
      // GỬI ĐÚNG FORMAT: { explanation: "chuỗi nội dung" }
      const editorData = await editorRef.value.saveContent()
      await adminAPI.updateGrammar(lessonId, { 
        explanation: editorData
      });
    }

    // 4. Cập nhật Review
    const formattedQuestions = reviewQuestions.value.map(q => ({
      type: q.type,
      question: q.question,
      answer: q.answer,
      options: q.type === 'multiple_choice' 
        ? q.optionsText.split("\n").filter(o => o.trim() !== "") 
        : []
    }));
    await adminAPI.updateReview(lessonId, { questions: formattedQuestions });

    alert("Success: Lesson data successfully updated");
    
    // Refresh lại giao diện
    const res = await adminAPI.getLessonById(lessonId);
    lesson.value = res.data;
    segments.value = res.data.segments || [];
    
  } catch (err) {
    console.error("Error data", err.response?.data);
    const msg = err.response?.data?.message || "Unknow Eror";
    alert(`Error: ${msg}`);
  }
};

const addSegment = () => segments.value.push({ transcript: "", start: 0, end: 0, order: segments.value.length + 1, isNew: true });
const removeSegment = (idx) => segments.value.splice(idx, 1);
const addQuestion = () => reviewQuestions.value.push({ type: 'multiple_choice', question: '', optionsText: '', answer: '' });
</script>