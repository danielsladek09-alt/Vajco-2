import { NextRequest, NextResponse } from "next/server";
import { getAvailableSlotsForDate } from "@/lib/slots";

/**
 * GET /api/availability?date=YYYY-MM-DD
 * Vrací dostupné časové sloty pro daný den (počítáno live z DB + configu).
 */
export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get("date");

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "Neplatné datum." }, { status: 400 });
  }

  const slots = await getAvailableSlotsForDate(date);
  return NextResponse.json({ date, slots });
}
