import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
    const supabase = await createClient()
    const { data: projectData } = await supabase.from("projects").select();

    return NextResponse.json(projectData, {status: 200})
}