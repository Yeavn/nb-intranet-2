"use client"

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { FaCamera, FaCheck, FaCross } from "react-icons/fa6";
import { RxCross1 } from "react-icons/rx";

export default function PhotoDialog() {

    type User = { full_name: string; [key: string]: any };
    const [userData, setUserData] = useState<User[]>([])

    async function getUserData() {
        const response = await fetch(`/api/getUsers`, {
            method: "GET",
            headers: { "Content-Type": "application/json"},
        })
        const allUsers = await response.json();
        setUserData(allUsers)
    }

    return(
        <Dialog>
            <DialogTrigger render={<Button variant="outline" onClick={() => getUserData()}><FaCamera /></Button>} />
            <DialogContent className="sm:max-w-xl sm:max-h-[90vh] max-h-[70vh] overflow-auto no-scrollbar">
                <DialogHeader>
                    <DialogTitle>Fotoerlaubnis</DialogTitle>
                </DialogHeader>
                <div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Mitglied</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {userData.map((user, idx) => (
                                <TableRow key={idx}>
                                    <TableCell>{user.full_name}</TableCell>
                                    <TableCell>{user.photos ? <FaCheck /> : <RxCross1 />}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </DialogContent>
        </Dialog>
    )
}