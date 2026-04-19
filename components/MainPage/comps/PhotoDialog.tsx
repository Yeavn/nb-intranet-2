"use client"

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Suspense, useEffect, useState } from "react";
import { FaCamera } from "react-icons/fa6";
import PhotoTable from "./PhotoTable";

export default function PhotoDialog() {

    type User = { full_name: string; [key: string]: any };
    const [userData, setUserData] = useState<User[]>([])
    const [sopran, setSopran] = useState<User[]>([])
    const [alt, setAlt] = useState<User[]>([])
    const [tenor, setTenor] = useState<User[]>([])
    const [bass, setBass] = useState<User[]>([])
    const [extern, setExtern] = useState<User[]>([])

    async function getUserData() {
        const response = await fetch(`/api/getUsers`, {
            method: "GET",
            headers: { "Content-Type": "application/json"},
        })
        const allUsers = await response.json();
        setUserData(allUsers)
        
    }

    useEffect(() => {
        SortByGroup()
    }, [userData])

    function SortByGroup() {
        setSopran(userData.filter(u => u.vocal_group === "Sopran").sort((a, b) => a.full_name.localeCompare(b.full_name)))
        setAlt(userData.filter(u => u.vocal_group === "Alt").sort((a, b) => a.full_name.localeCompare(b.full_name)))
        setTenor(userData.filter(u => u.vocal_group === "Tenor").sort((a, b) => a.full_name.localeCompare(b.full_name)))
        setBass(userData.filter(u => u.vocal_group === "Bass").sort((a, b) => a.full_name.localeCompare(b.full_name)))
        setExtern(userData.filter(u => u.vocal_group === "Chorleiter").sort((a, b) => a.full_name.localeCompare(b.full_name)))
    }




    return(
        <Dialog>
            <DialogTrigger render={<Button variant="outline" onClick={() => getUserData()}><FaCamera /></Button>} />
            <DialogContent className="sm:max-w-xl sm:max-h-[90vh] max-h-[70vh] overflow-auto no-scrollbar">
                <DialogHeader>
                    <DialogTitle>Fotoerlaubnis</DialogTitle>
                </DialogHeader>
                <div>
                    {sopran.length > 0 && alt.length > 0 && tenor.length > 0 && bass.length > 0 && extern.length > 0 ?  <>
                        <PhotoTable group="Sopran" data={sopran} />
                        <PhotoTable group="Alt" data={alt} />
                        <PhotoTable group="Tenor" data={tenor} />
                        <PhotoTable group="Bass" data={bass} />
                        <PhotoTable group="Extern" data={extern} />
                    </> : <h1>Lade Daten...</h1> 
                    }
                </div>
            </DialogContent>
        </Dialog>
    )
}