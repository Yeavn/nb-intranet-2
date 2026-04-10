import { checkAuth } from "@/lib/auth/checkAuth";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {

    const auth = await checkAuth();
            
    if (!auth) {
        return NextResponse.json("Nicht autorisiert!", {status: 401})
    }

    const supabase = await createClient();
    const body = await req.json()
    const { category, date, start_time, end_time, location, id} = body
    await supabase
        .from("dates")
        .update({
            category: category,
            date: date,
            start_time: start_time,
            end_time: end_time,
            location: location
        })
        .eq("id", id);

    return NextResponse.json({status: 200})
}