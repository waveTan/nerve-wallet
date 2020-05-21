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
          <el-table :data="stakingRate" stripe max-height="220" v-loading="stakingRateLoading">
            <el-table-column width="10"></el-table-column>
            <el-table-column fixed width="80" :label="$t('staking.staking4')" prop="symbol"></el-table-column>
            <el-table-column width="90" :label="$t('staking.staking5')" prop="rate1"></el-table-column>
            <el-table-column width="90" :label="$t('staking.staking6')" prop="rate2"></el-table-column>
            <el-table-column width="100" :label="$t('staking.staking7')" prop="rate3"></el-table-column>
            <el-table-column width="90" :label="$t('staking.staking8')" prop="rate4"></el-table-column>
            <el-table-column width="90" :label="$t('staking.staking9')" prop="rate5"></el-table-column>
            <el-table-column width="90" :label="$t('staking.staking10')" prop="rate6"></el-table-column>
            <el-table-column width="90" :label="$t('staking.staking11')" prop="rate7"></el-table-column>
            <el-table-column width="90" :label="$t('staking.staking12')" prop="rate8"></el-table-column>
          </el-table>
        </div>
      </div>
      <div class="my-staking">
        <el-tabs v-model="activeTab">
          <el-tab-pane :label="$t('staking.staking13')" name="first">
          <staking-list staking :data="stakingList" @changeStaking="showChangeStakingDialog" @quitStaking="quitStaking" />
          </el-tab-pane>
          <el-tab-pane :label="$t('staking.staking14')" name="second">
            <staking-list :data="stakingList"/>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <!--加入staking弹窗-->
    <el-dialog :title="$t('staking.staking1')" :visible.sync="joinStakingDialog" class="join-staking-dialog form-dialog" width="600px">
      <el-form ref="joinStakingForm" :model="joinStakingModel" :rules="joinStakingRule">
        <el-form-item :label="$t('staking.staking4')+': '" prop="currency">
          <el-select v-model="joinStakingModel.currency" @change="changeCurrency">
            <el-option v-for="item in $store.state.accountList" :key="item.assetKey" :label="item.symbol" :value="item.symbol">
            </el-option>
          </el-select>
        </el-form-item>
        <div class="fr font12" style="padding: 8px 0 0 0">{{$t('public.usableBalance')}}: {{currentCurrency.available}}</div>
        <el-form-item :label="$t('staking.staking16')+': '" prop="amount">
          <el-input v-model="joinStakingModel.amount"></el-input>
        </el-form-item>
        <el-form-item :label="$t('staking.staking17')+': '" prop="deadline">
          <el-select v-model="joinStakingModel.deadline">
            <el-option v-for="item in deadlineList" :key="item.value" :label="item.label" :value="item.value"></el-option>
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
    <el-dialog :title="$t('staking.staking30')" :visible.sync="changeStakingDialog" class="change-staking-dialog form-dialog" width="600px">
      <el-form ref="changeStakingForm" :model="changeStakingModel" :rules="changeStakingRule">
        <el-form-item :label="$t('staking.staking4')+': '">
          <span class="currency-label">{{currency}}</span>
        </el-form-item>
