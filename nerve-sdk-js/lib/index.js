const sdk = require('./api/sdk');
const txs = require('./model/txs');
const crypto = require("./crypto/eciesCrypto");

module.exports = {

  /**
   * 生成地址
   * @param chainId
   * @param passWord
   * @param prefix
   * @returns {{}}
   */
  newAddress(chainId, passWord, prefix) {
    let addressInfo = { "prefix": prefix };
    if (passWord) {
      addressInfo = sdk.newEcKey(passWord);
      addressInfo.aesPri = sdk.encrypteByAES(addressInfo.pri, passWord);
      addressInfo.pri = null;
    } else {
      addressInfo = sdk.newEcKey(passWord);
    }
    addressInfo.address = sdk.getStringAddress(chainId, addressInfo.pri, addressInfo.pub, prefix);
    return addressInfo;
  },

  /**
   * 根据公钥获取地址
   * @param chainId
   * @param assetId
   * @param pub
   * @param prefix
   * @returns {*|string}
   */
  getAddressByPub(chainId, assetId, pub, prefix) {
    return sdk.getStringAddressBase(chainId, assetId, '', pub, prefix);
  },

  /**
   * 验证地址
   * @param address
   * @returns {*}
   */
  verifyAddress(address) {
    return sdk.verifyAddress(address);
  },

  /**
   * 导入地址
   * @param chainId
   * @param pri
   * @param passWord
   * @param prefix
   * @returns {{}}
   */
  importByKey(chainId, pri, passWord, prefix) {
    let addressInfo = {};
    addressInfo.pri = pri;
    addressInfo.address = sdk.getStringAddress(chainId, pri, null, prefix);
    addressInfo.pub = sdk.getPub(pri);
    if (passWord) {
      addressInfo.aesPri = sdk.encrypteByAES(addressInfo.pri, passWord);
      addressInfo.pri = null;
    }
    return addressInfo;
  },

  /**
   * 组装交易
   * @param inputs
   * @param outputs
   * @param remark
   * @param type
   * @param info
   * @returns {Array}
   */
  transactionAssemble(inputs, outputs, remark, type, info) {
    let tt = [];
    if (type === 2) {
      //转账交易
      tt = new txs.TransferTransaction();
    } else if (type === 3) {
      //设置别名
      tt = new txs.AliasTransaction(info.fromAddress, info.alias);
    } else if (type === 4) {
      //创建节点
      tt = new txs.CreateAgentTransaction(info);
    } else if (type === 6) {
      //退出共识 todo 待完成
      console.log('退出共识 todo 待完成');
      //tt = new txs.WithdrawTransaction(info);
    } else if (type === 9) {
      //注销节点
      tt = new txs.StopAgentTransaction(info, outputs[0].lockTime - 86400 * 3);
    } else if (type === 28) {
      //追加保证金
      tt = new txs.DepositTransaction(info);
    }
    tt.setCoinData(inputs, outputs);
    tt.remark = remark;
    return tt;
  },

  /**
   * 交易签名
   * @param pri
   * @param pub
   * @param tAssemble
   * @returns {boolean}
   */
  transactionSerialize(pri, pub, tAssemble) {
    sdk.signatureTx(tAssemble, pri, pub);
    return tAssemble.txSerialize().toString('hex');
  },

  /**
   * @disc: App签名，拼接公钥
   * @date: 2019-12-03 16:01
   * @author: Wave
   */
  appSplicingPub: function appSplicingPub(signValue, pubHex) {
    return sdk.appSplicingPub(signValue, pubHex);
  },

  /**
   * 交易签名
   * @param pri
   * @param tAssemble
   * @returns {boolean}
   */
  transactionSignature(pri, tAssemble) {
    return sdk.signatureTransaction(tAssemble, pri);
  },

  /**
   * 解密私钥
   * @param aesPri
   * @param password
   * @returns {*}
   */
  decrypteOfAES(aesPri, password) {
    return sdk.decrypteOfAES(aesPri, password);
  },

  /**
   * 公钥加密内容
   * @param pub
   * @param data
   * @returns {Promise<string>}
   */
  async encryptOfECIES(pub, data) {
    let bufferData = Buffer.from(data);
    let encrypted = await eccrypto.encrypt(pub, bufferData);
    return encrypted.toString("hex");
  },

  /**
   * 私钥解密内容
   * @param pri
   * @param encrypted
   * @returns {Promise<string>}
   */
  async decryptOfECIES(pri, encrypted) {
    let bufferEncrypted = Buffer.from(encrypted, "hex");
    let decrypted = await eccrypto.decrypt(pri, bufferData);
    return decrypted.toString();
  }

};