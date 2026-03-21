import api from "./api.js";

// ===== FLASHCARD TOPICS =====

export const getFlashcardTopics = () =>
  api.get("/admin/flashcards/topics");

export const createFlashcardTopic = (data) =>
  api.post("/admin/flashcards/topics", data);

export const updateFlashcardTopic = (id, data) =>
  api.put(`/admin/flashcards/topics/${id}`, data);

export const deleteFlashcardTopic = (id) =>
  api.delete(`/admin/flashcards/topics/${id}`);


// ===== VOCABULARIES =====

export const getVocabularies = () =>
  api.get("/admin/flashcards/vocabularies");

export const getVocabulariesByTopic = (topicId) =>
  api.get(`/admin/flashcards/vocabularies/topic/${topicId}`);

export const createVocabulary = (formData) =>
  api.post("/admin/flashcards/vocabularies", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });

export const updateVocabulary = (id, formData) =>
  api.put(`/admin/flashcards/vocabularies/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });

export const deleteVocabulary = (id) =>
  api.delete(`/admin/flashcards/vocabularies/${id}`);