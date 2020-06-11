// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init();
const db = cloud.database();
const scheduleform = db.collection("schedules");
const newinfoform = db.collection("newinfos");
const banciform = db.collection("bancis")
const infoform = db.collection("infos")
const userCollection = db.collection("users")
// const $ = db.command.aggregate()
// 云函数入口函数
exports.main = async event => {
    try {
        let b;

        let newinfo;
        const wxContext = cloud.getWXContext();
        const { scheid } = event;

        b = await scheduleform.doc(scheid).get();

        b=b.data
        newinfo = await newinfoform
            .where({
                scheid: b._id
            })
            .get();
        console.log(infoform)
        info = await infoform
          .where({
            scheid: b._id
          })
          .get();
        console.log(banciform)
        banci = await banciform
          .where({
            scheid: b._id
          })
          .get();
        console.log(newinfo)
        console.log(info)
        console.log(banci)
        
        return {
            code: 200,
            schedule: b,
            banci: banci.data,
            info: info.data,
            newinfo: newinfo.data
        };
    } catch (e) {
        return { code: 500, msg: e };
    }
};
