<template>
  <div class="home">
    <div class="top w1200">
      <div class="left fl shadow">
        <h4>我的资产</h4>
        <div>
          <div class="fl total">
            <h6>总额</h6>
            <p>≈ $ {{myAssetsInfo.total}}</p>
          </div>
          <div class="fr lock">
            <h6>可用</h6>
            <p>≈ $ {{myAssetsInfo.available}}</p>
            <h6>锁定</h6>
            <p>≈ $ {{myAssetsInfo.locking}}</p>
          </div>
        </div>
      </div>
      <div class="right fr">
        <PieChart :data="chartData" :total="myAssetsInfo.total"></PieChart>
      </div>
    </div>
    <div class="footer cb w1200">
      <div class="titles">
        <h4 class="fl">链内交易</h4>
        <div class="fr">
          <el-autocomplete v-model="searchValue" placeholder="请输入内容"
                           :fetch-suggestions="querySearchAsync"
                           @select="handleSelect">
            <i class="el-icon-search" slot="suffix"></i>
            <template slot-scope="{ item }">
              <div class="name">{{ item.symbol }}</div>
            </template>
          </el-autocomplete>
        </div>
      </div>
      <div class="cb">
        <el-table :data="ledgerData" border class="tabs">
          <el-table-column label="" width="30">
          </el-table-column>
          <el-table-column prop="currency" label="币种" width="100">
          </el-table-column>
          <el-table-column prop="name" label="名称" width="100">
          </el-table-column>
          <el-table-column prop="number" label="数量" width="170">
          </el-table-column>
          <el-table-column label="估值" width="170">
            <template slot-scope="scope">
              ${{scope.row.valuation}}
            </template>
          </el-table-column>
          <el-table-column prop="locking" label="锁定" width="170">
          </el-table-column>
          <el-table-column prop="available" label="可用" width="170">
          </el-table-column>
          <el-table-column label="操作" min-width="200">
            <template slot-scope="scope">
              <el-button @click="inChains(scope.row)" type="text" size="small">链内转账</el-button>
              <el-button @click="crossLink(scope.row)" type="text" size="small" disabled>跨链转账</el-button>
              <el-button @click="crossLinkCarry(scope.row)" type="text" size="small" disabled>跨链提币</el-button>
              <el-button @click="transactionList(scope.row)" type="text" size="small">交易记录</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import {divisionDecimals, Plus, Times, Division, addressInfo} from '@/api/util'
  import PieChart from '@/components/PieChart'

  export default {
    data() {
      return {
        addressInfo: {},//默认账户信息
        myAssetsInfo: {
          total: 0,
          available: 0,
          locking: 0,
        },//我的资产信息
        allAssetsList: [], //所有币种列表（搜索框用）
        searchValue: '', //搜索框内容
        ledgerData: [],//币种列表
        chartData: [], //环形图数据
      };
    },
    created() {
      this.addressInfo = addressInfo(1);
      this.symbolReport();
    },
    mounted() {
      //this.getAccountList(this.addressInfo.address, 1);
    },
    components: {
      PieChart,
    },
    watch: {},
    methods: {

      /**
       * @disc: 获取资产信息
       * @params: address
       * @params: type 1：返回资产不为零的
       * @date: 2020-04-08 14:01
       * @author: Wave
       */
      async symbolReport() {
        let url = "http://192.168.1.132:18003";
        const params = {
          "jsonrpc": "2.0",
          "method": "getSymbolBaseInfo",
          "params": [2],
          "id": Math.floor(Math.random() * 1000)
        };
        let res = await axios.post(url, params);
        //console.log(res);
        if (res.data.result.length !== 0) {
          this.allAssetsList = res.data.result;
          sessionStorage.setItem('allAssetsList', JSON.stringify(this.allAssetsList));
          this.getAccountList(this.addressInfo.address, 1);
        }
      },

      /**
       * @disc: 搜索
       * @params: queryString
       * @params: cb
       * @date: 2020-04-08 10:26
       * @author: Wave
       */
      querySearchAsync(queryString, cb) {
        let restaurants = this.allAssetsList;
        let results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },

      /**
       * @disc: 数据筛选
       * @params: queryString 筛选字段
       * @date: 2020-04-08 15:04
       * @author: Wave
       */
      createStateFilter(queryString) {
        return (state) => {
          return (state.symbol.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },

      /**
       * @disc: 搜索框选中的币种
       * @params: item
       * @date: 2020-04-08 15:05
       * @author: Wave
       */
      handleSelect(item) {
        console.log(item);
        this.searchValue = item.symbol;
      },

      /**
       * @disc: 获取链内资产列表
       * @params: address
       * @params: type 1：返回资产不为零的
       * @date: 2020-04-08 14:01
       * @author: Wave
       */
      async getAccountList(address, type) {
        let url = "http://192.168.1.132:18003";
        const params = {
          "jsonrpc": "2.0",
          "method": "getAccountLedgerList",
          "params": [2, address, type],
          "id": Math.floor(Math.random() * 1000)
        };
        let res = await axios.post(url, params);
        //console.log(res);
        if (res.data.result.length !== 0) {
          for (let item of res.data.result) {
            //console.log(item);
            let assetsInfo = this.allAssetsList.filter(k => k.chainId === item.chainId);
            item.usdPrice = assetsInfo[0].usdPrice;
            item.currency = assetsInfo[0].icon;
            item.name = item.symbol;
            item.number = divisionDecimals(item.totalBalance, item.decimals);
            item.valuation = Number(Times(item.number, item.usdPrice));
            item.locking = divisionDecimals(Number(Plus(item.timeLock, item.consensusLock)), item.decimals);
            item.usdLocking = Number(Times(item.locking, item.usdPrice));
            item.available = divisionDecimals(item.balance, item.decimals);
            item.usdAvailable = Number(Times(item.available, item.usdPrice));

            //我的资产数据
            this.myAssetsInfo.total = Number(Plus(this.myAssetsInfo.total, item.valuation));
            this.myAssetsInfo.available = Number(Plus(this.myAssetsInfo.available, item.usdAvailable));
            this.myAssetsInfo.locking = Number(Plus(this.myAssetsInfo.locking, item.usdLocking));
          }
          this.ledgerData = res.data.result;

          //环形图数据
          for (let item of this.ledgerData) {
            item.key = item.symbol;
            item.value = item.valuation;
            item.rate = Number(Division(item.valuation, this.myAssetsInfo.total)) * 100;
          }
          this.chartData = this.ledgerData;
        }
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
    background-color: #fafcfe;
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
