// 云函数入口文件
const cloud = require("wx-server-sdk");
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

const suggestCollection = db.collection("suggests");

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const {suggest,files,contact} = event

  try{
    var newsuggest = {
      suggest:suggest,
      files:files,
      contact:contact
    }
    await suggestCollection.add({
      data:newsuggest
    })
    return {
      code:200
    } 
  }
  catch(e){
    return{
      code:500,
      messsage:e
    }
  }
}