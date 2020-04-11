// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
  traceUser: true,
})

// 云函数入口函数
exports.main = async(event, context) => new Promise((resolve, reject) => {
  //获取默认环境数据库
  const db = cloud.database()
  const wxContext = cloud.getWXContext()
  var data = {}
  data.openid = wxContext.OPENID
  data.date = new Date()
  data.personInfo = event
  console.log(data)
  //add rider to db
  db.collection('rider').add({
    data: data
  }).then(result => {
    resolve(data.personInfo.name)
  }).catch(reason => {
    console.err("addRider to db fail:" + reason)
    reject(reason)
  })

})