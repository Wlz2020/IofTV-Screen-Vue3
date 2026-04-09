// mapData数据结构：[x, y, value]
export interface MapdataType {
  name: string;
  value: [number, number, number];
}

/**
 * 根据市级数据的实际最大值，动态生成 6 个颜色分段
 * 保证颜色分布均匀，避免所有城市堆在同一色阶
 */
const buildCityPieces = (list: object[]) => {
  const values = (list as any[]).map((d) => (d as any).value ?? 0);
  const max = Math.max(...values, 1);
  const step = Math.ceil(max / 6);

  return [
    { gte: step * 5 + 1, label: "极高危：核心爆发区", color: "#ff4d4f" },
    { gte: step * 4 + 1, lte: step * 5, label: "高危：重度渗透区", color: "#ff7875" },
    { gte: step * 3 + 1, lte: step * 4, label: "中危：诱导覆盖区", color: "#722ed1" },
    { gte: step * 2 + 1, lte: step * 3, label: "警戒：行为异化区", color: "#1781B5" },
    { gte: step + 1, lte: step * 2, label: "受控：基础监测区", color: "#105A7E" },
    { lte: step, label: "观察：低度辐射区", color: "#0c405a" },
  ];
};

export const optionHandle = (regionCode: string, list: object[], mapData: MapdataType[]) => {
  let top = 45;
  let zoom = ["china"].includes(regionCode) ? 1.05 : 1;

  const isNational = regionCode === "china";

  // 全国用固定分段，省级下钻用动态分段
  const pieces = isNational
    ? [
      { gte: 1000, label: "极高危：机制深层套牢", color: "#ff4d4f" },
      { gte: 600, lte: 999, label: "高危：成瘾行为频发", color: "#ff7875" },
      { gte: 200, lte: 599, label: "中危：诱导机制覆盖", color: "#722ed1" },
      { gte: 50, lte: 199, label: "警戒：行为异化倾向", color: "#1781B5" },
      { gte: 10, lte: 49, label: "受控：基础监测区域", color: "#105A7E" },
      { lte: 9, label: "观察：低度辐射区", color: "#0c405a" },
    ]
    : buildCityPieces(list);

  // 动态计算 tooltip 中"重点干预"的阈值（最大值的 60%）
  const maxVal = Math.max(...(list as any[]).map((d: any) => d.value ?? 0), 1);
  const threshold = maxVal * 0.6;

  return {
    backgroundColor: "rgba(0,0,0,0)",
    tooltip: {
      show: false,
    },
    legend: {
      show: false,
    },
    visualMap: {
      seriesIndex: 0,
      left: 20,
      bottom: 20,
      pieces,
      textStyle: {
        color: "#fff",
        fontSize: 11,
      },
    },
    geo: [
      {
        map: regionCode,
        roam: false,
        selectedMode: false,
        zoom: zoom,
        top: top,
        aspectScale: 0.78,
        show: false,
      },
    ],
    series: [
      {
        name: "审计风险地图",
        type: "map",
        map: regionCode,
        aspectScale: 0.78,
        data: list,
        showLegendSymbol: false,
        selectedMode: false,
        zoom: zoom,
        top: top,
        tooltip: {
          show: true,
          formatter: function (params: any) {
            const val = params.data ? params.data["value"] : "未覆盖";
            return `
              <div style="padding:5px;">
                <b style="color:#ff4d4f">${params.name}</b><br/>
                受众受损指数：${val}<br/>
                审计状态：${typeof val === "number" && val > threshold ? "重点干预" : "持续监测"}
              </div>
            `;
          },
          backgroundColor: "rgba(5, 10, 15, 0.9)",
          borderColor: "rgba(255, 77, 79, .8)",
          textStyle: { color: "#FFF" },
        },
        label: {
          show: true,
          color: "rgba(255,255,255,0.7)",
          fontSize: 10,
          formatter: function (val: any) {
            return val.name.slice(0, 2);
          },
        },
        emphasis: {
          label: { show: true, color: "#fff" },
          itemStyle: {
            areaColor: "#f5222d",
            borderWidth: 2,
          },
        },
        itemStyle: {
          borderColor: "rgba(147, 235, 248, .5)",
          borderWidth: 1,
          areaColor: {
            type: "radial",
            x: 0.5, y: 0.5, r: 0.8,
            colorStops: [
              { offset: 0, color: "rgba(147, 235, 248, 0)" },
              { offset: 1, color: "rgba(147, 235, 248, .1)" },
            ],
          },
          shadowColor: "rgba(0, 0, 0, .5)",
          shadowBlur: 10,
        },
      },
      {
        name: "成瘾爆发监测点",
        type: "effectScatter",
        coordinateSystem: "geo",
        data: mapData,
        symbolSize: function (val: any) {
          return Math.max(4, val[2] / 80);
        },
        legendHoverLink: true,
        showEffectOn: "render",
        rippleEffect: {
          scale: 0,
          brushType: "stroke",
          period: 0,
        },
        tooltip: {
          show: true,
          formatter: function (params: any) {
            return `${params.name} 异常行为频次：${params.data["value"][2]}`;
          },
          backgroundColor: "rgba(0,0,0,.8)",
          borderColor: "#ff4d4f",
          textStyle: { color: "#FFF" },
        },
        label: {
          show: false,
        },
        itemStyle: {
          color: "rgba(0,0,0,0)",
          shadowBlur: 0,
          borderColor: "rgba(0,0,0,0)",
          borderWidth: 0,
        },
        zlevel: 1,
      },
    ],
  };
};

