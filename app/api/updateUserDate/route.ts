import { getSessionPermissions } from "@/lib/auth/checkPermission";
import { canChangeStatus } from "@/lib/dates/deadline";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

const ALLOWED_STATUS = ["Zugesagt", "Abgesagt"]

type Member = {
    id: number;
    name: string;
    status: string;
    vocal_group: string;
}

// Setzt nur den Status des eingeloggten Benutzers für einen Termin
export async function POST(req: Request) {

    const session = await getSessionPermissions();

    if (session === null) {
        return NextResponse.json("Nicht autorisiert!", {status: 401})
    }
    const UserId = session.id

    const supabase = createAdminClient()
    const body = await req.json()
    const { DateId, status } = body

    if (!ALLOWED_STATUS.includes(status)) {
        return NextResponse.json({ error: "Ungültiger Status." }, { status: 400 })
    }

    const { data } = await supabase.from("dates").select("members, project").eq("id", DateId)
    if (!data || data.length === 0) {
        return NextResponse.json({ error: "Termin nicht gefunden." }, { status: 404 })
    }
    const members: Member[] = data[0].members ?? [];
    const member = members.find(m => m.id === UserId)

    const { data: project } = await supabase.from("projects").select("deadline").eq("name", data[0].project).maybeSingle()
    const allowed = canChangeStatus({
        deadline: project?.deadline,
        currentStatus: member?.status,
        newStatus: status,
        sondereintragung: session.permissions.sondereintragung === true
    })
    if (!allowed) {
        return NextResponse.json({ error: "Die Deadline ist abgelaufen." }, { status: 403 })
    }

    if (member) {
        member.status = status
    } else {
        const { data: user } = await supabase.from("users").select().eq("id", UserId)
        if (!user || user.length === 0) {
            return NextResponse.json({ error: "Benutzer nicht gefunden." }, { status: 404 })
        }
        const userData = user[0];
        members.push({ id: userData.id, name: userData.full_name, status: status, vocal_group: userData.vocal_group})
    }

    await supabase.from("dates").update({members: members}).eq("id", DateId)
    return NextResponse.json(members, {status: 200})
}
