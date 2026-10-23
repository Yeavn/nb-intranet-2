export const PERMISSIONS = [
    { key: "terminplanung", label: "Terminplanung" },
    { key: "sondereintragung", label: "Sondereintragung" },
    { key: "fotoerlaubnis", label: "Fotoerlaubnis einsehen" },
    { key: "admin", label: "Admin Panel" },
] as const

export type PermissionKey = typeof PERMISSIONS[number]["key"]
export type Permissions = Partial<Record<PermissionKey, boolean>>

export const VOCAL_GROUPS = ["Sopran", "Alt", "Tenor", "Bass", "Chorleiter"]

export const DEFAULT_PASSWORD = "notabene_ist_toll"

// Nur bekannte Berechtigungen als echte Booleans übernehmen
export function sanitizePermissions(input: unknown): Permissions {
    const perms: Permissions = {}
    const source = (input && typeof input === "object" ? input : {}) as Record<string, unknown>
    for (const { key } of PERMISSIONS) {
        perms[key] = source[key] === true
    }
    return perms
}
