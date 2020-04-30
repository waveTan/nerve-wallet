<template>
  <div class="consensus w1200">
    <div class="my-node shadow1" v-loading="myNodeLoading">
      <div class="head">
        <h3 class="fl">{{$t('consensus.consensus11')}}</h3>
        <div class="node-info fl" v-if="myNodeData.agentId">
          <ul>
            <li class="uppercase">ID: {{myNodeData.agentId}}</li>
            <li>{{$t('public.alias')}}: {{myNodeData.alias || '-'}}</li>
            <li>{{$t('consensus.consensus12')}}: {{judgeNodeType(myNodeData.bankNode, myNodeData.status)}}</li>
          </ul>
        </div>
        <div class="to-node-detail click fCN fr" v-if="myNodeData.agentId"
             @click="toUrl('consensusInfo',myNodeData.txHash)">
          {{$t('consensus.consensus13')}}
        </div>
      </div>
      <div class="body">
        <div class="exist-node" v-if="myNodeData.agentId">
          <div>{{$t('public.deposit')}}<p>{{myNodeData.deposit+' NVT'}}</p></div>
          <div>{{$t('consensus.consensus15')}}<p>{{myNodeData.ranking}}</p></div>
          <div>{{$t('consensus.consensus16')}}<p>{{myNodeData.reward}}</p></div>
          <div>{{$t('public.credit')}}<p>{{myNodeData.creditValue}}</p></div>
        </div>
        <div class="create-node" v-else>
          <el-button type="primary" @click="toUrl('newConsensus')">{{$t('newConsensus.newConsensus0')}}</el-button>
        </div>
      </div>
    </div>

    <el-tabs v-model="consensusActive" @tab-click="handleClick" class="tab-list">
      <el-tab-pane :label="$t('consensus.consensus9')" name="consensusFirst">
        <div class="filter">
          <SelectBar v-model="nodeTypeRegion" :typeOptions="nodeTypeOptions" typeName="nodeType"
                     @change="changeNodeType">
          </SelectBar>
          <SelectBar v-model="nodeStatusRegion" :typeOptions="nodeStatusOptions" typeName="nodeStatus"
                     @change="changeNodeStatus">
          </SelectBar>
          <el-input :placeholder="$t('consensus.consensus10')" class="search" v-model="searchValue"
                    suffix-icon="el-icon-search">
            <i class="iconfont icon-search_icon fr click"></i>
          </el-input>
          <i class="fr click" :class="viewList ? 'el-icon-s-unfold':'el-icon-menu'"
             @click="viewList = !viewList"></i>
        </div>
        <div class="node" v-loading="allNodeLoading" v-show="viewList">
          <div class="node_info shadow1" v-for="item in searchData" :key="item.agentId">
            <h4>
              <span class="uppercase fCN">{{item.agentId}}</span>&nbsp;
              <i class="iconfont fr"
                 :class="item.status ===0 ? 'icondaigongshi fred' : 'icongongshizhong fCN'"></i>
            </h4>
            <ul class="bg-white click" @click="toUrl('consensusInfo',item.txHash)">
              <li>{{$t('public.alias')}}<span>{{item.agentAlias || '-'}}</span></li>
              <li>{{$t('consensus.consensus12')}}<span>{{judgeNodeType(item.bankNode, item.status)}}</span></li>
              <li>{{$t('public.deposit')}}<span>{{item.deposit}}<font class="fCN"> NVT</font></span></li>
              <li>{{$t('public.credit')}}<span>{{item.creditValue}}</span></li>
            </ul>
          </div>
          <div class="cb"></div>
        </div>
        <div v-show="!viewList" v-loading="allNodeLoading" class="c_tabs">
          <el-table :data="searchData" stripe border style="width: 100%">
            <el-table-column label="" width="80">
            </el-table-column>
            <el-table-column label="ID" min-width="150" align="left">
              <template slot-scope="scope"><span class="cursor-p click uppercase"
                                                 @click="toUrl('consensusInfo',scope.row.txHash)">{{ scope.row.agentId }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('public.alias')" min-width="150" align="left">
              <template slot-scope="scope"><span>{{ scope.row.agentAlias ? scope.row.agentAlias : '-' }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="creditValue" :label="$t('public.credit')" min-width="150"></el-table-column>

            <el-table-column :label="$t('public.deposit')+' (NVT)'" min-width="150" align="left">
              <template slot-scope="scope"><span class="cursor-p click uppercase"
                                                 @click="toUrl('consensusInfo',scope.row.txHash,'three')">{{ scope.row.deposit}}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('consensus.consensus12')" min-width="150" align="left">
              <template slot-scope="scope">
                <span>{{judgeNodeType(scope.row.bankNode, scope.row.status)}}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import SelectBar from '@/components/SelectBar';
  import {divisionDecimals, copys} from '@/api/util'

  export default {
    name: 'consensus',
    data() {
      return {
        //是否显示列表
        viewList: true,
        myNodeLoading: true,
        consensusActive: 'consensusFirst',
        //排序下拉框选择列表
        nodeTypeOptions: [
          {value: 0, label: '0'},
          {value: 1, label: '1'},
          {value: 2, label: '2'}
        ],
        nodeTypeRegion: 0,//节点类型，type=0时，返回所有交易
        //节点类型排序
        nodeStatusOptions: [
          {value: 0, label: '0'},
          {value: 1, label: '1'},
          {value: 2, label: '2'}
        ],
        nodeStatusRegion: 0,

        searchValue: '',//搜索框
        allNodeData: [],//所有节点信息
        allNodeLoading: true,//所有节点信息加载动画
        addressInfo: this.$store.getters.getSelectAddress, //账户信息
        agentAsset: JSON.parse(sessionStorage.getItem('info')),//pocm合约单位等信息
        isRed: false,//地址是否有红牌
        pageIndex: 1, //页码
        pageSize: 500, //每页条数
        pageTotal: 0,//总页数
        myNodeData: [],//我的节点信息
      };
    },
    components: {
      SelectBar
    },
    created() {
    },
    mounted() {
      this.getSelectAddressInfo()
      this.getConsensusNodes(this.pageIndex, this.pageSize, this.nodeTypeRegion);
    },
    computed: {
      //数据筛选
      searchData: function () {
        let search = this.searchValue;
        if (search) {
          return this.allNodeData.filter(function (product) {
            return Object.keys(product).some(function (key) {
              return String(product[key]).toLowerCase().indexOf(search.toLowerCase()) > -1
            })
          })
        }
        return this.allNodeData;
      },
      computeNodeType() {
        return [
          this.$t('nodeStatus.2'),
          this.$t('nodeStatus.1'),
          this.$t('nodeStatus.3'),
        ]
      }
    },
    watch: {
      '$store.getters.getSelectAddress': {
        // immediate: true,
        // deep: true,
        handler: function(val, old) {
          if (val.address !== old.address) {
            this.addressInfo = this.$store.getters.getSelectAddress
            this.getSelectAddressInfo()
          }
        }
      },
    },
    methods: {
      getSelectAddressInfo() {
        this.myNodeData={}
        this.myNodeLoading = true
        this.getConsensusInfoByAddress(this.pageIndex, this.pageSize, this.addressInfo.address);
        this.getAddressInfoByNode(this.addressInfo);
        this.getPunishByAddress(this.addressInfo.address);
      },
      //判断节点类型
      judgeNodeType(bankNode, isConsensus) {
        if (bankNode) {
          return this.computeNodeType[0]
        } else if (isConsensus) {
          return this.computeNodeType[1]
        } else {
          return this.computeNodeType[2]
        }
      },
      /**
       * 查询创建地址是否有红牌
       * @param address
       **/
      getPunishByAddress(address) {
        this.$post('/', 'getPunishList', [1, 1, 2, address])
          .then((response) => {
            //console.log(response);
            if (response.result.list.length !== 0) {
              this.isRed = true;
            } else {
              this.isRed = false;
            }
          }).catch((error) => {
          this.$message({message: this.$t('public.err3') + error, type: 'error', duration: 1000});
        });
      },

      /**
       * 获取地址网络信息
       * @param addressInfos
       **/
      async getAddressInfoByNode(addressInfos) {
        await this.$post('/', 'getAccount', [addressInfos.address])
          .then((response) => {
            //console.log(response);
            if (response.hasOwnProperty("result")) {
              let newAddressInfo = [...this.$store.state.addressInfo];
              for (let item of newAddressInfo) {
                if (item.address === addressInfos.address) {
                  newAddressInfo.alias = response.result.alias;
                  newAddressInfo.symbol = response.result.symbol;
                  newAddressInfo.balance = divisionDecimals(response.result.balance);
                  newAddressInfo.consensusLock = divisionDecimals(response.result.consensusLock);
                  newAddressInfo.totalReward = divisionDecimals(response.result.totalReward);
                  if (response.result.lastReward) {
                    newAddressInfo.lastReward = divisionDecimals(response.result.lastReward);
                  } else {
                    newAddressInfo.lastReward = 0;
                  }
                  newAddressInfo.totalIn = divisionDecimals(response.result.totalIn);
                  newAddressInfo.totalOut = divisionDecimals(response.result.totalOut);
                }
              }
              //newAddressInfo =
              this.$store.commit('setAddressInfo', newAddressInfo)
            }
          })
          .catch((error) => {
            console.log("getAccount:" + error);
          });
      },

      /**
       * 所有共识列表信息
       * @param pageIndex
       * @param pageSize,
       * @param type
       **/
      getConsensusNodes(pageIndex, pageSize, type) {
        this.allNodeLoading = true;
        this.$post('/', 'getConsensusNodes', [pageIndex, pageSize, type])
          .then((response) => {
            //console.log(response);
            if (response.hasOwnProperty("result")) {
              for (let itme of response.result.list) {
                itme.bozhengjin = itme.deposit;
                itme.deposit = Number(divisionDecimals(itme.deposit)).toFixed(3);
                //itme.agentReward = Number(divisionDecimals(itme.agentReward)).toFixed(3);
                itme.totalDeposit = Number(divisionDecimals(itme.totalDeposit)).toFixed(3);
                //itme.totalReward = Number(divisionDecimals(itme.totalReward)).toFixed(3);
              }
              this.allNodeData = response.result.list;
              this.allNodeLoading = false;
            }
          })
          .catch((error) => {
            console.log("getConsensusNodes:" + error);
          });

      },

      /**
       * 我的节点（根据地址获取共识信息）
       * @param pageIndex
       * @param pageSize
       * @param address
       **/
      getConsensusInfoByAddress(pageIndex, pageSize, address) {
        this.$post('/', 'getAccountConsensusNode', [address])
          .then((response) => {
            //console.log(response);
            if (response.hasOwnProperty("result")) {
              response.result.deposit = Number(divisionDecimals(response.result.deposit)).toFixed(3);
              response.result.totalDeposit = Number(divisionDecimals(response.result.totalDeposit)).toFixed(3);
              response.result.totalReward = Number(divisionDecimals(response.result.totalReward)).toFixed(3);
              this.myNodeLoading = false;
              this.myNodeData = response.result
            }
          })
          .catch((error) => {
            console.log("getAccountConsensus:" + error);
          });
      },

      /**
       *  根据节点类型筛选
       *  @param type
       **/
      changeNodeStatus(type) {
        this.nodeStatusRegion = type;
        this.getConsensusNodes(this.pageIndex, this.pageSize, this.nodeStatusRegion)
      },

      /**
       *  根据数据排序
       *  @param type
       **/
      changeNodeType(type) {
        this.nodeTypeRegion = parseInt(type);
        switch (type) {
          case 1:
            this.nodeTypeSort(this.allNodeData, 'creditValue');
            break;
          case 2:
            this.nodeTypeSort(this.allNodeData, 'deposit');
            break;
          default:
            this.getConsensusNodes(this.pageIndex, this.pageSize, this.nodeStatusRegion)
        }
      },

      /**
       * 数组排序
       */
      nodeTypeSort(arr, name) {
        //console.log(name);
        let compare = function (prop) {
          return function (obj1, obj2) {
            let val1 = obj1[prop];
            let val2 = obj2[prop];
            if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
              val1 = Number(val1);
              val2 = Number(val2);
            }
            if (val1 > val2) {
              return -1;
            } else if (val1 < val2) {
              return 1;
            } else {
              return 0;
            }
          }
        };
        return arr.sort(compare(name));
      },

      /**
       * 连接跳转
       * @param name
       * @param params
       */
      toUrl(name, params) {
        //console.log(name,params);
        let newQuery = {};
        if (name === 'consensusInfo') {
          newQuery = {hash: params}
        } else {
          newQuery = {consensusLock: params}
        }
        this.$router.push({
          name: name,
          query: newQuery
        })
      },

      /**
       * 复制方法
       * @param sting
       **/
      copy(sting) {
        copys(sting);
        this.$message({message: this.$t('public.copySuccess'), type: 'success', duration: 1000});
      },

      /**
       * tab 切换
       * @param tab
       */
      handleClick(tab) {
        this.consensusActive = tab.name;
        /*if (tab.name === 'consensusFirst') {
          this.getConsensusNodes(this.pageIndex, this.pageSize, this.nodeTypeRegion);
        } else {
          this.getConsensusInfoByAddress(this.pageIndex, this.pageSize, this.addressInfo.address);
        }*/
      }
    }
  }
</script>

<style lang="less">
  @import "./../../assets/css/style";

  .consensus {

    .my-node {
      margin: 40px 0;
      .head {
        overflow: hidden;
        padding: 0 30px;
        height: 48px;
        line-height: 48px;
        border-bottom: 1px solid #dfe4ef;
        font-size: 16px;
        h3 {
          font-size: 18px;
          font-weight: 600;
          color: #475472;
        }
        li {
          float: left;
          color: #74819e;
          margin: 0 30px;
          &:last-child {
            float: right;
          }
        }
      }
      .body {
        text-align: center;
        padding: 40px 0;
        .exist-node {
          display: flex;
          justify-content: space-around;
          & > div {
            color: #74819e;
            p {
              font-weight: 600;
              color: #475472;
              margin: 3px 0;
            }
          }
        }
        .create-node {
          .el-button {
            padding: 12px 40px;
          }
        }

      }
    }
    .tab-list {
      .el-input.search {
        float: none;
        width: 360px;
        & + i {
          font-size: 24px;
          margin-top: 15px;
        }
      }
    }
    .node {
      margin-bottom: 100px;
      padding-left: 10px;
      .node_info {
        width: 580px;
        height: 120px;
        margin: 20px 20px 0 0;
        padding: 15px 30px;
        float: left;
        &:nth-child(2n) {
          margin-right: 0
        }
        h4 {
          height: 32px;
          line-height: 32px;
          .follow {
            float: right;
            padding-top: 5px;
          }
        }
        ul {
          padding: 0 0 2px 0;
          li {
            height: 23px;
            float: left;
            width: 50%;
            line-height: 23px;
            font-size: 14px;
            color: #74819e;
            span {
              float: right;
              text-align: left;
              width: 150px;
              color: #475472;
            }
          }

        }
      }
    }
    .c_tabs {
      margin-bottom: 100px;
    }
    #tab-consensusFirst {
      cursor: auto;
      font-size: 18px;
      font-weight: 600;
      color: #475472;
    }
  }
</style>
