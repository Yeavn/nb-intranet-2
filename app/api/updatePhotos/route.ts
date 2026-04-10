import { checkAuth } from "@/lib/auth/checkAuth";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {

    const auth = await checkAuth();
            
    if (!auth) {
        return NextResponse.json("Nicht autorisiert!", {status: 401})
    }

    const supabase = await createClient()
    const body = await req.json()
    const { status, id } = body
    await supabase.from("users").update({photos: status}).eq("id", id);
    return NextResponse.json({status: 200})
}