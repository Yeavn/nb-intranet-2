import { cookies } from "next/headers";

export async function GET() {
    const cookieStore = cookies();
    (await cookieStore).delete("auth_token");
    (await cookieStore).delete("userid");
    return new Response(null, { status: 200 });
}