import api from "./api";

export const getTopic = () => {
  return api.get("/writing/topic");
};

export const submitEssay = (essay) => {
  return api.post("/writing/submit", { essay });
};

export const nextTopic = () => {
  return api.get("/writing/next-topic");
};