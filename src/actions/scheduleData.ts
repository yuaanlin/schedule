import { SET_SCHEDULE_DATA } from "../constants/scheduleData";
import Schedule from "src/classes/schedule";

interface setScheduleData {
    type: typeof SET_SCHEDULE_DATA;
    scheduleData: Schedule;
}

export type ScheduleDataActions = setScheduleData;
