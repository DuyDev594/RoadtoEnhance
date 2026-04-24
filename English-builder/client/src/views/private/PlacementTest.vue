<template>
<div class="relative z-50">
<div v-if="isOutOfTests" class="max-w-3xl mx-auto mt-10 p-8 bg-blue-50 border-2 border-black-200 rounded-xl text-center">
    <div class="text-blue-500 text-5xl mb-4">
       <font-awesome-icon :icon="['fas', 'check']" />
    </div>
    <h2 class="text-2xl font-bold text-blue-800 mb-2">The test questions have run out.</h2>
    <p class="text-gray-600 mb-6">
        You have completed all available placement tests.
        Please come back later when we have updated content!
    </p>
    <button @click="goToDashboard" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
        Return to Dashboard
    </button>
  </div>
<!-- ================= LOADING ================= -->
<div
    v-if="!test && !authStore.user?.hasTakenPlacementTest"
    class="text-center py-10 text-base text-gray-500"
    >
    Loading placement test...
</div>

<!-- ================= RESULT (VỪA SUBMIT) ================= -->
<div
    v-else-if="result"
    class="max-w-4xl mx-auto mt-10 p-6 bg-green-50 border rounded"
    >
    <h2 class="text-2xl font-semibold mb-4">
        Your English Level: {{ result.assignedLevel }}
    </h2>

    <h3 class="text-lg font-semibold mb-2">Performance by Level</h3>

    <div class="space-y-2">
        <div
        v-for="(data, level) in result.byLevel"
        :key="level"
        class="flex justify-between bg-white p-3 rounded border"
        >
        <span class="text-base font-medium">{{ level }}</span>
        <span class="text-base">{{ data.correct }} / {{ data.total }}</span>
        </div>
    </div>
    <button
        class="mt-6 px-6 py-2 bg-blue-600 text-white rounded"
        @click="goToDashboard"
        >
        Start Learing 
    </button>
</div>


<!-- ================= CHƯA LÀM PLACEMENT TEST ================= -->
<div
    v-else-if="test"
    class="max-w-4xl mx-auto p-6"
    >
    <h1 class="text-2xl font-bold mb-6 text-center">Placement Test</h1>

    <!-- STEP INDICATOR -->
    <div class="flex justify-between mb-8">
        <div
        v-for="(label, index) in steps"
        :key="label"
        class="flex-1 text-center pb-2 border-b-2 text-sm"
        :class="step === index + 1
            ? 'border-blue-600 font-bold'
            : 'border-gray-300 text-gray-400'"
        >
        {{ index + 1 }}. {{ label }}
        </div>
    </div>

    <!-- ================= STEP 1: READING ================= -->
    <section v-if="step === 1">
        <h2 class="text-2xl font-semibold mb-4">Reading</h2>

        <div
        v-for="passage in test.reading"
        :key="passage._id"
        class="mb-8 border rounded p-4"
        >
        <h3 class="text-lg font-semibold mb-2">{{ passage.title }}</h3>
        <p class="mb-4 text-base whitespace-pre-line">{{ passage.passageText }}</p>

        <div
            v-for="(q, rIndex) in passage.questions"
            :key="q._id"
            class="mb-4"
        >
            <p class="text-base font-medium mb-2">Question {{ rIndex + 1 }} : {{ q.questionText }}</p>

            <label
            v-for="opt in q.options"
            :key="opt"
            class="flex items-center gap-2 mb-1 cursor-pointer text-base"
            >
            <input
                type="radio"
                :name="q._id"
                :value="opt"
                :checked="answers[q._id] === opt"
                @change="handleAnswer(q._id, opt)"
            />
            {{ opt }}
            </label>
        </div>
        </div>
    </section>

    <!-- ================= STEP 2: VOCABULARY ================= -->
    <section v-if="step === 2">
        <h2 class="text-2xl font-semibold mb-4">Vocabulary</h2>

        <div
        v-for="(q, vIndex) in test.vocabulary"
        :key="q._id"
        class="mb-6 border rounded p-4"
        >
        <p class="text-base font-medium mb-2">Question {{ vIndex + 1 }} : {{ q.questionText }}</p>

        <label
            v-for="opt in q.options"
            :key="opt"
            class="flex items-center gap-2 mb-1 cursor-pointer text-base"
        >
            <input
            type="radio"
            :name="q._id"
            :value="opt"
            :checked="answers[q._id] === opt"
            @change="handleAnswer(q._id, opt)"
            />
            {{ opt }}
        </label>
        </div>
    </section>

    <!-- ================= STEP 3: GRAMMAR ================= -->
    <section v-if="step === 3">
        <h2 class="text-2xl font-semibold mb-4">Grammar</h2>

        <div
        v-for="(q, gIndex) in test.grammar"
        :key="q._id"
        class="mb-6 border rounded p-4"
        >
        <p class="text-base font-medium mb-2">Question {{ gIndex + 1 }}: {{ q.questionText }}</p>

        <label
            v-for="opt in q.options"
            :key="opt"
            class="flex items-center gap-2 mb-1 cursor-pointer text-base"
        >
            <input
            type="radio"
            :name="q._id"
            :value="opt"
            :checked="answers[q._id] === opt"
            @change="handleAnswer(q._id, opt)"
            />
            {{ opt }}
        </label>
        </div>
    </section>

    <!-- ================= NAVIGATION ================= -->
    <div class="flex justify-between mt-8">
        <button
        v-if="step > 1"
        class="px-6 py-2 border rounded text-base"
        @click="step--"
        >
        Back
        </button>

        <button
        v-if="step < 3"
        class="ml-auto px-6 py-2 bg-blue-600 text-white rounded text-base disabled:opacity-50"
        :disabled="!canProceedStep(step)"
        @click="step++"
        >
        Next
        </button>

        <button
        v-if="step === 3"
        class="ml-auto px-6 py-2 bg-green-600 text-white rounded text-base disabled:opacity-500"
        :disabled="submitting || !canSubmit"
        @click="handleSubmit"
        >
        {{ submitting ? "Submitting..." : "Submit Test" }}
        </button>
    </div>
