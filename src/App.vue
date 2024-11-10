<script setup lang="ts">
import { RouterView, useRouter } from "vue-router";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  User,
} from "firebase/auth";
import { onBeforeMount, reactive } from "vue";

type State = {
  isLogin: boolean;
  currentUser: User | undefined;
  burgerStatus: boolean;
};
const state = reactive<State>({
  isLogin: false,
  currentUser: undefined,
  burgerStatus: false,
});

const auth = getAuth();

// マウント前の処理
onBeforeMount(() => {
  // 認証状態チェック
  auth.onAuthStateChanged((user) => {
    if (user) {
      state.currentUser = user;
      state.isLogin = true;
      console.log("uid", user.uid);
    } else {
      console.log("not login");
    }
  });
});

const router = useRouter();
const signInWithGoogle = () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .then((result) => {
      console.log(result);
      state.currentUser = result.user;
      state.isLogin = true;
      router.push("/organizer");
    })
    .catch((error) => {
      state.isLogin = false;
      console.error(error);
    });
};
const toggleBurgerButton = () => {
  state.burgerStatus = !state.burgerStatus;
  if (state.currentUser) {
    console.log(state.currentUser.uid);
  }
};
</script>

<template>
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <a
        class="navbar-item"
        href="https://www.twitch.tv/Lisach0w0"
        target="_blank"
      >
        <!-- ここにロゴ -->
        Lisach0w0
      </a>

      <!-- ハンバーガーボタン -->
      <a
        role="button"
        :class="['navbar-burger', { 'is-active': state.burgerStatus }]"
        aria-label="menu"
        aria-expanded="false"
        data-target="navbarBasicExample"
        @click="toggleBurgerButton"
      >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>

    <div
      id="navbarBasicExample"
      :class="['navbar-menu', { 'is-active': state.burgerStatus }]"
    >
      <div class="navbar-start">
        <router-link to="/" class="navbar-item">Home</router-link>
        <router-link to="/checker" class="navbar-item">Checker</router-link>
        <router-link v-if="state.isLogin" to="/organizer" class="navbar-item"
          >Manage</router-link
        >
        <a class="navbar-item">PrivacyPolicy</a>
      </div>

      <div class="navbar-end">
        <div class="navbar-item">
          <div class="buttons">
            <a
              v-if="!state.isLogin"
              class="button is-light"
              @click="signInWithGoogle"
              >signInWithGoogle</a
            >
            <a v-else class="button is-info">ログイン中</a>
          </div>
        </div>
      </div>
    </div>
  </nav>
  <!-- router -->
  <RouterView></RouterView>
</template>

<style lang="scss" scoped></style>
