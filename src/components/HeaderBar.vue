<template>
  <div class="header shadow1">
    <div class="w1200">
      <div class="logo">
        <img class="click" @click="toUrl('home')" :src=logoSvg>
      </div>
      <div class="nav">
        <el-menu mode="horizontal" :default-active="navActives($route.path)" @select="handleSelect">
          <el-menu-item index="home">{{$t('nav.wallet')}}</el-menu-item>
          <el-menu-item index="staking">{{$t('nav.staking')}}</el-menu-item>
          <el-menu-item index="consensus" :disabled="addressList.length === 0">{{$t('nav.consensus')}}
          </el-menu-item>
          <el-menu-item index="governance" v-if="false">治理</el-menu-item>
          <el-menu-item index="application" v-if="false">应用</el-menu-item>
        </el-menu>
      </div>
      <div class="tool">
        <el-menu mode="horizontal" :default-active="navActive" @select="handleSelect">
          <el-submenu index="address" class="user" :disabled="addressList.length === 0">
            <template slot="title"><i class="iconfont iconzhanghu"></i></template>
            <el-menu-item v-for="item of addressList" :key="item.address" :index="item.address">
              <span :class="item.selection ? 'fCN' : '' ">
                 <i class="iconfont iconwo ico" :class="item.selection ? 'fCN' : 'transparent' "></i>
                <font v-if="item.alias" class="w100"> {{item.alias}}</font>
                <font v-else-if="item.remark" class="w100"> {{item.remark}}</font>
                <font v-else class="w100">{{item.addresss}}</font> |
                <span>{{item.balance}}</span>
              </span>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="set">
            <template slot="title">{{$t('nav.set')}}</template>
            <el-menu-item index="address">{{$t('nav.addressList')}}</el-menu-item>
            <el-menu-item index="nodeService">{{$t('nav.nodeList')}}</el-menu-item>
            <el-menu-item index="contact">{{$t('public.bookList')}}</el-menu-item>
            <el-menu-item index="seting">{{$t('public.about')}}</el-menu-item>
          </el-submenu>

          <el-menu-item index="lang">
            <span>{{this.lang ==="en" ? "CN":"EN"}}</span>
          </el-menu-item>

          <!-- <el-submenu index="lang">
             <template slot="title">{{this.lang ==="en" ? "Eng":"中文"}}</template>
             <el-menu-item index="cn">中文</el-menu-item>
             <el-menu-item index="en">English</el-menu-item>
           </el-submenu>-->
          <el-submenu index="more">
            <template slot="title"><i class="el-icon-more"></i></template>
            <el-menu-item index="official">{{$t('tab.tab21')}}</el-menu-item>
            <el-menu-item index="explorer">{{$t('tab.tab22')}}</el-menu-item>
            <el-menu-item index="docs">{{$t('tab.tab23')}}</el-menu-item>
          </el-submenu>
        </el-menu>

      </div>
    </div>
    <div class="cb"></div>
  </div>

</template>

