<template>
    <div class="bg-white rounded shadow p-6 space-y-4">
        <h3 class="text-lg font-semibold">
            {{ props.initialData ? "Edit Question" : "Add Placement Question" }}
        </h3>

        <!-- Level -->
        <div>
        <label class="block text-sm font-medium">Level</label>
        <select v-model="form.level" class="input">
            <option disabled value="">Select level</option>
            <option v-for="l in levels" :key="l" :value="l">
            {{ l }}
            </option>
        </select>
        </div>

        <!-- Question Text -->
        <div>
        <label class="block text-sm font-medium">Question</label>
        <textarea
            v-model="form.questionText"
            rows="3"
            class="input"
            placeholder="Enter question..."
        ></textarea>
        </div>

        <!-- Options -->
        <div v-for="(opt, index) in form.options" :key="index">
        <label class="block text-sm font-medium">
            Option {{ String.fromCharCode(65 + index) }}
        </label>
        <input
            v-model="form.options[index]"
            type="text"
            class="input"
        />
        </div>

        <!-- Correct Answer -->
        <div>
        <label class="block text-sm font-medium">Correct Answer</label>
        <select v-model="form.correctAnswer" class="input">
            <option disabled value="">Select correct answer</option>
            <option
            v-for="(opt, index) in form.options"
            :key="index"
            :value="opt"
            :disabled="!opt"
            >
            {{ String.fromCharCode(65 + index) }}. {{ opt }}
            </option>
        </select>
        </div>

        <!-- Actions -->
        <div class="flex gap-3">
            <button
                @click="submit"
                class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
                {{ isEdit ? "Update Question" : "Create Question" }}
            </button>

            <button
                @click="$emit('cancel')"
                class="px-4 py-2 bg-gray-200 rounded"
            >
                Cancel
            </button>
        </div>

        <p v-if="error" class="text-red-600 text-sm">{{ error }}</p>
        <p v-if="success" class="text-green-600 text-sm">{{ success }}</p>
    </div>
</template>
<script setup>

import { reactive, ref, watch, computed } from "vue";
import placementAdminApi from "../api/placementAdmin";


const emit = defineEmits(["created", "updated", "cancel"]);

const props = defineProps({
    testSetId: {
        type: String,
        required: true
    },
    skill: {
        type: String,
        required: true // "vocabulary" | "grammar"
    },
    initialData: {
        type: Object,
        default: null
    }
});

const isEdit = computed(() => !!props.initialData?._id);

const levels = ["A1", "A2", "B1", "B2", "C1"];

const form = reactive({
    level: "",
    questionText: "",
    options: ["", "", "", ""],
    correctAnswer: ""
});

watch(
    () => props.initialData,
    (q) => {
        if (!q) return;

        form.level = q.level;
        form.questionText = q.questionText;
        form.correctAnswer = q.correctAnswer;
        form.options.splice(0, form.options.length, ...q.options);
    },
    { immediate: true }
);
const error = ref("");
const success = ref("");

const reset = () => {
    form.level = "";
    form.questionText = "";
    form.options.splice(0, form.options.length, "", "", "", "");
    form.correctAnswer = "";
    error.value = "";
    success.value = "";
};

const submit = async () => {
    error.value = "";
    success.value = "";

    if (
        !form.level ||
        !form.questionText ||
        form.options.some(o => !o) ||
        !form.correctAnswer
    ) {
        error.value = "Please fill all fields";
        return;
    }

    try {
        if (isEdit.value) {
            await placementAdminApi.updateQuestion(props.initialData._id, {
                skill: props.skill,
                level: form.level,
                questionText: form.questionText,
                options: form.options,
                correctAnswer: form.correctAnswer
            });
            emit("updated");
        } else {
            await placementAdminApi.createQuestion({
                testSetId: props.testSetId,
                skill: props.skill,
                ...form
            });
            emit("created");
            reset();
        }

        success.value = "Saved successfully";
    } catch (err) {
        error.value = err.response?.data?.message || "Submit failed";
    }
};

</script>
<style scoped>
.input {
    width: 100%;
    padding: 8px 10px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
}
</style>

