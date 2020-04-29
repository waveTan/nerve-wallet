import Vue from 'vue'
import Vuex from 'vuex'
import {explorerData,IS_DEV} from '@/config'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    addressInfo: {},
    urlData: [],
    accountList: sessionStorage.getItem('accountList') ? JSON.parse(sessionStorage.getItem('accountList')) : []
  },
  mutations: {
    setAddressInfo(state, data) {
      state.addressInfo = data
    },
    setUrlData(state, data) {
      state.urlData = data;
      let urlName = IS_DEV ? 'mainUrlData' :'TestUrlData';
      localStorage.setItem(urlName, JSON.stringify(data));
    },
    setAccountList(state, data) {
      state.accountList = data
      sessionStorage.setItem('accountList', JSON.stringify(data))
    }
  },
  getters: {
    getAddressInfo: state => state.addressInfo,

    getUrlData(state) {
      if (state.urlData.length === 0) {
        let urlName = IS_DEV ? 'mainUrlData' :'TestUrlData';
        state.urlData = localStorage.hasOwnProperty(urlName) ? JSON.parse(localStorage.getItem(urlName)) : explorerData;
        localStorage.setItem(urlName, JSON.stringify(state.urlData));
      }
      return state.urlData
    }
  },
  actions: {}
})
