import Pricing from "@/components/layout/pages/pricing";
import type { Metadata } from "next";

export default function PricingPage() {
  return (
    <div>
      <Pricing />
    </div>
  );
}
export const pricingMetadata: Metadata = {
  title: "HyperChat Pricing | Compare Plans & Features",
  description:
    "Choose the right HyperChat plan for your needs. Compare free, pro, business, and enterprise plans with transparent pricing and features.",
  keywords: [
    "HyperChat pricing",
    "chat platform pricing",
    "subscription plans",
    "free trial",
    "enterprise pricing",
    "team plans",
    "pricing comparison",
    "monthly cost",
    "yearly subscription",
    "pricing tiers",
  ].join(", "),

  alternates: {
    canonical: "https://hyperchatai.vercel.app/pricing",
  },

  other: {
    "product:price:amount": "0, 12, 29, 99",
    "product:price:currency": "USD",
    "product:availability": "in stock",
    "product:condition": "new",
    "product:category": "Software as a Service",
    "offer:price_valid_until": "2024-12-31",
  },
};
