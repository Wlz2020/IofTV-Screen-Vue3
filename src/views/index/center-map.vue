<script setup lang="ts">
import { ref, nextTick, computed } from "vue";
import { centerMap, GETNOBASE } from "@/api";
import { registerMap, getMap } from "echarts/core";
import { optionHandle, regionCodes } from "./center.map";
import BorderBox13 from "@/components/datav/border-box-13";
import { ElMessage } from "element-plus";

import type { MapdataType } from "./center.map";

const option = ref({});
const code = ref("china");
// 新增：记录当前显示的区域名称
const currentRegionName = ref("全国");

const props = withDefaults(
  defineProps<{
    title: number | string;
  }>(),
  {
    title: "诱导机制受众地域辐射",
  }
);

/**
 * 处理数据并渲染地图
 */
const dataSetHandle = async (regionCode: string, list: any[]) => {
  const geojson: any = await getGeojson(regionCode);
  let cityCenter: any = {};
  let mapData: MapdataType[] = [];

  // 提取各区域中心坐标
  geojson.features.forEach((element: any) => {
    cityCenter[element.properties.name] = element.properties.centroid || element.properties.center;
  });

  // 组装散点数据（即隐形 Tooltip 层）
  list.forEach((item: any) => {
    if (cityCenter[item.name]) {
      mapData.push({
        name: item.name,
        value: cityCenter[item.name].concat(item.value), // [x, y, value]
      });
    }
  });

  await nextTick();
  // 调用配置文件生成 option
  option.value = optionHandle(regionCode, list, mapData);
};

/**
 * 获取后端接口数据
 */
const getData = async (regionCode: string) => {
  centerMap({ regionCode: regionCode })
    .then((res) => {
      if (res.success) {
        code.value = res.data.regionCode;

        // 更新左上角显示的名称
        if (regionCode === 'china' || regionCode === '100000') {
          currentRegionName.value = "全国";
        } else {
          // 根据 adcode 反查中文名
          const foundName = Object.keys(regionCodes).find(
            (key) => regionCodes[key].adcode === regionCode
          );
          currentRegionName.value = foundName || "未知区域";
        }

        dataSetHandle(res.data.regionCode, res.data.dataList);
      } else {
        ElMessage.error(res.msg);
      }
    })
    .catch((err) => {
      ElMessage.error("地图数据加载失败");
    });
};

/**
 * 获取并注册 GeoJSON
 */
const getGeojson = (regionCode: string) => {
  return new Promise<any>(async (resolve) => {
    let mapjson = getMap(regionCode);
    if (mapjson) {
      resolve(mapjson.geoJSON);
    } else {
      mapjson = await GETNOBASE(`./map-geojson/${regionCode}.json`);
      registerMap(regionCode, {
        geoJSON: mapjson as any,
        specialAreas: {},
      });
      resolve(mapjson);
    }
  });
};

// 初始化加载全国地图
getData(code.value);

/**
 * 地图点击下钻逻辑
 */
const mapClick = (params: any) => {
  let xzqData = regionCodes[params.name];
  if (xzqData) {
    getData(xzqData.adcode);
  } else {
    // 如果点击的是市级区域，提示已达最底层
    ElMessage.warning(`"${params.name}" 已触达末端审计监测点`);
  }
};
</script>

<template>
  <div class="centermap">
    <div class="maptitle">
      <div class="zuo"></div>
      <span class="titletext">{{ title }}</span>
      <div class="you"></div>
    </div>
    <div class="mapwrap">
      <BorderBox13>
        <div class="current-region">
          <i class="status-icon"></i>
          当前审计区域：<span>{{ currentRegionName }}</span>
        </div>

        <div class="quanguo-btn" @click="getData('china')" v-if="code !== 'china'">
          返回全国
        </div>

        <v-chart class="chart" :option="option" ref="centerMapRef" @click="mapClick"
          v-if="JSON.stringify(option) != '{}'" />
      </BorderBox13>
    </div>
  </div>
</template>

<style scoped lang="scss">
.centermap {
  margin-bottom: 30px;

  .maptitle {
    height: 60px;
    display: flex;
    justify-content: center;
    padding-top: 10px;
    box-sizing: border-box;

    .titletext {
      font-size: 28px;
      font-weight: 900;
      letter-spacing: 6px;
      background: linear-gradient(92deg, #0072ff 0%, #00eaff 48%, #ff4d4f 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin: 0 10px;
    }

    .zuo,
    .you {
      background-size: 100% 100%;
      width: 29px;
      height: 20px;
      margin-top: 8px;
    }

    .zuo {
      background: url("@/assets/img/xiezuo.png") no-repeat;
    }

    .you {
      background: url("@/assets/img/xieyou.png") no-repeat;
    }
  }

  .mapwrap {
    height: 580px;
    width: 100%;
    box-sizing: border-box;
    position: relative;

    // 当前区域文字样式
    .current-region {
      position: absolute;
      left: 25px;
      top: 20px;
      z-index: 10;
      color: #fff;
      font-size: 16px;
      display: flex;
      align-items: center;
      pointer-events: none; // 穿透点击

      .status-icon {
        display: inline-block;
        width: 4px;
        height: 16px;
        background: #ff4d4f;
        margin-right: 10px;
        box-shadow: 0 0 8px #ff4d4f;
      }

      span {
        color: #00eaff;
        font-weight: bold;
        margin-left: 8px;
        text-shadow: 0 0 10px rgba(0, 234, 255, 0.8);
      }
    }

    // 返回按钮样式
    .quanguo-btn {
      position: absolute;
      right: 20px;
      top: 15px;
      width: 90px;
      height: 30px;
      border: 1px solid #ff4d4f;
      border-radius: 4px;
      color: #ff4d4f;
      text-align: center;
      line-height: 28px;
      cursor: pointer;
      background: rgba(255, 77, 79, 0.1);
      z-index: 10;
      transition: all 0.3s;
      font-size: 14px;

      &:hover {
        background: rgba(255, 77, 79, 0.3);
        box-shadow: 0 0 12px rgba(255, 77, 79, 0.5);
      }
    }

    .chart {
      width: 100%;
      height: 100%;
    }
  }
}
</style>