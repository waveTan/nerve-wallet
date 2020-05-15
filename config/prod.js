/**
 * Created by zhoulijun on 2019-09-17.
 */
"use strict";

//开发模式
export const IS_DEV = process.env.NODE_ENV === 'development';
//燃烧地址的公钥
export const API_BURNING_ADDRESS_PUB = '000000000000000000000000000000000000000000000000000000000000000000';
//ChainId和资产ID
export const MAIN_INFO = IS_DEV ? {chainId: 4, assetId: 1, prefix: 'TNVT'} : {chainId: 3, assetId: 1, prefix: 'NVT'};
//正式、测试网络的api
const url = localStorage.hasOwnProperty("url") && localStorage.getItem('url') !== 'undefined' ? JSON.parse(localStorage.getItem("url")).urls : '/api';
let API_URL = url;

function changeApiUrl(url) {
  API_URL = url
}

export {API_URL, changeApiUrl}
//请求延迟时间
export const API_TIME = '8000';
//默认节点服务列表
export const explorerData = [
  {
    name: 'Official',
    chainId: MAIN_INFO.chainId,
    assetId: MAIN_INFO.assetId,
    decimals: 8,
    chainName: 'nerve',
    urls: '/api',
    delay: '10ms',
    selection: true,
    isDelete: false
  },
  {
    name: '132',
    chainId: MAIN_INFO.chainId,
    assetId: MAIN_INFO.assetId,
    decimals: 8,
    chainName: 'nerve',
    urls: 'http://192.168.1.132:17003',
    delay: '10ms',
    selection: false,
    isDelete: false
  },
];
//默认浏览器地址（跳转地址）
export const explorerUrl = IS_DEV ? 'http://beta.nervecan.nervedex.com/' : 'https://nervecan.nervedex.com/';

