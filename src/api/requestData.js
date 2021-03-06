import axios from 'axios'
import {post} from './https'
import {chainID} from './util'
import {MAIN_INFO, API_URL} from '@/config.js'

/**
 * 判断是否为主网
 * @param chainId
 **/
export function isMainNet(chainId) {
  return chainId === MAIN_INFO.chainId;
}

/**
 * 计算手续费
 * @param tx
 * @param signatrueCount 签名数量，默认为1
 **/
export function countFee(tx, signatrueCount) {
  let txSize = tx.txSerialize().length;
  txSize += signatrueCount * 110;
  return 100000 * Math.ceil(txSize / 1024);
}

/**
 * 计算跨链交易手续费
 * @param tx
 * @param signatrueCount 签名数量，默认为1
 **/
export async function countCtxFee(tx, signatrueCount) {
  let resultValue = 0;
  await post('/', 'getByzantineCount', [tx.txSerialize().toString('hex')])
    .then((response) => {
      //console.log(response);
      if (response.hasOwnProperty("result")) {
        let txSize = tx.txSerialize().length;
        txSize += (signatrueCount + response.result.value) * 110;
        resultValue = 1000000 * Math.ceil(txSize / 1024)
      } else {
        resultValue = -100
      }
    })
    .catch((error) => {
      console.log(error);
      resultValue = -100
    });
  return resultValue;
}

/**
 * 获取inputs and outputs
 * @param transferInfo
 * @param balanceInfo
 * @param type 2:转账 4:创建节点 5:加入staking 6:退出staking 9:注销节点 28:追加保证金 29:退出保证金
 * @returns {*}
 **/
