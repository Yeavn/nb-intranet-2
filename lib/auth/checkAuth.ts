import { getSessionUserId } from "./session";

export async function checkAuth() {
    const id = await getSessionUserId()
    return id !== null
}
