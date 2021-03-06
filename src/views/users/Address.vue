<template>
  <div class="address" v-loading="loading">
    <h3 class="title">{{$t('address.address0')}}</h3>

    <div class="w1200 mt_20">
      <div class="top_ico">
        <i class="el-icon-plus click" @click="toUrl('newAddress')"></i>
      </div>
      <el-table :data="addressList" stripe border>
        <el-table-column prop="address" :label="$t('address.address1')" align="center" min-width="330">
        </el-table-column>
        <el-table-column :label="$t('tab.tab2')" align="center" width="150">
          <template slot-scope="scope">
            <span>{{scope.row.total }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="balance" :label="$t('consensus.consensus2')" align="center" width="150">
        </el-table-column>
        <!-- <el-table-column prop="consensusLock" :label="$t('tab.tab3')" align="center" width="140">
         </el-table-column>-->
        <el-table-column :label="$t('address.address3')" align="center">
          <template slot-scope="scope">
            <span v-show="scope.row.alias">{{scope.row.alias}}</span>
            <span v-show="!scope.row.alias" @click="addAlias(scope.row)">
              <i class="el-icon-edit-outline click"></i>
            </span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('address.address4')" align="center">
          <template slot-scope="scope">
            <span v-show="scope.row.remark !=='' " @click="editRemark(scope.row)"
                  class="click">{{scope.row.remark}}</span>
            <span v-show="scope.row.remark ==='' " @click="editRemark(scope.row)">
              <i class="el-icon-edit-outline click"></i>
            </span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('address.address5')" align="center" width="370">
          <template slot-scope="scope">
            <el-link class="click tab_bn" v-if="scope.row.aesPri ===''" disabled>{{$t('address.address6')}}</el-link>
            <label class="click tab_bn" @click="editPassword(scope.row)" v-else>{{$t('address.address6')}}</label>
            <span class="tab_line">|</span>
            <el-link class="click tab_bn" v-if="scope.row.aesPri ===''" disabled>{{$t('address.address7')}}</el-link>
            <label class="click tab_bn" @click="backAddress(scope.row)" v-else>{{$t('address.address7')}}</label>
            <span class="tab_line">|</span>
            <label class="click tab_bn" @click="deleteAddress(scope.row)">{{$t('address.address8')}}</label>
            <span class="tab_line">|</span>
            <el-link disabled v-if="scope.row.selection">{{$t('public.into')}}</el-link>
            <label class="click tab_bn" @click="selectionAddress(scope.row)" v-else>{{$t('public.into')}}</label>
          </template>
        </el-table-column>
      </el-table>
      <div class="pages">
        <div class="page-total">{{$t('public.total')}} {{addressList.length}}</div>
        <!--<div class="page-total">显示1-20 共 1000</div>-->
        <!-- <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" class="fr"
                        :current-page="currentPage4"
                        :page-sizes="[100, 200, 300, 400]"
                        background
                        :page-size="100"
                        layout=" prev, pager, next, jumper"
                        :total="400">
         </el-pagination>-->
      </div>
    </div>

    <el-dialog title="Remarks" width="30rem"
               :visible.sync="remarkDialog"
               :close-on-click-modal="false"
               :close-on-press-escape="false"
    >

      <div class="address-remark bg-white">
        <el-input v-model.trim="remarkInfo" :placeholder="$t('address.address9')"></el-input>
        <div class="btn-next">
          <el-button @click="remarkDialog=false">{{$t('address.address10')}}</el-button>
          <el-button type="success" @click='addRemark'>{{$t('address.address11')}}</el-button>
        </div>
      </div>
    </el-dialog>

    <Password ref="password" @passwordSubmit="passSubmit">
    </Password>
  </div>
</template>

<script>
  import nerve from 'nerve-sdk-js'
  import Password from '@/components/PasswordBar'
  import {divisionDecimals, chainID} from '@/api/util'
  import {getPrefixByChainId} from '@/api/requestData'

  export default {
    data() {
      return {
        addressList: this.$store.state.addressInfo,//地址列表
        selectAddressInfo: '', //操作的地址信息
        remarkDialog: false,//备注弹框
        remarkInfo: '',//备注信息
        prefix: '',//地址前缀
        loading: true
      };
    },
    components: {
      Password,
    },
    created() {
      getPrefixByChainId(chainID()).then((response) => {
        this.prefix = response
      }).catch((err) => {
        console.log(err);
        this.prefix = '';
      });
    },
    mounted() {
      this.getAddressLists(this.addressList);
    },
    methods: {
      /**
       * 循环获取账户余额及别名
       * @param addressList
       **/
      async getAddressLists(addressList) {
        //如果没有账户跳转到创建地址界面
        if (this.addressList.length === 0) {
          this.$router.push({
            name: "newAddress",
            query: {'address': ''}
          })
          return
        }
        for (let item of addressList) {
          await this.getAddressInfoByNode(item)
        }
        this.loading = false
      },
      /**
       * 获取地址网络信息
       * @param addressInfo
       **/
      async getAddressInfoByNode(addressInfo) {
        await this.$post('/', 'getAccount', [addressInfo.address])
          .then((response) => {
            //console.log(response);
            if (response.hasOwnProperty("result")) {
              for (let item of this.addressList) {
                if (item.address === addressInfo.address) {
                  addressInfo.alias = response.result.alias;
                  addressInfo.balance = divisionDecimals(response.result.balance);
                  addressInfo.consensusLock = divisionDecimals(response.result.consensusLock);
                  addressInfo.totalReward = divisionDecimals(response.result.totalReward);
                  addressInfo.total = divisionDecimals(response.result.totalBalance);
                  addressInfo.tokens = [];
                  addressInfo.chainId = nerve.verifyAddress(item.address).chainId;
                }
              }
              this.$store.commit('setAddressInfo', this.addressList)
            }
          })
          .catch((error) => {
            console.log("getAccount:" + error);
          });
      },


      /**
       * 设置别名
       * @param rowInfo
       **/
      addAlias(rowInfo) {
        if (rowInfo.balance === 0) {
          this.$message({message: this.$t('address.address12'), type: 'error', duration: 1000});
        } else {
          this.toUrl('setAlias', rowInfo.address)
        }
      },

      /**
       *  修改密码
       * @param rowInfo
       **/
      editPassword(rowInfo) {
        this.toUrl('editPassword', rowInfo.address)
      },

      /**
       *  备份账户
       * @param rowInfo
       **/
      backAddress(rowInfo) {
        this.selectAddressInfo = rowInfo;
        this.$router.push({
          name: "backupsAddress",
          query: {'backAddressInfo': rowInfo.address}
        })
      },

      /**
       *  移除账户
       * @param rowInfo
       **/
      deleteAddress(rowInfo) {
        if (!rowInfo.aesPri) {
          let newAddressInfo = [...this.$store.state.accountList];
          newAddressInfo.splice(newAddressInfo.findIndex(item => item.address === rowInfo.address), 1);
          if (this.selectAddressInfo.selection && newAddressInfo.length !== 0) {
            newAddressInfo[0].selection = true;
          }
          this.$store.commit('setAddressInfo', newAddressInfo)
          return;
        }
        this.$confirm(this.$t('tab.tab29'), this.$t('tab.tab32'), {
          confirmButtonText: this.$t('tab.tab30'),
          cancelButtonText: this.$t('nodeService.nodeService8'),
          type: 'warning',
          showClose: false,
          closeOnClickModal: false,
          closeOnPressEscape: false,
          center: true
        }).then(() => {
          this.backAddress(rowInfo);
        }).catch(() => {
          this.selectAddressInfo = rowInfo;
          this.$refs.password.showPassword(true)
        });

      },

      /**
       * 进入账户（使用账户）
       * @param rowInfo
       **/
      selectionAddress(rowInfo) {
        //console.log(rowInfo);
        for (let item  of this.addressList) {
          //清除选中
          if (item.selection) {
            item.selection = false;
          }
          //添加选中
          if (item.address === rowInfo.address) {
            item.selection = true;
          }
        }
        this.$store.commit('setAddressInfo', this.addressList)
        this.$router.push({
          name: 'home',
        })
      },

      /**
       *  获取密码框的密码
       * @param password
       **/
      passSubmit(password) {
        let newAddressInfo = this.addressList;
        const pri = nerve.decrypteOfAES(this.selectAddressInfo.aesPri, password);
        const deleteAddressInfo = nerve.importByKey(this.selectAddressInfo.chainId, pri, password, this.prefix);
        if (this.selectAddressInfo.address === deleteAddressInfo.address) {
          newAddressInfo.splice(newAddressInfo.findIndex(item => item.address === this.selectAddressInfo.address), 1);
          if (this.selectAddressInfo.selection && newAddressInfo.length !== 0) {
            newAddressInfo[0].selection = true;
          }
          this.$store.commit('setAddressInfo', newAddressInfo)
        } else {
          this.$message({message: this.$t('address.address13'), type: 'error', duration: 1000});
        }
      },

      /**
       *  编辑账户备注弹框
       * @param rowInfo
       */
      editRemark(rowInfo) {
        this.selectAddressInfo = rowInfo;
        this.remarkInfo = this.selectAddressInfo.remark;
        this.remarkDialog = true
      },

      /**
       * 账户备注提交
       */
      addRemark() {
        let newAddressInfo = [...this.$store.state.accountList]
        for (let item of newAddressInfo) {
          if (item.address === this.selectAddressInfo.address) {
            this.selectAddressInfo.remark = this.remarkInfo;
            item.remark = this.remarkInfo;
          }
        }
        this.$store.commit('setAddressInfo', newAddressInfo)
        this.remarkDialog = false;
        this.selectAddressInfo = '';
      },

      /**
       * 连接跳转
       * @param name
       * @param param
       */
      toUrl(name, param) {
        //console.log(name)
        this.$router.push({
          name: name,
          query: {'address': param}
        })
      },
    }
  }
</script>

<style lang="less">
  @import "./../../assets/css/style";

  .address {
    .el-dialog__body {
      background-color: @Bcolour;
      padding: 30px 20px 50px 20px;
      .address-remark {
        margin: 50px auto 0;
        .btn-next {
          margin: 40px auto 0;
          text-align: center;
          .el-button {
            width: 9.5rem;
          }
          .el-button--success {
            span {
              color: white;
            }
          }
          .el-button--success {
            background-color: #78a0f3;
            border-color: #78a0f3;
            &:hover {
              background-color: #79a4ef;
              border-color: #99ccee;
            }
          }
        }
      }
    }
  }

  .el-message-box__wrapper {
    .el-message-box__content {
      .el-message-box__message {
        p {
          color: red;
        }
      }
    }
  }


</style>
