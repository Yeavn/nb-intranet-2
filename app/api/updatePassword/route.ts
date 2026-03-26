import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const supabase = await createClient();
    const body = await req.json()
    const { id, password} = body
    await supabase
        .from("users")
        .update({
            password: password
        })
        .eq("id", id);

    return NextResponse.json({status: 200})
}