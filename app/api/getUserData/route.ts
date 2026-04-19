import { checkAuth } from "@/lib/auth/checkAuth";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const auth = await checkAuth();
        
    if (!auth) {
        return NextResponse.json("Nicht autorisiert!", {status: 401})
    }
    const supabase = await createClient();
    const body = await req.json();
    const { id } = body;
    const {data: users, error} = await supabase.from('users').select().eq("id", id).order("full_name", { ascending: false });
    return NextResponse.json(users, {status: 200})
}