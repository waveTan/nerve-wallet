<template>
  <div class="staking-page">
    <div class="w1200">
      <div class="staking-info clear">
        <div class="total-staking shadow1 fl">
          <h3>
            {{$t('staking.staking0')}}
            <el-button class="fr" type="primary" @click="joinStakingDialog=true">{{$t('staking.staking1')}}</el-button>
          </h3>
          <div class="info-wrap">
            <div class="infos clear">
              <div class="fl">
                <p class="info-name">{{$t('staking.staking0')}}</p>
                <p class="info-val"><span>≈ </span>${{totalStaking}}</p>
              </div>
              <div class="fl">
                <p class="info-name">{{$t('staking.staking2')}}</p>
                <p class="info-val">{{totalReward}} <span>{{prefix}}</span></p>
              </div>
            </div>
            <div class="chart-wrap">
              <pie-chart :data="pieData" :extends="chartExtends"/>
            </div>
          </div>
        </div>
        <div class="staking-rate shadow1 fl">
          <h3>{{$t('staking.staking3')}}</h3>
          <el-table :data="stakingRate" stripe max-height="220" v-loading="stakingRateLoading"
                    class="staking_rate_table">
            <el-table-column fixed width="80" :label="$t('staking.staking4')" align="center"
                             prop="symbol"></el-table-column>
            <el-table-column width="78" :label="$t('staking.staking5')" align="center" prop="rate1"></el-table-column>
            <el-table-column width="85" :label="$t('staking.staking6')" align="center" prop="rate2"></el-table-column>
            <el-table-column width="95" :label="$t('staking.staking7')" align="center" prop="rate3"></el-table-column>
            <el-table-column width="82" :label="$t('staking.staking8')" align="center" prop="rate4"></el-table-column>
            <el-table-column width="78" :label="$t('staking.staking9')" align="center" prop="rate5"></el-table-column>
            <el-table-column width="78" :label="$t('staking.staking10')" align="center" prop="rate6"></el-table-column>
            <el-table-column width="78" :label="$t('staking.staking11')" align="center" prop="rate7"></el-table-column>
            <el-table-column width="88" :label="$t('staking.staking12')" align="center" prop="rate8"></el-table-column>
          </el-table>
        </div>
      </div>
      <div class="my-staking">
        <el-tabs v-model="activeTab" @tab-click="handleClick">
          <el-tab-pane :label="$t('staking.staking13')" name="first">
            <staking-list staking :data="stakingList" @changeStaking="showChangeStakingDialog"
                          @quitStaking="quitStaking"/>
          </el-tab-pane>
          <el-tab-pane :label="$t('staking.staking14')" name="second">
            <staking-list :data="finishStakingList" :staking="true"/>
          </el-tab-pane>
        </el-tabs>

        <div class="pages">
          <div class="page-total">
            {{$t('public.display')}} {{pageIndex-1 === 0 ? 1 : (pageIndex-1) *pageSize}}-{{pageIndex*pageSize}}
            {{$t('public.total')}} {{pageTotal}}
          </div>
          <el-pagination class="fr" background v-show="pageTotal>pageSize" @current-change="pageSizeChange"
                         :page-size="pageSize"
                         layout=" prev, pager, next, jumper"
                         :total="pageTotal">
          </el-pagination>
        </div>
      </div>
    </div>
    <!--加入staking弹窗-->
    <el-dialog :title="$t('staking.staking1')" :visible.sync="joinStakingDialog" class="join-staking-dialog form-dialog"
               width="600px">
      <el-form ref="joinStakingForm" :model="joinStakingModel" :rules="joinStakingRule">
        <el-form-item :label="$t('staking.staking4')+': '" prop="currency">
          <el-select v-model="joinStakingModel.currency" @change="changeCurrency">
            <el-option v-for="(item,index) in canStakingList" :key="index" :label="item.symbol" :value="item.symbol">
            </el-option>
          </el-select>
        </el-form-item>
        <div class="fr font12" style="padding: 8px 0 0 0">{{$t('public.usableBalance')}}:
          {{currentCurrency.available}}
        </div>
        <el-form-item :label="$t('staking.staking16')+': '" prop="amount">
          <el-input v-model="joinStakingModel.amount">
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('staking.staking17')+': '" prop="deadline">
          <el-select v-model="joinStakingModel.deadline">
            <el-option v-for="item in deadlineList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('staking.staking29')+': '">
          <span class="estimate">123456798 {{prefix}} (+64.15%)</span>
        </el-form-item>
        <!--        <div class="estimate">{{$t('staking.staking29')}}: 123456798 {{prefix}} (+64.15%)</div>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="joinStakingDialog=false">{{$t('password.password2')}}</el-button>
        <el-button type="primary" @click="joinStaking">{{$t('password.password3')}}</el-button>
      </div>
    </el-dialog>
    <!--更改staking弹窗-->
    <el-dialog :title="$t('staking.staking30')" :visible.sync="changeStakingDialog"
               class="change-staking-dialog form-dialog" width="600px">
      <el-form ref="changeStakingForm" :model="changeStakingModel" :rules="changeStakingRule">
        <el-form-item :label="$t('staking.staking4')+': '">
          <span class="currency-label">{{currency}}</span>
        </el-form-item>
        <!-- <div class="currency-label">{{$t('staking.staking4')}}: {{currency}}</div>-->
        <div class="fr font12" style="padding: 8px 0 0 0">{{$t('public.usableBalance')}}: {{addressInfo.balance}}</div>
        <el-form-item :label="$t('staking.staking16')+': '" prop="amount">
          <el-input v-model="changeStakingModel.amount"></el-input>
        </el-form-item>
        <el-form-item :label="$t('staking.staking17')+': '" prop="deadline">
          <el-select v-model="changeStakingModel.deadline">
            <el-option v-for="item in deadlineList" :key="item.value" :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('nav.consensus')+': '" prop="node">
          <el-select v-model="changeStakingModel.node">
            <el-option v-for="item in deadlineList" :key="item.value" :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('staking.staking29')+': '">
          <span class="estimate">123456798 {{prefix}} (+64.15%)</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="changeStakingDialog=false">{{$t('password.password2')}}</el-button>
        <el-button type="primary" @click="changeStaking">{{$t('password.password3')}}</el-button>
      </div>
    </el-dialog>

    <Password ref="password" @passwordSubmit="submit"/>
  </div>