export async function inputsOrOutputs(transferInfo, balanceInfo, type) {
  //console.log(balanceInfo);
  let newAmount = transferInfo.amount + transferInfo.fee;
  let newLocked = 0;
  let newNonce = balanceInfo.nonce;
  let newoutputAmount = transferInfo.amount;
  let newLockTime = 0;
  let inputs = [];
  let outputs = [];

  if (type === 4) {
    newLockTime = -1;
  } else if (type === 5) {
    if (transferInfo.defaultAssetsInfo) { // 加入的资产不是nvt input组装两个
      let newArr = {
        address: transferInfo.fromAddress,
        assetsChainId: transferInfo.assetsChainId,
        assetsId: transferInfo.assetsId,
        amount: transferInfo.amount,
        locked: 0,
        nonce: balanceInfo.nonce
      };
      inputs.push(newArr);
      let feeArr = {
        address: transferInfo.fromAddress,
        assetsChainId: transferInfo.defaultAssetsInfo.chainId,
        assetsId: transferInfo.defaultAssetsInfo.assetsId,
        amount: transferInfo.fee,
        locked: 0,
        nonce: transferInfo.feeBalanceInfo.nonce
      };
      inputs.push(feeArr);
    } else { // 加入的资产是nvt 合并amount+fee
      inputs.push({
        address: transferInfo.fromAddress,
        assetsChainId: transferInfo.assetsChainId,
        assetsId: transferInfo.assetsId,
        amount: transferInfo.amount + transferInfo.fee,
        locked: 0,
        nonce: balanceInfo.nonce
      });
    }

    outputs.push({
      address: transferInfo.toAddress ? transferInfo.toAddress : transferInfo.fromAddress,
      assetsChainId: transferInfo.assetsChainId,
      assetsId: transferInfo.assetsId,
      amount: transferInfo.amount,
      lockTime: transferInfo.locked
    });
    return {success: true, data: {inputs: inputs, outputs: outputs}};
  } else if (type === 6) {
    if (transferInfo.defaultAssetsInfo) { // 加入的资产不是nvt input组装两个
      let newArr = {
        address: transferInfo.fromAddress,
        assetsChainId: transferInfo.assetsChainId,
        assetsId: transferInfo.assetsId,
        amount: transferInfo.amount,
        locked: -1,
        nonce: balanceInfo.nonce
      };
      inputs.push(newArr);
      let feeArr = {
        address: transferInfo.fromAddress,
        assetsChainId: transferInfo.defaultAssetsInfo.chainId,
        assetsId: transferInfo.defaultAssetsInfo.assetsId,
        amount: transferInfo.fee,
        locked: 0,
        nonce: transferInfo.feeBalanceInfo.nonce
      };
      inputs.push(feeArr);
      outputs.push({
        address: transferInfo.toAddress ? transferInfo.toAddress : transferInfo.fromAddress,
        assetsChainId: transferInfo.assetsChainId,
        assetsId: transferInfo.assetsId,
        amount: transferInfo.amount,
        lockTime: 0
      });
    } else {  //加入的资产是nvt 合并amount+fee
      inputs.push({
        address: transferInfo.fromAddress,
        assetsChainId: transferInfo.assetsChainId,
        assetsId: transferInfo.assetsId,
        amount: transferInfo.amount,
        locked: -1,
        nonce: balanceInfo.nonce
      });
      outputs.push({
        address: transferInfo.toAddress ? transferInfo.toAddress : transferInfo.fromAddress,
        assetsChainId: transferInfo.assetsChainId,
        assetsId: transferInfo.assetsId,
        amount: transferInfo.amount - transferInfo.fee,
        lockTime: 0
      });
    }

    return {success: true, data: {inputs: inputs, outputs: outputs}};
  } else if (type === 9) { //注销节点
    newoutputAmount = transferInfo.amount - transferInfo.fee;
    let times = (new Date()).valueOf() + 3600000 * 72;//锁定三天
    newLockTime = Number(times.toString().substr(0, times.toString().length - 3));
    for (let item of transferInfo.nonceList) {
      let newArr = {
        address: transferInfo.fromAddress,
        assetsChainId: transferInfo.assetsChainId,
        assetsId: transferInfo.assetsId,
        amount: item.deposit,
        locked: -1,
        nonce: item.nonce
      };
      inputs.push(newArr)
    }

    outputs.push({
      address: transferInfo.toAddress ? transferInfo.toAddress : transferInfo.fromAddress,
      assetsChainId: transferInfo.assetsChainId,
      assetsId: transferInfo.assetsId,
      amount: newoutputAmount,
      lockTime: newLockTime
    });
    return {success: true, data: {inputs: inputs, outputs: outputs}};
  } else if (type === 28) { //追加保证金
    newLockTime = -1;
  } else if (type === 29) { //退出保证金
    newoutputAmount = transferInfo.amount - transferInfo.fee;
    //锁定三天
    let times = (new Date()).valueOf() + 3600000 * 72;
    newLockTime = Number(times.toString().substr(0, times.toString().length - 3));

    for (let item of transferInfo.nonceList) {
      let newArr = {
        address: transferInfo.fromAddress,
        assetsChainId: transferInfo.assetsChainId,
        assetsId: transferInfo.assetsId,
        amount: item.deposit,
        locked: -1,
        nonce: item.nonce
      };
      inputs.push(newArr)
    }

    outputs.push({
      address: transferInfo.toAddress ? transferInfo.toAddress : transferInfo.fromAddress,
      assetsChainId: transferInfo.assetsChainId,
      assetsId: transferInfo.assetsId,
      amount: newoutputAmount,
      lockTime: newLockTime
    });
    let allAmount = 0;
    for (let item of transferInfo.nonceList) {
      allAmount = allAmount + Number(item.deposit)
    }
    outputs.push({
      address: transferInfo.toAddress ? transferInfo.toAddress : transferInfo.fromAddress,
      assetsChainId: transferInfo.assetsChainId,
      assetsId: transferInfo.assetsId,
      amount: allAmount - transferInfo.amount,
      lockTime: -1
    });

    return {success: true, data: {inputs: inputs, outputs: outputs}};
  }

  inputs.push({
    address: transferInfo.fromAddress,
    assetsChainId: transferInfo.assetsChainId,
    assetsId: transferInfo.assetsId,
    amount: newAmount,
    locked: newLocked,
    nonce: newNonce
  });

  outputs.push({
    address: transferInfo.toAddress ? transferInfo.toAddress : transferInfo.fromAddress,
    assetsChainId: transferInfo.assetsChainId,
    assetsId: transferInfo.assetsId,
    amount: newoutputAmount,
    lockTime: newLockTime
  });

  /*console.log(inputs);
  console.log(outputs);*/
  return {success: true, data: {inputs: inputs, outputs: outputs}};
}

