import About from "@/components/layout/pages/about";
import type { Metadata } from "next";

export default function AboutPage() {
  return (
    <div>
      <About />
    </div>
  );
}

export const aboutMetadata: Metadata = {
  title: "About HyperChat | Our Mission to Revolutionize Communication",
  description:
    "Meet the team behind HyperChat and learn about our mission to transform digital communication with AI-powered realtime chat technology.",
  keywords: [
    "about HyperChat",
    "company story",
    "mission vision",
    "our team",
    "chat platform history",
    "AI communication company",
    "who we are",
    "company values",
    "leadership team",
    "HyperChat founders",
  ].join(", "),

  alternates: {
    canonical: "https://hyperchatai.vercel.app/about",
  },

  other: {
    "article:section": "Company",
    "og:type": "profile",
    "profile:username": "HyperChat",
    "profile:first_name": "HyperChat",
    "profile:last_name": "Team",
  },
};
