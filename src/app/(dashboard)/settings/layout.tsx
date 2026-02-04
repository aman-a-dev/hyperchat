import FadeUp from "@/animation/fade-up";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <FadeUp>
      <div className="mt-20 h-screen">{children}</div>
      <div className="fixed bottom-3 right-3">
        <Link href="/settings">
          <Button
            variant="outline"
            className="backdrop-blur-lg flex gap-1 items-center"
          >
            <ArrowLeft />
            <span className="font-semibold">Back</span>
          </Button>
        </Link>
      </div>
    </FadeUp>
  );
}
