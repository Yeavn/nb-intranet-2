"use client"

import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { FaCheck, } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import { IoInformationCircleOutline } from "react-icons/io5";
import { useEffect, useState } from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import EditDialog from "./EditDialog";


type Singer = {
    id: number;
    name: string;
    vocal_group: string;
    status: string;
}

type Props = {
    DateId: number;
    date: Date;
    project: string;
    location: string;
    start_time: string;
    end_time: string;
    category: string;
    singers: Singer[];
    informations: string;
    deadline: Date;
}

export default function DateCard({ DateId, date, project, location, start_time, end_time, category, singers, informations, deadline }: Props) {
    const [formattedDate, setFormattedDate] = useState("");
    const [status, setStatus] = useState("");
    const [id, setID] = useState<number | null>(null);
    const [perms, setPerms] = useState(Boolean)
    const [members, setMembers] = useState(singers)

    const [promised, setPromised] = useState<{ name: string; vocal_group: string }[]>([])
    const [cancelled, setCancelled] = useState<{ name: string; vocal_group: string }[]>([])
    const [open, setOpen] = useState<{ name: string; vocal_group: string }[]>([])

    const heute = new Date();

    useEffect(() => {
        setFormattedDate(date.toLocaleDateString());
    }, [date]);

    useEffect(() => {
        getID();
        console.log(deadline != null)
        console.log(heute)
    }, [])

    useEffect(() => {
        if(id !== null) {
            getStatus(members);
            getPerms();
        }
    }, [id, members])

    async function getID() {
        const res = await fetch(`/api/getUserCookieID`)
        const json = await res.json()
        const nextId = typeof json.id === "number" ? json.id : null;

        setID(nextId)
    }

    async function getPerms() {
        const res = await fetch(`/api/getPerms`)
        const json = await res.json()
        if(json.data[0].permissions.terminplanung) {
            setPerms(true)
        }
    }

    async function getStatus(singers: Singer[]) {
        setStatus("");

        for(let i = 0; i < singers.length; i++) {
            if(singers[i].id === id) {
                setStatus(singers[i].status)
                return
            } 
        }
        setStatus("Offen")
    } 

    async function sortMembers() {
        const zugesagt = []
        const abgesagt = []
        const offen = []
        const response = await fetch(`/api/getUsers`, {
            method: "GET",
            headers: { "Content-Type": "application/json"},
        })
        const allUsers = await response.json();

        for (let i = 0; i < allUsers.length; i++) {
            const member = members.find(m => m.id === allUsers[i].id);
            if (member) {
                if (member.status === "Zugesagt") {
                    zugesagt.push({ name: member.name, vocal_group: member.vocal_group });
                } else if (member.status === "Abgesagt") {
                    abgesagt.push({ name: member.name, vocal_group: member.vocal_group });
                } else {
                    offen.push({ name: member.name, vocal_group: member.vocal_group });
                }
            } else {
                offen.push({ name: allUsers[i].full_name, vocal_group: allUsers[i].vocal_group });
            }
        }
        setPromised(zugesagt)
        setCancelled(abgesagt)
        setOpen(offen)
    }

    function getVocalGroup(status: string, vocal_group: string) {
        let array = []
        if (status === "Zugesagt") {
            for(let i = 0; i < promised.length; i++) {
                if(promised[i].vocal_group === vocal_group) {
                    array.push(promised[i])
                }
            }
        } else if (status === "Abgesagt") {
            for(let i = 0; i < cancelled.length; i++) {
                if(cancelled[i].vocal_group === vocal_group) {
                    array.push(cancelled[i])
                }
            }
        } else if (status === "Offen") {
            for(let i = 0; i < open.length; i++) {
                if(open[i].vocal_group === vocal_group) {
                    array.push(open[i])
                }
            }
        }
        return array
    }

    async function updateStatus(status: string) {
        const res = fetch(`/api/updateUserDate`, {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
                DateId: DateId,
                UserId: id,
                status: status
            })
        })
        setStatus(status)
        const json = (await res).json();
        setMembers(await json)
    }


    return(
        <Item variant="outline">
            <ItemContent>
                <ItemTitle className="font-bold">{category}</ItemTitle>
                <ItemDescription>{formattedDate} ({start_time} - {end_time})</ItemDescription>
                <ItemDescription>{location}</ItemDescription>
                <ItemDescription className="flex gap-1 mt-4">Dein Status: <p className="font-bold">{status}</p></ItemDescription>
            </ItemContent>
            <ItemActions className="flex flex-col">
                <div className="flex gap-2">
                    { deadline == null || deadline > heute ?
                    status == "Offen" ? <>
                    <Button variant="outline" onClick={() => updateStatus("Zugesagt")}><FaCheck /></Button>
                    <Button variant="outline" onClick={() => updateStatus("Abgesagt")}><IoMdClose /></Button>
                    </> : status == "Zugesagt" ?
                    <Button variant="outline" onClick={() => updateStatus("Abgesagt")}>Absagen</Button>
                    : 
                    <Button variant="outline" onClick={() => updateStatus("Zugesagt")}>Zusagen</Button>
                    : ""
                    }
                </div>
                {perms ? <EditDialog DateId={DateId} date={date} location={location} start_time={start_time} end_time={end_time} category={category} informations={informations} /> : ""}
                <Dialog>
                    <DialogTrigger render={<Button variant="outline" onClick={() => sortMembers()}><IoInformationCircleOutline />Details</Button>} />
                    <DialogContent className="sm:max-w-xl sm:max-h-[90vh] max-h-[70vh] overflow-auto no-scrollbar">
                        <DialogHeader>
                            <DialogTitle>{category}</DialogTitle>
                            <DialogDescription>{start_time} - {end_time}</DialogDescription>
                            <DialogDescription>{informations}</DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-col gap-4">
                                <h1 className="font-bold">Zugesagt</h1>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Stimmengruppe</TableHead>
                                            <TableHead>Mitglieder</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>

                                        <TableRow>
                                            <TableCell>Sopran</TableCell>
                                            <TableCell>
                                                {getVocalGroup("Zugesagt", "Sopran").map((singer, idx) => (
                                                <div key={idx}>{singer.name}</div>
                                                ))}
                                            </TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell>Alt</TableCell>
                                            <TableCell>
                                                {getVocalGroup("Zugesagt", "Alt").map((singer, idx) => (
                                                <div key={idx}>{singer.name}</div>
                                                ))}
                                            </TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell>Tenor</TableCell>
                                            <TableCell>
                                                {getVocalGroup("Zugesagt", "Tenor").map((singer, idx) => (
                                                <div key={idx}>{singer.name}</div>
                                                ))}
                                            </TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell>Bass</TableCell>
                                            <TableCell>
                                                {getVocalGroup("Zugesagt", "Bass").map((singer, idx) => (
                                                <div key={idx}>{singer.name}</div>
                                                ))}
                                            </TableCell>
                                        </TableRow>

                                    </TableBody>
                                </Table>
                            </div>

                            <h1 className="font-bold mt-12">Abgesagt</h1>
                            
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Stimmengruppe</TableHead>
                                        <TableHead>Mitglieder</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>Sopran</TableCell>
                                        <TableCell>
                                            {getVocalGroup("Abgesagt", "Sopran").map((singer, idx) => (
                                                <div key={idx}>{singer.name}</div>
                                                ))}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Alt</TableCell>
                                        <TableCell>
                                            {getVocalGroup("Abgesagt", "Alt").map((singer, idx) => (
                                                <div key={idx}>{singer.name}</div>
                                                ))}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Tenor</TableCell>
                                        <TableCell>
                                            {getVocalGroup("Abgesagt", "Tenor").map((singer, idx) => (
                                                <div key={idx}>{singer.name}</div>
                                                ))}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Bass</TableCell>
                                        <TableCell>
                                            {getVocalGroup("Abgesagt", "Bass").map((singer, idx) => (
                                                <div key={idx}>{singer.name}</div>
                                                ))}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                                </Table>

                            <h1 className="font-bold mt-12">Offen</h1>

                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Stimmengruppe</TableHead>
                                        <TableHead>Mitglieder</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>Sopran</TableCell>
                                        <TableCell>
                                            {getVocalGroup("Offen", "Sopran").map((singer, idx) => (
                                                <div key={idx}>{singer.name}</div>
                                                ))}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Alt</TableCell>
                                        <TableCell>
                                            {getVocalGroup("Offen", "Alt").map((singer, idx) => (
                                                <div key={idx}>{singer.name}</div>
                                                ))}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Tenor</TableCell>
                                        <TableCell>
                                            {getVocalGroup("Offen", "Tenor").map((singer, idx) => (
                                                <div key={idx}>{singer.name}</div>
                                                ))}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Bass</TableCell>
                                        <TableCell>
                                            {getVocalGroup("Offen", "Bass").map((singer, idx) => (
                                                <div key={idx}>{singer.name}</div>
                                                ))}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                                </Table>
                    </DialogContent>
                </Dialog>
            </ItemActions>
        </Item>
    )
}
