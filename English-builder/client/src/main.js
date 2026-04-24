import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import { useAuthStore } from "./stores/authStore.js";
import "./assets/main.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import Toast from "vue-toastification"
import "vue-toastification/dist/index.css"


import {
    faUser,
    faBook,
    faBrain,
    faVideo,
    faUserGear,
    faRightFromBracket,
    faUserShield,
    faUserPlus,
    faTrash,
    faRepeat,
    faUserPen,
    faSpellCheck,
    faMagnifyingGlass,
    faPlus,
    faPenToSquare,
    faArrowRotateRight,
    faMoon,
    faCircle,
    faHeading,
    faCircleInfo,
    faList,
    faUsers,
    faCirclePlus,
    faCircleMinus,
    faBullseye,
    faChartLine,
    faBan,
    faCheck,
    faInfo,
    faHeadphones,
    faFile,
    faLightbulb,
    faXmark,
    faLock,
    faVolumeHigh,
    faClock
} from "@fortawesome/free-solid-svg-icons";

library.add(
    faUser,
    faUsers,
    faBook,
    faBrain,
    faVideo,
    faUserGear,
    faRightFromBracket,
    faUserShield,
    faUserPlus,
    faTrash,
    faRepeat,
    faUserPen,
    faSpellCheck,
    faMagnifyingGlass,
    faPlus,
    faPenToSquare,
    faArrowRotateRight,
    faCircle,
    faMoon,
    faHeading,
    faCircleInfo,
    faList,
    faCirclePlus,
    faCircleMinus,
    faBullseye,
    faChartLine,
    faBan,
    faCheck,
    faInfo,
    faHeadphones,
    faFile,
    faLightbulb,
    faXmark,
    faLock,
    faVolumeHigh,
    faClock,
    
);

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.component("font-awesome-icon", FontAwesomeIcon);
app.use(Toast);
const auth = useAuthStore();

if (auth.token && !auth.user) {
    auth.fetchUser();
}



app.mount("#app");
