import { checkAuth } from "@/lib/auth/checkAuth";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
    const auth = await checkAuth();
            
    if (!auth) {
        return NextResponse.json("Nicht autorisiert!", {status: 401})
    }
    const supabase = await createClient();
    const {data: users, error} = await supabase.from('users').select();
    return NextResponse.json(users?.map(user => ({
        id: user.id,
        vocal_group: user.vocal_group,
        full_name: user.full_name,
        photos: user.photos
    })), {status: 200})
}