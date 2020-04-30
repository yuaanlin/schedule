/**
 * 班表 Schedule
 *
 * 对应数据库的 schedules 集合 */
export default class Schedule {
    _id: string;
    ownerID: string;
    title: string;
    description: string;
    tag: string;
    attenders: Array<string>;
    bancis: Array<string>;
    startact: Date;
    endact: Date;
}
