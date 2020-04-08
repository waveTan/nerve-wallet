<template>
  <div class="transfer bg-gray">
    <div class="w1200 bg-white">
      <div class="title">链内转账</div>
      <el-form :model="transferForm" :rules="transferRules" ref="transferForm" class="w630 transfer_form">
        <el-form-item label="付款地址" prop="fromAddress">
          <el-input v-model="transferForm.fromAddress" disabled></el-input>
        </el-form-item>
        <el-form-item label="资产类型" prop="assetType" class="asset_type">
          <el-select v-model="transferForm.assetType" filterable placeholder="" @change="changeAssetType">
            <el-option v-for="item in assetList" :key="item._id" :label="item.symbol" :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="收款地址" prop="toAddress">
          <el-input v-model="transferForm.toAddress"></el-input>
        </el-form-item>
        <div style="width: 630px;height: 30px"></div>
        <div class="fr font12" style="padding: 8px 0 0 0">可用余额: {{balanceInfo.balances}}</div>
        <el-form-item label="转账金额" prop="amount">
          <el-input v-model="transferForm.amount"></el-input>
        </el-form-item>
        <el-form-item label="活动形式" prop="remarks">
          <el-input type="textarea" v-model="transferForm.remarks"></el-input>
        </el-form-item>
        <div class="fee font14 mb_20">手续费: {{transferForm.fee}} NULS</div>
        <el-form-item class="btn-next">
          <el-button type="primary" @click="submitTransferForm('transferForm')">下一步</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-dialog title="转账确认" :visible.sync="transferFormDialog" class="transfer_form_dialog" width="500px">
      <ul>
        <li><span>付款地址：</span><font>{{transferForm.fromAddress}}</font></li>
        <li><span>接收地址：</span><font>{{transferForm.toAddress}}</font></li>
        <li><span>金额：</span><font>{{transferForm.amount}} NULS</font></li>
        <li><span>手续费：</span><font>{{transferForm.fee}} NULS</font></li>
        <li><span>备注：</span><font>{{transferForm.remarks}}</font></li>
      </ul>
      <div slot="footer" class="dialog-footer">
        <el-button @click="transferFormDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirmSubmission">确认提交</el-button>
      </div>
    </el-dialog>

    <Password ref="password" @passwordSubmit="passSubmit">
    </Password>
  </div>
</template>

