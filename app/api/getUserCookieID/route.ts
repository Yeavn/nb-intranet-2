import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(){
    const cookieStore = await cookies();
    const rawId = cookieStore.get("userid")?.value;
    const parsedId = rawId !== undefined ? Number(rawId) : null;
    const id = parsedId !== null && Number.isFinite(parsedId) ? parsedId : null;

    return NextResponse.json({id: id}, {status: 200})
}
