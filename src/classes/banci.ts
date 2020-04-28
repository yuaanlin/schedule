/**
 * 班次 Banci
 *
 * 对应数据库的 Banci 集合 */
export default class Banci {
    // 班次 id
    id: string;

    // 对应班表
    scheid: string;

    // 需要人数
    count: number;

    // 班次开始时间
    startTime: Date;

    // 班次结束时间
    endTime: Date;

    constructor(banci: Banci = defaultBanci) {
        this.id = banci.id;
        this.count = banci.count;
        this.scheid = banci.scheid;
        this.startTime = banci.startTime;
        this.endTime = banci.endTime;
    }
}

const defaultBanci = {
    id: "",
    scheid: "",
    count: 0,
    startTime: new Date(),
    endTime: new Date()
};
