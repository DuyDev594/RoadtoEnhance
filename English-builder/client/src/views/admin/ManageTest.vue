<template>
  <div class="p-6 space-y-6">
    <h1 class="text-2xl font-bold">Manage Placement Tests</h1>
    <div class="grid grid-cols-3 gap-6">
      <div class="col-span-1 p-4 bg-white rounded shadow">
        <div class="flex items-center justify-between mb-3">
          <h2 class="font-semibold">Test Sets</h2>
          <button
            @click="openCreateTestSet"
            class="px-3 py-1 text-white transition bg-green-600 hover:bg-green-700 rounded-lg shadow"
            title="Add new topic"
            >
            <font-awesome-icon icon="plus" />
          </button>
        </div>

        <ul class="space-y-2">
          <li
            v-for="set in (testSets || [])"
            :key="set?._id"
            @click="selectTestSet(set)"
            :class="[
              'p-2 rounded cursor-pointer transition',
              selectedTestSet?._id === set?._id ? 'bg-blue-100' : 'hover:bg-gray-100'
            ]"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="font-medium">
                  {{ set?.name || 'Unnamed Set' }}
                </span>

                <span
                  v-if="set.isActive"
                  class="px-2 py-0.5 text-xs text-green-700 bg-green-100 rounded"
                >
                  Active
                </span>
              </div>

              <div class="flex items-center gap-3">
                <label class="flex items-center gap-1 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    :checked="set.isActive"
                    @change.stop="toggleActive(set)"
                  />
                  Public
                </label>

                <button
                  @click.stop="deleteTestSet(set?._id)"
                  class="text-sm text-red-500 hover:underline"
                  title="Delete test set"
                >
                  <font-awesome-icon icon="trash" /> 
                </button>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <div class="col-span-2 p-4 bg-white rounded shadow">
        <div v-if="!selectedTestSet" class="flex items-center justify-center h-32 italic text-gray-500">
          Select a test set to manage its content.
        </div>

        <div v-else>
          <h2 class="pb-2 mb-4 text-xl font-semibold text-blue-700 border-b">
            {{ selectedTestSet?.name }}
          </h2>

          <div class="flex gap-4 mb-4 border-b">
            <button @click="activeTab = 'reading'" :class="tabClass('reading')">
              Reading Passages
            </button>
            <button @click="activeTab = 'questions'" :class="tabClass('questions')">
              Questions
            </button>
          </div>

          <div v-if="activeTab === 'reading'" class="space-y-6">
            <button
              class="flex items-center gap-2 px-3 py-1 text-white transition bg-green-600 rounded hover:bg-green-700"
              @click="loadReadingPassages"
            >
              <font-awesome-icon icon="arrow-rotate-right" /> Refresh Passages
            </button>

            <div
              v-for="p in readingPassages"
                :key="p._id"
              class="p-4 space-y-4 border rounded shadow-sm"
            >
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-lg font-semibold text-gray-800">
                    Passage {{ p?.order }}: {{ p?.title }}
                  </h3>
                  <p class="text-sm text-gray-500">Level: {{ p?.level }}</p>
                </div>

                <div class="flex gap-3 text-sm">
                  <button class="text-yellow-600 hover:text-yellow-800" @click="editingPassage = p"
                  title="Edit passage">
                    <font-awesome-icon icon="pen-to-square" /> 
                  </button>
                  <button class="text-red-600 hover:text-red-800" @click="deletePassage(p?._id)"
                  title="Delete passage">
                    <font-awesome-icon icon="trash" /> 
                  </button>
                </div>
              </div>

              <ReadingPassageForm
                v-if="editingPassage && editingPassage?._id === p?._id"
                :testSetId="selectedTestSet?._id"
                :initialData="editingPassage"
                @updated="() => { editingPassage = null; loadReadingPassages(); }"
                @cancel="editingPassage = null"
              />

              <template v-else>
                <QuestionGroup
                  title="Reading Questions"
                  :questions="readingQuestions[p?._id] || []"
                  @edit="handleEditQuestion"
                  @delete="handleDeleteQuestion"
                />

                <button
                  class="flex items-center gap-1 mt-2 text-sm font-medium text-blue-600 hover:text-blue-800"
                  @click="openQuestionFormPassageId = openQuestionFormPassageId === p?._id ? null : p?._id"
                >
                  <font-awesome-icon icon="plus" /> {{ openQuestionFormPassageId === p?._id ? 'Close Form' : 'Add Question' }}
                </button>

                
              </template>
            </div>

            <ReadingPassageForm
              v-if="!editingPassage && (readingPassages || []).length < 3"
              :testSetId="selectedTestSet?._id"
              @created="loadReadingPassages"
            />
          </div>

          <div v-if="activeTab === 'questions'" class="space-y-6">
            <button @click="loadQuestions" class="flex items-center gap-2 px-3 py-1 text-white bg-green-600 rounded">
              <font-awesome-icon icon="arrow-rotate-right" /> Refresh
            </button>

            <div class="p-4 space-y-3 border rounded bg-gray-50">
              <div class="flex items-center justify-between pb-2 border-b">
                <h3 class="font-semibold text-blue-800">Vocabulary Questions</h3>
                <button class="text-xl text-blue-600" @click="openVocabForm = !openVocabForm; editingVocabQuestion = null">
                  <font-awesome-icon
                    :icon="openVocabForm ? faCircleMinus : faCirclePlus"
                    />
                </button>
              </div>

              

              <QuestionGroup
                title="Vocabulary Questions"
                :questions="Array.isArray(questions) ? questions.filter(q => q.skill === 'vocabulary') : []"
                @edit="q => { editingVocabQuestion = q; openVocabForm = true; }"
                @delete="handleDeleteQuestion"
                />
            </div>

            <div class="p-4 space-y-3 border rounded bg-gray-50">
              <div class="flex items-center justify-between pb-2 border-b">
                <h3 class="font-semibold text-blue-800">Grammar Questions</h3>
                <button class="text-xl text-blue-600" @click="openGrammarForm = !openGrammarForm; editingGrammarQuestion = null">
                  <font-awesome-icon
                    :icon="openGrammarForm ? faCircleMinus : faCirclePlus"
                    />
                </button>
              </div>

              
              <QuestionGroup
                title="Grammar Questions"
                :questions="Array.isArray(questions) ? questions.filter(q => q.skill === 'grammar') : []"
                @edit="q => { editingGrammarQuestion = q; openGrammarForm = true; }"
                @delete="handleDeleteQuestion"
                />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- GLOBAL MODAL -->
