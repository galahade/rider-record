// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
  traceUser: true,
})
const wxContext = cloud.getWXContext()
//获取默认环境数据库
const db = cloud.database()

// 云函数入口函数
exports.main = async(event, context) => {

  //获取提交人信息
  const openid = wxContext.OPENID
  var rider = null
  var data = {}
  var riderRecord = null
  now = new Date()
  data.openid = wxContext.OPENID
  data.date = now
  data.rider_id = event.rider
  data.temperature = event.temperature
  data.license = event.license
  console.log(data)

  var response = await db.collection('takeBusRecord').add({
    data: data
  }).then(async res => {
    riderRecord = await getRecordResult(event.rider, data)
  })
  return riderRecord
  
}

async function getRecordResult(id, record) {
  console.log("Start to get bus record")
  var riderRecord = {}
  await db.collection('rider').doc(id)
    .get().then(async res => {
      console.log("get rider response is :" + res)
      var rider = res.data.personInfo
      console.log("rider response is :" + rider)
      riderRecord.name = rider.name
      riderRecord.temperature = record.temperature
      riderRecord.testTime = record.date
      riderRecord.isAdult = rider.isAdult
      riderRecord.license = record.license
      if (rider.isAdult) {
        riderRecord.phone = rider.mobile
        riderRecord.idcard = rider.idcard
      } else {
        await db.collection('rider').doc(rider.guardian)
        .get().then(resp => {
          var guardian = resp.data.personInfo
          riderRecord.phone = guardian.mobile
          riderRecord.idcard = guardian.idcard
        })
      }
      if (rider.gender == 1) {
        riderRecord.gender = '男'
      } else {
        riderRecord.gender = '女'
      }
    })
  console.log("riderRecord result is:" + riderRecord)
  return riderRecord
}