import { SET_USER_DATA } from "../constants/userData";
import User from "src/classes/user";
import { UserDataActions } from "src/actions/userData";

/** 当前用户的数据 */
export default function userData(state = new User(), action: UserDataActions) {
    switch (action.type) {
        case SET_USER_DATA:
            return action.userData;
        default:
            return state;
    }
}
