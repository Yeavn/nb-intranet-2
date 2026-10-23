import { checkAdmin } from "@/lib/auth/checkAdmin";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

function readProjectFields(body: Record<string, unknown>) {
    return {
        full_name: String(body.full_name ?? "").trim(),
        topic: String(body.topic ?? "").trim(),
        // Leere Deadline = keine Deadline
        deadline: body.deadline ? String(body.deadline) : null
    }
}

export async function GET() {
    const adminId = await checkAdmin();

    if (!adminId) {
        return NextResponse.json("Nicht autorisiert!", {status: 401})
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase.from("projects").select().order("name", { ascending: true })
    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json(data, {status: 200})
}

export async function POST(req: Request) {
    const adminId = await checkAdmin();

    if (!adminId) {
        return NextResponse.json("Nicht autorisiert!", {status: 401})
    }

    const supabase = createAdminClient();
    const body = await req.json()
    const name = String(body.name ?? "").trim()
    const fields = readProjectFields(body)

    if (!name || !fields.full_name) {
        return NextResponse.json({ error: "Kürzel und Titel sind Pflichtfelder." }, { status: 400 })
    }

    const { data: existing } = await supabase.from("projects").select("id").eq("name", name)
    if (existing && existing.length > 0) {
        return NextResponse.json({ error: "Dieses Kürzel ist bereits vergeben." }, { status: 409 })
    }

    const { error } = await supabase.from("projects").insert({ name: name, ...fields })
    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({status: 200})
}

export async function PATCH(req: Request) {
    const adminId = await checkAdmin();

    if (!adminId) {
        return NextResponse.json("Nicht autorisiert!", {status: 401})
    }

    const supabase = createAdminClient();
    const body = await req.json()
    const fields = readProjectFields(body)

    if (!fields.full_name) {
        return NextResponse.json({ error: "Titel ist ein Pflichtfeld." }, { status: 400 })
    }

    // Das Kürzel bleibt fest, da die Termine darüber dem Projekt zugeordnet sind
    const { error } = await supabase.from("projects").update(fields).eq("id", body.id)
    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({status: 200})
}

export async function DELETE(req: Request) {
    const adminId = await checkAdmin();

    if (!adminId) {
        return NextResponse.json("Nicht autorisiert!", {status: 401})
    }

    const supabase = createAdminClient();
    const body = await req.json()

    const { data: project } = await supabase.from("projects").select("name").eq("id", body.id).maybeSingle()
    if (!project) {
        return NextResponse.json({ error: "Projekt nicht gefunden." }, { status: 404 })
    }

    // Zugehörige Termine zuerst entfernen
    const { error: datesError } = await supabase.from("dates").delete().eq("project", project.name)
    if (datesError) {
        return NextResponse.json({ error: datesError.message }, { status: 500 })
    }

    const { error } = await supabase.from("projects").delete().eq("id", body.id)
    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({status: 200})
}
