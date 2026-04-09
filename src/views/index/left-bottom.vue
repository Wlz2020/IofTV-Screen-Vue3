<script setup lang="ts">
import { leftBottom } from "@/api";
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
    singleHeight: 80, // 增加高度以容纳更多内容
    limitScrollNum: 4,
    step: 0.6,
  },
  scroll: true,
});

const getData = () => {
  leftBottom({ limitNum: 30 })
    .then((res) => {
      if (res.success) {
        state.list = res.data.list;
      } else {
        ElMessage.warning(res.msg);
      }
    })
    .catch(() => {
      ElMessage.error("获取案例预警失败");
    });
};

const addressHandle = (item: any) => {
  return `${item.provinceName}`;
};

const comName = computed(() => {
  return indexConfig.value.leftBottomSwiper ? SeamlessScroll : EmptyCom;
});

onMounted(() => {
  getData();
});
</script>

<template>
  <div class="left_bottom_wrap">
    <component :is="comName" :list="state.list" v-model="state.scroll" :singleHeight="state.defaultOption.singleHeight"
      :step="state.defaultOption.step" :limitScrollNum="state.defaultOption.limitScrollNum"
      :hover="state.defaultOption.hover" :wheel="state.defaultOption.wheel">
      <ul class="left_bottom_list">
        <li class="case_item" v-for="(item, i) in state.list" :key="i" :class="item.onlineState === 0 ? 'is_warn' : ''">
          <div class="index_box">
            <span class="num">{{ (i + 1).toString().padStart(2, '0') }}</span>
            <div class="line"></div>
          </div>

          <div class="content_box">
            <div class="row_top">
              <div class="user_info">
                <span class="id_text">{{ item.gatewayno }}</span>
                <span class="tag_addr">{{ addressHandle(item) }}</span>
              </div>
              <div class="time_text">{{ item.createTime }}</div>
            </div>

            <div class="row_mid">
              <div class="reason_text">
                <span class="dot"></span>
                {{ item.reason || '检测到非理性消费倾向' }}
              </div>
            </div>

            <div class="row_bottom">
              <div class="status_badge" :class="item.onlineState === 0 ? 'bg_red' : 'bg_green'">
                {{ item.onlineState === 0 ? "高危诱导" : "常规行为" }}
              </div>
            </div>
          </div>

          <div class="corner_deco"></div>
        </li>
      </ul>
    </component>
  </div>
</template>

<style scoped lang="scss">
.left_bottom_wrap {
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding: 10px;
}

.left_bottom_list {
  padding: 0;
  margin: 0;
  list-style: none;

  .case_item {
    height: 70px; // 留 10px margin-bottom = 80px singleHeight
    margin-bottom: 10px;
    background: linear-gradient(90deg, rgba(24, 144, 255, 0.15) 0%, rgba(24, 144, 255, 0.02) 100%);
    border: 1px solid rgba(24, 144, 255, 0.2);
    display: flex;
    align-items: center;
    position: relative;
    transition: all 0.3s;
    clip-path: polygon(0 0, 97% 0, 100% 30%, 100% 100%, 0 100%); // 科技感切角

    &.is_warn {
      background: linear-gradient(90deg, rgba(255, 77, 79, 0.15) 0%, rgba(255, 77, 79, 0.02) 100%);
      border-color: rgba(255, 77, 79, 0.3);

      .index_box .num {
        color: #ff4d4f;
      }

      .index_box .line {
        background: #ff4d4f;
      }
    }

    .index_box {
      width: 40px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .num {
        font-family: 'Oswald';
        font-size: 16px;
        color: #1890ff;
        font-weight: bold;
      }

      .line {
        width: 12px;
        height: 2px;
        background: #1890ff;
        margin-top: 2px;
      }
    }

    .content_box {
      flex: 1;
      padding-right: 15px;
      display: flex;
      flex-direction: column;
      gap: 2px;

      .row_top {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .id_text {
          color: #fff;
          font-size: 13px;
          font-weight: 500;
        }

        .tag_addr {
          color: rgba(255, 255, 255, 0.4);
          font-size: 11px;
          margin-left: 10px;
          padding: 0 4px;
          border-left: 1px solid rgba(255, 255, 255, 0.2);
        }

        .time_text {
          color: rgba(255, 255, 255, 0.3);
          font-size: 11px;
          min-width: 85px; // 确保秒数显示完整
          text-align: right;
        }
      }

      .row_mid {
        .reason_text {
          color: #00e4ff;
          font-size: 12px;
          display: flex;
          align-items: center;

          .dot {
            width: 4px;
            height: 4px;
            background: #00e4ff;
            border-radius: 50%;
            margin-right: 6px;
            box-shadow: 0 0 5px #00e4ff;
          }
        }
      }

      .row_bottom {
        .status_badge {
          display: inline-block;
          font-size: 10px;
          padding: 0 6px;
          border-radius: 2px;

          &.bg_red {
            background: rgba(255, 77, 79, 0.2);
            color: #ff4d4f;
            border: 1px solid #ff4d4f;
          }

          &.bg_green {
            background: rgba(82, 196, 26, 0.2);
            color: #52c41a;
            border: 1px solid #52c41a;
          }
        }
      }
    }

    .corner_deco {
      position: absolute;
      right: 0;
      top: 0;
      width: 10px;
      height: 10px;
      background: rgba(24, 144, 255, 0.3);
      clip-path: polygon(100% 0, 0 0, 100% 100%);
    }
  }
}
</style>