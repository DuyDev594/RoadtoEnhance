<template>
<div class="p-4 space-y-4 border rounded bg-gray-50">
    <h4 class="text-lg font-semibold">
        {{ isEdit ? "Edit Reading Question" : "Add Reading Question" }}
    </h4>

    <!-- Question -->
    <div>
        <label class="block mb-1 text-sm font-medium">Question</label>
        <textarea
            v-model="form.questionText"
            rows="3"
            class="w-full input"
            placeholder="Enter question text"
        ></textarea>
        <p v-if="errors.questionText" class="text-red-500 text-sm mt-1">
            {{ errors.questionText }}
        </p>
    </div>

    <!-- Options -->
    <div>
        <label class="block mb-1 text-sm font-medium">Options</label>
        <div class="space-y-2">
            <div
                v-for="(opt, i) in form.options"
                :key="i"
                class="flex items-center gap-2"
            >
                <span class="w-5 font-semibold">
                    {{ String.fromCharCode(65 + i) }}.
                </span>
                <input
                    v-model="form.options[i]"
                    class="flex-1 input"
                    placeholder="Option text"
                />
            </div>
        </div>
        <p v-if="errors.options" class="text-red-500 text-sm mt-1">
            {{ errors.options }}
        </p>
    </div>

    <!-- Correct Answer -->
    <div>
        <label class="block mb-1 text-sm font-medium">
            Correct Answer
        </label>
        <select v-model="form.correctAnswer" class="w-full input">
            <option disabled value="">Select correct answer</option>
            <option
                v-for="(o, i) in form.options"
                :key="i"
                :value="o"
                :disabled="!o"
            >
                {{ String.fromCharCode(65 + i) }}. {{ o }}
            </option>
        </select>
        <p v-if="errors.correctAnswer" class="text-red-500 text-sm mt-1">
            {{ errors.correctAnswer }}
        </p>
    </div>

    <!-- Level -->
    <!--<div>
        <label class="block mb-1 text-sm font-medium">Level</label>
        <select v-model="form.level" class="w-full input">
            <option disabled value="">Select level</option>
            <option v-for="l in levels" :key="l" :value="l">
                {{ l }}
            </option>
        </select>
    </div> -->


    <!-- Actions -->
    <div class="flex gap-2 pt-2">
        <button @click="submit" class="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">
            {{ isEdit ? "Update Question" : "Create Question" }}
        </button>

        <button
            
            @click="$emit('cancel')"
            class="btn-secondary"
        >
            Cancel
        </button>
    </div>

    <!-- Error -->
    <p v-if="error" class="text-sm text-red-600">
        {{ error }}
    </p>
</div>
</template>


<script setup>
import { reactive, computed, watch, ref } from "vue";
import placementAdminApi from "../api/placementAdmin";
const error = ref(null)
const errors = ref({})
const props = defineProps({
    testSetId: String,
    passageId: String,
    initialData: Object
});

const emit = defineEmits(["created", "updated", "cancel"]);

const isEdit = computed(() => !!props.initialData?._id);
const levels = ["A1", "A2", "B1", "B2", "C1"];

const validate = () => {
    errors.value = {};

    if (!form.questionText.trim()) {
        errors.value.questionText = "Question is required";
    }

    form.options.forEach((opt, i) => {
        if (!opt.trim()) {
            errors.value[`option_${i}`] = "Option cannot be empty";
        }
    });

    if (!form.correctAnswer) {
        errors.value.correctAnswer = "Please select correct answer";
    }

    return Object.keys(errors.value).length === 0;
};
const form = reactive({
    questionText: "",
    options: ["", "", "", ""],
    correctAnswer: "",
    level: ""
});

const resetForm = () => {
    form.questionText = "";
    form.options = ["", "", "", ""];
    form.correctAnswer = "";
    form.level = "";
    error.value = "";
};

watch(
    () => props.initialData,
    (q) => {
        if (!q) {
            resetForm();
            return;
        }
        // Sử dụng gán từng thuộc tính để đảm bảo Reactivity
        form.questionText = q.questionText || "";
        form.options = q.options ? [...q.options] : ["", "", "", ""];
        form.correctAnswer = q.correctAnswer || "";
        form.level = q.level || "";
    },
    { immediate: true, deep: true } // Thêm deep để theo dõi sâu
);

const submit = async () => {
    error.value = null;

    if (!validate()) return;
    try {
        if (isEdit.value) {
        await placementAdminApi.updateQuestion(props.initialData._id, form);
        emit("updated");
        } else {
        await placementAdminApi.createQuestion({
            ...form,
            testSetId: props.testSetId,
            passageId: props.passageId,
            skill: "reading"
        });
        resetForm(); 
        emit("created");
        }
    } catch (err) {
        error.value = err.response?.data?.message || "Submit failed";
    }
};
</script>
