<template>
  <ve-pie
          height="100%"
          class="pie-chart"
          :data="chartData"
          :extend="chartExtends"
          :loading="loading"
          :after-set-option-once="getChart"
  ></ve-pie>
</template>

<script>
  import _ from 'lodash'
  import {Division} from '@/api/util'

  /*const data = [
    {key: 'NVT', value: 1, rate: 0.1},
    {key: 'NULS', value: 2, rate: 0.2},
    {key: 'BTC', value: 3, rate: 0.3},
    {key: 'ETH', value: 3, rate: 0.4},
    {key: 'BCH', value: 5, rate: 0.5}
  ];*/

  export default {
    data() {
      this.newData = [...this.data];
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
        type: Array
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
      data() {
        this.newData = [];
        this.data.map(v => {
          let rate = '0%';
          if (Number(this.total)) {
            rate = Division(v.value * 100, this.total).toFixed(2) + '%'
          }
          this.newData.push({
            key: v.key,
            value: v.value,
            rate
          })
        });
        this.chartData = {
          columns: ['key', 'value'],
          rows: this.newData
        }
      }
    },
    computed: {},
    mounted() {
      const defaultExtend = {
        color: ['#759bf5', '#76e9a7', '#f3a83c', '#9f95f0', '#67d1fe'],
        legend: {
          orient: 'vertical',
          left: '40%',
          top: 40,
          icon: 'circle',
          itemWidth: 8,
          formatter: (name) => {
            const item = this.newData.filter(v => v.key === name)[0];
            if (!item) return '';
            return `{name|${name}}{value|$${item.value}}{rate|${item.rate}}`
          },
          textStyle: {
            rich: {
              name: {
                fontSize: 14,
                color: '#4f5b78',
                padding: [0, 0, 0, 20],
                width: 80
              },
              value: {
                fontSize: 16,
                color: '#8794b1',
                width: 90
              },
              rate: {
                fontSize: 16,
                color: '#8794b1'
              },
            }
          }
        },
        series: {
          legendHoverLink: false,
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
          center: ['17%', '50%'],
          radius: ['50%', '70%'],
          itemStyle: {
            normal: {
              borderWidth: 3,
              borderColor: '#ffffff',
            },
          }
        }
      };
      this.chartExtends = _.merge({}, defaultExtend, this.extends);
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
  }
</style>
