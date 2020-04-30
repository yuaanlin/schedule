import Banci from "./banci";

/**
 * 班表 Schedule
 *
 * 对应数据库的 schedules 集合 */
export default class Schedule {
    // 班表 id
    _id: string;

    /** 创建者的唯一识别码 */
    ownerID: string;

    /** 班表标题 */
    title: string;

    /** 班表说明 */
    description: string;

    /** 所有参加者 id */
    attenders: Array<string>;

    /** 需要排班的班次 */
    banci: Array<Banci>;
}
