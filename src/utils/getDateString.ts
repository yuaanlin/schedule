export default function getDateString(date: Date, useChinese: boolean) {
    date = new Date(date);
    if (useChinese) {
        var Month = date.getMonth() + 1;
        var Day = date.getDate();
        var M = Month < 10 ? "0" + Month : Month;
        var D = Day < 10 ? "0" + Day : Day;
        return M + "月" + D + "日";
    } else return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
}
