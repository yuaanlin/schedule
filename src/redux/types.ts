import { CombinedState } from "redux";
import User from "src/classes/user";
import Schedule from "src/classes/schedule";
import info from "src/classes/info";
import Banci from "src/classes/banci";

export type AppState = CombinedState<{
    user: User;
    schedules: Array<Schedule>;
    infos: Array<info>;
    bancis: Array<Banci>;
}>;
