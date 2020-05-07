export default function getTimeString(date: Date, useChinese: boolean) {
    date = new Date(date);
    if (useChinese) return date.getHours() + "点" + date.getMinutes() + "分";
    else return date.getHours() + ":" + date.getMinutes();
}
