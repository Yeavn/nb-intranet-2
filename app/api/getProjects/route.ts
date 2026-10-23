import { checkAuth } from "@/lib/auth/checkAuth";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function GET() {
    const auth = await checkAuth();
        
    if (!auth) {
        return NextResponse.json("Nicht autorisiert!", {status: 401})
    }
    const supabase = createAdminClient()
    const { data: projectData } = await supabase.from("projects").select().order('name', { ascending: true })

    return NextResponse.json(projectData, {status: 200})
}