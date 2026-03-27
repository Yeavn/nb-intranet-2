import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const supabase = await createClient()
    const body = await req.json()
    const { status, id } = body
    await supabase.from("users").update({photos: status}).eq("id", id);
    return NextResponse.json({status: 200})
}