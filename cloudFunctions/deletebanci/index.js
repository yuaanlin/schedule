// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init();
const db = cloud.database();
const banciform = db.collection("bancis");
const infoform = db.collection("infos");
const newinfoform = db.collection("newinfos");

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { classid } = event
  try {
    let banci = await banciform.doc(classid).remove()
    let info = await infoform
      .where({
        classid:classid
      })
      .remove();
    let newinfo = await newinfoform
      .where({
        classid:classid
      })
      .remove();
    return {
      code: 200,
      banci:banci,
      info:info,
      newinfo:newinfo
    }
  }
  catch (e) {
    return {
      code: 500,
      error: e
    }
  }

}