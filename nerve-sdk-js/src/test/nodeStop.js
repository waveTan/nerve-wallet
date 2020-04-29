const nuls = require('../index');
const {getNulsBalance, countFee, inputsOrOutputs, validateTx, broadcastTx, getConsensusNode} = require('./api/util');

/**
 * @disc: 注销节点 dome
 * @date: 2019-10-18 10:38
 * @author: Wave
 */

let pri = '33027cb348f51d0909021343c3374b23cf011cadab0f24c1718bf6a382ce7a30';
let pub = '0243a092a010f668680238546f2b68b598bb8c606820f0d5051435adaff59e95b9';
let fromAddress = "TNVTdN9i4JSE9C1PrZZzuQpvrzdhXakSw3UxY";
let remark = 'stop agent....';

//调用注销节点
stopAgent(pri, pub, fromAddress, 4, 1, '0ecfd212aa490b3f060e2e06f23bef798696b0ca4b04826d35381e63bf113883');

/**
 * 注销节点
 * @param pri
 * @param pub
 * @param fromAddress
 * @param assetsChainId
 * @param assetsId
 * @param amount
 * @param agentHash
 * @returns {Promise<void>}
 */
async function stopAgent(pri, pub, fromAddress, assetsChainId, assetsId, agentHash) {
  const balanceInfo = await getNulsBalance(fromAddress);
  //console.log(balanceInfo);
  const depositList = await getConsensusNode(agentHash);
  //console.log(depositList);
  let transferInfo = {
    fromAddress: fromAddress,
    assetsChainId: assetsChainId,
    assetsId: assetsId,
    amount: depositList.deposit,
    fee: 100000,
    depositHash: agentHash,
  };
  let inOrOutputs = await inputsOrOutputs(transferInfo, balanceInfo, 9);
  //console.log(inOrOutputs);
  let tAssemble = await nuls.transactionAssemble(inOrOutputs.data.inputs, inOrOutputs.data.outputs, remark, 9, {address:fromAddress,agentHash:agentHash});
  //console.log(tAssemble);
  let txhex =  await nuls.transactionSerialize(pri, pub, tAssemble);
  console.log(txhex);
  let result = await validateTx(txhex);
  console.log(result);
  if (result.success) {
    console.log(result.data.value);
    let results = await broadcastTx(txhex);
    //console.log(results);
    if (results && result.value) {
      console.log("交易完成")
    } else {
      console.log("广播交易失败")
    }
  } else {
    console.log("验证交易失败")
  }
}


