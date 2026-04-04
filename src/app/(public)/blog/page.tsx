import type { Metadata } from "next";

export default function BlogPage() {
  return (
    <div className="flex justify-center items-center h-screen">
      <h1 className="font-black text-4xl md:-text-5xl">No Blog Yet</h1>
    </div>
  );
}

export const blogMetadata: Metadata = {
  title: "HyperChat Blog | AI Chat Insights, Tips & Updates",
  description:
    "Latest articles on AI communication, messaging trends, product updates, and best practices for using HyperChat effectively.",
  keywords: [
    "chat platform blog",
    "AI communication articles",
    "messaging updates",
    "chat tips",
    "product announcements",
    "communication trends",
    "tech blog",
    "AI chat insights",
    "messaging best practices",
    "industry news",
  ].join(", "),

  alternates: {
    canonical: "https://hyperchatai.vercel.app/blog",
  },

  other: {
    "article:section": "Technology",
    "article:tag": "AI, Communication, Chat, Technology, Updates, Blog",
    "og:updated_time": new Date().toISOString(),
  },
};
