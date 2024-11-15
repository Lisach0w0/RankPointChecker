<script setup lang="ts">
import { reactive } from 'vue';
import { RankOptions } from '../types';
import draggableComponent from 'vuedraggable';


type State = {
  rankSettings: RankOptions[];
};

const state = reactive<State>({
  rankSettings: [{ name: "ブロンズ", point: 10},{name: "しるばー", point: 20}],
});

</script>

<template>
  <div class="container">
    <div class="title">ポイント設定</div>
  </div>
  <draggableComponent v-model="state.rankSettings" item-key="id" handle=".handle">
    <template #item="{element,index}">
    <div class="handle">
      <div class="control">{{ index }}</div>
      <div class="control"><input class="input" type="text" placeholder="ランク名" v-model="element.name"/></div>
      <div class="control"><input class="input" type="number" placeholder="ランク名" v-model="element.point"/></div>
    </div>
    </template>
    <button slot="header" class="button">Add</button>

  </draggableComponent>

</template>

<style lang="scss" scoped></style>
