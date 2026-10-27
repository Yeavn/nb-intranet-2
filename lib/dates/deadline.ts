// Heutiges Datum als "YYYY-MM-DD" in deutscher Zeit, unabhängig von der Server-Zeitzone
function todayInBerlin(now: Date) {
    return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Berlin" }).format(now)
}

// Wie im Frontend: Ab dem Tag der Deadline (00:00 Uhr) gilt sie als abgelaufen
export function isDeadlinePassed(deadline: string | null | undefined, now = new Date()) {
    if (!deadline) {
        return false
    }
    const deadlineDay = String(deadline).slice(0, 10)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(deadlineDay)) {
        return false
    }
    return todayInBerlin(now) >= deadlineDay
}

type StatusChange = {
    deadline: string | null | undefined;
    currentStatus: string | undefined;
    newStatus: string;
    sondereintragung: boolean;
    now?: Date;
}

// Nach der Deadline darf man sich noch erstmals eintragen (Status "Offen")
// oder von "Abgesagt" auf "Zugesagt" wechseln, außer man hat die Berechtigung "sondereintragung"
export function canChangeStatus({ deadline, currentStatus, newStatus, sondereintragung, now }: StatusChange) {
    if (sondereintragung || !isDeadlinePassed(deadline, now)) {
        return true
    }
    if (currentStatus === undefined || currentStatus === "Offen") {
        return true
    }
    return currentStatus === "Abgesagt" && newStatus === "Zugesagt"
}
