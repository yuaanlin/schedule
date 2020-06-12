// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init();
const db = cloud.database();
const newinfoform = db.collection("newinfos");
const scheduleform = db.collection("schedules");

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { infoid } = event
  try {
    let newinfo = await newinfoform.doc(infoid).get()
    scheid = newinfo.data.scheid
    let scheresult = await scheduleform.doc(scheid).get()
    await scheduleform.doc(scheresult.data._id)
      .update({
        data: {
          attenders: [...scheresult.data.attenders.filter(x => x != newinfo.data.userid)]
        }
      })
    let result = await newinfoform.doc(infoid).remove()
    return {
      code: 200,
      result
    }
  }
  catch (e) {
    return {
      code: 500,
      error: e
    }
  }

}