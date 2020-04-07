<template>
  <div class="home">
    <div class="top w1200">
      <div class="left fl shadow">
        <h4>我的资产</h4>
        <div>
          <div class="fl total">
            <h6>总额</h6>
            <p>≈ $ 88888.8888</p>
          </div>
          <div class="fr lock">
            <h6>可用</h6>
            <p>≈ $ 88888.8888</p>
            <h6>锁定</h6>
            <p>≈ $ 888.8888</p>
          </div>
        </div>
      </div>
      <div class="right fr">
      </div>
    </div>
    <div class="footer cb w1200">
      <h4>链内交易</h4>
      <div class="">
        <el-table :data="tableData" border class="tabs">
          <el-table-column label="" width="30">
          </el-table-column>
          <el-table-column prop="currency" label="币种" width="100">
          </el-table-column>
          <el-table-column prop="name" label="名称" width="100">
          </el-table-column>
          <el-table-column prop="number" label="数量" width="170">
          </el-table-column>
          <el-table-column prop="valuation" label="估值" width="170">
          </el-table-column>
          <el-table-column prop="locking" label="锁定" width="170">
          </el-table-column>
          <el-table-column prop="available" label="可用" width="170">
          </el-table-column>
          <el-table-column label="操作" min-width="200">
            <template slot-scope="scope">
              <el-button @click="inChains(scope.row)" type="text" size="small">链内转账</el-button>
              <el-button @click="crossLink(scope.row)" type="text" size="small">跨链转账</el-button>
              <el-button @click="crossLinkCarry(scope.row)" type="text" size="small">跨链提币</el-button>
              <el-button @click="transactionList(scope.row)" type="text" size="small">交易记录</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
  import {divisionDecimals} from '@/api/util'

  export default {
    data() {
      return {
        tableData: [
          {
            currency: 'nuls',
            name: 'NULS',
            number: '123456.1234567',
            valuation: '12345678.12345678',
            locking: '12345678.12345678',
            available: '12345678.12345678'
          },
          {
            currency: 'nuls',
            name: 'NULS',
            number: '123456.1234567',
            valuation: '12345678.12345678',
            locking: '12345678.12345678',
            available: '12345678.12345678'
          },
          {
            currency: 'nuls',
            name: 'NULS',
            number: '123456.1234567',
            valuation: '12345678.12345678',
            locking: '12345678.12345678',
            available: '12345678.12345678'
          },
        ]
      };
    },
    created() {
    },
    mounted() {
    },
    watch: {},
    methods: {

      /**
       * @disc: 链内转账
       * @params: row 选择币种信息
       * @date: 2020-04-07 16:30
       * @author: Wave
       */
      inChains(row) {
        console.log(row);
        this.toUrl('transfer', '', 0)
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
        this.toUrl('transfer', '', 0)
      },

      /**
       * 连接跳转
       * @param name
       * @param parameter
       * @param type 0:路由跳转 1:浏览器跳转
       */
      toUrl(name, parameter, type) {
        if (type === 0) {
          this.$router.push({
            name: name
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
      h4 {
        font-size: 16px;
        font-weight: bold;
        color: #2688f7;
        border-bottom: 1px solid #dfe4ef;
        padding: 0 0 10px 0;
        margin: 0 0 20px 0;
      }
      .tabs {
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
