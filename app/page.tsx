import LoginCard from "@/components/LoginPage/LoginCard"
import MainDates from "@/components/MainPage/MainDates";
import { checkAuth } from "@/lib/auth/checkAuth";

export default async function Page() {

  const auth = await checkAuth();
  if (auth) {
    return (
      <>
        <MainDates />
      </>
    )
  }

  return (
    <>
      <div className="flex min-h-screen items-center justify-center">
        <LoginCard />
      </div>
    </>
  )
}
