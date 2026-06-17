import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogHeader, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Settings } from "lucide-react"
import { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item";
import { stringify } from "node:querystring";
import { IoMdClose } from "react-icons/io";

export default function SettingDialog() {

    const [id, setID] = useState<number | null>(null);
    const [username, setUsername] = useState("")
    const [vocalGroup, setVocalGroup] = useState("")
    const [fullName, setFullName] = useState("")
    const [perms, setPerms] = useState(JSON)
    const [photos, setPhotos] = useState(Boolean)

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
        setPhotos(json[0].photos)
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

    async function updatePhotos(status: boolean) {
        const res = await fetch(`/api/updatePhotos`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: id,
                status: status
            })
        })
        setPhotos(status)
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
                <div>
                    <Item variant="outline">
                        <ItemContent>
                            <ItemTitle>Fotoerlaubnis</ItemTitle>
                            <p>Für unsere Instagram-Seite benötigen wir deine Erlaubnis Fotos/Videos von dir zu machen und zu veröffentlichen.</p>
                            <p className="mt-6">Aktueller Status: {photos ? "Zugelassen" : "Abgelehnt"}</p>
                        </ItemContent>
                        <ItemActions>
                            <div className="flex gap-2">
                                <Button variant="secondary" onClick={() => updatePhotos(true)}><FaCheck /></Button>
                                <Button variant="secondary" onClick={() => updatePhotos(false)}><IoMdClose /></Button>
                            </div>
                        </ItemActions>
                    </Item>
                </div>
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