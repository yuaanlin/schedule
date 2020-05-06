// 云函数入口文件
const cloud = require("wx-server-sdk");
cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();
const scheCollection = db.collection("schedules");
const banciCollection = db.collection("bancis");

// 云函数入口函数
exports.main = async event => {
    const wxContext = cloud.getWXContext();
    const open_id = wxContext.OPENID;
    const { _id, ownerID, title, attenders, bancis, description, tag, startact, endact } = event;
    var newbanci = [];
    var tmp;
    try {
        var newsche = {
            ownerID: ownerID,
            title: title,
            description: description,
            tag: tag,
            attenders: attenders,
            bancis: bancis,
            startact: new Date(startact),
            endact: new Date(endact)
        };
        return await scheCollection
            .doc(_id)
            .update({ data: newsche })
            .then(() => ({
                code: 200,
                schedule: {
                    _id: _id,
                    ...newsche
                }
            }));
    } catch (e) {
        console.error(e);
        return {
            code: 500,
            message: "服务器错误"
        };
    }
};
