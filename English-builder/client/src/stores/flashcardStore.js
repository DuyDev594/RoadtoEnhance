import { defineStore } from "pinia";
import {
  getFlashcardTopics,
  createFlashcardTopic,
  updateFlashcardTopic,
  deleteFlashcardTopic,
  getVocabularies,
  getVocabulariesByTopic,
  createVocabulary,
  updateVocabulary,
  deleteVocabulary
} from "../api/flashcardAdmin";

export const useFlashcardStore = defineStore("flashcard", {
  state: () => ({
    topics: [],
    vocabularies: [],
    loading: false,
    error: null
  }),

  actions: {
    async fetchTopics() {
      try {
        this.loading = true;
        const res = await getFlashcardTopics();
        this.topics = res.data;
      } catch (err) {
        this.error = err.response?.data?.message || "Error loading topics";
      } finally {
        this.loading = false;
      }
    },

    async addTopic(data) {
      const res = await createFlashcardTopic(data);
      this.topics.unshift(res.data);
    },

    async editTopic(id, data) {
      const res = await updateFlashcardTopic(id, data);
      this.topics = this.topics.map(t =>
        t._id === id ? res.data : t
      );
    },

    async removeTopic(id) {
      await deleteFlashcardTopic(id);
      this.topics = this.topics.filter(t => t._id !== id);
    },

    async fetchVocabularies(topicId = null) {
      try {
        this.loading = true;
        const res = topicId
          ? await getVocabulariesByTopic(topicId)
          : await getVocabularies();

        this.vocabularies = res.data;
      } catch (err) {
        this.error = err.response?.data?.message || "Error loading vocabulary";
      } finally {
        this.loading = false;
      }
    },

    async addVocabulary(formData) {
      const res = await createVocabulary(formData);
      this.vocabularies.unshift(res.data);
    },

    async editVocabulary(id, formData) {
      const res = await updateVocabulary(id, formData);
      this.vocabularies = this.vocabularies.map(v =>
        v._id === id ? res.data : v
      );
    },

    async removeVocabulary(id) {
      await deleteVocabulary(id);
      this.vocabularies = this.vocabularies.filter(v => v._id !== id);
    }
  } 
});