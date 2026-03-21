import { defineStore } from "pinia";
import api from "../api/api.js";

export const useAuthStore = defineStore("auth", {
    state: () => ({
        token: localStorage.getItem("token"),
        user: null,
        loading: false,
    }),

    getters: {
        isAuthenticated: (state) => !!state.token,
        isCompleted: (state) => (lessonId) => {
            return state.user?.lessonProgress?.some(
                (p) =>
                    String(p.lessonId) === String(lessonId) &&
                    p.status === "completed"
            );
        },

        // Check if a lesson is locked based on the previous lesson's status
        isLocked: (state) => (lesson, allLessons) => {

            if (!lesson || !allLessons || allLessons.length === 0) return true

            const currentOrder = lesson.order

            if (currentOrder <= 1) return false

            const prevLesson = allLessons.find(l => l.order === currentOrder - 1)

            if (!prevLesson) {

                const lessonsBefore = allLessons.filter(l => l.order < currentOrder)

                if (lessonsBefore.length === 0) return false

                const closestPrevLesson = lessonsBefore.sort((a, b) => b.order - a.order)[0]

                const isDone = state.user?.lessonProgress?.some(
                    p =>
                        String(p.lessonId) === String(closestPrevLesson._id) &&
                        p.status === 'completed'
                )

                return !isDone
            }

            const isPrevCompleted = state.user?.lessonProgress?.some(
                p =>
                    String(p.lessonId) === String(prevLesson._id) &&
                    p.status === 'completed'
            )

            return !isPrevCompleted
        }
    },

    actions: {
        async login(token) {
        this.token = token;
        localStorage.setItem("token", token);
        await this.fetchUser();
        },

        async fetchUser() {
        try {
            this.loading = true;
            const res = await api.get("/users/me");
            this.user = res.data;
        } catch (err) {
            this.logout();
        } finally {
            this.loading = false;
        }
        },

        logout() {
        this.token = null;
        this.user = null;
        localStorage.removeItem("token");
        },
    },
});
