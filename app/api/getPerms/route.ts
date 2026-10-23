import { getSessionUserId } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
    const id = await getSessionUserId();

    if (id === null) {
        return NextResponse.json("Nicht autorisiert!", {status: 401})
    }
    const supabase = await createClient()
    const perms = await supabase.from("users").select("permissions").eq("id", id)

    return NextResponse.json(perms, {status: 200})
}
