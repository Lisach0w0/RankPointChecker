import { createApp } from "vue";
// import "./style.css";
import "bulma/css/bulma.min.css";
import App from "./App.vue";
import { createRouter, createWebHistory } from "vue-router";
import PointChecker from "./views/PointCheckerView.vue";
import Organizer from "./views/OrganizerView.vue";
import Register from "./views/RegisterView.vue";
import { firebaseConfig } from "./config/firebase";
import { initializeApp } from "firebase/app";
import Home from "./views/HomeView.vue";
import CreateCheckerView from "./views/CreateCheckerView.vue";
initializeApp(firebaseConfig);

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", name: "home", component: Home },
    { path: "/checker/:id", name: "checker", component: PointChecker },
    { path: "/create/:id", name: "create", component: CreateCheckerView },
    { path: "/organizer", name: "organizer", component: Organizer },
    { path: "/register", name: "register", component: Register },
  ],
});
createApp(App).use(router).mount("#app");
