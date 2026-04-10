"use server"

import { createClient } from "@/lib/supabase/server";

import { cookies } from "next/headers"
import { NextResponse } from "next/server"

import bcrypt from "bcrypt"

export async function POST(req: Request) {
    const body = await req.json()
    const { username, password } = body
    const token = process.env.SECRET_TOKEN

    const supabase = await createClient();
    const { data: userData } = await supabase.from("users").select().eq("username", username);

    if (userData && userData.length > 0) {
        console.log(await bcrypt.compare(password, userData[0].password))
    }

    if (userData) {
        for(let i=0; i < userData.length; i++) {
            if(userData[i].username === username && await bcrypt.compare(password, userData[0].password)){
                const cookieStore = await cookies();
                if (token) {
                    cookieStore.set(
                        "auth_token",
                        token,
                        {
                            httpOnly: true,
                            sameSite: "strict",
                            path: "/",
                        }
                    );
                }

                cookieStore.set(
                    "userid", 
                    userData[i].id,
                    {
                        httpOnly: true,
                        sameSite: "strict",
                        path: "/",
                    }
                )
                return NextResponse.json({status: 200})
            }
            
        }
        return NextResponse.json({error: "Falsche Anmeldedaten"}, {status: 404})
    }
}

