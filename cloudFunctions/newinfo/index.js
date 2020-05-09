// 云函数入口文件
const cloud = require("wx-server-sdk");
cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();
const infoCollection = db.collection("infos");
const banciCollection = db.collection("bancis");
const scheduleCollection = db.collection("schedules");

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext();
    const { classid, tag } = event;
    const scheid = await banciCollection
        .doc(classid)
        .get()
        .then(res => res.data.scheid);
    const sche = await scheduleCollection
        .doc(scheid)
        .get()
        .then(res => res.data);
    try {
        var newinfo = {
            userid: wxContext.OPENID,
            classid: classid,
            scheid: scheid,
            tag: tag,
            tendency: true
        };
        await infoCollection.add({
            data: newinfo
        });

        if (!sche.attenders.includes(wxContext.OPENID)) {
            var newsche = {};
            Object.assign(newsche, sche);
            newsche.attenders.push(wxContext.OPENID);
            delete newsche._id;
            scheduleCollection.doc(scheid).update({ data: newsche });
        }

        return {
            code: 200,
            data: newinfo
        };
    } catch (e) {
        return {
            code: 500,
            msg: e
        };
    }
};
