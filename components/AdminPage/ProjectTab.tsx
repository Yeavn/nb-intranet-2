"use client"

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FolderPlus, Pencil, Trash2 } from "lucide-react";
import moment from "moment";
import { useEffect, useState } from "react";
import ConfirmDialog from "./comps/ConfirmDialog";
import ProjectDialog, { AdminProject } from "./comps/ProjectDialog";

async function fetchProjects(): Promise<AdminProject[]> {
    const res = await fetch(`/api/admin/projects`)
    return res.ok ? res.json() : []
}

export default function ProjectTab() {
    const [projects, setProjects] = useState<AdminProject[]>([])
    const [loading, setLoading] = useState(true)

    function loadProjects() {
        return fetchProjects().then(setProjects)
    }

    useEffect(() => {
        fetchProjects().then((data) => {
            setProjects(data)
            setLoading(false)
        })
    }, [])

    async function deleteProject(project: AdminProject) {
        const res = await fetch(`/api/admin/projects`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({ id: project.id })
        })
        if (!res.ok) {
            const json = await res.json()
            alert(json.error ?? "Projekt konnte nicht gelöscht werden.")
            return
        }
        loadProjects()
    }

    return(
        <div className="flex flex-col gap-4">
            <div>
                <ProjectDialog
                    trigger={<Button variant="outline"><FolderPlus />Projekt anlegen</Button>}
                    onSaved={loadProjects}
                />
            </div>
            {loading ? (
                <div>Lade Daten...</div>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Titel</TableHead>
                            <TableHead>Kürzel</TableHead>
                            <TableHead>Thema</TableHead>
                            <TableHead>Deadline</TableHead>
                            <TableHead className="text-right">Aktionen</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {projects.map((project) => (
                            <TableRow key={project.id}>
                                <TableCell className="font-medium">{project.full_name}</TableCell>
                                <TableCell>{project.name}</TableCell>
                                <TableCell className="whitespace-normal text-muted-foreground">{project.topic || "–"}</TableCell>
                                <TableCell>{project.deadline ? moment(project.deadline).format("DD.MM.YYYY") : "–"}</TableCell>
                                <TableCell>
                                    <div className="flex justify-end gap-2">
                                        <ProjectDialog
                                            trigger={<Button variant="outline" size="icon" title="Bearbeiten"><Pencil /></Button>}
                                            project={project}
                                            onSaved={loadProjects}
                                        />
                                        <ConfirmDialog
                                            trigger={<Button variant="destructive" size="icon" title="Löschen"><Trash2 /></Button>}
                                            title="Projekt löschen"
                                            description={`${project.full_name} und alle zugehörigen Termine werden endgültig gelöscht.`}
                                            confirmLabel="Löschen"
                                            destructive
                                            onConfirm={() => deleteProject(project)}
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
