/** 「用户」和「班次」的对应关系 info
 *
 * 对应数据库的 info 集合 */
export default class info {
    // id
    id: string;

    // openid
    userid: string;

    // 班次 id
    classid: string;

    // 用户区分 tag
    tag: string;

    // 是否确定
    tendency: string;

    constructor(data: info) {
        this.id = data.id;
        this.userid = data.userid;
        this.classid = data.classid;
        this.tag = data.tag;
        this.tendency = data.tendency;
    }
}
