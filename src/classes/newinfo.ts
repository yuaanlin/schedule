/** info完成排班之后生成 newinfo
 *
 * 对应数据库的 newinfo 集合 */
export default class newinfo {
  _id: string;
  userid: string;
  classid: string;
  scheid: string;
  tag: string;
  tendency: string;

  constructor(data: newinfo) {
      this._id = data._id;
      this.userid = data.userid;
      this.classid = data.classid;
      this.scheid = data.scheid;
      this.tag = data.tag;
      this.tendency = data.tendency;
      this.scheid = data.scheid;
  }
}
