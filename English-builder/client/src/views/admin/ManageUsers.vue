<template>
    <div class="p-6">
        <h1 class="text-2xl font-bold mb-6 text-center">Manage Users</h1>

        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
            <!-- Tabs -->
            <div class="flex bg-gray-100 rounded-lg p-1">
                <button
                    @click="activeTab = 'user'"
                    :class="tabClass('user')"
                    class="text-base"
                    title="User tab"
                    >
                    <font-awesome-icon icon="user" class="mr-2" />
                    Users
                </button>

                <button
                    @click="activeTab = 'admin'"
                    :class="tabClass('admin')"
                    title="Admin tab"
                    >
                    <font-awesome-icon icon="user-shield" class="mr-2" />
                    Admins
                </button>
            </div>

            <!-- Add user -->
            <button
                @click="showModal = true"
                class="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow transition text-base"
                title="Add new user"
            >
                
                <font-awesome-icon icon="user-plus" />
            </button>
            </div>
        
        <!-- Search -->
        <div class="flex flex-wrap gap-4 mb-6 items-center">

            <!-- Search keyword -->
            <div class="relative w-64">
                <font-awesome-icon
                icon="magnifying-glass"
                class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                v-model="filters.keyword"
                placeholder="Search ..."
                class="pl-10 pr-3 py-2 w-full border rounded-lg text-base"
                />
            </div>

            <!-- Level -->
            <select
                v-if="activeTab === 'user'"
                v-model="filters.level"
                @change="fetchUsers"
                class="px-3 py-2 border rounded-lg text-base"
            >
                <option value="">All Levels</option>
                <option value="A1">A1</option>
                <option value="A2">A2</option>
                <option value="B1">B1</option>
                <option value="B2">B2</option>
                <option value="C1">C1</option>
            </select>

            <!-- Sort -->
            <select
                v-model="filters.sort"
                @change="fetchUsers"
                class="px-3 py-2 border rounded-lg text-base"
            >
                <option value="">Sort</option>
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="email">Email A–Z</option>
            </select>
            </div>
        <!-- Add User Modal -->
        <Transition name="fade">
            <div
            v-if="showModal"
            class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
            @click.self="showModal = false"
            >
            <div class="bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden transform transition-all">
                
                <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/50">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <font-awesome-icon icon="user-plus" class="text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                    <h2 class="text-xl font-semibold text-gray-800 dark:text-white">Add New User</h2>
                    <p class="text-sm text-gray-500">Create a new account for your platform</p>
                    </div>
                </div>
                <button @click="showModal = false" class="text-gray-400 hover:text-gray-600 transition-colors">
                    <font-awesome-icon icon="times" />
                </button>
                </div>

                <div class="p-6 space-y-5">
                <div class="space-y-1">
                    <label class="text-base font-semibold text-gray-700 dark:text-gray-300 ml-1">Username</label>
                    <div class="relative">
                    <input 
                        v-model="form.username" 
                        type="text"
                        placeholder="e.g. johndoe" 
                        class="w-full pl-4 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-800 dark:text-white"
                    />
                    <p v-if="errors.username" class="text-red-500 text-base mt-1">
                        {{ errors.username }}
                        </p>
                    </div>
                </div>

                <div class="space-y-1">
                    <label class="text-base font-semibold text-gray-700 dark:text-gray-300 ml-1">Email Address</label>
                    <input 
                    v-model="form.email" 
                    type="email"
                    placeholder="name@example.com" 
                    class="w-full pl-4 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-800 dark:text-white"
                    />
                    <p v-if="errors.email" class="text-red-500 text-base mt-1">
                        {{ errors.email }}
                        </p>
                </div>

                <div class="space-y-1">
                    <label class="text-base font-semibold text-gray-700 dark:text-gray-300 ml-1">Password</label>
                    <input 
                    v-model="form.password" 
                    type="password"
                    placeholder="••••••••" 
                    class="w-full pl-4 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-800 dark:text-white"
                    />
                    <p v-if="errors.password" class="text-red-500 text-base mt-1">
                        {{ errors.password }}
                        </p>
                </div>

                <div class="space-y-1">
                    <label class="text-base font-semibold text-gray-700 dark:text-gray-300 ml-1">User Role</label>
                    <select 
                    v-model="form.role" 
                    class="w-full pl-4 pr-10 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none text-gray-800 dark:text-white"
                    >
                    <option value="user">Standard User</option>
                    <option value="admin">Administrator</option>
                    </select>
                </div>
                </div>

                <div class="px-6 py-4 bg-gray-50 dark:bg-gray-800/80 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3 mt-2">
                <button 
                    @click="showModal = false"
                    class="px-5 py-2.5 rounded-xl text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                    Cancel
                </button>
                <button 
                    @click="addUser"
                    class="px-8 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-200 dark:shadow-none transition-all transform active:scale-95"
                >
                    Create User
                </button>
                </div>
            </div>
            </div>
        </Transition>

        <!-- edit model -->
        <Transition name="fade">
            <div
            v-if="showEditModal"
            class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
            @click.self="showEditModal = false"
            >
            <div class="bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden transform transition-all">
                
                <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between bg-blue-50/30 dark:bg-gray-800/50">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center">
                    <font-awesome-icon icon="user-pen" class="text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                    <h2 class="text-xl font-semibold text-gray-800 dark:text-white">Edit User</h2>
                    <p class="text-sm text-gray-500">Update account information and permissions</p>
                    </div>
                </div>
                <button @click="showEditModal = false" class="text-gray-400 hover:text-gray-600 transition-colors">
                    <font-awesome-icon icon="times" />
                </button>
                </div>

                <div class="p-6 space-y-4">
                <div class="space-y-1">
                    <label class="text-base font-semibold text-gray-700 dark:text-gray-300 ml-1">Username</label>
                    <input 
                    v-model="editForm.username" 
                    type="text"
                    class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                    />
                </div>

                <div class="space-y-1">
                    <label class="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Email Address</label>
                    <input 
                    v-model="editForm.email" 
                    type="email"
                    class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                    />
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div class="space-y-1">
                    <label class="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Role</label>
                    <select 
                        v-model="editForm.role" 
                        class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white appearance-none"
                    >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                    </div>

                    <div class="space-y-1">
                    <label class="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Level</label>
                    <input 
                        v-model="editForm.level" 
                        type="number"
                        class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                    />
                    </div>
                </div>
                </div>

                <div class="px-6 py-4 bg-gray-50 dark:bg-gray-800/80 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3">
                <button 
                    @click="showEditModal = false"
                    class="px-5 py-2.5 rounded-xl text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                    Cancel
                </button>
                <button 
                    @click="saveEdit"
                    class="px-8 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-200 dark:shadow-none transition-all transform active:scale-95"
                >
                    Update Changes
                </button>
                </div>
            </div>
            </div>
        </Transition>

        <!-- Table -->
        <div class="bg-white rounded shadow overflow-x-auto">
        <table class="w-full">
            <thead class="bg-gray-100">
                <tr>
                    <th class="p-3 w-40 text-sm font-semibold">Username</th>
                    <th class="p-3 w-40 text-sm font-semibold">Email</th>
                    <th class="p-3 w-32 text-sm font-semibold">Role</th>
                    <th v-if="activeTab === 'user'" class="p-3 w-24 text-sm font-semibold">Level</th>
                    <th class="p-3 w-32 text-sm font-semibold">Created At</th>
                    <th class="p-3 w-32 text-sm font-semibold text-center">Actions</th>
                </tr>
            </thead>

            <tbody>
            <tr
                v-for="user in filteredUsers"
                :key="user._id"
                class="border-t"
            >
                <td class="p-3 text-base ">{{ user.username }}</td>
                <td class="p-3 text-base">{{ user.email }}</td>
                <td class="p-3 text-base capitalize">{{ user.role }}</td>
                <td 
                    v-if="activeTab === 'user'"
                    class="p-3 text-base">{{ user.level || "-" }}</td>
                <td class="p-3 text-base">{{ new Date(user.createdAt).toLocaleDateString() }}</td>
                <td class="p-3 flex justify-center gap-4">
                    <button
                        @click="openEdit(user)"
                        class="text-yellow-600 hover:text-yellow-800 transition"
                        title="Edit user"
                        >
                        <font-awesome-icon icon="user-pen" />
                    </button>
                    <button
                        @click="removeUser(user._id)"
                        class="text-red-600 hover:text-red-800 transition"
                        title="Delete user"
                    >
                        <font-awesome-icon icon="trash" />
                    </button>
                </td>
            </tr>
            </tbody>
        </table>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { getAllUsers, updateUser, deleteUser, createUser } from "../../api/admin.js";

