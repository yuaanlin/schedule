// // 云函数入口文件
// const cloud = require('wx-server-sdk')
// cloud.init({
//   env: cloud.DYNAMIC_CURRENT_ENV
// })
// // const db = cloud.database();
// // const userCollection = db.collection("Schedules");


// // 云函数入口函数
// exports.main = async event=> {
//   const wxContext = cloud.getWXContext()
//   console.log("!")
//   const { title, description } = event;
//   console.log('event', event);
//   return {
//     title,description
//   }
// }