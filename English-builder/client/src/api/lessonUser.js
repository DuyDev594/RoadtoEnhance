import api from "./api";


export const getTopicsForUser = () => {
    return api.get("/lessons/topics");
};

export const getLessonsByTopic = (topicId) => {
    return api.get(`/lessons/topics/${topicId}/lessons`);
};


export const getLessonDetail = (lessonId) => {
    return api.get(`/lessons/${lessonId}`);
};

export const updateLessonProgress = (lessonId, payload) => {
    return api.put(`/lessons/${lessonId}/progress`, payload);
};

export const saveSegmentProgress = (lessonId, segmentIndex) => {

  return api.post("/lessons/segment-progress", {
    lessonId,
    segmentIndex
  })

};