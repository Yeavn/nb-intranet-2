import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { FaCheck } from "react-icons/fa6";
import { RiPencilFill } from "react-icons/ri";

type Props = {
    project: string;
}

export default function CreateDialog({ project } : Props) {

    const [datum, setDatum] = useState(Date)
    const [ort, setOrt] = useState("")
    const [startTime, setStartTime] = useState("")
    const [endTime, setEndTime] = useState("")
    const [kategorie, setKategorie] = useState("")
    const [informationen, setInformationen] = useState("")

    async function editEvent() {
        const res = await fetch(`/api/createDate`, {
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
                project: project,
                informations: informationen
            })
        })
        window.location.reload()
    }

    return(
        <Dialog>
            <DialogTrigger render={<Button variant="outline"><FaPlus />Termin hinzufügen</Button>} />
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Termin hinzufügen</DialogTitle>
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
                        <Label htmlFor="infos">Zusatzinfos</Label>
                        <Textarea
                            id="infos" 
                            onChange={(e) => setInformationen(e.target.value)}
                            value={informationen}
                        />
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
                    <div className="mt-8 self-end">
                        <Button type="submit"><FaCheck />Bestätigen</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}