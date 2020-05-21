<template>
  <div class="consensus_info w1200">
    <div class="bg-white">
      <div class="w1200">
        <BackBar :backTitle="$t('nav.consensus')"></BackBar>
      </div>
    </div>
    <div class="node-info shadow1" v-loading="nodeInfoLoading">
      <div class="head">
        <h3 class="fCN fl uppercase">ID: {{nodeInfo.agentId}}</h3>
        <span :class="['fr',nodeInfo.status===1?'resolve':'fred']">{{nodeInfo.status===1?$t('consensus.consensus21'):$t('consensus.consensus22')}}</span>
      </div>
      <div class="body clear">
        <div class="left-part">
          <p>{{$t('consensusInfo.consensusInfo8')}} <label>{{nodeInfo.agentAlias ? nodeInfo.agentAlias :'-' }}</label>
          </p>
          <p>{{$t('public.createAddress')}} <label>{{nodeInfo.agentAddress}}</label></p>
          <p>{{$t('public.rewardAddress')}} <label>{{nodeInfo.rewardAddress}}</label></p>
          <p>{{$t('public.packingAddress')}} <label>{{nodeInfo.packingAddress}}</label></p>
          <p>{{$t('consensus.consensus12')}} <label>{{judgeNodeType(nodeInfo.bankNode, nodeInfo.status)}}</label></p>
        </div>
        <div class="right-part">
          <p>{{$t('public.credit')}} <label>{{nodeInfo.creditValue}}</label></p>
          <p>{{$t('public.deposit')}} <label>{{nodeInfo.deposits}}<span
                  class="fCN"> {{agentAsset.agentAsset.symbol}}</span></label></p>
          <p>{{$t('consensusInfo.consensusInfo9')}} <label>{{nodeInfo.createTime}}</label></p>
          <!--<p>
            {{$t('public.totalStake')}}
            <label>{{nodeInfo.totalDeposit}}<span class="fCN">{{agentAsset.agentAsset.symbol}}</span></label>
          </p>-->
          <p>
            {{$t('consensusInfo.consensusInfo7')}}
            <label>{{nodeInfo.reward}}<span class="fCN"> {{agentAsset.agentAsset.symbol}}</span></label>
          </p>
          <p>
            {{$t('consensusInfo.consensusInfo10')}}
            <label>
              <u class="click td" @click="toUrl('consensusInfo',nodeInfo.txHash)">
                {{nodeInfo.yellowCardCount}}{{$t('consensusInfo.consensusInfo11')}}
              </u>
            </label>
          </p>
          <el-button class="fr" type="danger" @click="stopNode" v-if="addressInfo.address===nodeInfo.agentAddress">
            {{$t('consensusInfo.consensusInfo5')}}
          </el-button>
        </div>
      </div>
    </div>
    <div v-loading="nodeDepositLoading" class="entrust-list">
      <div class="head">
        {{$t('public.total')}} {{pageTotal+' ' +$t('public.item') + ' ' +$t('consensus.consensus18')}},
        {{$t('consensus.consensus19')+ ' '+nodeInfo.deposits+ ' '+ agentAsset.agentAsset.symbol}},
        {{$t('consensus.consensus16')+ ' '+nodeInfo.reward+ ' '+ agentAsset.agentAsset.symbol}}
        <el-button type="danger" class="fr" @click="quit" v-if="addressInfo.address===nodeInfo.agentAddress">
          {{$t('consensusInfo.consensusInfo0')}}
        </el-button>
        <el-button type="primary" class="fr" @click="addition" v-if="addressInfo.address===nodeInfo.agentAddress">
          {{$t('consensus.consensus20')}}
        </el-button>
      </div>
      <el-table :data="nodeDepositData" stripe border class="shadow1">
        <el-table-column width="30"></el-table-column>
        <el-table-column prop="blockHeight" :label="$t('public.height')" width="120">
        </el-table-column>
        <el-table-column label="TXID" min-width="90">
          <template slot-scope="scope">
            <span class="click " @click="toUrl('transferInfo',scope.row.txHash)">{{scope.row.txHashs}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="amount" :label="$t('public.deposit')+' ('+prefix+')'" min-width="70">
        </el-table-column>
        <el-table-column prop="" :label="$t('consensus.consensus16')+' ('+prefix+')'" min-width="80">
        </el-table-column>
        <el-table-column prop="createTime" :label="$t('public.time')" min-width="90">
        </el-table-column>
        <el-table-column :label="$t('public.status')" min-width="60">
          <template v-slot="scope">{{scope.row.type===1 ?
            $t('consensusInfo.consensusInfo13'):$t('consensusInfo.consensusInfo14')}}
          </template>
        </el-table-column>
      </el-table>
      <div class="pages">
        <div class="page-total">
          {{$t('public.display')}} {{pageIndex-1 === 0 ? 1 : (pageIndex-1) *pageSize}}-{{pageIndex*pageSize}}
          {{$t('public.total')}} {{pageTotal}}
        </div>
        <el-pagination class="fr" background v-show="pageTotal>pageSize" @current-change="nodeDepositPages"
                       :page-size="pageSize"
                       layout=" prev, pager, next, jumper"
                       :total="pageTotal">
        </el-pagination>
      </div>
      <el-dialog class="form-dialog"
                 :title="operateType===1?$t('consensus.consensus20'):$t('consensusInfo.consensusInfo0')"
                 :visible.sync="additionDialog" width="38rem">
        <el-form :model="jionNodeForm" status-icon :rules="jionNodeRules" ref="jionNodeForm">
          <el-form-item
                  :label="operateType===1?$t('consensusInfo.consensusInfo1'):$t('consensusInfo.consensusInfo15')+': '"
                  prop="amount">
            <span class="balance font12 fr" v-if="operateType===1">{{$t('consensus.consensus2')}}：{{balanceInfo.balance/100000000}}</span>
            <el-input v-model="jionNodeForm.amount"></el-input>
            <!--<div class="fred font12">最小金额为2000</div>-->
          </el-form-item>
          <el-form-item :label="$t('public.fee')+': '">
            <span class="fee">0.001 NVT</span>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="additionDialog = false">{{$t('password.password2')}}</el-button>
          <el-button type="primary" @click="handleSubmit('jionNodeForm')">{{$t('password.password3')}}</el-button>
        </div>
      </el-dialog>
    </div>

    <Password ref="password" @passwordSubmit="passSubmit">
    </Password>
  </div>
</template>

<script>
  import moment from 'moment'
  import nerve from 'nerve-sdk-js'
  import {
    getNulsBalance,
    countFee,
    inputsOrOutputs,
    validateAndBroadcast,
    agentDeposistList,
    getPrefixByChainId,
    getReduceNonceList
  } from '@/api/requestData'
  import {
    timesDecimals,
    getLocalTime,
    Minus,
    Times,
    connectToExplorer,
    chainID,
    superLong,
    divisionDecimals
  } from '@/api/util'
  import Password from '@/components/PasswordBar'
  import BackBar from '@/components/BackBar'

  export default {
    data() {
      let checkAmount = (rule, value, callback) => {
        let usable = Number(Minus(Number(timesDecimals(500000)), Number(this.nodeInfo.deposit)));
        let balance = Number(Minus(this.balanceInfo.balance, Number(Times(value, 100000000))));
        let re = /^\d+(?=\.{0,1}\d+$|$)/;
        let res = /^\d{1,8}(\.\d{1,8})?$/;
        if (this.operateType === 1) {
          if (!value) {
            return callback(new Error(this.$t('consensusInfo.consensusInfo2')));
          } else if (!re.exec(value) || !res.exec(value)) {
            callback(new Error(this.$t('consensusInfo.consensusInfo3')))
          } else if (value < 2000) {
            return callback(new Error(this.$t('consensusInfo.consensusInfo43')));
          } else if (value > usable) {
            return callback(new Error(this.$t('consensusInfo.consensusInfo41') + usable + this.$t('consensusInfo.consensusInfo42')));
          } else if (balance < 0.001) {
            return callback(new Error(this.$t('transfer.transfer131') + Number(Minus(Number(divisionDecimals(this.balanceInfo.balance)), 0.001))));
          } else {
            callback()
          }
        } else {
          //console.log(this.nodeInfo);
          let maxNumber = Number(Minus(this.nodeInfo.deposit, 2000000000000));
          if (!value) {
            return callback(new Error(this.$t('consensusInfo.consensusInfo16')));
          } else if (!re.exec(value) || !res.exec(value)) {
            return callback(new Error(this.$t('consensusInfo.consensusInfo17')))
          } else if (value > Number(divisionDecimals(maxNumber))) {
            return callback(new Error("您最多可以退出:" + Number(divisionDecimals(maxNumber))))
          } else {
            callback()
          }
        }

      };

      return {
        addressInfo: this.$store.getters.getSelectAddress,//账户信息
        balanceInfo: {},//余额信息
        agentAsset: JSON.parse(sessionStorage.getItem('info')),//pocm合约单位等信息
        nodeInfo: {},//节点详情
        fee: 0.001,//手续费
        outInfo: '',//退出信息
        passwordType: 0,//输入密码后的提交类型 0:加入委托 1:退出委托 2:注销节点
        nodeDepositData: [],//委托列表
        nodeDepositLoading: true,//委托类别加载动画
        pageIndex: 1, //页码
        pageSize: 5, //每页条数
        pageTotal: 0,//总页数
        jionNodeForm: {
          amount: ''
        },
        jionNodeRules: {
          amount: [
            {validator: checkAmount, trigger: ['blur', 'change']}
          ]
        },
        prefix: '',//地址前缀
        txHexRandom: '', //web端提交txHex到后台的key
        signDataKeyRandom: '', // app端提交签名的key
        additionDialog: false,
        nodeInfoLoading: true
      };
    },
    components: {
      Password,
      BackBar
    },
    watch: {
      '$store.getters.getSelectAddress': {
        handler: function (val, old) {
          if (val.address !== old.address) {
            this.addressInfo = this.$store.getters.getSelectAddress;
            this.jionNodeForm.amount = '';
            this.getSelectAddressInfo()
          }
        }
      }
    },
    computed: {
      computeNodeType() {
        return [
          this.$t('nodeStatus.2'),
          this.$t('nodeStatus.1'),
          this.$t('nodeStatus.3'),
        ]
      },
      operateType() {
        return this.passwordType === 0 ? 1 : 2
      }
    },
    created() {
      getPrefixByChainId(chainID()).then((response) => {
        //console.log(response);
        this.prefix = response
      }).catch((err) => {
        console.log(err);
        this.prefix = '';
      });
      this.getSelectAddressInfo();
      this.getNodeInfoByHash();
      agentDeposistList(this.$route.query.hash);
      //getReduceDepositList(this.agentAsset.agentAsset.chainId, this.$route.query.hash, '', 8000)
    },
    mounted() {
    },
    methods: {

      //获取当前用户账户信息&委托列表
      getSelectAddressInfo() {
        this.getBalanceByAddress();
        this.getNodeDepositByHash()
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
       * 根据hash获取节点详情信息
       **/
      getNodeInfoByHash() {
        this.nodeInfoLoading = true;
        this.$post('/', 'getConsensusNode', [this.$route.query.hash])
          .then((response) => {
            this.nodeInfoLoading = false;
            console.log(response);
            if (response.hasOwnProperty("result")) {
              response.result.agentReward = divisionDecimals(response.result.agentReward);
              response.result.deposits = divisionDecimals(response.result.deposit);
              response.result.totalDeposit = divisionDecimals(response.result.totalDeposit);
              response.result.reward = divisionDecimals(response.result.reward);
              response.result.createTime = moment(getLocalTime(response.result.createTime * 1000)).format('YYYY-MM-DD HH:mm:ss');
              this.nodeInfo = response.result;
            }
          })
          .catch((error) => {
            console.log("getConsensusNode:" + error);
          });
      },

      /**
       * 根据hash获取节点委托列表
       **/
      getNodeDepositByHash() {
        this.nodeDepositLoading = true;
        const params = [this.pageIndex, this.pageSize, this.addressInfo.address, this.$route.query.hash];
        this.$post('/', 'getAccountDeposit', params)
          .then((response) => {
            //console.log(response);
            if (response.hasOwnProperty("result")) {
              for (let itme of response.result.list) {
                itme.amount = divisionDecimals(itme.amount);
                itme.fee = divisionDecimals(itme.fee);
                itme.createTime = moment(getLocalTime(itme.createTime * 1000)).format('YYYY-MM-DD HH:mm:ss');
                itme.txHashs = superLong(itme.txHash, 10)
              }
              this.nodeDepositData = response.result.list;
              this.pageTotal = response.result.totalCount;
              this.nodeDepositLoading = false;
            } else {
              this.nodeDepositLoading = false;
            }
          })
          .catch((error) => {
            console.log("getConsensusDeposit:" + error);
          });
      },

      /**
       * 委托列表分页
       * @param val
       **/
      nodeDepositPages(val) {
        this.pageIndex = val;
        this.getNodeDepositByHash(this.pageIndex, this.pageSize, this.addressInfo.address, this.$route.query.hash);
      },

      //追加保证金
      addition() {
        this.additionDialog = true;
        this.passwordType = 0;
      },

      //退出保证金
      quit() {
        this.additionDialog = true;
        this.passwordType = 1;
        const reduceAmount = Number(Times(this.jionNodeForm.amount, 100000000));
        //getReduceDepositList(this.agentAsset.agentAsset.chainId, this.$route.query.hash, '', reduceAmount)
      },

      //追加,退出保证金
      handleSubmit(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            this.$refs.password.showPassword(true);
            this.additionDialog = false
          } else {
            return false;
          }
        });
      },

      /**
       * 获取账户余额
       **/
      getBalanceByAddress() {
        const params = [this.agentAsset.agentAsset.chainId, this.agentAsset.agentAsset.assetId, this.addressInfo.address];
        getNulsBalance(...params).then((response) => {
          //console.log(response);
          if (response.success) {
            this.balanceInfo = response.data;
          } else {
            this.$message({message: this.$t('public.err2') + response, type: 'error', duration: 1000});
          }
        }).catch((error) => {
          this.$message({message: this.$t('public.err3') + error, type: 'error', duration: 1000});
        });
      },

      //注销节点
      async stopNode() {
        this.passwordType = 2;
        this.$refs.password.showPassword(true);
      },

      /**
       *  获取密码框的密码
       * @param password
       **/
      async passSubmit(password) {
        const pri = nerve.decrypteOfAES(this.addressInfo.aesPri, password);
        const newAddressInfo = nerve.importByKey(this.addressInfo.chainId, pri, password, this.prefix);
        if (newAddressInfo.address === this.addressInfo.address) {
          const amount = Number(Times(this.jionNodeForm.amount, 100000000));
          let transferInfo = {
            fromAddress: this.addressInfo.address,
            assetsChainId: this.agentAsset.agentAsset.chainId,
            assetsId: this.agentAsset.agentAsset.assetId,
            amount: amount,
            fee: 100000
          };
          let inOrOutputs = {};
          let txhex = '';
          let pub = this.addressInfo.pub;
          let remark = '';
          if (this.passwordType === 0) { //追加保证金
            inOrOutputs = await inputsOrOutputs(transferInfo, this.balanceInfo, 28);
            let depositInfo = {
              address: this.addressInfo.address,
              agentHash: this.$route.query.hash,
              amount: amount,
            };
            if (!inOrOutputs.success) {
              this.$message({message: this.$t('public.err1') + inOrOutputs.data, type: 'error', duration: 1000});
              return;
            }
            let tAssemble = await nerve.transactionAssemble(inOrOutputs.data.inputs, inOrOutputs.data.outputs, remark, 28, depositInfo);
            txhex = await nerve.transactionSerialize(pri, pub, tAssemble);
          } else if (this.passwordType === 1) { //退出保证金
            let depositHash = this.nodeInfo.txHash;
            let reduceNonceList = await getReduceNonceList(depositHash, amount, 0);
            //console.log(reduceNonceList);
            if (!reduceNonceList.success) {
              console.log("获取退出保证金ReduceNonceList错误");
              return;
            }
            transferInfo.depositHash = depositHash;
            transferInfo.nonceList = reduceNonceList.data;

            inOrOutputs = await inputsOrOutputs(transferInfo, this.balanceInfo, 29);
            //console.log(inOrOutputs);
            if (!inOrOutputs.success) {
              this.$message({message: this.$t('public.err1') + inOrOutputs.data, type: 'error', duration: 3000});
              console.log("inputOutputs组装失败!");
              return;
            }

            let entity = {agentHash: depositHash, address: transferInfo.fromAddress, amount: transferInfo.amount};
            let tAssemble = await nerve.transactionAssemble(inOrOutputs.data.inputs, inOrOutputs.data.outputs, remark, 29, entity);
            txhex = await nerve.transactionSerialize(pri, pub, tAssemble);

          } else if (this.passwordType === 2) { //注销节点
            let agentHash = this.nodeInfo.txHash;
            let reduceNonceList = await getReduceNonceList(agentHash, '0', 1);
            //console.log(reduceNonceList);
            if (!reduceNonceList.success) {
              console.log("获取退出保证金ReduceNonceList错误");
              return;
            }
            transferInfo.nonceList = reduceNonceList.data;
            transferInfo.amount = this.nodeInfo.deposit;

            inOrOutputs = await inputsOrOutputs(transferInfo, this.balanceInfo, 9);
            console.log(inOrOutputs);
            if (!inOrOutputs.success) {
              console.log("inputOutputs组装失败!");
              return;
            }

            let tAssemble = await nerve.transactionAssemble(inOrOutputs.data.inputs, inOrOutputs.data.outputs, remark, 9, {
              address: transferInfo.fromAddress,
              agentHash: agentHash
            });
            txhex = await nerve.transactionSerialize(pri, pub, tAssemble);
            console.log(txhex);

          }
          //console.log(txhex);
          await validateAndBroadcast(txhex).then((response) => {
            if (response.success) {
              //console.log(response);
              this.$message({message: this.$t('tips.tips0'), type: 'success', duration: 1000});
              this.$router.push({
                name: "txList"
              })
            } else {
              this.$message({message: this.$t('public.err') + response.data.code, type: 'error', duration: 1000});
            }
          }).catch((err) => {
            this.$message({message: this.$t('public.err0') + err, type: 'error', duration: 1000});
          });
        } else {
          this.$message({message: this.$t('address.address13'), type: 'error', duration: 1000});
        }
      },

      /**
       * 连接跳转
       * @param name
       * @param parameter
       */
      toUrl(name, parameter) {
        connectToExplorer(name, parameter);
      },
    }
  }
