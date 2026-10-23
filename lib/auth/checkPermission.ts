import { createAdminClient } from "@/lib/supabase/admin";
import { PermissionKey, Permissions } from "./permissions";
import { getSessionUserId } from "./session";

// Berechtigungen des eingeloggten Benutzers, null wenn nicht eingeloggt
export async function getSessionPermissions(): Promise<{ id: number; permissions: Permissions } | null> {
    const id = await getSessionUserId();
    if (id === null) {
        return null
    }

    const supabase = createAdminClient();
    const { data } = await supabase.from("users").select("permissions").eq("id", id).maybeSingle()
    if (!data) {
        return null
    }
    return { id: id, permissions: data.permissions ?? {} }
}

// Gibt die ID des eingeloggten Benutzers zurück, wenn er die Berechtigung hat, sonst null
export async function checkPermission(key: PermissionKey): Promise<number | null> {
    const session = await getSessionPermissions();
    if (session?.permissions[key] === true) {
        return session.id
    }
    return null
}
