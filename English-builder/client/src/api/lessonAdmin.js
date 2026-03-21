import api from "./api";

// Topics
export const getAllTopics = () => {
    return api.get("/admin/topics");
};

export const createTopic = (data) => {
    return api.post("/admin/topics", data);
};

export const updateTopic = (id, data) => {
    return api.put(`/admin/topics/${id}`, data);
};

export const deleteTopic = (id) => {
    return api.delete(`/admin/topics/${id}`);
};

// Lessons
export const getLessonsByTopic = (topicId) => {
    return api.get("/admin/lessons", {
        params: { topicId }
    });
};

export const getLessonById = (lessonId) => {
    return api.get(`/admin/lessons/${lessonId}`);
};

export const createLesson = (payload) => {
    return api.post("/admin/lessons", payload);
};

export const updateLesson = (lessonId, payload) => {
    return api.put(`/admin/lessons/${lessonId}`, payload);
};

export const deleteLesson = (lessonId) => {
    return api.delete(`/admin/lessons/${lessonId}`);
};

// video
export const updateVideo = (lessonId, payload) => {
    return api.put(`/admin/lessons/${lessonId}/video`, payload);
};

// segments
export const createSegment = (lessonId, payload) => {
    return api.post(`/admin/lessons/${lessonId}/segments`, payload);
};

export const updateSegment = (lessonId, segmentId, payload) => {
    return api.put(
        `/admin/lessons/${lessonId}/segments/${segmentId}`,
        payload
    );
};

export const deleteSegment = (lessonId, segmentId) => {
    return api.delete(
        `/admin/lessons/${lessonId}/segments/${segmentId}`
    );
};

export const updateGrammar = (id, data) =>
    api.put(`/admin/lessons/${id}/grammar`, data);

export const updateReview = (id, data) =>
    api.put(`/admin/lessons/${id}/review`, data);