</script>

<style lang="less">
  @import "./../../assets/css/style";

  .consensus_info {
    .bg-white {
      margin: 20px 0;
    }
    .node-info {
      padding: 0 30px 20px;
      .head {
        height: 48px;
        line-height: 48px;
        border-bottom: 1px solid #dfe4ef;
        font-size: 18px;
        overflow: hidden;
        span {
          font-size: 14px;
          &.resolve {
            color: #4ade5f;
          }
        }
      }
      .body {
        .left-part, .right-part {
          float: left;
          width: 560px;
          p {
            height: 40px;
            line-height: 40px;
            padding: 0 30px;
            font-size: 14px;
            color: #8794b1;
            label {
              float: right;
              color: #475472;
            }
            &:nth-of-type(2n) {
              background-color: #f3f6fd;
            }
          }
        }
        .right-part {
          width: 520px;
          margin-left: 40px;
          .el-button {
            position: relative;
            bottom: 0;
            right: 0;
            margin: 0;
            padding: 10px 30px;
          }
        }
      }
    }
    .entrust-list {
      margin-top: 40px;
      padding-top: 10px;
      .head {
        border-bottom: 1px solid #dfe4ef;
        height: 40px;
        line-height: 40px;
        color: #8794b1;
        margin-bottom: 30px;
        font-size: 14px;
        .el-button {
          padding: 10px 30px;
          &:first-of-type {
            margin-left: 20px;
          }
          /* position: relative;
           right: 0;
           bottom: 10px;*/
        }
      }
      .el-table .el-table__header-wrapper {
        border-radius: 5px 5px 0 0;
      }
      .form-dialog .el-dialog {
        .el-dialog__body {
          .fee {
            color: #606266
          }
        }
      }

    }
    .entrust {
      border: @BD1;
      margin: 20px auto 0;
      .entrust_add {
        margin: 30px auto 50px;
        .balance {
          /*margin: 10px 0 0 0;*/
        }
      }
    }
    .entrust_list {
      margin: 50px auto 60px;
    }
  }
</style>
