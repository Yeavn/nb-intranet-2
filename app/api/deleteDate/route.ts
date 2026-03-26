import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
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