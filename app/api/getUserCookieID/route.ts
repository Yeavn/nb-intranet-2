import { getSessionUserId } from "@/lib/auth/session";
import { NextResponse } from "next/server";

export async function GET(){
    const id = await getSessionUserId();

    return NextResponse.json({id: id}, {status: 200})
}
