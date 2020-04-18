import { combineReducers } from "redux";
import userData from "./userData";
import scheduleData from "./scheduleData";

export default combineReducers({
    userData,
    scheduleData
});
