<template>
  <div class="consensus_info w1200">
    <div class="bg-white">
      <div class="w1200">
        <BackBar :backTitle="$t('nav.consensus')"></BackBar>
      </div>
    </div>
    <div class="node-info shadow1">
      <div class="head">
        <h3 class="fCN fl uppercase">ID: {{nodeInfo.agentId}}</h3>
        <span :class="['fr',nodeInfo.status===0?'resolve':'fred']">{{nodeInfo.status===0?$t('consensus.consensus21'):$t('consensus.consensus22')}}</span>
      </div>
      <div class="body clear">
        <div class="left-part">
          <p>{{$t('public.createAddress')}} <label>{{nodeInfo.agentAddress}}</label></p>
          <p>{{$t('public.rewardAddress')}} <label>{{nodeInfo.rewardAddress}}</label></p>
          <p>{{$t('public.packingAddress')}} <label>{{nodeInfo.packingAddress}}</label></p>
          <p>{{$t('consensus.consensus12')}} <label>{{nodeInfo.type}}</label></p>
          <p>{{$t('consensusInfo.consensusInfo8')}} <label>{{nodeInfo.agentAlias ? nodeInfo.agentAlias :'--' }}</label></p>
          <p>{{$t('public.credit')}} <label>{{nodeInfo.creditValue}}</label></p>
        </div>
        <div class="right-part">
          <p>{{$t('public.deposit')}} <label>{{nodeInfo.deposits}}<span
            class="fCN">{{agentAsset.agentAsset.symbol}}</span></label></p>
          <p>{{$t('consensusInfo.consensusInfo9')}} <label>{{nodeInfo.createTime}}</label></p>
          <p>{{$t('public.totalStake')}} <label>{{nodeInfo.totalDeposit}}<span class="fCN">{{agentAsset.agentAsset.symbol}}</span></label></p>
          <p>{{$t('consensusInfo.consensusInfo7')}} <label>{{nodeInfo.totalReward}}<span class="fCN">{{addressInfo.symbol}}</span></label></p>
          <p>{{$t('consensusInfo.consensusInfo10')}} <label><u class="click td"
                                                               @click="toUrl('consensusInfo',nodeInfo.txHash)">{{nodeInfo.yellowCardCount}}{{$t('consensusInfo.consensusInfo11')}}</u></label>
          </p>
          <el-button class="fr" type="danger" @click="stopNode">{{$t('consensusInfo.consensusInfo5')}}</el-button>
        </div>
      </div>
    </div>


    <div v-loading="nodeDepositLoading" class="entrust-list">
      <div class="head">
        {{$t('public.total')}} {{pageTotal+' ' +$t('public.item') + $t('consensus.consensus18')}},
        {{$t('consensus.consensus19')+ ' '+nodeInfo.totalDeposit+' NVT'}},
        {{$t('consensus.consensus16')+ ' '+nodeInfo.totalReward+' NVT'}}
        <el-button type="primary" class="fr" @click="additionDialog=true">{{$t('consensus.consensus20')}}</el-button>
      </div>
      <el-table :data="nodeDepositData" stripe border class="shadow1">
        <el-table-column  width="20"></el-table-column>
        <el-table-column prop="blockHeight" :label="$t('public.height')" width="120">
        </el-table-column>
        <el-table-column prop="txHash"  label="TXID" ></el-table-column>
        <el-table-column prop="amount" :label="$t('consensus.consensus14')">
        </el-table-column>
        <el-table-column prop="" :label="$t('consensus.consensus16')">
        </el-table-column>
        <el-table-column prop="createTime" :label="$t('consensusList.consensusList1')">
        </el-table-column>
        <el-table-column :label="$t('public.operation')" align="center">
          <template slot-scope="scope">
            <label class="click tab_bn"
                   @click="cancelDeposit(scope.row)">{{$t('consensusInfo.consensusInfo0')}}</label>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog :title="$t('consensus.consensus20')" :visible.sync="additionDialog" width="38rem">
        <el-form :model="jionNodeForm" status-icon :rules="jionNodeRules">
          <el-form-item :label="$t('consensusInfo.consensusInfo1')+': '" prop="amount">
            <span class="balance font12 fr">{{$t('consensus.consensus2')}}：{{balanceInfo.balance/100000000}}</span>
            <el-input v-model="jionNodeForm.amount"></el-input>
          </el-form-item>
          <el-form-item :label="$t('public.fee')+': '">
            <span class="fee">0.0052 NVT</span>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="additionDialog = false">{{$t('password.password2')}}</el-button>
          <el-button type="primary" @click="additionDialog = true">{{$t('password.password3')}}</el-button>
        </div>
      </el-dialog>
      <!--<div class="entrust w1200 bg-white" v-show="jionNode">
        <div class="entrust_add w630">
          <el-form :model="jionNodeForm" status-icon :rules="jionNodeRules" ref="jionNodeForm" @submit.native.prevent>
            <el-form-item :label="$t('consensusInfo.consensusInfo1') + '('+agentAsset.agentAsset.symbol+')'"
                          prop="amount">
              <span class="balance font12 fr">{{$t('consensus.consensus2')}}：{{balanceInfo.balance/100000000}}</span>
              <el-input v-model="jionNodeForm.amount">
              </el-input>
            </el-form-item>
            <div class="font14">
              {{$t('public.fee')}}: {{fee}} <span class="fCN">{{agentAsset.agentAsset.symbol}}</span>
            </div>
            <el-form-item class="form-next">
              <el-button type="success" @click="jionNodeSubmitForm('jionNodeForm')">{{$t('password.password3')}}
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="entrust_list w1200" v-show="!jionNode">
        <div class="top_total font14">
          {{$t('public.totalStake')}}：{{nodeInfo.totalDeposit}} <span
                class="fCN">{{agentAsset.agentAsset.symbol}}</span>
        </div>

        <div class="top_ico">
          <i class="el-icon-plus click" @click="showNodeList"></i>
        </div>
        <el-table :data="nodeDepositData" stripe border>
          <el-table-column prop="blockHeight" :label="$t('public.height')" align="center">
          </el-table-column>
          <el-table-column prop="createTime" :label="$t('consensusList.consensusList1')" align="center">
          </el-table-column>
          <el-table-column prop="amount" :label="$t('public.amount') + '('+agentAsset.agentAsset.symbol+')'"
                           align="center">
          </el-table-column>
          <el-table-column :label="$t('public.operation')" align="center">
            <template slot-scope="scope">
              <label class="click tab_bn"
                     @click="cancelDeposit(scope.row)">{{$t('consensusInfo.consensusInfo0')}}</label>
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
      </div>-->
    </div>

    <Password ref="password" @passwordSubmit="passSubmit">
    </Password>
  </div>
