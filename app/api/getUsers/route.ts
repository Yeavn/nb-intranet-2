import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
    const supabase = await createClient();
    const {data: users, error} = await supabase.from('users').select();
    return NextResponse.json(users, {status: 200})
}