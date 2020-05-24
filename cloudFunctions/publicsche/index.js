// 云函数入口文件
const cloud = require("wx-server-sdk");
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

const scheCollection = db.collection("schedules")
const newinfoCollection = db.collection("newinfos")
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const {schedule,newinfo} = event
  try{
    await scheCollection.doc(schedule._id)
      .update({
        data: {
          complete: true
        }
      })

    // for (var m = 0; m < newinfo.length; m++) {
    //   await infoCollection.doc(newinfo[m]._id).update({
    //     data: {
    //       tendency: false
    //     }
    //   });
    // }
    await newinfo.map(x=>{
      delete (x["_id"])
    })
    console.log(newinfo)
    await newinfoCollection.add({
      data:newinfo
    });
    return {
      code: 200,
      schedule: schedule,
      newinfo:newinfo
    }
  } catch (e) {
    return {
      code: 500,
      msg: e
    };
  }
}