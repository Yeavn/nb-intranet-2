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
    const { project } = body
    const { data, error } = await supabase.from("dates").select().eq('project', project).order('date', { ascending: true })
    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json(data, {status: 200})
}