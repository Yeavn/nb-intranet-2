import { checkAuth } from "@/lib/auth/checkAuth";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
    const auth = await checkAuth();
        
    if (!auth) {
        return NextResponse.json("Nicht autorisiert!", {status: 401})
    }
    const supabase = await createClient()
    const { data: projectData } = await supabase.from("projects").select();

    return NextResponse.json(projectData, {status: 200})
}