import { checkAuth } from "@/lib/auth/checkAuth";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

import bcrypt from "bcrypt"

export async function POST(req: Request) {

    const auth = await checkAuth();
            
    if (!auth) {
        return NextResponse.json("Nicht autorisiert!", {status: 401})
    }


    const supabase = await createClient();
    const body = await req.json()
    const { id, password} = body

    const hashed = await bcrypt.hash(password, 10)

    await supabase
        .from("users")
        .update({
            password: hashed
        })
        .eq("id", id);

    return NextResponse.json({status: 200})
}