<template>
  <div>
    <!-- FILTER -->
    <div class="mb-4">
      <select
        v-model="selectedTopic"
        @change="fetchVocab"
        class="border p-2 rounded"
      >
        <option value="">All Topics</option>
        <option v-for="t in store.topics" :key="t._id" :value="t._id">
          {{ t.name }}
        </option>
      </select>
    </div>

    <!-- FORM CARD -->
    <div class="bg-white shadow-lg rounded-xl p-6 mb-8 border">
      
      <h2 class="text-lg font-semibold mb-4">
        {{ isEditing ? "Edit Flashcard" : "Add New Flashcard" }}
      </h2>

      <form @submit.prevent="handleSubmit" class="grid grid-cols-1 md:grid-cols-3 gap-4">

        <input
          
          v-model="form.word"
          placeholder="Word"
          class="border p-2 rounded focus:ring-2 focus:ring-blue-400"
          required
        />
        <p v-if="errors.word" class="text-red-500 text-sm">
          {{ errors.word }}
        </p>
        <input
          v-model="form.definition"
          placeholder="Definition"
          class="border p-2 rounded focus:ring-2 focus:ring-blue-400"
        />
        <p v-if="errors.definition" class="text-red-500 text-sm">
          {{ errors.definition }}
        </p>

        <input
          v-model="form.example"
          placeholder="Example sentence"
          class="border p-2 rounded focus:ring-2 focus:ring-blue-400"
        />
          <p v-if="errors.example" class="text-red-500 text-sm">
            {{ errors.example }}
          </p>
        <input
          v-model="form.usIpa"
          placeholder="US IPA (e.g. /dɔːg/)"
          class="border p-2 rounded focus:ring-2 focus:ring-blue-400"
        />

        <input
          v-model="form.ukIpa"
          placeholder="UK IPA (e.g. /dɒg/)"
          class="border p-2 rounded focus:ring-2 focus:ring-blue-400"
        />

        <select
          v-model="form.level"
          class="border p-2 rounded focus:ring-2 focus:ring-blue-400"
        >
          <option disabled value="">Level</option>
          <option>A1</option>
          <option>A2</option>
          <option>B1</option>
          <option>B2</option>
          <option>C1</option>
        </select>
          <p v-if="errors.level" class="text-red-500 text-sm">
              {{ errors.level }}
            </p>
        <select
          v-model="form.topic"
          class="border p-2 rounded focus:ring-2 focus:ring-blue-400"
        >
          <option disabled value="">Topic</option>
          <option v-for="t in store.topics" :key="t._id" :value="t._id">
            {{ t.name }}
          </option>
        </select>
          <p v-if="errors.topic" class="text-red-500 text-sm">
              {{ errors.topic }}
            </p>
        <input
          type="file"
          @change="handleImageChange"
          class="border p-2 rounded bg-gray-50"
        />

        <!-- IMAGE PREVIEW -->
        <div v-if="previewImage" class="col-span-3 flex justify-center">
          <img
            :src="previewImage"
            class="w-32 h-32 object-cover rounded-lg border"
          />
        </div>

        <!-- BUTTONS -->
        <div class="col-span-3 flex gap-4 mt-4">

          <button
            type="submit"
            class="flex items-center gap-2 px-6 py-2 rounded-lg text-white font-medium shadow hover:scale-105 transition"
            :class="isEditing ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-600 hover:bg-green-700'"
          >
            <font-awesome-icon :icon="isEditing ? 'pen-to-square' : 'plus'" />
            {{ isEditing ? "Update Flashcard" : "Add Flashcard" }}
          </button>

          <button
            v-if="isEditing"
            type="button"
            @click="resetForm"
            class="px-6 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
          >
            Cancel
          </button>

        </div>

      </form>
    </div>

    <!-- TABLE -->
    <table class="w-full border">
      <thead>
        <tr class="bg-gray-100">
          <th class="border p-2">Word</th>
          <th class="border p-2">Definition</th>
          <th class="border p-2">Level</th>
          <th class="border p-2">Pronunciation</th>
          <th class="border p-2">Topic</th>
          <th class="border p-2">Image</th>
          <th class="border p-2">Actions</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="v in store.vocabularies" :key="v._id">
          <td class="border p-2">{{ v.word }}</td>
          <td class="border p-2">{{ v.definition }}</td>
          <td class="border p-2">{{ v.level }}</td>
          <td class="border p-2">
            <div v-if="v.pronunciation?.us">
              <strong>us:</strong> {{ v.pronunciation.us.ipa }}
            </div>
            <div v-if="v.pronunciation?.uk">
              <strong>uk:</strong> {{ v.pronunciation.uk.ipa }}
            </div>
          </td>
          <td class="border p-2">{{ v.topic?.name }}</td>
          <td class="border p-2">
            <img v-if="v.imageUrl" :src="v.imageUrl" class="w-16 h-16 object-cover" />
          </td>
          <td class="border p-2 flex gap-2">
            <button
              @click="editVocab(v)"
              class="bg-yellow-500 text-white px-3 py-1 rounded"
              title="Edit vocabulary"
            >
              <font-awesome-icon icon="pen-to-square" />
            </button>

            <button
              @click="deleteVocab(v._id)"
              class="bg-red-500 text-white px-3 py-1 rounded"
              title="Delete vocabulary"
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
const selectedTopic = ref("");
const isEditing = ref(false);
const editingId = ref(null);
const previewImage = ref(null);
let selectedFile = null;

const form = ref({
  word: "",
  definition: "",
  example: "",
  level: "",
  topic: "",
  usIpa: "",
  ukIpa: ""
});

onMounted(async () => {
  await store.fetchTopics();
  await store.fetchVocabularies();
});

const fetchVocab = async () => {
  await store.fetchVocabularies(selectedTopic.value || null);
};

const handleImageChange = (e) => {
  selectedFile = e.target.files[0];
  previewImage.value = URL.createObjectURL(selectedFile);
};

const handleSubmit = async () => {
  const formData = new FormData();

  Object.keys(form.value).forEach(key => {
    formData.append(key, form.value[key]);
  });

  if (selectedFile) {
    formData.append("image", selectedFile);
  }
  try{
    if (isEditing.value) {
    await store.editVocabulary(editingId.value, formData);
  } else {
    await store.addVocabulary(formData);
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

const editVocab = (v) => {
  form.value = {
  word: v.word,
  definition: v.definition,
  example: v.example,
  level: v.level,
  topic: v.topic?._id,
  usIpa: v.pronunciation?.us?.ipa || "",
  ukIpa: v.pronunciation?.uk?.ipa || ""
};

  previewImage.value = v.imageUrl || null;
  editingId.value = v._id;
  isEditing.value = true;
};

const deleteVocab = async (id) => {
  if (confirm("Delete this word?")) {
    await store.removeVocabulary(id);
  }
};

const resetForm = () => {
  form.value = {
  word: "",
  definition: "",
  example: "",
  level: "",
  topic: "",
  usIpa: "",
  ukIpa: ""
};
  previewImage.value = null;
  selectedFile = null;
  isEditing.value = false;
  editingId.value = null;
};
</script>
