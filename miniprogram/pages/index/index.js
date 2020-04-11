const app = getApp()

Page({
  data: {
    list: [{
        id: 'info',
        name: '个人信息',
        open: false,
        pages: [{
          title: '登记个人信息',
          name: 'register'
        }]
      },
      {
        id: 'takebus',
        name: '乘车',
        open: false,
        pages: [{
          title: '登记体温',
          name: 'takeBusRecord'
        }]
      }
    ]
  },
  kindToggle: function(e) {
    var id = e.currentTarget.id,
      list = this.data.list;
    for (var i = 0, len = list.length; i < len; ++i) {
      if (list[i].id == id) {
        list[i].open = !list[i].open
      } else {
        list[i].open = false
      }
    }
    this.setData({
      list: list
    });
  },
  showHidenFunction: function(e) {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              app.userInfo = res.userInfo
            }
          })
        }
      }
    })
  }
});

/*
//index.js
const app = getApp()

Page({
  data: {
    loading: false,
    color: '#000',
    background: '#f8f8f8',
    show: true,
    animated: false
  },

  onLoad: function() {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })
  },
  toggleLoading() {
    this.setData({
      loading: !this.data.loading
    })
  },
  changeColor() {
    this.setData({
      color: '#07C160'
    })
  },
  changeBgColor() {
    this.setData({
      background: '#ededed'
    })
  },
  toggleShow() {
    this.setData({
      show: !this.data.show
    })
  },
  toggleAnimated() {
    this.setData({
      animated: !this.data.animated,
      show: !this.data.show
    })
  }
})
*/