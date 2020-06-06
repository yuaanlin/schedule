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
    const wxContext = cloud.getWXContext();
    const { scheid } = event;
    try {
        let sche = await scheduleform.doc(scheid).remove();
        let ban = await banciform
            .where({
                scheid: scheid
            })
            .remove();
        let info = await infoform
            .where({
                scheid: scheid
            })
            .remove();
        let newinfo = await newinfoform
            .where({
                scheid: scheid
            })
            .remove();
        return {
            code: 200,
            sche,
            ban,
            info,
            newinfo
        };
    } catch (e) {
        return {
            code: 500,
            error: e
        };
    }
};