<div
  v-if="openVocabForm || openGrammarForm || openQuestionFormPassageId"
  class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
>
  <div class="bg-white w-[700px] max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl p-6 relative">

    <!-- CLOSE BUTTON -->
    <button
      class="absolute text-xl text-gray-500 top-3 right-4 hover:text-red-500"
      @click="closeAllForms"
    >
      ✕
    </button>

    <!-- VOCAB -->
    <QuestionForm
      v-if="openVocabForm"
      :key="'vocab-' + selectedTestSet?._id"
      :testSetId="selectedTestSet?._id"
      skill="vocabulary"
      :initialData="editingVocabQuestion"
      @created="afterQuestionSaved"
      @updated="afterQuestionSaved"
      @cancel="closeAllForms"
    />

    <!-- GRAMMAR -->
    <QuestionForm
      v-if="openGrammarForm"
      :key="'grammar-' + selectedTestSet?._id"
      :testSetId="selectedTestSet?._id"
      skill="grammar"
      :initialData="editingGrammarQuestion"
      @created="afterQuestionSaved"
      @updated="afterQuestionSaved"
      @cancel="closeAllForms"
    />

    <!-- READING -->
    <ReadingQuestionForm
      v-if="openQuestionFormPassageId"
      :key="'reading-' + openQuestionFormPassageId"
      :testSetId="selectedTestSet?._id"
      :passageId="openQuestionFormPassageId"
      :initialData="editingReadingQuestion"
      @created="afterReadingSaved"
      @updated="afterReadingSaved"
      @cancel="closeAllForms"
    />

  </div>
</div>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import placementAdminApi from "../../api/placementAdmin.js";
import ReadingPassageForm from "../../components/ReadingPassageForm.vue";
import QuestionForm from "../../components/QuestionForm.vue";
import QuestionGroup from "../../components/QuestionGroup.vue";
import ReadingQuestionForm from "../../components/ReadingQuestionForm.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faCirclePlus, faCircleMinus } from "@fortawesome/free-solid-svg-icons";

const testSets = ref([]);
const selectedTestSet = ref(null);
const activeTab = ref("reading");
const readingPassages = ref([]);
const questions = ref([]); // Cho Vocab và Grammar
const readingQuestions = reactive({}); // Sử dụng reactive để Vue theo dõi được sự thay đổi bên trong object

