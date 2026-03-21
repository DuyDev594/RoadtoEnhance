import api from "./api";

export const getLearningActivity = () => {
  return api.get("/user/activity");
};