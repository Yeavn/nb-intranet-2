import { checkAdmin } from "@/lib/auth/checkAdmin";
import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

// Liefert das Admin-Handbuch nur an eingeloggte Admins aus
export async function GET() {
    const adminId = await checkAdmin();

    if (!adminId) {
        return NextResponse.json("Nicht autorisiert!", {status: 401})
    }

    const file = await readFile(path.join(process.cwd(), "docs", "Admin-Handbuch.pdf"))
    return new NextResponse(new Uint8Array(file), {
        status: 200,
        headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": 'inline; filename="Admin-Handbuch.pdf"',
            "Cache-Control": "private, no-store"
        }
    })
}
