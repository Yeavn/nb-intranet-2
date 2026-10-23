"use client"

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, FolderOpen, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import UserTab from "./UserTab";
import ProjectTab from "./ProjectTab";

type Props = {
    currentUserId: number;
}

export default function AdminPanel({ currentUserId }: Props) {
    const router = useRouter();

    return(
        <div>
            <nav className="w-full border-b px-4 py-2 flex items-center gap-4">
                <Button variant="outline" onClick={() => router.push("/")}><ArrowLeft />Zurück</Button>
                <h1 className="font-bold text-lg">Admin Panel</h1>
            </nav>
            <div className="w-full p-4">
                <Tabs defaultValue="users">
                    <TabsList>
                        <TabsTrigger value="users"><Users />Benutzer</TabsTrigger>
                        <TabsTrigger value="projects"><FolderOpen />Projekte</TabsTrigger>
                    </TabsList>
                    <TabsContent value="users" className="mt-4">
                        <UserTab currentUserId={currentUserId} />
                    </TabsContent>
                    <TabsContent value="projects" className="mt-4">
                        <ProjectTab />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
