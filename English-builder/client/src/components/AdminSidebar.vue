<template>
    <aside class="w-64 bg-gray-900 text-white flex flex-col justify-between">
        <!-- Top -->
        <div class="p-5 space-y-6">
        <!-- Admin info -->
        <div class="flex flex-col items-center space-y-2">
            <img
            :src="avatarUrl"
            class="w-20 h-20 rounded-full border-2 border-gray-700"
            />
            <p class="font-semibold">
            {{ auth.user?.username || "Admin" }}
            </p>
            <p class="text-sm text-gray-400">Administrator</p>
        </div>

        <!-- Menu -->
        <nav class="space-y-1">
            <RouterLink to="/admin/users" class="menu-item" active-class="active">
            <font-awesome-icon icon="users" />
            <span>Manage Users</span>
            </RouterLink>

            <RouterLink to="/admin/test" class="menu-item" active-class="active">
            <font-awesome-icon icon="spell-check" />
            <span>Manage Tests</span>
            </RouterLink>

            <RouterLink to="/admin/lessons" class="menu-item" active-class="active">
            <font-awesome-icon icon="list" />
            <span>Manage Lessons</span>
            </RouterLink>

            <RouterLink to="/admin/topics" class="menu-item" active-class="active">
            <font-awesome-icon icon="book" />
            <span>Manage Topics</span>
            </RouterLink>

            
            <RouterLink
            to="/admin/flashcards"
            class="menu-item"
            active-class="active"
            >
            <font-awesome-icon icon="brain" />
            <span>Manage Flashcards</span>
            </RouterLink>

            <RouterLink to="/admin/videos" class="menu-item" active-class="active">
            <font-awesome-icon icon="video" />
            <span>Manage Videos</span>
            </RouterLink>

        </nav>
        </div>

        <!-- Bottom -->
        <div class="p-5 border-t border-gray-700">
        <button
            @click="logout"
            class="w-full flex items-center gap-3 px-4 py-2 rounded bg-red-600 hover:bg-red-700"
        >
            <font-awesome-icon icon="right-from-bracket" />
            <span>Logout</span>
        </button>
        </div>
    </aside>
</template>


<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/authStore.js";

const auth = useAuthStore();
const router = useRouter();

const avatarUrl = computed(() =>
    "https://ui-avatars.com/api/?size=128&background=1f2937&color=fff&name=" +
    encodeURIComponent(auth.user?.username || "Admin")
);

const logout = () => {
    const confirmed = window.confirm("Are you sure you want to log out?");
    if (confirmed) {
        auth.logout();
        router.push("/");
    }

};
</script>

<style scoped>
.menu-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border-radius: 6px;
    color: #e5e7eb;
}

.menu-item:hover {
    background-color: #374151;
}

.active {
    background-color: #2563eb;
}
</style>
