import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { FaCheck, FaTrash } from "react-icons/fa6";
import { RiPencilFill } from "react-icons/ri";

type Props = {
    DateId: number;
    date: Date;
    location: string;
    start_time: string;
    end_time: string;
    category: string;
}

export default function EditDialog({DateId, date, location, start_time, end_time, category}: Props) {

    const [datum, setDatum] = useState(date.toISOString().slice(0, 10))
    const [ort, setOrt] = useState(location)
    const [startTime, setStartTime] = useState(start_time)
    const [endTime, setEndTime] = useState(end_time)
    const [kategorie, setKategorie] = useState(category)

    async function editEvent() {
        const res = await fetch(`/api/updateDate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                category: kategorie,
                date: datum,
                start_time: startTime,
                end_time: endTime,
                location: ort,
                id: DateId,
            })
        })
        window.location.reload()
    }

    async function deleteEvent() {
        const res = await fetch(`/api/deleteDate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: DateId,
            })
        })
        window.location.reload()
    }

    return(
        <Dialog>
            <DialogTrigger render={<Button variant="outline"><RiPencilFill /></Button>} />
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Termin bearbeiten</DialogTitle>
                </DialogHeader>
                <form className="flex flex-col gap-4" action={editEvent}>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="category">Kategorie</Label>
                        <Input 
                            id="category" 
                            type="text" 
                            onChange={(e) => setKategorie(e.target.value)} 
                            value={kategorie}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="date">Datum</Label>
                        <Input 
                            id="date" 
                            type="date" 
                            onChange={(e) => setDatum(e.target.value)}
                            value={datum}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="time">Zeit</Label>
                        <div id="time" className="flex justify-center items-center gap-4">
                            <Input 
                                id="start_time" 
                                type="text" 
                                onChange={(e) => setStartTime(e.target.value)}
                                value={startTime}
                            />
                            bis
                            <Input 
                                id="end_time" 
                                type="text" 
                                onChange={(e) => setEndTime(e.target.value)}
                                value={endTime}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="location">Ort</Label>
                        <Input 
                            id="location" 
                            type="text" 
                            onChange={(e) => setOrt(e.target.value)}
                            value={ort}
                        />
                    </div>
                    <div className="mt-8 flex justify-between w-full">
                        <Button variant="destructive" onClick={() => deleteEvent()}><FaTrash /></Button>
                        <Button type="submit"><FaCheck />Bestätigen</Button>      
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}