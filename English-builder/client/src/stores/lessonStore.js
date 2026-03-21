import { defineStore } from "pinia";
import * as lessonAPI from "../api/lessonUser.js";
import { useAuthStore } from "./authStore";


export const useLessonStore = defineStore("lesson", {
    state: () => ({
    topics: [],
    lessons: [],

    // 🔥 NEW
    currentTopics: [],
    nextTopics: [],
    currentLevel: null,
    nextLevel: null,
    unlockNextLevel: false,

    currentLesson: null,
    currentProgress: null,
    loading: false,
    error: null
}),

    actions: {
        async fetchLessonsByTopic(topicId) {
            this.loading = true;
            this.lessons = []; // Reset danh sách cũ để tránh hiện nhầm dữ liệu
            try {
                const res = await lessonAPI.getLessonsByTopic(topicId);
                // BE của bạn trả về array lessons, ta gán vào state
                this.lessons = res.data; 
            } catch (err) {
                console.error("Lỗi khi tải danh sách bài học:", err);
                this.error = "Không thể tải danh sách bài học";
            } finally {
                this.loading = false;
            }
        },
        async fetchTopicsForUser() {
            this.loading = true;
            try {
                const res = await lessonAPI.getTopicsForUser();

                console.log("API DATA:", res.data); // 👈 debug

                this.currentLevel = res.data.currentLevel;
                this.nextLevel = res.data.nextLevel;
                this.unlockNextLevel = res.data.unlockNextLevel;

                this.currentTopics = res.data.currentTopics || [];
                this.nextTopics = res.data.nextTopics || [];

            } catch (err) {
                console.error(err);
                this.error = "Cannot load topics";
            } finally {
                this.loading = false;
            }
        },

        async fetchLessonDetail(lessonId) {

            this.loading = true

            try {

                const res = await lessonAPI.getLessonDetail(lessonId)

                this.currentLesson = res.data.lesson
                this.currentProgress = res.data.progress

            } catch (err) {

                console.error("Error fetching lesson detail:", err)

            } finally {

                this.loading = false

            }

        },

        async updateLessonProgress(lessonId, score) {

            try {

                const res = await lessonAPI.updateLessonProgress(lessonId, { score })

                if (res.data?.lessonProgress) {

                this.syncUserProgress(res.data.lessonProgress)

                // 🔥 FIX QUAN TRỌNG
                this.currentProgress = res.data.lessonProgress.find(
                    p => String(p.lessonId) === String(lessonId)
                )

                }

                return res.data

            } catch (err) {

                console.error("Failed to update progress", err)
                throw err

            }

            },

       async saveSegmentProgress(lessonId, segmentIndex) {

            try {

                const res = await lessonAPI.saveSegmentProgress(lessonId, segmentIndex)

                if (res.data?.lessonProgress) {

                    this.syncUserProgress(res.data.lessonProgress)

                }

            } catch (err) {

                console.error("Save segment failed", err)

            }

        
        },
        syncUserProgress(progress) {

            const authStore = useAuthStore()

            if (!authStore.user) return

            authStore.user = {
                ...authStore.user,
                lessonProgress: progress
            }

        }
    }
});