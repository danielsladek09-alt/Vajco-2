import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE_NAME, isValidSessionToken } from "@/lib/admin-auth";
import { AdminHeader } from "@/components/AdminHeader";

export default async function AdminDashboardLayout({ children }: LayoutProps<"/admin">) {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

  if (!isValidSessionToken(token)) {
    redirect("/admin/login");
  }

  return (
    <div>
      <AdminHeader />
      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8">{children}</main>
    </div>
  );
}
