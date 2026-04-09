<script setup lang="ts">
import { ref, onMounted } from "vue";
import CapsuleChart from "@/components/datav/capsule-chart";
import { ranking } from "@/api";
import { ElMessage } from "element-plus";

const config = ref({
  showValue: true,
  unit: "次",
  colors: [
    "#B85C00",
    "#D96D00",
    "#F58200",
    "#FF9500",
    "#FFAA33",
    "#FFBF66",
    "#FFD499",
    "#FFE3BF",
  ],
});

const data = ref([]);

const getData = () => {
  ranking()
    .then((res) => {
      if (res.success) {
        // 直接赋值 Mock 返回的排序好的数组
        data.value = res.data;
      } else {
        ElMessage.warning(res.msg);
      }
    })
    .catch((err) => {
      ElMessage.error("获取排名数据失败");
    });
};

onMounted(() => {
  getData();
});
</script>

<template>
  <div class="right_center_wrap">
    <CapsuleChart :config="config" style="width: 100%; height: 320px" :data="data" />
  </div>
</template>

<style scoped lang="scss">
.right_center_wrap {
  box-sizing: border-box;
  padding: 10px 16px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>