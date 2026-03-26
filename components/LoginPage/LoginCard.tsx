"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginCard() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch(`/api/checkLogin`, {
      method: "POST",
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify({ username: username, password: password})
    })


    if(res.ok) {
      router.push('/'); // Hier zur gewünschten Seite weiterleiten
    } else {
      alert("Benutzername oder Passwort ist falsch!")
    }
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Intranet</CardTitle>
        <CardDescription>
          Logge dich ein, um ins Intranet zu gelangen.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="username">Benutzername</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="max_mustermann"
                  required
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Passwort</Label>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  required
                  onChange={(e) => setPassword(e.target.value)} />
              </div>
            </div>
        </CardContent>
        <CardFooter className="flex-col gap-2 mt-6">
          <Button type="submit" className="w-full">
            Login
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