</template>

<script>
  import moment from 'moment'
  import nerve from 'nerve-sdk-js'
  import PieChart from '@/components/PieChart'
  import Password from '@/components/PasswordBar'
  import stakingList from "./StakingList"
  import {MAIN_INFO} from '@/config'
  import {passwordVerification, Minus, Times, timesDecimals, divisionDecimals, getLocalTime} from '@/api/util'
  import {getNulsBalance, inputsOrOutputs, validateAndBroadcast} from '@/api/requestData'

  export default {
    data() {
      this.chartExtends = {
        series: {
          center: ['45%', '50%'],
          radius: ['52%', '76%'],
        }
      };
      const validateJoinCurrency = (rule, value, callback) => {
        if (value === '') {
          callback(new Error(this.$t('staking.staking26')))
        } else {
          callback()
        }
      };
      const validateJoinAmount = (rule, value, callback) => {
        const decimals = 8;
        const patrn = new RegExp("^([1-9][\\d]{0,20}|0)(\\.[\\d]{0,8})?$");
        if (value === '') {
          callback(new Error(this.$t('staking.staking27')))
        } else if (!patrn.exec(value)) {
          callback(new Error(this.$t('transfer.transfer12') + ": " + decimals))
        } else if (Number(value) < 0.001) {
          callback(new Error(this.$t('transfer.transfer13')))
        } else if (this.addressInfo.balance === 0) {
          callback(new Error(this.$t('tips.tips23')))
        } else if (Number(value) > Number(Minus(this.addressInfo.balance, 0.001))) {
          callback(new Error(this.$t('transfer.transfer131') + Number(Minus(this.addressInfo.balance, 0.001))))
        } else {
          callback()
        }
      };
      const validateJoinDeadline = (rule, value, callback) => {
        if (value === '') {
          callback(new Error(this.$t('staking.staking28')))
        } else {
          callback()
        }
      };
      return {
        addressInfo: this.$store.getters.getSelectAddress,
        totalStaking: 0,//staking总量
        totalReward: 0, //staking总奖励
        prefix: MAIN_INFO.prefix,
        pieData: [],
        stakingRateLoading: true,
        stakingRate: [], //staking利率
        activeTab: 'first',
        stakingList: [], //staking中列表
        finishStakingList: [],//已结束列表
        pageIndex: 1, //页码
        pageSize: 5, //每页条数
        pageTotal: 0,//总页数
        outStakingInfo: {},//退出staking信息
        canStakingList: [],//能加入staking的资产列表
        joinStakingDialog: false, //加入staking弹窗
        joinStakingModel: {
          currency: '',
          amount: '',
          deadline: ''
        },
        joinStakingRule: {
          currency: [{validator: validateJoinCurrency, trigger: ['blur']}],
          amount: [{validator: validateJoinAmount, trigger: ['blur', 'change']}],
          deadline: [{validator: validateJoinDeadline, trigger: ['blur']}],
        },
        currentCurrency: {},
        changeStakingDialog: false,//转定期弹窗
        currency: '',   //转定期币种
        changeStakingModel: {
          amount: '',
          deadline: '',
          node: ''
        },
        changeStakingRule: {
          amount: [{validator: validateJoinAmount, trigger: ['blur', 'change']}],
          deadline: [{validator: validateJoinDeadline, trigger: ['blur']}],
        },
        quitStakingDialog: false
      }
    },
    watch: {
      '$store.getters.getSelectAddress': {
        handler: function (val, old) {
          if (val.address !== old.address) {
            this.addressInfo = this.$store.getters.getSelectAddress
          }
        }
      }
    },
    computed: {
      deadlineList() {
        return [
          {label: this.$t('staking.staking5'), value: 0},
          {label: this.$t('staking.staking6'), value: 1},
          {label: this.$t('staking.staking7'), value: 2},
          {label: this.$t('staking.staking8'), value: 3},
          {label: this.$t('staking.staking9'), value: 4},
          {label: this.$t('staking.staking10'), value: 5},
          {label: this.$t('staking.staking11'), value: 6},
        ]
      }
    },
    components: {
      PieChart,
      Password,
      stakingList
    },
    created() {
      this.addressInfo = this.$store.getters.getSelectAddress;
      this.getStackingInfo();
      this.getStackingRate();
      this.getStackingAssetList();
    },
    mounted() {
      this.tabClick();
    },
    methods: {

      //Staking总量
      getStackingInfo() {
        this.$post('/', 'getStackingInfo', [])
          .then((response) => {
            if (response.hasOwnProperty("result")) {
              let total = 0;
              response.result.map(v => {
                total += v.usdValue;
                this.pieData.push({
                  key: v.symbol,
                  value: v.usdValue,
                  rate: v.rate * 100 + '%',
                })
              });
              this.totalStaking = total;
            }
          })
      },

      //获取各种币种stacking收益率
      getStackingRate() {
        this.$post('/', 'getStackingRate', [])
          .then((response) => {
            //console.log(response);
            if (response.hasOwnProperty("result")) {
              const res = [];
              response.result.map(v => {
                const obj = {};
                obj.symbol = v.symbol;
                // obj.
                v.detailList.forEach((item, index) => {
                  obj['rate' + (index + 1)] = Times(item.totalAddition, 100).toFixed(2) + '%'
                });
                res.push(obj)
              });
              this.stakingRate = res;
              this.stakingRateLoading = false
            }
          })
      },

      //选择币种下拉
      changeCurrency(symbol) {
        const currency = this.$store.state.accountList.filter(v => v.symbol === symbol)[0];
        this.currentCurrency = currency || {}
      },

      /**
       * @disc: 获取可参与stacking资产的列表
       * @date: 2020-05-25 14:00
       * @author: Wave
       */
      getStackingAssetList() {
        this.$post('/', 'getCanStackingAssetList', [])
          .then((response) => {
            //console.log(response);
            if (response.hasOwnProperty("result")) {
              this.canStakingList = response.result
            } else {
              this.canStakingList = []
            }
          })
          .catch((error) => {
            console.log("getAssetList:" + error);
          });
      },

      //加入staking
      joinStaking() {
        this.$refs.joinStakingForm.validate((valid) => {
          if (valid) {
            this.submitType = 1;
            this.$refs.password.showPassword(true);
            this.joinStakingDialog = false
          } else {
            return false;
          }
        })
      },

      showChangeStakingDialog(e) {
        this.currency = e.symbol;
        this.changeStakingDialog = true
      },

      //转定期
      changeStaking() {
        this.$refs.changeStakingForm.validate((valid) => {
          if (valid) {
            this.submitType = 2;
            this.$refs.password.showPassword(true);
            this.changeStakingDialog = false
          } else {
            return false;
          }
        })
      },

      //退出staking
      quitStaking(e) {
        this.outStakingInfo = e;
        this.submitType = 3;
        this.$refs.password.showPassword(true);
        this.quitStakingDialog = false;
      },

      async submit(password) {
        let passwordInfo = await passwordVerification(this.addressInfo, password);
        if (!passwordInfo.success) {
          this.$message({message: this.$t('tips.tips24'), type: 'error', duration: 3000});
          return;
        }
        switch (this.submitType) {
          case 1:
            this.submitJoinStaking(passwordInfo);
            break;
          case 2:
            this.submitChangeStaking(passwordInfo);
            break;
          default:
            this.submitQuitStaking(passwordInfo)
        }
      },

      //加入staking组装交易
      async submitJoinStaking(info) {
        let defaultAssetsInfo = MAIN_INFO;
        let transferInfo = {
          fromAddress: info.address,
          assetsChainId: this.currentCurrency.chainId,
          assetsId: this.currentCurrency.assetId,
          amount: Number(timesDecimals(this.joinStakingModel.amount, this.currentCurrency.decimals)),
          fee: 100000,
        };
        let balanceInfo = {};
        let feeBalanceInfo = {};

        if (defaultAssetsInfo.chainId !== transferInfo.assetsChainId || defaultAssetsInfo.assetId !== transferInfo.assetsId) {  //资产信息相同合并 amount+fee
          feeBalanceInfo = await getNulsBalance(defaultAssetsInfo.chainId, defaultAssetsInfo.assetId, transferInfo.fromAddress);
          //console.log(feeBalanceInfo);
          if (!feeBalanceInfo.success) {
            console.log("获取账户feeBalanceInfo错误");
            return;
          }
          transferInfo.feeBalanceInfo = feeBalanceInfo.data;
          transferInfo.defaultAssetsInfo = defaultAssetsInfo;
        }

        balanceInfo = await getNulsBalance(transferInfo.assetsChainId, transferInfo.assetsId, transferInfo.fromAddress);
        //console.log(balanceInfo);
        if (!balanceInfo.success) {
          console.log("获取账户balanceInfo错误");
          return;
        }

        //根据委托类型设置锁定时间
        transferInfo.locked = -1;
        let inOrOutputs = await inputsOrOutputs(transferInfo, balanceInfo.data, 5);
        //console.log(inOrOutputs);
        if (!inOrOutputs.success) {
          console.log("inputOutputs组装失败!");
          return;
        }

        let deposit = {
          deposit: transferInfo.amount,
          address: transferInfo.fromAddress,
          assetsChainId: transferInfo.assetsChainId,//链ID
          assetsId: transferInfo.assetsId,//资产ID
          depositType: this.joinStakingModel.deadline === 0 ? 0 : 1,//委托类型
          timeType: this.joinStakingModel.deadline === 0 ? 0 : this.joinStakingModel.deadline,//委托时长
        };
        //console.log(deposit);

        let tAssemble = await nerve.transactionAssemble(inOrOutputs.data.inputs, inOrOutputs.data.outputs, "", 5, deposit);
        //console.log(tAssemble);
        let txhex = await nerve.transactionSerialize(info.pri, info.pub, tAssemble);

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

      },

      //转定期组装交易
      submitChangeStaking(info) {

      },

      /**
       * @disc: 退出staking组装交易
       * @params: info 账户信息
       * @date: 2020-05-26 15:51
       * @author: Wave
       */
      async submitQuitStaking(info) {
        //console.info(this.outStakingInfo);
        //console.info(info);
        let defaultAssetsInfo = MAIN_INFO;
        let transferInfo = {
          fromAddress: info.address,
          assetsChainId: this.outStakingInfo.assetChainId,
          assetsId: this.outStakingInfo.assetId,
          amount: this.outStakingInfo.amount,
          fee: 100000
        };
        let balanceInfo = {};
        let feeBalanceInfo = {};
        //console.info(defaultAssetsInfo);
        //console.info(transferInfo);

        let deposit = {
          address: info.address,
          agentHash: this.outStakingInfo.txHash,
          deposit: this.outStakingInfo.amount,
          assetsChainId: this.outStakingInfo.assetChainId, //退出staking链ID
          assetsId: this.outStakingInfo.assetId, //退出staking资产ID
          depositType: 0,//委托类型 只能退出活期 0:代表活期
          timeType: 0,//委托时长
        };
        //console.info(deposit);

        if (defaultAssetsInfo.chainId === transferInfo.assetsChainId && defaultAssetsInfo.assetId === transferInfo.assetsId) {  //资产信息相同合并 amount+fee
          balanceInfo = {
            success: true,
            data: {
              balance: this.outStakingInfo.amount,
              nonce: deposit.agentHash.substring(deposit.agentHash.length - 16)
            }
          };
        } else {
          feeBalanceInfo = await getNulsBalance(transferInfo.fromAddress, defaultAssetsInfo.chainId, defaultAssetsInfo.assetsId);
          //console.log(feeBalanceInfo);
          if (!feeBalanceInfo.success) {
            console.log("获取账户feeBalanceInfo错误");
            return;
          }
          transferInfo.feeBalanceInfo = feeBalanceInfo.data;
          transferInfo.defaultAssetsInfo = defaultAssetsInfo;
        }

        let inOrOutputs = await inputsOrOutputs(transferInfo, balanceInfo.data, 6);
        //console.log(inOrOutputs);

        let tAssemble = await nerve.transactionAssemble(inOrOutputs.data.inputs, inOrOutputs.data.outputs, '', 6, deposit);
        let txhex = await nerve.transactionSerialize(info.pri, info.pub, tAssemble);

        await validateAndBroadcast(txhex).then((response) => {
          if (response.success) {
            //console.log(response);
            this.$message({message: this.$t('tips.tips0'), type: 'success', duration: 1000});
            this.$router.push({
              name: "txList"
            })
          } else {
            this.$message({
              message: this.$t('public.err') + JSON.stringify(response.data),
              type: 'error',
              duration: 3000
            });
          }
        }).catch((err) => {
          this.$message({message: this.$t('public.err0') + err, type: 'error', duration: 3000});
        });


      },

      handleClick() {
        this.tabClick();
      },

      tabClick() {
        if (this.activeTab === 'first') {
          this.getStackingList(this.pageIndex, this.pageSize, this.addressInfo.address);
        } else {
          this.getFinishStackingList(this.pageIndex, this.pageSize, this.addressInfo.address);
        }
      },

      /**
       * @disc: 获取stacking中列表根据地址
       * @params: pageNumber
       * @params: pageSize
       * @params: address
       * @date: 2020-05-22 15:05
       * @author: Wave
       */
      async getStackingList(pageNumber, pageSize, address) {
        await this.$post('/', 'pageStackingListByAddress', [pageNumber, pageSize, address])
          .then((response) => {
            //console.log(response);
            if (response.hasOwnProperty("result")) {
              for (let item of response.result.list) {
                item.amounts = Number(divisionDecimals(item.amount, item.decimal));
                item.createTime = moment(getLocalTime(item.createTime * 1000)).format('YYYY-MM-DD HH:mm:ss');
                item.endTime = item.endTime ? moment(getLocalTime(item.endTime * 1000)).format('YYYY-MM-DD HH:mm:ss') : '-';
              }
              this.stakingList = response.result.list;
              this.pageTotal = response.result.totalCount;
            } else {
              this.myNodeLoading = false;
            }
          })
          .catch((error) => {
            console.log("getAccountConsensus:" + error);
          });
      },

      /**
       * @disc: 获取stacking中列表根据地址
       * @params: pageNumber
       * @params: pageSize
       * @params: address
       * @date: 2020-05-22 15:05
       * @author: Wave
       */
      async getFinishStackingList(pageNumber, pageSize, address) {
        await this.$post('/', 'pageFinishStackingListByAddress', [pageNumber, pageSize, address])
          .then((response) => {
            //console.log(response);
            if (response.hasOwnProperty("result")) {
              /*for (let item of response.result.list) {
                item.amounts = Number(divisionDecimals(item.amount, item.decimal));
                item.createTime = moment(getLocalTime(item.createTime * 1000)).format('YYYY-MM-DD HH:mm:ss');
                item.endTime = item.endTime ? moment(getLocalTime(item.endTime * 1000)).format('YYYY-MM-DD HH:mm:ss') : '-';
              }*/
              this.finishStakingList = response.result.list;
              this.pageTotal = response.result.totalCount;
            } else {
              this.myNodeLoading = false;
            }
          })
          .catch((error) => {
            console.log("getAccountConsensus:" + error);
          });
      },

      /**
       * @disc: 翻译功能
       * @params: val
       * @date: 2020-05-26 15:10
       * @author: Wave
       */
      pageSizeChange(val) {
        this.pageIndex = val;
        this.getStackingList(this.pageIndex, this.pageSize, this.addressInfo.address);
      },
    }

  }
