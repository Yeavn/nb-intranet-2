import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const supabase = await createClient();
    const body = await req.json()
    const { project } = body
    const { data, error } = await supabase.from("dates").select().eq('project', project).order('date', { ascending: true })
    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json(data, {status: 200})
}