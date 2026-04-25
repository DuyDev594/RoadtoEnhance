<template>
    <div class="p-6 max-w-6xl mx-auto">
        <h1 class="text-2xl font-bold mb-8 text-gray-800 dark:text-white text-center"> Manage Topics</h1>

        <!-- Create Topic -->
        <div class="bg-white dark:bg-gray-800 p-5 rounded-xl shadow mb-8">
        <h2 class="text-xl font-semibold mb-4 text-gray-800 dark:text-white"> Create Topic</h2>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input v-model="form.title" placeholder="Title"
            class="input" />
            <p v-if="errors.title" class="text-sm text-red-500 mt-1">
                {{ errors.title }}
                </p>
            <select v-model="form.level" class="input">                
            <option disabled value="">Level</option>
            <option v-for="l in levels" :key="l">{{ l }}</option>
            </select>
            <p v-if="errors.level" class="text-sm text-red-500 mt-1">
                {{ errors.level }}
                </p>
            <button @click="createTopic"
            class="btn-primary">
            Create
            </button>
        </div>
        </div>

        <!-- Topic List -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
        <table class="w-full">
            <thead class="bg-gray-100 dark:bg-gray-700">
            <tr>
                <th class="th text-sm font-semibold text-gray-700 dark:text-gray-300">Title</th>
                <th class="th text-sm font-semibold text-gray-700 dark:text-gray-300">Level</th>
                <th class="th text-sm font-semibold text-gray-700 dark:text-gray-300">Order</th>
                <th class="th text-sm font-semibold text-gray-700 dark:text-gray-300">Published</th>
                <th class="th text-sm font-semibold text-gray-700 dark:text-gray-300">Actions</th>
            </tr>
            </thead>

            <tbody>
            <tr v-for="topic in topics" :key="topic._id"
                class="border-t dark:border-gray-700">
                <td class="td text-base text-gray-800 dark:text-gray-100">{{ topic.title }}</td>
                <td class="td text-base text-gray-600 dark:text-gray-300">{{ topic.level }}</td>
                <td class="td text-base text-gray-600 dark:text-gray-300">{{ topic.order }}</td>
                <td class="td">
                <input type="checkbox"
                    :checked="topic.isPublished"
                    @change="togglePublish(topic)" />
                </td>
                <td class="td space-x-2">
                <button class="btn-sm text-yellow-600 hover:text-yellow-800"
                    @click="editTopic(topic)" title="Edit topic">
                    <font-awesome-icon icon="pen-to-square" />
                </button>
                <button class="btn-danger text-red-600 hover:text-red-800"
                    @click="deleteTopic(topic._id)" title="Delete topic">
                    <font-awesome-icon icon="trash" />
                </button>
                </td>
            </tr>
            </tbody>
        </table>
        </div>

        <!-- Edit Modal -->
        <div v-if="editing" class="modal">
        <div class="modal-box">
            <h3 class="font-semibold mb-4">Edit Topic</h3>

            <input v-model="editing.title" class="input mb-3" />
            <p v-if="editErrors.title" class="text-red-500 text-sm mb-2">
                {{ editErrors.title }}
            </p>
            <input type="number" v-model.number="editing.order" class="input mb-3" />
            <p v-if="editErrors.order" class="text-red-500 text-sm mb-2">
                {{ editErrors.order }}
            </p>
            <select v-model="editing.level" class="input mb-4">
            <option v-for="l in levels" :key="l">{{ l }}</option>
            </select>
            <p v-if="editErrors.level" class="text-red-500 text-sm mb-2">
                {{ editErrors.level }}
            </p>

            <div class="flex justify-end gap-2">
            <button class="btn text-sm" @click="editing=null">Cancel</button>
            <button class="btn-primary text-sm" @click="updateTopic">Save</button>
            </div>
        </div>
        </div>

    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "@/api/api";
const editErrors = ref({});
const topics = ref([]);
const editing = ref(null);
const errors = ref ({});

const levels = ["A1", "A2", "B1", "B2", "C1"];

const form = ref({
    title: "",
    level: "",
    order: 1
});

const fetchTopics = async () => {
    const res = await api.get("/admin/topics");
    topics.value = res.data;
};

onMounted(fetchTopics);

// CRUD
const createTopic = async () => {
    errors.value = {};
    try{

    await api.post("/admin/topics", form.value);

        form.value = { title: "", level: "", order: 1 };
        fetchTopics();

    } catch (err) {
        const resErrors = err.response?.data?.errors;

        if (resErrors) {
            errors.value = resErrors;
        } else {
            alert(err.response?.data?.message || "Create failed");
        }
    }
};

const editTopic = (topic) => {
    editing.value = { ...topic };
};

const updateTopic = async () => {
    if (!validateEdit()) return;

    try {
        await api.put(`/admin/topics/${editing.value._id}`, editing.value);
        editing.value = null;
        fetchTopics();
    } catch (err) {
        alert(err.response?.data?.message || "Update failed");
    }
};

const deleteTopic = async (id) => {
    if (!confirm("Delete this topic?")) return;
    await api.delete(`/admin/topics/${id}`);
    fetchTopics();
};

const togglePublish = async (topic) => {
    await api.put(`/admin/topics/${topic._id}`, {
        isPublished: !topic.isPublished
    });
    fetchTopics();
};

const validateEdit = () => {
    editErrors.value = {};

    if (!editing.value.title?.trim()) {
        editErrors.value.title = "Title is required";
    }

    if (!editing.value.level) {
        editErrors.value.level = "Level is required";
    }

    if (!editing.value.order || editing.value.order < 1) {
        editErrors.value.order = "Order must be greater than 0";
    }

    return Object.keys(editErrors.value).length === 0;
};
</script>

<style scoped lang="postcss">
.input {
    @apply px-3 py-2 border rounded w-full dark:bg-gray-700 dark:text-white;
}
.btn-primary {
    @apply bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700;
}
.btn-danger {
    @apply bg-red-600 text-white px-3 py-1 rounded;
}
.btn-sm {
    @apply bg-gray-200 dark:bg-gray-600 px-3 py-1 rounded;
}
.th {
    @apply text-left px-4 py-3;
}
.td {
    @apply px-4 py-3;
}
.modal {
    @apply fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center;
}
.modal-box {
    @apply bg-white dark:bg-gray-800 p-6 rounded-xl w-96;
}
</style>