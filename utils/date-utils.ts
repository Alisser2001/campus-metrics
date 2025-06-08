export function formatDate(
    date: Date | string,
    includeWeekday: boolean = false
): string {
    if (!date) return "";
    let d: Date;
    if (typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
        const [year, month, day] = date.split("-").map(Number);
        d = new Date(year, month - 1, day);
    } else {
        d = new Date(date);
    }

    const options: Intl.DateTimeFormatOptions = {
        day: "numeric",
        month: "long",
        year: "numeric",
        ...(includeWeekday ? { weekday: "long" } : {}),
    };
    return d.toLocaleDateString("es-ES", options);
}


export function formatTime(timeString: string): string {
    if (!timeString) return "";
    const [hStr, mStr] = timeString.split(":");
    let h = parseInt(hStr, 10);
    const suffix = h < 12 ? "am" : "pm";
    h = h % 12 === 0 ? 12 : h % 12;
    return `${h}:${mStr} ${suffix}`;
}



export function calculateDurationHours(initDate: string, initHour: string, endDate: string, endHour: string) {
    const start = new Date(`${initDate}T${initHour}`);
    const end = new Date(`${endDate}T${endHour}`);
    const diffMs = end.getTime() - start.getTime();
    return diffMs / (1000 * 60 * 60);
}