const users = ref([]);
const activeTab = ref("user");
const showModal = ref(false);
const showEditModal = ref(false);
const editingUser = ref(null);
const errors= ref({});

// Add User Form
const form = ref({
    username: "",
    email: "",
    password: "",
    role: "user",
});
// Add User
const addUser = async () => {
    errors.value = {};
    try{await createUser(form.value);
    showModal.value = false;
    form.value = {
    username: "",
    email: "",
    password: "",
    role: "user",
    };
    fetchUsers();
    }catch (err) {
            const resErrors = err.response?.data?.errors;

            if (resErrors) {
                errors.value = resErrors;
            } else {
                alert(err.response?.data?.message || "Something went wrong");
            }
        }
    
};
// Edit User Form
const editForm = ref({
    username: "",
    email: "",
    role: "user",
    level: null,
});
// Open Edit Modal
const openEdit = (user) => {
    editingUser.value = user;
    editForm.value = {
        username: user.username,
        email: user.email,
        role: user.role,
        level: user.level,
    };
    showEditModal.value = true;
};
// Save Edit
const saveEdit = async () => {
    await updateUser(editingUser.value._id, editForm.value);
    showEditModal.value = false;
    fetchUsers();
};

// Search Input
const filters = ref({
    keyword: "",
    role: "",
    level: "",
    sort: "",
});
// Tab Class
const tabClass = (tab) =>
    activeTab.value === tab
    ? "px-4 py-2 bg-white rounded-lg shadow text-blue-600 font-semibold flex items-center"
    : "px-4 py-2 text-gray-600 hover:text-blue-600 transition flex items-center";

