import { getSessionUserId } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

// Ändert nur die Fotoerlaubnis des eingeloggten Benutzers
export async function POST(req: Request) {

    const id = await getSessionUserId();

    if (id === null) {
        return NextResponse.json("Nicht autorisiert!", {status: 401})
    }

    const supabase = createAdminClient()
    const body = await req.json()
    const status = body.status === true
    await supabase.from("users").update({photos: status}).eq("id", id);
    return NextResponse.json({status: 200})
}
