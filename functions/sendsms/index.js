// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
  traceUser: true,
})
const QcloudSms = require("qcloudsms_js")

const appid = 1400320230 // 替换成您申请的云短信 AppID 以及 AppKey
const appkey = "43ebf17183a6813ef2772a567c800635"
const templateId = 540973 // 替换成您所申请模板 ID
const smsSign = "黄骅公交" // 替换成您所申请的签名

// 云函数入口函数
exports.main = async (event, context) => new Promise((resolve, reject) => {
  /*单发短信示例为完整示例，更多功能请直接替换以下代码*/
  var qcloudsms = QcloudSms(appid, appkey);
  var ssender = qcloudsms.SmsSingleSender();

  var params = [];
  var mCode = getRandom()
  params.push(mCode)
  console.log("Random messageCode is:" + mCode)

  // 获取发送短信的手机号码
  var mobile = event.mobile
  // 获取手机号国家/地区码
  var nationcode = event.nationcode
  console.log("start to call sms server")
  ssender.sendWithParam(nationcode, mobile, templateId, params, smsSign, "", "", (err, res, resData) => {
    /*设置请求回调处理, 这里只是演示，您需要自定义相应处理逻辑*/
    console.log("sms server return")
    if (err) {
      console.log("err: ", err);
      reject({ err })
    } else {
      var result = {}
      result.code = mCode
      result.mobile = res.req.body.tel.mobile
      result.time = res.req.body.time
      resolve(result)
    }
  }
  );
  console.log("end to call sms server")
})

function getRandom() {
  return Math.round(Math.random() * 99999);
}