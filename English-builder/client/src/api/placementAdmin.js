import axios from "./api.js";

// TEST SETS
export const getTestSets = () =>
    axios.get("/admin/placement/test-sets");

export const createTestSet = (data) =>
    axios.post("/admin/placement/test-sets", data);

export const updateTestSet = (id, data) =>
    axios.put(`/admin/placement/test-sets/${id}`, data);

export const deleteTestSet = (id) =>
    axios.delete(`/admin/placement/test-sets/${id}`);

// READING PASSAGES
export const getReadingPassages = (testSetId) =>
    axios.get(`/admin/placement/test-sets/${testSetId}/reading-passages`);

export const createReadingPassage = (data) =>
    axios.post(`/admin/placement/test-sets/${data.testSetId}/reading-passages`, data);

// QUESTIONS
export const getQuestions = (params) =>
    axios.get("/admin/placement/questions", { params });

export const createQuestion = (data) =>
    axios.post("/admin/placement/questions", data);

export const updateQuestion = (id, data) =>
    axios.put(`/admin/placement/questions/${id}`, data);

export const deleteQuestion = (id) =>
    axios.delete(`/admin/placement/questions/${id}`);

export const getReadingQuestions = (passageId) =>
    axios.get(`/admin/placement/reading-passages/${passageId}/questions`);

export const updateReadingPassage = (id, data) =>
    axios.put(`/admin/placement/reading-passages/${id}`, data);

export const deleteReadingPassage = (id) =>
    axios.delete(`/admin/placement/reading-passages/${id}`);

export default {
    getTestSets,
    createTestSet,
    updateTestSet,
    deleteTestSet,

    getReadingPassages,
    createReadingPassage,
    updateReadingPassage,
    deleteReadingPassage,

    getQuestions,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    getReadingQuestions
};
