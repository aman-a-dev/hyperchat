import type { Metadata } from "next";

import Link from "next/link";
import Footer from "@/components/layout/home/footer";
import Nav from "@/components/layout/home/nav";
import { Button } from "@/components/ui/button";
import { Bitshow } from "@/components/font/font";

export const metadata: Metadata = {
  title: "Not Found",
  description: "The page you are looking for does not exist.",
};

export default function GlobalNotFound() {
  return (
    <>
      <Nav />
      <div className="flex flex-col items-center justify-center h-screen gap-2">
        <h1 className={`${Bitshow.className} text-8xl md:text-9xl`}>404</h1>
        <p>This page does not exist.</p>
        <Link href="/">
          <Button>Back to home</Button>
        </Link>
      </div>
      <Footer />
    </>
  );
}
