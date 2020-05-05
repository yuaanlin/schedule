// 云函数入口文件
const cloud = require("wx-server-sdk");
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();
const infoCollection = db.collection("infos");

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const {classid,tag} = event
  try {
    var newinfo = {
      userid:wxContext.OPENID,
      classid:classid,
      tag:tag,
      tendency:true
    }
    await infoCollection.add({
      data: newinfo
    }).then(res=>{
      return {
        code:200,
        data:{
          userid: wxContext.OPENID,
          classid: classid,
          tag: tag,
          tendency: true,
        }
      }
    })
  }catch (e) {
    return {
      code: 500,
      msg: e
    }
  };
};