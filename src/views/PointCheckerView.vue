<script setup lang="ts">
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { computed, reactive } from "vue";
import { PointCheckerSetting, RankOptions } from "../types";

// props定義
const props = defineProps({
  id: { type: String },
});

// state定義
type State = {
  players: { name: string; label: string; point: number }[];
  targetPoint: number;
  totalPoint: number;
  isError: boolean;
};

const state = reactive<State>({
  // プレイヤーのリスト
  players: [
    { name: "1人目", label: "select", point: 0 },
    { name: "2人目", label: "select", point: 0 },
    { name: "3人目", label: "select", point: 0 },
    { name: "4人目", label: "select", point: 0 },
    { name: "5人目", label: "select", point: 0 },
  ],
  // 目標ポイント
  targetPoint: 250,
  // 合計ポイント
  totalPoint: 0,
  // エラーかどうか
  isError: false,
});

// ランクポイント設定
let rankPointOptions: RankOptions[] = [];

// firebase呼び出し
const firestoreClient = getFirestore();
// firestore接続
const rankPointSettingRef = doc(firestoreClient, `/pointSettings/${props.id}`);
const snapShot = await getDoc(rankPointSettingRef);
// 特定のランク設定取得
if (!snapShot.exists()) {
  console.error("data not found");
  state.isError = true;
  rankPointOptions = [
    { name: "未選択", point: 0 },
    { name: "ブロンズ", point: 10 },
    { name: "シルバー", point: 20 },
    { name: "ゴールド", point: 30 },
    { name: "プラチナ", point: 40 },
    { name: "ダイヤ", point: 50 },
    { name: "マスター", point: 60 },
    { name: "グラマス", point: 70 },
    { name: "チャンピオン", point: 80 },
    { name: "OWCS経験者", point: 100 },
  ];
} else {
  const rankPointSetting = snapShot.data() as PointCheckerSetting;
  rankPointOptions = rankPointSetting.rankPoints;
  rankPointOptions.unshift({ name: "no select", point: 0 });
  state.targetPoint = rankPointSetting.targetPoint;
}

// メンバーのランクポイント計算(watchしたいなぁ)
const updateTotalPoint = () => {
  state.totalPoint = state.players.reduce((sum, item) => sum + item.point, 0);
};

// メンバー追加ボタン
const addMember = () => {
  state.players.push({ name: "参加者", label: "select", point: 0 });
};

// メンバー削除ボタン
const removeMember = (index: number) => {
  state.players.splice(index, 1);
  updateTotalPoint();
};

// ポイントが上限を超えていないかチェック
const isOverflow = computed(() => {
  return state.targetPoint - state.totalPoint < 0;
});
</script>

<template>
  <div class="container is-max-tablet">
    <section class="hero is-link">
      <div class="hero-body">
        <p class="title">ランクポイント計算ツール</p>
        <p class="subtitle">created by Lisach0w0</p>
      </div>
    </section>
    <section v-if="!state.isError">
      <section class="section">
        <div
          v-for="(player, index) in state.players"
          :key="index"
          class="columns is-centered"
        >
          <div
            class="column is-2 is-size-4 has-text-centered has-text-justified"
          >
            {{ index + 1 }}人目
          </div>
          <div class="column is-narrow">
            <div class="select">
              <select v-model="player.point" @change="updateTotalPoint">
                <option
                  v-for="rank in rankPointOptions"
                  :key="rank.name"
                  :value="rank.point"
                >
                  {{ rank.name }} {{ rank.point }}pt
                </option>
              </select>
            </div>
          </div>
          <div class="column is-2">
            <button
              class="button is-danger is-outlined"
              @click="removeMember(index)"
              :disabled="state.players.length == 1"
            >
              <span>削除</span>
              <!-- <span class="icon is-small">
            <i class="fas fa-times"></i>
          </span> -->
            </button>
          </div>
        </div>
        <div class="columns is-centered">
          <div class="column is-narrow">
            <button
              class="button is-success"
              style="width: 200px"
              @click="addMember"
            >
              追加
            </button>
          </div>
        </div>
      </section>
      <p class="is-size-3 has-text-centered">
        合計ポイント: {{ state.totalPoint }}
      </p>
      <div class="is-size-5">
        <p v-show="isOverflow" class="has-text-danger has-text-centered">
          ポイントが多すぎます!!!
        </p>
      </div>
      <p class="is-size-3 has-text-centered">
        ポイント上限: {{ state.targetPoint }}
      </p>
    </section>
    <section v-else class="section">
      <div class="notification is-danger is-light">
        エラー！データがありません！！！
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
// .select {
//   width: 200px;
//   font-size: 20px;
// }
.addButton {
  background-color: #4cff29;
}
.removeButton {
  background-color: #ff2a2aaa;
}
</style>
