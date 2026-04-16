<template>
    <div class="p-6 space-y-6">
        <h1 class="text-2xl font-black text-center text-slate-800 tracking-tight mb-6"> Manage Lessons</h1>

        <!-- ================= TOPIC SELECT ================= -->
        <div class="bg-white dark:bg-gray-800 p-5 rounded-xl shadow space-y-3w">
        <label class="block text-sm font-semibold text-gray-700 dark:text-gray-30">Select Topic</label>

        <select
            v-model="selectedTopicId"
            @change="loadLessons"
            class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
        >
            <option value="">-- Choose topic --</option>
            <option
            v-for="t in topics"
            :key="t._id"
            :value="t._id"
            >
            {{ t.title }} ({{ t.level }})
            </option>
        </select>
        </div>

        <!-- ================= CREATE LESSON ================= -->
        <div
        v-if="selectedTopicId"
        class="bg-white dark:bg-gray-800 p-4 rounded-xl shadow space-y-3"
        >
        <h2 class="text-lg font-semibold"> Create Lesson</h2>

        <input
            v-model="newLesson.title"
            placeholder="Lesson title"
            class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
        />
        <p v-if="lessonErrors.title" class="text-red-500 text-sm">
            {{ lessonErrors.title }}
            </p>
        <div>
            <label class="block text-sm font-semibold mb-1">
                Lesson Type
            </label>

            <select
                v-model="newLesson.type"
                class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
            >
                <option value="video">Video Lesson</option>
                <option value="grammar">Grammar Lesson</option>
            </select>
        </div>

        <button
            @click="createNewLesson"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
        >
            Create
        </button>
        </div>

        <!-- ================= LESSON LIST ================= -->
        <div
        v-if="lessons.length"
        class="bg-white dark:bg-gray-800 p-4 rounded-xl shadow"
        >
        <h2 class="text-lg font-semibold">📄 Lessons</h2>

        <div
            v-for="lesson in lessons"
            :key="lesson._id"
            class="border rounded p-3 mb-3 flex justify-between items-center"
        >
            <div>
                <p class="font-semibold text-gray-800 dark:text-white">
                    {{ lesson.title }}
                    <span class="text-xs text-gray-500 ml-2">
                        ({{ lesson.type }})
                    </span>
                </p>
                <div class="flex items-center gap-4 text-sm text-gray-500 mt-1">
                    <span>Order: {{ lesson.order }}</span>

                    <label class="flex items-center gap-1 cursor-pointer">
                        <input
                        type="checkbox"
                        :checked="lesson.isPublished"
                        @change="togglePublish(lesson)"
                        />
                        Publish
                    </label>
                </div>
            </div>

            <div class="flex gap-2">
            <button
                @click="editLesson(lesson)"
                class="px-3 py-1 text-sm bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                title="Edit lesson"
            >
                <font-awesome-icon icon="pen-to-square" />
            </button>

            <button
                @click="removeLesson(lesson._id)"
                class="px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                title="Delete lesson"
            >
                <font-awesome-icon icon="trash" />
            </button>
            
            <button
                @click="goDetail(lesson._id)"
                class="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
                View Detail
            </button>

            </div>
        </div>
        </div>

        <!-- ================= EDIT MODAL ================= -->
        <div
        v-if="editingLesson"
        class="fixed inset-0 bg-black/50 flex items-center justify-center"
        >
        <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl w-96 space-y-4 shadow-2xl">
            <h2 class="text-lg font-semibold flex items-center gap-2">
                <font-awesome-icon icon="edit" class="mr-2" />
                Edit Lesson</h2>

            <input
            v-model="editingLesson.title"
            class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
            />

            <input
            v-model.number="editingLesson.order"
            type="number"
            class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
            />

            <div class="flex justify-end gap-2">
            <button
                @click="editingLesson = null"
                class="px-4 py-2 border rounded-lg text-sm"
            >
                Cancel
            </button>

            <button
                @click="saveLesson"
                class="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
            >
                Save
            </button>
            </div>
        </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ref, onMounted } from "vue";
import {
    getAllTopics,
    getLessonsByTopic,
    createLesson,
    updateLesson,
    deleteLesson
} from "@/api/lessonAdmin";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

const router = useRouter();

const goDetail = (id) => {
    router.push(`/admin/lessons/${id}`);
};
/* ================= STATE ================= */
const topics = ref([]);
const lessons = ref([]);
const selectedTopicId = ref("");
const lessonErrors = ref({});
const newLesson = ref({
    title: "",
    order: 1,
    type: "video"
});

const editingLesson = ref(null);

/* ================= LOAD ================= */
onMounted(async () => {
    const res = await getAllTopics();
    topics.value = res.data;
    });

    const loadLessons = async () => {
    if (!selectedTopicId.value) return;

    const res = await getLessonsByTopic(selectedTopicId.value);
    lessons.value = res.data;
};

/* ================= ACTIONS ================= */
const createNewLesson = async () => {
    lessonErrors.value = {};

    if (!newLesson.value.title) {
        lessonErrors.value.title = "Title is required";
        return;
    }
    try {
        await createLesson({
        topicId: selectedTopicId.value,
        ...newLesson.value
    });

    newLesson.value.title = "";
    newLesson.value.order = 1;
    newLesson.value.type = "video";

    await loadLessons();
    } catch(err) {
        const resErrors = err.response?.data?.errors;

        if (resErrors) {
            lessonErrors.value = resErrors;
        } else {
            alert(err.response?.data?.message || "Create lesson failed");
        }
    }
    
};

const editLesson = (lesson) => {
    editingLesson.value = { ...lesson };
};

const saveLesson = async () => {
    await updateLesson(editingLesson.value._id, {
        title: editingLesson.value.title,
        order: editingLesson.value.order
    });

    editingLesson.value = null;
    await loadLessons();
};

const removeLesson = async (id) => {
    if (!confirm("Delete this lesson?")) return;

    await deleteLesson(id);
    await loadLessons();
};

const togglePublish = async (lesson) => {
    await updateLesson(lesson._id, {
        isPublished: !lesson.isPublished
    });

    lesson.isPublished = !lesson.isPublished;
};
</script>