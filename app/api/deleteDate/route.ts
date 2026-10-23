import { checkPermission } from "@/lib/auth/checkPermission";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    // Nur mit Berechtigung "terminplanung"
    const userId = await checkPermission("terminplanung");
    
    if (userId === null) {
        return NextResponse.json("Keine Berechtigung!", {status: 403})
    }
    const supabase = await createClient();
    const body = await req.json()
    const { id } = body
    const { error } = await supabase
        .from("dates")
        .delete()
        .eq("id", id)

    console.log(error)

    return NextResponse.json({status: 200})
}