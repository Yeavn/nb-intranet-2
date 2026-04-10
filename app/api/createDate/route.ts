import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { checkAuth } from "@/lib/auth/checkAuth";

export async function POST(req: Request) {

    const auth = await checkAuth();

    if (!auth) {
        return NextResponse.json("Nicht autorisiert!", {status: 401})
    }

    const supabase = await createClient();
    const body = await req.json()
    const { category, date, start_time, end_time, location, project} = body
    const { error } = await supabase
        .from("dates")
        .insert({
            category: category,
            date: date,
            start_time: start_time,
            end_time: end_time,
            location: location,
            project: project,
            members: []
        })

    console.log(error)

    return NextResponse.json({status: 200})
}