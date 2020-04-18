// Todo: 用户类别还需要存哪些信息？

/** 用户 */
export default class User {
    // 用户的唯一识别码
    id: string;

    // 姓名
    name: string;

    // 性别
    gender: string;

    // 加入的班表 & 对应班表的个人信息
    info: Array<info>;

    // 创建的班表 ID
    ownSchedules: Array<String>;

    constructor(user: User = defaultUser) {
        this.id = user.id;
        this.gender = user.gender;
        this.name = user.name;
        this.info = user.info;
        this.ownSchedules = user.ownSchedules;
    }
}

const defaultUser = {
    id: "",
    name: "",
    gender: "female",
    info: [],
    ownSchedules: []
};

/** 一个 “用户” 针对特定 “班表” 的数据 */
export interface info {
    // 班表 ID
    scheduleID: string;

    // 填写的信息
    info: [{ key: string; value: string }];

    // 希望的班次 id
    wantBanci: Array<string>;

    // 不希望的班次 id
    notWantBanci: Array<string>;

    // 目前排上的班次 id
    banci: Array<String>;
}

/** Info 的举例说明
 *
 * 比如说我创立一个志愿者班表（id: abc123) ，我要求加入班表的人填写 “学号” 和 “学园”
 * 那加入的人就会有一个 info 是
 *
 * {
 *  scheduleID: "abc123",
 *  info: [
 *      {
 *          key: "学号",
 *          value: "3190106167"
 *      },
 *      {
 *          key: "学园",
 *          value: "云峰学园"
 *      }
 *  ],
 *  wantBanci: ["a1", "a3", "b2"].
 *  notWantBanci: ["a2"],
 *  banci: []
 * }
 *
 * 这样查看班表参加者信息的时候就可以调用
 *
 */
