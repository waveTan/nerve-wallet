<template>
  <div class="transfer">
    <div class="w1200">
      <div class="title">{{$t('nav.transfer')}}</div>
      <el-form :model="transferForm" :rules="transferRules" ref="transferForm" class="w630 transfer_form">
        <el-form-item :label="$t('transfer.transfer0')" prop="fromAddress">
          <el-input v-model="transferForm.fromAddress" disabled>
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('transfer.transfer2')" prop="assetType" class="asset_type">
          <el-select v-model="transferForm.assetType" filterable placeholder="" @change="changeAssetType">
            <el-option v-for="item in assetList" :key="item._id" :label="item.symbol" :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('transfer.transfer1')" prop="toAddress">
          <el-input v-model.trim="transferForm.toAddress" @input="changeToAddress">
          </el-input>
        </el-form-item>
        <div class="yellow font10" style="margin-top:-15px" v-if="transferType ===1 && transferTips">
          {{$t('transfer.transfer24')}}
        </div>
        <div style="width: 630px;height: 30px"></div>
        <div class="fr font12" style="padding: 8px 0 0 0">{{$t('public.usableBalance')}}: {{balanceInfo.balances}}</div>
        <el-form-item :label="$t('transfer.transfer3')" prop="amount">
          <el-input v-model="transferForm.amount">
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('transfer.transfer4')" prop="remarks">
          <el-input type="textarea" v-model="transferForm.remarks">
          </el-input>
        </el-form-item>
        <div class="fee font14 mb_20">{{$t('public.fee')}}: {{transferForm.fee}} {{prefix}}</div>
        <el-form-item class="btn-next">
          <el-button type="primary" @click="submitTransferForm('transferForm')">{{$t('public.next')}}</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-dialog :title="$t('transfer.transfer6')" :visible.sync="transferFormDialog" class="transfer_form_dialog"
               width="500px">
      <ul style="height: 150px">
        <li><span>{{$t('transfer.transfer0')}}：</span><font>{{transferForm.fromAddress}}</font></li>
        <li><span>{{$t('transfer.transfer1')}}：</span><font>{{transferForm.toAddress}}</font></li>
        <li><span>{{$t('public.amount')}}：</span><font>{{transferForm.amount}} {{this.transferForm.assetType}}</font>
        </li>
        <li><span>{{$t('public.fee')}}：</span><font>{{transferForm.fee}} {{prefix}}</font></li>
        <li><span>{{$t('public.remarks')}}：</span><font>{{transferForm.remarks}}</font></li>
      </ul>
      <div slot="footer" class="dialog-footer">
        <el-button @click="transferFormDialog = false" style="margin-right: 20px">{{$t('address.address10')}}
        </el-button>
        <el-button type="primary" @click="confirmSubmission">{{$t('transfer.transfer8')}}</el-button>
      </div>
    </el-dialog>

    <Password ref="password" @passwordSubmit="coinPassSubmit">
    </Password>
  </div>
</template>

