import Vue from 'vue'
import Vuex from 'vuex'
import {explorerData, IS_DEV, changeApiUrl} from '@/config'
import {chainIdNumber, divisionDecimals, getSymbolInfo, Times, Plus} from '@/api/util'
import defaultIcon from '@/assets/img/commonIcon.png'
import {post} from '@/api/https'

let urlName = IS_DEV ? 'TestUrlData' : 'mainUrlData';
const chainNumber = chainIdNumber();

Vue.use(Vuex);

Vue.config.devtools = process.env.NODE_ENV === 'development';
export default new Vuex.Store({
  state: {
    addressInfo: localStorage.hasOwnProperty(chainNumber) ? JSON.parse(localStorage.getItem(chainNumber)) : [],//所有账户信息
    urlData: localStorage.hasOwnProperty(urlName) ? JSON.parse(localStorage.getItem(urlName)) : explorerData,  //服务节点配置信息
    accountList: sessionStorage.getItem('accountList') ? JSON.parse(sessionStorage.getItem('accountList')) : [], //资产列表
    homeLoading: true,
  },
  mutations: {
    setAddressInfo(state, data) {
      state.addressInfo = data;
      localStorage.setItem(chainNumber, JSON.stringify(data))
    },
    //更改服务节点配置
    setUrlData(state, data) {
      state.urlData = data;
      data.forEach(item => {
        if (item.selection) {
          changeApiUrl(item.urls)
        }
      });
      localStorage.setItem(urlName, JSON.stringify(data));
    },
    homeLoading(state, data) {
      state.homeLoading = data
    },
    //改变当前账户资产列表数据
    setAccountList(state, data) {
      state.accountList = data;
      sessionStorage.setItem('accountList', JSON.stringify(data))
    },
  },
  getters: {
    //当前选中账户
    getSelectAddress(state) {
      const data = state.addressInfo.filter(v => v.selection);
      return data.length ? data[0] : {}
    },

    //当前选中服务节点
    getCurrentUrlData(state) {
      const data = state.urlData.filter(v => v.selection);
      const res = data.length ? data[0] : {urls: ''};
      localStorage.setItem('url', JSON.stringify(res));
      return res
    },
  },
  actions: {
    //查询当前账户资产信息
    async getAccountList({commit, getters}) {
      commit('homeLoading', true);
      const ledgerList = await getLedgerList(getters.getSelectAddress);
      const crossList = await getCrossList(getters.getSelectAddress);
      let accountList = [...ledgerList, ...crossList];
      const assetList = await getAssetList(3, getters.getSelectAddress.address);
      for (let item of accountList) {
        //console.info(item);
        item.isAcross = false;
        for (let k of  assetList) {
          if (item.chainId === k.assetChainId && item.assetId === k.assetId) {
            item.isAcross = true
          }
        }
      }
      commit('homeLoading', false);
      commit('setAccountList', accountList)
    }
  }
})

//查询当前账户本链资产
async function getLedgerList(addressInfo) {
  let res = [];
  try {
    const result = await post('/', 'getAccountLedgerList', [addressInfo.address]);
    if (result.result) {
      for (let item of result.result) {
        const coinInfo = await getSymbolInfo(item.assetId, item.chainId);
        item.icon = item.icon || defaultIcon;
        item.usdPrice = coinInfo.usdPrice || 0;
        item.name = item.symbol;
        item.number = divisionDecimals(item.totalBalance, item.decimals);
        item.valuation = Number(Times(item.number, item.usdPrice));
        item.locking = divisionDecimals(Number(Plus(item.timeLock, item.consensusLock)), item.decimals);
        item.usdLocking = Number(Times(item.locking, item.usdPrice));
        item.available = divisionDecimals(item.balance, item.decimals);
        item.usdAvailable = Number(Times(item.available, item.usdPrice));
        res.push({...item})
      }
    }
  } catch (e) {
    console.error('获取本链资产失败' + e)
  }
  return res
}

//查询当前账户跨链资产
async function getCrossList(addressInfo) {
  let res = [];
  try {
    const result = await post('/', 'getAccountCrossLedgerList', [addressInfo.address]);
    if (result.result) {
      for (let item of result.result) {
        const coinInfo = await getSymbolInfo(item.assetId, item.chainId);
        item.icon = item.icon || defaultIcon;
        item.usdPrice = coinInfo.usdPrice;
        item.name = item.symbol;
        item.number = divisionDecimals(item.totalBalance, item.decimals);
        item.valuation = Number(Times(item.number, item.usdPrice));
        item.locking = divisionDecimals(Number(Plus(item.timeLock, item.consensusLock)), item.decimals);
        item.usdLocking = Number(Times(item.locking, item.usdPrice));
        item.available = divisionDecimals(item.balance, item.decimals);
        item.usdAvailable = Number(Times(item.available, item.usdPrice));
        res.push({...item})
      }
    }
  } catch (e) {
    console.error('获取跨链资产失败')
  }
  return res
}

/**
 * @disc: 获取生态内跨链资产列表
 * @params: assetType （选填，不填就是全部)  此处传3  [1-链内普通资产 2-链内合约资产 3-平行链资产 4-异构链资产]
 * @params: address (选填 有地址就查询地址有的资产)
 * @date: 2020-05-25 14:00
 * @author: Wave
 */
async function getAssetList(assetType, address) {
  try {
    const result = await post('/', 'getAssetList', [assetType, address]);
    console.info(result);
    if (result.result) {
      return result.result
    } else {
      return []
    }
  } catch (e) {
    console.error('获取跨链资产失败');
    return []
  }
}
