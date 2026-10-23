import { getSessionUserId } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// Liefert nur die Daten des eingeloggten Benutzers (ohne Passwort-Hash)
export async function POST() {
    const id = await getSessionUserId();

    if (id === null) {
        return NextResponse.json("Nicht autorisiert!", {status: 401})
    }
    const supabase = await createClient();
    const { data: users } = await supabase
        .from('users')
        .select("id, username, full_name, vocal_group, photos, permissions")
        .eq("id", id);
    return NextResponse.json(users, {status: 200})
}
