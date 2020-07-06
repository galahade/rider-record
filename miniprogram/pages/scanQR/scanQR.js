// miniprogram/pages/takeBusRecord/takeBusRecord.js
const sm2 = require('../../miniprogram_npm/miniprogram-sm-crypto/index.js').sm2;
const privateKey = '5aaee854756b693b35957fdbb7a54c73af84171eeeba5f3bbaef3937bbea6821'; // 私钥
const app = getApp()
Page({

});
Component({
  /**
   * Component的初始数据
   */
  data: {
    content: '',
  },
  methods: {
    scanCode: function () {
      wx.scanCode({
        onlyFromCamera: true,
        success: (res) => {
          console.log("车载二维码内容为：" + res.result)
          var content = sm2.doDecrypt(res.result, privateKey, 0); // 解密结果
          console.log("解密后的值为：" + content)
          this.setData({
            [`content`]: content,
          })
        }
      })
    }
  }
});