</script>

<style lang="less">
  .staking-page {
    .staking-info {
      margin-top: 40px;
    }
    .total-staking, .staking-rate {
      height: 315px;
      h3 {
        font-size: 16px;
        height: 48px;
        line-height: 48px;
        font-weight: 600;
        color: #475472;
        border-bottom: 1px solid #dfe4ef;
        padding-left: 40px;
        .el-button {
          margin-right: 40px;
          padding: 7px 12px;
          margin-top: 9px;
        }
      }
    }
    .total-staking {
      width: 460px;
      margin-right: 40px;
      margin-bottom: 30px;
      h3 {
        padding-left: 30px;
      }
      .info-wrap {
        margin-top: 25px;
        .infos {
          padding-left: 30px;
          .info-name {
            font-size: 14px;
            color: #8794b1;
          }
          .info-val {
            font-size: 18px;
            font-weight: 600;
            color: #475472;
            span {
              font-size: 14px
            }
          }
          .fl:first-of-type {
            width: 165px;
            .info-val {
              color: #2688f7;
              span {
                color: #475472;
                font-size: 18px;
              }
            }
          }
        }
        .chart-wrap {
          padding-left: 15px;
          height: 200px;
          .legend-item {
            height: 25px;
          }
        }
      }
    }
    .staking-rate {
      width: 700px;
      .el-table {
        width: 640px;
        margin: 30px 0 0 30px;
        th .cell {
          color: #fff;
        }
        td {
          padding: 5px 0 !important;
        }
        .el-table__body-wrapper .el-table__body tr td {
          padding: 5px 0 !important;
          .cell {
            padding: 0 5px;
          }
        }
      }
    }
  }

  .join-staking-dialog, .change-staking-dialog {
    .el-form-item__content {
      .el-select {
        width: 520px;
        .el-input__inner {
          width: 100%;
        }
      }
      .estimate {
        color: #606266
      }
      .currency-label {
        color: #606266;
        margin-bottom: 10px;
      }
    }
  }
</style>