/**
 * 获取账户的余额及nonce
 * @param assetChainId
 * @param assetId
 * @param address
 * @returns {Promise<any>}
 */
export async function getNulsBalance(assetChainId = 2, assetId = 1, address) {
  return await post('/', 'getAccountBalance', [assetChainId, assetId, address])
    .then((response) => {
      if (response.hasOwnProperty("result")) {
        return {success: true, data: {balance: response.result.balance, nonce: response.result.nonce}}
      } else {
        return {success: false, data: response}
      }
    })
    .catch((error) => {
      return {success: false, data: error};
    });
}

/**
 * 获取地址资产信息
 * @param chainId
 * @param assetId
 * @param address
 * @returns {Promise<any>}
 */
export async function getBaseAssetInfo(chainId = 2, assetId = 1, address) {
  return await post('/', 'getAccountBalance', [chainId, assetId, address])
    .then((response) => {
      //console.log(response);
      if (response.result) {
        return {success: true, data: response.result}
      } else {
        return {success: false, data: response}
      }
    })
    .catch((error) => {
      return {success: false, data: error};
    });
}

/**
 * 验证交易
 * @param txHex
 * @returns {Promise<any>}
 **/
export async function validateTx(txHex) {
  return await post('/', 'validateTx', [txHex])
    .then((response) => {
      if (response.hasOwnProperty("result")) {
        return {success: true, data: response.result};
      } else {
        return {success: false, data: response.error};
      }
    })
    .catch((error) => {
      return {success: false, data: error};
    });
}

/**
 * 广播交易
 * @param txHex
 * @returns {Promise<any>}
 **/
export async function broadcastTx(txHex) {
  return await post('/', 'broadcastTx', [txHex])
    .then((response) => {
      if (response.hasOwnProperty("result")) {
        return {success: true, data: response.result};
      } else {
        return {success: false, data: response.error};
      }
    })
    .catch((error) => {
      return {success: false, data: error};
    });
}

/**
 * 验证交易并广播
 * @param txHex
 * @returns {Promise<any>}
 **/
export async function validateAndBroadcast(txHex) {
  return await post('/', 'validateTx', [txHex])
    .then((response) => {
      console.log(response);
      if (response.hasOwnProperty("result")) {
        let newHash = response.result.value;
        return post('/', 'broadcastTx', [txHex])
          .then((response) => {
            if (response.hasOwnProperty("result")) {
              return {success: true, hash: newHash};
            } else {
              return {success: false, data: response.error};
            }
          })
          .catch((error) => {
            return {success: false, data: error};
          });
      } else {
        return {success: false, data: response.error};
      }
    })
    .catch((error) => {
      return {success: false, data: error};
    });
}

/**
 * 获取节点的委托列表
 * @param agentHash
 * @returns {Promise<any>}
 **/
export async function agentDeposistList(agentHash) {
  return await post('/', 'getConsensusDeposit', [1, 300, agentHash])
    .then((response) => {
      return response.result;
    })
    .catch((error) => {
      return {success: false, data: error};
    });
}

/**
 * 获取合约代码构造函数
 * @param contractCodeHex
 * @returns {Promise<any>}
 */
export async function getContractConstructor(contractCodeHex) {
  return await post('/', 'getContractConstructor', [contractCodeHex])
    .then((response) => {
      //console.log(response);
      if (response.hasOwnProperty("result")) {
        return {success: true, data: response.result.constructor};
      } else {
        return {success: false, data: response.error};
      }
    })
    .catch((error) => {
      return {success: false, data: error};
    });
}

/**
 * 获取链ID对应的前缀
 * @returns {Promise<any>}
 */
