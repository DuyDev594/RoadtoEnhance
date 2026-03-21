import { defineStore } from "pinia";

export const useThemeStore = defineStore("theme", {
    state: () => ({
        // Khi khởi tạo, kiểm tra xem trong localStorage đã lưu 'dark' chưa
        isDark: localStorage.getItem("theme") === "dark",
    }),

    actions: {
        toggleTheme() {
            this.isDark = !this.isDark;
            // Sau khi đổi trạng thái, phải lưu ngay vào localStorage
            localStorage.setItem("theme", this.isDark ? "dark" : "light");
            this.applyTheme();
        },

        applyTheme() {
            const html = document.documentElement;
            if (this.isDark) {
                html.classList.add("dark");
            } else {
                html.classList.remove("dark");
            }
        },
    },
});