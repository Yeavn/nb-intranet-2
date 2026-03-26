import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogHeader, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Settings } from "lucide-react"
import { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";

export default function SettingDialog() {

    const [id, setID] = useState<number | null>(null);
    const [username, setUsername] = useState("")
    const [vocalGroup, setVocalGroup] = useState("")
    const [fullName, setFullName] = useState("")
    const [perms, setPerms] = useState(JSON)

    const [password, setPassword] = useState("")

    useEffect(() => {
        getID();
    }, [])

    useEffect(() => {
        if(id !== null) {
            getUserData()
            
        }
    }, [id])

    async function getID() {
        const res = await fetch(`/api/getUserCookieID`)
        const json = await res.json()
        const nextId = typeof json.id === "number" ? json.id : null;

        setID(nextId)
    }

    async function getUserData() {
        const res = await fetch(`/api/getUserData`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: await id
            })
        })
        const json = await res.json()
        setUsername(json[0].username)
        setVocalGroup(json[0].vocal_group)
        setFullName(json[0].full_name)
        setPerms(json[0].perms)
    }

    async function updatePassword() {
        const res = await fetch(`/api/updatePassword`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: id,
                password: password
            })
        })
        alert("Passwort wurde erfolgreich geändert!")
    }

    function sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function handeLogout() {
        await fetch(`/api/logout`)
        window.location.reload()
    }


    return(
        <Dialog>
            <DialogTrigger render={<Button variant="outline" onClick={() => getUserData()}><Settings /></Button>} />
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>{fullName}</DialogTitle>
                    <DialogDescription>Benutzername: {username}</DialogDescription>
                    <DialogDescription>Stimmgruppe: {vocalGroup}</DialogDescription>
                </DialogHeader>
                <div className="flex gap-2 flex-col">
                    <Label htmlFor="passwort">Neues Passwort</Label>
                    <Input id="passwort" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <Button type="submit" onClick={updatePassword}><FaCheck />Bestätigen</Button>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={handeLogout}><IoLogOut />Ausloggen</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}