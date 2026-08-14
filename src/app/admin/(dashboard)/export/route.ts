import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ADMIN_COOKIE_NAME, isValidSessionToken } from "@/lib/admin-auth";
import { STATUS_LABELS } from "@/lib/reservation-status";

// Route handlery nejsou obalené layoutem (na rozdíl od stránek), takže
// admin session se tu musí ověřit znovu, ne spoléhat na
// `admin/(dashboard)/layout.tsx`.
async function isAuthorized() {
  const cookieStore = await cookies();
  return isValidSessionToken(cookieStore.get(ADMIN_COOKIE_NAME)?.value);
}

function csvEscape(value: string | number) {
  const str = String(value);
  if (/[",\n]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
  return str;
}

export async function GET(request: NextRequest) {
  if (!(await isAuthorized())) {
    return NextResponse.json({ error: "Neautorizováno." }, { status: 401 });
  }

  const date = request.nextUrl.searchParams.get("date");
  const isValidDate = date ? /^\d{4}-\d{2}-\d{2}$/.test(date) : false;

  const reservations = await prisma.reservation.findMany({
    where: isValidDate ? { pickupDate: date! } : undefined,
    orderBy: [{ pickupDate: "asc" }, { pickupTime: "asc" }],
  });

  const header = [
    "jméno",
    "telefon",
    "e-mail",
    "produkt",
    "kartonů",
    "vajec",
    "datum",
    "čas",
    "stav",
    "poznámka",
    "vytvořeno",
  ];

  const rows = reservations.map((r) =>
    [
      r.name,
      r.phone,
      r.email,
      r.product,
      r.cartonCount,
      r.eggCount,
      r.pickupDate,
      r.pickupTime,
      STATUS_LABELS[r.status],
      r.note ?? "",
      r.createdAt.toISOString(),
    ]
      .map(csvEscape)
      .join(","),
  );

  // BOM na začátku, ať Excel v CS Windows správně pozná UTF-8 (diakritika).
  const BOM = "﻿";
  const csv = [BOM + header.join(","), ...rows].join("\n");
  const filename = `vajco-rezervace${isValidDate ? `-${date}` : ""}.csv`;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
