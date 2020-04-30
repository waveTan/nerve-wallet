<template>
  <div class="set">
    <div>
      <div class="w1200">
        <h3 class="title">
          {{$t('public.about')}}
        </h3>
      </div>
    </div>
    <div class="w1200 mt_20 bg-white set_info">
      <div class="tc mzt_20">
        <h4 class="font24 mb_20">{{symbol}} Wallet</h4>
        <!--<p class="font16">{{$t('public.logInfo')}}: <span class="click" @click="seeLog">{{$t('public.see')}}</span></p>-->
        <ul>
          <li v-show="RUN_PATTERN"><span>{{$t('public.operatingSystem')}}:</span>{{system}}</li>
          <li>
            <span>{{$t('public.version')}}:</span>
            <font v-if="RUN_DEV"> {{version}}</font>
            <font v-else>Beta-{{version}}</font>
          </li>
          <li v-show="RUN_PATTERN">
            <span>{{$t('public.version1')}}:</span>
            <font v-if="RUN_DEV">{{newVersion}}</font>
            <font v-else>Beta-{{newVersion}}</font>
          </li>
          <li v-show="RUN_PATTERN && system !== 'Darwin'"><span>{{$t('public.logInfo')}}:</span>{{logUrl}}</li>
          <li v-show="system === 'Darwin'">
            <span>{{$t('public.downloadUrl')}}:</span>
            <font>https://github.com/nuls-io/nuls-v2/releases</font>
          </li>
        </ul>
        <el-button type="success" @click="checkUpdate" v-show="RUN_PATTERN && system !== 'Darwin'">
          {{$t('public.checkUpdates')}}
        </el-button>
      </div>
    </div>
    <el-dialog :title="$t('bottom.updateWallet')" width="35rem"
               :visible.sync="updateDialogVisible"
               :show-close="tips.type===1 || tips.type===4"
               :close-on-press-escape="false"
               :close-on-click-modal="false">
      <div class="upload">
        <div class="upload-tips">{{$t('bottom.Tips')}}: {{$t('TipsType.'+tips.type) }}</div>
        <div class="upload-percent" v-if="downloadPercent !==0 ">
          <el-progress :text-inside="true" :stroke-width="18" :percentage="downloadPercent" status="success">
          </el-progress>
        </div>
        <div class="upload-bt" v-if="tips.type === 3" v-show="false">
          <el-button type="info" @clcik="afterRun">{{$t('bottom.Backstage')}}</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import packages from './../../../package'

  export default {
    data() {
      return {
        symbol: sessionStorage.hasOwnProperty('info') ? JSON.parse(sessionStorage.getItem('info')).defaultAsset.symbol : 'NULS',
        updateDialogVisible: false,//更新弹框
        tips: {},//提示信息
        downloadPercent: 0,//下载进度
        logUrl: '',
        system: '',
        version: packages.version,//版本号
        newVersion: '',//最新版本号
      };
    },
    created() {
      this.seeLog();
    },
    mounted() {

    },
    components: {},
    methods: {

      /**
       * 检查更新
       **/
      async checkUpdate() {
        this.updateDialogVisible = true;
        this.tips = {};
        this.downloadPercent = 0;
      },

      /**
       * 后台运行
       **/
      afterRun() {
        this.updateDialogVisible = false;
      },

      /**
       * 查看日志
       */
      seeLog() {

      }

    }
  }
</script>

<style lang="less">
  @import "./../../assets/css/style";

  .set {
    .set_info {
      border: @BD1;
      min-height: 500px;
      ul {
        li {
          line-height: 1.6rem;
          width: 40rem;
          margin: 0 0 0 30%;
          text-align: left;
          font-size: 12px;
          span {
            width: 8rem;
            display: block;
            float: left;
            font-size: 14px;
            text-align: right;
            padding-right: 0.5rem;
          }
        }

      }
      .el-button {
        margin: 1rem 0 0 0;
        padding: 0.5rem;
        width: 15rem;
      }
    }
  }

</style>