<script>
  import {getNulsBalance} from '@/api/requestData'
  import {MAIN_INFO} from '@/config.js'
  import {divisionDecimals, Times, addressInfo} from '@/api/util'
  import Password from '@/components/PasswordBar'

  export default {

    data() {
      let validateToAddress = (rule, value, callback) => {
        let patrn = /^(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{20,50}$/;
        if (value === '') {
          callback(new Error(this.$t('transfer.transfer9')))
        } else if (!patrn.exec(value)) {
          callback(new Error(this.$t('transfer.transfer10')))
        } else {
          callback()
        }
      };
      let validateAmount = (rule, value, callback) => {
        //console.log(this.changeAssets.decimals);
        let decimals = 8;
        let patrn = new RegExp("^([1-9][\\d]{0,20}|0)(\\.[\\d]{0,8})?$");
        /*if (this.changeAssets.decimals === 0) {
          patrn = new RegExp("^([1-9][\\d]{0,20}|0)(\\.[\\d]{0,1})?$");
        } else {
          patrn = new RegExp("^([1-9][\\d]{0,20}|0)(\\.[\\d]{1," + decimals + "})?$");
        }*/
        if (value === '') {
          callback(new Error(this.$t('transfer.transfer11')))
        } else if (!patrn.exec(value)) {
          callback(new Error(this.$t('transfer.transfer12') + ": " + decimals))
        } else if (Number(value) < 0.001) {
          callback(new Error(this.$t('transfer.transfer13')))
        } /*else if (Number(value) > Number(Minus(this.changeAssets.balance, 0.001)) && this.changeAssets.symbol === 'NULS') {
          callback(new Error(this.$t('transfer.transfer131') + Number(Minus(this.changeAssets.balance, 0.001))))
        }*/ else {
          callback()
        }
      };

      return {
        addressInfo: {},//默认账户信息
        assetList: [], //资产列表
        changeAssetInfo: {},//选择的资产信息
        balanceInfo: {
          balance: 0,
          balances: 0,
          nonce: ""
        },//账户余额信息
        //转账数据
        transferForm: {
          fromAddress: '',
          toAddress: '',
          assetType: '',
          amount: '',
          fee: 0.001,
          remarks: '',
        },
        //验证信息
        transferRules: {
          toAddress: [{validator: validateToAddress, trigger: 'change'}],
          amount: [{validator: validateAmount, trigger: ['blur', 'change']}],
        },

        transferFormDialog: false,//确认弹框
      };
    },
    created() {
      this.assetList = sessionStorage.hasOwnProperty('allAssetsList') ? JSON.parse(sessionStorage.getItem('allAssetsList')) : [];
      this.addressInfo = addressInfo(1);
      this.transferForm.fromAddress = this.addressInfo.address;
    },
    mounted() {
      let transferParams = sessionStorage.hasOwnProperty('transferParams') ? JSON.parse(sessionStorage.getItem('transferParams')) : {};
      this.transferForm.assetType = transferParams.symbol;
      this.balanceInfo.balances = transferParams.available
    },
    watch: {},
    components: {
      Password,
    },
    destroyed() {
      sessionStorage.removeItem('transferParams')
    },
    methods: {

      /**
       * @disc: 选择资产
       * @params: e
       * @date: 2020-04-08 16:49
       * @author: Wave
       */
      async changeAssetType(e) {
        this.changeAssetInfo = e;
        try {
          let resBalanceInfo = await getNulsBalance(e.chainId, e.assetsId, this.addressInfo.address);
          //console.log(resBalanceInfo);
          if (resBalanceInfo.success) {
            this.balanceInfo.balance = resBalanceInfo.data.balance;
            this.balanceInfo.balances = Number(divisionDecimals(resBalanceInfo.data.balance, e.decimals));
            this.balanceInfo.nonce = resBalanceInfo.data.nonce;
          }
        } catch (err) {
          console.log(err);
        }
      },

      /**
       * @disc: 下一步
       * @params: formName
       * @date: 2020-04-07 18:14
       * @author: Wave
       */
      submitTransferForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.transferFormDialog = true;
          } else {
            return false;
          }
        });
      },

      /**
       * @disc: 确认提交
       * @date: 2020-04-07 18:45
       * @author: Wave
       */
      confirmSubmission() {
        this.$refs.password.showPassword(true);
        this.transferFormDialog = false;
      },

      /**
       * 连接跳转
       * @param name
       */
      toUrl(name) {
        //console.log(name)
        this.$router.push({
          name: name
        })
      },
    }
  }
</script>

<style lang="less">
  @import "./../../assets/css/style";

  .transfer {
    .title {
      font-weight: bold;
    }
    .transfer_form {
      min-height: 700px;
      .asset_type {
        .el-form-item__label {
          float: none;

        }
        .el-form-item__content {
          .el-select {
            width: 630px;
            .el-input__inner {
              width: 100%;
            }
          }
        }
      }
      .btn-next {
        width: 500px;
        margin: 30px auto 0;
        .el-button--primary {
          width: 100%;
        }
      }
    }
    .transfer_form_dialog {
      .el-dialog__body {
        background-color: #ffffff;
        padding: 20px;
        ul {
          li {
            line-height: 30px;
            span {
              width: 100px;
              text-align: right;
              display: block;
              float: left;
              margin-right: 10px;
            }
            font {

            }
          }
        }
      }
      .el-dialog__footer {
        padding: 0 0 10px 0;
        .dialog-footer {
          margin: 20px 0 10px 0;
          .el-button {
            width: 150px;
          }
          .el-button--default {
            margin-right: 30px;
          }
        }
      }

    }
  }

</style>
