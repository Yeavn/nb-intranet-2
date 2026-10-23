import { getSessionUserId } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

import bcrypt from "bcrypt"

// Ändert nur das Passwort des eingeloggten Benutzers
export async function POST(req: Request) {

    const id = await getSessionUserId();

    if (id === null) {
        return NextResponse.json("Nicht autorisiert!", {status: 401})
    }

    const supabase = await createClient();
    const body = await req.json()
    const password = typeof body.password === "string" ? body.password : ""

    if (!password) {
        return NextResponse.json({ error: "Passwort darf nicht leer sein." }, { status: 400 })
    }

    const hashed = await bcrypt.hash(password, 10)

    await supabase
        .from("users")
        .update({
            password: hashed
        })
        .eq("id", id);

    return NextResponse.json({status: 200})
}
