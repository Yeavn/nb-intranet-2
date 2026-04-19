"use client"

import { useEffect, useState, useCallback } from "react";
import NavHeader from "./comps/Nav-Header";
import { Suspense } from "react";
import DateCard from "./comps/DataCard";
import CreateDialog from "./comps/CreateDialog";
import moment from "moment";

export default function MainDates() {
    const [title, setTitle] = useState<string>("")
    const [topic, setTopic] = useState<string>("")
    const [dates, setDates] = useState<any[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [project, setProject] = useState("")
    const [deadline, setDeadline] = useState<Date>(new Date)

    const [perms, setPerms] = useState(Boolean)

    const setProjectFunc = useCallback(async (proj: string) => {
        setLoading(true)
        setTitle("")
        setTopic("")
        setDates([])
        const response = await fetch(`/api/getProjects`, {
            method: "GET",
            headers: { "Content-Type": "application/json"},
        })
        if(response) {
            const data = await response.json();
            for(let i = 0; i < data.length ; i++) {
                if(data[i].name === proj) {
                    setTitle(data[i].full_name)
                    setTopic(data[i].topic)
                    setDeadline(data[i].deadline)
                    const res = await fetch(`/api/getDates`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json"},
                        body: JSON.stringify({ project: data[i].name})
                    })
                    setDates(await res.json())
                    setProject(proj)
                }
            }
        }
        setLoading(false)
    }, [])

    async function getPerms() {
        const res = await fetch(`/api/getPerms`)
        const json = await res.json()
        if(json.data[0].permissions.terminplanung) {
            setPerms(true)
        }
    }

    useEffect(() => {
        setProjectFunc("2027_proj1")
        getPerms()
    }, [setProjectFunc])

    return(
        <div>
            <NavHeader onSelect={setProjectFunc} />
            <Suspense fallback={<div>Lade Daten...</div>}>
                <div className="w-full min-h-screen p-4">
                    <h1 className="font-bold text-xl">{title}</h1>
                    <h2 className="text-md mb-6">{topic}</h2>
                    <h2 className="text-md font-bold mb-6 text-red-400">Deadline: {deadline != null ? moment(deadline).format("DD.MM.YYYY") : "akutell keine Deadline"}</h2>
                    {perms ? <CreateDialog project={project} /> : ""}
                    <div className="mt-12 w-full flex flex-col gap-8">
                        {loading ? (
                            <div>Lade Daten...</div>
                        ) : (
                            dates && Array.isArray(dates) && dates.map((date, idx) => (
                                <DateCard
                                    key={idx}
                                    DateId = {date.id}
                                    date={new Date(date.date)}
                                    deadline={deadline}
                                    project={date.project}
                                    location={date.location}
                                    start_time={date.start_time}
                                    end_time={date.end_time}
                                    category={date.category}
                                    singers={date.members}
                                    informations={date.informations}
                                />
                            ))
                        )}
                    </div>
                </div>
            </Suspense>
        </div>
    )
}