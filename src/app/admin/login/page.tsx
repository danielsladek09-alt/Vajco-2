import { Logo } from "@/components/Logo";
import { AdminLoginForm } from "@/components/AdminLoginForm";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-5">
      <Logo variant="full" />
      <div className="w-full max-w-sm rounded-[2rem] border border-forest/10 bg-white/70 p-8">
        <h1 className="font-display mb-6 text-center text-2xl text-forest">Administrace</h1>
        <AdminLoginForm />
      </div>
    </div>
  );
}
