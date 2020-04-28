import User from "./user";
import Banci from "./banci";

/**
 * 班表 Schedule
 *
 * 对应数据库的 schedules 集合 */
export default class Schedule {
    // 班表 id
    id: string;

    /** 创建者的唯一识别码 */
    ownerID: string;

    /** 班表标题 */
    title: string;

    /** 班表说明 */
    description: string;

    /** 所有参加者 */
    attenders: Array<User>;

    /** 需要排班的班次 */
    banci: Array<Banci>;
}
