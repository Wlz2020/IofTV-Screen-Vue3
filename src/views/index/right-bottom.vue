<script setup lang="ts">
import { rightBottom } from "@/api";
import SeamlessScroll from "@/components/seamless-scroll";
import { computed, onMounted, reactive } from "vue";
import { useSettingStore } from "@/stores";
import { storeToRefs } from "pinia";
import EmptyCom from "@/components/empty-com";
import { ElMessage } from "element-plus";

const settingStore = useSettingStore();
const { defaultOption, indexConfig } = storeToRefs(settingStore);

const state = reactive<any>({
  list: [],
  defaultOption: {
    ...defaultOption.value,
    singleHeight: 85, // 适配年月日布局
    limitScrollNum: 3,
    step: 0.5,
  },
  scroll: true,
});

const getData = () => {
  rightBottom({ limitNum: 200 })
    .then((res) => {
      if (res.success) {
        state.list = res.data.list;
      } else {
        ElMessage.warning(res.msg);
      }
    })
    .catch((err) => {
      ElMessage.error("获取实时告警数据失败");
    });
};

const comName = computed(() => {
  return indexConfig.value.rightBottomSwiper ? SeamlessScroll : EmptyCom;
});

// 处理时间显示
const formatTime = (timeStr: string) => {
  if (!timeStr) return { date: '--', time: '--' };
  const parts = timeStr.split(' ');
  return { date: parts[0], time: parts[1] };
};

// 根据数值返回颜色等级类名
const getSeverityClass = (val: number) => {
  if (val >= 850) return 'severity-high';
  if (val >= 600) return 'severity-mid';
  return 'severity-low';
};

function montionFilter(val: any) {
  return val ? Number(val).toFixed(0) : "--";
}

const handleAddress = (item: any) => {
  return `${item.provinceName}/${item.cityName}/${item.countyName}`;
};

onMounted(() => {
  getData();
});
</script>

<template>
  <div class="right_bottom_wrap">
    <component :is="comName" :list="state.list" v-model="state.scroll" :singleHeight="state.defaultOption.singleHeight"
      :step="state.defaultOption.step" :limitScrollNum="state.defaultOption.limitScrollNum"
      :hover="state.defaultOption.hover" :wheel="state.defaultOption.wheel">
      <ul class="right_bottom_list">
        <li class="alarm_item" v-for="(item, i) in state.list" :key="i">
          <div class="alarm_rank">
            <span class="rank_num" :class="getSeverityClass(item.alertvalue)">{{ i + 1 }}</span>
          </div>

          <div class="alarm_info">
            <div class="row row_top">
              <div class="info_group">
                <span class="label">用户:</span>
                <span class="content highlight_cyan">{{ item.gatewayno }}</span>
              </div>
              <div class="info_group">
                <span class="label">平台:</span>
                <span class="content">{{ item.terminalno }}</span>
              </div>
              <div class="info_group">
                <span class="value_tag" :class="getSeverityClass(item.alertvalue)">
                  成瘾值:{{ montionFilter(item.alertvalue) }}
                </span>
              </div>
            </div>

            <div class="row row_mid">
              <div class="info_group addr_box">
                <span class="label">归属:</span>
                <span class="content truncate" :title="handleAddress(item)">{{ handleAddress(item) }}</span>
              </div>
            </div>

            <div class="row row_bottom">
              <div class="info_group">
                <span class="label">异常记录:</span>
                <span class="content" :class="getSeverityClass(item.alertvalue)">{{ item.alertdetail }}</span>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </component>
  </div>
</template>

<style scoped lang="scss">
.right_bottom_wrap {
  width: 100%;
  height: 252px;
  overflow: hidden;
  position: relative;
}

.right_bottom_list {
  padding: 0;
  margin: 0;
  list-style: none;

  .alarm_item {
    height: 85px;
    display: flex;
    align-items: center;
    padding: 8px 12px;
    box-sizing: border-box;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    background: rgba(255, 255, 255, 0.02);

    .alarm_rank {
      flex-shrink: 0;
      width: 35px;

      .rank_num {
        font-family: 'Impact', sans-serif;
        font-size: 20px;
        font-style: italic;
        opacity: 0.8;
      }
    }

    .alarm_info {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      height: 100%;
      overflow: hidden;

      .row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        white-space: nowrap;

        .info_group {
          display: flex;
          align-items: center;
          overflow: hidden;

          .label {
            color: rgba(255, 255, 255, 0.4);
            font-size: 11px;
            margin-right: 4px;
            flex-shrink: 0;
          }

          .content {
            font-size: 12px;
          }

          .truncate {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }

        .date_wrapper {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          line-height: 1.1;

          .date_text {
            font-size: 10px;
            color: rgba(126, 183, 253, 0.5);
          }

          .time_text {
            font-size: 11px;
            color: #7eb7fd;
          }
        }
      }

      .highlight_cyan {
        color: #00e4ff;
      }

      // 严重程度色彩定义
      .severity-high {
        color: #ff4d4f !important; // 红色

        &.value_tag {
          background: rgba(255, 77, 79, 0.2);
          border: 1px solid rgba(255, 77, 79, 0.3);
        }
      }

      .severity-mid {
        color: #ff9500 !important; // 橙色

        &.value_tag {
          background: rgba(255, 149, 0, 0.2);
          border: 1px solid rgba(255, 149, 0, 0.3);
        }
      }

      .severity-low {
        color: #00ffcc !important; // 青绿色

        &.value_tag {
          background: rgba(0, 255, 204, 0.1);
          border: 1px solid rgba(0, 255, 204, 0.2);
        }
      }

      .value_tag {
        padding: 0 6px;
        border-radius: 2px;
        font-weight: bold;
        font-size: 11px;
        min-width: 65px;
        text-align: center;
      }
    }
  }
}
</style>