<!--        <div class="currency-label">{{$t('staking.staking4')}}: {{currency}}</div>-->
        <div class="fr font12" style="padding: 8px 0 0 0">{{$t('public.usableBalance')}}: {{addressInfo.balance}}</div>
        <el-form-item :label="$t('staking.staking16')+': '" prop="amount">
          <el-input v-model="changeStakingModel.amount"></el-input>
        </el-form-item>
        <el-form-item :label="$t('staking.staking17')+': '" prop="deadline">
          <el-select v-model="changeStakingModel.deadline">
            <el-option v-for="item in deadlineList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('nav.consensus')+': '" prop="node">
          <el-select v-model="changeStakingModel.node">
            <el-option v-for="item in deadlineList" :key="item.value" :label="item.label" :value="item.value"></el-option>
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
  import PieChart from '@/components/PieChart'
  import Password from '@/components/PasswordBar'
  import stakingList from "./stakingList"
  import {MAIN_INFO} from '@/config'
  import {passwordVerification, Minus, Times} from '@/api/util'
  export default {
    name: "",
    data() {
      this.chartExtends = {
        series: {
          center: ['45%', '50%'],
          radius: ['52%', '76%'],
        }
      }
      const validateJoinCurrency =  (rule, value, callback) => {
        if (value === '') {
          callback(new Error(this.$t('staking.staking26')))
        } else {
          callback()
        }
      };
      // todo
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
      const validateJoinDeadline =  (rule, value, callback) => {
        if (value === '') {
          callback(new Error(this.$t('staking.staking28')))
        } else {
          callback()
        }
      };
      return {
        addressInfo: this.$store.getters.getSelectAddress,
        totalStaking: 1873.24,//staking总量
        totalReward: 211.52559523, //staking总奖励
        prefix: MAIN_INFO.prefix,
        pieData: [],
        stakingRateLoading: true,
        stakingRate: [], //staking利率
        activeTab: 'first',
        stakingList:[],
        joinStakingDialog: false, //加入staking弹窗
        joinStakingModel:{
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
        handler: function(val, old) {
          if (val.address !== old.address) {
            this.addressInfo = this.$store.getters.getSelectAddress
          }
        }
      }
    },
    computed: {
      deadlineList() {
        return [
          {label: this.$t('staking.staking5'),value: 0},
          {label: this.$t('staking.staking6'),value: 1},
          {label: this.$t('staking.staking7'),value: 2},
          {label: this.$t('staking.staking8'),value: 3},
          {label: this.$t('staking.staking9'),value: 4},
          {label: this.$t('staking.staking10'),value: 5},
          {label: this.$t('staking.staking11'),value: 6},
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
      this.getStackingRate();
    },
    mounted() {
      const data = [
        {key:'NVT',value:1,rate: 0.1},
        {key:'NULS',value:2,rate: 0.2},
        {key:'BTC',value:3,rate: 0.3},
        {key:'ETH',value:3,rate: 0.4},
        {key:'BCH',value:5,rate: 0.5}
      ];
      const rate = [
        {symbol: 'NVT',rate1:'242.73%',rate2:'242.73%',rate3:'242.73%',rate4:'242.73%',rate5:'242.73%',rate6:'242.73%',rate7:'242.73%',rate8:'242.73%'},
          {symbol: 'NULS',rate1:'242.73%',rate2:'242.73%',rate3:'242.73%',rate4:'242.73%',rate5:'242.73%',rate6:'242.73%',rate7:'242.73%',rate8:'242.73%'},
        {symbol: 'BTC',rate1:'242.73%',rate2:'242.73%',rate3:'242.73%',rate4:'242.73%',rate5:'242.73%',rate6:'242.73%',rate7:'242.73%',rate8:'242.73%'},
        {symbol: 'ETH',rate1:'242.73%',rate2:'242.73%',rate3:'242.73%',rate4:'242.73%',rate5:'242.73%',rate6:'242.73%',rate7:'242.73%',rate8:'242.73%'},
        {symbol: 'BCH',rate1:'242.73%',rate2:'242.73%',rate3:'242.73%',rate4:'242.73%',rate5:'242.73%',rate6:'242.73%',rate7:'242.73%',rate8:'242.73%'},
      ];
      const list = [
        {height:654814,symbol: 'NVT',amount:5647.26,deadline:'1年',nodeType: '银行节点',extra: '42.48%',joinTime:'2020-02-16 16:48:20',endTime:'2020-02-16 16:48:20',totalReward: 2000.00},
        {height:654814,symbol: 'BTC',amount:5647.26,deadline:'3个月',nodeType: '银行节点',extra: '42.48%',joinTime:'2020-02-16 16:48:20',endTime:'2020-02-16 16:48:20',totalReward: 2000.00},
        {height:654814,symbol: 'NULS',amount:5647.26,deadline:'1年',nodeType: '银行节点',extra: '42.48%',joinTime:'2020-02-16 16:48:20',endTime:'2020-02-16 16:48:20',totalReward: 2000.00},
        {height:654814,symbol: 'ETH',amount:5647.26,deadline:'活期',nodeType: '银行节点',extra: '42.48%',joinTime:'2020-02-16 16:48:20',endTime:'2020-02-16 16:48:20',totalReward: 2000.00,type:1},
      ];
      this.pieData = data;
      // this.stakingRate = rate
      this.stakingList = list
    },
    methods: {
      //获取各种币种stacking收益率
      getStackingRate() {
        this.$post('/', 'getStackingRate',[])
          .then((response) => {
            //console.log(response);
            if (response.hasOwnProperty("result")) {
              const res = [];
              response.result.map(v=>{
                const obj={};
                obj.symbol = v.symbol;
                // obj.
                v.detailList.forEach((item, index)=>{
                  obj['rate'+(index+1)] = Times(item.totalAddition, 100).toFixed(2)+'%'
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
        const currency = this.$store.state.accountList.filter(v=>v.symbol === symbol)[0];
        this.currentCurrency = currency || {}
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
        this.submitType = 3;
        this.$refs.password.showPassword(true);
        this.quitStakingDialog = false;
        console.log(e,'quit')
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
      submitJoinStaking(info) {

      },

      //转定期组装交易
      submitChangeStaking(info) {

      },

      //退出staking组装交易
      submitQuitStaking(info) {

      }
    }

  }
</script>

<style lang="less">
  .staking-page {
    .staking-info {
      margin-top: 40px;
    }
    .total-staking,.staking-rate {
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
      h3 {padding-left: 30px;}
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
            span {font-size: 14px}
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
        th .cell {color: #fff;}
        td {padding: 5px 0 !important;}
        .el-table__body-wrapper .el-table__body tr td {
          padding: 5px 0 !important;
        }
      }
    }
  }
  .join-staking-dialog,.change-staking-dialog {
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