</template>

<script>
  import moment from 'moment'
  import nuls from 'nuls-sdk-js'
  import {
    getNulsBalance,
    countFee,
    inputsOrOutputs,
    validateAndBroadcast,
    agentDeposistList,
    getPrefixByChainId,
    commitData
  } from '@/api/requestData'
  import {
    timesDecimals,
    getLocalTime,
    Minus,
    Times,
    addressInfo,
    connectToExplorer,
    chainID,
    getRamNumber,
    superLong,
    divisionDecimals
  } from '@/api/util'
  import Password from '@/components/PasswordBar'
  import BackBar from '@/components/BackBar'

  export default {
    data() {
      let checkAmount = (rule, value, callback) => {
        let usable = Number(Minus(500000, Number(this.nodeInfo.totalDeposit)));
        let balance = Number(Minus(this.balanceInfo.balance, Number(Times(value, 100000000))));
        let re = /^\d+(?=\.{0,1}\d+$|$)/;
        let res = /^\d{1,8}(\.\d{1,8})?$/;
        if (!value) {
          return callback(new Error(this.$t('consensusInfo.consensusInfo2')));
        } else if (!re.exec(value) || !res.exec(value)) {
          callback(new Error(this.$t('consensusInfo.consensusInfo3')))
        } else if (value < 2000) {
          return callback(new Error(this.$t('consensusInfo.consensusInfo43')));
        } else if (value > usable) {
          return callback(new Error(this.$t('consensusInfo.consensusInfo41') + usable + this.$t('consensusInfo.consensusInfo42')));
        } else if (balance < 0.001) {
          return callback(new Error(this.$t('transfer.transfer131') + Number(Minus(Number(timesDecimals(this.balanceInfo.balance)), 0.001))));
        } else {
          callback()
        }
      };

      return {
        addressInfo: {},//账户信息
        balanceInfo: {},//余额信息
        agentAsset: JSON.parse(sessionStorage.getItem('info')),//pocm合约单位等信息
        nodeInfo: {},//节点详情
        fee: 0.001,//手续费
        outInfo: '',//退出信息
        passwordType: 0,//输入密码后的提交类型 0:加入委托 1:退出委托 2:注销节点
        jionNode: false,//是否显示加入共识
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

      };
    },
    created() {
      getPrefixByChainId(chainID()).then((response) => {
        //console.log(response);
        this.prefix = response
      }).catch((err) => {
        console.log(err);
        this.prefix = '';
      });

      this.addressInfo = addressInfo(1);
      setInterval(() => {
        this.addressInfo = addressInfo(1);
      }, 500);
    },
    mounted() {
      setTimeout(() => {
        this.getBalanceByAddress(this.agentAsset.agentAsset.chainId, this.agentAsset.agentAsset.assetId, this.addressInfo.address);
        this.getNodeInfoByHash(this.$route.query.hash);
        this.getNodeDepositByHash(this.pageIndex, this.pageSize, this.addressInfo.address, this.$route.query.hash)
      }, 600);

    },
    components: {
      Password,
      BackBar
    },
    methods: {
      /**
       * 根据hash获取节点详情信息
       * @param hash
       **/
      getNodeInfoByHash(hash) {
        this.$post('/', 'getConsensusNode', [hash])
          .then((response) => {
            //console.log(response);
            if (response.hasOwnProperty("result")) {
              response.result.agentReward = divisionDecimals(response.result.agentReward);
              response.result.deposits = divisionDecimals(response.result.deposit);
              response.result.totalDeposit = divisionDecimals(response.result.totalDeposit);
              response.result.totalReward = divisionDecimals(response.result.totalReward);
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
       * @param pageIndex
       * @param pageSize
       * @param address
       * @param hash
       **/
      getNodeDepositByHash(pageIndex, pageSize, address, hash) {
        this.$post('/', 'getAccountDeposit', [pageIndex, pageSize, address, hash])
          .then((response) => {
            //console.log(response);
            if (response.hasOwnProperty("result")) {
              for (let itme of response.result.list) {
                itme.amount = divisionDecimals(itme.amount);
                itme.fee = divisionDecimals(itme.fee);
                itme.createTime = moment(getLocalTime(itme.createTime * 1000)).format('YYYY-MM-DD HH:mm:ss');
                itme.txHash = superLong(itme.txHash,10)
              }
              this.nodeDepositData = response.result.list;
              if (response.result.totalCount === 0) {
                this.jionNode = true
              } else {
                this.jionNode = false
              }
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

      /**
       * 显示加入共识
       **/
      showNodeList() {
        this.jionNode = true;
        this.getNodeDepositByHash(this.pageIndex, this.pageSize, this.$route.query.hash);
      },

      /**
       * 加入共识
       * @param formName
       **/
      jionNodeSubmitForm(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            this.passwordType = 0;
            if (this.addressInfo.aesPri === '') {
              this.txHexRandom = await getRamNumber(16);
              this.signDataKeyRandom = await getRamNumber(16);
              let assembleHex = await this.getAssemble();
              if (!assembleHex.success) {
                this.$message({message: this.$t('tips.tips3'), type: 'error', duration: 3000});
                return;
              }
              let commitDatas = await commitData(this.txHexRandom, this.signDataKeyRandom,this.addressInfo.address, assembleHex.data);
              if (!commitDatas.success) {
                this.$message({
                  message: this.$t('tips.tips4') + JSON.stringify(commitDatas.data),
                  type: 'error',
                  duration: 3000
                });
                return;
              }
              this.$refs.password.showScan(commitDatas.data.txInfo, commitDatas.data.assembleHex);
            } else {
              this.$refs.password.showPassword(true);
            }
          } else {
            return false;
          }
        });
      },

      /**
       * 获取账户余额
       * @param assetChainId
       * @param assetId
       * @param address
       **/
      getBalanceByAddress(assetChainId, assetId, address) {
        getNulsBalance(assetChainId, assetId, address).then((response) => {
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

      /**
       * 退出共识
       * @param outInfo
       **/
      async cancelDeposit(outInfo) {
        this.outInfo = outInfo;
        this.getBalanceByAddress(this.agentAsset.agentAsset.chainId, this.agentAsset.agentAsset.assetId, this.addressInfo.address);
        this.passwordType = 1;
        if (this.addressInfo.aesPri === '') {
          this.txHexRandom = await getRamNumber(16);
          this.signDataKeyRandom = await getRamNumber(16);
          let assembleHex = await this.getAssemble();
          if (!assembleHex.success) {
            this.$message({message: this.$t('tips.tips3'), type: 'error', duration: 3000});
            return;
          }
          let commitDatas = await commitData(this.txHexRandom, this.signDataKeyRandom,this.addressInfo.address, assembleHex.data);
          if (!commitDatas.success) {
            this.$message({
              message: this.$t('tips.tips4') + JSON.stringify(commitDatas.data),
              type: 'error',
              duration: 3000
            });
            return;
          }
          this.$refs.password.showScan(commitDatas.data.txInfo, commitDatas.data.assembleHex);
        } else {
          this.$refs.password.showPassword(true);
        }
      },

      /**
       *  注销节点
       **/
      async stopNode() {
        this.getBalanceByAddress(this.agentAsset.agentAsset.chainId, this.agentAsset.agentAsset.assetId, this.addressInfo.address);
        this.passwordType = 2;
        if (this.addressInfo.aesPri === '') {
          this.txHexRandom = await getRamNumber(16);
          this.signDataKeyRandom = await getRamNumber(16);
          let assembleHex = await this.getAssemble();
          if (!assembleHex.success) {
            this.$message({message: this.$t('tips.tips3'), type: 'error', duration: 3000});
            return;
          }
          let commitDatas = await commitData(this.txHexRandom, this.signDataKeyRandom,this.addressInfo.address, assembleHex.data);
          if (!commitDatas.success) {
            this.$message({
              message: this.$t('tips.tips4') + JSON.stringify(commitDatas.data),
              type: 'error',
              duration: 3000
            });
            return;
          }
          this.$refs.password.showScan(commitDatas.data.txInfo, commitDatas.data.assembleHex);
        } else {
          this.$refs.password.showPassword(true);
        }
      },

      /**
       *  获取密码框的密码
       * @param password
       **/
      async passSubmit(password) {
        const pri = nuls.decrypteOfAES(this.addressInfo.aesPri, password);
        const newAddressInfo = nuls.importByKey(this.addressInfo.chainId, pri, password, this.prefix);
        if (newAddressInfo.address === this.addressInfo.address) {
          let transferInfo = {
            fromAddress: this.addressInfo.address,
            assetsChainId: this.agentAsset.agentAsset.chainId,
            assetsId: this.agentAsset.agentAsset.assetId,
            amount: Number(Times(this.jionNodeForm.amount, 100000000)),
            fee: 100000
          };
          let inOrOutputs = {};
          let txhex = '';
          let pub = this.addressInfo.pub;
          let remark = '';
          if (this.passwordType === 0) { //加入共识
            inOrOutputs = await inputsOrOutputs(transferInfo, this.balanceInfo, 5);
            let depositInfo = {
              address: this.addressInfo.address,
              agentHash: this.$route.query.hash,
              deposit: Number(Times(this.jionNodeForm.amount, 100000000))
            };
            if (!inOrOutputs.success) {
              this.$message({message: this.$t('public.err1') + inOrOutputs.data, type: 'error', duration: 1000});
              return;
            }
            let tAssemble = await nuls.transactionAssemble(inOrOutputs.data.inputs, inOrOutputs.data.outputs, remark, 5, depositInfo);
            txhex = await nuls.transactionSerialize(pri, pub, tAssemble);
          } else if (this.passwordType === 1) { //退出共识
            transferInfo.amount = Number(Times(this.outInfo.amount, 100000000));
            transferInfo.depositHash = this.outInfo.txHash;
            inOrOutputs = await inputsOrOutputs(transferInfo, this.balanceInfo, 6);
            //console.log(inOrOutputs);
            if (inOrOutputs.success) {
              let tAssemble = await nuls.transactionAssemble(inOrOutputs.data.inputs, inOrOutputs.data.outputs, remark, 6, this.outInfo.txHash);
              txhex = await nuls.transactionSerialize(pri, pub, tAssemble);
            } else {
              this.$message({message: this.$t('public.err1') + inOrOutputs.data, type: 'error', duration: 1000});
            }
          } else if (this.passwordType === 2) { //注销节点
            transferInfo.amount = this.nodeInfo.deposit;
            transferInfo.depositHash = this.$route.query.hash;
            inOrOutputs = await inputsOrOutputs(transferInfo, this.balanceInfo, 9);
            //console.log(inOrOutputs);
            if (inOrOutputs.success) {
              let newInputs = inOrOutputs.data.inputs;
              let outputs = [];
              const depositList = await agentDeposistList(this.$route.query.hash);
              for (let itme of depositList.list) {
                //console.log(itme.address);
                newInputs.push({
                  address: itme.address,
                  assetsChainId: this.agentAsset.agentAsset.chainId,
                  assetsId: this.agentAsset.agentAsset.assetId,
                  amount: itme.amount,
                  locked: -1,
                  nonce: itme.txHash.substring(itme.txHash.length - 16)//这里是hash的最后16个字符
                });
                outputs.push({
                  address: itme.address,
                  assetsChainId: this.agentAsset.agentAsset.chainId,
                  assetsId: this.agentAsset.agentAsset.assetId,
                  amount: itme.amount,
                  lockTime: 0
                });
              }
              let addressArr = [];
              let newOutputs = [];
              outputs.forEach(function (item) {
                let i;
                if ((i = addressArr.indexOf(item.address)) > -1) {
                  //console.log(result, i);
                  newOutputs[i].amount = Number(newOutputs[i].amount) + Number(item.amount);
                } else {
                  addressArr.push(item.address);
                  newOutputs.push({
                    address: item.address,
                    amount: item.amount,
                    assetsChainId: item.assetsChainId,
                    assetsId: item.assetsId,
                    lockTime: item.lockTime,
                  })
                }
              });
              newOutputs.unshift(inOrOutputs.data.outputs[0]);
              newOutputs[0].lockTime = newOutputs[0].lockTime + 86400 * 3;
              /* console.log(newInputs);
               console.log(newOutputs);*/
              let tAssemble = await nuls.transactionAssemble(newInputs, newOutputs, remark, 9, this.$route.query.hash);
              //console.log(tAssemble);
              let newFee = countFee(tAssemble, 1);
              //console.log(transferInfo.fee !== newFee);
              if (transferInfo.fee !== newFee) {
                transferInfo.fee = newFee;
                newOutputs[0].amount = Number(Minus(this.nodeInfo.deposit, newFee).toString());
                tAssemble = await nuls.transactionAssemble(newInputs, newOutputs, remark, 9, this.$route.query.hash);
              }
              txhex = await nuls.transactionSerialize(pri, pub, tAssemble);
            }
            else {
              this.$message({message: this.$t('public.err1') + inOrOutputs.data, type: 'error', duration: 1000});
            }
          } else {
            console.log("交易类型错误")
          }

          //console.log(txhex);
          await validateAndBroadcast(txhex).then((response) => {
            //console.log(response);
            if (response.success) {
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
       * @disc: 组装交易序列化
       * @date: 2019-12-06 13:38
       * @author: Wave
       */
      async getAssemble() {
        let transferInfo = {
          fromAddress: this.addressInfo.address,
          assetsChainId: this.agentAsset.agentAsset.chainId,
          assetsId: this.agentAsset.agentAsset.assetId,
          amount: Number(Times(this.jionNodeForm.amount, 100000000)),
          fee: 100000
        };
        let inOrOutputs = {};
        let remark = '';
        let tAssemble = '';
        if (this.passwordType === 0) { //加入共识
          inOrOutputs = await inputsOrOutputs(transferInfo, this.balanceInfo, 5);
          let depositInfo = {
            address: this.addressInfo.address,
            agentHash: this.$route.query.hash,
            deposit: Number(Times(this.jionNodeForm.amount, 100000000))
          };
          if (!inOrOutputs.success) {
            this.$message({message: this.$t('public.err1') + inOrOutputs.data, type: 'error', duration: 3000});
            return {success: false};
          }
          tAssemble = await nuls.transactionAssemble(inOrOutputs.data.inputs, inOrOutputs.data.outputs, remark, 5, depositInfo);
          return {success: true, data: tAssemble}
        } else if (this.passwordType === 1) { //退出共识
          transferInfo.amount = Number(Times(this.outInfo.amount, 100000000));
          transferInfo.depositHash = this.outInfo.txHash;
          inOrOutputs = await inputsOrOutputs(transferInfo, this.balanceInfo, 6);
          //console.log(inOrOutputs);
          if (!inOrOutputs.success) {
            this.$message({message: this.$t('public.err1') + inOrOutputs.data, type: 'error', duration: 3000});
            return {success: false};
          }
          tAssemble = await nuls.transactionAssemble(inOrOutputs.data.inputs, inOrOutputs.data.outputs, remark, 6, this.outInfo.txHash);
          return {success: true, data: tAssemble}
        } else if (this.passwordType === 2) { //注销节点
          transferInfo.amount = this.nodeInfo.deposit;
          transferInfo.depositHash = this.$route.query.hash;
          inOrOutputs = await inputsOrOutputs(transferInfo, this.balanceInfo, 9);
          //console.log(inOrOutputs);

          if (!inOrOutputs.success) {
            this.$message({message: this.$t('public.err1') + inOrOutputs.data, type: 'error', duration: 3000});
            return {success: false};
          }

          let newInputs = inOrOutputs.data.inputs;
          let outputs = [];
          const depositList = await agentDeposistList(this.$route.query.hash);
          for (let itme of depositList.list) {
            //console.log(itme.address);
            newInputs.push({
              address: itme.address,
              assetsChainId: this.agentAsset.agentAsset.chainId,
              assetsId: this.agentAsset.agentAsset.assetId,
              amount: itme.amount,
              locked: -1,
              nonce: itme.txHash.substring(itme.txHash.length - 16)//这里是hash的最后16个字符
            });
            outputs.push({
              address: itme.address,
              assetsChainId: this.agentAsset.agentAsset.chainId,
              assetsId: this.agentAsset.agentAsset.assetId,
              amount: itme.amount,
              lockTime: 0
            });
          }
          let addressArr = [];
          let newOutputs = [];
          outputs.forEach(function (item) {
            let i;
            if ((i = addressArr.indexOf(item.address)) > -1) {
              //console.log(result, i);
              newOutputs[i].amount = Number(newOutputs[i].amount) + Number(item.amount);
            } else {
              addressArr.push(item.address);
              newOutputs.push({
                address: item.address,
                amount: item.amount,
                assetsChainId: item.assetsChainId,
                assetsId: item.assetsId,
                lockTime: item.lockTime,
              })
            }
          });
          newOutputs.unshift(inOrOutputs.data.outputs[0]);
          newOutputs[0].lockTime = newOutputs[0].lockTime + 86400 * 3;
          tAssemble = await nuls.transactionAssemble(newInputs, newOutputs, remark, 9, this.$route.query.hash);
          //console.log(tAssemble);
          let newFee = countFee(tAssemble, 1);
          //console.log(transferInfo.fee !== newFee);
          if (transferInfo.fee !== newFee) {
            transferInfo.fee = newFee;
            newOutputs[0].amount = Number(Minus(this.nodeInfo.deposit, newFee).toString());
            tAssemble = await nuls.transactionAssemble(newInputs, newOutputs, remark, 9, this.$route.query.hash);
          }
          return {success: true, data: tAssemble}
        } else {
          console.log("交易类型错误")
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
    },
    watch: {
      addressInfo(val, old) {
        if (val) {
          if (val.address !== old.address && old.address) {
            this.nodeDepositLoading = true;
            this.jionNodeForm.amount = '';
            this.getBalanceByAddress(this.agentAsset.agentAsset.chainId, this.agentAsset.agentAsset.assetId, this.addressInfo.address);
            this.getNodeDepositByHash(this.pageIndex, this.pageSize, this.addressInfo.address, this.$route.query.hash)
          }
        }
      }
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
          &.resolve{
            color: #4ade5f;
          }
        }
      }
      .body {
        .left-part,.right-part {
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
            width: 100px;
            bottom: 0;
            right: 0;
            margin: 0;
            padding: 0;
            height: 40px;
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
          padding: 12px 25px;
          position: relative;
          right: 0;
          bottom: 10px;
        }
      }
      .el-table .el-table__header-wrapper{
        border-radius: 5px 5px 0 0;
      }
      .el-dialog {
        .el-form-item {
          margin-bottom: 0;
          padding: 0 20px;
        }
        .el-dialog__header {
          text-align: center;
        }
        .el-dialog__body {
          .el-form-item__label {
            margin-top: 7px;
          }
          .el-form-item__content {
            .balance{
              color: #606266;
              margin-top: 15px;
            }
          }
          .fee {
            color: #606266
          }
        }
        .el-dialog__footer {
          .el-button {
            width: 9.5rem;
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
