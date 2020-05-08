// 云函数入口文件
const cloud = require("wx-server-sdk");
cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();
const infoCollection = db.collection("infos");
const banciCollection = db.collection("bancis");

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext();
    const { classid, tag } = event;
    const scheid = banciCollection.doc(classid).scheid;
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
