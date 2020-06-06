// 云函数入口文件
const cloud = require("wx-server-sdk");
cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();
const banciCollection = db.collection("bancis");

// 云函数入口函数
exports.main = async event => {
    const wxContext = cloud.getWXContext();
    const open_id = wxContext.OPENID;
    const { _id, scheid, count, startTime, endTime } = event;
    try {
        var newbanci = {
            _id: _id,
            scheid: scheid,
            count: count,
            startTime: new Date(startTime),
            endTime: new Date(endTime)
        };
        return await banciCollection.update({ data: newbanci }).then(() => ({
            code: 200,
            schedule: newsche
        }));
    } catch (e) {
        return {
            code: 500,
            message: e
        };
    }
};
