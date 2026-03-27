"use client"

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"

import { Button } from "@/components/ui/button"
import { Menu, Settings } from "lucide-react"
import { useEffect, useState } from "react"
import { FaCamera } from "react-icons/fa6"
import SettingDialog from "./SettingDialog"
import PhotoDialog from "./PhotoDialog"

type NavbarProps = {
    onSelect: (value: string) => void
}

export default function NavHeader({onSelect}: NavbarProps) {

    const [data, setData] = useState<any[]>([])
    const [perms, setPerms] = useState(Boolean)

    useEffect(() => {
        const fetchProjects = async () => {
            const response = await fetch(`/api/getProjects`, {
                method: "GET",
                headers: { "Content-Type": "application/json"},
            })
            const projectData = await response.json()

            setData(projectData)
        }
        fetchProjects()
        getPerms()
    }, [])

    async function getPerms() {
        const res = await fetch(`/api/getPerms`)
        const json = await res.json()
        if(json.data[0].permissions.fotoerlaubnis) {
            setPerms(true)
        }
    }

  return (
    <nav className="w-full border-b px-4 py-2 flex items-center justify-between">
      
      <div className="flex items-center justify-between gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger>
              <Menu className="w-5 h-5" />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start" className="w-40">
            {Array.isArray(data) && data.map((proj) => (
              <DropdownMenuItem 
                  key={proj.id}
                  onClick={() => onSelect(proj.name)}
              >
                  {proj.full_name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        {perms ? <PhotoDialog /> : ""}
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => console.log("Settings clicked")}
      >
        <SettingDialog />
      </Button>
    </nav>
  )
}