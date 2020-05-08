// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init();
const db = cloud.database();
const infoform = db.collection("infos");

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const {infoid} = event
  try{
    let result = await infoform.doc(infoid).remove()
    return {
      code: 200,
      result
    }
  }
  catch(e){
    return {
      code: 500,
      error: e
    }
  }

}