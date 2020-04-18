import User from "./user";

/** 班表上的特定班次 */
export default class Banci {
    // 班次 id
    id: string;

    // 需要排几人
    count: number;

    // 班次开始时间
    startTime: Date;

    // 班次截止时间
    endTime: Date;

    // 该班次的参加者
    attenders: Array<User>;

    constructor(banci: Banci = defaultBanci) {
        this.id = banci.id;
        this.count = banci.count;
        this.startTime = banci.startTime;
        this.endTime = banci.endTime;
        this.attenders = banci.attenders;
    }
}

const defaultBanci = {
    id: "",
    count: 0,
    startTime: new Date(),
    endTime: new Date(),
    attenders: []
};
