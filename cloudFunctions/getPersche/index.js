// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init();
const db = cloud.database();
const scheduleform = db.collection("schedules");
// 云函数入口函数
exports.main = async (event, context) => {
    try {
        let sche;
        let sche_ban;
        let tmp;
        let ban = [];
        let info;
        let i;
        const wxContext = cloud.getWXContext();
        const open_id = wxContext.OPENID;
        sche = await db
            .collection("schedules")
            .where({
                ownerID: open_id
            })
            .get();
        await db
            .collection("infos")
            .aggregate()
            .match({
                userid: open_id
            })
            .lookup({
                from: "bancis",
                localField: "classid",
                foreignField: "_id",
                as: "bancilist"
            })
            .end()
            .then(res => {
                info = res;
            })
            .catch(err => console.error(err));
        sche = sche.data;
        for (i = 0; i < info.list.length; i++) {
            ban = ban.concat(info.list[i].bancilist);
        }
        for (i = 0; i < ban.length; i++) {
            const [scheinfo] = sche.filter(v => v._id === ban[i].scheid);
            if (!scheinfo) {
                tmp = await scheduleform
                    .where({
                        _id: ban[i].scheid
                    })
                    .get();
                sche.push(tmp);
            }
        }
        info = info.list;
        return {
            code: 200,
            schedules: sche,
            infos: info
        };
    } catch (e) {
        return {
            code: 500,
            msg: e
        };
    }
};
