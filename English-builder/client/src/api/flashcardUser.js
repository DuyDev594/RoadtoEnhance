import api from "./api";

export const getTopics = () => {
  return api.get("/flashcards/topics")
}

export const getFitVocabularies = (topicId) => {
  return api.get(`/flashcards/topic/${topicId}/fit`)
}

export const getAdvancedVocabularies = (topicId) => {
  return api.get(`/flashcards/topic/${topicId}/advanced`)
}

export const markVocabularyLearned = (data) => {
  return api.post("/flashcards/progress", data)
}

export const getReviewVocabularies = () => {
  return api.get("/flashcards/review")
}
