<template>
  <div class="pie-chart clear" v-loading="loading">
    <ve-pie
      height="100%"
      :data="chartData"
      :extend="chartExtends"
      :after-set-option-once="getChart"
    ></ve-pie>
    <div class="chart-legend">
      <div class="legend-item scroll" v-for="(item,index) in data" :key="item.key">
        <i class="legend-circle" :style="{backgroundColor: color[index]}"></i>
        <span class="legend-symbol">{{item.key}}</span>
        <span>${{item.value | toThousands}}</span>
        <span>{{item.rate}}</span>
      </div>
    </div>
  </div>
</template>

<script>
  import _ from 'lodash'
  import {toThousands} from "../api/util";
  /*const data = [
    {key:'NVT',value:1,rate: 0.1},
    {key:'NULS',value:2,rate: 0.2},
    {key:'BTC',value:3,rate: 0.3},
    {key:'ETH',value:3,rate: 0.4},
    {key:'BCH',value:5,rate: 0.5}
  ];*/
  export default {
    data() {
      this.color = ['#759bf5','#76e9a7','#f3a83c','#9f95f0','#67d1fe']
      return {
        chartData: {
          columns: ['key', 'value'],
          rows: [...this.data]
        },
        chartExtends: {},
        chart: null
      }
    },
    props: {
      data: {
        type: Array,
        default: ()=>[]
      },
      loading: {
        type: Boolean,
        default: false
      },
      extends: {
        type: Object
      },
      total: {
        type: String,
      }
    },
    watch: {
      data(val) {
        console.log(val, '====val')
        val.forEach(v=>{
          v.value = v.value.toFixed(2)
        })
        this.chartData = {
          columns: ['key', 'value'],
          rows: val
        }
      }
    },
    computed: {},
    mounted() {
      const defaultExtend = {
        color: this.color,
        legend: {
          show: false,
        },
        tooltip: {
          position: 'top',
          formatter: (item) => {
            return `<div class="pie-chart-tooltip">
                      <i style="background-color: ${this.color[item.dataIndex]}"></i>
                        ${item.name}: $${toThousands(item.value)} (${item.percent}%)
                  </div>`
          }
          // formatter: '{b}: ${c} ({d}%)'
        },
        series: {
          type: 'pie',
          label: {
            normal: {
              show: false,
              position: 'center'
            },
            emphasis: {
              show: true,
              textStyle: {
                fontSize: '18',
                fontWeight: 'bold'
              },
              formatter: '{d}%'
            }
          },
          center: ['45%', '50%'],
          radius: ['45%', '70%'],
          itemStyle: {
            normal: {
              borderWidth: 3,
              borderColor: '#ffffff',
            },
          }
        }
      }
      this.chartExtends = _.merge({},defaultExtend,this.extends);
    },
    methods: {
      getChart(charts) {
        this.chart = charts;
        /* charts.dispatchAction({
           type: 'highlight',
           dataIndex: 0,
         })
         charts.on('mouseover',function (e) {
           if (e.dataIndex !==0 ) {
             charts.dispatchAction({
               type:'downplay',
               dataIndex: 0,
             })
           }
         })*/
      }
    },
    beforeDestroy() {
      if (!this.chart) {
        return
      }
      this.chart.dispose();
      this.chart = null
    }
  }
</script>

<style lang="less">
  .pie-chart {
    height: 100%;
    .ve-pie {
      float: left;
      width: 40% !important;
    }
    .chart-legend {
      float: left;
      width: 60%;
      padding-right: 10px;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .legend-item {
        width: 100%;
        white-space: nowrap;
        overflow: auto;
      }
      .legend-circle {
        display: inline-block;
        width: 8px;
        height: 8px;
        margin-right: 5px;
        margin-bottom: 1px;
        border-radius: 50%;
      }
      span {
        display: inline-block;
        color: #8794b1;
        font-size: 16px;
        &.legend-symbol {
          color: #4f5b78;
          font-size: 14px;
          width: 50px;
          margin-right: 10px;
          &+span {
            margin-right: 20px;
            /*min-width: 80px;*/
          }
        }
      }
    }
  }
  .pie-chart-tooltip {
    background-color: transparent;
    color: #fff;
    line-height: 20px;
    i{
      display: inline-block;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      margin-right: 2px;
    }
  }
</style>