<script setup lang="ts">
import ItemWrap from "@/components/item-wrap";
import LeftTop from "./left-top.vue";
import LeftCenter from "./left-center.vue";
import LeftBottom from "./left-bottom.vue";
import CenterMap from "./center-map.vue";
import CenterBottom from "./center-bottom.vue";
import RightTop from "./right-top.vue";
import RightCenter from "./right-center.vue";
import RightBottom from "./right-bottom.vue";
</script>

<template>
  <div class="index-box">
    <div class="contetn_left">
      <ItemWrap class="contetn_lr-item" title="游戏成瘾干预样本监测">
        <LeftTop />
      </ItemWrap>

      <ItemWrap class="contetn_lr-item" title="成瘾性消费阶层画像">
        <LeftCenter />
      </ItemWrap>

      <ItemWrap class="contetn_lr-item" title="高危诱导实时监测" style="padding: 0 10px 16px 10px">
        <LeftBottom />
      </ItemWrap>
    </div>

    <div class="contetn_center">
      <CenterMap class="contetn_center_top" title="诱导机制受众地域辐射" />
      <ItemWrap class="contetn_center-bottom" title="付费诱导机制曝光转化审计">
        <CenterBottom />
      </ItemWrap>
    </div>

    <div class="contetn_right">
      <ItemWrap class="contetn_lr-item" title="非理性付费波动轨迹">
        <RightTop />
      </ItemWrap>

      <ItemWrap class="contetn_lr-item" title="暗黑模式强度排行" style="padding: 0 10px 16px 10px">
        <RightCenter />
      </ItemWrap>

      <ItemWrap class="contetn_lr-item" title="高频成瘾行为实时审计">
        <RightBottom />
      </ItemWrap>
    </div>
  </div>
</template>

<style scoped lang="scss">
.index-box {
  width: 100%;
  display: flex;
  min-height: calc(100% - 64px);
  justify-content: space-between;
}

//左边 右边 结构一样
.contetn_left,
.contetn_right {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  position: relative;
  width: 540px;
  box-sizing: border-box;
  flex-shrink: 0;
}

.contetn_center {
  flex: 1;
  margin: 0 54px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;

  .contetn_center-bottom {
    height: 315px;
  }
}

.contetn_lr-item {
  height: 310px;
}
</style>
