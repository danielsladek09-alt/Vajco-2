import Link from "next/link";
import { Logo } from "./Logo";
import { adminLogout } from "@/actions/admin";

export function AdminHeader() {
  return (
    <header className="border-b border-forest/10 bg-white/60">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <Link href="/admin" className="flex items-center gap-3">
          <Logo variant="mark" className="h-8 w-auto" />
          <span className="font-display text-lg text-forest">Administrace</span>
        </Link>
        <form action={adminLogout}>
          <button
            type="submit"
            className="text-sm font-medium text-forest/60 transition-colors hover:text-forest"
          >
            Odhlásit se
          </button>
        </form>
      </div>
    </header>
  );
}
