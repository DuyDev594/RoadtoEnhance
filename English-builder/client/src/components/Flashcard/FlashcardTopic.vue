<template>
  <div>
    <!-- FORM -->
    <form @submit.prevent="handleSubmit" class="mb-6 flex gap-4">
      <input
        v-model="form.name"
        placeholder="Topic name"
        class="border p-2 rounded w-1/3"
        
      />
      <p v-if="errors.name" class="text-red-500 text-sm">
        {{ errors.name }}
      </p>
      <input
        v-model="form.description"
        placeholder="Description"
        class="border p-2 rounded w-1/3"
      />
      <p v-if="errors.description" class="text-red-500 text-sm">
        {{ errors.description }}
      </p>

      <button class="px-4 rounded text-white"
        :class="isEditing ? 'bg-yellow-500' : 'bg-green-500'"
      >
        {{ isEditing ? "Update" : "Add" }}
      </button>

      <button
        v-if="isEditing"
        type="button"
        @click="resetForm"
        class="bg-gray-400 px-4 rounded text-white"
      >
        Cancel
      </button>
    </form>

    <!-- TABLE -->
    <table class="w-full border">
      <thead>
        <tr class="bg-gray-100">
          <th class="p-2 border">Name</th>
          <th class="p-2 border">Description</th>
          <th class="p-2 border">Actions</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="topic in store.topics" :key="topic._id">
          <td class="p-2 border">{{ topic.name }}</td>
          <td class="p-2 border">{{ topic.description }}</td>
          <td class="p-2 border flex gap-2">
            <button
              @click="editTopic(topic)"
              class="bg-yellow-500 text-white px-3 py-1 rounded"
              title="Edit topic"
            >
              <font-awesome-icon icon="pen-to-square" />
            </button>

            <button
              @click="deleteTopic(topic._id)"
              class="bg-red-500 text-white px-3 py-1 rounded"
              title="Delete topic"
            >
              <font-awesome-icon icon="trash" />
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useFlashcardStore } from "@/stores/flashcardStore.js";

const store = useFlashcardStore();
const errors = ref({});
const form = ref({
  name: "",
  description: ""
});

const isEditing = ref(false);
const editingId = ref(null);

onMounted(() => {
  store.fetchTopics();
});

const validate = () => {
  errors.value = {};

  if (!form.value.name?.trim()) {
    errors.value.name = "Topic name is required";
  }

  if (!form.value.description?.trim()) {
    errors.value.description = "Description is required";
  }

  return Object.keys(errors.value).length === 0;
};

const handleSubmit = async () => {
  if (!validate()) return;
  try{
    if (isEditing.value) {
    await store.editTopic(editingId.value, form.value);
  } else {
    await store.addTopic(form.value);
  }
  errors.value = {};
  resetForm();
  } catch (err) {
    const data = err.response?.data;

    if (data?.errors) {
      errors.value = data.errors;
    } else {
      alert(data?.message);
    }
  }
};

const editTopic = (topic) => {
  form.value = { ...topic };
  editingId.value = topic._id;
  isEditing.value = true;
};

const deleteTopic = async (id) => {
  if (confirm("Delete this topic?")) {
    await store.removeTopic(id);
  }
};

const resetForm = () => {
  form.value = { name: "", description: "" };
  editingId.value = null;
  isEditing.value = false;
};
</script>