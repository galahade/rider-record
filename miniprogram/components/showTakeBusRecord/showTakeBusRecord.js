// components/showTakeBusRecord/showTakeBusRecord.js
const moment = require('../../miniprogram_npm/moment/index.js');

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    rider: Object,
    isFever: Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {
    tempClass: 'normalTemp',
    isAdult: true,
    phoneText: '您的手机',
    idcardText: '身份证号',
    titleTime: '',
    contentTime: ''
  },
  attached: function() {
    this.shaveData()
    
  },
  /**
   * 组件的方法列表
   */
  methods: {
    shaveData(data,format) {
      this.setData({
        titleTime: moment(this.properties.rider.testTime).format("YYYY年MM月DD日 hh:mm"),
        contentTime: moment(this.properties.rider.testTime).format("YYYY-MM-DD hh:mm:ss")
      })
      if (this.data.isFever) {
        this.setData({
          tempClass: 'highTemp'
        })
      }
      if (!this.properties.rider.isAdult) {
        this.setData({
          phoneText: '监护人手机',
          idcardText: '监护人身份证'
        })
      }
    }
  }
})