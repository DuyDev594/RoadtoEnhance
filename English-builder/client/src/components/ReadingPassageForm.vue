<template>
    <div class="bg-white rounded shadow p-6 space-y-4">
        <h3 class="text-lg font-semibold">
            {{ isEdit ? "Edit Reading Passage" : "Add Reading Passage" }}
        </h3>

        <!-- Title -->
        <div>
        <label class="block text-sm font-medium">Title</label>
        <input
            v-model="form.title"
            type="text"
            class="input"
            placeholder="Passage title"
        />
        </div>

        <!-- Passage Text -->
        <div>
        <label class="block text-sm font-medium">Passage Text</label>
        <textarea
            v-model="form.passageText"
            rows="6"
            class="input"
            placeholder="Enter reading passage text..."
        ></textarea>
        </div>

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

        <!-- Order -->
        <div>
        <label class="block text-sm font-medium">Order (1–3)</label>
        <input
            v-model.number="form.order"
            type="number"
            min="1"
            max="3"
            class="input"
        />
        </div>

        <!-- Actions -->
        <div class="flex gap-3">
        <button
            @click="submit"
            class="px-4 py-2 bg-blue-600 text-white rounded"
            >
            {{ isEdit ? "Update Passage" : "Create Passage" }}
        </button>

        <button
            v-if="isEdit"
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
import { reactive, ref, computed, watch } from "vue";
import placementAdminApi from "../api/placementAdmin.js";


const props = defineProps({
    testSetId: {
        type: String,
        required: true
    },
    initialData: {
        type: Object,
        default: null
    }
});



const levels = ["A1", "A2", "B1", "B2", "C1"];

const form = reactive({
    title: "",
    passageText: "",
    level: "",
    order: 1
});

const isEdit = computed(() => !!props.initialData?._id);

watch(
    () => props.initialData,
    (p) => {
        if (!p) return;
        form.title = p.title;
        form.passageText = p.passageText;
        form.level = p.level;
        form.order = p.order;
    },
    { immediate: true }
);

const error = ref("");
const success = ref("");


const reset = () => {
    form.title = "";
    form.passageText = "";
    form.level = "";
    form.order = 1;
    error.value = "";
    success.value = "";
};

const emit = defineEmits(["created", "updated", "cancel"]);

const submit = async () => {
    error.value = "";
    success.value = "";

    try {
        if (isEdit.value) {
        await placementAdminApi.updateReadingPassage(
            props.initialData._id,
            form
        );
        emit("updated");
        } else {
        await placementAdminApi.createReadingPassage({
            ...form,
            testSetId: props.testSetId
        });
        emit("created");
        reset();
        }
        
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