export async function getAllAddressPrefix() {
  let newData = [
    {chainId: 4, addressPrefix: 'NVT'},
    {chainId: 4, addressPrefix: 'TNVT'},
  ];
  await post('/', 'getAllAddressPrefix', [])
    .then((response) => {
      //console.log(response);
      if (response.hasOwnProperty("result")) {
        if (sessionStorage.hasOwnProperty('prefixData')) {
          sessionStorage.removeItem('prefixData')
        }
        sessionStorage.setItem('prefixData', JSON.stringify(response.result));
      } else {
        sessionStorage.setItem('prefixData', JSON.stringify(newData));
      }
    })
    .catch((error) => {
      console.log(error);
      sessionStorage.setItem('prefixData', JSON.stringify(newData));
    });
}

//根据链ID获取前缀
export async function getPrefixByChainId(chainId) {
  await getAllAddressPrefix();
  let prefixData = JSON.parse(sessionStorage.getItem('prefixData'));
  if (prefixData) {
    let newInfo = prefixData.find((v) => {
      return v.chainId === chainId;
    });
    return newInfo.addressPrefix;
  } else {
    return '';
  }
}

/**
 * @disc: 获取扫描后签名信息
 * @params: importRandomString
 * @date: 2019-12-02 16:39
 * @author: Wave
 */
export async function getScanAutograph(randomString) {
  return await post('/', 'getMsg', [randomString])
    .then(async (response) => {
      //console.log(response);
      if (response.hasOwnProperty("result") && response.result.pubkey) {
        if (response.result.pubkey && response.result.signData) {
          return {success: true, data: {signData: response.result.signData, pubkey: response.result.pubkey}}
        } else {
          return {success: true, data: {}}
        }
      } else {
        return {success: false, data: response}
      }
    })
    .catch((error) => {
      return {success: false, data: error}
    });
}

/**
 * @disc: 发送消息到后台
 * @params: key,value
 * @date: 2019-12-02 16:39
 * @author: Wave
 */
export async function commitData(txHexKey, signDataKey, address, assembleHex) {
  let parameterValue = {
    address: address,
    hash: assembleHex.getHash().toString('hex'),
    txHex: assembleHex.txSerialize().toString("hex")
  };
  return await post('/', 'commitMsg', [txHexKey, parameterValue])
    .then((response) => {
      //console.log(response);
      if (response.hasOwnProperty("result")) {
        let txInfo = {
          url: localStorage.hasOwnProperty('url') ? JSON.parse(localStorage.getItem('url')).urls : 'https://beta.wallet.nuls.io/api',
          txHexKey: txHexKey,
          signDataKey: signDataKey,
        };
        /*console.log(txInfo);
        console.log(parameterValue.hash);
        console.log(parameterValue.txHex);*/
        return {success: true, data: {txInfo: txInfo, assembleHex: assembleHex}}
      } else {
        return {success: false, data: response}
      }
    })
    .catch((error) => {
      return {success: false, data: error}
    });
}

/**
 * @disc: 获取退出节点/退出保证金对应的追加保证金交易列表
 * @params: agentHash 节点hash
 * @params: reduceAmount 退出金额
 * @params: quitAll  是否全部退出 0：部分 1：全部
 * @date: 2020-05-15 16:03
 * @author: Wave
 */
export async function getReduceNonceList(agentHash, reduceAmount, quitAll) {
  console.log(API_URL);
  //let url = 'http://seede.nuls.io:17004/jsonrpc';
  //let url = 'http://192.168.1.122:17004/jsonrpc';
  let url = API_URL;
  let data = [chainID(), agentHash, reduceAmount, quitAll];
  const params = {
    "jsonrpc": "2.0",
    "method": 'getReduceNonceList',
    "params": data,
    "id": Math.floor(Math.random() * 1000)
  };
  try {
    let res = await axios.post(url, params);
    //console.log(res.data);
    if (res.data.hasOwnProperty('result')) {
      return {success: true, data: res.data.result}
    } else {
      return {success: false, data: res.data}
    }
  }
  catch (err) {
    return {success: false, data: err}
  }

}
