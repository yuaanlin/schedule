const cloud = require("wx-server-sdk");
cloud.init();
const db = cloud.database();
const userCollection = db.collection("User");

exports.main = async event => {
    const { OPENID } = cloud.getWXContext();
    const { name, gender, avatarUrl } = event;

    try {
        const [userRecord] = (
            await userCollection
                .where({
                    _id: OPENID
                })
                .get()
        ).data;

        if (!userRecord) {
            // 无记录，加记录
            console.log(e)
            await userCollection.add({
                data: {
                    _id: OPENID,
                    createdTime: db.serverDate(),
                    name,
                    gender,
                    avatarUrl
                }
            });
        } else {
            // 有记录，更新记录
            await userCollection.doc(userRecord._id).update({
                data: {
                    name,
                    gender,
                    avatarUrl
                }
            });
        }
        return {
            code: 200,
            data: {
                openId: OPENID,
                name,
                gender,
                avatarUrl
            }
        };
    } catch (e) {
        console.log(e);
        return {
            code: 500,
            message: "服务器错误"
        };
    }
};
