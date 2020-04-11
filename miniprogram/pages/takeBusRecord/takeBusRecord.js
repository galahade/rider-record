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
    riders: [],
    rider: {},
    isShowTime: false,
    isFever: false,
    feverTemp: 37.3,
    temperature: 36.5,
    formData: {
      temperature: 36.5
    },
    rules: [{
      name: 'rider',
      rules: [{ required: true, message: '乘车人是必选项' }],
    }, 
    {
      name: 'license',
        rules: [{ required: true, message: '必须扫描乘车登记二维码' }],
      }
      ]
  },
  attached: function () {
    this.setData({
      riders: app.riders
    });
  },
  methods: {
    scanCode: function () {
      wx.scanCode({
        onlyFromCamera: true,
        success: (res) => {
          console.log("车载二维码内容为：" + res.result)
          var license = sm2.doDecrypt(res.result, privateKey, 0); // 解密结果
          console.log("解密后的值为：" + license)
          if (license.length < 5 || license.length > 7) {
            this.setData({
              error: '无效二维码'
            })
          } else {
            this.setData({
              [`formData.license`]: license,
            })
          }
        }
      })
    },
    riderChange: function (e) {
      var riders = this.data.riders;
      for (var i = 0, len = riders.length; i < len; ++i) {
        riders[i].checked = riders[i]._id == e.detail.value;
      }
      this.setData({
        riders: riders,
        [`formData.rider`]: e.detail.value,
      })
    },
    temperatureChange: function (e) {
      var heat = e.detail.value
      if (heat >= this.data.feverTemp) {
        console.log(`温度超高，是否输入无误`)
        this.setData({
          isFever: true
        })
      } else {
        this.setData({
          isFever: false
        })
      }
      this.setData({
        temperature: heat,
        [`formData.temperature`]: heat,
      });
    },
    closeAndReset() {
      var riders = this.data.riders;
      for (var i = 0, len = riders.length; i < len; ++i) {
        riders[i].checked = false;
      }
      this.setData({
        riders: riders,
        rider: {},
        isShowTime: false,
        isFever: false,
        temperature: 36.5,
        formData: {
          temperature: 36.5
        },
      });
    },
    submitForm() {
      this.selectComponent('#form').validate((valid, errors) => {
        console.log('valid', valid, errors)
        if (!valid) {
          const firstError = Object.keys(errors)
          if (firstError.length) {
            this.setData({
              error: errors[firstError[0]].message
            })

          }
        } else {
          this.postData()
        }
      })
    },
    postData() {
      var formData = this.data.formData
      wx.cloud.callFunction({
        name: 'addTakeBusRecord',
        data: formData,
        success: res => {
          console.log('用成功')
          wx.showToast({
            title: '调用成功',
          })
          this.setData({
            rider: res.result,
            isShowTime: true
          })
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '调用失败',
          })
          console.error('[云函数] [sum] 调用失败：', err)
        }
      })
    }
  }
});
