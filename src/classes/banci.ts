/**
 * 班次 Banci
 *
 * 对应数据库的 Banci 集合 */
export default class Banci {
    // 班次 id
    _id: string;

    // 对应班表
    scheid: string;

    // 需要人数
    count: number;

    // 班次开始时间
    startTime: Date;

    // 班次结束时间
    endTime: Date;

    //班次内tips
    tips: Array<string>;

    constructor(banci: Banci = defaultBanci) {
        this._id = banci._id;
        this.count = banci.count;
        this.scheid = banci.scheid;
        this.startTime = new Date(banci.startTime);
        this.endTime = new Date(banci.endTime);
        this.tips = banci.tips;
    }
}

const defaultBanci = {
    _id: "",
    scheid: "",
    count: 0,
    startTime: new Date(),
    endTime: new Date(),
    tips: [],
};
