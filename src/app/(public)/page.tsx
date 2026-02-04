import Hero from "@/components/layout/home/hero";
import ShowCase from "@/components/layout/home/show-case";
import LogoCloud from "@/components/layout/home/logo-cloud";
import QuickStart from "@/components/layout/home/quick-start";
import FAQ from "@/components/layout/home/faq";
import CTA from "@/components/layout/home/cta";
import { LiquidCursor } from "@/components/ui/liquid-cursor";

export default function HomePage() {
  return (
    <main>
      <LiquidCursor />
      <Hero />
      <LogoCloud />
      <ShowCase />
      <QuickStart />
      <FAQ />
      <CTA />
    </main>
  );
}
