import { Hero } from "@/components/Hero";
import { WhyVajco } from "@/components/WhyVajco";
import { Products } from "@/components/Products";
import { ReservationSection } from "@/components/ReservationSection";
import { PickupSection } from "@/components/PickupSection";
import { FarmSection } from "@/components/FarmSection";
import { AboutFounders } from "@/components/AboutFounders";
import { FinalCta } from "@/components/FinalCta";
import { OrganizationJsonLd } from "@/components/OrganizationJsonLd";

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
