import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/providers";
import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={true}
        >
          <Toaster closeButton />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  metadataBase: new URL("https://hyper-chat.vercel.app"),
  title: "HyperChat | AI-Powered Realtime Chat Platform",
  description:
    "Experience next-generation communication with HyperChat - an AI-enhanced realtime chat platform featuring smart replies, voice commands, and seamless collaboration.",
  keywords: [
    // Primary keywords (focus on user intent)
    "AI chat platform",
    "realtime chat app",
    "AI-powered messaging",
    "smart chat application",
    "collaborative chat platform",
    "intelligent messaging",
    "chat with AI assistant",
    "team communication tool",

    // Core features and capabilities
    "real-time messaging",
    "AI message suggestions",
    "voice-to-text chat",
    "smart reply suggestions",
    "chat automation",
    "conversation summarization",
    "sentiment analysis chat",
    "context-aware messaging",

    // Use case keywords
    "team collaboration chat",
    "customer support chat AI",
    "community chat platform",
    "educational chat platform",
    "professional messaging tool",
    "enterprise chat solution",

    // Technical keywords
    "WebSocket chat application",
    "real-time communication API",
    "AI chat integration",
    "cloud messaging platform",
    "encrypted chat application",
    "scalable chat infrastructure",

    // User experience keywords
    "seamless chat interface",
    "intuitive messaging design",
    "modern chat UI/UX",
    "responsive chat application",
    "cross-platform messaging",
    "mobile-first chat app",

    // AI and ML keywords
    "natural language processing chat",
    "machine learning messaging",
    "conversational AI platform",
    "predictive text chat",
    "contextual chat assistant",
    "language translation chat",

    // Security and privacy
    "secure chat platform",
    "end-to-end encryption chat",
    "GDPR compliant messaging",
    "enterprise-grade security",
    "private messaging solution",

    // Integration keywords
    "chat API integration",
    "third-party app integration",
    "webhook support chat",
    "custom chatbot integration",
    "notification system chat",

    // Target audience keywords
    "business communication tool",
    "startup chat platform",
    "developer chat API",
    "remote team collaboration",
    "community management chat",

    // Competitor comparison keywords
    "Slack alternative AI",
    "Discord alternative professional",
    "Teams alternative open source",
    "WhatsApp Web alternative",
    "Telegram alternative web",

    // Modern chat features
    "realtime typing indicators",
    "message reactions",
    "file sharing chat",
    "video chat integration",
    "screen sharing chat",
    "chat rooms and channels",

    // Development keywords
    "open source chat platform",
    "chat application template",
    "chat SDK documentation",
    "chat component library",
    "chat UI components",

    // Brand and positioning
    "HyperChat platform",
    "HyperChat features",
    "HyperChat pricing",
    "HyperChat demo",
    "HyperChat API",
  ].join(", "),

  authors: [{ name: "Amanuel Anteneh", url: "https://github.com/aman-a-dev" }],
  creator: "Amanuel Anteneh",
  publisher: "HyperChat",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  icons: {
    icon: "/icon/favicon.png",
    shortcut: "/icon/favicon.png",
    apple: "/icon/favicon.png",
    other: {
      rel: "icon",
      url: "/icon/favicon.png",
    },
  },

  manifest: "/site.webmanifest",

  openGraph: {
    title: "HyperChat - AI-Powered Realtime Chat Platform",
    description:
      "Transform your communication with HyperChat. AI-enhanced realtime messaging platform with smart features for teams and communities.",
    url: "https://hyper-chat.vercel.app",
    siteName: "HyperChat",
    type: "website",
    images: [
      {
        url: "/og-banner.png",
        width: 1200,
        height: 630,
        alt: "HyperChat - AI-Powered Realtime Chat Platform",
      },
    ],
    locale: "en_US",
  },

  twitter: {
    card: "summary_large_image",
    title: "HyperChat - AI-Powered Realtime Chat Platform",
    description:
      "Next-generation chat platform with AI intelligence. Real-time messaging, smart replies, and seamless collaboration.",
    images: ["/og-banner.png"],
    creator: "@hyperchat",
    site: "@hyperchat",
  },

  alternates: {
    canonical: "https://hyper-chat.vercel.app",
  },

  classification:
    "Communication Platform, AI Chat Application, Real-time Messaging",

  category: [
    "Communication Tools",
    "AI Applications",
    "Real-time Messaging",
    "Collaboration Software",
    "Team Communication",
    "Chat Applications",
    "AI Assistants",
    "Productivity Tools",
    "Cloud Communication",
    "SaaS Platforms",
    "Web Applications",
    "Mobile Applications",
    "Enterprise Software",
    "Developer Tools",
    "API Services",
  ].join(", "),

  applicationName: "HyperChat",

  other: {
    "application-name": "HyperChat",
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "HyperChat",
    "msapplication-TileColor": "#0066FF",
    "theme-color": "#0066FF",
    "msapplication-TileImage": "/icon/favicon.png",

    // Brand colors and styling
    "background-color": "#ffffff",
    display: "standalone",
    orientation: "portrait-primary",

    // AI and technology focus
    keywords: "AI, machine learning, realtime, chat, messaging, communication",
    subject: "AI-powered communication platform",
    language: "English",

    // Contact and support
    contact: "support@hyperchat.app",
    "reply-to": "hello@hyperchat.app",

    // Social media profiles
    "twitter:site": "@hyperchat",
    "twitter:creator": "@hyperchat",
    "fb:app_id": "YOUR_FACEBOOK_APP_ID",

    // Rich snippets for business
    "business:contact_data:street_address": "Virtual Platform",
    "business:contact_data:locality": "Global",
    "business:contact_data:postal_code": "00000",
    "business:contact_data:country_name": "Worldwide",

    // Performance and PWA
    preload: "true",
    prerender: "true",

    // Security headers
    "content-security-policy": "default-src 'self'",
    "x-ua-compatible": "IE=edge,chrome=1",

    // Legal and compliance
    copyright: `© ${new Date().getFullYear()} HyperChat. All rights reserved.`,
    "revisit-after": "7 days",
    distribution: "global",
    rating: "general",
    referrer: "origin-when-cross-origin",
  },
};