// 行政区划代码
export const regionCodes: any = {
  中国: { adcode: "100000", level: "country", name: "中华人民共和国" },
  新疆维吾尔自治区: { adcode: "650000", level: "province", name: "新疆维吾尔自治区" },
  湖北省: { adcode: "420000", level: "province", name: "湖北省" },
  辽宁省: { adcode: "210000", level: "province", name: "辽宁省" },
  广东省: { adcode: "440000", level: "province", name: "广东省" },
  内蒙古自治区: { adcode: "150000", level: "province", name: "内蒙古自治区" },
  黑龙江省: { adcode: "230000", level: "province", name: "黑龙江省" },
  河南省: { adcode: "410000", level: "province", name: "河南省" },
  山东省: { adcode: "370000", level: "province", name: "山东省" },
  陕西省: { adcode: "610000", level: "province", name: "陕西省" },
  贵州省: { adcode: "520000", level: "province", name: "贵州省" },
  上海市: { adcode: "310000", level: "province", name: "上海市" },
  重庆市: { adcode: "500000", level: "province", name: "重庆市" },
  西藏自治区: { adcode: "540000", level: "province", name: "西藏自治区" },
  安徽省: { adcode: "340000", level: "province", name: "安徽省" },
  福建省: { adcode: "350000", level: "province", name: "福建省" },
  湖南省: { adcode: "430000", level: "province", name: "湖南省" },
  海南省: { adcode: "460000", level: "province", name: "海南省" },
  江苏省: { adcode: "320000", level: "province", name: "江苏省" },
  青海省: { adcode: "630000", level: "province", name: "青海省" },
  广西壮族自治区: { adcode: "450000", level: "province", name: "广西壮族自治区" },
  宁夏回族自治区: { adcode: "640000", level: "province", name: "宁夏回族自治区" },
  浙江省: { adcode: "330000", level: "province", name: "浙江省" },
  河北省: { adcode: "130000", level: "province", name: "河北省" },
  香港特别行政区: { adcode: "810000", level: "province", name: "香港特别行政区" },
  台湾省: { adcode: "710000", level: "province", name: "台湾省" },
  澳门特别行政区: { adcode: "820000", level: "province", name: "澳门特别行政区" },
  甘肃省: { adcode: "620000", level: "province", name: "甘肃省" },
  四川省: { adcode: "510000", level: "province", name: "四川省" },
  天津市: { adcode: "120000", level: "province", name: "天津市" },
  江西省: { adcode: "360000", level: "province", name: "江西省" },
  云南省: { adcode: "530000", level: "province", name: "云南省" },
  山西省: { adcode: "140000", level: "province", name: "山西省" },
  北京市: { adcode: "110000", level: "province", name: "北京市" },
  吉林省: { adcode: "220000", level: "province", name: "吉林省" },
};