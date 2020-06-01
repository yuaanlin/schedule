import { combineReducers } from "redux";
import user from "./user";
import schedules from "./schedules";
import bancis from "./bancis";
import infos from "./infos";
import newinfos from "./newinfo";

export default combineReducers({
    user,
    schedules,
    bancis,
    infos,
    newinfos
});
