// 云函数入口文件
const cloud = require("wx-server-sdk");
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();
const banciCollection = db.collection("bancis");


// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const {_id , tips} = event
  console.log(tips)
  try{
    await banciCollection.doc(_id)
      .update({
        data: {
          tips: tips
        }
      })
    var newban = await banciCollection.doc(_id).get()
    console.log(newban)
    return {
      code:200,
      newban: newban.data
    }
  } catch (e) {
    return {
      code: 500,
      message: e
    };
  }
}