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
  const {newtag,userid,scheid} = event
try{
  await infoCollection.where({
    userid: userid,
    scheid: scheid
  })
    .update({
      data: {
        tag: newtag
      }
    })
  console.log(userid)
  var info = await infoCollection
    .where({
      userid: userid,
      scheid: scheid
    })
    .get()
  console.log(info)
  return {
    code: 200,
    newtag,
    info:info.data
  }
}catch(e){
  console.log(e)
  return{
    code:500,
    message:"更新失败"
  }

}
  
}