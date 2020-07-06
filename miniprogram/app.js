//app.js
App({
  onLaunch: function() {

    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
      wx.navigateTo({
        url: '/pages/chooseLib/chooseLib'
      })
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',rider-record-test-03yw6
        // 测试环境id：rider-record-test-03yw6
        // 正式环境id：rider-recorder-2020-02-19
        env: 'rider-record-test-03yw6',
        traceUser: true,
      })
      this.globalData = {}
     // this.checkRegister()
    }
    
  },
  onShow: function(options) {
    this.captchaCallBack(options)
  },
  globalData: {
    userInfo: null,
    captchaResult: null,
    captchaTicketExpire: null,
    riders: []
  },
  captchaCallBack(options) {
    // 解决各类回调的兼容问题
    if (!this.captchaTicketExpire) this.captchaTicketExpire = {};
    if (options.scene === 1038 && options.referrerInfo.appId === 'wx5a3a7366fd07e119') {
      const result = options.referrerInfo.extraData;
      console.log('app onShow captcha result is:' + result)
      if (result.ret === 0) {
        const ticket = result.ticket;
        console.log('app onShow captcha ticket  is:' + ticket)
        if (!this.captchaTicketExpire[ticket]) {
          this.captchaResult = result;
          this.captchaTicketExpire[ticket] = true;
          console.log('app onShow global captchaResult  is:' + this.captchaResult)
        }
      } else {
        // 用户关闭了验证码
      }
    }
  },
  checkRegister() {
    //如果没有登记个人信息，跳转到登记页。
    if (this.riders == null || this.riders.length == 0 ) {
      wx.cloud.callFunction({
        name: 'getRiders',
        data: {
          isTakingBus: true
        },
        success: res => {
          this.riders = res.result.riders.data
          console.log("云函数 getRiders 返回成功")
          console.log("global riders is :" + this.riders)
          if (this.riders.length == 0) {
            wx.redirectTo({
              url: '/pages/register/register'
            }) // 如果是 tabbar 页面，请使用 wx.switchTab
          }
        },
        fail: err => {
          console.error('[云函数] [sum] 调用失败：', err)
        }
      })
    }
  }
})