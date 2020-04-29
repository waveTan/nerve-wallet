const nuls = require('../index');
const {getNulsBalance, inputsOrOutputs, validateTx, broadcastTx} = require('./api/util');

/**
 * @disc: 加入共识dome
 * @date: 2019-10-18 10:34
 * @author: Wave
 */

let pri = '33027cb348f51d0909021343c3374b23cf011cadab0f24c1718bf6a382ce7a30';
let pub = '0243a092a010f668680238546f2b68b598bb8c606820f0d5051435adaff59e95b9';
let fromAddress = "TNVTdN9i4JSE9C1PrZZzuQpvrzdhXakSw3UxY";
let amount = 200000000000;
let remark = 'additional margin ....';

let deposit = {
  address: fromAddress,
  agentHash: '0ecfd212aa490b3f060e2e06f23bef798696b0ca4b04826d35381e63bf113883',
  amount: amount,
};
//调用加入共识
addNode(pri, pub, fromAddress, 4, 1, amount, deposit);

async function addNode(pri, pub, fromAddress, assetsChainId, assetsId, amount, deposit) {
  const balanceInfo = await getNulsBalance(fromAddress);
  //console.log(balanceInfo);
  let transferInfo = {
    fromAddress: fromAddress,
    assetsChainId: assetsChainId,
    assetsId: assetsId,
    amount: amount,
    fee: 100000
  };
  let inOrOutputs = await inputsOrOutputs(transferInfo, balanceInfo, 28);
  let tAssemble = await nuls.transactionAssemble(inOrOutputs.data.inputs, inOrOutputs.data.outputs, remark, 28, deposit);
  //console.log(tAssemble);
  let txhex = await nuls.transactionSerialize(pri, pub, tAssemble);
  console.log(txhex);
  let result = await validateTx(txhex);
  console.log(result);
  if (result.success) {
    console.log(result.data.value);
    let results = await broadcastTx(txhex);
    if (results && result.data.value) {
      console.log("交易完成")
    } else {
      console.log("广播交易失败")
    }
  } else {
    console.log("验证交易失败")
  }
}


