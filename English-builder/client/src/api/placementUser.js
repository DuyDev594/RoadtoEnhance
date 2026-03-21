import api from "./api";

// user bắt đầu test
export const startPlacementTest = () =>
    api.get("/placement-test/test");

// lấy đề thi
export const getActivePlacementTest = () =>
    api.get("/placement-test/active");

// submit bài
export const submitPlacementTest = (answers) =>
    api.post("/placement-test/submit", { answers });

// lấy kết quả
export const getPlacementResult = () =>
    api.get("/placement-test/result");