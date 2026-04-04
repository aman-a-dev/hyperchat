import Contact from "@/components/layout/pages/contact";
import type { Metadata } from "next";

export default function ContactPage() {
  return (
    <div>
      <Contact />
    </div>
  );
}

export const contactMetadata: Metadata = {
  title: "Contact HyperChat | Support, Sales & Partnership Inquiries",
  description:
    "Get in touch with HyperChat team. Contact us for customer support, partnership opportunities, sales questions, or general feedback.",
  keywords: [
    "contact HyperChat",
    "support chat platform",
    "customer service",
    "partnership inquiry",
    "sales contact",
    "feedback form",
    "help center",
    "contact support",
    "technical support",
    "business inquiries",
  ].join(", "),

  alternates: {
    canonical: "https://hyperchatai.vercel.app/contact",
  },

  other: {
    "business:contact_data:email": "support@hyperchat.app",
    "business:contact_data:phone_number": "+1-XXX-XXX-XXXX",
    "business:contact_data:website": "https://hyperchatai.vercel.app",
    "business:contact_data:contact_type": "customer support",
  },
};
