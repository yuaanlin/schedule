// 云函数入口文件
const cloud = require("wx-server-sdk");
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

const scheCollection = db.collection("schedules")

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const {schedule} = event
  try{
    await scheCollection.doc(schedule._id)
      .update({
        data: {
          complete: true
        }
      })

    return {
      code: 200,
      schedule: schedule
    }
  } catch (e) {
    return {
      code: 500,
      msg: e
    };
  }
}