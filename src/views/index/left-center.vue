<script setup lang="ts">
import { ref, reactive } from "vue";
import { graphic } from "echarts/core";
import { countUserNum } from "@/api";
import { ElMessage } from "element-plus";

// 修改颜色配置，增强对比度
let colors = ["#0BFC7F", "#626cbe", "#F48C02", "#F4023C"];
const option = ref({});
const state = reactive({
  lockNum: 0,    // 映射为：中度进阶
  offlineNum: 0, // 映射为：轻度微氪
  onlineNum: 0,  // 映射为：零氪玩家
  alarmNum: 0,   // 映射为：高风险重氪
  totalNum: 0,
});

const echartsGraphic = (colors: string[]) => {
  return new graphic.LinearGradient(1, 0, 0, 0, [
    { offset: 0, color: colors[0] },
    { offset: 1, color: colors[1] },
  ]);
};

const getData = () => {
  countUserNum().then((res) => {
    if (res.success) {
      state.lockNum = res.data.lockNum;
      state.offlineNum = res.data.offlineNum;
      state.onlineNum = res.data.onlineNum;
      state.totalNum = res.data.totalNum;
      state.alarmNum = res.data.alarmNum;
      setOption();
    } else {
      ElMessage.error(res.msg);
    }
  }).catch(err => {
    ElMessage.error(err);
  });
};

getData();

const setOption = () => {
  option.value = {
    title: {
      top: "center",
      left: "center",
      text: [`{value|${state.totalNum}}`, "{name|样本总数}"].join("\n"),
      textStyle: {
        rich: {
          value: {
            color: "#ffffff",
            fontSize: 24,
            fontWeight: "bold",
            lineHeight: 20,
            padding: [4, 0, 4, 0]
          },
          name: {
            color: "#ffffff",
            lineHeight: 20,
          },
        },
      },
    },
    tooltip: {
      trigger: "item",
      backgroundColor: "rgba(0,0,0,.6)",
      borderColor: "rgba(147, 235, 248, .8)",
      textStyle: { color: "#FFF" },
      // 自定义 tooltip 显示业务含义
      formatter: (params: any) => {
        return `${params.seriesName}<br/>${params.name}：${params.value}人 (${params.percent}%)`;
      }
    },
    series: [
      {
        name: "氪金画像分类",
        type: "pie",
        radius: ["40%", "70%"],
        itemStyle: {
          borderRadius: 6,
          borderColor: "rgba(255,255,255,0)",
          borderWidth: 2,
        },
        color: colors,
        label: {
          show: true,
          // 这里的 {b} 对应 data 里的 name
          formatter: "   {b|{b}}   \n   {c|{c}人}   {per|{d}%}  ",
          rich: {
            b: { color: "#fff", fontSize: 12, lineHeight: 26 },
            c: { color: "#31ABE3", fontSize: 14 },
            per: { color: "#31ABE3", fontSize: 14 },
          },
        },
        emphasis: { show: false },
        data: [
          {
            value: state.onlineNum,
            name: "零氪玩家",
            itemStyle: { color: echartsGraphic(["#0BFC7F", "#A3FDE0"]) },
          },
          {
            value: state.offlineNum,
            name: "轻度微氪",
            itemStyle: { color: echartsGraphic(["#626cbe", "#9bb1ff"]) },
          },
          {
            value: state.lockNum,
            name: "中度进阶",
            itemStyle: { color: echartsGraphic(["#F48C02", "#FDDB7D"]) },
          },
          {
            value: state.alarmNum,
            name: "高风险重氪",
            itemStyle: { color: echartsGraphic(["#F4023C", "#FB6CB7"]) },
          },
        ],
      },
    ],
  };
};
</script>

<template>
  <v-chart class="chart" :option="option" />
</template>

<style scoped lang="scss"></style>
