import { checkAdmin } from "@/lib/auth/checkAdmin";
import { DEFAULT_PASSWORD } from "@/lib/auth/permissions";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

import bcrypt from "bcrypt"

export async function POST(req: Request) {
    const adminId = await checkAdmin();

    if (!adminId) {
        return NextResponse.json("Nicht autorisiert!", {status: 401})
    }

    const supabase = createAdminClient();
    const body = await req.json()
    const id = Number(body.id)

    const hashed = await bcrypt.hash(DEFAULT_PASSWORD, 10)
    const { error } = await supabase
        .from("users")
        .update({
            password: hashed
        })
        .eq("id", id)

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({status: 200})
}
