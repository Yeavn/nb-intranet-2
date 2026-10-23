import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "userid"
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30 // 30 Tage

function getSecret() {
    const secret = process.env.SESSION_SECRET
    // Ohne Secret lässt sich keine Session prüfen -> niemand ist eingeloggt
    if (!secret || secret.length < 32) {
        throw new Error("SESSION_SECRET fehlt oder ist kürzer als 32 Zeichen.")
    }
    return secret
}

function sign(payload: string) {
    return createHmac("sha256", getSecret()).update(payload).digest("base64url")
}

// Cookie-Wert: "<id>.<ablauf>.<signatur>"
export function createSessionValue(id: number) {
    const expires = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE
    const payload = `${id}.${expires}`
    return `${payload}.${sign(payload)}`
}

export function verifySessionValue(value: string | undefined): number | null {
    if (!value) {
        return null
    }
    const parts = value.split(".")
    if (parts.length !== 3) {
        return null
    }
    const [rawId, rawExpires, signature] = parts

    const expected = Buffer.from(sign(`${rawId}.${rawExpires}`))
    const actual = Buffer.from(signature)
    if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
        return null
    }

    const id = Number(rawId)
    const expires = Number(rawExpires)
    if (!Number.isInteger(id) || !Number.isFinite(expires) || expires < Date.now() / 1000) {
        return null
    }
    return id
}

// ID des eingeloggten Benutzers aus dem signierten Cookie, sonst null
export async function getSessionUserId(): Promise<number | null> {
    const cookieStore = await cookies();
    try {
        return verifySessionValue(cookieStore.get(SESSION_COOKIE)?.value)
    } catch (error) {
        console.error(error)
        return null
    }
}
