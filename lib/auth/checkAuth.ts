import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function checkAuth() {
    const cookieStore = await cookies();
    const auth_token = cookieStore.get("auth_token")?.value
    if (auth_token === process.env.SECRET_TOKEN) {
        return true
    } else {
        return false
    }
}