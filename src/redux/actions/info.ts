import info from "src/classes/info";
import { UPDATE_INFO } from "../constants/info";

interface updateInfo {
    type: typeof UPDATE_INFO;
    data: info;
}

/** 对 Redux 中 info 数据的 Actions */
export type InfoActions = updateInfo;

/** 将新的 Info 存入 Redux （或是覆写原有的 Info) */
export function updateInfo(data: info): updateInfo {
    return { type: UPDATE_INFO, data: data };
}
