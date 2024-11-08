import { createApp } from "vue";
// import "./style.css";
import "bulma/css/bulma.min.css";
import App from "./App.vue";
import { createRouter, createWebHistory } from "vue-router";
import PointChecker from "./views/PointCheckerView.vue";
import Organizer from "./views/OrganizerView.vue";
import Register from "./views/RegisterView.vue";
import {firebaseConfig } from "./config/firebase";
import { initializeApp } from "firebase/app";
initializeApp(firebaseConfig);

console.log(firebaseConfig);
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", name: "home", component: PointChecker },
    { path: "/organizer", name: "page1", component: Organizer },
    { path: "/register", name: "page2", component: Register },
  ],
});
createApp(App).use(router).mount("#app");
