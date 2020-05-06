export default function getTimeFromString(baseTime: Date, dateString: string) {
    const hour = +dateString.split(":")[0];
    const minute = +dateString.split(":")[1];
    var newDate = new Date();
    newDate.setTime(baseTime.getTime());
    newDate.setHours(hour);
    newDate.setMinutes(minute);
    return newDate;
}
