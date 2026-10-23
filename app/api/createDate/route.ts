import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { checkPermission } from "@/lib/auth/checkPermission";

export async function POST(req: Request) {

    // Nur mit Berechtigung "terminplanung"
    const userId = await checkPermission("terminplanung");

    if (userId === null) {
        return NextResponse.json("Keine Berechtigung!", {status: 403})
    }

    const supabase = await createClient();
    const body = await req.json()
    const { category, date, start_time, end_time, location, project, informations} = body
    const { error } = await supabase
        .from("dates")
        .insert({
            category: category,
            date: date,
            start_time: start_time,
            end_time: end_time,
            location: location,
            project: project,
            informations: informations,
            members: []
        })

    console.log(error)

    return NextResponse.json({status: 200})
}