const fetchUsers = async () => {
    const res = await getAllUsers();
    users.value = res.data;
};

const filteredUsers = computed(() => {
    let result = [...users.value];

    // Filter theo tab (role)
    if (activeTab.value) {
        result = result.filter(u => u.role === activeTab.value);
    }

    // Search keyword
    if (filters.value.keyword) {
    const keyword = filters.value.keyword.toLowerCase();

    result = result.filter(u =>
        u.username?.toLowerCase().includes(keyword) ||
        u.email?.toLowerCase().includes(keyword) ||
        u.role?.toLowerCase().includes(keyword) ||
        u.level?.toLowerCase().includes(keyword)
    );
}

    // Filter level
    if (filters.value.level) {
        result = result.filter(u =>
            u.level && u.level === filters.value.level
        );
    }

    // Sort
    switch (filters.value.sort) {
        case "newest":
            result.sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );
            break;

        case "oldest":
            result.sort(
                (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
            );
            break;

        case "email":
            result.sort((a, b) =>
                a.email.localeCompare(b.email)
            );
            break;
    }

    return result;
});



const toggleRole = async (user) => {
    const newRole = user.role === "user" ? "admin" : "user";
    await updateUser(user._id, { role: newRole });
    fetchUsers();
};

const removeUser = async (id) => {
    if (confirm("Delete this user?")) {
    await deleteUser(id);
    fetchUsers();
    }
};



onMounted(fetchUsers);

</script>
<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.fade-enter-active .transform {
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.fade-enter-from .transform {
    transform: scale(0.9) translateY(20px);
}
.fade-leave-active .transform {
    transition: all 0.2s ease-in;
}

</style>