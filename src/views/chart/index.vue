<template>
  <div class="container">
    <!-- 书籍分类库存排行 -->
    <div class="one">
      <v-chart class="chart" :option="chart1" autoresize />
    </div>
    <div class="flex_jc-sb h_per-49">
      <!-- 年龄段占比 -->
      <div class="two">
        <v-chart class="chart" :option="chart2" autoresize />
      </div>
      <!-- 男女占比 -->
      <div class="three">
        <v-chart class="chart" :option="chart3" autoresize />
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
      chart1Dt: [],
      chart2Dt: [],
      chart3Dt: []
    };
  },
  computed: {
    chart1() {
      return {
        title: {
          text: "书籍分类数量排行",
          left: "center"
        },
        tooltip: {
          trigger: "item",
          show: true
        },
        xAxis: {
          type: "category",
          data: this.chart1Dt.map(item => item.name)
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            name: "chart1Dt",
            type: "bar",
            data: this.chart1Dt,
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
            data: this.chart2Dt,
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
            data: this.chart3Dt,
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
  },
  mounted() {
    this.getDt();
  },
  methods: {
    async getDt() {
      let res = await this.$api.chart.getChartDt();
      if (res.status) {
        this.chart1Dt = res.data.chart1Dt;
        this.chart2Dt = res.data.chart2Dt;
        this.chart3Dt = res.data.chart3Dt;
      } else {
        this.$message.error("数据获取失败");
      }
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
  border-radius: 20px;
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
  border-radius: 20px;
  background: #ffffff;
  box-shadow: 20px 20px 60px #d9d9d9, -20px -20px 60px #ffffff;
}
.three {
  padding: 20px;
  width: 49%;
  height: 100%;
  border-radius: 20px;
  background: #ffffff;
  box-shadow: 20px 20px 60px #d9d9d9, -20px -20px 60px #ffffff;
}
</style>
