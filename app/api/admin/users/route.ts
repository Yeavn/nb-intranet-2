import { checkAdmin } from "@/lib/auth/checkAdmin";
import { DEFAULT_PASSWORD, sanitizePermissions } from "@/lib/auth/permissions";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

import bcrypt from "bcrypt"

const USER_FIELDS = "id, username, full_name, vocal_group, photos, permissions"

export async function GET() {
    const adminId = await checkAdmin();

    if (!adminId) {
        return NextResponse.json("Nicht autorisiert!", {status: 401})
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase.from("users").select(USER_FIELDS).order("full_name", { ascending: true })
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
    const username = String(body.username ?? "").trim()
    const full_name = String(body.full_name ?? "").trim()
    const vocal_group = String(body.vocal_group ?? "").trim()

    if (!username || !full_name) {
        return NextResponse.json({ error: "Benutzername und Name sind Pflichtfelder." }, { status: 400 })
    }

    const { data: existing } = await supabase.from("users").select("id").eq("username", username)
    if (existing && existing.length > 0) {
        return NextResponse.json({ error: "Dieser Benutzername ist bereits vergeben." }, { status: 409 })
    }

    const hashed = await bcrypt.hash(DEFAULT_PASSWORD, 10)
    const { error } = await supabase
        .from("users")
        .insert({
            username: username,
            full_name: full_name,
            vocal_group: vocal_group,
            password: hashed,
            photos: false,
            permissions: sanitizePermissions(body.permissions)
        })

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
    const id = Number(body.id)
    const username = String(body.username ?? "").trim()
    const full_name = String(body.full_name ?? "").trim()
    const vocal_group = String(body.vocal_group ?? "").trim()
    const permissions = sanitizePermissions(body.permissions)

    if (!username || !full_name) {
        return NextResponse.json({ error: "Benutzername und Name sind Pflichtfelder." }, { status: 400 })
    }

    // Verhindert, dass man sich selbst aussperrt
    if (id === adminId && !permissions.admin) {
        return NextResponse.json({ error: "Du kannst dir die Admin-Berechtigung nicht selbst entziehen." }, { status: 400 })
    }

    const { data: existing } = await supabase.from("users").select("id").eq("username", username).neq("id", id)
    if (existing && existing.length > 0) {
        return NextResponse.json({ error: "Dieser Benutzername ist bereits vergeben." }, { status: 409 })
    }

    const { error } = await supabase
        .from("users")
        .update({
            username: username,
            full_name: full_name,
            vocal_group: vocal_group,
            permissions: permissions
        })
        .eq("id", id)

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
    const id = Number(body.id)

    if (id === adminId) {
        return NextResponse.json({ error: "Du kannst dich nicht selbst löschen." }, { status: 400 })
    }

    const { error } = await supabase.from("users").delete().eq("id", id)
    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({status: 200})
}
