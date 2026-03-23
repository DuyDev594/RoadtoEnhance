import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/authStore.js";

// Layouts
import PublicLayout from "../layouts/PublicLayout.vue";
import AuthLayout from "../layouts/AuthLayout.vue";


// Public pages
import About from "../views/public/About.vue";
import Videos from "../views/public/Videos.vue";


// Auth pages
import Login from "../views/auth/Login.vue";
import Register from "../views/auth/Register.vue";

// Private pages
import AI from "../views/private/AI.vue";
import Lessons from "../views/private/Lessons.vue";
import PlacementTest from "../views/private/PlacementTest.vue";
import lessonList from "../views/private/LessonList.vue";
import LessonDetail from "../views/private/LessonDetail.vue";
import Flashcards from "../views/private/Flashcards.vue";
import Profile from "../views/private/Profile.vue";
import EditProfile from "../views/private/EditProfile.vue";

//admin pages
import AdminLayout from "../layouts/AdminLayout.vue";
import ManageUsers from "../views/admin/ManageUsers.vue";
import ManageLessons from "../views/admin/ManageLessons.vue";
import ManageFlashcards from "../views/admin/ManageFlashcards.vue";
import ManageVideos from "../views/admin/ManageVideos.vue";
import AdminProfile from "../views/admin/AdminProfile.vue";
import ManageTest from "../views/admin/ManageTest.vue";
import ManageTopics from "../views/admin/ManageTopics.vue";
import LessonAdminDetail from "../views/admin/LessonAdminDetail.vue";

const routes = [
    {
        path: "/",
        component: PublicLayout,
        children: [
        { path: "", component: About },
        { path: "videos", component: Videos },
        
        ],
    },

    {
        path: "/auth",
        component: PublicLayout,
        children: [
        { path: "login", component: Login },
        { path: "register", component: Register },
        ],
    },

    {
        path: "/app",
        component: AuthLayout,
        meta: { requiresAuth: true, role: "user" },
        children: [
        {path: "ai-writing", component: AI,
        children: [
            {
            path: "",
            component: () => import("@/components/AI/AIWritingDashboard.vue")
            },
            {
            path: "practice",
            component: () => import("@/components/AI/AIWriting.vue")
            }
        ]
        },
        { path: "lessons", component: Lessons },
        { path: "lessons/:topicId", component: lessonList },
        { path: "lesson/:id", name: "LessonDetail", component: LessonDetail },
        { path: "profile", component: Profile },
        { path: "profile/edit", component: EditProfile },
        { path: "placement-test", component: PlacementTest, meta: { requiresAuth: true }},
        { path: "flashcards", component: Flashcards },
        ],
    },

    {
    path: "/admin",
    component: AdminLayout,
    meta: { requiresAuth: true, role: "admin" },
    children: [
        { path: "users", component: ManageUsers },
        { path: "lessons", component: ManageLessons },
        { path: "flashcards", component: ManageFlashcards },
        { path: "videos", component: ManageVideos },
        { path: "profile", component: AdminProfile },
        { path: "test", component: ManageTest },
        { path: "topics", component: ManageTopics },
        { path: "lessons/:id", component: LessonAdminDetail },
    ]
    },

    


];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach(async (to, from, next) => {
    const auth = useAuthStore();

    if (auth.token && !auth.user) {
        try {
        await auth.fetchUser();
        } catch (e) {
        return next("/auth/login");
        }
    }

    if (to.meta.requiresAuth && !auth.isAuthenticated) {
        return next("/auth/login");
    }

    if (to.meta.role && auth.user?.role !== to.meta.role) {
        return next("/");
    }

    next();
});


export default router;