"use server"

import { createClient } from "@/lib/supabase/server";

import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    const body = await req.json()
    const { username, password } = body
    const token = process.env.SECRET_TOKEN

    const supabase = await createClient();
    const { data: userData } = await supabase.from("users").select();
    console.log(userData)

    if (userData) {
        for(let i=0; i < userData.length; i++) {
            if(userData[i].username === username && userData[i].password == password){
                const cookieStore = await cookies();
                if (token) {
                    cookieStore.set(
                        "auth_token",
                        token,
                        {
                            httpOnly: true,
                            sameSite: "strict",
                            maxAge: 60 * 60, // 1 Stunde
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
                        maxAge: 60 * 60, // 1 Stunde
                        path: "/",
                    }
                )
                return NextResponse.json({status: 200})
            }
            
        }
        return NextResponse.json({error: "Falsche Anmeldedaten"}, {status: 404})
    }
}
