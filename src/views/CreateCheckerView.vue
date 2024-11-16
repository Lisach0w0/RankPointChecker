<script setup lang="ts">
import { reactive, defineProps, onMounted } from "vue";
import { RankOptions, PointCheckerSetting } from "../types";
import draggableComponent from "vuedraggable";
import { getAuth, User } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getFirestore,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { useRouter } from "vue-router";

// props定義
const props = defineProps({
  id: { type: String },
});

type State = {
  pointCheckerSetting: PointCheckerSetting | undefined;
  rankSettingOptions: RankOptions[];
  title: string;
  targetPoint: number;
  user: User | undefined;
  isLoading: boolean;
  isLogin: boolean;
  isEditMode: boolean;
  hasError: boolean;
  message: string;
};

const state = reactive<State>({
  pointCheckerSetting: undefined,
  rankSettingOptions: [],
  title: "",
  targetPoint: 0,
  user: undefined,
  isLoading: true,
  isLogin: false,
  isEditMode: false,
  hasError: false,
  message: "",
});

const auth = getAuth();
const firestoreClient = getFirestore();
const router = useRouter();

onMounted(async () => {
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
  // ログイン失敗している場合は処理を終わってトップへ戻す
  if (!state.isLoading) return;

  console.info("props.id", props.id);
  // IDがある場合は編集モード
  if (props.id) {
    // firebase呼び出し
    // firestore接続
    const rankPointSettingRef = doc(
      firestoreClient,
      `/pointSettings/${props.id}`
    );
    const snapShot = await getDoc(rankPointSettingRef);
    // 特定のランク設定取得
    if (snapShot.exists()) {
      state.pointCheckerSetting = snapShot.data() as PointCheckerSetting;
      state.rankSettingOptions.push(...state.pointCheckerSetting.rankPoints);
      state.title = state.pointCheckerSetting.title;
      state.targetPoint = state.pointCheckerSetting.targetPoint;
      state.isEditMode = true;
    } else {
      state.message = "設定データがありません";
    }
  }
  state.isLoading = false;
});

// ランク設定の行追加
const addRow = () => {
  state.rankSettingOptions.push({ name: "", point: 0 });
};

// ランク設定の行削除
const deleteRow = (index: number) => {
  if (state.rankSettingOptions.length < 1) return;
  state.rankSettingOptions.splice(index, 1);
};

/**
 * 設定内容をfirebaseに保存
 * @param isPublish 保存時に公開設定にするか
 * */
const saveSetting = async (isPublish: boolean) => {
  // TODO 1回確認の画面を出す

  const {
    title,
    rankSettingOptions,
    targetPoint,
    user,
    pointCheckerSetting,
    isEditMode,
  } = state;
  // TODO validate
  if (!user) {
    // ユーザー認証ができてない時はやり直し
    state.message = "ユーザーがログインしていません。";
    return;
  }
  if (isEditMode && !pointCheckerSetting) {
    // 編集モードで元の投稿がない場合は新規作成してしまう
    state.isEditMode = false;
  }

  // 保存データ作成
  const savePointCheckerSetting = {
    id: pointCheckerSetting ? pointCheckerSetting.id : "",
    organizer: user.uid,
    rankPoints: rankSettingOptions,
    targetPoint: targetPoint,
    isPublish: isPublish,
    title: title,
    createdAt: pointCheckerSetting
      ? pointCheckerSetting.createdAt
      : serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  try {
    if (isEditMode) {
      // 編集モードの場合はupdate
      if (savePointCheckerSetting.id === "") {
        state.message = "更新できませんでした";
        return;
      }
      await setDoc(
        doc(firestoreClient, `/pointSettings/${savePointCheckerSetting.id}`),
        savePointCheckerSetting
      );
    } else {
      // 新規作成
      const collectionRef = collection(firestoreClient, "pointSettings");
      const docRef = doc(collectionRef);
      savePointCheckerSetting.id = docRef.id;
      await setDoc(docRef, savePointCheckerSetting);
    }
    await router.push("/organizer");
  } catch (error) {
    console.error(error);
  }
};
</script>

<template>
  <div class="container">
    <div class="title">ポイント設定</div>
    <div v-if="!state.isLoading && state.isLogin">
      <div class="field is-grouped is-grouped-centered input-group-field">
        <div class="field has-addons">
          <p class="control">
            <a class="button is-static"> タイトル </a>
          </p>
          <p class="control">
            <input
              class="input"
              type="text"
              placeholder="ポイント表のタイトル"
              v-model="state.title"
            />
          </p>
        </div>
      </div>
      <div class="field is-grouped is-grouped-centered input-group-field">
        <div class="field has-addons">
          <p class="control">
            <a class="button is-static"> ポイント上限 </a>
          </p>
          <p class="control">
            <input
              class="input"
              type="number"
              placeholder="ポイント上限"
              v-model="state.targetPoint"
            />
          </p>
        </div>
      </div>

      <draggableComponent
        v-model="state.rankSettingOptions"
        item-key="id"
        handle=".handle"
      >
        <template #item="{ element, index }">
          <div class="field is-grouped is-grouped-centered input-group-field">
            <div class="handle" style="cursor: move">三</div>
            <div class="control">
              <input
                class="input"
                type="text"
                placeholder="ランク名"
                v-model="element.name"
              />
            </div>
            <div class="control">
              <input
                class="input"
                type="number"
                placeholder="ランク名"
                v-model="element.point"
              />
            </div>
            <div class="control">
              <button class="button is-danger" @click="deleteRow(index)">
                削除
              </button>
            </div>
          </div>
        </template>
        <!-- <button slot="header" class="button">Add</button> -->
      </draggableComponent>
      <div class="section field is-grouped is-grouped-centered">
        <button class="button is-success" style="width: 200px" @click="addRow">
          行を追加
        </button>
      </div>
      <div class="field is-grouped is-grouped-centered">
        <button class="button is-info" @click="saveSetting(false)">保存</button>
        <button class="button is-primary" @click="saveSetting(true)">
          保存して公開
        </button>
      </div>
    </div>

    <div v-else-if="!state.isLoading && !state.isLogin">
      <!-- ログインエラーメッセージ -->
    </div>
    <div v-else>
      <!-- ローディング中..... -->
      <p>ロード中......</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
// 行動かすときに背景色を変える
// .input-group-field:hover {
//   // background-color: #826cff
// }
</style>
