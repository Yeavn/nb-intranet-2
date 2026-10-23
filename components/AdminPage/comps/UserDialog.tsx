"use client"

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DEFAULT_PASSWORD, PERMISSIONS, Permissions, VOCAL_GROUPS } from "@/lib/auth/permissions";
import { useState } from "react";
import { FaCheck } from "react-icons/fa6";

export type AdminUser = {
    id: number;
    username: string;
    full_name: string;
    vocal_group: string;
    photos: boolean;
    permissions: Permissions | null;
}

type Props = {
    trigger: React.ReactElement;
    user?: AdminUser;
    onSaved: () => void;
}

export default function UserDialog({ trigger, user, onSaved }: Props) {
    const [open, setOpen] = useState(false)
    const [username, setUsername] = useState("")
    const [fullName, setFullName] = useState("")
    const [vocalGroup, setVocalGroup] = useState(VOCAL_GROUPS[0])
    const [perms, setPerms] = useState<Permissions>({})
    const [error, setError] = useState("")
    const [busy, setBusy] = useState(false)

    // Formular bei jedem Öffnen mit den aktuellen Werten befüllen
    function handleOpenChange(nextOpen: boolean) {
        if (nextOpen) {
            setUsername(user?.username ?? "")
            setFullName(user?.full_name ?? "")
            setVocalGroup(user?.vocal_group ?? VOCAL_GROUPS[0])
            setPerms(user?.permissions ?? {})
            setError("")
        }
        setOpen(nextOpen)
    }

    async function saveUser(e: React.FormEvent) {
        e.preventDefault()
        setBusy(true)
        const res = await fetch(`/api/admin/users`, {
            method: user ? "PATCH" : "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
                id: user?.id,
                username: username,
                full_name: fullName,
                vocal_group: vocalGroup,
                permissions: perms
            })
        })
        setBusy(false)
        if (!res.ok) {
            const json = await res.json()
            setError(json.error ?? "Speichern fehlgeschlagen.")
            return
        }
        setOpen(false)
        onSaved()
    }

    return(
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger render={trigger} />
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>{user ? "Benutzer bearbeiten" : "Benutzer anlegen"}</DialogTitle>
                    {!user && <DialogDescription>Startpasswort: {DEFAULT_PASSWORD}</DialogDescription>}
                </DialogHeader>
                <form className="flex flex-col gap-4" onSubmit={saveUser}>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="full_name">Name</Label>
                        <Input
                            id="full_name"
                            type="text"
                            required
                            placeholder="Max Mustermann"
                            onChange={(e) => setFullName(e.target.value)}
                            value={fullName}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="username">Benutzername</Label>
                        <Input
                            id="username"
                            type="text"
                            required
                            placeholder="max_mustermann"
                            onChange={(e) => setUsername(e.target.value)}
                            value={username}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="vocal_group">Stimmgruppe</Label>
                        <select
                            id="vocal_group"
                            className="h-8 w-full rounded-lg border border-input bg-transparent px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
                            onChange={(e) => setVocalGroup(e.target.value)}
                            value={vocalGroup}
                        >
                            {VOCAL_GROUPS.map((group) => (
                                <option key={group} value={group}>{group}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label>Berechtigungen</Label>
                        {PERMISSIONS.map(({ key, label }) => (
                            <label key={key} className="flex items-center gap-2 text-sm">
                                <input
                                    type="checkbox"
                                    className="size-4 accent-primary"
                                    checked={perms[key] === true}
                                    onChange={(e) => setPerms({ ...perms, [key]: e.target.checked })}
                                />
                                {label}
                            </label>
                        ))}
                    </div>
                    {error && <p className="text-sm text-destructive">{error}</p>}
                    <div className="mt-4 self-end">
                        <Button type="submit" disabled={busy}><FaCheck />Speichern</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
