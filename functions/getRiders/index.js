// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
  traceUser: true,
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  const openid = wxContext.OPENID
  var riders = null
  const {
    ENV,
  } = cloud.getWXContext()
  console.log("getRiders evn is :"+ ENV)
  if (event.isTakingBus) {
    riders = await db.collection('rider').where({
      openid: openid
    }).get()
  } else {
    riders = await db.collection('rider').where({
      openid: openid,
      'personInfo.isAdult': true
    }).get()
  }
  return {
    riders
  }
}