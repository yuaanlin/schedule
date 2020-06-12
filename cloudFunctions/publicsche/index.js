// 云函数入口文件
const cloud = require("wx-server-sdk");
cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

const scheCollection = db.collection("schedules");
const newinfoCollection = db.collection("newinfos");
// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext();
    const { schedule, newinfo } = event;
    try {
      var result = []
        await scheCollection.doc(schedule._id).update({
            data: {
                complete: true
            }
        });
        console.log(newinfo)
        await newinfo.map(x => {
            delete x["_id"];
        });
        console.log(newinfo)
        for(var i = 0;i < newinfo.length;i++){
          await newinfoCollection.add({
            data:{
              classid: newinfo[i].classid,
              scheid: newinfo[i].scheid,
              tag: newinfo[i].tag,
              tendency: newinfo[i].tendency,
              userid: newinfo[i].userid
            }
          })
            .then(res => {
              console.log(res)
              result.push(res._id)
            })
        }
        var final = []
        for(var i = 0;i < result.length;i++){
          let tmp = await newinfoCollection.doc(result[i]).get()
          final =[ ...final,tmp.data]
        }
        
        return {
            code: 200,
            schedule: schedule,
            newinfo: final
        };
    } catch (e) {
        return {
            code: 500,
            msg: e
        };
    }
};
