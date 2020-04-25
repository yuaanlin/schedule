// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database();
const scheCollection = db.collection("Schedules");
const banciCollection=db.collection("Banci")


// 云函数入口函数
exports.main = async event => {
  const wxContext = cloud.getWXContext()
  console.log("??")
  const { title, description,count,enddate,repeattype,endact,startact,startdate,bancistart,banciend } = event;
  console.log('event', event);
  try{
    await scheCollection.add({
      data: {
        title: title,
        description:description,
        // identity:identity
      },
    })
    await banciCollection.add({
      data:{
        count:count,
        enddate:enddate,
        startdate:startdate,
        endact:endact,
        startact:startact,
        // scheid:scheid,
        banciend:banciend,
        bancistart: bancistart,
        repeattype:repeattype
      }
    })
    console.log("??")
    return {
      title, description, count, enddate, repeattype, endact, startact, startdate, bancistart, banciend} 
  } catch (e) {
    console.error(e)
    return {
      code: 500,
      message: '服务器错误',
    }
  }
}