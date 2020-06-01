import newinfo from "src/classes/newinfo";
import { UPDATE_NEWINFO } from "../constants/newinfo";

interface updatenewInfo {
    type: typeof UPDATE_NEWINFO;
    data: newinfo;
}

// interface deleteInfo {
//     type: typeof DELETE_INFO;
//     data: string;
// }

/** 对 Redux 中 info 数据的 Actions */
export type NewinfoActions = updatenewInfo ;

/** 将新的 newInfo 存入 Redux （或是覆写原有的 newInfo) */
export function updatenewInfo(data: newinfo): updatenewInfo {
  console.log(data)
    return { type: UPDATE_NEWINFO, data: data };
}

/** 从 Redux 删除 Info */
// export function deleteInfo(data: string): deleteInfo {
//     return { type: DELETE_INFO, data: data };
// }
