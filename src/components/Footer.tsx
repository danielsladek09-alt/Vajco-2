import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { Logo } from "./Logo";
import { nav, contact } from "@/config/site";

export function Footer() {
  return (
    <footer className="bg-ink text-cream/70">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <Logo variant="full" tone="cream" className="h-8 w-auto" />
            <p className="mt-4 max-w-xs text-sm">Čerstvá vejce. Velký sen.</p>
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-cream/40">
              Web
            </p>
            <ul className="space-y-2 text-sm">
              {nav.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="transition-colors hover:text-cream">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-cream/40">
              Informace
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/ochrana-osobnich-udaju" className="transition-colors hover:text-cream">
                  Ochrana osobních údajů
                </Link>
              </li>
              <li>
                <Link href="/obchodni-podminky" className="transition-colors hover:text-cream">
                  Obchodní podmínky
                </Link>
              </li>
            </ul>

            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
              {contact.email && (
                <a
                  href={`mailto:${contact.email}`}
                  className="inline-flex items-center gap-1.5 transition-colors hover:text-cream"
                >
                  <Mail className="h-4 w-4" />
                  {contact.email}
                </a>
              )}
              {contact.phone && (
                <a
                  href={`tel:${contact.phone}`}
                  className="inline-flex items-center gap-1.5 transition-colors hover:text-cream"
                >
                  <Phone className="h-4 w-4" />
                  {contact.phone}
                </a>
              )}
              {contact.instagram && (
                <a href={contact.instagram} target="_blank" rel="noreferrer" className="transition-colors hover:text-cream">
                  Instagram
                </a>
              )}
              {contact.facebook && (
                <a href={contact.facebook} target="_blank" rel="noreferrer" className="transition-colors hover:text-cream">
                  Facebook
                </a>
              )}
              {!contact.email && !contact.phone && !contact.instagram && !contact.facebook && (
                <p className="text-xs text-cream/35">Kontakty brzy doplníme.</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-cream/10 pt-6 text-xs text-cream/35">
          © {new Date().getFullYear()} VAJCO. Všechna vejce vyhrazena.
        </div>
      </div>
    </footer>
  );
}
