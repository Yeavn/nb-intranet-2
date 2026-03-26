import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const supabase = await createClient();
    const body = await req.json();
    const { id } = body;
    const {data: users, error} = await supabase.from('users').select().eq("id", id);
    return NextResponse.json(users, {status: 200})
}