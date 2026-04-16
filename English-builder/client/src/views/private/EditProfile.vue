<template>
    <div class="p-6 max-w-2xl mx-auto">
        <h1 class="text-2xl font-bold mb-6 text-center">Edit Profile</h1>

        <div class="bg-white p-6 rounded shadow space-y-4">

        <!-- Avatar preview -->
        <div class="flex items-center gap-4">
            <img
            :src="avatarUrl"
            class="w-20 h-20 rounded-full border"
            />
            <p class="text-sm text-gray-500">
            Avatar is generated automatically from your name.
            </p>
        </div>

        <!-- Username -->
        <div>
            <label class="block font-semibold text-base mb-1">
            User name
            </label>
            <input
            v-model="form.username"
            class="w-full border px-3 py-2 rounded text-base"
            placeholder="Enter your name"
            />
        </div>

        <!-- Email (readonly) -->
        <div>
            <label class="block font-semibold text-base mb-1">
            Email
            </label>
            <input
            :value="user.email"
            disabled
            class="w-full border px-3 py-2 rounded bg-gray-100 cursor-not-allowed text-base"
            />
        </div>

        <!-- Actions -->
        <div class="flex justify-end gap-3 pt-4">
            <button
            class="px-4 py-2 border rounded text-base"
            @click="goBack"
            >
            Cancel
            </button>

            <button
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-base"
            @click="saveProfile"
            >
            Save changes
            </button>
        </div>

        <p
            v-if="success"
            class="text-green-600 text-base"
        >
            Profile updated successfully
        </p>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import api from "../../api/api.js";
import { useAuthStore } from "../../stores/authStore.js";

const router = useRouter();
const auth = useAuthStore();

const user = ref({});
const form = ref({
    username: "",
    });

    const success = ref(false);

    onMounted(async () => {
    const res = await api.get("/users/me");
    user.value = res.data;
    form.value.username = res.data.username;
    });

    const avatarUrl = computed(() =>
    "https://ui-avatars.com/api/?size=128&name=" +
    encodeURIComponent(form.value.username || "User")
    );

    const saveProfile = async () => {
        console.log("Saving profile...", form.value);

        await api.put("/users/me", {
            username: form.value.username,
        });

        await auth.fetchUser();
        success.value = true;

        setTimeout(() => {
            router.push("/app/profile");
        }, 800);
        };

    const goBack = () => {
    router.push("/app/profile");
    };
</script>
