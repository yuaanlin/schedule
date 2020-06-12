// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init();
const db = cloud.database();
const scheduleform = db.collection("schedules");
const banciform = db.collection("bancis");
const infoform = db.collection("infos");
const newinfoform = db.collection("newinfos");

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const {classid,attenderlist,scheid} = event
  try{
      var i = 0
      for(;i<attenderlist.length;i++){
      var target = await infoform
        .where({
          userid:attenderlist[i],
          scheid:scheid
        })
        .get()
      var addlist = []
      target = target.data[0]
      console.log(target)
      var newinfo = {
        _id: generateUUID(),
        userid: target.userid,
        classid: classid,
        scheid: target.scheid,
        tag: target.tag,
        tendency: true
      };
      addlist.push(newinfo)
      await infoform.add({
        data: newinfo
      });
      }
    return {
      code:200,
      addlist
    }
  }
  catch(e){
  return {
    code: 500,
    error: e
  };
  }
  
}
function generateUUID() {
  var d = Date.now();
  if (typeof performance !== "undefined" && typeof performance.now === "function") {
    d += performance.now();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}