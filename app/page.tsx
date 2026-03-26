import LoginCard from "@/components/LoginPage/LoginCard"
import MainDates from "@/components/MainPage/MainDates";

import { cookies } from "next/headers"

export default async function Page() {

  const cookieStore = await cookies();
  const authToken = cookieStore.get('auth_token')
  if (authToken){
    if(authToken.value === process.env.SECRET_TOKEN) {
      return (
        <>
          <MainDates />
        </>
      )
    } else {
      return (
        <>
          <div className="flex min-h-screen items-center justify-center">
            <LoginCard />
          </div>
        </>
      )
    }
  } else {
    return (
        <>
          <div className="flex min-h-screen items-center justify-center">
            <LoginCard />
          </div>
        </>
      )
  }

}
