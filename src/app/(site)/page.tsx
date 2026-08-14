import { Hero } from "@/components/Hero";
import { WhyVajco } from "@/components/WhyVajco";
import { Products } from "@/components/Products";
import { ReservationSection } from "@/components/ReservationSection";
import { PickupSection } from "@/components/PickupSection";
import { FarmSection } from "@/components/FarmSection";
import { AboutFounders } from "@/components/AboutFounders";
import { FinalCta } from "@/components/FinalCta";
import { OrganizationJsonLd } from "@/components/OrganizationJsonLd";

// ReservationSection reads live slot availability straight from the
// database (via a plain Prisma query), which Next's static-analysis
// heuristics don't detect as "dynamic" — without this, the homepage
// would get prerendered once at build time and every visitor would see
// the exact same (stale) availability until the next deploy.
export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <>
      <OrganizationJsonLd />
      <Hero />
      <WhyVajco />
      <Products />
      <ReservationSection />
      <PickupSection />
      <FarmSection />
      <AboutFounders />
      <FinalCta />
    </>
  );
}
