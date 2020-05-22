<template>
  <div class="home" v-loading="$store.state.homeLoading">
    <div class="top w1200">
      <div class="left fl shadow">
        <h4>{{$t('tab.tab33')}}</h4>
        <div>
          <div class="fl total">
            <h6>{{$t('tab.tab2')}}</h6>
            <p>≈ $ {{myAssetsInfo.total}}</p>
          </div>
          <div class="fr lock">
            <h6>{{$t('tab.tab4')}}</h6>
            <p>≈ $ {{myAssetsInfo.available}}</p>
            <h6>{{$t('tab.tab3')}}</h6>
            <p>≈ $ {{myAssetsInfo.locking}}</p>
          </div>
        </div>
      </div>
      <div class="right fr shadow">
        <PieChart :data="chartData" :total="myAssetsInfo.total">
        </PieChart>
      </div>
    </div>
    <div class="footer cb w1200">
      <div class="titles">
        <h4 class="fl">{{$t('tab.tab34')}}</h4>
      </div>
      <div class="cb">
        <el-table :data="$store.state.accountList" stripe class="tabs">
          <el-table-column label="" width="30">
          </el-table-column>
          <!--<el-table-column prop="currency" :label="$t('tab.tab35')" width="100">
          </el-table-column>-->
          <el-table-column :label="$t('tab.tab35')" width="80">
            <template slot-scope="scope">
              <img :src="scope.row.icon" alt="" class="coin-img">
            </template>
          </el-table-column>
          <el-table-column prop="name" :label="$t('tab.tab36')" width="100">
          </el-table-column>
          <el-table-column prop="number" :label="$t('tab.tab37')" width="170">
          </el-table-column>
          <el-table-column :label="$t('tab.tab38')" width="180">
            <template slot-scope="scope">
              ${{scope.row.valuation | toThousands}}
            </template>
          </el-table-column>
          <el-table-column prop="locking" :label="$t('tab.tab3')" width="170">
          </el-table-column>
          <el-table-column prop="available" :label="$t('tab.tab4')" width="170">
          </el-table-column>
          <el-table-column :label="$t('nodeService.nodeService6')" min-width="200">
            <template slot-scope="scope">
              <el-button @click="inChains(scope.row)" type="text" size="small">{{$t('home.home3')}}</el-button>
              <el-button @click="crossLink(scope.row)" type="text" size="small" disabled>{{$t('home.home4')}}
              </el-button>
              <el-button @click="crossLinkCarry(scope.row)" type="text" size="small" disabled>{{$t('home.home5')}}
              </el-button>
              <el-button @click="transactionList(scope.row)" type="text" size="small">{{$t('home.home2')}}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
  import {Plus, Division, connectToExplorer} from '@/api/util'
  import PieChart from '@/components/PieChart'

  export default {
    data() {
      return {
        myAssetsInfo: {},
        chartData: []
      };
    },
    async created() {
      if (!this.$store.state.addressInfo.length) {
        this.$router.push({
          name: 'newAddress',
        })
      } else {
        await this.$store.dispatch('getAccountList')
      }
    },
    mounted() {
    },
    components: {
      PieChart,
    },
    watch: {
      '$store.state.accountList': {
        handler: function() {
          this.init()
        }
      }
    },
    computed: {
    },
    methods: {

      init() {
        const assetsInfo = this.$store.state.accountList;
        const myAssetsInfo = {total:0,available:0,locking:0};
        const chartData = [];
        const total = assetsInfo.reduce((cur,next)=>{
          return Number(Plus(cur, next.valuation))
        },0);
        assetsInfo.forEach(item => {
          myAssetsInfo.total = Number(Plus(myAssetsInfo.total, item.valuation));
          myAssetsInfo.available = Number(Plus(myAssetsInfo.available, item.usdAvailable));
          myAssetsInfo.locking = Number(Plus(myAssetsInfo.locking, item.usdLocking));
          chartData.push({
            key: item.symbol,
            value: item.valuation,
            rate: total ? (Number(Division(item.valuation, total)) * 100).toFixed(2) + '%' : '0%'
          })
        });
        this.myAssetsInfo = myAssetsInfo;
        //console.log( this.myAssetsInfo);
        this.chartData = chartData
      },

      /**
       * @disc: 链内转账
       * @params: row 选择币种信息
       * @date: 2020-04-07 16:30
       * @author: Wave
       */
      inChains(row) {
        //console.log(row);
        this.toUrl('transfer', row, 0)
      },

      /**
       * @disc: 跨链转账
       * @params: row 选择币种信息
       * @date: 2020-04-07 16:30
       * @author: Wave
       */
      crossLink(row) {
        console.log(row);
        this.toUrl('transfer', '', 0)
      },

      /**
       * @disc: 跨链提币
       * @params: row 选择币种信息
       * @date: 2020-04-07 16:30
       * @author: Wave
       */
      crossLinkCarry(row) {
        console.log(row);
        this.toUrl('transfer', '', 0)
      },

      /**
       * @disc: 交易记录
       * @params: row 选择币种信息
       * @date: 2020-04-07 16:30
       * @author: Wave
       */
      transactionList(row) {
        console.log(row);
        this.toUrl('txList', '', 0)
      },

      /**
       * 连接跳转
       * @param name
       * @param parameter
       * @param type 0:路由跳转 1:浏览器跳转
       */
      toUrl(name, parameter, type) {
        if (type === 0) {
          if (name === 'transfer') {
            sessionStorage.setItem('transferParams', JSON.stringify(parameter))
          }
          this.$router.push({
            name: name,
          })
        } else {
          connectToExplorer(name, parameter);
        }
      },

    }
  }
</script>

<style lang="less">
  @import "../../assets/css/style";

  .home {
    .top {
      .left {
        width: 580px;
        height: 200px;
        background-color: #ffffff;
        margin: 40px 0 40px 0;
        border-radius: 5px;
        h4 {
          font-size: 16px;
          font-weight: bold;
          color: #8794b1;
          border-bottom: 1px solid #dfe4ef;
          padding: 10px 0 10px 20px;
        }
        .total {
          margin: 10px 0 0 20px;
        }
        .lock {
          margin: 10px 50px 0 0;
        }
        h6 {
          font-size: 14px;
          color: #8794b1;
          margin: 10px 0 0 0;
        }
        p {
          margin: 5px 0 0 0;
          font-size: 18px;
          font-weight: bold;
          color: #475472;
        }
      }
      .right {
        width: 580px;
        height: 200px;
        background-color: #ffffff;
        margin: 40px 0 0 0;
        border-radius: 5px;
      }
    }
    .footer {
      .titles {
        border-bottom: 1px solid #dfe4ef;
        height: 40px;
        h4 {
          font-size: 16px;
          font-weight: bold;
          color: #2688f7;
          padding: 10px 0 0 0;
          margin: 0;
        }
        .el-icon-search {
          line-height: 30px;
        }
      }
      .tabs {
        margin: 20px 0 0 0;
        .coin-img {
          width: 28px;
        }
        .el-table__header-wrapper {
          .has-gutter {
            th {
              background-color: #78a0f3 !important;
              .cell {
                color: #eaeffd;
              }
            }
          }
        }
      }
    }

  }
</style>
