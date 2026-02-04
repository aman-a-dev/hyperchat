import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import StripesBackground from "@/components/ui/stripes-background";

export default function AuthPagesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative">
      <StripesBackground />
      <span className="from-primary/20 fixed inset-x-0 top-0 left-0 -z-10 h-1/3 w-full bg-gradient-to-b" />
      <Link href="/" className="flex p-3">
        <ArrowLeft />
        <span>Home</span>
      </Link>
      {children}
    </div>
  );
}