</div>


<!-- ================= ĐÃ LÀM TRƯỚC ĐÓ (RELOAD) ================= -->
<div
  v-else
  class="max-w-3xl mx-auto mt-10 p-6 bg-blue-50 border rounded"
>
  <h2 class="text-2xl font-semibold mb-4">Placement Test Completed</h2>

  <p class="text-base">Your English level:</p>
  <p class="text-4xl font-bold text-blue-600 mt-2">
    {{ authStore.user.level }}
  </p>

  <!-- REASON BLOCK -->
  <div v-if="retakeInfo" class="mt-6 bg-white p-4 rounded border space-y-2">

    <p class="text-base font-semibold text-red-500">
      You cannot retake the test yet.
    </p>

    <p class="text-base">
        <font-awesome-icon :icon="['fas', 'book']" class="text-green-500" /> Completed Lessons:
      <strong>{{ retakeInfo.completedLessons }} / 5</strong>
    </p>

    <p class="text-base">
      <font-awesome-icon :icon="['fas', 'clock']" class="text-yellow-500" /> Remaining Time:
      <strong>
        {{ Math.ceil(retakeInfo.remainingTime / (1000*60*60*24)) }} days
      </strong>
    </p>

    <p class="text-base text-gray-600">
      You can retake the placement test after:
      <br />
      • Completing at least <strong>5 lessons</strong>
      <br />
      • OR waiting for <strong>3 months</strong>
    </p>
    <button
        class="mt-4 px-4 py-2 bg-blue-600 text-white rounded text-base"
        @click="goToLessons"
        >
        Go to Lessons
    </button>
  </div>
</div>
</div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { usePlacementStore } from "@/stores/placementStore";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "vue-router";
import {
    startPlacementTest,
    getActivePlacementTest,
    submitPlacementTest
} from "@/api/placementUser";

const authStore = useAuthStore();
const placementStore = usePlacementStore();
const router = useRouter();
const test = ref(null);
const step = ref(1);
const steps = ["Reading", "Vocabulary", "Grammar"];
const submitting = ref(false);
const result = ref(null);
const retakeInfo = ref(null);
const answers = computed(() => placementStore.answers);
const isOutOfTests = ref(false);


onMounted(async () => {
  try {
    
    await startPlacementTest();

    
    const res = await getActivePlacementTest();
    test.value = res.data;

  } catch (err) {
    const status = err.response?.status;
    const message = err.response?.data?.message;

    if (status === 403) {
      retakeInfo.value = err.response.data;
    } 
    
    else if (status === 404 && message.includes("You have completed all available placement tests.")) {
      isOutOfTests.value = true;
    } else {
      console.error(err);
    }
  }
});

const handleAnswer = (questionId, selectedAnswer) => {
    placementStore.selectAnswer(questionId, selectedAnswer);
};

const goToDashboard = () => {
    router.push("/");
};

const goToLessons = () => {
    router.push("/app/lessons");
};
const canProceedStep = (currentStep) => {
    if (!test.value) return false;
    const a = placementStore.answers;

    if (currentStep === 1) {
        return test.value.reading.every(p =>
        p.questions.every(q => a[q._id])
        );
    }

    if (currentStep === 2) {
        return test.value.vocabulary.every(q => a[q._id]);
    }

    if (currentStep === 3) {
        return test.value.grammar.every(q => a[q._id]);
    }

    return false;
};

const canSubmit = computed(() => canProceedStep(3));

const handleSubmit = async () => {
    if (!confirm("Are you sure you want to submit the placement test?")) return;

    submitting.value = true;
    try {
        const payload = placementStore.buildSubmitPayload();
        const res = await submitPlacementTest(payload);

        result.value = res.data;
        await authStore.fetchUser();
        placementStore.reset();
    } catch (err) {
        alert("Submit failed. Please try again.");
    } finally {
        submitting.value = false;
    }
};

watch(step, () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});
</script>