const editingPassage = ref(null);
const editingReadingQuestion = ref(null);
const openQuestionFormPassageId = ref(null);
const openVocabForm = ref(false);
const openGrammarForm = ref(false);
const editingVocabQuestion = ref(null);
const editingGrammarQuestion = ref(null);

const fetchTestSets = async () => {
    try {
        const res = await placementAdminApi.getTestSets();
        testSets.value = res.data || [];
    } catch (err) {
        console.error("Error loading test sets:", err);
    }
};

const selectTestSet = async (set) => {
    closeAllForms(); 

    selectedTestSet.value = set;
    activeTab.value = "reading";

    readingPassages.value = [];
    questions.value = [];

    
    Object.keys(readingQuestions).forEach(k => delete readingQuestions[k]);

    await Promise.all([
        loadReadingPassages(),
        loadQuestions()
    ]);
};

const loadReadingPassages = async () => {
    if (!selectedTestSet.value) return;
    try {
        const res = await placementAdminApi.getReadingPassages(selectedTestSet.value._id);
        readingPassages.value = res.data || [];
        // Tải câu hỏi cho từng đoạn văn
        readingPassages.value.forEach(p => loadReadingQuestions(p._id));
    } catch (err) {
        console.error("Error loading reading passages:", err);
    }
};

const loadReadingQuestions = async (passageId) => {
    try {
        const res = await placementAdminApi.getReadingQuestions(passageId);
        readingQuestions[passageId] = res.data || [];
    } catch (err) {
        console.error("Error loading reading questions:", err);
    }
};

const loadQuestions = async () => {
  if (!selectedTestSet.value) return;

  try {
    const res = await placementAdminApi.getQuestions({
      testSetId: selectedTestSet.value._id
    });

    questions.value = Array.isArray(res.data)
      ? res.data
      : Array.isArray(res.data?.data)
      ? res.data.data
      : [];

  } catch (err) {
    console.error("Error loading combined questions:", err);
    questions.value = [];
  }
};

const handleDeleteQuestion = async (id, passageId = null) => {
    if (!confirm("Do you want to delete this question?")) return;
    try {
        await placementAdminApi.deleteQuestion(id);
        if (passageId) {
            await loadReadingQuestions(passageId);
        } else {
            await loadQuestions();
        }
    } catch (err) {
        alert("Delete failed!");
    }
};

const handleEditQuestion = (question) => {
    if (question.skill === "reading") {
        editingReadingQuestion.value = { ...question };
        openQuestionFormPassageId.value = question.passageId;
    }
};

const deletePassage = async (id) => {
    if (!confirm("Deleting this passage will delete all related questions. Continue?")) return;
    try {
        await placementAdminApi.deleteReadingPassage(id);
        await loadReadingPassages();
    } catch (err) {
        alert("Failed to delete passage");
    }
};

const toggleActive = async (set) => {
  try {
    const res = await placementAdminApi.updateTestSet(set._id, {
      isActive: !set.isActive
    });

    const index = testSets.value.findIndex(s => s._id === set._id);
    if (index !== -1) {
      testSets.value[index] = res.data;
    }

  } catch (err) {
    alert("Update failure status ");
  }
};

const openCreateTestSet = async () => {
  try {
    const name = prompt("Enter test set name:");
    if (!name) return;

    await placementAdminApi.createTestSet({
      name,
      isActive: false
    });

    await fetchTestSets();

  } catch (err) {
    alert("Create test set failed");
    console.error(err);
  }
};

const closeAllForms = () => {
  openVocabForm.value = false;
  openGrammarForm.value = false;
  openQuestionFormPassageId.value = null;
  editingVocabQuestion.value = null;
  editingGrammarQuestion.value = null;
  editingReadingQuestion.value = null;
};

const afterQuestionSaved = async () => {
  await loadQuestions();
  closeAllForms();
};

const afterReadingSaved = async () => {
  if (openQuestionFormPassageId.value) {
    await loadReadingQuestions(openQuestionFormPassageId.value);
  }
  closeAllForms();
};

const tabClass = (tab) => [
    "pb-2 px-4 transition-all",
    activeTab.value === tab ? "border-b-2 border-blue-600 font-semibold text-blue-600" : "text-gray-500 hover:text-blue-400"
];

onMounted(fetchTestSets);
</script>