<script>
  import Element from 'element-ui'
  import locale_zh from 'element-ui/lib/locale/lang/zh-CN'
  import locale_en from 'element-ui/lib/locale/lang/en'
  import logo from '@/assets/img/logo.svg'
  import {superLong, connectToExplorer} from '@/api/util'
  import {IS_DEV} from '@/config.js'

  export default {
    data() {
      return {
        logoSvg: logo, //logo
        navActive: '/',//菜单选中
        addressList: [], //地址列表
        lang: 'en', //语言选择
        symbol: 'NVT', //symbol
      };
    },
    components: {},
    watch: {
      '$store.getters.getSelectAddress': {
        // immediate: true,
        // deep: true,
        handler: function(val, old) {
          if (val.address !== old.address && old.address) {
            this.$store.dispatch('getAccountList')
          }
        }
      },
      '$store.state.addressInfo': {
        handler: function() {
          this.getAddressList()
        }
      },
      lang: function (val, oldVal) {
        //console.log(val, oldVal);
        if (val && val !== oldVal) {
          let locale = this.lang === 'en' ? locale_en : locale_zh;
          Vue.use(Element, {locale});
        }
      }
    },
    created() {
      this.$store.dispatch('getAccountList');
      this.setLang();
      this.getAddressList();
      let locale = this.lang === 'en' ? locale_en : locale_zh;
      Vue.use(Element, {locale});
    },
    mounted() {
      setInterval(() => {
        this.symbol = sessionStorage.hasOwnProperty('info') ? JSON.parse(sessionStorage.getItem('info')).symbol : 'NVT';
        /*if (this.symbol !== 'TNVT' && this.symbol !== 'NVT') {
          document.title = this.symbol + " Wallet";
        }*/
      }, 500)
    },
    methods: {
      setLang() {
        let type = navigator.appName;
        let langs = '';
        if (type === "Netscape") {
          langs = navigator.language;//获取浏览器配置语言，支持非IE浏览器
        } else {
          langs = navigator.userLanguage;//获取浏览器配置语言，支持IE5+ == navigator.systemLanguage
        }
        let lang = langs.substr(0, 2);//获取浏览器配置语言前两位
        if (lang === "zh") {
          this.lang = 'cn';
        } else {
          this.lang = 'en';
        }
        this.$i18n.locale = this.lang;
      },
      /**
       * 菜单导航
       * @param key
       * @param keyPath
       */
      handleSelect(key, keyPath) {
        if (keyPath.length > 1) {
          if (keyPath[0] === "address") {
            for (let item  of this.addressList) {
              //清除选中
              if (item.selection) {
                item.selection = false;
              }
              //添加选中
              if (item.address === keyPath[1]) {
                item.selection = true;
              }
            }
            this.$store.commit('setAddressInfo', this.addressList)
          } else if (keyPath[0] === "set") {
            this.$router.push({
              name: keyPath[1]
            })
          } else if (keyPath[0] === "more") {
            let newUrl = '';
            if (keyPath[1] === 'official') {
              newUrl = 'http://nerve.network/'
            } else if (keyPath[1] === 'explorer') {
              newUrl = IS_DEV ? 'http://beta.nervecan.nervedex.com/' : 'https://nervecan.nervedex.com/'
            } else if (keyPath[1] === 'docs') {
              newUrl = 'https://docs.nuls.io/'
            }
            connectToExplorer('nuls', newUrl);
          }
        } else if (key === 'lang') {
          this.selectLanguage()
        } else {
          this.$router.push({
            name: key
          })
        }
      },

      /**
       * 导航栏的选中
       * @param val
       **/
      navActives(val) {
        if (val.indexOf('/staking') ===0) {
          return 'staking'
        } else if (val.indexOf('/consensus') === 0) {
          return 'consensus'
        }  else {
          return 'home'
        }
      },

      /**
       * 获取账户列表缩写
       */
      getAddressList() {
        this.addressList = [...this.$store.state.addressInfo];
        if (this.addressList) {
          for (let item  of this.addressList) {
            item.addresss = superLong(item.address, 8);
          }
        }
      },

      /**
       * 语言切换
       */
      selectLanguage() {
        if (this.lang === 'cn') {
          this.lang = 'en';
        } else {
          this.lang = 'cn';
        }
        this.$i18n.locale = this.lang;
      },

      /**
       * 连接跳转
       * @param name
       */
      toUrl(name) {
        this.$router.push({
          name: name
        })
      },
    },
  }
</script>

<style lang="less">
  @import "./../assets/css/style";

  .header {
    height: 80px;
    .logo {
      width: 120px;
      float: left;
      img {
        margin: 20px 0 0 0;
        width: 100px;
        height: 40px;
      }
    }
    .nav {
      width: 600px;
      margin: 10px 0 0 0;
      float: left;
      .el-menu {
        .el-menu-item {
          padding: 0 15px;
        }
      }
    }
    .tool {
      width: 270px;
      margin: 10px 0 0 0;
      float: right;
      background-color: #e6a23c;
      .user {
        .el-submenu__title {
          .el-icon-arrow-down {
            margin: 35px 0 0 -16px;

          }
        }
      }
    }
  }

  .el-menu--horizontal {
    .ico {
      float: left;
      display: block;
      width: 25px;
    }
    .fCN {
      color: @Ncolour;
    }
    .w100 {
      display: block;
      float: left;
      width: 200px;
    }
  }
</style>
