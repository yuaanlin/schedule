// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init();
const db = cloud.database();
const scheduleform = db.collection("schedules");
const newinfoform = db.collection("newinfos");
const banciform = db.collection("bancis")
const infoform = db.collection("infos")
const userCollection = db.collection("users")
// 云函数入口函数
exports.main = async (event, context) => {
    try {
        var i = 0,j=0;
        const wxContext = cloud.getWXContext();
        const open_id = wxContext.OPENID;
        sche = await scheduleform
            .where({
                ownerID: open_id
            })
            .get();
        sche = sche.data

        newinfo = await newinfoform
            .where({
                userid: open_id
            })
            .get();
        newinfo = newinfo.data

        info = await infoform
            .where({
                userid: open_id
            })
            .get();
        info = info.data
        
        var ban = []
        var schedule = []
        for(;i<info.length;i++){
          let tmpban = await banciform.doc(info[i].classid).get()
          tmpban = tmpban.data
          ban = [...ban.filter(x=>x._id!=info[i].classid),tmpban]
          let tmpsche = await scheduleform.doc(info[i].scheid).get()
          tmpsche = tmpsche.data
          schedule = [...schedule.filter(x => x._id != tmpsche._id), tmpsche]
        }
        schedule = schedule.concat(sche)
        for(i = 0;i < schedule.length;i++){
          for(j=0;j < schedule[i].bancis.length;j++){
            let tmpban = await banciform.doc(schedule[i].bancis[j]).get()
            tmpban = tmpban.data
            ban = [...ban.filter(x => x._id != tmpban._id), tmpban]
          }
          let tmpinfo = await infoform.where({scheid:schedule[i]._id}).get()
          tmpinfo = tmpinfo.data
          console.log(tmpinfo)
          tmpinfo.map(y=>{
            info = [...info.filter(x => x._id != y._id), y]
          })
        }
      
        return {
            code: 200,
            schedules: schedule,
            infos: info,
            bancis: ban,
            newinfos: newinfo
        };
    } catch (e) {
        return {
            code: 500,
            msg: e
        };
    }
};
