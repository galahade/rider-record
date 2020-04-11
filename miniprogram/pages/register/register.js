// miniprogram/pages/register/register.js

const app = getApp()
Page({

});
Component({
  /**
   * Component的初始数据
   * idcard 验证是通过修改miniprogram_npm/weui-miniprogram/form/form.js的方式实现的。下一步应改为独立实现方式。
   */
  data: {
    riders: [],
    showTopTips: false,
    isAdult: true,
    isMobileEditable: true,
    isSuccess: false,
    genderItems: [{
        name: '女',
        value: '0'
      },
      {
        name: '男',
        value: '1'
      }
    ],
    isAgree: false,
    formAData: {
      isAdult: true
    },
    formCData: {
      isAdult: false
    },
    rulesA: [{
      name: 'name',
      rules: [{
        required: true,
        message: '姓名必填'
      }],
    }, {
      name: 'mobile',
      rules: [{
        required: true,
        message: '手机号必填'
      }, {
        mobile: true
      }],
    }, {
      name: 'idcard',
      rules: [{
        required: true,
        message: '身份证号必填'
      }, {
        idcard: true
      }],
    }, {
      name: 'gender',
      rules: {
        required: true,
        message: '性别是必选项'
      }
    }, {
      name: 'ticket',
      rules: {
        required: true,
        message: '请进行验证码验证'
      }
    }, {
      name: 'randstr',
      rules: {
        required: true,
        message: '请进行验证码验证'
      }
    }, {
      name: 'vcode',
      rules: {
        equalTo: 'smsCode',
        message: '请输入正确的短信验证码'
      }
    }],
    rulesC: [{
      name: 'name',
      rules: [{
        required: true,
        message: '姓名必填'
      }],
    }, {
      name: 'gender',
      rules: {
        required: true,
        message: '性别是必选项'
      },
    }, {
      name: 'guardian',
      rules: {
        required: true,
        message: '未成年人监护人是必选项'
      },
    }]
  },
  attached: function() {
    this.setData({
      riders: app.riders
    });
  },
  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function() {
      const captchaResult = app.captchaResult;
      app.captchaResult = null; // 验证码的票据为一次性票据，取完需要置空
      if (captchaResult && captchaResult.ret === 0) {
        // 将验证码的结果返回至服务端校验
        this.setData({
          [`formAData.ticket`]: captchaResult.ticket,
          [`formAData.randstr`]: captchaResult.randstr
        });
        //验证手机号
        this.sendSMS(this.data.formAData.mobile)
        console.log('captcha ticket is:' + captchaResult.ticket)
        console.log('captcha randstr is:' + captchaResult.randstr)
      }
    }
  },
  methods: {
    checkPhoneNumber: function() {
      this.selectComponent('#form').validateField('mobile', (isValid, errors) => {
        console.log('isValid', isValid, errors)
        if (!isValid) {
          this.setData({
            error: errors.message
          })
        } else {
          //验证是否为人类操作
          this.captchaCheck()
          //This is for test.
          //this.sendSMS(this.data.formAData.mobile)
        }
      })
    },
    captchaCheck: function() {
      //跳转到滑块验证小程序，完成后调用pageLifetimes的show函数为formAData填充验证字符。
      console.log('start to call captacha 小程序')
      wx.navigateToMiniProgram({
        appId: 'wx5a3a7366fd07e119',
        path: '/pages/captcha/index',
        extraData: {
          appId: '2065811563' //您申请的验证码的 appId
        }
      })
    },
    sendSMS: function(mobile) {
      wx.cloud.callFunction({
        name: 'sendsms',
        data: {
          mobile: mobile,
          nationcode: '86'
        },
        success: res => {
          console.log('[云函数] [sendsms] 调用成功')
          console.log(res)
          var result = res.result
          this.setData({
            [`formAData.smsCode`]: result.code.toString(),
            isMobileEditable: false
          });
        },
        fail: err => {
          console.error('[云函数] [sendsms] 调用失败', err)
        }
      })
    },
    toTCaptcha: function() {
      this.checkPhoneNumber()
    },
    isAdultChange: function(e) {
      console.log('isAdult发生change事件，携带value值为：', e.detail.value);
      var isAdult = e.detail.value;
      this.setData({
        isAdult: !isAdult,
      });
    },
    guardianChange: function(e) {
      var guardianItems = this.data.riders;
      for (var i = 0, len = guardianItems.length; i < len; ++i) {
        guardianItems[i].checked = guardianItems[i]._id == e.detail.value;
      }

      this.setData({
        riders: guardianItems,
        [`formCData.guardian`]: e.detail.value,
      });
    },
    genderChange: function(e) {
      var genderItems = this.data.genderItems;
      for (var i = 0, len = genderItems.length; i < len; ++i) {
        genderItems[i].checked = genderItems[i].value == e.detail.value;
      }

      this.setData({
        genderItems: genderItems,
        [`formCData.gender`]: e.detail.value,
        [`formAData.gender`]: e.detail.value
      });
    },
    inputAChange(e) {
      const {
        field
      } = e.currentTarget.dataset
      this.setData({
        [`formAData.${field}`]: e.detail.value
      })
    },
    inputCChange(e) {
      const {
        field
      } = e.currentTarget.dataset
      this.setData({
        [`formCData.${field}`]: e.detail.value
      })
    },
    bindAgreeChange: function(e) {
      this.setData({
        isAgree: !!e.detail.value.length
      });
    },
    submitForm() {
      this.checkAndSubmit()
    },
    checkAndSubmit() {
      if (this.isAdult) {
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
      } else {
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
      }
    },
    postData() {
      var formData = {}
      if (this.data.isAdult) {
        formData = this.data.formAData
      } else {
        formData = this.data.formCData
      }
      wx.cloud.callFunction({
        name: 'addRider',
        data: formData,
        success: res => {
          console.log('[云函数][addRider] 调用成功：' + res)
          this.setData({
            result: res.result,
            isSuccess: true
          })
          wx.cloud.callFunction({
            name: 'getRiders',
            data: {
              isTakingBus: true
            },
            success: res => {
              app.riders = res.result.riders.data
              this.setData({
                riders: app.riders
              });
            },
            fail: err => {
              console.error('[云函数] [getRiders] 调用失败：', err)
            }
          })
        },
        fail: err => {
          console.error('[云函数] [addRider] 调用失败：', err)
        }
      })
    },
    backToHome() {
      wx.navigateTo({
        url: '../index/index'
      })
    }
  }
});