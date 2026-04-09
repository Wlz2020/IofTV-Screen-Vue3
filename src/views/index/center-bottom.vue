<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { installationPlan } from "@/api";
import { graphic } from "echarts/core";
import { ElMessage } from "element-plus";

const option = ref({});

const getData = () => {
  installationPlan()
    .then((res) => {
      if (res.success) {
        setOption(res.data);
      } else {
        ElMessage.warning(res.msg);
      }
    })
    .catch((err) => {
      ElMessage.error(err);
    });
};

const setOption = async (newData: any) => {
  option.value = {
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(0,0,0,.6)",
      borderColor: "rgba(147, 235, 248, .8)",
      textStyle: { color: "#FFF" },
      formatter: function (params: any) {
        var result = params[0].name + "<br>";
        params.forEach(function (item: any) {
          if (item.value !== undefined) {
            if (item.seriesName == "诱导转化率") {
              result += item.marker + " " + item.seriesName + " : " + item.value + "%</br>";
            } else {
              result += item.marker + " " + item.seriesName + " : " + item.value + " 次</br>";
            }
          }
        });
        return result;
      },
    },
    legend: {
      data: ["实际消费", "机制接触", "诱导转化率"],
      textStyle: { color: "#B4B4B4" },
      top: "0",
    },
    grid: {
      left: "50px",
      right: "40px",
      bottom: "40px", // 增加底部间距，留给倾斜的文字
      top: "30px",
    },
    xAxis: {
      data: newData.category,
      axisLine: { lineStyle: { color: "#B4B4B4" } },
      axisTick: { show: false },
      axisLabel: {
        fontSize: 10,
        interval: 0, // 强制显示所有标签
        rotate: 30   // 倾斜30度，防止 12 个环节文字重叠
      }
    },
    yAxis: [
      {
        splitLine: { show: false },
        axisLine: { lineStyle: { color: "#B4B4B4" } },
        axisLabel: { formatter: "{value}" },
      },
      {
        splitLine: { show: false },
        axisLine: { lineStyle: { color: "#B4B4B4" } },
        axisLabel: { formatter: "{value}% " },
      },
    ],
    series: [
      {
        name: "实际消费",
        type: "bar",
        barWidth: 10,
        itemStyle: {
          borderRadius: 5,
          color: new graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "#C33764" },
            { offset: 1, color: "#1D2671" },
          ]),
        },
        data: newData.barData,
      },
      {
        name: "机制接触",
        type: "bar",
        barGap: "-100%",
        barWidth: 10,
        itemStyle: {
          borderRadius: 5,
          color: new graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(156,107,211,0.5)" },
            { offset: 1, color: "rgba(156,107,211,0.1)" },
          ]),
        },
        z: -12,
        data: newData.lineData,
      },
      {
        name: "诱导转化率",
        type: "line",
        smooth: true,
        showAllSymbol: true,
        symbol: "emptyCircle",
        symbolSize: 6,
        yAxisIndex: 1,
        itemStyle: { color: "#FFEB3B" },
        data: newData.rateData,
      },
    ],
  };
};

onMounted(() => {
  getData();
});
</script>

<template>
  <v-chart class="chart" :option="option" v-if="JSON.stringify(option) != '{}'" />
</template>

<style scoped lang="scss">
.chart {
  height: 100%;
  width: 100%;
}
</style>