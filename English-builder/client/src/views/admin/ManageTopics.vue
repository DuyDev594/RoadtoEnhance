<template>
    <div class="p-6">
        <h1 class="text-2xl font-bold mb-6"> Manage Topics</h1>

        <!-- Create Topic -->
        <div class="bg-white dark:bg-gray-800 p-5 rounded-xl shadow mb-8">
        <h2 class="font-semibold mb-4"> Create Topic</h2>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input v-model="form.title" placeholder="Title"
            class="input" />
            <p v-if="errors.title" class="text-red-500 text-sm">
                {{ errors.title }}
                </p>
            <select v-model="form.level" class="input">                
            <option disabled value="">Level</option>
            <option v-for="l in levels" :key="l">{{ l }}</option>
            </select>
            <p v-if="errors.level" class="text-red-500 text-sm">
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
                <th class="th">Title</th>
                <th class="th">Level</th>
                <th class="th">Order</th>
                <th class="th">Published</th>
                <th class="th">Actions</th>
            </tr>
            </thead>

            <tbody>
            <tr v-for="topic in topics" :key="topic._id"
                class="border-t dark:border-gray-700">
                <td class="td">{{ topic.title }}</td>
                <td class="td">{{ topic.level }}</td>
                <td class="td">{{ topic.order }}</td>
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
            <h3 class="font-semibold mb-4">✏️ Edit Topic</h3>

            <input v-model="editing.title" class="input mb-3" />
            <input type="number" v-model.number="editing.order" class="input mb-3" />

            <select v-model="editing.level" class="input mb-4">
            <option v-for="l in levels" :key="l">{{ l }}</option>
            </select>

            <div class="flex justify-end gap-2">
            <button class="btn" @click="editing=null">Cancel</button>
            <button class="btn-primary" @click="updateTopic">Save</button>
            </div>
        </div>
        </div>

    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "@/api/api";

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
    await api.put(`/admin/topics/${editing.value._id}`, editing.value);
    editing.value = null;
    fetchTopics();
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