// 云函数入口文件
const cloud = require("wx-server-sdk");
cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();
const infoCollection = db.collection("infos");

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext();
    const { newtag, userid, scheid } = event;
    try {
        console.log(userid,scheid)
        await infoCollection
            .where({
                userid: userid,
                scheid: scheid
            })
            .update({
                data: {
                    tag: newtag
                }
            });
        var info = await infoCollection
            .where({
                userid: userid,
                scheid: scheid
            })
            .get();
          console.log(info)
        return {
            code: 200,
            data: {
                newtag: newtag,
                info: info.data
            }
        };
    } catch (e) {
        return {
            code: 500,
            message: e
        };
    }
};
