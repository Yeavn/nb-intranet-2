import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const supabase = await createClient()
    const body = await req.json()
    const { DateId, UserId, status} = body
    const { data, error } = await supabase.from("dates").select("members").eq("id", DateId)
    const members = data && data.length > 0 ? data[0].members : [];
    console.log(data)
    for(let i = 0; i < members.length; i++ ){
        if(members[i].id === UserId) {
            members[i].status = status
            await supabase.from("dates").update({members: members}).eq("id", DateId)
            return NextResponse.json(members, {status: 200})
        }
    }

    const { data: user, error: userError } = await supabase.from("users").select().eq("id", UserId)
    console.log(user)
    let userData = null;
    if (user && Array.isArray(user) && user.length > 0) {
        userData = user[0];
    }
    members.push({ id: userData.id, name: userData.full_name, status: status, vocal_group: userData.vocal_group})
    console.log(members)
    await supabase.from("dates").update({members: members}).eq("id", DateId)
    return NextResponse.json(members, {status: 200})

    
}