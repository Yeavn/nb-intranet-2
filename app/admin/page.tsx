import AdminPanel from "@/components/AdminPage/AdminPanel";
import { checkAdmin } from "@/lib/auth/checkAdmin";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Admin Panel | Intranet",
}

export default async function AdminPage() {
  const adminId = await checkAdmin();

  if (!adminId) {
    redirect("/")
  }

  return <AdminPanel currentUserId={adminId} />
}
