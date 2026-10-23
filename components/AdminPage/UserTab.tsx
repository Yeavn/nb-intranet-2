"use client"

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DEFAULT_PASSWORD, PERMISSIONS } from "@/lib/auth/permissions";
import { KeyRound, Pencil, Trash2, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import ConfirmDialog from "./comps/ConfirmDialog";
import UserDialog, { AdminUser } from "./comps/UserDialog";

type Props = {
    currentUserId: number;
}

async function fetchUsers(): Promise<AdminUser[]> {
    const res = await fetch(`/api/admin/users`)
    return res.ok ? res.json() : []
}

export default function UserTab({ currentUserId }: Props) {
    const [users, setUsers] = useState<AdminUser[]>([])
    const [loading, setLoading] = useState(true)

    function loadUsers() {
        return fetchUsers().then(setUsers)
    }

    useEffect(() => {
        fetchUsers().then((data) => {
            setUsers(data)
            setLoading(false)
        })
    }, [])

    async function resetPassword(user: AdminUser) {
        const res = await fetch(`/api/admin/users/resetPassword`, {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({ id: user.id })
        })
        if (res.ok) {
            alert(`Passwort von ${user.full_name} wurde auf "${DEFAULT_PASSWORD}" zurückgesetzt.`)
        } else {
            alert("Passwort konnte nicht zurückgesetzt werden.")
        }
    }

    async function deleteUser(user: AdminUser) {
        const res = await fetch(`/api/admin/users`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({ id: user.id })
        })
        if (!res.ok) {
            const json = await res.json()
            alert(json.error ?? "Benutzer konnte nicht gelöscht werden.")
            return
        }
        loadUsers()
    }

    function permissionLabels(user: AdminUser) {
        return PERMISSIONS
            .filter(({ key }) => user.permissions?.[key])
            .map(({ label }) => label)
            .join(", ")
    }

    return(
        <div className="flex flex-col gap-4">
            <div>
                <UserDialog
                    trigger={<Button variant="outline"><UserPlus />Benutzer anlegen</Button>}
                    onSaved={loadUsers}
                />
            </div>
            {loading ? (
                <div>Lade Daten...</div>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Benutzername</TableHead>
                            <TableHead>Stimmgruppe</TableHead>
                            <TableHead>Berechtigungen</TableHead>
                            <TableHead className="text-right">Aktionen</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell className="font-medium">{user.full_name}</TableCell>
                                <TableCell>{user.username}</TableCell>
                                <TableCell>{user.vocal_group}</TableCell>
                                <TableCell className="whitespace-normal text-muted-foreground">{permissionLabels(user) || "–"}</TableCell>
                                <TableCell>
                                    <div className="flex justify-end gap-2">
                                        <UserDialog
                                            trigger={<Button variant="outline" size="icon" title="Bearbeiten"><Pencil /></Button>}
                                            user={user}
                                            onSaved={loadUsers}
                                        />
                                        <ConfirmDialog
                                            trigger={<Button variant="outline" size="icon" title="Passwort zurücksetzen"><KeyRound /></Button>}
                                            title="Passwort zurücksetzen"
                                            description={`Das Passwort von ${user.full_name} wird auf "${DEFAULT_PASSWORD}" gesetzt.`}
                                            confirmLabel="Zurücksetzen"
                                            onConfirm={() => resetPassword(user)}
                                        />
                                        <ConfirmDialog
                                            trigger={<Button variant="destructive" size="icon" title="Löschen" disabled={user.id === currentUserId}><Trash2 /></Button>}
                                            title="Benutzer löschen"
                                            description={`${user.full_name} wird endgültig gelöscht.`}
                                            confirmLabel="Löschen"
                                            destructive
                                            onConfirm={() => deleteUser(user)}
                                        />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </div>
    )
}
