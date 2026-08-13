"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { adminLogin, type AdminLoginState } from "@/actions/admin";

const initialState: AdminLoginState = { status: "idle" };

export function AdminLoginForm() {
  const [state, formAction, isPending] = useActionState(adminLogin, initialState);

  return (
    <form action={formAction} className="w-full max-w-sm space-y-4">
      <div>
        <label htmlFor="password" className="mb-2 block text-sm font-medium text-forest/70">
          Heslo
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoFocus
          className="w-full rounded-xl border border-forest/15 bg-white px-4 py-3 text-forest focus:border-forest focus:outline-none"
        />
      </div>

      {state.status === "error" && state.message && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{state.message}</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-forest px-6 py-3.5 text-sm font-semibold text-cream disabled:opacity-60"
      >
        {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
        Přihlásit se
      </button>
    </form>
  );
}
