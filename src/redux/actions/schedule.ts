import Schedule from "src/classes/schedule";
import { UPDATE_SCHEDULE,DELETE_SCHEDULE } from "../constants/schedule";

interface updateSchedule {
    type: typeof UPDATE_SCHEDULE;
    data: Schedule;
}

interface deleteSchedule {
  type: typeof DELETE_SCHEDULE;
  data: string;
}

/** 对 Redux 中操作 Schedule 数据的 Actions */
export type ScheduleDataActions = updateSchedule | deleteSchedule;

/** 将新的 Schedule 存入 Redux （或是覆写原有的 Schedule) */
export function updateSchedule(data: Schedule): updateSchedule {
    return { type: UPDATE_SCHEDULE, data: data };
}

/** 从redux中删去schedule */
export function deleteSchedule(data: string): deleteSchedule {
    return { type: DELETE_SCHEDULE, data: data };
}
