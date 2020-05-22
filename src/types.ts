import Banci from "src/classes/banci";
import info from "./classes/info";
import Schedule from "./classes/schedule";
import User from "./classes/user";

/** 云函数 "Login" 的返回格式 */
export interface loginResult {
    errMsg: string;
    requestID: string;
    result: {
        /** 回应代码 */
        code: number;

        /** 用户数据 */
        user: User;
    };
}

/** 云函数 "getPersche" 的返回格式 */
export interface getPerscheResult {
    errMsg: string;
    requestID: string;
    result: {
        code: number;
        schedules: Array<Schedule>;
        infos: Array<info>;
        bancis: Array<Banci>;
    };
}

/** 云函数 "postUserInfo" 的返回格式 */
export interface postUserInfoResult {
    errMsg: string;
    requestID: string;
    result: {
        /** 回应代码 */
        code: number;

        /** 用户数据 */
        data: User;
    };
}

/** 云函数 "newsche" 的返回格式 */
export interface newscheResult {
    errMsg: string;
    requestID: string;
    result: {
        /** 回应代码 */
        code: number;

        /** 创立成功的数据 */
        schedule: Schedule;
        banci: Array<Banci>;
    };
}

export interface updatescheResult {
    errMsg: string;
    requestID: string;
    result: {
        /** 回应代码 */
        code: number;

        /** 创立成功的数据 */
        schedule: Schedule;
    };
}

export interface arrangescheResult{
  errMsg: string;
  requestID: string;
  result:{
    code:number;
    leftban:Array<Banci>;
    leftman: Array<User>;
    infos: Array<info>;
  }
}

export interface deleteinfoResult{
  errMsg: string;
  requestID: string;
  result: {
    code: number;
  }
}
