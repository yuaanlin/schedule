import Banci from "src/classes/Banci";
import { UPDATE_BANCI,DELETE_BANCI } from "../constants/banci";

interface updateBanci {
    type: typeof UPDATE_BANCI;
    data: Banci;
}

interface deleteBanci {
  type: typeof DELETE_BANCI;
  data: string;
}
/** Redux 中操作 Banci 数据的 Actions */
export type BanciActions = updateBanci|deleteBanci;

/** 将新的 Banci 存入 Redux （或是覆写原有的 Banci) */
export function updateBanci(data: Banci) {
    return { type: UPDATE_BANCI, data: data };
}

export function deleteBanci(data:string) {
    return { type: DELETE_BANCI, data: data }
}
