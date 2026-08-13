"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { Minus, Plus, CheckCircle2, Loader2 } from "lucide-react";
import { createReservation, type ReservationActionState } from "@/actions/reservation";
import type { PickupDateOption, SlotOption } from "@/lib/slots";
import {
  products,
  formatPrice,
  getProductPrice,
  pickup,
  type ProductId,
} from "@/config/site";
import { reservationConfig } from "@/config/reservations";
import { cn } from "@/lib/utils";

const PRODUCT_ID_TO_ENUM: Record<ProductId, "CARTON_12" | "CARTON_30"> = {
  "carton-12": "CARTON_12",
  "carton-30": "CARTON_30",
};

const initialState: ReservationActionState = { status: "idle" };

export function ReservationForm({
  initialDateOptions,
}: {
  initialDateOptions: PickupDateOption[];
}) {
  const [state, formAction, isPending] = useActionState(createReservation, initialState);

  const [productId, setProductId] = useState<ProductId>("carton-12");
  const [cartonCount, setCartonCount] = useState(1);
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [slots, setSlots] = useState<SlotOption[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  // Umožní produktovým kartám výše na stránce přednastavit produkt.
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<ProductId>).detail;
      if (detail === "carton-12" || detail === "carton-30") setProductId(detail);
    };
    window.addEventListener("vajco:select-product", handler);
    return () => window.removeEventListener("vajco:select-product", handler);
  }, []);

  useEffect(() => {
    if (!pickupDate) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect -- loading flag must flip the moment the fetch for the newly selected date starts
    setSlotsLoading(true);
    setPickupTime("");
    fetch(`/api/availability?date=${pickupDate}`)
      .then((res) => res.json())
      .then((data: { slots: SlotOption[] }) => setSlots(data.slots ?? []))
      .catch(() => setSlots([]))
      .finally(() => setSlotsLoading(false));
  }, [pickupDate]);

  const visibleSlots = pickupDate ? slots : [];

  const totalPrice = useMemo(
    () => getProductPrice(productId) * cartonCount,
    [productId, cartonCount],
  );

  if (state.status === "success" && state.summary) {
    const s = state.summary;
    return (
      <div className="mt-10 rounded-[2rem] border border-forest/10 bg-white/70 p-8 text-center sm:p-12">
        <CheckCircle2 className="mx-auto h-12 w-12 text-forest" strokeWidth={1.5} />
        <h3 className="font-display mt-4 text-2xl text-forest sm:text-3xl">
          Hotovo! Vejce na tebe počítáme. 🥚
        </h3>
        <dl className="mx-auto mt-8 grid max-w-sm gap-3 text-left text-sm">
          <Row label="Jméno" value={s.name} />
          <Row label="Rezervace" value={`${s.productLabel} × ${s.cartonCount}`} />
          <Row label="Počet vajec" value={`${s.eggCount} ks`} />
          <Row label="Cena" value={`${formatPrice(s.totalPrice)} (platba na místě)`} />
          <Row label="Datum" value={formatDateLabel(s.pickupDate)} />
          <Row label="Čas" value={s.pickupTime} />
          <Row label="Místo vyzvednutí" value={`${pickup.city} – ${pickup.district}`} />
        </dl>
        <p className="mx-auto mt-6 max-w-sm text-xs text-forest/50">{pickup.paymentNote}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="mt-10 space-y-10">
      {/* honeypot proti botům — pro lidi neviditelné */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
        aria-hidden="true"
      />

      <fieldset>
        <StepLabel n="01" label="Kolik vajec?" />
        <div className="grid gap-4 sm:grid-cols-2">
          {products.items.map((product) => (
            <label
              key={product.id}
              className={cn(
                "flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition-colors",
                productId === product.id
                  ? "border-forest bg-forest/5"
                  : "border-forest/15 bg-white/50 hover:border-forest/30",
              )}
            >
              <div>
                <p className="font-display text-lg text-forest">{product.shortLabel}</p>
                <p className="text-sm text-forest/60">
                  {formatPrice(getProductPrice(product.id))}
                </p>
              </div>
              <input
                type="radio"
                name="product"
                value={PRODUCT_ID_TO_ENUM[product.id]}
                checked={productId === product.id}
                onChange={() => setProductId(product.id)}
                className="h-5 w-5 accent-forest"
              />
            </label>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-4">
          <span className="text-sm font-medium text-forest/70">Počet kartonů</span>
          <div className="flex items-center gap-3 rounded-full border border-forest/15 px-2 py-1">
            <button
              type="button"
              onClick={() => setCartonCount((c) => Math.max(1, c - 1))}
              className="flex h-8 w-8 items-center justify-center rounded-full text-forest hover:bg-forest/5"
              aria-label="Ubrat karton"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-6 text-center font-semibold text-forest">{cartonCount}</span>
            <button
              type="button"
              onClick={() =>
                setCartonCount((c) => Math.min(reservationConfig.maxCartonsPerReservation, c + 1))
              }
              className="flex h-8 w-8 items-center justify-center rounded-full text-forest hover:bg-forest/5"
              aria-label="Přidat karton"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <input type="hidden" name="cartonCount" value={cartonCount} readOnly />
        </div>

        <p className="mt-4 text-sm font-medium text-forest/70">
          Celkem: <span className="text-forest">{formatPrice(totalPrice)}</span>{" "}
          <span className="font-normal text-forest/45">— platba proběhne až při převzetí</span>
        </p>
      </fieldset>

      <fieldset>
        <StepLabel n="02" label="Kdy přijedeš?" />
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-forest/70" htmlFor="pickupDate">
              Datum
            </label>
            <select
              id="pickupDate"
              name="pickupDate"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              required
              className="w-full rounded-xl border border-forest/15 bg-white/70 px-4 py-3 text-forest focus:border-forest focus:outline-none"
            >
              <option value="" disabled>
                Vyber datum
              </option>
              {initialDateOptions.map((d) => (
                <option key={d.date} value={d.date} disabled={!d.hasAvailability}>
                  {d.weekday} {d.dayLabel} {!d.hasAvailability ? "— obsazeno" : ""}
                </option>
              ))}
            </select>
            <FieldError message={state.fieldErrors?.pickupDate} />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-forest/70" htmlFor="pickupTime">
              Čas
            </label>
            <select
              id="pickupTime"
              name="pickupTime"
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
              required
              disabled={!pickupDate || slotsLoading}
              className="w-full rounded-xl border border-forest/15 bg-white/70 px-4 py-3 text-forest focus:border-forest focus:outline-none disabled:opacity-50"
            >
              <option value="" disabled>
                {slotsLoading ? "Načítám…" : "Vyber čas"}
              </option>
              {visibleSlots.map((slot) => (
                <option key={slot.time} value={slot.time} disabled={slot.isFull}>
                  {slot.time} {slot.isFull ? "— obsazeno" : ""}
                </option>
              ))}
            </select>
            <FieldError message={state.fieldErrors?.pickupTime} />
          </div>
        </div>
      </fieldset>

      <fieldset>
        <StepLabel n="03" label="Kam ti je máme připravit?" />
        <p className="mb-4 text-sm text-forest/60">
          Vyzvednutí: {pickup.city} – {pickup.district}. {pickup.addressNote}
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field name="name" label="Jméno a příjmení" error={state.fieldErrors?.name} />
          <Field name="phone" label="Telefon" type="tel" error={state.fieldErrors?.phone} />
          <Field
            name="email"
            label="E-mail"
            type="email"
            className="sm:col-span-2"
            error={state.fieldErrors?.email}
          />
          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm font-medium text-forest/70" htmlFor="note">
              Poznámka (nepovinné)
            </label>
            <textarea
              id="note"
              name="note"
              rows={3}
              className="w-full rounded-xl border border-forest/15 bg-white/70 px-4 py-3 text-forest focus:border-forest focus:outline-none"
            />
          </div>
        </div>

        <label className="mt-5 flex items-start gap-3 text-sm text-forest/70">
          <input
            type="checkbox"
            name="consent"
            required
            className="mt-1 h-4 w-4 accent-forest"
          />
          <span>Souhlasím se zpracováním osobních údajů za účelem vyřízení rezervace.</span>
        </label>
        <FieldError message={state.fieldErrors?.consent} />
      </fieldset>

      {state.status === "error" && state.message && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{state.message}</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-forest px-8 py-4 text-base font-semibold text-cream transition-transform hover:scale-[1.01] disabled:opacity-60 sm:w-auto"
      >
        {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
        Rezervovat vejce
      </button>
    </form>
  );
}

function StepLabel({ n, label }: { n: string; label: string }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <span className="font-display text-2xl text-brown">{n}</span>
      <h3 className="text-lg font-semibold text-forest">{label}</h3>
    </div>
  );
}

function Field({
  name,
  label,
  type = "text",
  className,
  error,
}: {
  name: string;
  label: string;
  type?: string;
  className?: string;
  error?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-2 block text-sm font-medium text-forest/70" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required
        className="w-full rounded-xl border border-forest/15 bg-white/70 px-4 py-3 text-forest focus:border-forest focus:outline-none"
      />
      <FieldError message={error} />
    </div>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-xs text-red-600">{message}</p>;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-forest/10 pb-2">
      <dt className="text-forest/50">{label}</dt>
      <dd className="font-medium text-forest">{value}</dd>
    </div>
  );
}

function formatDateLabel(dateStr: string) {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("cs-CZ", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}
