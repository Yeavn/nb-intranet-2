import { checkPermission } from "@/lib/auth/checkPermission";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function POST(req: Request) {

    // Nur mit Berechtigung "terminplanung"
    const userId = await checkPermission("terminplanung");
            
    if (userId === null) {
        return NextResponse.json("Keine Berechtigung!", {status: 403})
    }

    const supabase = createAdminClient();
    const body = await req.json()
    const { category, date, start_time, end_time, location, id, informations} = body
    await supabase
        .from("dates")
        .update({
            category: category,
            date: date,
            start_time: start_time,
            end_time: end_time,
            location: location,
            informations: informations
        })
        .eq("id", id);

    return NextResponse.json({status: 200})
}