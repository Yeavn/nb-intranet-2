import { checkPermission } from "./checkPermission";

// Gibt die ID des eingeloggten Admins zurück, sonst null
export async function checkAdmin(): Promise<number | null> {
    return checkPermission("admin")
}
