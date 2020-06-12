// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init();
const db = cloud.database();
const infoform = db.collection("infos");
const scheduleform = db.collection("schedules");

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext();
    const { infoid } = event;
    try {
        let info = await infoform.doc(infoid).get();
        scheid = info.data.scheid;
        let scheresult = await scheduleform.doc(scheid).get();
        let result = await infoform.doc(infoid).remove();

        // 检查这个被删除的人在这张表有没有其他班次
        let his_infos = await infoform
            .where({
                scheid: scheid,
                userid: info.data.userid
            })
            .get();

        // 没有其他班次了，从 attenders 移除
        if (his_infos.data.length === 0)
            await scheduleform.doc(scheresult.data._id).update({
                data: {
                    attenders: [...scheresult.data.attenders.filter(x => x != info.data.userid)]
                }
            });

        return {
            code: 200,
            result
        };
    } catch (e) {
        return {
            code: 500,
            error: e
        };
    }
};
