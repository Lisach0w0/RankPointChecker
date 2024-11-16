<script setup lang="ts">
import { getAuth, User } from "firebase/auth";
import { onMounted, reactive } from "vue";

type State = {
  isLoading: boolean;
  isLogin: boolean;
  user: User | undefined;
  message: string;
};

const state = reactive<State>({
  isLoading: true,
  isLogin: false,
  user: undefined,
  message: "",
});

// ユーザー情報取得
const auth = getAuth();

onMounted(() => {
  state.isLoading = true;
  auth.onAuthStateChanged((user) => {
    if (user) {
      state.user = user;
      state.isLogin = true;
      console.log("uid", user.uid);
    } else {
      console.log("not login");
      state.message =
        "ログインできていません。最初に戻ってもう一度ログインしてください。";
      state.isLoading = false;
    }
  });
  if (!state.isLoading) return;
});
// firestoreの自分の作ったものリスト取得

// ユーザー情報更新処理
// 新規作成でページ遷移処理
// 更新でページ遷移処理
</script>

<template>
  <div>aaaa</div>
</template>

<style lang="scss" scoped></style>
