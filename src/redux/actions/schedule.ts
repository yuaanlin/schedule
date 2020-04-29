import Schedule from "src/classes/schedule";
import { UPDATE_SCHEDULE } from "../constants/schedule";
import { FILTER_SCHEDULE } from "../constants/schedule"

interface updateSchedule {
    type: typeof UPDATE_SCHEDULE;
    data: Schedule;
}
interface filterSchedule{
  type: typeof FILTER_SCHEDULE;
  data:string
}

/** 对 Redux 中操作 Schedule 数据的 Actions */
export type ScheduleDataActions = updateSchedule;
export type filterDataAction = filterSchedule;

/** 将新的 Schedule 存入 Redux （或是覆写原有的 Schedule) */
export function updateSchedule(data: Array<Schedule>) {
    return { type: UPDATE_SCHEDULE, data: data };
}
export function filterSchedule(data: string)  {
  return { type:FILTER_SCHEDULE, data: data}
}
