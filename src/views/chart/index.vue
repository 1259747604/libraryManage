<template>
  <div class="container">
    <!-- 书籍分类库存排行 -->
    <div class="one">
      <v-chart class="chart" :option="chart1" />
    </div>
    <div class="flex_jc-sb h_per-49">
      <!-- 年龄段占比 -->
      <div class="two">
        <v-chart class="chart" :option="chart2" />
      </div>
      <!-- 男女占比 -->
      <div class="three">
        <v-chart class="chart" :option="chart3" />
      </div>
    </div>
  </div>
</template>

<script>
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { PieChart, BarChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";

use([
  CanvasRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  BarChart,
  GridComponent
]);

export default {
  name: "HelloWorld",
  components: {
    VChart
  },
  data() {
    return {
      char1Dt: [
        { name: "1", value: "100" },
        { name: "2", value: "99" },
        { name: "3", value: "80" },
        { name: "4", value: "70" },
        { name: "5", value: "50" },
        { name: "6", value: "10" },
        { name: "7", value: "10" },
        { name: "8", value: "10" },
        { name: "9", value: "10" }
      ],
      char2Dt: [
        { name: "20岁以下", value: "100" },
        { name: "20-40岁", value: "99" },
        { name: "40岁以上", value: "80" }
      ],
      char3Dt: [
        { name: "男", value: "100" },
        { name: "女", value: "99" }
      ]
    };
  },
  computed: {
    chart1() {
      return {
        title: {
          text: "书籍分类库存排行",
          left: "center"
        },
        tooltip: {
          trigger: "item",
          show: true
        },
        xAxis: {
          type: "category",
          data: this.char1Dt.map(item => item.name)
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            name: "char1Dt",
            type: "bar",
            data: this.char1Dt,
            barWidth: 30,
            itemStyle: {
              color: "#44e6c6"
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      };
    },
    chart2() {
      return {
        title: {
          text: "用户年龄段占比",
          left: "center"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          left: "left"
        },
        series: [
          {
            name: "用户年龄段占比",
            type: "pie",
            radius: ["40%", "70%"],
            center: ["50%", "60%"],
            itemStyle: {
              borderRadius: 10,
              borderColor: "#fff",
              borderWidth: 2
            },
            labelLine: {
              show: false
            },
            label: {
              show: false,
              position: "center"
            },
            avoidLabelOverlap: false,
            data: this.char2Dt,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              },
              label: {
                show: true,
                fontSize: "30",
                fontWeight: "bold"
              }
            }
          }
        ]
      };
    },
    chart3() {
      return {
        color: ["#5e5be5", "#ed748a"],
        title: {
          text: "用户性别占比",
          left: "center"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          left: "left"
        },
        series: [
          {
            name: "用户性别占比",
            type: "pie",
            radius: "70%",
            center: ["50%", "60%"],
            data: this.char3Dt,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.one {
  padding: 20px;
  height: 49%;
  background: #ffffff;
  box-shadow: 20px 20px 60px #d9d9d9, -20px -20px 60px #ffffff;
  .chart {
    height: 100%;
  }
}
.two {
  padding: 20px;
  width: 49%;
  height: 100%;
  background: #ffffff;
  box-shadow: 20px 20px 60px #d9d9d9, -20px -20px 60px #ffffff;
}
.three {
  padding: 20px;
  width: 49%;
  height: 100%;
  background: #ffffff;
  box-shadow: 20px 20px 60px #d9d9d9, -20px -20px 60px #ffffff;
}
</style>
