"use server"

import { createAdminClient } from "@/lib/supabase/admin";
import { createSessionValue, SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/auth/session";

import { cookies } from "next/headers"
import { NextResponse } from "next/server"

import bcrypt from "bcrypt"

export async function POST(req: Request) {
    const body = await req.json()
    const { username, password } = body

    const supabase = createAdminClient();
    const { data: userData } = await supabase.from("users").select().eq("username", username);

    if (userData) {
        for(let i=0; i < userData.length; i++) {
            if(userData[i].username === username && await bcrypt.compare(password, userData[i].password)){
                const cookieStore = await cookies();

                cookieStore.set(
                    SESSION_COOKIE,
                    createSessionValue(userData[i].id),
                    {
                        httpOnly: true,
                        sameSite: "strict",
                        secure: process.env.NODE_ENV === "production",
                        path: "/",
                        maxAge: SESSION_MAX_AGE,
                    }
                )
                // Altes, unsigniertes Login-Cookie aufräumen
                cookieStore.delete("auth_token")
                return NextResponse.json({status: 200})
            }

        }
    }
    return NextResponse.json({error: "Falsche Anmeldedaten"}, {status: 404})
}
