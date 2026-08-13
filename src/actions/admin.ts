"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  ADMIN_COOKIE_NAME,
  ADMIN_SESSION_MAX_AGE_SECONDS,
  createSessionToken,
} from "@/lib/admin-auth";
import { isRateLimited } from "@/lib/rate-limit";
import type { ReservationStatus } from "@prisma/client";

export interface AdminLoginState {
  status: "idle" | "error";
  message?: string;
}

export async function adminLogin(
  _prevState: AdminLoginState,
  formData: FormData,
): Promise<AdminLoginState> {
  const headerList = await headers();
  const ip =
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headerList.get("x-real-ip") ||
    "unknown";

  if (isRateLimited(`admin-login:${ip}`)) {
    return { status: "error", message: "Příliš mnoho pokusů. Zkus to prosím za pár minut." };
  }

  const password = formData.get("password")?.toString() ?? "";
  const expected = process.env.ADMIN_PASSWORD;

  if (!expected) {
    return {
      status: "error",
      message: "Administrace není nastavená (chybí ADMIN_PASSWORD v .env).",
    };
  }

  if (password !== expected) {
    return { status: "error", message: "Špatné heslo." };
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
  });

  redirect("/admin");
}

export async function adminLogout() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
  redirect("/admin/login");
}

export async function updateReservationStatus(id: string, status: ReservationStatus) {
  await prisma.reservation.update({
    where: { id },
    data: { status },
  });
}
