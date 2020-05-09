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
        let inform;
        let i, j;
        const wxContext = cloud.getWXContext();
        const open_id = wxContext.OPENID;
        sche = await db
            .collection("schedules")
            .where({
                ownerID: open_id
            })
            .get();

        inform = await db
            .collection("infos")
            .where({
                userid: open_id
            })
            .get();
        for (i = 0; i < sche.data.length; i++) {
            for (j = 0; j < sche.data[i].bancis.length; j++) {
                tmp = await db
                    .collection("bancis")
                    .where({
                        _id: sche.data[i].bancis[j]
                    })
                    .get();
                ban.push(tmp);
            }
        }
        tmp = ban;
        ban = [];
        for (i = 0; i < tmp.length; i++) ban = ban.concat(tmp[i].data);
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
                sche.push(tmp.data[0]);
            }
        }
        info = info.list;
        return {
            code: 200,
            schedules: sche,
            infos: inform.data,
            bancis: ban
        };
    } catch (e) {
        return {
            code: 500,
            msg: e
        };
    }
};
