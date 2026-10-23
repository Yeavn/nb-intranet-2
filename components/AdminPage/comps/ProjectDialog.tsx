"use client"

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { FaCheck } from "react-icons/fa6";

export type AdminProject = {
    id: number;
    name: string;
    full_name: string;
    topic: string | null;
    deadline: string | null;
}

type Props = {
    trigger: React.ReactElement;
    project?: AdminProject;
    onSaved: () => void;
}

export default function ProjectDialog({ trigger, project, onSaved }: Props) {
    const [open, setOpen] = useState(false)
    const [name, setName] = useState("")
    const [fullName, setFullName] = useState("")
    const [topic, setTopic] = useState("")
    const [deadline, setDeadline] = useState("")
    const [error, setError] = useState("")
    const [busy, setBusy] = useState(false)

    // Formular bei jedem Öffnen mit den aktuellen Werten befüllen
    function handleOpenChange(nextOpen: boolean) {
        if (nextOpen) {
            setName(project?.name ?? "")
            setFullName(project?.full_name ?? "")
            setTopic(project?.topic ?? "")
            setDeadline(project?.deadline ? project.deadline.slice(0, 10) : "")
            setError("")
        }
        setOpen(nextOpen)
    }

    async function saveProject(e: React.FormEvent) {
        e.preventDefault()
        setBusy(true)
        const res = await fetch(`/api/admin/projects`, {
            method: project ? "PATCH" : "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
                id: project?.id,
                name: name,
                full_name: fullName,
                topic: topic,
                deadline: deadline
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
                    <DialogTitle>{project ? "Projekt bearbeiten" : "Projekt anlegen"}</DialogTitle>
                    {project && <DialogDescription>Das Kürzel kann nachträglich nicht geändert werden, da die Termine darüber zugeordnet sind.</DialogDescription>}
                </DialogHeader>
                <form className="flex flex-col gap-4" onSubmit={saveProject}>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="name">Kürzel</Label>
                        <Input
                            id="name"
                            type="text"
                            required
                            disabled={!!project}
                            placeholder="2027_proj1"
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="full_name">Titel</Label>
                        <Input
                            id="full_name"
                            type="text"
                            required
                            onChange={(e) => setFullName(e.target.value)}
                            value={fullName}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="topic">Thema</Label>
                        <Textarea
                            id="topic"
                            onChange={(e) => setTopic(e.target.value)}
                            value={topic}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="deadline">Deadline</Label>
                        <Input
                            id="deadline"
                            type="date"
                            onChange={(e) => setDeadline(e.target.value)}
                            value={deadline}
                        />
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
