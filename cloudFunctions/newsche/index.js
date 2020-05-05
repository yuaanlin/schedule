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
    const { title, description, tag, startact, endact, bancis } = event;
    var newbanci=[];
    var tmp;
    try {
        var newsche = {
            _id: generateUUID(),
            ownerID: open_id,
            title: title,
            description: description,
            tag: tag,
            attenders: [],
            bancis: [],
            startact: new Date(startact),
            endact: new Date(endact)
        };

        bancis.map(async banci => {
            var banciID = generateUUID();
            newsche.bancis.push(banciID);
            tmp = {
              _id: banciID,
              scheid: newsche._id,
              count: banci.count,
              startTime: new Date(banci.startTime),
              endTime: new Date(banci.endTime)
            }
            newbanci.push(tmp)
            await banciCollection.add({
                data: tmp
            });
        });
        return await scheCollection.add({ data: newsche }).then(() => ({
            code: 200,
            schedule: newsche,
            banci:newbanci
        }));
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
