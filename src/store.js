import Vue from 'vue'
import Vuex from 'vuex'
import {explorerData, IS_DEV, changeApiUrl} from '@/config'
import {chainIdNumber, superLong} from '@/api/util'
let urlName = IS_DEV ? 'mainUrlData' :'TestUrlData';
const chainNumber = chainIdNumber()
Vue.use(Vuex);

Vue.config.devtools = process.env.NODE_ENV === 'development'
export default new Vuex.Store({
  state: {
    addressInfo: localStorage.hasOwnProperty(chainNumber) ? JSON.parse(localStorage.getItem(chainNumber)) : [],//所有账户信息
    urlData: localStorage.hasOwnProperty(urlName) ? JSON.parse(localStorage.getItem(urlName)) : explorerData,  //服务节点配置信息
    accountList: sessionStorage.getItem('accountList') ? JSON.parse(sessionStorage.getItem('accountList')) : [], //资产列表
    homeLoading: true,
  },
  mutations: {
    setAddressInfo(state, data) {
      state.addressInfo = data
      localStorage.setItem(chainNumber, JSON.stringify(data))
    },
    //更改服务节点配置
    setUrlData(state, data) {
      state.urlData = data;
      data.forEach( item=> {
        if (item.selection) {
          changeApiUrl(item.urls)
        }
      })
      let urlName = IS_DEV ? 'mainUrlData' :'TestUrlData';
      localStorage.setItem(urlName, JSON.stringify(data));
    },
    homeLoading(state, data) {
      state.homeLoading = data
    },
    //改变当前账户资产列表数据
    setAccountList(state, data) {
      state.accountList = data
      sessionStorage.setItem('accountList', JSON.stringify(data))
    },
  },
  getters: {
    //当前选中账户
    getSelectAddress(state) {
      const data = state.addressInfo.filter(v => v.selection)
      return data.length ? data[0] : {}
    },

    //当前选中服务节点
    getCurrentUrlData(state) {
      const data = state.urlData.filter(v => v.selection)
      return data.length ? data[0] : {urls: '/api'}
    },
  },
  actions: {}
})
