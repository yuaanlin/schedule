// 云函数入口文件
const cloud = require("wx-server-sdk");
cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();
const scheCollection = db.collection("Schedules");
const banciCollection = db.collection("Banci");

// 云函数入口函数
exports.main = async event => {
    const wxContext = cloud.getWXContext();
    const open_id = wxContext.OPENID;
    const { title, description, count, enddate, repeattype, endact, startact, startdate, bancistart, banciend } = event;
    try {
        var newsche = {
            _id: generateUUID(),
            title: title,
            description: description,
            ownerID: open_id,
            identity: identity,
            attenders: []
        };
        await scheCollection.add(newsche);
        await banciCollection.add({
            data: {
                scheid: newsche._id,
                count: count,
                enddate: enddate,
                startdate: startdate,
                endact: endact,
                startact: startact,
                banciend: banciend,
                bancistart: bancistart,
                repeattype: repeattype
            }
        });
        return {
            title,
            description,
            count,
            enddate,
            repeattype,
            endact,
            startact,
            startdate,
            bancistart,
            banciend
        };
    } catch (e) {
        console.error(e);
        return {
            code: 500,
            message: "服务器错误"
        };
    }
};

function generateUUID() {
    var d = Date.now();
    if (typeof performance !== "undefined" && typeof performance.now === "function") {
        d += performance.now();
    }
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
}
