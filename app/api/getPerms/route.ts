import { checkAuth } from "@/lib/auth/checkAuth";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    const auth = await checkAuth();
    
    if (!auth) {
        return NextResponse.json("Nicht autorisiert!", {status: 401})
    }
    const supabase = await createClient()
    const cookieStore = await cookies()
    const id = cookieStore.get("userid")?.value
    const perms = await supabase.from("users").select("permissions").eq("id", id)

    return NextResponse.json(perms, {status: 200})
}