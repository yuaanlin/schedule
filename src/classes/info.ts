/** 「用户」和「班次」的对应关系 info
 *
 * 对应数据库的 info 集合 */
export default class info {
    _id: string;
    userid: string;
    classid: string;
    scheid: string;
    tag: string;
    tendency: string;

    //班表id
    scheid:string;

    constructor(data: info) {
        this._id = data._id;
        this.userid = data.userid;
        this.classid = data.classid;
        this.scheid = data.scheid;
        this.tag = data.tag;
        this.tendency = data.tendency;
        this.scheid = data.scheid;
    }
}
