<script setup lang="ts">
import { ref, onMounted } from "vue";
import { alarmNum } from "@/api";
import { graphic } from "echarts/core";
import { ElMessage } from "element-plus";

const option = ref({});

const getData = () => {
  alarmNum()
    .then((res) => {
      // 对应 Mock 返回的 data 结构
      if (res.success) {
        setOption(res.data.dateList, res.data.numList, res.data.numList2);
      } else {
        ElMessage({
          message: res.msg,
          type: "warning",
        });
      }
    })
    .catch((err) => {
      ElMessage.error(err);
    });
};

const setOption = async (xData: any[], yData: any[], yData2: any[]) => {
  option.value = {
    // 新增图例说明，放置在顶部居中
    legend: {
      data: ["诱导行为触发频次", "非理性氪金转化"],
      textStyle: { color: "#7EB7FD", fontSize: 12 },
      top: "0",
      right: "center",
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(0,0,0,.6)",
      borderColor: "rgba(147, 235, 248, .8)",
      textStyle: { color: "#FFF" },
      // 增强 tooltip 显示效果
      formatter: function (params: any) {
        let res = `<div style="margin-bottom:5px; color:#fff; font-weight:bold;">${params[0].name} 审计月报</div>`;
        params.forEach((item: any) => {
          res += `
            <div style="display:flex; align-items:center;">
              <span style="display:inline-block; margin-right:5px; border-radius:10px; width:10px; height:10px; background-color:${item.color};"></span>
              ${item.seriesName}：<b style="color:#fff">${item.value}</b> ${item.seriesIndex === 0 ? '次' : '笔'}
            </div>`;
        });
        return res;
      },
    },
    grid: {
      show: true,
      left: "20px",
      right: "30px",
      bottom: "10px",
      top: "45px", // 留出顶部空间给 legend 和峰值 label
      containLabel: true,
      borderColor: "rgba(31,99,163,.1)",
    },
    xAxis: {
      type: "category",
      data: xData,
      boundaryGap: false,
      splitLine: {
        show: true,
        lineStyle: { color: "rgba(31,99,163,.1)" },
      },
      axisLine: {
        lineStyle: { color: "rgba(31,99,163,.2)" },
      },
      axisLabel: {
        color: "#7EB7FD",
        fontWeight: "500",
      },
    },
    yAxis: {
      type: "value",
      splitLine: {
        show: true,
        lineStyle: { color: "rgba(31,99,163,.1)" },
      },
      axisLine: {
        show: false,
      },
      axisLabel: {
        color: "#7EB7FD",
        fontWeight: "500",
      },
    },
    series: [
      {
        name: "诱导行为触发频次",
        data: yData,
        type: "line",
        smooth: true,
        symbol: "none",
        color: "rgba(252,144,16,.8)",
        areaStyle: {
          color: new graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(252,144,16,.4)" },
            { offset: 1, color: "rgba(252,144,16,.0)" },
          ]),
        },
        markPoint: {
          data: [
            {
              name: "诱导峰值",
              type: "max",
              valueDim: "y",
              symbol: "rect",
              symbolSize: [100, 26],
              symbolOffset: [0, -22],
              itemStyle: { color: "rgba(0,0,0,0)" },
              label: {
                color: "#FC9010",
                backgroundColor: "rgba(252,144,16,0.1)",
                borderRadius: 4,
                padding: [5, 10],
                borderWidth: 0.5,
                borderColor: "rgba(252,144,16,.5)",
                formatter: "诱导峰值：{c}",
              },
            },
            {
              type: "max",
              symbol: "circle",
              symbolSize: 6,
              itemStyle: { color: "#FC9010", shadowBlur: 8, shadowColor: "#FC9010" },
              label: { show: false },
            },
          ],
        },
      },
      {
        name: "非理性氪金转化",
        data: yData2,
        type: "line",
        smooth: true,
        symbol: "none",
        color: "rgba(9,202,243,.8)",
        areaStyle: {
          color: new graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(9,202,243,.4)" },
            { offset: 1, color: "rgba(9,202,243,.0)" },
          ]),
        },
        markPoint: {
          data: [
            {
              name: "转化峰值",
              type: "max",
              valueDim: "y",
              symbol: "rect",
              symbolSize: [100, 26],
              symbolOffset: [0, -22],
              itemStyle: { color: "rgba(0,0,0,0)" },
              label: {
                color: "#09CAF3",
                backgroundColor: "rgba(9,202,243,0.1)",
                borderRadius: 4,
                padding: [5, 10],
                borderWidth: 0.5,
                borderColor: "rgba(9,202,243,.5)",
                formatter: "氪金峰值：{c}",
              },
            },
            {
              type: "max",
              symbol: "circle",
              symbolSize: 6,
              itemStyle: { color: "#09CAF3", shadowBlur: 8, shadowColor: "#09CAF3" },
              label: { show: false },
            },
          ],
        },
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
  width: 100%;
  height: 100%;
}
</style>