import { defineStore } from "pinia";

export const usePlacementStore = defineStore("placement", {
    state: () => ({
        answers: {} // { questionId: selectedAnswer }
    }),

    actions: {
        selectAnswer(questionId, selectedAnswer) {
            if (!questionId || !selectedAnswer) return;
            this.answers[questionId] = selectedAnswer;
        },

        buildSubmitPayload() {
        return Object.entries(this.answers).map(
            ([questionId, selectedAnswer]) => ({
            questionId,
            selectedAnswer
            })
        );
        },

        reset() {
        this.answers = {};
        }
    }
});