<script>
  import nerve from 'nerve-sdk-js'
  import sdk from 'nerve-sdk-js/lib/api/sdk'
  import {getNulsBalance, validateAndBroadcast, getBaseAssetInfo} from '@/api/requestData'
  import {MAIN_INFO, CROSS_INFO} from '@/config.js'
  import {
    Plus,
    divisionDecimals,
    timesDecimals,
    Minus,
    passwordVerification,
    htmlEncode
  } from '@/api/util'
  import Password from '@/components/PasswordBar'

  export default {

    data() {
      let validateToAddress = (rule, value, callback) => {
        let patrn = /^(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{20,50}$/;
        let toAddressInfo = {right: true};
        if (value.length > 20 && value.length < 60) {
          toAddressInfo = nerve.verifyAddress(value);
        }
        if (value === '') {
          callback(new Error(this.$t('transfer.transfer9')))
        } else if (!patrn.exec(value)) {
          callback(new Error(this.$t('transfer.transfer10')))
        } else if (!toAddressInfo.right) {
          callback(new Error(this.$t('transfer.transfer10')))
        } else if (this.transferType === 1) {
          if (!this.changeAssetInfo.isAcross) {
            callback(new Error(this.$t('transfer.transfer25')));
            this.transferTips = false;
          } else {
            this.transferTips = true;
            callback()
          }
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
        } else if (this.balanceInfo.balance === 0) {
          callback(new Error(this.$t('tips.tips23')))
        } else if (Number(value) > Number(Minus(this.balanceInfo.balance, 0.001))) {
          callback(new Error(this.$t('transfer.transfer131') + Number(Minus(this.balanceInfo.balance, 0.001))))
        } else {
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
        transferType: 0,//转账类型 0:链内转账 1:跨链转账
        transferTips: false,
        prefix: MAIN_INFO.prefix,
        transferFormDialog: false,//确认弹框
      };
    },
    watch: {
      '$store.getters.getSelectAddress': {
        handler: function (val, old) {
          if (val.address !== old.address) {
            this.initInfo();
            this.changeAssetType(this.changeAssetInfo);
          }
        }
      }
    },
    created() {
      this.assetList = this.$store.state.accountList;
      this.initInfo();
    },
    mounted() {
      let transferParams = {};
      if (sessionStorage.hasOwnProperty('transferParams')) {
        transferParams = JSON.parse(sessionStorage.getItem('transferParams'))
      } else {
        let assetsInfo = this.assetList.filter(k => k.chainId === MAIN_INFO.chainId);
        transferParams = assetsInfo[0];
      }
      this.transferForm.assetType = transferParams.symbol;
      this.changeAssetType(transferParams);
    },
    components: {
      Password,
    },
    destroyed() {
      sessionStorage.removeItem('transferParams')
    },
    methods: {

      //初始化选中账户数据
      initInfo() {
        this.addressInfo = this.$store.getters.getSelectAddress;
        this.transferForm.fromAddress = this.addressInfo.address;
      },

      /**
       * @disc: 选择资产
       * @params: e
       * @date: 2020-04-08 16:49
       * @author: Wave
       */
      async changeAssetType(e) {
        //console.info(e);
        this.changeAssetInfo = e;
        this.transferForm.assetType = e.symbol;
        if (this.transferForm.toAddress) {
          this.changeToAddress(this.transferForm.toAddress)
        }

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
       * @disc: 收款地址改变执行方法
       * @params: e
       * @date: 2020-05-26 9:42
       * @author: Wave
       */
      changeToAddress(e) {
        //console.info(e);
        if (e.length > 20 && e.length < 60) {
          let toAddressInfo = nerve.verifyAddress(e);
          if (!toAddressInfo.right) {
            return;
          }
          let fromAddressInfo = nerve.verifyAddress(this.transferForm.fromAddress);
          if (toAddressInfo.right && fromAddressInfo.chainId === toAddressInfo.chainId) {
            this.transferType = 0
          } else {
            this.transferType = 1;
            /* console.info(this.assetList);
             console.info(this.transferForm);*/
          }
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
       * @disc: 转账密码输入
       * @params: password
       * @date: 2019-09-02 10:49
       * @author: Wave
       */
      async coinPassSubmit(password) {
        let passwordInfo = await passwordVerification(this.addressInfo, password);
        //console.log(passwordInfo);
        if (!passwordInfo.success) {
          this.$message({message: this.$t('tips.tips24'), type: 'error', duration: 3000});
          return;
        }

        let transferInfo = {
          fromAddress: this.addressInfo.address,
          assetsChainId: this.changeAssetInfo.chainId,
          assetsId: this.changeAssetInfo.assetId,
          fee: 100000
        };
        transferInfo['toAddress'] = this.transferForm.toAddress;
        transferInfo['amount'] = timesDecimals(this.transferForm.amount, this.changeAssetInfo.decimal);
        //console.log(transferInfo);
        let inOrOutputs = await this.inputsOrOutputs(transferInfo);
        //console.log(inOrOutputs);
        let tAssemble = {};
        let hash = {};
        if (this.transferType === 0) { //链内转账
          //交易组装
          tAssemble = await nerve.transactionAssemble(inOrOutputs.data.inputs, inOrOutputs.data.outputs, htmlEncode(this.transferForm.remarks), 2);
          //获取hash
          hash = await tAssemble.getHash();
        } else { //跨链交易

          /*console.log(MAIN_INFO);
          console.log(CROSS_INFO);*/
          const balanceInfo = await getBaseAssetInfo(CROSS_INFO.chainId, CROSS_INFO.assetsId, transferInfo.fromAddress);
          //console.info(balanceInfo);
          inOrOutputs.data.inputs.push({
            address: transferInfo.fromAddress,
            assetsChainId: CROSS_INFO.chainId,
            assetsId: CROSS_INFO.assetId,
            amount: Number(transferInfo.amount),
            locked: 0,
            nonce: balanceInfo.data.nonce
          });
          console.log(inOrOutputs);
          //交易组装
          tAssemble = await nerve.transactionAssemble(inOrOutputs.data.inputs, inOrOutputs.data.outputs, htmlEncode(this.transferForm.remarks), 10);
          //获取hash
          hash = await tAssemble.getHash();
          return;
        }

        //console.log(hash);
        //交易签名
        let txSignature = await sdk.getSignData(hash.toString('hex'), passwordInfo.pri);
        //通过拼接签名、公钥获取HEX
        let signData = await sdk.appSplicingPub(txSignature.signValue, passwordInfo.pub);
        tAssemble.signatures = signData;
        let txhex = tAssemble.txSerialize().toString("hex");
        //console.log(txhex.toString('hex'));
        let broadcastResult = await validateAndBroadcast(txhex.toString('hex'));
        console.log(broadcastResult);
        if (!broadcastResult.success) {
          this.$message({
            message: this.$t('public.err') + JSON.stringify(broadcastResult),
            type: 'error',
            duration: 3000
          });
          return;
        } else {
          this.$message({message: this.$t('tips.tips0'), type: 'success', duration: 1000});
          this.transferFormDialog = false;
          //this.$refs['transferForm'].resetFields();
          this.transferForm.toAddress = '';
          this.transferForm.amount = '';
          this.transferForm.remarks = '';
          this.toUrl("txList");
        }
      },

      /**
       * @disc: 链内交易
       * @params:
       * @date: 2020-05-26 10:43
       * @author: Wave
       */
      async chainTransfer() {
        let transferInfo = {
          fromAddress: this.addressInfo.address,
          assetsChainId: this.changeAssetInfo.chainId,
          assetsId: this.changeAssetInfo.assetId,
          fee: 100000
        };
        transferInfo['toAddress'] = this.transferForm.toAddress;
        transferInfo['amount'] = timesDecimals(this.transferForm.amount, this.changeAssetInfo.decimal);
        //console.log(transferInfo);
        let inOrOutputs = await this.inputsOrOutputs(transferInfo);
        //console.log(inOrOutputs);
        //交易组装
        let tAssemble = await nerve.transactionAssemble(inOrOutputs.data.inputs, inOrOutputs.data.outputs, htmlEncode(this.transferForm.remarks), 2);
        //获取hash
        let hash = await tAssemble.getHash();
        return hash
      },

      /**
       * @disc: 跨链交易
       * @params:
       * @date: 2020-05-26 10:43
       * @author: Wave
       */
      crossChainTransfer() {
        console.log(MAIN_INFO);
        console.log(CROSS_INFO);
      },

      /**
       * 获取inputs and outputs
       * @param transferInfo
       * @returns {*}
       **/
      async inputsOrOutputs(transferInfo) {
        //console.log(MAIN_INFO);
        const defaultAsset = {assetsChainId: MAIN_INFO.chainId, assetsId: MAIN_INFO.assetId};
        let newAmount = 0;
        let inputs = [];
        if (transferInfo.assetsChainId === defaultAsset.assetsChainId && transferInfo.assetsId === defaultAsset.assetsId) {
          const balanceInfo = await getBaseAssetInfo(transferInfo.assetsChainId, transferInfo.assetsId, transferInfo.fromAddress);
          newAmount = Number(Plus(transferInfo.amount, transferInfo.fee));
          inputs = [{
            address: transferInfo.fromAddress,
            assetsChainId: transferInfo.assetsChainId,
            assetsId: transferInfo.assetsId,
            amount: newAmount,
            locked: 0,
            nonce: balanceInfo.data.nonce
          }];
        } else {
          const balanceInfo = await getBaseAssetInfo(transferInfo.assetsChainId, transferInfo.assetsId, transferInfo.fromAddress);
          newAmount = Number(transferInfo.amount);
          inputs = [{
            address: transferInfo.fromAddress,
            assetsChainId: transferInfo.assetsChainId,
            assetsId: transferInfo.assetsId,
            amount: newAmount,
            locked: 0,
            nonce: balanceInfo.data.nonce
          }];
          const defaultBalanceInfo = await getBaseAssetInfo(defaultAsset.assetsChainId, defaultAsset.assetsId, transferInfo.fromAddress);
          inputs.push({
            address: transferInfo.fromAddress,
            assetsChainId: defaultAsset.assetsChainId,
            assetsId: defaultAsset.assetsId,
            amount: transferInfo.fee,
            locked: 0,
            nonce: defaultBalanceInfo.data.nonce
          });
        }
        let outputs = [{
          address: transferInfo.toAddress,
          assetsChainId: transferInfo.assetsChainId,
          assetsId: transferInfo.assetsId,
          amount: transferInfo.amount,
          lockTime: 0
        }];
        return {success: true, data: {inputs: inputs, outputs: outputs}};
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
        .el-button--primary {
          background-color: #78a0f3;
          border-color: #78a0f3;
          &:hover {
            background-color: #79a4ef;
            border-color: #99ccee;
          }
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
